/**
 * Aquecimento — Página standalone /v0/aquecimento
 *
 * Saúde dos números WhatsApp + proteção anti-ban automática.
 * Versão expandida da tab Aquecimento do Numbers.jsx, com mais espaço e
 * painel de configuração global que aplica a todos os números conectados.
 */
import { useState, useEffect, useCallback, useId } from 'react';
import {
  Button, Input, PageHeader, EmptyState,
} from '../../ds/index.js';
import { useToast } from '../../ds/toast.js';
import { whatsappApi } from '../../api/whatsapp.api.js';

// ---------------------------------------------------------------------------
// Constantes / dados estáticos
// ---------------------------------------------------------------------------
const WARMUP_BUBBLES = [
  'Bom dia! Tudo certo aí?', 'Tudo ótimo, e contigo?',
  'Vi seu post de ontem, muito bom!', 'Vlw! Logo mais agente conversa',
  'Tô preparando uma coisa nova', 'Manda foto quando ficar pronto',
  'Combinado, abraço!', 'Até mais 👋',
  'Bora marcar aquele papo essa semana?', 'Topo. Quarta às 15h?',
  'Perfeito, te confirmo',
];

// Score histórico mock para o gráfico (14 dias)
const CHART_DATA = [32, 38, 42, 48, 51, 56, 60, 64, 68, 72, 75, 80, 84, 88];

// ---------------------------------------------------------------------------
// CSS inline
// ---------------------------------------------------------------------------
const STYLES = `
  /* Stats bar */
  .aq-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
  @media (max-width: 900px) { .aq-stats { grid-template-columns: repeat(2, 1fr); } }
  .aq-stat { background: var(--ink-0); border: 1px solid var(--ink-200); border-radius: 12px; padding: 16px 18px; }
  .aq-stat .l { font-size: 11px; font-weight: 700; color: var(--ink-500); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 4px; }
  .aq-stat .v { font-size: 26px; font-weight: 800; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
  .aq-stat .s { font-size: 11px; color: var(--ink-500); margin-top: 2px; }

  /* Layout principal */
  .aq-layout { display: grid; grid-template-columns: 1fr 320px; gap: 18px; align-items: start; }
  @media (max-width: 1100px) { .aq-layout { grid-template-columns: 1fr; } }

  /* Lista de números */
  .aq-list { display: flex; flex-direction: column; gap: 10px; }
  .aq-item { background: var(--ink-0); border: 1px solid var(--ink-200); border-radius: 12px; padding: 16px 18px; display: grid; grid-template-columns: 1fr auto auto; gap: 16px; align-items: center; transition: border-color .15s; }
  .aq-item:hover { border-color: var(--ink-300); }
  .aq-item-info { min-width: 0; }
  .aq-item-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .aq-avatar { width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, var(--brand-500), #FFB088); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }
  .aq-name { font-weight: 700; font-size: 14px; }
  .aq-phone { font-size: 11.5px; color: var(--ink-500); font-family: ui-monospace, monospace; margin-top: 1px; }
  .aq-bar { height: 6px; background: var(--ink-100); border-radius: 999px; overflow: hidden; margin-bottom: 6px; }
  .aq-bar i { display: block; height: 100%; border-radius: 999px; transition: width .4s; }
  .aq-pct-row { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink-500); }

  /* CircleScore */
  .aq-circle { width: 56px; height: 56px; position: relative; flex-shrink: 0; }
  .aq-circle svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .aq-circle .cv { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; }

  /* Coluna lateral */
  .aq-side { display: flex; flex-direction: column; gap: 14px; }
  .aq-card { background: var(--ink-0); border: 1px solid var(--ink-200); border-radius: 12px; padding: 18px; }
  .aq-card h4 { margin: 0 0 4px; font-size: 13.5px; font-weight: 700; }
  .aq-card p  { margin: 0 0 14px; font-size: 12px; color: var(--ink-500); }

  /* Simulação de conversa */
  .aq-sim { background: linear-gradient(180deg, #0B141A 0%, #1A1F2A 100%); border-radius: 14px; padding: 18px; color: white; }
  .aq-sim h4 { margin: 0 0 4px; font-size: 14px; font-weight: 700; }
  .aq-sim p  { margin: 0 0 14px; font-size: 11.5px; color: rgba(255,255,255,.55); }
  .aq-chat { background: rgba(255,255,255,.03); border-radius: 10px; padding: 12px; min-height: 200px; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; max-height: 260px; }
  .aq-bubble { padding: 6px 10px; border-radius: 8px; font-size: 12.5px; max-width: 80%; line-height: 1.4; animation: aq-bubble-in .3s ease; }
  @keyframes aq-bubble-in { from { opacity: 0; transform: translateY(4px); } }
  .aq-bubble.a { background: #005C4B; color: white; align-self: flex-end; border-top-right-radius: 2px; }
  .aq-bubble.b { background: #1F2C33; color: white; align-self: flex-start; border-top-left-radius: 2px; }

  /* Gráfico */
  .aq-chart-wrap { margin-top: 14px; }

  /* Badge status aquecimento */
  .aq-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
  .aq-badge.hot     { background: #DCFCE7; color: #16A34A; }
  .aq-badge.warming { background: var(--brand-50,#FFF4F1); color: var(--brand-600,#C94A1E); }
  .aq-badge.cold    { background: var(--ink-100); color: var(--ink-500); }
`;

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

