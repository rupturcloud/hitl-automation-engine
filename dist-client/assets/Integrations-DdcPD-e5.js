import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{B as r,d as i,i as a}from"./index-BPxAC5Go.js";var o=t(e(),1),s=n(),c=`
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
`;function l({token:e}){let[t,n]=(0,o.useState)(`idle`),[r,i]=(0,o.useState)(null);async function c(){n(`loading`),i(null);try{let t={"Content-Type":`application/json`};e&&(t.Authorization=`Bearer ${e}`);let r=await fetch(`/api/admin/uazapi/token/status`,{headers:t}),a=await r.json().catch(()=>({}));if(!r.ok)throw Error(a?.message||a?.error||`HTTP ${r.status}`);n(`ok`),i(a)}catch(e){n(`error`),i({message:e?.message||`Falha na conexão.`})}}return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsxs)(`div`,{className:`int-tier-row`,children:[(0,s.jsxs)(`div`,{className:`int-tier-info`,children:[(0,s.jsxs)(`div`,{className:`int-tier-name`,children:[(0,s.jsx)(`span`,{children:`🟢`}),`Free Tier (Teste)`]}),(0,s.jsx)(`div`,{className:`int-tier-host`,children:`free.uazapi.com`}),(0,s.jsx)(`div`,{className:`int-tier-desc`,children:`Instâncias expiram em 1h · Ideal para testar o produto`}),(0,s.jsxs)(`div`,{className:`int-status-row`,children:[(0,s.jsx)(`span`,{className:`int-status-dot ${t===`ok`?`active`:t===`error`?`error`:`active`}`}),(0,s.jsx)(`span`,{className:`int-status-label`,style:{color:t===`error`?`#B91C1C`:`#16A34A`},children:t===`ok`?`Conectado`:t===`error`?`Erro`:`Ativo`})]})]}),(0,s.jsx)(a,{variant:`secondary`,size:`sm`,onClick:c,disabled:t===`loading`,children:t===`loading`?`Testando…`:`Testar conexão`})]}),r&&(0,s.jsx)(`div`,{className:`int-result-box ${t===`ok`?`ok`:`err`}`,children:t===`ok`?`✅ Conexão OK · ${r?.status||JSON.stringify(r)}`:`❌ ${r?.message}`})]})}function u(){return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:14},children:[(0,s.jsx)(`div`,{className:`int-tier-row`,children:(0,s.jsxs)(`div`,{className:`int-tier-info`,children:[(0,s.jsxs)(`div`,{className:`int-tier-name`,children:[(0,s.jsx)(`span`,{children:`⭐`}),`Servidor Dedicado (Pago)`,(0,s.jsx)(`span`,{className:`int-coming-soon`,children:`Em breve`})]}),(0,s.jsx)(`div`,{className:`int-tier-desc`,children:`Conecte seu próprio servidor UAZAPI para eliminar as limitações de trial`})]})}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`label`,{className:`int-field-label`,children:`URL do servidor`}),(0,s.jsx)(`input`,{className:`int-input`,placeholder:`https://meu-uazapi.exemplo.com`,disabled:!0})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`label`,{className:`int-field-label`,children:`Admin Token`}),(0,s.jsx)(`input`,{className:`int-input`,type:`password`,placeholder:`••••••••••••••••`,disabled:!0})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(a,{variant:`primary`,size:`sm`,disabled:!0,children:`Salvar servidor`}),(0,s.jsx)(`span`,{style:{marginLeft:10,fontSize:12,color:`var(--ink-400)`},children:`Em breve — disponível no plano Pro`})]})]})}function d(){return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:14},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`label`,{className:`int-field-label`,children:`URL de recebimento`}),(0,s.jsx)(`input`,{className:`int-input`,placeholder:`https://minha-api.com/webhook`,disabled:!0})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`label`,{className:`int-field-label`,children:`Eventos`}),(0,s.jsx)(`div`,{className:`int-events-row`,children:[`messages`,`connection`,`qr`].map(e=>(0,s.jsxs)(`span`,{className:`int-event-chip`,children:[`✓ `,e]},e))})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(a,{variant:`primary`,size:`sm`,disabled:!0,children:`Salvar webhook`}),(0,s.jsx)(`span`,{style:{marginLeft:10,fontSize:12,color:`var(--ink-400)`},children:`Em breve`})]})]})}function f(){let e=(r?.())?.user?.token||window.__ruptur?.auth?.token||null;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:c}),(0,s.jsx)(i,{title:`Integrações`,sub:`Configure os provedores de WhatsApp e webhooks do sistema`}),(0,s.jsxs)(`div`,{className:`int-grid`,children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{className:`int-section-title`,children:`UAZAPI — Provedor WhatsApp`}),(0,s.jsxs)(`div`,{className:`int-card`,children:[(0,s.jsxs)(`div`,{className:`int-card-header`,children:[(0,s.jsx)(`div`,{className:`int-card-header-icon`,children:`🔌`}),(0,s.jsxs)(`div`,{className:`int-card-header-info`,children:[(0,s.jsx)(`div`,{className:`int-card-header-name`,children:`UAZAPI`}),(0,s.jsx)(`div`,{className:`int-card-header-sub`,children:`Instâncias WhatsApp via API · free tier e servidor dedicado`})]})]}),(0,s.jsxs)(`div`,{className:`int-card-body`,children:[(0,s.jsx)(l,{token:e}),(0,s.jsx)(`div`,{className:`int-divider`}),(0,s.jsx)(u,{})]})]})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{className:`int-section-title`,children:`Webhook Global`}),(0,s.jsxs)(`div`,{className:`int-card`,children:[(0,s.jsxs)(`div`,{className:`int-card-header`,children:[(0,s.jsx)(`div`,{className:`int-card-header-icon`,style:{background:`linear-gradient(135deg, #6366F1, #A78BFA)`},children:`⚡`}),(0,s.jsxs)(`div`,{className:`int-card-header-info`,children:[(0,s.jsx)(`div`,{className:`int-card-header-name`,children:`Webhook de entrada`}),(0,s.jsx)(`div`,{className:`int-card-header-sub`,children:`Receba eventos de todas as instâncias num único endpoint`})]})]}),(0,s.jsx)(`div`,{className:`int-card-body`,children:(0,s.jsx)(d,{})})]})]})]})]})}export{f as default};