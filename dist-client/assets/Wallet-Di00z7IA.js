import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{t as r}from"./credit-card-C96PRePO.js";import{t as i}from"./history-DyOR3cb4.js";import{n as a,t as o}from"./errorHelper-pZOAc_yK.js";import{t as s}from"./plus-pbL6Jqcj.js";import{t as c}from"./search-DGVAnRxK.js";import{t as l}from"./x-BVVFqqBf.js";import{B as u,E as d,S as f,_ as p,g as m,h,j as g,y as _,z as v}from"./index-BPxAC5Go.js";var y=g(`arrow-down-left`,[[`path`,{d:`M17 7 7 17`,key:`15tmo1`}],[`path`,{d:`M17 17H7V7`,key:`1org7z`}]]),b=g(`arrow-right-left`,[[`path`,{d:`m16 3 4 4-4 4`,key:`1x1c3m`}],[`path`,{d:`M20 7H4`,key:`zbl0bi`}],[`path`,{d:`m8 21-4-4 4-4`,key:`h9nckh`}],[`path`,{d:`M4 17h16`,key:`g4d7ey`}]]),x=g(`arrow-up-right`,[[`path`,{d:`M7 7h10v10`,key:`1tivn9`}],[`path`,{d:`M7 17 17 7`,key:`1vkiza`}]]),S=t(e(),1),C=n(),w=[`ALL`,`credit`,`debit`,`campaign`,`refund`],T={ALL:`Todos`,credit:`Recargas`,debit:`Consumo`,campaign:`Campanhas`,refund:`Estornos`},E={credit:{bg:`rgba(0,255,136,0.08)`,border:`rgba(0,255,136,0.2)`,color:`#00ff88`,icon:(0,C.jsx)(y,{size:22})},debit:{bg:`rgba(255,0,122,0.08)`,border:`rgba(255,0,122,0.2)`,color:`#ff007a`,icon:(0,C.jsx)(x,{size:22})},campaign:{bg:`rgba(112,0,255,0.1)`,border:`rgba(112,0,255,0.25)`,color:`#a855f7`,icon:(0,C.jsx)(b,{size:22})},refund:{bg:`rgba(0,242,255,0.08)`,border:`rgba(0,242,255,0.2)`,color:`#00f2ff`,icon:(0,C.jsx)(_,{size:22})}},D=()=>{let{tenantId:e}=u(),[t,n]=(0,S.useState)(null),[g,y]=(0,S.useState)([]),[b,x]=(0,S.useState)(0),[D,O]=(0,S.useState)(!0),[k,A]=(0,S.useState)(`ALL`),[j,M]=(0,S.useState)(null),[N,P]=(0,S.useState)([]),[F,I]=(0,S.useState)(null),[L,R]=(0,S.useState)(!1),[z,B]=(0,S.useState)(null),V=(0,S.useCallback)(async()=>{O(!0);try{let[t,r]=await Promise.allSettled([v.getDashboardStats(e),v.getWalletHistory(e)]);t.status===`fulfilled`&&t.value&&(n(t.value.walletBalance??0),x(t.value.sendsToday??0)),r.status===`fulfilled`&&Array.isArray(r.value)&&y(r.value)}catch(e){console.error(`[Wallet] Erro ao carregar dados:`,e)}finally{O(!1)}},[e]),H=(0,S.useCallback)(async()=>{try{let e=await v.getPackages(),t=e.packages||e;P(typeof t==`object`&&!Array.isArray(t)?Object.entries(t).map(([e,t])=>({id:e,...t})):t)}catch(e){console.error(`[Wallet] Erro ao carregar pacotes:`,e)}},[]);(0,S.useEffect)(()=>{e&&Promise.resolve().then(()=>{V(),H()})},[e,V,H]);let U=(0,S.useCallback)(async()=>{if(F){R(!0);try{let t=await v.createCheckout(e,F);t.checkoutUrl||t.redirect_url?window.location.href=t.checkoutUrl||t.redirect_url:(M(null),I(null),B({type:`success`,message:`Créditos adicionados com sucesso!`}),V())}catch(e){B({type:`error`,message:o(e,`wallet`)})}finally{R(!1)}}},[V,F,e]),W=g.filter(e=>k===`ALL`?!0:e.type===k),G=g.reduce((e,t)=>e+(t.amount||0),0);return(0,C.jsxs)(`div`,{className:`wallet-page`,children:[(0,C.jsxs)(`header`,{className:`page-header`,children:[(0,C.jsxs)(`div`,{className:`header-info`,children:[(0,C.jsxs)(`h1`,{children:[`Minha `,(0,C.jsx)(`span`,{children:`Carteira`})]}),(0,C.jsx)(`p`,{children:`Gerencie seus créditos e visualize o histórico de consumo.`})]}),(0,C.jsxs)(`button`,{className:`btn-primary`,onClick:()=>M(`buy`),children:[(0,C.jsx)(s,{size:18}),` Adicionar Créditos`]})]}),(0,C.jsxs)(`div`,{className:`wallet-summary-grid`,children:[(0,C.jsxs)(h.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:`balance-card glass neon-border`,children:[(0,C.jsx)(`div`,{className:`balance-glow`}),(0,C.jsxs)(`div`,{className:`balance-content`,children:[(0,C.jsx)(`p`,{className:`balance-label`,children:`Saldo Disponível`}),(0,C.jsxs)(`div`,{className:`balance-value-row`,children:[(0,C.jsx)(p,{size:36,className:`neon-text-cyan`,fill:`currentColor`}),(0,C.jsx)(`span`,{className:`balance-number`,children:D?`—`:(t??0).toLocaleString(`pt-BR`)}),(0,C.jsx)(`span`,{className:`balance-unit`,children:`créditos`})]}),(0,C.jsxs)(`div`,{className:`balance-badges`,children:[(0,C.jsxs)(`span`,{className:`badge-pill green`,children:[(0,C.jsx)(_,{size:11}),` ATIVO`]}),(0,C.jsxs)(`span`,{className:`badge-pill ghost`,children:[(0,C.jsx)(r,{size:11}),` Conta Verificada`]})]})]}),(0,C.jsxs)(`button`,{className:`btn-buy`,onClick:()=>M(`buy`),children:[(0,C.jsx)(r,{size:16}),` Comprar Créditos`]})]}),(0,C.jsxs)(`div`,{className:`wallet-side-cards`,children:[(0,C.jsxs)(h.div,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},transition:{delay:.1},className:`side-card glass`,children:[(0,C.jsx)(`span`,{className:`side-card-label`,children:`Enviados Hoje`}),(0,C.jsx)(`span`,{className:`side-card-value`,children:D?`—`:b.toLocaleString(`pt-BR`)}),(0,C.jsx)(`span`,{className:`side-card-sub`,children:`mensagens`})]}),(0,C.jsxs)(h.div,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},transition:{delay:.15},className:`side-card glass purple`,children:[(0,C.jsx)(`span`,{className:`side-card-label`,children:`Volume Total`}),(0,C.jsx)(`span`,{className:`side-card-value`,children:D?`—`:G.toLocaleString(`pt-BR`)}),(0,C.jsx)(`span`,{className:`side-card-sub`,children:`créditos movimentados`})]}),(0,C.jsxs)(h.div,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},transition:{delay:.2},className:`side-card glass accent`,children:[(0,C.jsx)(`span`,{className:`side-card-label`,children:`Custo Estimado`}),(0,C.jsxs)(`span`,{className:`side-card-value`,children:[`R$ `,((b||0)*.05).toFixed(2)]}),(0,C.jsx)(`span`,{className:`side-card-sub`,children:`hoje`})]})]})]}),(0,C.jsxs)(`section`,{className:`transactions-section glass`,children:[(0,C.jsxs)(`div`,{className:`tx-header`,children:[(0,C.jsxs)(`div`,{className:`tx-title-row`,children:[(0,C.jsx)(`div`,{className:`tx-title-icon`,children:(0,C.jsx)(i,{size:20})}),(0,C.jsx)(`h3`,{children:`Extrato de Operações`})]}),(0,C.jsx)(`div`,{className:`tx-tabs`,children:w.map(e=>(0,C.jsx)(`button`,{className:`tx-tab ${k===e?`active`:``}`,onClick:()=>A(e),children:T[e]},e))})]}),(0,C.jsx)(`div`,{className:`tx-list`,children:D?(0,C.jsx)(`div`,{className:`loading-state`,children:`Carregando histórico...`}):W.length===0?(0,C.jsxs)(`div`,{className:`empty-state`,children:[(0,C.jsx)(c,{size:36}),(0,C.jsx)(`p`,{children:`Nenhuma transação encontrada`})]}):(0,C.jsx)(m,{mode:`popLayout`,children:W.map(e=>{let t=E[e.type]||E.debit,n=e.type===`credit`||e.type===`refund`;return(0,C.jsxs)(h.div,{initial:{opacity:0,x:-16},animate:{opacity:1,x:0},exit:{opacity:0,scale:.97},className:`tx-item`,children:[(0,C.jsx)(`div`,{className:`tx-icon-wrap`,style:{background:t.bg,border:`1px solid ${t.border}`,color:t.color},children:t.icon}),(0,C.jsxs)(`div`,{className:`tx-details`,children:[(0,C.jsx)(`span`,{className:`tx-desc`,children:e.description||e.reason||`Transação`}),(0,C.jsxs)(`div`,{className:`tx-meta`,children:[(0,C.jsx)(`span`,{className:`tx-date`,children:e.date||e.createdAt?new Date(e.date||e.createdAt).toLocaleString(`pt-BR`):`—`}),(0,C.jsx)(`span`,{className:`tx-type-badge`,style:{color:t.color,borderColor:t.border},children:T[e.type]||e.type})]})]}),(0,C.jsxs)(`div`,{className:`tx-amount`,style:{color:n?`#00ff88`:`#ff6fa8`},children:[n?`+`:`-`,(e.amount||0).toLocaleString(`pt-BR`),(0,C.jsx)(`span`,{className:`tx-amount-unit`,children:` cr`})]})]},e.id)})})})]}),(0,C.jsx)(m,{children:j===`buy`&&(0,C.jsx)(h.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:`wizard-overlay`,children:(0,C.jsxs)(h.div,{initial:{opacity:0,scale:.92,y:24},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.92,y:24},className:`buy-modal glass`,children:[(0,C.jsxs)(`div`,{className:`buy-modal-header`,children:[(0,C.jsx)(`h3`,{children:`Adicionar Créditos`}),(0,C.jsx)(`button`,{className:`close-btn`,onClick:()=>M(null),children:(0,C.jsx)(l,{size:18})})]}),(0,C.jsx)(`p`,{className:`buy-modal-sub`,children:`Escolha um pacote de créditos para recarga.`}),(0,C.jsx)(`div`,{className:`credit-presets`,children:N.length>0?N.map(e=>(0,C.jsxs)(`button`,{className:`preset-btn ${F===e.id?`active`:``}`,onClick:()=>I(e.id),children:[(0,C.jsx)(`span`,{className:`preset-credits`,children:(e.credits||0).toLocaleString(`pt-BR`)}),(0,C.jsx)(`span`,{className:`preset-label`,children:`créditos`}),(0,C.jsxs)(`span`,{className:`preset-price`,children:[`R$ `,((e.price_cents||0)/100).toFixed(2).replace(`.`,`,`)]})]},e.id)):(0,C.jsx)(`div`,{className:`loading-state`,style:{gridColumn:`1/-1`},children:`Carregando pacotes...`})}),(0,C.jsxs)(`div`,{className:`buy-info-box`,children:[(0,C.jsx)(f,{size:18,style:{color:`#00ff88`,flexShrink:0}}),(0,C.jsxs)(`p`,{children:[`Compra segura pelo `,(0,C.jsx)(`strong`,{children:`gateway ativo`}),`. Quando houver checkout externo configurado, você será redirecionado; após confirmação, os créditos entram automaticamente.`]})]}),(0,C.jsxs)(`div`,{className:`wizard-actions`,children:[(0,C.jsx)(`button`,{className:`btn-secondary`,onClick:()=>{M(null),I(null)},children:`Cancelar`}),(0,C.jsx)(`button`,{className:`btn-primary`,onClick:U,disabled:!F||L,children:L?(0,C.jsx)(d,{size:16,className:`spin`}):(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(r,{size:16}),` Comprar`]})})]})]})})}),z&&(0,C.jsx)(a,{type:z.type,message:z.message,onClose:()=>B(null)}),(0,C.jsx)(`style`,{children:`
        .wallet-page { display: flex; flex-direction: column; gap: 28px; }

        /* Summary Grid */
        .wallet-summary-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 20px;
        }

        /* Balance Card */
        .balance-card {
          padding: 40px;
          border-radius: var(--radius-xl);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, rgba(112,0,255,0.1) 0%, rgba(0,242,255,0.08) 100%);
          position: relative;
          overflow: hidden;
        }
        .balance-glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 20% 50%, rgba(0,242,255,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .balance-content { position: relative; z-index: 1; }
        .balance-label {
          font-size: 0.7rem; font-weight: 700;
          color: var(--text-muted); text-transform: uppercase;
          letter-spacing: 2px; margin-bottom: 16px; display: block;
        }
        .balance-value-row { display: flex; align-items: center; gap: 14px; }
        .balance-number { font-size: 3.2rem; font-weight: 900; line-height: 1; font-family: 'Outfit', sans-serif; }
        .balance-unit { font-size: 1rem; color: var(--text-muted); align-self: flex-end; margin-bottom: 6px; }
        .balance-badges { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
        .badge-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 100px;
          font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .badge-pill.green { background: rgba(0,255,136,0.1); color: var(--success); border: 1px solid rgba(0,255,136,0.3); }
        .badge-pill.ghost { background: rgba(255,255,255,0.04); color: var(--text-muted); border: 1px solid var(--border-glass); }

        .btn-buy {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 8px;
          background: white; color: #0a0a0b;
          border: none; padding: 14px 24px; border-radius: var(--radius-md);
          font-weight: 800; font-size: 0.85rem; cursor: pointer;
          transition: var(--transition); white-space: nowrap;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 8px 24px rgba(255,255,255,0.1);
        }
        .btn-buy:hover { background: var(--primary); color: white; transform: translateY(-2px); box-shadow: 0 12px 30px var(--primary-glow); }

        /* Side Cards */
        .wallet-side-cards { display: flex; flex-direction: column; gap: 14px; }
        .side-card {
          padding: 22px 24px; border-radius: var(--radius-lg);
          display: flex; flex-direction: column; gap: 4px;
          flex: 1;
        }
        .side-card.purple { border-color: rgba(112,0,255,0.2); background: rgba(112,0,255,0.05); }
        .side-card.accent { border-color: rgba(255,0,122,0.2); background: rgba(255,0,122,0.05); }
        .side-card-label { font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .side-card-value { font-size: 1.8rem; font-weight: 800; font-family: 'Outfit', sans-serif; line-height: 1.1; margin-top: 4px; }
        .side-card-sub { font-size: 0.75rem; color: var(--text-muted); }

        /* Transactions */
        .transactions-section { padding: 0; border-radius: var(--radius-xl); overflow: hidden; }
        .tx-header {
          padding: 24px 28px;
          border-bottom: 1px solid var(--border-glass);
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(255,255,255,0.01);
          flex-wrap: wrap; gap: 16px;
        }
        .tx-title-row { display: flex; align-items: center; gap: 12px; }
        .tx-title-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(255,255,255,0.04); border: 1px solid var(--border-glass);
          display: flex; align-items: center; justify-content: center; color: var(--text-muted);
        }
        .tx-title-row h3 { font-size: 0.95rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }

        .tx-tabs {
          display: flex; gap: 4px;
          background: rgba(0,0,0,0.3); padding: 4px;
          border-radius: 12px; border: 1px solid var(--border-glass);
        }
        .tx-tab {
          padding: 6px 14px; border-radius: 8px;
          border: none; background: transparent;
          color: var(--text-muted); font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
          cursor: pointer; transition: 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .tx-tab.active { background: rgba(255,255,255,0.08); color: white; }
        .tx-tab:hover:not(.active) { color: rgba(255,255,255,0.5); }

        .tx-list { padding: 12px 16px; max-height: 500px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }

        .tx-item {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 18px; border-radius: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          transition: 0.15s; cursor: default;
        }
        .tx-item:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); }
        .tx-icon-wrap { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tx-details { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .tx-desc { font-weight: 700; font-size: 0.92rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .tx-meta { display: flex; align-items: center; gap: 10px; }
        .tx-date { font-size: 0.75rem; color: var(--text-muted); }
        .tx-type-badge { font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 100px; border: 1px solid; text-transform: uppercase; }
        .tx-amount { font-size: 1.1rem; font-weight: 900; font-family: 'Outfit', monospace; white-space: nowrap; }
        .tx-amount-unit { font-size: 0.7rem; font-weight: 600; opacity: 0.6; }

        /* Buy Modal */
        .buy-modal {
          width: 100%; max-width: 480px;
          padding: 36px; border-radius: 28px;
          background: rgba(10,10,20,0.95);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .buy-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .buy-modal-header h3 { font-size: 1.4rem; font-weight: 800; }
        .buy-modal-sub { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px; }
        .close-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255,255,255,0.05); border: none;
          color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: 0.15s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.1); color: white; }

        .credit-presets { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .preset-btn {
          padding: 16px; border-radius: 14px;
          border: 1px solid var(--border-glass);
          background: rgba(255,255,255,0.03);
          color: white; cursor: pointer; transition: 0.15s;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          font-family: 'Inter', sans-serif;
        }
        .preset-btn:hover { border-color: var(--primary); background: rgba(0,242,255,0.05); }
        .preset-btn.active { border-color: var(--primary); background: rgba(0,242,255,0.1); }
        .preset-credits { font-size: 1.4rem; font-weight: 900; font-family: 'Outfit', sans-serif; }
        .preset-label { font-size: 0.7rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }
        .preset-price { font-size: 0.85rem; font-weight: 700; color: var(--primary); margin-top: 4px; }

        .buy-info-box {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px; border-radius: 12px;
          background: rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.12);
          margin: 20px 0;
        }
        .buy-info-box p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }
        .buy-info-box strong { color: #00ff88; }
        @keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .8s linear infinite}

        @media (max-width: 900px) {
          .wallet-summary-grid { grid-template-columns: 1fr; }
          .wallet-side-cards { flex-direction: row; }
        }
      `})]})};export{D as default};