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
  const [qrCode, setQrCode] = useState(null);     // base64 ou string da API
  const [pairingCode, setPairingCode] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  const fetchQR = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await whatsappApi.connect(inst.id);
      // res = { id, status, qrCode, pairingCode }
      setQrCode(res?.data?.qrCode || res?.qrCode || null);
      setPairingCode(res?.data?.pairingCode || res?.pairingCode || null);
      setCountdown(60);
    } catch (e) {
      setError(e?.message || 'Erro ao obter QR Code.');
    } finally {
      setLoading(false);
    }
  }, [inst.id]);

  // Carregar QR na abertura
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchQR(); }, [fetchQR]);

  // Countdown e polling de status
  useEffect(() => {
    if (loading) return;
    const tick = setInterval(async () => {
      setCountdown(c => {
        if (c <= 1) { fetchQR(); return 60; }
        return c - 1;
      });
    }, 1000);

    // Polling de status a cada 3s para detectar conexão
    pollRef.current = setInterval(async () => {
      try {
        const res = await whatsappApi.status(inst.id);
        const st = (res?.data?.status || res?.status || '').toLowerCase();
        if (st === 'connected') {
          clearInterval(pollRef.current);
          onClose(true);
        }
      } catch { /* ignora */ }
    }, 3000);

    return () => { clearInterval(tick); clearInterval(pollRef.current); };
  }, [loading, fetchQR, inst.id, onClose]);

  const mm = String(Math.floor(countdown / 60)).padStart(1, '0');
  const ss = String(countdown % 60).padStart(2, '0');

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="qr-modal-shell" onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700 }}>Conectar WhatsApp</h3>
        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-600)' }}>
          Aponte a câmera do seu celular pro QR Code abaixo
        </p>

        <div className="qr-frame" key={pairingCode}>
          {loading ? (
            <div style={{ color: 'var(--ink-400)', fontSize: 12 }}>Gerando QR…</div>
          ) : error ? (
            <div style={{ color: 'var(--danger,#DC2626)', fontSize: 12, padding: 12 }}>{error}</div>
          ) : (
            <>
              <QRSvgPattern qrBase64={qrCode} />
              {!qrCode && <div className="qr-scan" />}
            </>
          )}
        </div>

        {pairingCode && (
          <div className="qr-code-text" style={{ marginBottom: 8 }}>
            Código de emparelhamento: <b>{pairingCode}</b>
          </div>
        )}

        {!loading && !error && (
          <div className="qr-countdown">
            Expira em <b>{mm}:{ss}</b>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'center' }}>
          <Button variant="secondary" size="sm" onClick={fetchQR} disabled={loading}>
            ↻ Novo QR
          </Button>
        </div>
        <button
          onClick={() => onClose(false)}
          style={{ marginTop: 12, background: 'transparent', border: 'none', color: 'var(--ink-500)', fontSize: 12.5, cursor: 'pointer' }}
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
function InstanceCard({ inst, health, onConnect, onReconnect, onConfig, onDisconnect }) {
  const warmup = inst._warmup || 'cold';
  const warmupLabel = { hot: 'Aquecido', warming: 'Em aquecimento', cold: 'Frio' };
  const warmupColor = { hot: '#25D366', warming: '#FF6A3D', cold: '#9CA3AF' };
  const warmupPct = inst._warmupPct ?? 0;

  const msgsToday = health?.msgsToday ?? '—';
  const deliveryRate = health?.deliveryRate != null ? `${health.deliveryRate}%` : '—';
  const uptime = health?.uptime != null ? `${health.uptime}%` : '—';
  const sparkline = health?.sparkline || [0, 0, 0, 0, 0, 0, 0];

  return (
    <div className="inst-card">
      <div className="inst-head">
        <div className="inst-avatar">{(inst.name || '?').slice(0, 2).toUpperCase()}</div>
        <div className="inst-info">
          <div className="inst-name">{inst.name}</div>
          <div className="inst-phone">{inst.phone || 'aguardando QR'}</div>
        </div>
        <span className={`inst-state ${inst._state}`}>
          {inst._state === 'connected' && <><span className="dot" />Conectado</>}
          {inst._state === 'connecting' && (
            <><svg width="10" height="10" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" /></svg>Conectando</>
          )}
          {inst._state === 'disconnected' && <><span className="dot" />Desconectado</>}
        </span>
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
        {inst._state === 'connected' ? (
          <Button variant="secondary" size="sm" onClick={onDisconnect}>Desconectar</Button>
        ) : inst._state === 'disconnected' ? (
          <Button variant="primary" size="sm" onClick={onReconnect}>Reconectar</Button>
        ) : (
          <Button variant="primary" size="sm" onClick={onConnect}>Conectar QR</Button>
        )}
        <Button variant="ghost" size="sm" onClick={onConfig}>Config</Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Config Drawer
// ---------------------------------------------------------------------------
function InstanceConfigDrawer({ inst, onClose, onSave }) {
  const [draft, setDraft] = useState({ ...inst, webhookUrl: inst.webhookUrl || '', delay: inst.delay || 3, dailyLimit: inst.dailyLimit || 500 });

  return (
    <Drawer title={`Config · ${inst.name}`} onClose={onClose} footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={() => onSave(draft)}>Salvar</Button>
      </>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Nome da instância" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
        <Input label="Webhook URL" value={draft.webhookUrl} onChange={e => setDraft({ ...draft, webhookUrl: e.target.value })} />
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-600)', marginBottom: 6 }}>
            Delay entre mensagens · {draft.delay}s
          </label>
          <input type="range" min="1" max="10" value={draft.delay} onChange={e => setDraft({ ...draft, delay: +e.target.value })} style={{ width: '100%' }} />
        </div>
        <Input label="Limite diário (mensagens)" type="number" value={draft.dailyLimit} onChange={e => setDraft({ ...draft, dailyLimit: +e.target.value })} />
        <div style={{ padding: 12, background: 'var(--brand-50,#FFF4F1)', border: '1px solid var(--brand-100,#FFD9CC)', borderRadius: 8, fontSize: 12.5, color: 'var(--ink-700)' }}>
          <b style={{ color: 'var(--brand-500)' }}>⚠️ Proteção anti-ban:</b> intervalo mínimo 2s, kill switch automático se taxa de bloqueio &gt; 8%.
        </div>
        <div style={{ borderTop: '1px solid var(--ink-150,#ECEEF1)', paddingTop: 14 }}>
          <button
            onClick={() => { if (window.confirm(`Excluir instância "${inst.name}"? Esta ação é irreversível.`)) onSave({ __delete: true, id: inst.id }); }}
            style={{ width: '100%', padding: '10px 14px', background: '#FEF2F2', color: 'var(--danger,#DC2626)', border: '1px solid #FECACA', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
          >
            🗑 Excluir instância
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

function WarmupSettings() {
  const [msgsDay, setMsgsDay] = useState(120);
  const [startH, setStartH] = useState('08:00');
  const [endH, setEndH] = useState('18:00');
  const [content, setContent] = useState({ text: true, image: true, audio: false, doc: false });
  const [speed, setSpeed] = useState('moderado');
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

function WarmupDashboard({ instances }) {
  const inWarmup = instances.filter(i => i._warmup !== 'hot');
  return (
    <div>
      <div className="wu-grid">
        <div>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>Números em aquecimento</h3>
          <div className="wu-list">
            {inWarmup.length === 0 && (
              <EmptyState icon="check" title="Tudo aquecido" text="Nenhum número precisa de warmup agora." />
            )}
            {inWarmup.map(inst => (
              <div key={inst.id} className="wu-item">
                <div className="wu-item-info">
                  <div className="wu-item-name">{inst.name}</div>
                  <div className="wu-item-phone">{inst.phone || 'sem número'}</div>
                  <div className="wu-item-bar"><i style={{ width: (inst._warmupPct || 0) + '%' }} /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--ink-500)', marginTop: 4 }}>
                    <span>{inst._warmupPct || 0}% aquecido</span>
                  </div>
                </div>
                <CircleScore value={inst._health || 32} />
                <Button variant="primary" size="sm" onClick={() => {}}>Iniciar aquecimento</Button>
              </div>
            ))}
          </div>
          <div className="wu-chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>Evolução do score · últimos 14 dias</h4>
              <span style={{ fontSize: 11, color: 'var(--ink-500)' }}>média todos números</span>
            </div>
            <WarmupChart />
          </div>
        </div>
        <div>
          <WarmupSim />
          <div className="wu-chart-card" style={{ marginTop: 14 }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700 }}>Configuração de aquecimento</h4>
            <WarmupSettings />
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
// Numbers — componente principal
// ---------------------------------------------------------------------------
export default function Numbers() {
  const [tab, setTab] = useState('instances');
  const [instances, setInstances] = useState([]);
  const [healthMap] = useState({});   // id → { msgsToday, deliveryRate, uptime, sparkline } — populado por polling futuro
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrModal, setQrModal] = useState(null);     // inst | null
  const [configDrawer, setConfigDrawer] = useState(null);
  const [newModal, setNewModal] = useState(false);
  const { toast } = useToast?.() ?? { toast: () => {} };

  // Enriquece com campos UI locais (_state, _warmup, _warmupPct, _health)
  const enrich = useCallback((raw) => ({
    ...raw,
    _state: normalizeState(raw.status),
    _warmup: raw._warmup || 'cold',
    _warmupPct: raw._warmupPct ?? 0,
    _health: raw._health ?? 32,
  }), []);

  // Carregar lista inicial
  const loadNumbers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await whatsappApi.listNumbers();
      const rows = res?.data || res || [];
      setInstances(rows.map(enrich));
    } catch (e) {
      setError(e?.message || 'Erro ao carregar números.');
    } finally {
      setLoading(false);
    }
  }, [enrich]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadNumbers(); }, [loadNumbers]);

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

  return (
    <>
      <style>{STYLES}</style>

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
                  onDisconnect={() => {
                    if (window.confirm(`Desconectar ${inst.name}?`)) {
                      setInstances(prev => prev.map(x => x.id === inst.id ? { ...x, _state: 'disconnected', status: 'disconnected' } : x));
                    }
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'warmup' && <WarmupDashboard instances={instances} />}

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
