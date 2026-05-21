import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Button, Card, KPI, Badge, AIChip, useToast, fireConfetti } from '../../ds/index.js';
import { ALERTS, ACTIVITIES, STAGES, DEALS } from '../../mocks/ruptur.js';

const DASH_CSS = `
  .cock-crumbs { font-size: 12px; color: var(--ink-500); margin-bottom: 6px; }
  .cock-title { font-size: 22px; font-weight: 800; letter-spacing: -.02em; margin: 0 0 4px; }
  .cock-sub { font-size: 13.5px; color: var(--ink-500); margin: 0 0 18px; }

  .act { background: linear-gradient(135deg, #0E1116 0%, #1A1F2A 100%); color: white; border-radius: 16px; padding: 24px 28px; position: relative; overflow: hidden; margin-bottom: 16px; }
  .act::before { content: ''; position: absolute; top: -50%; right: -10%; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(255,106,61,.18), transparent 60%); }
  .act-row { display: flex; align-items: center; gap: 20px; position: relative; }
  .act-text { flex: 1; }
  .act-eyebrow { font-size: 11px; font-weight: 700; color: var(--brand-500); letter-spacing: .14em; text-transform: uppercase; margin-bottom: 6px; }
  .act-h { font-size: 22px; font-weight: 800; letter-spacing: -.025em; margin: 0 0 8px; line-height: 1.15; }
  .act-h em { font-style: normal; color: var(--brand-500); font-variant-numeric: tabular-nums; }
  .act-bar { height: 8px; background: rgba(255,255,255,.08); border-radius: 999px; overflow: hidden; max-width: 420px; }
  .act-bar i { display: block; height: 100%; background: linear-gradient(90deg, var(--brand-500), #FFB088); border-radius: 999px; transition: width .6s ease; box-shadow: 0 0 16px rgba(255,106,61,.5); }

  .act-checkpoints { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: 18px; position: relative; }
  .act-checkpoints::before { content: ''; position: absolute; top: 16px; left: 16px; right: 16px; height: 2px; background: rgba(255,255,255,.08); }
  .act-check { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; }
  .act-check-c {
    width: 32px; height: 32px; border-radius: 50%;
    background: #1A1F2A; border: 2px solid rgba(255,255,255,.12);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,.4); position: relative; z-index: 1; transition: all .2s;
  }
  .act-check.done .act-check-c { background: var(--success); border-color: var(--success); color: white; box-shadow: 0 0 0 4px rgba(37,211,102,.18); }
  .act-check:not(.done):hover .act-check-c { border-color: var(--brand-500); color: var(--brand-500); }
  .act-check-l { font-size: 11px; font-weight: 600; text-align: center; line-height: 1.3; }
  .act-check.done .act-check-l { color: white; }
  .act-check:not(.done) .act-check-l { color: rgba(255,255,255,.55); }
  .act-check-pts { font-size: 9.5px; font-weight: 700; color: var(--brand-500); margin-top: 2px; letter-spacing: .04em; }

  .hoje { background: linear-gradient(135deg, #FFF7F2 0%, #FFFFFF 60%); border: 1px solid var(--brand-100); border-radius: 14px; padding: 20px 24px; margin-bottom: 16px; }
  .hoje-row { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
  .hoje-icon { width: 44px; height: 44px; border-radius: 11px; background: var(--brand-500); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .hoje-h { font-size: 16px; font-weight: 700; letter-spacing: -.01em; margin: 0; }
  .hoje-sub { font-size: 12.5px; color: var(--ink-500); margin-top: 2px; }
  .hoje-stats { display: flex; gap: 32px; margin-left: auto; align-items: center; flex-wrap: wrap; }
  .hoje-stat { display: flex; flex-direction: column; gap: 2px; min-width: 90px; }
  .hoje-stat .v { font-size: 22px; font-weight: 800; letter-spacing: -.025em; color: var(--brand-500); font-variant-numeric: tabular-nums; }
  .hoje-stat .l { font-size: 11px; font-weight: 600; color: var(--ink-600); letter-spacing: .02em; }
  .hoje-stat .t { font-size: 10.5px; font-weight: 600; color: var(--success); margin-top: 1px; }

  .revpred { background: linear-gradient(135deg, rgba(255,106,61,.08), rgba(139,92,246,.06)); border: 1px solid rgba(255,106,61,.18); border-radius: 12px; padding: 16px 18px; display: flex; align-items: center; gap: 14px; }
  .revpred-ic { width: 36px; height: 36px; border-radius: 9px; background: linear-gradient(135deg, var(--brand-500), #8B5CF6); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .revpred-text { flex: 1; }
  .revpred-text h4 { margin: 0 0 2px; font-size: 14px; font-weight: 700; letter-spacing: -.005em; }
  .revpred-text h4 b { color: var(--brand-500); font-variant-numeric: tabular-nums; }
  .revpred-text p { margin: 0; font-size: 12.5px; color: var(--ink-600); }

  .kpis { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 16px; }
  .kpis .card { padding: 14px 16px; }
  .kpis .kpi-value { font-size: 22px; }
  @media (max-width: 1280px) { .kpis { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 720px)  { .kpis { grid-template-columns: repeat(2, 1fr); } }

  .dash-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
  @media (max-width: 1100px) { .dash-grid { grid-template-columns: 1fr; } }

  /* Anti-overflow: filhos de grid/flex respeitam pai */
  .dash-grid > *, .act-row > *, .hoje-row > * { min-width: 0; }

  .cock-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; gap: 16px; flex-wrap: wrap; }
  .cock-header-text { flex: 1 1 auto; min-width: 0; }
  .cock-chips { display: flex; gap: 8px; flex-wrap: wrap; }

  @media (max-width: 640px) {
    .act { padding: 16px; }
    .act-row { flex-direction: column; align-items: flex-start; gap: 12px; }
    .act-bar { max-width: 100%; }
    .act-checkpoints { gap: 6px; }
    .hoje-stats { margin-left: 0; gap: 16px; }
    .funnel-row { grid-template-columns: 1fr 60px 50px; gap: 8px; font-size: 12px; }
    .cock-chips { width: 100%; }
  }

  @media (max-width: 480px) {
    .act-checkpoints { gap: 4px; }
  }

  .alert-list { display: flex; flex-direction: column; gap: 8px; }
  .alert-row { display: flex; gap: 10px; align-items: flex-start; padding: 10px; border: 1px solid var(--ink-150); border-radius: 8px; }
  .alert-row .ic { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .alert-row.danger .ic { background: #FEF2F2; color: var(--danger); }
  .alert-row.warning .ic { background: #FFFBEB; color: var(--warning); }
  .alert-row.info .ic { background: #EFF6FF; color: var(--info); }
  .alert-row.danger { border-color: #FEE2E2; }
  .alert-row .text { flex: 1; font-size: 13px; }
  .alert-row .text small { display: block; color: var(--ink-500); font-size: 11.5px; margin-top: 2px; }

  .activity-list { display: flex; flex-direction: column; }
  .activity-item { display: flex; gap: 11px; padding: 10px 0; border-bottom: 1px solid var(--ink-150); align-items: flex-start; }
  .activity-item:last-child { border-bottom: 0; }
  .activity-ic { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .activity-ic.wa { background: var(--wa-50); color: var(--wa-600); }
  .activity-ic.brand { background: var(--brand-50); color: var(--brand-600); }
  .activity-ic.info { background: #EFF6FF; color: var(--info); }
  .activity-ic.warning { background: #FFFBEB; color: var(--warning); }
  .activity-ic.neutral { background: var(--ink-100); color: var(--ink-600); }
  .activity-text { flex: 1; font-size: 13px; }
  .activity-text small { color: var(--ink-500); font-size: 11.5px; display: block; margin-top: 1px; }
  .activity-ago { font-size: 11.5px; color: var(--ink-400); flex-shrink: 0; }

  .funnel-row { display: grid; grid-template-columns: 1fr 80px 60px; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--ink-150); }
  .funnel-row:last-child { border-bottom: 0; }
  .funnel-label { font-size: 13px; font-weight: 550; display: flex; align-items: center; gap: 9px; }
  .funnel-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .funnel-track { height: 22px; background: var(--ink-100); border-radius: 6px; position: relative; overflow: hidden; }
  .funnel-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; padding-left: 10px; font-size: 11px; font-weight: 600; color: white; }
  .funnel-val { text-align: right; font-weight: 700; }
  .funnel-pct { text-align: right; font-size: 12px; color: var(--ink-500); }

  @keyframes pulse { 50% { opacity: .35; } }
`;

