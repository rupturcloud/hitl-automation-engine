/* eslint-disable react-hooks/purity */
/**
 * Numbers — M5 Instâncias WhatsApp + M6 Aquecimento
 *
 * Port do handoff entry_011_3dc85383.js com integração real:
 *  - listNumbers()  → carrega instâncias do tenant via /api/v1/whatsapp/numbers
 *  - connect(id)    → obtém QR Code real do UAZAPI
 *  - status(id)     → polling de estado durante conexão
 *
 * Aquecimento (tab) permanece como simulação visual (M6 backend = pendente).
 */
import { useState, useEffect, useMemo, useRef, useCallback, useId } from 'react';
import {
  Button, Input, Tabs, Drawer, EmptyState, PageHeader, AIChip,
} from '../../ds/index.js';
import { whatsappApi } from '../../api/whatsapp.api.js';
import { useToast } from '../../ds/toast.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useInstanceSSE } from '../../hooks/useInstanceSSE.js';

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------
function normalizeState(status) {
  if (!status) return 'connecting';
  const s = String(status).toLowerCase();
  if (s === 'connected') return 'connected';
  if (s === 'offline' || s === 'disconnected') return 'disconnected';
  return 'connecting';
}

const WARMUP_BUBBLES = [
  'Bom dia! Tudo certo aí?', 'Tudo ótimo, e contigo?',
  'Vi seu post de ontem, muito bom!', 'Vlw! Logo mais agente conversa',
  'Tô preparando uma coisa nova', 'Manda foto quando ficar pronto',
  'Combinado, abraço!', 'Até mais 👋',
  'Bora marcar aquele papo essa semana?', 'Topo. Quarta às 15h?',
  'Perfeito, te confirmo',
];

