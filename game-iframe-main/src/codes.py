# 🧬 J.A.R.V.I.S. - Error & Alert Codes
# Padronização de bloqueadores e diagnósticos

class CodeSeverity:
    CRITICAL = "CRITICAL"
    WARNING = "WARNING"
    INFO = "INFO"

class AlertLevel:
    RED = "RED_BLOCKING"
    YELLOW = "YELLOW_DEGRADED"
    BLUE = "BLUE_INFO"

class Codes:
    # Sistema
    SISTEMA_INICIALIZADO = "INFO_SYSTEM_INIT"
    SISTEMA_ENCERRADO = "INFO_SYSTEM_SHUTDOWN"

    # Bloqueios Críticos (Entrada impossível) — RED ALERT
    BANCA_COM_DIVERGENCIA_DE_DADOS = "CRIT_BANK_DIV"
    ENTRADAS_PADROES_COM_DIVERGENCIA = "CRIT_PATTERN_DIV"
    STAKE_RENDERIZADA_DIFERENTE = "CRIT_STAKE_UI_MISMATCH"
    JANELA_ENTRADA_EXPIRADA = "CRIT_WINDOW_EXPIRED"
    SALDO_INSUFICIENTE = "CRIT_NO_CASH"
    UI_DESYNC = "CRIT_UI_DESYNC"
    STOP_LOSS_ALCANCADO = "CRIT_STOP_LOSS"
    RODADA_ALVO_INVALIDA = "CRIT_ROUND_INVALID"
    SEM_CONFIANCA_VISUAL_MINIMA = "CRIT_VISUAL_CONFIDENCE_INSUFFICIENT"
    APOSTA_PENDENTE_NAO_RECONCILIADA = "CRIT_PENDING_BET_UNRECONCILED"
    RESULTADO_RODADA_NAO_CONFIRMADO = "CRIT_ROUND_RESULT_UNCONFIRMED"
    EXECUTOR_SEM_CONFIRMACAO_PRE_CLICK = "CRIT_EXEC_NO_PRECHECK"
    EXECUTOR_SEM_CONFIRMACAO_POS_CLICK = "CRIT_EXEC_NO_POSTCHECK"

    # Alertas Operacionais (Aviso/Calibragem) — YELLOW ALERT
    CONFIANCA_VISUAL_REDUZIDA = "WARN_CONFIDENCE_REDUCED"
    DESSINCRONIA_VISUAL_WEBSOCKET = "WARN_VISUAL_WS_DESYNC"
    DESSINCRONIA_VISUAL_DOM = "WARN_VISUAL_DOM_DESYNC"
    CALIBRAGEM_ROI_SUGERIDA = "WARN_ROI_ADJUST"
    DIVERGENCIA_SALDO_TOLERAVEL = "WARN_BANK_SMALL_DIV"
    VARIACAO_ANORMAL_LATENCIA = "WARN_LATENCY_SPIKE"
    DRIFT_TIMING_JANELA = "WARN_WINDOW_TIMING_DRIFT"
    PATTERN_ENGINE_SEM_SINAL = "WARN_NO_PATTERN_SIGNAL"
    PREDITIVO_ABAIXO_THRESHOLD = "WARN_PREDICTIVE_LOW_SCORE"
    MODO_DEBUG_ATIVO = "WARN_DEBUG_ENABLED"

    # Informativos (Logs) — BLUE INFO
    SNAPSHOT_CAPTURADO = "INFO_SNAPSHOT_CAPTURED"
    DECISO_EMITIDA = "INFO_DECISION_EMITTED"
    EXECUCAO_AUTORIZADA = "INFO_EXECUTION_AUTHORIZED"
    EXECUCAO_BLOQUEADA = "INFO_EXECUTION_BLOCKED"
    ROUND_ABERTO = "INFO_ROUND_OPEN"
    ROUND_FECHADO = "INFO_ROUND_CLOSED"
    RESULTADO_CONFIRMADO = "INFO_RESULT_CONFIRMED"
    RECONCILIACAO_OK = "INFO_RECONCILIATION_OK"

    @staticmethod
    def get_severity(code):
        if code.startswith("CRIT_"):
            return CodeSeverity.CRITICAL
        elif code.startswith("WARN_"):
            return CodeSeverity.WARNING
        else:
            return CodeSeverity.INFO

    @staticmethod
    def get_alert_level(code):
        severity = Codes.get_severity(code)
        if severity == CodeSeverity.CRITICAL:
            return AlertLevel.RED
        elif severity == CodeSeverity.WARNING:
            return AlertLevel.YELLOW
        else:
            return AlertLevel.BLUE

def format_alert(code, message, technical="", severity=None):
    if severity is None:
        severity = Codes.get_severity(code)

    alert_level = Codes.get_alert_level(code)
    divider = "!" * 60

    return {
        "code": code,
        "severity": severity,
        "alert_level": alert_level,
        "message": message,
        "technical": technical,
        "formatted": f"\n{divider}\n[{alert_level}] {code}\n{message}\nTECH: {technical}\n{divider}\n"
    }
