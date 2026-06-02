/**
 * Integrations — Configuração de provedores WhatsApp
 *
 * Seções:
 *  - UAZAPI Free Tier: status + botão "Testar conexão"
 *  - UAZAPI Servidor Dedicado (Pago): placeholder "Em breve"
 *  - Webhook Global: placeholder "Em breve"
 */
import { useState } from 'react';
import { Button, PageHeader } from '../../ds/index.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

// ---------------------------------------------------------------------------
// CSS inline — padrão do projeto (escopo via classes únicas)
// ---------------------------------------------------------------------------
const STYLES = `
  .int-grid { display: flex; flex-direction: column; gap: 24px; max-width: 760px; }

  .int-section-title {
    font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase;
    color: var(--ink-500); margin: 0 0 10px;
  }

  .int-card {
    background: var(--ink-0);
    border: 1px solid var(--ink-200);
    border-radius: 14px;
    overflow: hidden;
  }

  .int-card-header {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 18px;
    border-bottom: 1px solid var(--ink-150, #ECEEF1);
    background: var(--ink-50);
  }
  .int-card-header-icon {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--brand-500), #FFB088);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .int-card-header-info { flex: 1; min-width: 0; }
  .int-card-header-name { font-weight: 700; font-size: 14px; }
  .int-card-header-sub { font-size: 12px; color: var(--ink-500); margin-top: 1px; }

  .int-card-body { padding: 18px; display: flex; flex-direction: column; gap: 14px; }

  .int-tier-row {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
  }
  .int-tier-info { flex: 1; min-width: 0; }
  .int-tier-name { font-weight: 700; font-size: 13.5px; display: flex; align-items: center; gap: 7px; }
  .int-tier-host { font-size: 12px; color: var(--ink-400); font-family: ui-monospace, monospace; margin-top: 2px; }
  .int-tier-desc { font-size: 12px; color: var(--ink-500); margin-top: 4px; }

  .int-status-row { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
  .int-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .int-status-dot.active { background: #16A34A; animation: int-pulse 1.8s infinite; }
  .int-status-dot.error  { background: #DC2626; }
  .int-status-dot.idle   { background: #9CA3AF; }
  @keyframes int-pulse { 50% { opacity: .35; } }
  .int-status-label { font-size: 12px; font-weight: 600; }

  .int-result-box {
    padding: 10px 14px; border-radius: 8px; font-size: 12.5px;
    border: 1px solid transparent;
  }
  .int-result-box.ok    { background: #DCFCE7; border-color: #86EFAC; color: #15803D; }
  .int-result-box.err   { background: #FEF2F2; border-color: #FECACA; color: #B91C1C; }
  .int-result-box.info  { background: var(--ink-50); border-color: var(--ink-200); color: var(--ink-700); }

  .int-divider { height: 1px; background: var(--ink-150, #ECEEF1); margin: 0 -18px; }

  .int-field-label {
    display: block; font-size: 11px; font-weight: 700;
    color: var(--ink-500); letter-spacing: .05em; text-transform: uppercase; margin-bottom: 5px;
  }
  .int-input {
    width: 100%; box-sizing: border-box;
    padding: 9px 12px; border-radius: 8px;
    border: 1px solid var(--ink-200);
    background: var(--ink-0); color: var(--ink-900);
    font-size: 13.5px; font-family: ui-monospace, monospace;
    outline: none; transition: border-color .15s;
  }
  .int-input:focus { border-color: var(--brand-400, #FF8866); }
  .int-input::placeholder { color: var(--ink-400); }
  .int-input:disabled { opacity: 0.55; cursor: not-allowed; background: var(--ink-50); }

  .int-coming-soon {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 999px;
    background: var(--ink-100); color: var(--ink-500);
    font-size: 11px; font-weight: 700; letter-spacing: .04em;
  }

  .int-events-row { display: flex; flex-wrap: wrap; gap: 7px; }
  .int-event-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 999px;
    background: var(--brand-50, #FFF4F1);
    border: 1px solid var(--brand-200, #FFD5C5);
    font-size: 11.5px; font-weight: 600; color: var(--brand-700, #9A2D00);
  }
`;