function enrich(raw) {
  const warmup = raw.warmup || { enabled: false, pct: 0, score: 32, config: null };
  const pct = warmup.pct ?? 0;
  return {
    ...raw,
    warmup,
    _state: normalizeState(raw.status),
    _warmupBadge: warmup.enabled ? (pct >= 100 ? 'hot' : 'warming') : 'cold',
    _pct: pct,
  };
}

// ---------------------------------------------------------------------------
// CircleScore
// ---------------------------------------------------------------------------
function CircleScore({ value }) {
  const color = value >= 80 ? '#25D366' : value >= 50 ? '#FF6A3D' : '#94A3B8';
  const dash = (value / 100) * 97.3;
  return (
    <div className="aq-circle">
      <svg viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--ink-150,#ECEEF1)" strokeWidth="3" />
        <circle cx="18" cy="18" r="15.5" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${dash} 100`} strokeLinecap="round" />
      </svg>
      <div className="cv" style={{ color }}>{value}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WarmupChart — gráfico de linha mock (14 dias)
// ---------------------------------------------------------------------------
function WarmupChart() {
  const uid = useId();
  const gradId = 'aqwc-' + uid.replace(/:/g, '');
  const data = CHART_DATA;
  const w = 600, h = 110, pad = 14;
  const xi = i => pad + (i / (data.length - 1)) * (w - pad * 2);
  const yi = v => h - pad - ((v - 0) / (100 - 0)) * (h - pad * 2);
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xi(i)} ${yi(v)}`).join(' ');
  const area = `${path} L ${xi(data.length - 1)} ${h - pad} L ${pad} ${h - pad} Z`;

  const dayLabels = ['D-13', 'D-12', 'D-11', 'D-10', 'D-9', 'D-8', 'D-7', 'D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'Hoje'];

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 110 }}>
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#25D366" stopOpacity=".28" />
            <stop offset="100%" stopColor="#25D366" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map(g => (
          <line key={g} x1={pad} x2={w - pad} y1={yi(g)} y2={yi(g)} stroke="#ECEEF1" strokeWidth="1" />
        ))}
        <path d={area} fill={`url(#${gradId})`} />
        <path d={path} fill="none" stroke="#25D366" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((v, i) => <circle key={i} cx={xi(i)} cy={yi(v)} r="2.5" fill="#25D366" />)}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 14px', marginTop: 4 }}>
        {dayLabels.filter((_, i) => i % 2 === 0 || i === dayLabels.length - 1).map(l => (
          <span key={l} style={{ fontSize: 10, color: 'var(--ink-400)' }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WarmupSim — simulação visual de conversa de aquecimento
// ---------------------------------------------------------------------------
function WarmupSim() {
  const [msgs, setMsgs] = useState([]);
  const counterRef = { current: 0 };

  useEffect(() => {
    let counter = 0;
    const tick = () => {
      const idx = counter % WARMUP_BUBBLES.length;
      const text = WARMUP_BUBBLES[idx];
      const id = Date.now() + counter;
      setMsgs(m => [...m.slice(-7), { from: counter % 2 === 0 ? 'a' : 'b', text, id }]);
      counter++;
    };
    tick();
    const timerId = setInterval(tick, 1800);
    return () => clearInterval(timerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // counterRef não é usado no render, mas precisamos da referência do closure
  void counterRef;

  return (
    <div className="aq-sim">
      <h4>Conversa de aquecimento ao vivo</h4>
      <p>Chips trocando mensagens entre si para ganhar reputação · simulação visual</p>
      <div className="aq-chat">
        {msgs.map(m => (
          <div key={m.id} className={`aq-bubble ${m.from}`}>{m.text}</div>
        ))}
        {msgs.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,.4)', fontSize: 11.5 }}>
            Iniciando troca…
          </div>
        )}
      </div>
      <div style={{ marginTop: 12, padding: 10, background: 'rgba(255,106,61,.1)', borderRadius: 8, fontSize: 11.5, color: '#FFB088', lineHeight: 1.5 }}>
        As mensagens são reais entre seus chips e simulam comportamento humano (digitação, intervalos variáveis, áudios ocasionais).
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// GlobalConfig — painel de configuração global aplicado a todos
// ---------------------------------------------------------------------------
function GlobalConfig({ instances, onApplied }) {
  const [msgsDay, setMsgsDay] = useState(120);
  const [startH, setStartH] = useState('08:00');
  const [endH, setEndH] = useState('18:00');
  const [content, setContent] = useState({ text: true, image: true, audio: false, doc: false });
  const [speed, setSpeed] = useState('moderado');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const connected = instances.filter(i => i._state === 'connected');

  async function handleApplyAll() {
    if (connected.length === 0) {
      toast('Nenhum número conectado para configurar.');
      return;
    }
    setSaving(true);
    const cfg = {
      msgsDay,
      startH,
      endH,
      content: Object.entries(content).filter(([, v]) => v).map(([k]) => k),
      speed,
    };
    let errors = 0;
    for (const inst of connected) {
      try {
        await whatsappApi.updateWarmupConfig(inst.id, cfg);
      } catch {
        errors++;
      }
    }
    setSaving(false);
    if (errors === 0) {
      toast(`Configuracao aplicada a ${connected.length} numero${connected.length > 1 ? 's' : ''}.`);
      onApplied?.(cfg);
    } else {
      toast(`Aplicado com ${errors} erro${errors > 1 ? 's' : ''}. Verifique os logs.`);
    }
  }

  return (
    <div className="aq-card">
      <h4>Configuracao global</h4>
      <p>Aplicada a todos os numeros conectados</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-600)', marginBottom: 6 }}>
            Mensagens por dia · {msgsDay}
          </label>
          <input
            type="range" min="30" max="500" step="10"
            value={msgsDay}
            onChange={e => setMsgsDay(+e.target.value)}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-400)', marginTop: 2 }}>
            <span>30</span><span>500</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input label="Inicio" type="time" value={startH} onChange={e => setStartH(e.target.value)} />
          <Input label="Fim" type="time" value={endH} onChange={e => setEndH(e.target.value)} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-600)', marginBottom: 6 }}>
            Conteudo permitido
          </label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[['text', 'Texto'], ['image', 'Imagem'], ['audio', 'Audio'], ['doc', 'Documento']].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setContent({ ...content, [k]: !content[k] })}
                style={{
                  padding: '5px 11px', borderRadius: 999,
                  border: '1px solid ' + (content[k] ? 'var(--brand-500)' : 'var(--ink-200)'),
                  background: content[k] ? 'var(--brand-50,#FFF4F1)' : 'var(--ink-0)',
                  color: content[k] ? 'var(--brand-600,#C94A1E)' : 'var(--ink-700)',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                }}
              >
                {content[k] ? '+ ' : ''}{l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-600)', marginBottom: 6 }}>
            Velocidade de crescimento
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {[['lento', 'Lento'], ['moderado', 'Moderado'], ['rapido', 'Rapido']].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setSpeed(k)}
                style={{
                  padding: '7px 0', borderRadius: 6,
                  border: '1px solid ' + (speed === k ? 'var(--brand-500)' : 'var(--ink-200)'),
                  background: speed === k ? 'var(--brand-50,#FFF4F1)' : 'var(--ink-0)',
                  color: speed === k ? 'var(--brand-600,#C94A1E)' : 'var(--ink-700)',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          padding: '10px 12px',
          background: 'var(--brand-50,#FFF4F1)',
          border: '1px solid var(--brand-100,#FFD9CC)',
          borderRadius: 8,
          fontSize: 12,
          color: 'var(--ink-700)',
          lineHeight: 1.55,
        }}>
          <b style={{ color: 'var(--brand-500)' }}>Protecao anti-ban:</b> intervalo minimo 2s,
          kill switch automatico se taxa de bloqueio &gt; 8%.
        </div>

        <Button
          variant="primary"
          onClick={handleApplyAll}
          disabled={saving || connected.length === 0}
        >
          {saving ? 'Aplicando…' : `Salvar e aplicar a ${connected.length} numero${connected.length !== 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InstCard — card de instância conectada na lista de aquecimento
// ---------------------------------------------------------------------------
function InstCard({ inst, busy, onStart, onStop }) {
  const pct = inst._pct;
  const score = inst.warmup?.score ?? 32;
  const enabled = inst.warmup?.enabled ?? false;
  const badgeLabel = { hot: 'Aquecido', warming: 'Em aquecimento', cold: 'Frio' };
  const barColor = pct >= 100 ? '#25D366' : 'linear-gradient(90deg, var(--brand-500), #FF8866)';

  return (
    <div className="aq-item">
      <div className="aq-item-info">
        <div className="aq-item-head">
          <div className="aq-avatar">{(inst.name || '?').slice(0, 2).toUpperCase()}</div>
          <div>
            <div className="aq-name">{inst.name}</div>
            <div className="aq-phone">{inst.phone || 'sem numero'}</div>
          </div>
          <span className={`aq-badge ${inst._warmupBadge}`} style={{ marginLeft: 'auto' }}>
            {badgeLabel[inst._warmupBadge]}
          </span>
        </div>
        <div className="aq-bar">
          <i style={{ width: pct + '%', background: barColor }} />
        </div>
        <div className="aq-pct-row">
          <span>{pct}% aquecido</span>
          {enabled
            ? <span style={{ color: '#25D366', fontWeight: 700 }}>Aquecendo</span>
            : <span style={{ color: 'var(--ink-400)' }}>Pausado</span>
          }
        </div>
      </div>

      <CircleScore value={score} />

      {enabled ? (
        <Button variant="secondary" size="sm" onClick={onStop} disabled={busy}>
          {busy ? '…' : 'Pausar'}
        </Button>
      ) : (
        <Button variant="primary" size="sm" onClick={onStart} disabled={busy}>
          {busy ? '…' : 'Iniciar'}
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aquecimento — componente principal
// ---------------------------------------------------------------------------
export default function Aquecimento() {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState({});
  const { toast } = useToast();

  const loadNumbers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await whatsappApi.listNumbers();
      const rows = res?.data || res || [];
      setInstances(rows.map(enrich));
    } catch (e) {
      setError(e?.message || 'Erro ao carregar numeros.');
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadNumbers(); }, [loadNumbers]);

  const connected = instances.filter(i => i._state === 'connected');
  const warmingNow = connected.filter(i => i.warmup?.enabled && (i.warmup?.pct ?? 0) < 100);
  const ready = connected.filter(i => (i.warmup?.pct ?? 0) >= 100);
  const avgScore = connected.length === 0
    ? 0
    : Math.round(connected.reduce((acc, i) => acc + (i.warmup?.score ?? 32), 0) / connected.length);

  async function handleStart(inst) {
    setBusy(b => ({ ...b, [inst.id]: true }));
    try {
      const res = await whatsappApi.startWarmup(inst.id, inst.warmup?.config || {});
      toast('Aquecimento iniciado para ' + inst.name + '!');
      const patch = res?.data?.warmup || { enabled: true, pct: inst._pct };
      setInstances(prev => prev.map(x => x.id !== inst.id ? x : enrich({ ...x, warmup: { ...(x.warmup || {}), ...patch } })));
    } catch (e) {
      toast('Erro ao iniciar aquecimento: ' + (e?.message || 'Tente novamente.'));
    } finally {
      setBusy(b => ({ ...b, [inst.id]: false }));
    }
  }

  async function handleStop(inst) {
    setBusy(b => ({ ...b, [inst.id]: true }));
    try {
      const res = await whatsappApi.stopWarmup(inst.id);
      toast('Aquecimento pausado para ' + inst.name + '.');
      const patch = res?.data?.warmup || { enabled: false, pct: inst._pct };
      setInstances(prev => prev.map(x => x.id !== inst.id ? x : enrich({ ...x, warmup: { ...(x.warmup || {}), ...patch } })));
    } catch (e) {
      toast('Erro ao parar aquecimento: ' + (e?.message || 'Tente novamente.'));
    } finally {
      setBusy(b => ({ ...b, [inst.id]: false }));
    }
  }

  return (
    <>
      <style>{STYLES}</style>

      <PageHeader
        title="Aquecimento"
        sub="Saude dos numeros WhatsApp e protecao anti-ban automatica"
        actions={
          <Button variant="secondary" size="sm" onClick={loadNumbers}>
            Atualizar
          </Button>
        }
      />

      {/* Stats bar */}
      <div className="aq-stats">
        <div className="aq-stat">
          <div className="l">Conectados</div>
          <div className="v">{loading ? '…' : connected.length}</div>
          <div className="s">numeros ativos</div>
        </div>
        <div className="aq-stat">
          <div className="l">Aquecendo agora</div>
          <div className="v" style={{ color: warmingNow.length > 0 ? 'var(--brand-500)' : undefined }}>
            {loading ? '…' : warmingNow.length}
          </div>
          <div className="s">em progresso</div>
        </div>
        <div className="aq-stat">
          <div className="l">Prontos</div>
          <div className="v" style={{ color: ready.length > 0 ? '#25D366' : undefined }}>
            {loading ? '…' : ready.length}
          </div>
          <div className="s">para disparo</div>
        </div>
        <div className="aq-stat">
          <div className="l">Score medio</div>
          <div className="v" style={{ color: avgScore >= 80 ? '#25D366' : avgScore >= 50 ? 'var(--brand-500)' : undefined }}>
            {loading ? '…' : avgScore}
          </div>
          <div className="s">de 100</div>
        </div>
      </div>

      {/* Estado de loading / erro */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--ink-400)' }}>Carregando numeros…</div>
      )}
      {!loading && error && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: 'var(--danger,#DC2626)', marginBottom: 12 }}>{error}</p>
          <Button variant="secondary" size="sm" onClick={loadNumbers}>Tentar novamente</Button>
        </div>
      )}

      {!loading && !error && (
        <div className="aq-layout">
          {/* Coluna principal */}
          <div>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                Numeros em aquecimento
              </h3>
              {ready.length > 0 && (
                <span style={{ fontSize: 11, fontWeight: 600, color: '#25D366', background: '#DCFCE7', padding: '2px 8px', borderRadius: 999 }}>
                  {ready.length} pronto{ready.length > 1 ? 's' : ''} para disparo
                </span>
              )}
            </div>

            {connected.length === 0 ? (
              <EmptyState
                icon="phone"
                title="Nenhum numero conectado"
                text="Conecte uma instancia WhatsApp primeiro para iniciar o aquecimento."
                action={
                  <Button variant="primary" onClick={() => { window.location.href = '/v0/numbers'; }}>
                    Ir para Numeros
                  </Button>
                }
              />
            ) : (
              <div className="aq-list">
                {connected.map(inst => (
                  <InstCard
                    key={inst.id}
                    inst={inst}
                    busy={!!busy[inst.id]}
                    onStart={() => handleStart(inst)}
                    onStop={() => handleStop(inst)}
                  />
                ))}
              </div>
            )}

            {/* Gráfico de evolução */}
            <div className="aq-card aq-chart-wrap">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <h4 style={{ margin: 0 }}>Evolucao do score · ultimos 14 dias</h4>
                <span style={{ fontSize: 11, color: 'var(--ink-500)' }}>media todos os numeros</span>
              </div>
              <WarmupChart />
            </div>
          </div>

          {/* Coluna lateral */}
          <div className="aq-side">
            <WarmupSim />
            <GlobalConfig instances={instances} onApplied={() => loadNumbers()} />
          </div>
        </div>
      )}
    </>
  );
}
