#!/usr/bin/env python3
"""Proxy Anthropic-compatible mínimo para usar xAI/Grok no Claude Code.

Motivo: Claude Code chama /v1/messages/count_tokens, endpoint que a xAI não
implementa. Este proxy responde esse endpoint localmente e encaminha /v1/messages
para https://api.x.ai, filtrando blocos de pensamento no streaming.
"""
from __future__ import annotations

import argparse
import json
import os
import ssl
import sys
import urllib.error
import urllib.request
from urllib.parse import urlparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

XAI_BASE_URL = os.environ.get("XAI_BASE_URL", "https://api.x.ai/v1").rstrip("/")
try:
    import certifi
    SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())
except Exception:
    SSL_CONTEXT = ssl.create_default_context()



def sanitize_request(obj: Any) -> Any:
    if isinstance(obj, dict):
        clean = {}
        for k, v in obj.items():
            # A xAI valida JSON Schema estritamente e rejeita required: null
            # gerado por alguns schemas de ferramentas do Claude Code.
            if k == "required" and v is None:
                clean[k] = []
                continue
            clean[k] = sanitize_request(v)
        if clean.get("type") == "object" and "properties" in clean and clean.get("required") is None:
            clean["required"] = []
        return clean
    if isinstance(obj, list):
        return [sanitize_request(v) for v in obj]
    return obj

def estimate_tokens(payload: Any) -> int:
    text = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    # Estimativa conservadora: ~4 caracteres por token, mínimo 1.
    return max(1, (len(text) + 3) // 4)


def strip_thinking_json(obj: Any) -> Any:
    if isinstance(obj, dict):
        if isinstance(obj.get("content"), list):
            obj = dict(obj)
            obj["content"] = [b for b in obj["content"] if not (isinstance(b, dict) and b.get("type") == "thinking")]
        return {k: strip_thinking_json(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [strip_thinking_json(v) for v in obj]
    return obj


class ProxyHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt: str, *args: Any) -> None:
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))

    def _read_json(self) -> tuple[bytes, Any]:
        length = int(self.headers.get("content-length", "0") or "0")
        raw = self.rfile.read(length) if length else b"{}"
        try:
            return raw, json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            return raw, {}

    def _send_json(self, status: int, obj: Any) -> None:
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path in ("/health", "/v1/health"):
            self._send_json(200, {"ok": True, "upstream": XAI_BASE_URL})
            return
        self._send_json(404, {"error": "not_found"})

    def do_POST(self) -> None:  # noqa: N802
        raw, payload = self._read_json()
        path = urlparse(self.path).path
        if path == "/v1/messages/count_tokens":
            self._send_json(200, {"input_tokens": estimate_tokens(payload)})
            return
        if path != "/v1/messages":
            self._send_json(404, {"error": "not_found", "path": self.path})
            return
        self._proxy_messages(raw, payload)

    def _proxy_messages(self, raw: bytes, payload: Any) -> None:
        url = f"{XAI_BASE_URL}/messages"
        headers = {
            "content-type": "application/json",
            "authorization": self.headers.get("authorization", ""),
        }
        api_key = os.environ.get("XAI_API_KEY")
        if api_key:
            headers["authorization"] = f"Bearer {api_key}"
        sanitized = sanitize_request(payload)
        outbound_text = json.dumps(sanitized, ensure_ascii=False)
        if "required\": null" in outbound_text:
            self.log_message("AVISO: ainda existe required null no payload sanitizado")
        self.log_message("encaminhando /messages stream=%s tools=%s bytes=%s", sanitized.get("stream"), len(sanitized.get("tools", []) or []), len(outbound_text))
        outbound = outbound_text.encode("utf-8")
        req = urllib.request.Request(url, data=outbound, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=600, context=SSL_CONTEXT) as resp:
                ctype = resp.headers.get("content-type", "")
                if payload.get("stream") or "text/event-stream" in ctype:
                    self._stream_filtered(resp)
                else:
                    body = resp.read()
                    try:
                        obj = strip_thinking_json(json.loads(body.decode("utf-8")))
                        self._send_json(resp.status, obj)
                    except Exception:
                        self.send_response(resp.status)
                        self.send_header("content-type", ctype or "application/octet-stream")
                        self.send_header("content-length", str(len(body)))
                        self.end_headers()
                        self.wfile.write(body)
        except urllib.error.HTTPError as e:
            body = e.read()
            self.log_message("upstream HTTP %s: %s", e.code, body[:500].decode("utf-8", errors="replace"))
            self.send_response(e.code)
            self.send_header("content-type", e.headers.get("content-type", "application/json"))
            self.send_header("content-length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:
            self.log_message("upstream_error: %s", str(e))
            self._send_json(502, {"error": "upstream_error", "message": str(e)})

    def _stream_filtered(self, resp: Any) -> None:
        self.send_response(resp.status)
        self.send_header("content-type", "text/event-stream")
        self.send_header("cache-control", "no-cache")
        self.send_header("connection", "keep-alive")
        self.end_headers()

        index_map: dict[int, int] = {}
        next_index = 0
        skipping: set[int] = set()

        def write_event(event: str | None, data_obj: Any) -> None:
            if event:
                self.wfile.write(f"event: {event}\n".encode())
            self.wfile.write(b"data: ")
            self.wfile.write(json.dumps(data_obj, ensure_ascii=False).encode())
            self.wfile.write(b"\n\n")
            self.wfile.flush()

        current_event: str | None = None
        for raw_line in resp:
            line = raw_line.decode("utf-8", errors="replace").rstrip("\n")
            if line.startswith("event: "):
                current_event = line[len("event: "):].strip()
                continue
            if not line.startswith("data: "):
                continue
            data = line[len("data: "):]
            if data.strip() == "[DONE]":
                self.wfile.write(b"data: [DONE]\n\n")
                self.wfile.flush()
                continue
            try:
                obj = json.loads(data)
            except json.JSONDecodeError:
                continue

            typ = obj.get("type")
            idx = obj.get("index")
            if typ == "content_block_start":
                block = obj.get("content_block", {})
                if block.get("type") == "thinking":
                    skipping.add(idx)
                    continue
                index_map[idx] = next_index
                obj["index"] = next_index
                next_index += 1
            elif typ in {"content_block_delta", "content_block_stop"}:
                if idx in skipping:
                    continue
                if idx in index_map:
                    obj["index"] = index_map[idx]
            elif typ == "message_start":
                obj = strip_thinking_json(obj)

            write_event(current_event, obj)
            current_event = None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default=os.environ.get("CLAUDEGROK_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("CLAUDEGROK_PORT", "4141")))
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), ProxyHandler)
    print(f"claudegrok proxy ouvindo em http://{args.host}:{args.port}/v1 -> {XAI_BASE_URL}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