// ---------------------------------------------------------------------------
// Tier: Free (UAZAPI free.uazapi.com)
// ---------------------------------------------------------------------------
function FreeTier({ token }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'ok' | 'error'
  const [result, setResult] = useState(null);

  async function handleTest() {
    setStatus('loading');
    setResult(null);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/admin/uazapi/token/status', { headers });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || json?.error || `HTTP ${res.status}`);
      setStatus('ok');
      setResult(json);
    } catch (e) {
      setStatus('error');
      setResult({ message: e?.message || 'Falha na conexão.' });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="int-tier-row">
        <div className="int-tier-info">
          <div className="int-tier-name">
            <span>🟢</span>
            Free Tier (Teste)
          </div>
          <div className="int-tier-host">free.uazapi.com</div>
          <div className="int-tier-desc">Instâncias expiram em 1h · Ideal para testar o produto</div>
          <div className="int-status-row">
            <span className={`int-status-dot ${status === 'ok' ? 'active' : status === 'error' ? 'error' : 'active'}`} />
            <span className="int-status-label" style={{ color: status === 'error' ? '#B91C1C' : '#16A34A' }}>
              {status === 'ok' ? 'Conectado' : status === 'error' ? 'Erro' : 'Ativo'}
            </span>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleTest}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Testando…' : 'Testar conexão'}
        </Button>
      </div>

      {result && (
        <div className={`int-result-box ${status === 'ok' ? 'ok' : 'err'}`}>
          {status === 'ok'
            ? `✅ Conexão OK · ${result?.status || JSON.stringify(result)}`
            : `❌ ${result?.message}`}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tier: Servidor Dedicado (Pago) — placeholder
// ---------------------------------------------------------------------------
function PaidTier() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="int-tier-row">
        <div className="int-tier-info">
          <div className="int-tier-name">
            <span>⭐</span>
            Servidor Dedicado (Pago)
            <span className="int-coming-soon">Em breve</span>
          </div>
          <div className="int-tier-desc">
            Conecte seu próprio servidor UAZAPI para eliminar as limitações de trial
          </div>
        </div>
      </div>

      <div>
        <label className="int-field-label">URL do servidor</label>
        <input
          className="int-input"
          placeholder="https://meu-uazapi.exemplo.com"
          disabled
        />
      </div>
      <div>
        <label className="int-field-label">Admin Token</label>
        <input
          className="int-input"
          type="password"
          placeholder="••••••••••••••••"
          disabled
        />
      </div>
      <div>
        <Button variant="primary" size="sm" disabled>
          Salvar servidor
        </Button>
        <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--ink-400)' }}>
          Em breve — disponível no plano Pro
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Webhook Global — placeholder
// ---------------------------------------------------------------------------
function WebhookSection() {
  const EVENTS = ['messages', 'connection', 'qr'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label className="int-field-label">URL de recebimento</label>
        <input
          className="int-input"
          placeholder="https://minha-api.com/webhook"
          disabled
        />
      </div>
      <div>
        <label className="int-field-label">Eventos</label>
        <div className="int-events-row">
          {EVENTS.map(ev => (
            <span key={ev} className="int-event-chip">
              ✓ {ev}
            </span>
          ))}
        </div>
      </div>
      <div>
        <Button variant="primary" size="sm" disabled>
          Salvar webhook
        </Button>
        <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--ink-400)' }}>
          Em breve
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Integrations — componente principal
// ---------------------------------------------------------------------------
export default function Integrations() {
  const auth = useAuth?.();
  const token = auth?.user?.token || window.__ruptur?.auth?.token || null;

  return (
    <>
      <style>{STYLES}</style>

      <PageHeader
        title="Integrações"
        sub="Configure os provedores de WhatsApp e webhooks do sistema"
      />

      <div className="int-grid">
        {/* ── UAZAPI ── */}
        <div>
          <p className="int-section-title">UAZAPI — Provedor WhatsApp</p>
          <div className="int-card">
            <div className="int-card-header">
              <div className="int-card-header-icon">🔌</div>
              <div className="int-card-header-info">
                <div className="int-card-header-name">UAZAPI</div>
                <div className="int-card-header-sub">Instâncias WhatsApp via API · free tier e servidor dedicado</div>
              </div>
            </div>
            <div className="int-card-body">
              <FreeTier token={token} />
              <div className="int-divider" />
              <PaidTier />
            </div>
          </div>
        </div>

        {/* ── Webhook Global ── */}
        <div>
          <p className="int-section-title">Webhook Global</p>
          <div className="int-card">
            <div className="int-card-header">
              <div className="int-card-header-icon" style={{ background: 'linear-gradient(135deg, #6366F1, #A78BFA)' }}>⚡</div>
              <div className="int-card-header-info">
                <div className="int-card-header-name">Webhook de entrada</div>
                <div className="int-card-header-sub">Receba eventos de todas as instâncias num único endpoint</div>
              </div>
            </div>
            <div className="int-card-body">
              <WebhookSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
