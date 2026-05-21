import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Button, SocialProofToasts } from '../../ds/index.js';
import { useAuth } from '../../contexts/AuthContext';

const LANDING_CSS = `
  .lp { background: var(--ink-0); min-height: 100vh; color: var(--ink-900); }
  .lp-nav { position: sticky; top: 0; z-index: 30; background: rgba(255,255,255,.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--ink-150); }
  .lp-nav-inner { max-width: 1180px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; gap: 28px; }
  .lp-logo { display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 16px; letter-spacing: -.01em; }
  .lp-logo-mark { width: 28px; height: 28px; border-radius: 8px; background: var(--brand-500); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; }
  .lp-nav-links { display: flex; gap: 22px; font-size: 13.5px; color: var(--ink-600); }
  .lp-nav-links a { font-weight: 500; }
  .lp-nav-links a:hover { color: var(--brand-500); }
  .lp-nav-cta { margin-left: auto; display: flex; gap: 8px; align-items: center; }

  .lp-hero { padding: 64px 24px 56px; }
  .lp-hero-inner { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
  .lp-eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 5px 10px 5px 6px; background: var(--brand-50); color: var(--brand-600); border-radius: 999px; font-size: 12.5px; font-weight: 550; margin-bottom: 18px; border: 1px solid var(--brand-100); }
  .lp-eyebrow .pill { background: var(--brand-500); color: white; padding: 1px 8px; border-radius: 999px; font-size: 10.5px; letter-spacing: .03em; }
  .lp-h1 { font-size: 52px; font-weight: 800; letter-spacing: -.035em; line-height: 1.04; margin: 0 0 18px; }
  .lp-h1 em { font-style: normal; color: var(--brand-500); }
  .lp-sub { font-size: 17px; color: var(--ink-600); line-height: 1.55; max-width: 540px; margin: 0 0 28px; }
  .lp-cta-row { display: flex; gap: 10px; align-items: center; margin-bottom: 22px; }
  .lp-trust { display: flex; align-items: center; gap: 14px; font-size: 12.5px; color: var(--ink-500); }
  .lp-trust .stars { color: var(--brand-500); letter-spacing: 1px; }

  .lp-hero-visual {
    position: relative; aspect-ratio: 5/4;
    background: linear-gradient(135deg, #fff7f2, #fef0e8 60%, #fff7f2);
    border-radius: 20px; border: 1px solid var(--ink-150); padding: 18px;
    box-shadow: 0 20px 60px -20px rgba(255,106,61,.25), 0 4px 16px rgba(15,23,42,.04);
    overflow: hidden;
  }
  .lp-hero-visual::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 15% 15%, rgba(255,106,61,.12), transparent 50%), radial-gradient(circle at 85% 85%, rgba(37,211,102,.10), transparent 50%); }
  .lp-mock { position: relative; height: 100%; background: var(--ink-0); border-radius: 12px; box-shadow: var(--sh-lg); overflow: hidden; display: flex; flex-direction: column; }
  .lp-mock-top { height: 30px; background: var(--ink-50); border-bottom: 1px solid var(--ink-150); display: flex; align-items: center; gap: 5px; padding: 0 10px; }
  .lp-mock-top span { width: 8px; height: 8px; border-radius: 50%; background: var(--ink-300); }
  .lp-mock-body { flex: 1; display: grid; grid-template-columns: 56px 1fr; }
  .lp-mock-side { background: var(--side-bg); padding: 10px 6px; display: flex; flex-direction: column; gap: 6px; align-items: center; }
  .lp-mock-side i { width: 28px; height: 28px; border-radius: 6px; background: var(--side-bg-2); display: block; }
  .lp-mock-side i.on { background: var(--brand-500); }
  .lp-mock-main { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
  .lp-mock-row { display: flex; gap: 8px; }
  .lp-mock-kpi { flex: 1; padding: 10px; border: 1px solid var(--ink-200); border-radius: 8px; }
  .lp-mock-kpi b { display: block; font-size: 15px; letter-spacing: -.02em; }
  .lp-mock-kpi s { display: block; font-size: 9px; color: var(--ink-500); text-decoration: none; margin-bottom: 2px; }
  .lp-mock-funnel { flex: 1; border: 1px solid var(--ink-200); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px; }
  .lp-mock-funnel s { font-size: 9px; color: var(--ink-500); display: block; }
  .lp-mock-bar { height: 8px; border-radius: 4px; background: var(--ink-100); position: relative; overflow: hidden; }
  .lp-mock-bar i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; }

  .lp-float { position: absolute; background: white; border: 1px solid var(--ink-150); border-radius: 10px; padding: 9px 11px; box-shadow: var(--sh-lg); display: flex; align-items: center; gap: 9px; font-size: 11.5px; font-weight: 550; }
  .lp-float-wa { bottom: -14px; left: -14px; }
  .lp-float-wa .ic { width: 22px; height: 22px; border-radius: 50%; background: var(--wa-500); color: white; display: flex; align-items: center; justify-content: center; }
  .lp-float-deal { top: -14px; right: -14px; }
  .lp-float-deal .ic { width: 22px; height: 22px; border-radius: 50%; background: #ECFDF5; color: var(--success); display: flex; align-items: center; justify-content: center; }

  .lp-logos { padding: 28px 24px; border-top: 1px solid var(--ink-150); border-bottom: 1px solid var(--ink-150); background: var(--ink-50); }
  .lp-logos-inner { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; gap: 36px; flex-wrap: wrap; justify-content: center; }
  .lp-logos-label { font-size: 11.5px; color: var(--ink-500); font-weight: 600; letter-spacing: .12em; text-transform: uppercase; }
  .lp-logo-item { font-weight: 700; font-size: 15px; color: var(--ink-400); letter-spacing: -.01em; opacity: .9; }

  .lp-section { padding: 80px 24px; }
  .lp-section-inner { max-width: 1180px; margin: 0 auto; }
  .lp-section-head { text-align: center; max-width: 680px; margin: 0 auto 48px; }
  .lp-kicker { font-size: 12px; font-weight: 600; color: var(--brand-500); letter-spacing: .12em; text-transform: uppercase; margin-bottom: 12px; }
  .lp-h2 { font-size: 36px; font-weight: 700; letter-spacing: -.025em; margin: 0 0 12px; line-height: 1.1; }
  .lp-section-sub { font-size: 16px; color: var(--ink-600); }

  .pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .pillar { background: var(--ink-0); border: 1px solid var(--ink-200); border-radius: 16px; padding: 28px; }
  .pillar-ic { width: 44px; height: 44px; border-radius: 11px; background: var(--brand-50); color: var(--brand-500); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
  .pillar.green .pillar-ic { background: var(--wa-50); color: var(--wa-600); }
  .pillar.blue .pillar-ic { background: #EFF6FF; color: var(--info); }
  .pillar h3 { margin: 0 0 8px; font-size: 19px; font-weight: 700; letter-spacing: -.015em; }
  .pillar p { color: var(--ink-600); margin: 0 0 14px; line-height: 1.55; }
  .pillar ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
  .pillar li { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; color: var(--ink-700); }
  .pillar li svg { color: var(--brand-500); flex-shrink: 0; margin-top: 3px; }
  .pillar.green li svg { color: var(--wa-500); }
  .pillar.blue li svg { color: var(--info); }

  .lp-pricing { background: var(--ink-50); }
  .price-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: stretch; }
  .price-card { background: var(--ink-0); border: 1px solid var(--ink-200); border-radius: 16px; padding: 28px; display: flex; flex-direction: column; position: relative; }
  .price-card.featured { border-color: var(--brand-500); box-shadow: 0 16px 40px -12px rgba(255,106,61,.25); transform: scale(1.02); }
  .price-tag { position: absolute; top: -10px; left: 24px; background: var(--brand-500); color: white; font-size: 10.5px; font-weight: 700; padding: 4px 10px; border-radius: 999px; letter-spacing: .04em; }
  .price-name { font-size: 14px; font-weight: 600; letter-spacing: .02em; text-transform: uppercase; color: var(--ink-600); margin: 0 0 6px; }
  .price-amount { font-size: 40px; font-weight: 800; letter-spacing: -.03em; margin: 0; }
  .price-amount small { font-size: 14px; color: var(--ink-500); font-weight: 500; margin-left: 4px; }
  .price-desc { color: var(--ink-600); font-size: 13.5px; margin: 8px 0 22px; line-height: 1.5; }
  .price-feats { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 9px; flex: 1; font-size: 13.5px; }
  .price-feats li { display: flex; align-items: flex-start; gap: 9px; }
  .price-feats svg { color: var(--brand-500); flex-shrink: 0; margin-top: 3px; }

  .faq { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 8px; }
  .faq-item { background: var(--ink-0); border: 1px solid var(--ink-200); border-radius: 12px; overflow: hidden; }
  .faq-q { padding: 18px 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 15px; background: transparent; border: none; width: 100%; text-align: left; color: var(--ink-900); }
  .faq-a { padding: 0 20px 18px; color: var(--ink-600); line-height: 1.6; font-size: 14px; }
  .faq-item .chev { transition: transform .2s; color: var(--ink-500); }
  .faq-item.open .chev { transform: rotate(180deg); color: var(--brand-500); }

  .lp-cta-band { background: var(--ink-950); color: white; padding: 64px 24px; text-align: center; }
  .lp-cta-band h2 { font-size: 36px; font-weight: 700; letter-spacing: -.025em; margin: 0 0 12px; }
  .lp-cta-band p { color: #9aa3b2; font-size: 16px; margin: 0 0 24px; }

  .caa-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; position: relative; }
  .caa-step { background: var(--ink-0); border: 1px solid var(--ink-200); border-radius: 16px; padding: 24px; position: relative; transition: all .2s; }
  .caa-step:hover { border-color: var(--ink-300); transform: translateY(-2px); box-shadow: var(--sh-md); }
  .caa-num { position: absolute; top: 20px; right: 22px; font-size: 11px; font-weight: 700; color: var(--ink-300); letter-spacing: .06em; }
  .caa-ic { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
  .caa-step h3 { margin: 0 0 8px; font-size: 22px; font-weight: 800; letter-spacing: -.025em; }
  .caa-step p { margin: 0; color: var(--ink-600); font-size: 14px; line-height: 1.55; }
  @media (max-width: 880px) { .caa-grid { grid-template-columns: 1fr; } }

  .lp-footer { background: var(--ink-0); border-top: 1px solid var(--ink-200); padding: 48px 24px 24px; }
  .lp-footer-inner { max-width: 1180px; margin: 0 auto; }
  .lp-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; padding-bottom: 36px; border-bottom: 1px solid var(--ink-150); }
  .lp-footer h4 { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-700); margin: 0 0 14px; }
  .lp-footer ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .lp-footer a { color: var(--ink-600); font-size: 13.5px; }
  .lp-footer a:hover { color: var(--brand-500); }
  .lp-footer-bottom { display: flex; justify-content: space-between; padding-top: 20px; color: var(--ink-500); font-size: 12.5px; }

  /* Anti-overflow em grid items: força min-width:0 nos filhos do grid hero
     pra impedir que .lp-hero-visual (aspect-ratio 5/4) estoure a coluna. */
  .lp-hero-inner > * { min-width: 0; }
  .lp-hero-visual { max-width: 100%; }

  @media (max-width: 880px) {
    .lp-hero { padding: 48px 20px 40px; }
    .lp-hero-inner { grid-template-columns: 1fr; gap: 36px; }
    .lp-h1 { font-size: 36px; }
    .pillars, .price-grid { grid-template-columns: 1fr; }
    .lp-footer-grid { grid-template-columns: 1fr 1fr; }
    .lp-nav-links { display: none; }
    .lp-section { padding: 56px 20px; }
    .lp-h2 { font-size: 28px; }
    .price-card.featured { transform: none; }
  }

  @media (max-width: 480px) {
    .lp-hero { padding: 36px 16px 32px; }
    .lp-h1 { font-size: 30px; }
    .lp-sub { font-size: 15px; }
    .lp-cta-row { flex-direction: column; align-items: stretch; }
    .lp-cta-row button { width: 100%; }
    .lp-trust { flex-wrap: wrap; gap: 8px; }
    .lp-section { padding: 40px 16px; }
    .lp-h2 { font-size: 24px; }
    .lp-cta-band { padding: 48px 16px; }
    .lp-cta-band h2 { font-size: 26px; }
    .lp-footer { padding: 36px 16px 20px; }
    .lp-footer-grid { grid-template-columns: 1fr; gap: 24px; }
    .lp-footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
    .lp-logos { padding: 20px 16px; }
    .lp-logos-inner { gap: 20px; }
  }
`;

