# 🧬 J.A.R.V.I.S. - Dataset Recorder
# Registro imutável de cada rodada para replay e auditoria

import os
import json
from datetime import datetime
from pathlib import Path
from schemas import RoundRecord, RoundRecordEncoder
from codes import Codes, format_alert

class DatasetRecorder:
    def __init__(self, base_path="/Users/diego/dev/ruptur-cloud/game-iframe-main/dataset"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)

        # Estrutura: dataset/{session_id}/rounds.jsonl
        self.session_id = None
        self.session_path = None
        self.rounds_file = None

        self.debug = True

    def start_session(self, session_id: str):
        """Inicia nova sessão de gravação."""
        self.session_id = session_id
        self.session_path = self.base_path / session_id
        self.session_path.mkdir(parents=True, exist_ok=True)

        self.rounds_file = self.session_path / "rounds.jsonl"

        if self.debug:
            print(f"🧬 Dataset: Sessão {session_id} iniciada. Arquivo: {self.rounds_file}")

    def record_round(self, round_record: RoundRecord) -> bool:
        """Registra uma rodada completa em JSONL."""
        if not self.rounds_file:
            alert = format_alert(
                Codes.SISTEMA_ENCERRADO,
                "Nenhuma sessão ativa para gravar rodada.",
                f"round_id={round_record.round_id}"
            )
            print(alert["formatted"])
            return False

        try:
            # Serializar dataclass
            from dataclasses import asdict
            json_line = json.dumps(asdict(round_record), default=str)

            # Append ao arquivo JSONL
            with open(self.rounds_file, "a") as f:
                f.write(json_line + "\n")

            if self.debug:
                print(f"✓ Round {round_record.round_id} gravado ao dataset.")

            return True

        except Exception as e:
            alert = format_alert(
                "ERROR_DATASET_WRITE",
                f"Falha ao gravar round {round_record.round_id}",
                str(e)
            )
            print(alert["formatted"])
            return False

    def get_session_rounds(self, session_id: str = None) -> list:
        """Lê todos os rounds de uma sessão."""
        if session_id is None:
            session_id = self.session_id

        rounds_file = self.base_path / session_id / "rounds.jsonl"

        if not rounds_file.exists():
            if self.debug:
                print(f"[Recorder] Arquivo de rounds não encontrado: {rounds_file}")
            return []

        rounds = []
        try:
            with open(rounds_file, "r") as f:
                for line_num, line in enumerate(f, 1):
                    if line.strip():
                        try:
                            round_data = json.loads(line)
                            rounds.append(round_data)
                        except json.JSONDecodeError as je:
                            print(f"[Recorder] Erro ao parsear linha {line_num}: {je}")
            return rounds
        except Exception as e:
            print(f"[Recorder] Erro ao ler sessão {session_id}: {e}")
            return []

    def get_session_metadata(self) -> dict:
        """Metadados da sessão atual."""
        if not self.session_path:
            return {}

        return {
            "session_id": self.session_id,
            "session_path": str(self.session_path),
            "rounds_file": str(self.rounds_file),
            "file_exists": self.rounds_file.exists() if self.rounds_file else False,
            "file_size_kb": (self.rounds_file.stat().st_size / 1024) if self.rounds_file and self.rounds_file.exists() else 0,
        }


if __name__ == "__main__":
    # Teste simples
    recorder = DatasetRecorder()
    recorder.start_session("test-session-001")
    print(f"Metadados: {recorder.get_session_metadata()}")