// ---------------------------------------------------------------------------
// CSS inline (igual ao handoff — escopo via classes únicas)
// ---------------------------------------------------------------------------
const STYLES = `
  .nv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; }

  .inst-card { background: var(--ink-0); border: 1px solid var(--ink-200); border-radius: 14px; padding: 18px; transition: all .15s; }
  .inst-card:hover { border-color: var(--ink-300); box-shadow: var(--sh-md); }
  .inst-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .inst-avatar { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, var(--brand-500), #FFB088); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; flex-shrink: 0; box-shadow: 0 4px 12px rgba(255,106,61,.25); }
  .inst-info { flex: 1; min-width: 0; }
  .inst-name { font-weight: 700; font-size: 14.5px; letter-spacing: -.01em; }
  .inst-phone { font-size: 12px; color: var(--ink-500); font-family: ui-monospace, monospace; margin-top: 1px; }

  .inst-state { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
  .inst-state.connected    { background: var(--wa-50,#DCFCE7); color: var(--wa-600,#16A34A); }
  .inst-state.connecting   { background: #FEF3C7; color: #92400E; }
  .inst-state.disconnected { background: #FEE2E2; color: #B91C1C; }
  .inst-state .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .inst-state.connected .dot { animation: pulse-fast 1.4s infinite; }
  .inst-state.connecting svg { animation: spin .9s linear infinite; }
  @keyframes pulse-fast { 50% { opacity: .3; } }
  @keyframes spin { to { transform: rotate(360deg); } }

  .inst-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 10px 0; margin-bottom: 12px; border-top: 1px solid var(--ink-150,#ECEEF1); border-bottom: 1px solid var(--ink-150,#ECEEF1); }
  .inst-metric { text-align: center; }
  .inst-metric .l { font-size: 10px; font-weight: 700; color: var(--ink-500); letter-spacing: .06em; text-transform: uppercase; }
  .inst-metric .v { font-size: 16px; font-weight: 800; letter-spacing: -.015em; margin-top: 2px; font-variant-numeric: tabular-nums; }

  .inst-warmup { padding: 10px; background: var(--ink-50); border-radius: 8px; margin-bottom: 12px; }
  .inst-warmup-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .inst-warmup-head b { font-size: 12px; font-weight: 700; }
  .inst-warmup-bar { height: 5px; background: var(--ink-150,#ECEEF1); border-radius: 999px; overflow: hidden; }
  .inst-warmup-bar i { display: block; height: 100%; border-radius: 999px; transition: width .4s; }
  .inst-warmup-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 999px; }
  .inst-warmup-badge.hot     { background: var(--wa-50,#DCFCE7); color: var(--wa-600,#16A34A); }
  .inst-warmup-badge.warming { background: var(--brand-50,#FFF4F1); color: var(--brand-600,#C94A1E); }
  .inst-warmup-badge.cold    { background: var(--ink-100); color: var(--ink-600); }

  .inst-actions { display: flex; gap: 6px; }
  .inst-spark { height: 30px; margin-bottom: 12px; }

  /* QR Modal */
  .qr-modal-shell { background: var(--ink-0); padding: 28px; border-radius: 14px; max-width: 420px; width: 100%; text-align: center; }
  .qr-frame { position: relative; width: 240px; height: 240px; margin: 18px auto; background: white; border: 2px solid var(--ink-200); border-radius: 10px; padding: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .qr-scan { position: absolute; left: 12px; right: 12px; height: 3px; background: linear-gradient(90deg, transparent, #25D366, transparent); top: 12px; animation: qr-scan 2.2s ease-in-out infinite; box-shadow: 0 0 10px #25D366; }
  @keyframes qr-scan { 0%, 100% { top: 12px; } 50% { top: calc(100% - 15px); } }
  .qr-code-text { font-family: ui-monospace, monospace; font-size: 11px; color: var(--ink-500); background: var(--ink-50); padding: 6px 10px; border-radius: 6px; letter-spacing: .04em; word-break: break-all; }
  .qr-countdown { font-size: 12.5px; color: var(--ink-600); margin-top: 10px; }
  .qr-countdown b { color: var(--brand-500); font-variant-numeric: tabular-nums; }

  /* Warmup */
  .wu-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; align-items: start; }
  @media (max-width: 1100px) { .wu-grid { grid-template-columns: 1fr; } }
  .wu-list { display: flex; flex-direction: column; gap: 10px; }
  .wu-item { background: var(--ink-0); border: 1px solid var(--ink-200); border-radius: 12px; padding: 14px 16px; display: grid; grid-template-columns: 1fr auto auto; gap: 14px; align-items: center; }
  .wu-item-info { min-width: 0; }
  .wu-item-name { font-weight: 700; font-size: 13.5px; }
  .wu-item-phone { font-size: 11.5px; color: var(--ink-500); font-family: ui-monospace, monospace; }
  .wu-item-bar { height: 5px; background: var(--ink-100); border-radius: 999px; overflow: hidden; margin-top: 8px; }
  .wu-item-bar i { display: block; height: 100%; background: linear-gradient(90deg, var(--brand-500), #FF8866); border-radius: 999px; transition: width .4s; }
  .wu-circle { width: 56px; height: 56px; position: relative; }
  .wu-circle svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .wu-circle .v { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; }
  .wu-sim { background: linear-gradient(180deg, #0B141A 0%, #1A1F2A 100%); border-radius: 14px; padding: 18px; color: white; }
  .wu-sim h4 { margin: 0 0 4px; font-size: 14px; font-weight: 700; }
  .wu-sim p { margin: 0 0 14px; font-size: 11.5px; color: rgba(255,255,255,.55); }
  .wu-sim-chat { background: rgba(255,255,255,.03); border-radius: 10px; padding: 12px; min-height: 200px; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; max-height: 280px; }
  .wu-sim-bubble { padding: 6px 10px; border-radius: 8px; font-size: 12.5px; max-width: 78%; line-height: 1.4; animation: bubble-in .35s ease; }
  @keyframes bubble-in { from { opacity: 0; transform: translateY(4px); } }
  .wu-sim-bubble.a { background: #005C4B; color: white; align-self: flex-end; border-top-right-radius: 2px; }
  .wu-sim-bubble.b { background: #1F2C33; color: white; align-self: flex-start; border-top-left-radius: 2px; }
  .wu-chart-card { background: var(--ink-0); border: 1px solid var(--ink-200); border-radius: 12px; padding: 18px; margin-top: 14px; }

  /* Modal overlay */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 1100; }

  /* HITL — estados de confiança */
  .inst-card.hitl-lost { border-color: #FCA5A5; box-shadow: 0 0 0 1px #FCA5A5; }
  .inst-hitl-banner { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px; margin-bottom: 10px; font-size: 11.5px; font-weight: 600; }
  .inst-hitl-banner.uncertain { background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E; }
  .inst-hitl-banner.lost { background: #FEF2F2; border: 1px solid #FECACA; color: #B91C1C; }
  .inst-hitl-banner .hitl-msg { flex: 1; }
  .inst-hitl-banner button { padding: 3px 9px; border-radius: 6px; border: none; cursor: pointer; font-size: 11px; font-weight: 700; white-space: nowrap; }
  .inst-hitl-banner.uncertain button { background: #FEF3C7; color: #78350F; }
  .inst-hitl-banner.uncertain button:hover { background: #FDE68A; }
  .inst-hitl-banner.lost button { background: #FEE2E2; color: #B91C1C; }
  .inst-hitl-banner.lost button:hover { background: #FECACA; }
  .inst-hitl-badge-lost { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; background: #FEE2E2; color: #B91C1C; }
`;

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------
function Sparkline({ data, className }) {
  const uid = useId();
  const gradId = 'sg' + uid.replace(/:/g, '');
  if (!data || data.every(v => v === 0)) {
    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-400)', fontSize: 11 }}>
        sem dados
      </div>
    );
  }
  const w = 280, h = 30, pad = 2;
  const max = Math.max(...data, 1);
  const xi = i => pad + (i / (data.length - 1)) * (w - pad * 2);
  const yi = v => h - pad - (v / max) * (h - pad * 2);
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xi(i)} ${yi(v)}`).join(' ');
  const area = `${path} L ${xi(data.length - 1)} ${h - pad} L ${xi(0)} ${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" style={{ width: '100%' }}>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-500)" stopOpacity=".3" />
          <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke="var(--brand-500)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// QR SVG simulado (padrão visual; QR real vem como base64/string do UAZAPI)
// ---------------------------------------------------------------------------
function QRSvgPattern({ qrBase64 }) {
  // Se o UAZAPI retornou imagem base64, usa ela diretamente
  if (qrBase64) {
    const src = qrBase64.startsWith('data:') ? qrBase64 : `data:image/png;base64,${qrBase64}`;
    return <img src={src} alt="QR Code WhatsApp" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
  }
  // Fallback: padrão visual gerado (para quando a API ainda não retornou)
  const size = 23;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cells = useMemo(() => {
    const m = Array.from({ length: size }, () => Array(size).fill(0));
    const finder = (r, c) => {
      for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) {
        const rr = r + i, cc = c + j;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        m[rr][cc] = (i >= 0 && i <= 6 && j >= 0 && j <= 6 && (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4))) ? 1 : 0;
      }
    };
    finder(0, 0); finder(0, size - 7); finder(size - 7, 0);
    // PRNG determinístico (seed fixo) — padrão visual decorativo, não precisa ser aleatório
    let s = 4321;
    for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) {
      if (m[i][j] === 0) {
        s = (s * 9301 + 49297) % 233280;
        if ((i < 9 && j < 9) || (i < 9 && j >= size - 8) || (i >= size - 8 && j < 9)) continue;
        m[i][j] = s / 233280 > 0.5 ? 1 : 0;
      }
    }
    return m;
  }, []);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', height: '100%' }}>
      {cells.map((row, i) => row.map((c, j) => c ? <rect key={`${i}-${j}`} x={j} y={i} width={1} height={1} fill="#0B0F14" /> : null))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Modal QR Connect — busca QR real do UAZAPI e faz polling de status
// ---------------------------------------------------------------------------
function QRConnectModal({ inst, onClose }) {
  // 'qr' | 'code'
  const [mode, setMode] = useState('qr');

  // ── modo QR ──
  const [qrCode, setQrCode] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [loadingQR, setLoadingQR] = useState(true);
  const [errorQR, setErrorQR] = useState(null);
  const pollRef = useRef(null);

  // ── modo Código ──
  const [phone, setPhone] = useState('');
  const [pairingCode, setPairingCode] = useState(null);
  const [loadingCode, setLoadingCode] = useState(false);
  const [errorCode, setErrorCode] = useState(null);

  // ── buscar QR ──
  const fetchQR = useCallback(async () => {
    setLoadingQR(true);
    setErrorQR(null);
    try {
      const res = await whatsappApi.connect(inst.id);
      setQrCode(res?.data?.qrCode || res?.qrCode || null);
      setCountdown(60);
    } catch (e) {
      setErrorQR(e?.message || 'Erro ao obter QR Code.');
    } finally {
      setLoadingQR(false);
    }
  }, [inst.id]);

  // Carregar QR na abertura (só se modo=qr)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (mode === 'qr') fetchQR(); }, [fetchQR, mode]);

  // Countdown e polling de status (modo QR)
  useEffect(() => {
    if (mode !== 'qr' || loadingQR) return;
    const tick = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { fetchQR(); return 60; }
        return c - 1;
      });
    }, 1000);
    pollRef.current = setInterval(async () => {
      try {
        const res = await whatsappApi.status(inst.id);
        const st = (res?.data?.status || res?.status || '').toLowerCase();
        if (st === 'connected') { clearInterval(pollRef.current); onClose(true); }
      } catch { /* ignora */ }
    }, 3000);
    return () => { clearInterval(tick); clearInterval(pollRef.current); };
  }, [mode, loadingQR, fetchQR, inst.id, onClose]);

  // ── gerar pairing code ──
  async function handleGenerateCode() {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) { setErrorCode('Informe o número com DDD e código do país (ex: 5511999999999).'); return; }
    setLoadingCode(true);
    setErrorCode(null);
    setPairingCode(null);
    try {
      const res = await whatsappApi.connectWithPhone(inst.id, cleaned);
      const code = res?.data?.pairingCode || res?.pairingCode || null;
      if (!code) throw new Error('UAZAPI não retornou o código. Tente pelo QR.');
      setPairingCode(code);
      // Polling para detectar conexão
      pollRef.current = setInterval(async () => {
        try {
          const sr = await whatsappApi.status(inst.id);
          const st = (sr?.data?.status || sr?.status || '').toLowerCase();
          if (st === 'connected') { clearInterval(pollRef.current); onClose(true); }
        } catch { /* ignora */ }
      }, 3000);
    } catch (e) {
      setErrorCode(e?.message || 'Erro ao gerar código.');
    } finally {
      setLoadingCode(false);
    }
  }

  // Limpar polling ao desmontar
  useEffect(() => () => { clearInterval(pollRef.current); }, []);

  const mm = String(Math.floor(countdown / 60)).padStart(1, '0');
  const ss = String(countdown % 60).padStart(2, '0');

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="qr-modal-shell" onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700 }}>Conectar WhatsApp</h3>

        {/* Seletor de modo */}
        <div style={{
          display: 'flex', gap: 4, margin: '12px 0 16px',
          background: 'var(--ink-100)', borderRadius: 8, padding: 3,
        }}>
          {[{ id: 'qr', label: '📷 QR Code' }, { id: 'code', label: '🔢 Código' }].map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setPairingCode(null); setErrorCode(null); }}
              style={{
                flex: 1, padding: '6px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: 12.5,
                background: mode === m.id ? 'var(--ink-0)' : 'transparent',
                color: mode === m.id ? 'var(--ink-900)' : 'var(--ink-500)',
                boxShadow: mode === m.id ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                transition: 'all .15s',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* ── Modo QR ── */}
        {mode === 'qr' && (
          <>
            <p style={{ margin: '0 0 12px', fontSize: 12.5, color: 'var(--ink-600)' }}>
              Aponte a câmera do WhatsApp pro código abaixo
            </p>
            <div className="qr-frame">
              {loadingQR ? (
                <div style={{ color: 'var(--ink-400)', fontSize: 12 }}>Gerando QR…</div>
              ) : errorQR ? (
                <div style={{ color: 'var(--danger,#DC2626)', fontSize: 12, padding: 12 }}>{errorQR}</div>
              ) : (
                <>
                  <QRSvgPattern qrBase64={qrCode} />
                  {!qrCode && <div className="qr-scan" />}
                </>
              )}
            </div>
            {!loadingQR && !errorQR && (
              <div className="qr-countdown">Expira em <b>{mm}:{ss}</b></div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'center' }}>
              <Button variant="secondary" size="sm" onClick={fetchQR} disabled={loadingQR}>
                ↻ Novo QR
              </Button>
            </div>
          </>
        )}

        {/* ── Modo Código de pareamento ── */}
        {mode === 'code' && (
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: '0 0 12px', fontSize: 12.5, color: 'var(--ink-600)' }}>
              Insira o número do celular que vai conectar.<br />
              O WhatsApp mostrará um código de 8 letras para digitar no app.
            </p>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-500)', marginBottom: 5 }}>
                NÚMERO (com DDI + DDD)
              </label>
              <input
                type="tel"
                placeholder="Ex: 5511999999999"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleGenerateCode(); }}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '9px 12px', borderRadius: 8,
                  border: '1px solid var(--ink-200)',
                  fontSize: 15, fontFamily: 'ui-monospace, monospace',
                  background: 'var(--ink-0)', color: 'var(--ink-900)',
                  outline: 'none',
                }}
              />
            </div>
            {errorCode && (
              <div style={{ fontSize: 12, color: '#DC2626', marginBottom: 10 }}>{errorCode}</div>
            )}
            {pairingCode ? (
              <div style={{
                textAlign: 'center', padding: '20px 16px',
                background: 'var(--brand-50)', borderRadius: 12,
                border: '1px solid var(--brand-200)',
                marginBottom: 12,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-600)', letterSpacing: '.06em', marginBottom: 8 }}>
                  CÓDIGO DE PAREAMENTO
                </div>
                <div style={{
                  fontSize: 32, fontWeight: 800, letterSpacing: '.12em',
                  color: 'var(--brand-700)', fontFamily: 'ui-monospace, monospace',
                }}>
                  {pairingCode}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 8 }}>
                  Abra o WhatsApp → Configurações → Dispositivos vinculados → Vincular dispositivo → Usar código
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-400)', marginTop: 6 }}>
                  Aguardando confirmação…
                </div>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={handleGenerateCode}
                disabled={loadingCode}
                style={{ width: '100%' }}
              >
                {loadingCode ? 'Gerando código…' : 'Gerar código de pareamento'}
              </Button>
            )}
          </div>
        )}

        <button
          onClick={() => onClose(false)}
          style={{ marginTop: 12, background: 'transparent', border: 'none', color: 'var(--ink-500)', fontSize: 12.5, cursor: 'pointer', width: '100%' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Instance Card
// ---------------------------------------------------------------------------
function InstanceCard({ inst, health, onConnect, onReconnect, onConfig, onDisconnect, onDelete }) {
  const warmup = inst._warmup || 'cold';
  const warmupLabel = { hot: 'Aquecido', warming: 'Em aquecimento', cold: 'Frio' };
  const warmupColor = { hot: '#25D366', warming: '#FF6A3D', cold: '#9CA3AF' };
  const warmupPct = inst._warmupPct ?? 0;

  const msgsToday = health?.msgsToday ?? '—';
  const deliveryRate = health?.deliveryRate != null ? `${health.deliveryRate}%` : '—';
  const uptime = health?.uptime != null ? `${health.uptime}%` : '—';
  const sparkline = health?.sparkline || [0, 0, 0, 0, 0, 0, 0];

  // ── HITL: estados de confiança (fallback graceful se fusedState ausente) ──
  const fusedState = inst.fusedState || null;
  const trackingMode = fusedState?.trackingMode ?? 'STABLE';
  const needsHITL = fusedState?.needsHITL === true || trackingMode === 'UNCERTAIN';
  const isLost = trackingMode === 'LOST';
  const confidence = fusedState?.confidence ?? 1.0;

  // Segundos desde a última confirmação (useMemo para evitar Date.now() impuro no render)
  const secsSince = useMemo(() => {
    if (!inst.lastSeenAt) return null;
    return Math.floor((Date.now() - new Date(inst.lastSeenAt).getTime()) / 1000);
  }, [inst.lastSeenAt]);
  const sinceLabel = secsSince != null
    ? (secsSince < 60 ? `${secsSince}s` : `${Math.floor(secsSince / 60)}min`)
    : null;

  // Verificar agora: chama status e injeta resultado no polling local (log por ora)
  const [verifying, setVerifying] = useState(false);
  const handleVerify = useCallback(async () => {
    setVerifying(true);
    try {
      const res = await whatsappApi.status(inst.id);
      const st = (res?.data?.status || res?.status || '').toLowerCase();
      // Sinal injetado no polling — quando SSE estiver ativo, irá para o fusion bus
      console.debug('[HITL] verify result', { instanceId: inst.id, status: st, confidence: 0.85 });
    } catch (e) {
      console.warn('[HITL] verify error', e?.message);
    } finally {
      setVerifying(false);
    }
  }, [inst.id]);

  // Card base class — borda vermelha sutil quando LOST
  const cardClass = ['inst-card', isLost ? 'hitl-lost' : ''].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      {/* ── Banner: instância expirada (free server TTL 1h) ── */}
      {inst.freeTrialExpired && (
        <div className="inst-hitl-banner lost">
          <span style={{ fontSize: 13 }}>⏱</span>
          <span className="hitl-msg">Sessão expirada — reconecte para continuar</span>
          <button onClick={onConnect}>Reconectar QR</button>
        </div>
      )}

      {/* ── Banner HITL: UNCERTAIN (mostra apenas quando confidence < 0.8, não LOST e não expirada) ── */}
      {!inst.freeTrialExpired && !isLost && needsHITL && confidence < 0.8 && (
        <div className="inst-hitl-banner uncertain">
          <span style={{ fontSize: 13 }}>⚠️</span>
          <span className="hitl-msg">
            Estado incerto{sinceLabel ? ` · última confirmação ${sinceLabel} atrás` : ''}
          </span>
          <button onClick={handleVerify} disabled={verifying}>
            {verifying ? 'Verificando…' : 'Verificar agora'}
          </button>
        </div>
      )}

      {/* ── Banner HITL: LOST (não expirada — falha de provider) ── */}
      {!inst.freeTrialExpired && isLost && (
        <div className="inst-hitl-banner lost">
          <span style={{ fontSize: 13 }}>🔴</span>
          <span className="hitl-msg">Instância perdida · contato com o provider falhou</span>
          <button onClick={onReconnect}>Reconectar</button>
        </div>
      )}

      <div className="inst-head">
        <div className="inst-avatar">{(inst.name || '?').slice(0, 2).toUpperCase()}</div>
        <div className="inst-info">
          <div className="inst-name">{inst.name}</div>
          <div className="inst-phone">{inst.phone || 'aguardando QR'}</div>
        </div>
        {/* Badge de status — substituído por "Instância perdida" quando LOST */}
        {isLost ? (
          <span className="inst-hitl-badge-lost">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            Instância perdida
          </span>
        ) : (
          <span className={`inst-state ${inst._state}`}>
            {inst._state === 'connected' && <><span className="dot" />Conectado</>}
            {inst._state === 'connecting' && (
              <><svg width="10" height="10" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" /></svg>Conectando</>
            )}
            {inst._state === 'disconnected' && <><span className="dot" />Desconectado</>}
          </span>
        )}
      </div>

      <Sparkline data={sparkline} className="inst-spark" />

      <div className="inst-metrics">
        <div className="inst-metric">
          <div className="l">Msgs hoje</div>
          <div className="v">{typeof msgsToday === 'number' ? msgsToday.toLocaleString('pt-BR') : msgsToday}</div>
        </div>
        <div className="inst-metric">
          <div className="l">Entrega</div>
          <div className="v" style={{ color: 'var(--success,#16A34A)' }}>{deliveryRate}</div>
        </div>
        <div className="inst-metric">
          <div className="l">Uptime</div>
          <div className="v">{uptime}</div>
        </div>
      </div>

      <div className="inst-warmup">
        <div className="inst-warmup-head">
          <b>Saúde do número</b>
          <span className={`inst-warmup-badge ${warmup}`}>{warmupLabel[warmup]}</span>
        </div>
        <div className="inst-warmup-bar">
          <i style={{ width: warmupPct + '%', background: warmupColor[warmup] }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span>{warmupPct}% aquecido</span>
        </div>
      </div>

      <div className="inst-actions">
        {/* Quando LOST: botão "Reconectar" com destaque primário na área de ações */}
        {isLost ? (
          <Button variant="primary" size="sm" onClick={onReconnect}>Reconectar</Button>
        ) : inst._state === 'connected' ? (
          <Button variant="secondary" size="sm" onClick={onDisconnect}>Desconectar</Button>
        ) : inst._state === 'disconnected' ? (
          <Button variant="primary" size="sm" onClick={onReconnect}>Reconectar</Button>
        ) : (
          <Button variant="primary" size="sm" onClick={onConnect}>Conectar QR</Button>
        )}
        <Button variant="ghost" size="sm" onClick={onConfig}>Config</Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          style={{ color: 'var(--red-500,#EF4444)', marginLeft: 'auto' }}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Config Drawer
// ---------------------------------------------------------------------------
// Eventos UAZAPI disponíveis para escuta no webhook
const WEBHOOK_EVENTS = [
  { id: 'messages_update', label: 'messages_update', desc: 'Status de entrega / leitura' },
  { id: 'messages_upsert', label: 'messages_upsert', desc: 'Novas mensagens recebidas' },
  { id: 'qr-code-updated', label: 'qr-code-updated', desc: 'QR Code atualizado' },
  { id: 'connection-update', label: 'connection-update', desc: 'Estado da sessão' },
];

function InstanceConfigDrawer({ inst, onClose, onSave }) {
  // Lê webhookConfig do DTO (populado pelo backend a partir de metadata.webhook)
  const wh = inst.webhookConfig || inst.metadata?.webhook || {};
  const { toast } = useToast?.() ?? { toast: () => {} };
  const [draft, setDraft] = useState({
    name:               inst.name               || '',
    webhookUrl:         inst.webhookUrl         || wh.url               || '',
    webhookEnabled:     wh.enabled              ?? true,
    webhookEvents:      wh.events               ?? ['messages_update'],
    addUrlEvents:       wh.addUrlEvents         ?? false,
    addUrlTypeMessages: wh.addUrlTypeMessages   ?? false,
    delay:              inst.delay              ?? 3,
    dailyLimit:         inst.dailyLimit         ?? 500,
  });
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]     = useState(null);

  function toggleEvent(ev) {
    setDraft(d => ({
      ...d,
      webhookEvents: d.webhookEvents.includes(ev)
        ? d.webhookEvents.filter(e => e !== ev)
        : [...d.webhookEvents, ev],
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await whatsappApi.updateNumber(inst.id, {
        name:       draft.name,
        webhookUrl: draft.webhookUrl,
        delay:      draft.delay,
        dailyLimit: draft.dailyLimit,
      });
      await whatsappApi.setWebhook(inst.id, {
        url:                draft.webhookUrl,
        enabled:            draft.webhookEnabled,
        events:             draft.webhookEvents,
        addUrlEvents:       draft.addUrlEvents,
        addUrlTypeMessages: draft.addUrlTypeMessages,
      });
      toast?.('✅ Configurações salvas.');
      onSave(res?.data || draft);
    } catch (e) {
      setError(e?.message || 'Erro ao salvar.');
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Excluir instância "${inst.name}"? Esta ação é irreversível.`)) return;
    setDeleting(true);
    try {
      await whatsappApi.deleteNumber(inst.id);
      toast?.('🗑 Instância excluída.');
      onSave({ __delete: true, id: inst.id });
    } catch (e) {
      setError(e?.message || 'Erro ao excluir.');
      setDeleting(false);
    }
  }

  return (
    <Drawer title={`Config · ${inst.name}`} onClose={onClose} footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar'}
        </Button>
      </>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* — Dados da instância — */}
        <Input label="Nome da instância" value={draft.name}
          onChange={e => setDraft({ ...draft, name: e.target.value })} />

        {/* — Webhook — seguindo padrão UazapiGO — */}
        <div style={{ border: '1px solid var(--ink-200)', borderRadius: 10, overflow: 'hidden' }}>
          {/* Header com toggle habilitado */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--ink-50)', borderBottom: '1px solid var(--ink-200)' }}>
            <span style={{ fontWeight: 700, fontSize: 12.5 }}>🔗 Webhook</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12 }}>
              <input type="checkbox" checked={draft.webhookEnabled}
                onChange={e => setDraft({ ...draft, webhookEnabled: e.target.checked })} />
              Habilitado
            </label>
          </div>

          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label="URL do webhook" value={draft.webhookUrl}
              onChange={e => setDraft({ ...draft, webhookUrl: e.target.value })}
              placeholder="https://sua-api.com/webhook" />

            {/* Opções de URL */}
            <div style={{ display: 'flex', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={draft.addUrlEvents}
                  onChange={e => setDraft({ ...draft, addUrlEvents: e.target.checked })} />
                addUrlEvents
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={draft.addUrlTypeMessages}
                  onChange={e => setDraft({ ...draft, addUrlTypeMessages: e.target.checked })} />
                addUrlTypeMessages
              </label>
            </div>

            {/* Eventos para escutar */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                Escutar eventos
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {WEBHOOK_EVENTS.map(ev => (
                  <label key={ev.id} title={ev.desc}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                      padding: '4px 10px', borderRadius: 999,
                      background: draft.webhookEvents.includes(ev.id) ? 'var(--brand-50,#FFF4F1)' : 'var(--ink-100)',
                      border: `1px solid ${draft.webhookEvents.includes(ev.id) ? 'var(--brand-200,#FFD5C5)' : 'transparent'}`,
                      fontSize: 11.5, fontWeight: 600 }}>
                    <input type="checkbox" style={{ display: 'none' }}
                      checked={draft.webhookEvents.includes(ev.id)}
                      onChange={() => toggleEvent(ev.id)} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: draft.webhookEvents.includes(ev.id) ? 'var(--brand-500)' : 'var(--ink-400)', flexShrink: 0 }} />
                    {ev.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* — Limites de envio — */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-600)', marginBottom: 6 }}>
            Delay entre mensagens · {draft.delay}s
          </label>
          <input type="range" min="1" max="10" value={draft.delay}
            onChange={e => setDraft({ ...draft, delay: +e.target.value })}
            style={{ width: '100%' }} />
        </div>
        <Input label="Limite diário (mensagens)" type="number" value={draft.dailyLimit}
          onChange={e => setDraft({ ...draft, dailyLimit: +e.target.value })} />

        {error && (
          <div style={{ fontSize: 12.5, color: 'var(--danger,#DC2626)', padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8 }}>
            {error}
          </div>
        )}

        <div style={{ padding: 12, background: 'var(--brand-50,#FFF4F1)', border: '1px solid var(--brand-100,#FFD9CC)', borderRadius: 8, fontSize: 12.5, color: 'var(--ink-700)' }}>
          <b style={{ color: 'var(--brand-500)' }}>⚠️ Proteção anti-ban:</b> intervalo mínimo 2s, kill switch automático se taxa de bloqueio &gt; 8%.
        </div>

        <div style={{ borderTop: '1px solid var(--ink-150,#ECEEF1)', paddingTop: 14 }}>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ width: '100%', padding: '10px 14px', background: '#FEF2F2', color: 'var(--danger,#DC2626)', border: '1px solid #FECACA', borderRadius: 8, cursor: deleting ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13, opacity: deleting ? 0.6 : 1 }}
          >
            {deleting ? 'Excluindo…' : '🗑 Excluir instância'}
          </button>
        </div>
      </div>
    </Drawer>
  );
}

// ---------------------------------------------------------------------------
// Warmup — simulação visual (M6 backend pendente)
// ---------------------------------------------------------------------------
function WarmupSim() {
  const [msgs, setMsgs] = useState([]);
  useEffect(() => {
    let i = 0;
    const tick = () => {
      const text = WARMUP_BUBBLES[Math.floor(Math.random() * WARMUP_BUBBLES.length)];
      setMsgs(m => [...m.slice(-7), { from: i % 2 === 0 ? 'a' : 'b', text, id: Date.now() + i }]);
      i++;
    };
    tick();
    const id = setInterval(tick, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="wu-sim">
      <h4>🔥 Conversa de aquecimento ao vivo</h4>
      <p>Chips trocando mensagens entre si pra ganhar reputação · simulação visual</p>
      <div className="wu-sim-chat">
        {msgs.map(m => <div key={m.id} className={`wu-sim-bubble ${m.from}`}>{m.text}</div>)}
        {msgs.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,.4)', fontSize: 11.5 }}>Iniciando troca…</div>}
      </div>
      <div style={{ marginTop: 12, padding: 10, background: 'rgba(255,106,61,.1)', borderRadius: 8, fontSize: 11.5, color: '#FFB088', lineHeight: 1.5 }}>
        💡 As mensagens são reais entre seus chips e simulam comportamento humano (digitação, intervalos variáveis, áudios ocasionais).
      </div>
    </div>
  );
}

function WarmupChart() {
  const data = [32, 38, 42, 48, 51, 56, 60, 64, 68, 72, 75, 80, 84, 88];
  const w = 600, h = 110, pad = 14;
  const xi = i => pad + (i / (data.length - 1)) * (w - pad * 2);
  const yi = v => h - pad - ((v - 0) / (100 - 0)) * (h - pad * 2);
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xi(i)} ${yi(v)}`).join(' ');
  const area = `${path} L ${xi(data.length - 1)} ${h - pad} L ${pad} ${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 120 }}>
      <defs>
        <linearGradient id="wc" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#25D366" stopOpacity=".28" />
          <stop offset="100%" stopColor="#25D366" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map(g => (
        <line key={g} x1={pad} x2={w - pad} y1={yi(g)} y2={yi(g)} stroke="#ECEEF1" />
      ))}
      <path d={area} fill="url(#wc)" />
      <path d={path} fill="none" stroke="#25D366" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => <circle key={i} cx={xi(i)} cy={yi(v)} r="2.5" fill="#25D366" />)}
    </svg>
  );
}

function WarmupSettings({ instId, initialConfig, onSaved }) {
  const [msgsDay, setMsgsDay] = useState(initialConfig?.msgsDay ?? 120);
  const [startH, setStartH] = useState(initialConfig?.startH ?? '08:00');
  const [endH, setEndH] = useState(initialConfig?.endH ?? '18:00');
  const [content, setContent] = useState({
    text:  (initialConfig?.content ?? ['text', 'image']).includes('text'),
    image: (initialConfig?.content ?? ['text', 'image']).includes('image'),
    audio: (initialConfig?.content ?? []).includes('audio'),
    doc:   (initialConfig?.content ?? []).includes('doc'),
  });
  const [speed, setSpeed] = useState(initialConfig?.speed ?? 'moderado');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast?.() ?? { toast: () => {} };

  async function handleSave() {
    if (!instId) return;
    setSaving(true);
    const cfg = {
      msgsDay,
      startH,
      endH,
      content: Object.entries(content).filter(([, v]) => v).map(([k]) => k),
      speed,
    };
    try {
      await whatsappApi.updateWarmupConfig(instId, cfg);
      toast?.('✅ Configuração de aquecimento salva!');
      onSaved?.(cfg);
    } catch (e) {
      toast?.('❌ Erro ao salvar configuração: ' + (e?.message || 'Tente novamente.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-600)', marginBottom: 6 }}>
          Mensagens por dia · {msgsDay}
        </label>
        <input type="range" min="30" max="500" step="10" value={msgsDay} onChange={e => setMsgsDay(+e.target.value)} style={{ width: '100%' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input label="Início" type="time" value={startH} onChange={e => setStartH(e.target.value)} />
        <Input label="Fim" type="time" value={endH} onChange={e => setEndH(e.target.value)} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-600)', marginBottom: 6 }}>
          Conteúdo permitido
        </label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['text', 'Texto'], ['image', 'Imagem'], ['audio', 'Áudio'], ['doc', 'Documento']].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setContent({ ...content, [k]: !content[k] })}
              style={{ padding: '5px 11px', borderRadius: 999, border: '1px solid ' + (content[k] ? 'var(--brand-500)' : 'var(--ink-200)'), background: content[k] ? 'var(--brand-50,#FFF4F1)' : 'var(--ink-0)', color: content[k] ? 'var(--brand-600,#C94A1E)' : 'var(--ink-700)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            >
              {content[k] ? '✓ ' : ''}{l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-600)', marginBottom: 6 }}>
          Velocidade de crescimento
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[['lento', 'Lento'], ['moderado', 'Moderado'], ['rapido', 'Rápido']].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setSpeed(k)}
              style={{ padding: '7px 0', borderRadius: 6, border: '1px solid ' + (speed === k ? 'var(--brand-500)' : 'var(--ink-200)'), background: speed === k ? 'var(--brand-50,#FFF4F1)' : 'var(--ink-0)', color: speed === k ? 'var(--brand-600,#C94A1E)' : 'var(--ink-700)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      {instId && (
        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar configuração'}
        </Button>
      )}
    </div>
  );
}

function CircleScore({ value }) {
  const color = value >= 80 ? '#25D366' : value >= 50 ? '#FF6A3D' : '#94A3B8';
  const dash = (value / 100) * 100;
  return (
    <div className="wu-circle">
      <svg viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--ink-150,#ECEEF1)" strokeWidth="3" />
        <circle cx="18" cy="18" r="15.5" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${dash * 0.973} 100`} strokeLinecap="round" />
      </svg>
      <div className="v" style={{ color }}>{value}</div>
    </div>
  );
}

function WarmupDashboard({ instances, onWarmupChange }) {
  const [busy, setBusy] = useState({}); // id → 'starting' | 'stopping'
  const [selected, setSelected] = useState(null); // inst selecionada para config
  const { toast } = useToast?.() ?? { toast: () => {} };

  // Só instâncias conectadas aparecem na lista de aquecimento
  const connected = instances.filter(i => i._state === 'connected');
  const hot = connected.filter(i => i.warmup?.enabled && (i.warmup?.pct ?? 0) >= 100);

  // Seleciona a primeira por padrão quando a lista muda
  const firstConnected = connected[0] || null;
  const activeConfig = selected
    ? instances.find(i => i.id === selected.id)
    : firstConnected;

  async function handleStart(inst) {
    setBusy(b => ({ ...b, [inst.id]: 'starting' }));
    try {
      const config = inst.warmup?.config || {};
      const res = await whatsappApi.startWarmup(inst.id, config);
      toast?.('🔥 Aquecimento iniciado para ' + inst.name + '!');
      onWarmupChange?.(inst.id, res?.data?.warmup || { enabled: true, pct: inst.warmup?.pct ?? 0 });
    } catch (e) {
      toast?.('❌ ' + (e?.message || 'Erro ao iniciar aquecimento.'));
    } finally {
      setBusy(b => ({ ...b, [inst.id]: undefined }));
    }
  }

  async function handleStop(inst) {
    setBusy(b => ({ ...b, [inst.id]: 'stopping' }));
    try {
      const res = await whatsappApi.stopWarmup(inst.id);
      toast?.('⏸ Aquecimento pausado para ' + inst.name + '.');
      onWarmupChange?.(inst.id, res?.data?.warmup || { enabled: false, pct: inst.warmup?.pct ?? 0 });
    } catch (e) {
      toast?.('❌ ' + (e?.message || 'Erro ao parar aquecimento.'));
    } finally {
      setBusy(b => ({ ...b, [inst.id]: undefined }));
    }
  }

  return (
    <div>
      <div className="wu-grid">
        {/* Coluna principal: lista + gráfico */}
        <div>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>
            Números em aquecimento
            {hot.length > 0 && (
              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: '#25D366', background: '#DCFCE7', padding: '2px 8px', borderRadius: 999 }}>
                {hot.length} pronto{hot.length > 1 ? 's' : ''}
              </span>
            )}
          </h3>

          {connected.length === 0 && (
            <EmptyState icon="phone" title="Nenhum número conectado" text="Conecte uma instância WhatsApp primeiro para iniciar o aquecimento." />
          )}

          {connected.length > 0 && (
            <div className="wu-list">
              {connected.map(inst => {
                const pct = inst.warmup?.pct ?? 0;
                const enabled = inst.warmup?.enabled ?? false;
                const score = inst.warmup?.score ?? 32;
                const isBusy = !!busy[inst.id];
                const isSelected = activeConfig?.id === inst.id;
                return (
                  <div
                    key={inst.id}
                    className="wu-item"
                    style={{ cursor: 'pointer', outline: isSelected ? '2px solid var(--brand-400)' : 'none', outlineOffset: 2 }}
                    onClick={() => setSelected(inst)}
                  >
                    <div className="wu-item-info">
                      <div className="wu-item-name">{inst.name}</div>
                      <div className="wu-item-phone">{inst.phone || 'sem número'}</div>
                      <div className="wu-item-bar">
                        <i style={{ width: pct + '%', background: pct >= 100 ? '#25D366' : 'linear-gradient(90deg, var(--brand-500), #FF8866)' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--ink-500)', marginTop: 4 }}>
                        <span>{pct}% aquecido</span>
                        {enabled
                          ? <span style={{ color: '#25D366', fontWeight: 700 }}>● Aquecendo</span>
                          : <span style={{ color: 'var(--ink-400)' }}>● Pausado</span>
                        }
                      </div>
                    </div>
                    <CircleScore value={score} />
                    {enabled ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={e => { e.stopPropagation(); handleStop(inst); }}
                        disabled={isBusy}
                      >
                        {isBusy ? '…' : '⏸ Pausar'}
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={e => { e.stopPropagation(); handleStart(inst); }}
                        disabled={isBusy}
                      >
                        {isBusy ? '…' : '🔥 Aquecer'}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="wu-chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>Evolução do score · últimos 14 dias</h4>
              <span style={{ fontSize: 11, color: 'var(--ink-500)' }}>média todos números</span>
            </div>
            <WarmupChart />
          </div>
        </div>

        {/* Coluna lateral: simulação + config */}
        <div>
          <WarmupSim />
          <div className="wu-chart-card" style={{ marginTop: 14 }}>
            <h4 style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700 }}>Configuração de aquecimento</h4>
            {activeConfig ? (
              <>
                <p style={{ margin: '0 0 12px', fontSize: 11.5, color: 'var(--ink-500)' }}>
                  Editando: <b>{activeConfig.name}</b>
                  {connected.length > 1 && <span style={{ color: 'var(--ink-400)' }}> · clique num número ao lado para trocar</span>}
                </p>
                <WarmupSettings
                  instId={activeConfig.id}
                  initialConfig={activeConfig.warmup?.config}
                  onSaved={(cfg) => onWarmupChange?.(activeConfig.id, { ...activeConfig.warmup, config: cfg })}
                />
              </>
            ) : (
              <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: 0 }}>
                Conecte um número para configurar o aquecimento.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal: criar novo número
// ---------------------------------------------------------------------------
function NewNumberModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (!name.trim() || name.trim().length < 2) { setError('Nome precisa ter pelo menos 2 letras.'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await whatsappApi.createNumber({ name: name.trim() });
      onCreate(res?.data || res);
    } catch (e) {
      setError(e?.message || 'Erro ao criar número.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose()}>
      <div className="qr-modal-shell" onClick={e => e.stopPropagation()} style={{ textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>Novo número WhatsApp</h3>
        <Input label="Nome do número" placeholder="Ex: Comercial, Suporte, CS..." value={name} onChange={e => setName(e.target.value)} autoFocus />
        {error && <p style={{ color: 'var(--danger,#DC2626)', fontSize: 12.5, marginTop: 8 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => onClose()}>Cancelar</Button>
          <Button variant="primary" onClick={submit} disabled={loading}>
            {loading ? 'Criando…' : 'Criar e conectar QR'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InstanceSSESensor — helper que chama useInstanceSSE por instância.
// React não permite hooks em loops; este componente renderiza null e
// serve apenas para montar/desmontar o sensor SSE com lifecycle correto.
// ---------------------------------------------------------------------------
function InstanceSSESensor({ instanceId, onStateChange }) {
  // eslint-disable-next-line no-unused-vars
  const { status } = useInstanceSSE(instanceId, {
    onStateChange,
    enabled: true,
  });
  // Sensor inativo até o proxy backend ser implementado — sem log em produção
  return null; // renderiza nada — apenas gerencia o lifecycle do sensor
}

// ---------------------------------------------------------------------------
// Numbers — componente principal
// ---------------------------------------------------------------------------
export default function Numbers() {
  const { authReady } = useAuth();
  const [tab, setTab] = useState('instances');
  const [instances, setInstances] = useState([]);
  const [healthMap, setHealthMap] = useState({});   // id → { msgsToday, deliveryRate, uptime, sparkline }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrModal, setQrModal] = useState(null);     // inst | null
  const [configDrawer, setConfigDrawer] = useState(null);
  const [newModal, setNewModal] = useState(false);
  const { toast } = useToast?.() ?? { toast: () => {} };

  // Enriquece com campos UI locais derivados do DTO
  const enrich = useCallback((raw) => {
    const warmup = raw.warmup || { enabled: false, pct: 0, score: 32, config: null };
    const pct = warmup.pct ?? 0;
    return {
      ...raw,
      warmup,
      _state: normalizeState(raw.status),
      // _warmup / _warmupPct / _health: aliases para o InstanceCard (legado)
      _warmup: warmup.enabled ? (pct >= 100 ? 'hot' : 'warming') : 'cold',
      _warmupPct: pct,
      _health: warmup.score ?? 32,
    };
  }, []);

  // Busca métricas de saúde das instâncias conectadas
  const loadHealth = useCallback(async (currentInstances) => {
    const connected = currentInstances.filter(i => i._state === 'connected');
    if (connected.length === 0) return;
    const results = await Promise.allSettled(connected.map(async inst => {
      try {
        const res = await whatsappApi.health(inst.id);
        return { id: inst.id, data: res?.data || {} };
      } catch { return { id: inst.id, data: {} }; }
    }));
    const map = {};
    results.forEach(r => { if (r.status === 'fulfilled' && r.value) map[r.value.id] = r.value.data; });
    setHealthMap(prev => ({ ...prev, ...map }));
  }, []);

  // Carregar lista inicial
  const loadNumbers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await whatsappApi.listNumbers();
      const rows = res?.data || res || [];
      const enriched = rows.map(enrich);
      setInstances(enriched);
      loadHealth(enriched);
    } catch (e) {
      setError(e?.message || 'Erro ao carregar números.');
    } finally {
      setLoading(false);
    }
  }, [enrich, loadHealth]);

  // Aguarda authReady para garantir que window.__ruptur.auth.token está disponível
  // antes de disparar a chamada à API (evita race condition → 401).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (authReady) loadNumbers(); }, [authReady, loadNumbers]);

  // Polling de health a cada 30s
  useEffect(() => {
    if (instances.length === 0) return;
    const tid = setInterval(() => loadHealth(instances), 30_000);
    return () => clearInterval(tid);
  }, [instances, loadHealth]);

  // Polling de status a cada 30s — detecta expiração de instância free server (TTL 1h).
  // Usa ref para acessar o state atual sem criar dependência que causaria loop de re-render.
  const instancesRef = useRef(instances);
  useEffect(() => { instancesRef.current = instances; }, [instances]);

  useEffect(() => {
    const tid = setInterval(async () => {
      const current = instancesRef.current;
      // Só faz poll para instâncias que ainda não foram marcadas como expiradas
      const targets = current.filter(i => !i.freeTrialExpired && i._state !== 'connecting');
      if (targets.length === 0) return;

      await Promise.allSettled(targets.map(async (inst) => {
        try {
          const res = await whatsappApi.status(inst.id);
          const data = res?.data || res || {};
          if (data.freeTrialExpired) {
            // Marca a instância como expirada no state local
            setInstances(prev => prev.map(x =>
              x.id === inst.id
                ? { ...x, freeTrialExpired: true, _state: 'disconnected', status: 'disconnected' }
                : x
            ));
          }
        } catch { /* ignora erros de rede neste poll */ }
      }));
    }, 30_000);
    return () => clearInterval(tid);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sem dependências — acessa instances via ref

  // Callback SSE: quando o sensor receber um evento de estado, injeta no polling local.
  // Por ora apenas loga — quando o proxy SSE estiver implementado, irá atualizar o state.
  const handleSSEStateChange = useCallback((signal) => {
    console.debug('[Numbers] SSE signal recebido:', signal);
    // TODO (Próximo sprint): atualizar instances state com o sinal do fusion bus
    // setInstances(prev => prev.map(x => x.id === signal.instanceId ? { ...x, ... } : x));
  }, []);

  // Ao abrir modal QR (instância existe) — só exibe o modal, ele chama connect()
  const handleConnect = (inst) => setQrModal(inst);

  // Callback quando o modal detecta conexão ou é fechado
  const handleQRClose = useCallback((connected) => {
    if (connected && qrModal) {
      setInstances(prev => prev.map(x => x.id === qrModal.id ? { ...x, _state: 'connected', status: 'connected' } : x));
      toast?.('✅ WhatsApp conectado com sucesso!');
    }
    setQrModal(null);
  }, [qrModal, toast]);

  // Criar novo número: abre NewNumberModal → após criar, abre QR modal
  const handleNewNumber = useCallback((created) => {
    const enriched = enrich(created);
    setInstances(prev => [...prev, enriched]);
    setNewModal(false);
    setQrModal(enriched);
  }, [enrich]);

  // Atualiza estado de warmup de uma instância no state local
  const handleWarmupChange = useCallback((id, warmupPatch) => {
    setInstances(prev => prev.map(x => {
      if (x.id !== id) return x;
      const newWarmup = { ...(x.warmup || {}), ...warmupPatch };
      const pct = newWarmup.pct ?? 0;
      return {
        ...x,
        warmup: newWarmup,
        _warmup: newWarmup.enabled ? (pct >= 100 ? 'hot' : 'warming') : 'cold',
        _warmupPct: pct,
        _health: newWarmup.score ?? x._health ?? 32,
      };
    }));
  }, []);

  // Salvar config
  const handleSaveConfig = useCallback((updated) => {
    if (updated.__delete) {
      setInstances(prev => prev.filter(x => x.id !== updated.id));
    } else {
      setInstances(prev => prev.map(x => x.id === configDrawer.id ? { ...x, ...updated } : x));
    }
    setConfigDrawer(null);
  }, [configDrawer]);

  const hotCount = instances.filter(i => i._warmup === 'hot').length;
  const warmingCount = instances.filter(i => i._warmup !== 'hot').length;

  // Instâncias ativas (connected ou connecting) para montar os sensores SSE
  const sseTargets = instances.filter(i => i._state === 'connected' || i._state === 'connecting');

  return (
    <>
      <style>{STYLES}</style>

      {/* Sensores SSE: um por instância ativa — renderizam null, apenas gerenciam lifecycle */}
      {sseTargets.map(inst => (
        <InstanceSSESensor
          key={inst.id}
          instanceId={inst.id}
          onStateChange={handleSSEStateChange}
        />
      ))}

      <PageHeader
        title="Números"
        sub="Instâncias WhatsApp + aquecimento automático com proteção anti-ban"
        actions={
          <>
            {hotCount > 0 && (
              <AIChip text={`${hotCount} chip${hotCount > 1 ? 's' : ''} pronto${hotCount > 1 ? 's' : ''} pra disparo${warmingCount > 0 ? ` · ${warmingCount} aquecendo` : ''}`} tone="brand" />
            )}
            <Button variant="primary" size="sm" onClick={() => setNewModal(true)}>
              + Conectar número
            </Button>
          </>
        }
      />

      <Tabs
        tabs={[
          { id: 'instances', label: '📱 Instâncias', count: instances.length },
          { id: 'warmup', label: '🔥 Aquecimento', count: warmingCount || undefined },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div style={{ marginTop: 16 }} />

      {tab === 'instances' && (
        <>
          {loading && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-400)' }}>Carregando números…</div>
          )}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ color: 'var(--danger,#DC2626)', marginBottom: 12 }}>{error}</p>
              <Button variant="secondary" size="sm" onClick={loadNumbers}>Tentar novamente</Button>
            </div>
          )}
          {!loading && !error && instances.length === 0 && (
            <EmptyState
              icon="phone"
              title="Nenhum número conectado"
              text="Conecte seu primeiro número WhatsApp para começar a enviar mensagens."
              action={<Button variant="primary" onClick={() => setNewModal(true)}>+ Conectar número</Button>}
            />
          )}
          {!loading && !error && instances.length > 0 && (
            <div className="nv-grid">
              {instances.map(inst => (
                <InstanceCard
                  key={inst.id}
                  inst={inst}
                  health={healthMap[inst.id]}
                  onConnect={() => handleConnect(inst)}
                  onReconnect={() => handleConnect(inst)}
                  onConfig={() => setConfigDrawer(inst)}
                  onDisconnect={async () => {
                    if (window.confirm(`Desconectar ${inst.name}?`)) {
                      setInstances(prev => prev.map(x => x.id === inst.id
                        ? { ...x, _state: 'disconnected', status: 'disconnected' }
                        : x));
                      try {
                        await whatsappApi.disconnect(inst.id);
                      } catch (e) {
                        toast?.('⚠️ Erro ao desconectar: ' + (e?.message || 'tente novamente'));
                      }
                    }
                  }}
                  onDelete={async () => {
                    if (window.confirm(`Excluir "${inst.name}"? Esta ação é irreversível.`)) {
                      setInstances(prev => prev.filter(x => x.id !== inst.id));
                      try {
                        await whatsappApi.deleteNumber(inst.id);
                        toast?.('🗑 Número excluído.');
                      } catch (e) {
                        toast?.('⚠️ Erro ao excluir: ' + (e?.message || 'tente novamente'));
                        loadNumbers(); // reverte lista em caso de erro
                      }
                    }
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'warmup' && <WarmupDashboard instances={instances} onWarmupChange={handleWarmupChange} />}

      {/* Modal: criar novo número */}
      {newModal && <NewNumberModal onClose={() => setNewModal(false)} onCreate={handleNewNumber} />}

      {/* Modal: QR Connect */}
      {qrModal && <QRConnectModal inst={qrModal} onClose={handleQRClose} />}

      {/* Drawer: configuração */}
      {configDrawer && (
        <InstanceConfigDrawer
          inst={configDrawer}
          onClose={() => setConfigDrawer(null)}
          onSave={handleSaveConfig}
        />
      )}
    </>
  );
}