function FAQ() {
  const [open, setOpen] = useState(0);
  const items = [
    { q: 'Como o warmup de números funciona?', a: 'Quando você conecta uma nova instância via uazapi, o Ruptur inicia um ritmo controlado de mensagens (saudações entre números próprios, simulação de conversa real e crescimento gradual) por 7, 14 ou 30 dias. Isso constrói reputação no WhatsApp e reduz drasticamente o risco de banimento antes de você começar a disparar.' },
    { q: 'Posso enviar mensagens em massa para meus clientes?', a: 'Sim. As campanhas usam segmentação de tags, lead score e estágio do pipeline. O throttling respeita a saúde de cada número — instância recém-aquecida envia menos por hora que uma madura. Templates aprovados pela Meta passam livremente, e mensagens livres seguem regras de janela de 24h.' },
    { q: 'O que são os fluxos conversacionais?', a: 'É um editor visual onde você conecta nós (mensagem, espera, condição, atribui SDR, marca tag, gera link). Use para qualificar lead novo automaticamente, agendar reunião, responder dúvidas frequentes e fazer handoff para humano quando precisar.' },
    { q: 'Preciso usar meu número pessoal de WhatsApp?', a: 'Não. A Ruptur conecta via uazapi a números dedicados da sua empresa — você pode usar chips novos ou existentes. Funciona com WhatsApp Business e também com Cloud API oficial (Meta) no plano Scale. Seu número pessoal continua protegido.' },
    { q: 'Quantos números posso conectar e disparar por dia?', a: 'Starter: 1 número, ~300 msgs/dia após warmup. Growth: 3 números, ~1.500 msgs/dia. Scale: ilimitado, ~10k+ msgs/dia. O limite real depende da saúde de cada instância — números maduros disparam mais.' },
    { q: 'Posso importar leads de planilha ou de outro CRM?', a: 'Sim. Aceitamos CSV no onboarding e temos importadores para HubSpot, Pipedrive, RD Station. Mapeamos campos automaticamente e validamos formato de telefone brasileiro.' },
    { q: 'A Ruptur é compatível com a LGPD?', a: 'Sim. Hospedamos dados no Brasil (AWS São Paulo), temos DPA pronto, log de auditoria, anonimização sob demanda e retenção configurável por workspace. Opt-out automático em campanhas.' },
    { q: 'Preciso de cartão de crédito para começar?', a: 'Não. O teste de 14 dias é gratuito e sem cartão. Você só cadastra forma de pagamento ao final do trial — processamos via Getnet (Pix, cartão, boleto).' },
  ];
  return (
    <div className="faq">
      {items.map((it, i) => (
        <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
          <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{it.q}</span>
            <Icon name="chevDown" size={16} />
          </button>
          {open === i && <div className="faq-a">{it.a}</div>}
        </div>
      ))}
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const go = (r) => navigate(`/v0/${r}`);
  // Para o app real (Supabase auth + APIs reais): /login, /signup, /dashboard...
  const goReal = (r) => navigate(r.startsWith('/') ? r : `/${r}`);

  // Usuário já autenticado → redireciona para o dashboard automaticamente
  useEffect(() => {
    if (session) {
      navigate('/v0/dashboard', { replace: true });
    }
  }, [session, navigate]);
  return (
    <div className="lp">
      <style>{LANDING_CSS}</style>

      <header className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <div className="lp-logo-mark">R</div>
            <span>Ruptur OS</span>
          </div>
          <nav className="lp-nav-links">
            <a href="#produto">Produto</a>
            <a href="#caa">Como funciona</a>
            <a href="#personas" onClick={(e) => { e.preventDefault(); go('personas'); }}>Para quem</a>
            <a href="#precos">Preços</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="lp-nav-cta">
            <Button variant="ghost" size="sm" onClick={() => goReal('/login')}>Entrar</Button>
            <Button variant="primary" size="sm" onClick={() => goReal('/signup')}>Começar grátis</Button>
          </div>
        </div>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div>
            <div className="lp-eyebrow">
              <span className="pill">RUPTUR OS</span>
              <span>Sistema operacional de receita assistido por IA</span>
            </div>
            <h1 className="lp-h1">Vender e atender pelo <em>WhatsApp em escala</em> — sem queimar número, sem perder lead.</h1>
            <p className="lp-sub">O Ruptur OS conecta seus números, aquece com segurança, dispara fluxos que convertem e organiza sua receita em um CRM previsível — com IA trabalhando 24/7 por você.</p>
            <div className="lp-cta-row">
              <Button variant="primary" size="lg" icon="arrowRight" onClick={() => goReal('/signup')}>Começar teste de 14 dias</Button>
              <Button variant="ghost" size="lg" onClick={() => go('dashboard')}>Ver demo (mock) →</Button>
            </div>
            <div className="lp-trust">
              <span className="stars">★★★★★</span>
              <span><b style={{ color: 'var(--ink-900)' }}>4,8/5</b> — 412 avaliações</span>
              <span style={{ color: 'var(--ink-300)' }}>•</span>
              <span>Sem cartão · LGPD compliant</span>
            </div>
          </div>

          <div className="lp-hero-visual">
            <div className="lp-mock">
              <div className="lp-mock-top"><span /><span /><span /></div>
              <div className="lp-mock-body">
                <div className="lp-mock-side"><i className="on" /><i /><i /><i /><i /><i /></div>
                <div className="lp-mock-main">
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-500)' }}>DASHBOARD · Maio/2026</div>
                  <div className="lp-mock-row">
                    <div className="lp-mock-kpi"><s>MRR</s><b>R$ 84.2k</b></div>
                    <div className="lp-mock-kpi"><s>WIN-RATE</s><b style={{ color: 'var(--brand-500)' }}>34%</b></div>
                    <div className="lp-mock-kpi"><s>SQL</s><b>128</b></div>
                  </div>
                  <div className="lp-mock-row" style={{ flex: 1 }}>
                    <div className="lp-mock-funnel">
                      <s>RECEITA PREVISÍVEL · funil</s>
                      <div><div style={{ fontSize: 9, marginBottom: 2 }}>Seeds</div><div className="lp-mock-bar"><i style={{ width: '28%', background: '#10B981' }} /></div></div>
                      <div><div style={{ fontSize: 9, marginBottom: 2 }}>Nets</div><div className="lp-mock-bar"><i style={{ width: '62%', background: '#3B82F6' }} /></div></div>
                      <div><div style={{ fontSize: 9, marginBottom: 2 }}>Spears</div><div className="lp-mock-bar"><i style={{ width: '42%', background: 'var(--brand-500)' }} /></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lp-float lp-float-wa"><div className="ic"><Icon name="wa" size={12} /></div>+47 mensagens hoje</div>
            <div className="lp-float lp-float-deal"><div className="ic"><Icon name="check" size={12} /></div>R$ 24.000 fechado</div>
          </div>
        </div>
      </section>

      <section className="lp-logos">
        <div className="lp-logos-inner">
          <span className="lp-logos-label">+1.200 operações vendendo melhor</span>
          <span className="lp-logo-item">CERVEJARIA RIACHO</span>
          <span className="lp-logo-item">studio glow</span>
          <span className="lp-logo-item">IMOB · NORTE</span>
          <span className="lp-logo-item">VeloceCo</span>
          <span className="lp-logo-item">BemEstar+</span>
          <span className="lp-logo-item">PãoQuente</span>
        </div>
      </section>

      <section className="lp-section caa" id="caa" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div className="lp-section-inner">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="lp-kicker">O que é o Ruptur OS</div>
            <h2 className="lp-h2" style={{ maxWidth: 720, margin: '0 auto' }}>Trê<span style={{ color: 'var(--brand-500)' }}>s</span> verbos. Um sistema. Sua máquina de receita pelo WhatsApp.</h2>
          </div>
          <div className="caa-grid">
            <div className="caa-step">
              <div className="caa-num">01</div>
              <div className="caa-ic" style={{ background: 'var(--wa-50)', color: 'var(--wa-600)' }}><Icon name="wa" size={22} /></div>
              <h3>Conecta.</h3>
              <p>Pluga seus números de WhatsApp em minutos via uazapi ou Cloud API. Multi-instância, multi-time, um lugar só.</p>
            </div>
            <div className="caa-step">
              <div className="caa-num">02</div>
              <div className="caa-ic" style={{ background: 'var(--brand-50)', color: 'var(--brand-500)' }}><Icon name="fire" size={22} /></div>
              <h3>Aquece.</h3>
              <p>Warmup automático, throttling inteligente e kill switch anti-ban. Seus chips ganham reputação sem você pensar.</p>
            </div>
            <div className="caa-step">
              <div className="caa-num">03</div>
              <div className="caa-ic" style={{ background: '#F5F3FF', color: '#6D28D9' }}><Icon name="sparkles" size={22} /></div>
              <h3>Vende.</h3>
              <p>Fluxos conversacionais, dispara, qualifica, agenda e fecha — com IA sugerindo a próxima ação em cada lead.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section" id="pilares">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <div className="lp-kicker">Como funciona</div>
            <h2 className="lp-h2">Três pilares para uma máquina de vendas previsível</h2>
            <p className="lp-section-sub">Mesma metodologia das maiores operações B2B, adaptada ao jeito brasileiro de vender por WhatsApp.</p>
          </div>
          <div className="pillars">
            <div className="pillar green">
              <div className="pillar-ic"><Icon name="fire" size={22} /></div>
              <h3>Múltiplos números com warmup</h3>
              <p>Conecte vários chips via uazapi, aqueça cada número gradualmente e dispare sem queimar instância.</p>
              <ul>
                <li><Icon name="check" size={14} />Warmup automático em 7/14/30 dias</li>
                <li><Icon name="check" size={14} />Health score por número em tempo real</li>
                <li><Icon name="check" size={14} />Throttling inteligente anti-ban</li>
              </ul>
            </div>
            <div className="pillar">
              <div className="pillar-ic"><Icon name="broadcast" size={22} /></div>
              <h3>Disparos e fluxos conversacionais</h3>
              <p>Mande campanhas segmentadas em massa e construa chatbots que qualificam, agendam e fecham 24/7.</p>
              <ul>
                <li><Icon name="check" size={14} />Campanhas com segmentação e A/B</li>
                <li><Icon name="check" size={14} />Flow builder visual com handoff humano</li>
                <li><Icon name="check" size={14} />Respostas rápidas e templates aprovados</li>
              </ul>
            </div>
            <div className="pillar blue">
              <div className="pillar-ic"><Icon name="trendUp" size={22} /></div>
              <h3>CRM com SDR automation</h3>
              <p>Pipeline previsível, cadências, lead score e atribuição automática. Receita Previsível na prática.</p>
              <ul>
                <li><Icon name="check" size={14} />Funil Seeds/Nets/Spears</li>
                <li><Icon name="check" size={14} />Round-robin SDR com SLA &lt;15min</li>
                <li><Icon name="check" size={14} />Forecast ponderado e win-rate</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-pricing" id="precos">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <div className="lp-kicker">Preços</div>
            <h2 className="lp-h2">Cresça sem reescrever o stack</h2>
            <p className="lp-section-sub">Cobramos por workspace, não por usuário. Sem letra miúda.</p>
          </div>
          <div className="price-grid">
            <div className="price-card">
              <h3 className="price-name">Starter</h3>
              <p className="price-amount">R$ 197<small>/mês</small></p>
              <p className="price-desc">Para times iniciando a vender de forma estruturada.</p>
              <ul className="price-feats">
                <li><Icon name="check" size={14} />Até 3 usuários</li>
                <li><Icon name="check" size={14} />1 instância WhatsApp + warmup</li>
                <li><Icon name="check" size={14} />CRM e pipeline completos</li>
                <li><Icon name="check" size={14} />5.000 mensagens/mês</li>
                <li><Icon name="check" size={14} />Inbox unificada</li>
                <li><Icon name="check" size={14} />1 fluxo conversacional</li>
              </ul>
              <Button variant="secondary" onClick={() => goReal('/signup')}>Começar grátis</Button>
            </div>
            <div className="price-card featured">
              <span className="price-tag">Mais popular</span>
              <h3 className="price-name" style={{ color: 'var(--brand-500)' }}>Growth</h3>
              <p className="price-amount">R$ 497<small>/mês</small></p>
              <p className="price-desc">Para PMEs com SDR + AE e meta clara de crescimento.</p>
              <ul className="price-feats">
                <li><Icon name="check" size={14} />Até 10 usuários</li>
                <li><Icon name="check" size={14} />3 instâncias com warmup paralelo</li>
                <li><Icon name="check" size={14} />30.000 mensagens/mês</li>
                <li><Icon name="check" size={14} />Campanhas em massa + segmentação</li>
                <li><Icon name="check" size={14} />Fluxos ilimitados + handoff</li>
                <li><Icon name="check" size={14} />Cadências SDR + round-robin</li>
                <li><Icon name="check" size={14} />Forecast e win-rate</li>
              </ul>
              <Button variant="primary" onClick={() => goReal('/signup')}>Começar agora</Button>
            </div>
            <div className="price-card">
              <h3 className="price-name">Scale</h3>
              <p className="price-amount">R$ 1.297<small>/mês</small></p>
              <p className="price-desc">Times maduros com múltiplos squads, marca e franquias.</p>
              <ul className="price-feats">
                <li><Icon name="check" size={14} />Usuários ilimitados</li>
                <li><Icon name="check" size={14} />Instâncias ilimitadas + Cloud API Meta</li>
                <li><Icon name="check" size={14} />200.000+ mensagens/mês</li>
                <li><Icon name="check" size={14} />A/B testing em fluxos e campanhas</li>
                <li><Icon name="check" size={14} />API & webhooks abertos</li>
                <li><Icon name="check" size={14} />NPS, health score, CS</li>
                <li><Icon name="check" size={14} />SSO + auditoria + DPA</li>
              </ul>
              <Button variant="secondary" onClick={() => goReal('/signup')}>Falar com vendas</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section" id="faq">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <div className="lp-kicker">Perguntas frequentes</div>
            <h2 className="lp-h2">Tirando as dúvidas mais comuns</h2>
          </div>
          <FAQ />
        </div>
      </section>

      <section className="lp-cta-band">
        <h2>Pronto para parar de perder lead?</h2>
        <p>Conecte seu WhatsApp em 4 minutos e veja seu funil no mesmo dia.</p>
        <Button variant="primary" size="lg" icon="arrowRight" onClick={() => goReal('/signup')}>Começar teste de 14 dias</Button>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-grid">
            <div>
              <div className="lp-logo" style={{ marginBottom: 12 }}>
                <div className="lp-logo-mark">R</div>
                <span>Ruptur OS</span>
              </div>
              <p style={{ color: 'var(--ink-600)', fontSize: 13.5, margin: 0, maxWidth: 320 }}>Sistema operacional de receita assistido por IA para quem vende pelo WhatsApp.</p>
            </div>
            <div><h4>Produto</h4><ul><li><a href="#caa">Conecta</a></li><li><a href="#caa">Aquece</a></li><li><a href="#caa">Vende</a></li><li><a href="#precos">Preços</a></li></ul></div>
            <div><h4>Empresa</h4><ul><li><a href="#">Sobre</a></li><li><a href="#">Carreiras</a></li><li><a href="#">Blog</a></li><li><a href="#">Contato</a></li></ul></div>
            <div><h4>Legal</h4><ul><li><a href="#">Termos</a></li><li><a href="#">Privacidade</a></li><li><a href="#">LGPD</a></li><li><a href="#">Status</a></li></ul></div>
          </div>
          <div className="lp-footer-bottom">
            <span>© 2026 Ruptur Tecnologia Ltda · CNPJ 00.000.000/0001-00</span>
            <span>Feito em São Paulo · 🇧🇷</span>
          </div>
        </div>
      </footer>
      <SocialProofToasts />
    </div>
  );
}