const ACTIVATION_KEY = 'rupturActivation';
function loadActivation() {
  try {
    const raw = localStorage.getItem(ACTIVATION_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    plan: 'growth',
    activation: 20,
    events: { wa_connected: true, warmup: false, first_campaign: false, first_lead: false, first_sale: false },
  };
}
function saveActivation(value) {
  try { localStorage.setItem(ACTIVATION_KEY, JSON.stringify(value)); } catch { /* ignore */ }
}

function FunnelChart() {
  const stages = [
    { label: 'Seeds (indicação)', v: 84,  w: 100, c: '#10B981' },
    { label: 'Nets (inbound)',    v: 156, w: 82,  c: '#3B82F6' },
    { label: 'Opps (SQL)',        v: 128, w: 60,  c: '#FF6A3D' },
    { label: 'Deals (ganhos)',    v: 24,  w: 15,  c: '#F59E0B' },
  ];
  return (
    <div>
      {stages.map((s, i) => (
        <div key={i} className="funnel-row">
          <div>
            <div className="funnel-label"><span className="funnel-dot" style={{ background: s.c }} />{s.label}</div>
            <div className="funnel-track" style={{ marginTop: 6 }}>
              <div className="funnel-fill" style={{ width: s.w + '%', background: s.c, transition: 'width .8s ease' }}>{s.w}%</div>
            </div>
          </div>
          <div className="funnel-val tabular">{s.v}</div>
          <div className="funnel-pct tabular">{i === 0 ? '—' : Math.round((s.v / stages[i - 1].v) * 100) + '%'}</div>
        </div>
      ))}
    </div>
  );
}

function StageBars() {
  const byStage = STAGES.filter(s => s.id !== 'lost').map(s => {
    const deals = DEALS.filter(d => d.stage === s.id);
    const sum = deals.reduce((a, b) => a + b.amount, 0);
    return { ...s, count: deals.length, sum };
  });
  const max = Math.max(...byStage.map(s => s.sum), 1);
  return (
    <div className="stack" style={{ gap: 8 }}>
      {byStage.map(s => (
        <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 100px', gap: 12, alignItems: 'center', fontSize: 13 }}>
          <span style={{ fontWeight: 550 }}>{s.label}</span>
          <div style={{ height: 18, background: 'var(--ink-100)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{
              width: (s.sum / max * 100) + '%', height: '100%',
              background: s.id === 'won' ? 'var(--success)' : 'var(--brand-500)',
              opacity: .85, borderRadius: 6, transition: 'width .3s',
            }} />
          </div>
          <span className="tabular" style={{ textAlign: 'right', fontWeight: 600 }}>
            R$ {(s.sum / 1000).toFixed(1)}k <span className="muted" style={{ fontWeight: 400 }}>· {s.count}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const go = (r) => navigate(`/v0/${r}`);
  const toast = useToast();

  const [activation, setActivation] = useState(loadActivation);
  const [stats, setStats] = useState({ replies: 137, qualified: 9, hours: 4.2, value: 8420 });

  useEffect(() => {
    const t = setInterval(() => {
      setStats(s => ({
        replies: s.replies + Math.floor(Math.random() * 3),
        qualified: s.qualified + (Math.random() > 0.7 ? 1 : 0),
        hours: +(s.hours + 0.1).toFixed(1),
        value: s.value + Math.floor(Math.random() * 240),
      }));
    }, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (activation.activation >= 60) return;
    const t = setInterval(() => {
      toast.push('Ative em 1 clique — deixa que a IA preenche 🚀');
    }, 35000);
    return () => clearInterval(t);
  }, [activation.activation, toast]);

  const triggerEvent = (key, points, label) => {
    if (activation.events[key]) return;
    const next = {
      ...activation,
      events: { ...activation.events, [key]: true },
      activation: Math.min(100, activation.activation + points),
    };
    setActivation(next);
    saveActivation(next);
    fireConfetti(80);
    toast.push(`Você destravou +${points}% — ${label}`);
  };

  const onRescue = () => {
    if (activation.activation >= 60) return;
    const events = { ...activation.events, warmup: true, first_campaign: true, first_lead: true };
    const score = Math.min(100, activation.activation + 60);
    const next = { ...activation, events, activation: score };
    setActivation(next);
    saveActivation(next);
    fireConfetti(140);
    toast.push('Ruptur preencheu pra você. +60% destravado 🎉');
  };

  const iconForActivity = (kind) => {
    switch (kind) {
      case 'wa': return 'wa';
      case 'note': return 'note';
      case 'mail': return 'mail';
      case 'phone': return 'phone';
      case 'alert': return 'alert';
      default: return 'sparkles';
    }
  };
  const iconForAlert = (kind) => {
    switch (kind) {
      case 'sla': return 'clock';
      case 'risk': return 'alert';
      case 'cs': return 'flag';
      default: return 'billing';
    }
  };
  const reasonForAlert = (kind) => {
    switch (kind) {
      case 'sla': return 'lead sem owner >15min';
      case 'risk': return 'deal sem atividade 7d';
      case 'cs': return 'NPS<7';
      default: return 'fatura D+4';
    }
  };

  return (
    <>
      <style>{DASH_CSS}</style>

      <div className="cock-crumbs">Cockpit</div>
      <div className="cock-header">
        <div className="cock-header-text">
          <h1 className="cock-title">Bom trabalho, Diego.</h1>
          <p className="cock-sub">17/mai/2026 · plano <b style={{ color: 'var(--brand-500)' }}>{(activation.plan || 'growth').toUpperCase()}</b> · cockpit ao vivo</p>
        </div>
        <div className="cock-chips">
          <AIChip text="IA respondeu 14 conversas hoje" tone="wa" />
          <AIChip text="3 leads qualificados auto" tone="purple" />
        </div>
      </div>

      <div className="act">
        <div className="act-row">
          <div className="act-text">
            <div className="act-eyebrow">🚀 Ativação · Linear-style gamification</div>
            <h2 className="act-h">Você está <em>{activation.activation}%</em> ativado</h2>
            <div className="act-bar"><i style={{ width: activation.activation + '%' }} /></div>
            <p style={{ margin: '10px 0 0', fontSize: 12.5, color: 'rgba(255,255,255,.55)' }}>
              {activation.activation < 100
                ? `Faltam ${100 - activation.activation}% pra ativação total. Clique nos checkpoints abaixo pra simular.`
                : 'Ativação completa. Você operacionalizou o Ruptur OS 🎉'}
            </p>
          </div>
        </div>

        <div className="act-checkpoints">
          {[
            { k: 'wa_connected',   l: 'WhatsApp conectado', p: 20, ic: 'wa' },
            { k: 'warmup',         l: 'Warmup ativo',       p: 15, ic: 'fire' },
            { k: 'first_campaign', l: '1ª campanha',        p: 20, ic: 'broadcast' },
            { k: 'first_lead',     l: '1º lead recebido',   p: 25, ic: 'leads' },
            { k: 'first_sale',     l: '1ª venda',           p: 20, ic: 'billing' },
          ].map(c => (
            <div
              key={c.k}
              className={`act-check ${activation.events[c.k] ? 'done' : ''}`}
              onClick={() => triggerEvent(c.k, c.p, c.l)}
              title={activation.events[c.k] ? 'Concluído' : `Falta ${c.p}% pra ativar isso`}
            >
              <div className="act-check-c">
                {activation.events[c.k] ? <Icon name="check" size={14} stroke={3} /> : <Icon name={c.ic} size={13} />}
              </div>
              <div className="act-check-l">{c.l}</div>
              <div className="act-check-pts">+{c.p}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hoje">
        <div className="hoje-row">
          <div className="hoje-icon"><Icon name="sparkles" size={20} /></div>
          <div>
            <h3 className="hoje-h">Hoje o Ruptur trabalhou por você:</h3>
            <div className="hoje-sub">Equivale a um SDR full-time · atualiza a cada 30 segundos</div>
          </div>
          <div className="hoje-stats">
            <div className="hoje-stat"><div className="v tabular">{stats.replies}</div><div className="l">respostas IA</div><div className="t">+22 vs ontem</div></div>
            <div className="hoje-stat"><div className="v tabular">{stats.qualified}</div><div className="l">leads qualificados</div><div className="t">+3 vs ontem</div></div>
            <div className="hoje-stat"><div className="v tabular">{stats.hours}h</div><div className="l">economizadas</div><div className="t">+0,8h vs ontem</div></div>
            <div className="hoje-stat"><div className="v tabular">R$ {stats.value.toLocaleString('pt-BR')}</div><div className="l">potencial criado</div><div className="t">+R$ 1.240</div></div>
          </div>
          <Button variant="secondary" size="sm" icon="arrowRight">Ver detalhes</Button>
        </div>
      </div>

      <div className="kpis">
        <KPI label="MRR"               value="R$ 84.2k" delta="+12,4%"  deltaTone="up" hint="vs abril" />
        <KPI label="Leads novos"       value="248"      delta="+38"      hint="esta semana" />
        <KPI label="SQL"               value="128"      delta="+22"      hint="taxa 51%" />
        <KPI label="Win-rate"          value="34%"      delta="+3,1 pp"  hint="média ano: 31%" />
        <KPI label="Conversas abertas" value="42"       delta="+7"       hint="agora" />
        <KPI label="Score médio chips" value="86"       delta="+4 pp"    hint="saúde geral" accent="var(--success)" />
      </div>

      <div className="revpred" style={{ marginBottom: 16 }}>
        <div className="revpred-ic"><Icon name="trendUp" size={18} /></div>
        <div className="revpred-text">
          <h4>Você está a <b>R$ 3.200</b> do seu potencial de receita esta semana.</h4>
          <p>Aquecer mais 2 números pode te levar lá em ~14 dias.</p>
        </div>
        <Button variant="primary" size="sm" icon="arrowRight" onClick={() => go('numbers')}>Aquecer agora</Button>
      </div>

      <div className="dash-grid">
        <div className="stack" style={{ gap: 16 }}>
          <Card title="Receita Previsível — Seeds / Nets / Opps / Deals">
            <FunnelChart />
          </Card>

          <Card title="Pipeline por estágio" action={<Button variant="ghost" size="sm" onClick={() => go('pipeline')}>Ver CRM →</Button>}>
            <StageBars />
          </Card>
        </div>

        <div className="stack" style={{ gap: 16 }}>
          <Card title="Alertas IA & SLA" action={<Badge tone="danger">3 críticos</Badge>}>
            <div className="alert-list">
              {ALERTS.map((a, i) => (
                <div key={i} className={`alert-row ${a.tone}`}>
                  <div className="ic"><Icon name={iconForAlert(a.kind)} size={14} /></div>
                  <div className="text">{a.text}<small>regra: {reasonForAlert(a.kind)}</small></div>
                  <Button variant="ghost" size="sm">{a.cta}</Button>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Atividade em tempo real"
            action={
              <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 1.4s infinite' }} />
                ao vivo
              </span>
            }
          >
            <div className="activity-list">
              {ACTIVITIES.map(a => (
                <div key={a.id} className="activity-item">
                  <div className={`activity-ic ${a.tone}`}><Icon name={iconForActivity(a.kind)} size={12} /></div>
                  <div className="activity-text">{a.text}<small>{a.who}</small></div>
                  <span className="activity-ago">{a.ago}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {activation.activation < 60 && (
        <div style={{
          position: 'fixed', right: 24, bottom: 24, zIndex: 90,
          background: 'linear-gradient(135deg, var(--brand-500), #FF8866)',
          color: 'white', padding: '14px 16px 14px 14px',
          borderRadius: 14, boxShadow: '0 14px 36px rgba(255,106,61,.36)',
          display: 'flex', gap: 12, alignItems: 'center', maxWidth: 380,
          animation: 'ar-bob 2.4s ease-in-out infinite',
        }}>
          <style>{`@keyframes ar-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="sparkles" size={18} />
          </div>
          <div style={{ flex: 1, fontSize: 13, lineHeight: 1.45 }}>
            <b style={{ fontWeight: 700, fontSize: 13.5 }}>Ative em 1 clique</b><br />
            <span style={{ opacity: .92 }}>Faltam {100 - activation.activation}% pra receita rolar. A IA preenche.</span>
          </div>
          <button onClick={onRescue} style={{
            background: 'white', color: 'var(--brand-500)', border: 'none',
            padding: '9px 14px', borderRadius: 9, fontWeight: 700, fontSize: 13,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            Ativar agora
          </button>
        </div>
      )}
    </>
  );
}
