#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import subprocess
import threading
import sys

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/start':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"ok":true}')
            
            print('[SERVER] 🚀 Robot disparado')
            threading.Thread(target=self.run_robot, daemon=True).start()
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_GET(self):
        if self.path == '/status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":"OK"}')
        else:
            self.send_response(404)
            self.end_headers()
    
    def run_robot(self):
        subprocess.run(['python3', '/Users/diego/dev/ruptur-cloud/will_robot_hybrid.py'],
                      cwd='/Users/diego/dev/ruptur-cloud')
    
    def log_message(self, format, *args):
        pass

print('[SERVER] ✅ http://localhost:9999')
HTTPServer(('localhost', 9999), Handler).serve_forever()
