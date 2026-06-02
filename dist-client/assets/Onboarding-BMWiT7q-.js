import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{t as r}from"./circle-alert-DfP4N4b3.js";import{t as i}from"./credit-card-C96PRePO.js";import{t as a}from"./message-square-5IXhojL7.js";import{t as o}from"./qr-code-Ccp2vdr4.js";import{t as s}from"./sparkles-B5GycDc-.js";import{A as c,B as l,C as u,E as d,I as f,S as p,T as m,_ as h,b as g,g as _,h as v,j as y,k as b,z as x}from"./index-BPxAC5Go.js";var S=y(`arrow-left`,[[`path`,{d:`m12 19-7-7 7-7`,key:`1l729n`}],[`path`,{d:`M19 12H5`,key:`x3x0zl`}]]),C=y(`crown`,[[`path`,{d:`M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z`,key:`1vdc57`}],[`path`,{d:`M5 21h14`,key:`11awu3`}]]),w=y(`target`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`circle`,{cx:`12`,cy:`12`,r:`6`,key:`1vlfrh`}],[`circle`,{cx:`12`,cy:`12`,r:`2`,key:`1c9p78`}]]),T=y(`trophy`,[[`path`,{d:`M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978`,key:`1n3hpd`}],[`path`,{d:`M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978`,key:`rfe1zi`}],[`path`,{d:`M18 9h1.5a1 1 0 0 0 0-5H18`,key:`7xy6bh`}],[`path`,{d:`M4 22h16`,key:`57wxv0`}],[`path`,{d:`M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z`,key:`1mhfuq`}],[`path`,{d:`M6 9H4.5a1 1 0 0 1 0-5H6`,key:`tex48p`}]]),E=t(e(),1),D=n(),O=[{id:`trial`,name:`Trial Grátis`,price:`R$ 0`,credits:`50 créditos`,desc:`Ideal para testar a potência do Ruptur sem compromisso.`,icon:(0,D.jsx)(h,{size:28}),color:`var(--primary)`,features:[`50 Créditos Iniciais`,`1 Instância WhatsApp`,`Suporte via Comunidade`]},{id:`starter`,name:`Starter`,price:`R$ 97`,period:`/mês`,credits:`2.000 cr/mês`,desc:`Perfeito para pequenos negócios e escala inicial.`,icon:(0,D.jsx)(u,{size:28}),color:`var(--secondary)`,popular:!0,features:[`2.000 Créditos/mês`,`1 Instância WhatsApp`,`Envios Ilimitados`,`Suporte Prioritário`]},{id:`pro`,name:`Pro`,price:`R$ 197`,period:`/mês`,credits:`5.000 cr/mês`,desc:`O poder máximo para quem não aceita limites.`,icon:(0,D.jsx)(C,{size:28}),color:`var(--accent)`,features:[`5.000 Créditos/mês`,`3 Instâncias WhatsApp`,`Webhooks Avançados`,`Gerente de Conta`]}];function k(){let e=f(),{tenantId:t,user:n}=l(),[y,C]=(0,E.useState)(1),[k,A]=(0,E.useState)(`starter`),[j,M]=(0,E.useState)(``),[N,P]=(0,E.useState)(!1),[F,I]=(0,E.useState)(``),[L,R]=(0,E.useState)(null),[z,B]=(0,E.useState)(!0),[V,H]=(0,E.useState)(`waiting`);(0,E.useEffect)(()=>{if(t){let e=setTimeout(()=>B(!1),2500);return()=>clearTimeout(e)}},[t]);let U=()=>{I(``),C(e=>e+1),window.scrollTo({top:0,behavior:`smooth`})},W=()=>{I(``),C(e=>e-1),window.scrollTo({top:0,behavior:`smooth`})},G=()=>e(`/v0/dashboard`),K=(0,E.useCallback)(async()=>{if(k===`trial`){U();return}P(!0);try{let e=await x.createSubscription(t,k);if(e.checkoutUrl||e.redirect_url){window.location.href=e.checkoutUrl||e.redirect_url;return}U()}catch(e){I(e.message||`Erro ao processar assinatura via Getnet.`)}finally{P(!1)}},[k,t]);return(0,E.useEffect)(()=>{y===3&&!L&&(Promise.resolve().then(()=>P(!0)),setTimeout(()=>{R(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=RupturCloud-Auth-`+Date.now()),P(!1),H(`waiting`)},2500))},[y,L]),z?(0,D.jsxs)(`div`,{className:`onboarding-page provisioning`,children:[(0,D.jsxs)(v.div,{className:`provisioning-card glass`,initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},children:[(0,D.jsxs)(`div`,{className:`rocket-animation`,children:[(0,D.jsx)(u,{size:64,className:`rocket-icon`}),(0,D.jsxs)(`div`,{className:`rocket-smoke`,children:[(0,D.jsx)(`span`,{}),(0,D.jsx)(`span`,{}),(0,D.jsx)(`span`,{})]})]}),(0,D.jsx)(`h1`,{children:`Preparando sua Infraestrutura`}),(0,D.jsx)(`p`,{children:`Estamos configurando seu workspace, banco de dados e instâncias isoladas na nuvem.`}),(0,D.jsxs)(`div`,{className:`loading-steps`,children:[(0,D.jsxs)(`div`,{className:`l-step done`,children:[(0,D.jsx)(b,{size:14}),` Conta criada`]}),(0,D.jsxs)(`div`,{className:`l-step active`,children:[(0,D.jsx)(d,{size:14,className:`spin`}),` Provisionando banco de dados...`]}),(0,D.jsxs)(`div`,{className:`l-step`,children:[(0,D.jsx)(`div`,{className:`dot`}),` Ativando API Gateway`]})]}),(0,D.jsx)(`div`,{className:`progress-bar`,children:(0,D.jsx)(v.div,{className:`progress-fill`,initial:{width:`0%`},animate:{width:`100%`},transition:{duration:2.5,ease:`easeInOut`}})})]}),(0,D.jsx)(`style`,{children:`
          .provisioning { display: flex; align-items: center; justify-content: center; }
          .provisioning-card { padding: 60px; max-width: 500px; text-align: center; border-radius: 32px; border: 1px solid rgba(255,255,255,0.1); }
          .rocket-animation { margin-bottom: 40px; position: relative; display: inline-block; }
          .rocket-icon { color: var(--primary); transform: rotate(-45deg); filter: drop-shadow(0 0 20px var(--primary-glow)); }
          .rocket-smoke { position: absolute; bottom: -10px; left: -10px; width: 100%; display: flex; justify-content: center; gap: 8px; }
          .rocket-smoke span { width: 8px; height: 8px; background: rgba(255,255,255,0.1); border-radius: 50%; animation: smoke 1.5s infinite; }
          .rocket-smoke span:nth-child(2) { animation-delay: 0.2s; }
          .rocket-smoke span:nth-child(3) { animation-delay: 0.4s; }
          @keyframes smoke { 0% { transform: translateY(0) scale(1); opacity: 0.5; } 100% { transform: translateY(20px) scale(2); opacity: 0; } }

          .provisioning-card h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 16px; font-family: 'Outfit', sans-serif; }
          .provisioning-card p { color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 40px; }

          .loading-steps { display: flex; flex-direction: column; gap: 12px; text-align: left; margin-bottom: 40px; }
          .l-step { display: flex; align-items: center; gap: 12px; font-size: 0.9rem; font-weight: 600; color: var(--text-dim); }
          .l-step.done { color: var(--success); }
          .l-step.active { color: var(--primary); }
          .l-step .dot { width: 14px; height: 14px; border-radius: 50%; background: rgba(255,255,255,0.05); }

          .progress-bar { width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
          .progress-fill { height: 100%; background: linear-gradient(to right, var(--secondary), var(--primary)); box-shadow: 0 0 15px var(--primary-glow); }
        `})]}):(0,D.jsxs)(`div`,{className:`onboarding-page`,children:[(0,D.jsx)(`div`,{className:`bg-glow-top`}),(0,D.jsx)(`div`,{className:`bg-glow-bottom`}),(0,D.jsxs)(`div`,{className:`onboarding-container`,children:[(0,D.jsxs)(`header`,{className:`onboarding-header`,children:[(0,D.jsxs)(`div`,{className:`brand`,children:[(0,D.jsx)(`div`,{className:`brand-icon`,children:(0,D.jsx)(h,{size:20,fill:`currentColor`})}),(0,D.jsxs)(`span`,{children:[`RUPTUR`,(0,D.jsx)(`strong`,{children:`CLOUD`})]})]}),(0,D.jsx)(`div`,{className:`wizard-stepper`,children:[{id:1,label:`Foco`,icon:(0,D.jsx)(w,{size:16})},{id:2,label:`Plano`,icon:(0,D.jsx)(i,{size:16})},{id:3,label:`Conexão`,icon:(0,D.jsx)(g,{size:16})},{id:4,label:`Pronto`,icon:(0,D.jsx)(T,{size:16})}].map(e=>(0,D.jsxs)(`div`,{className:`wizard-step ${y>=e.id?`active`:``} ${y>e.id?`completed`:``}`,children:[(0,D.jsx)(`div`,{className:`step-icon-circle`,children:y>e.id?(0,D.jsx)(b,{size:14}):e.icon}),(0,D.jsx)(`span`,{className:`step-label`,children:e.label}),e.id<4&&(0,D.jsx)(`div`,{className:`step-connector`})]},e.id))})]}),(0,D.jsx)(`main`,{className:`onboarding-content`,children:(0,D.jsxs)(_,{mode:`wait`,children:[y===1&&(0,D.jsxs)(v.section,{className:`step-card glass`,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},children:[(0,D.jsxs)(`div`,{className:`step-badge`,children:[(0,D.jsx)(w,{size:14}),` Foco & Estratégia`]}),(0,D.jsxs)(`h1`,{className:`step-title`,children:[`Olá, `,n?.user_metadata?.full_name?.split(` `)[0]||`parceiro`,`!`]}),(0,D.jsx)(`p`,{className:`step-desc`,children:`Para personalizarmos sua experiência, qual o seu principal desafio hoje?`}),(0,D.jsx)(`div`,{className:`goal-grid`,children:[{id:`sales`,label:`Escalar Vendas`,desc:`Recupere carrinhos e dispare ofertas`,icon:(0,D.jsx)(u,{size:24})},{id:`support`,label:`Automatizar Suporte`,desc:`Responda clientes 24/7 sem esforço`,icon:(0,D.jsx)(a,{size:24})},{id:`marketing`,label:`Campanhas em Massa`,desc:`Alcance milhares de contatos num clique`,icon:(0,D.jsx)(s,{size:24})}].map(e=>(0,D.jsxs)(`button`,{className:`goal-item ${j===e.id?`active`:``}`,onClick:()=>M(e.id),children:[(0,D.jsx)(`div`,{className:`g-icon`,children:e.icon}),(0,D.jsxs)(`div`,{className:`g-info`,children:[(0,D.jsx)(`strong`,{children:e.label}),(0,D.jsx)(`span`,{children:e.desc})]}),(0,D.jsx)(`div`,{className:`g-check`,children:(0,D.jsx)(b,{size:16})})]},e.id))}),(0,D.jsx)(`div`,{className:`step-actions`,children:(0,D.jsxs)(`button`,{className:`btn-primary-lg`,onClick:U,disabled:!j,children:[`Continuar Configuração `,(0,D.jsx)(c,{size:20})]})})]},`step1`),y===2&&(0,D.jsxs)(v.section,{className:`step-card wide glass`,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},children:[(0,D.jsxs)(`div`,{className:`step-badge`,children:[(0,D.jsx)(i,{size:14}),` Ativação de Conta`]}),(0,D.jsx)(`h1`,{className:`step-title`,children:`Escolha o seu plano`}),(0,D.jsx)(`p`,{className:`step-desc`,children:`Ative agora para liberar as ferramentas de automação avançada.`}),(0,D.jsx)(`div`,{className:`plans-showcase`,children:O.map(e=>(0,D.jsxs)(`div`,{className:`plan-card ${k===e.id?`selected`:``} ${e.popular?`popular`:``}`,onClick:()=>A(e.id),children:[e.popular&&(0,D.jsx)(`div`,{className:`popular-tag`,children:`Mais Escolhido`}),(0,D.jsxs)(`div`,{className:`p-header`,style:{color:e.color},children:[e.icon,(0,D.jsx)(`h3`,{children:e.name})]}),(0,D.jsxs)(`div`,{className:`p-price-wrap`,children:[(0,D.jsx)(`span`,{className:`p-currency`,children:`R$`}),(0,D.jsx)(`span`,{className:`p-amount`,children:e.price.split(` `)[1]}),(0,D.jsx)(`span`,{className:`p-period`,children:e.period||``})]}),(0,D.jsx)(`div`,{className:`p-credits-pill`,children:e.credits}),(0,D.jsx)(`ul`,{className:`p-features`,children:e.features.map((e,t)=>(0,D.jsxs)(`li`,{children:[(0,D.jsx)(b,{size:14}),` `,e]},t))}),(0,D.jsx)(`div`,{className:`p-selector`,children:k===e.id?`Selecionado`:`Selecionar`})]},e.id))}),(0,D.jsxs)(`div`,{className:`billing-trust`,children:[(0,D.jsxs)(`div`,{className:`trust-item`,children:[(0,D.jsx)(p,{size:18}),(0,D.jsxs)(`span`,{children:[`Checkout Seguro `,(0,D.jsx)(`strong`,{children:`Getnet`})]})]}),(0,D.jsxs)(`div`,{className:`trust-item`,children:[(0,D.jsx)(m,{size:18}),(0,D.jsx)(`span`,{children:`Dados Criptografados`})]})]}),F&&(0,D.jsxs)(`div`,{className:`error-box`,children:[(0,D.jsx)(r,{size:18}),` `,F]}),(0,D.jsxs)(`div`,{className:`step-actions split`,children:[(0,D.jsxs)(`button`,{className:`btn-ghost`,onClick:W,children:[(0,D.jsx)(S,{size:18}),` Voltar`]}),(0,D.jsx)(`button`,{className:`btn-primary-lg`,onClick:K,disabled:N,children:N?(0,D.jsx)(d,{size:20,className:`spin`}):(0,D.jsxs)(D.Fragment,{children:[`Ativar Plano `,(0,D.jsx)(c,{size:20})]})})]})]},`step2`),y===3&&(0,D.jsxs)(v.section,{className:`step-card glass`,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},children:[(0,D.jsxs)(`div`,{className:`step-badge`,children:[(0,D.jsx)(o,{size:14}),` Conexão em Tempo Real`]}),(0,D.jsx)(`h1`,{className:`step-title`,children:`Vincule seu WhatsApp`}),(0,D.jsx)(`p`,{className:`step-desc`,children:`Escaneie o código abaixo com o seu celular para ativar sua primeira instância.`}),(0,D.jsx)(`div`,{className:`qr-wrapper`,children:(0,D.jsx)(`div`,{className:`qr-frame ${V}`,children:N?(0,D.jsxs)(`div`,{className:`qr-state`,children:[(0,D.jsx)(`div`,{className:`radar-ping`}),(0,D.jsx)(d,{size:40,className:`spin`}),(0,D.jsx)(`span`,{children:`Sincronizando com UAZAPI...`})]}):(0,D.jsxs)(`div`,{className:`qr-display`,children:[(0,D.jsx)(`img`,{src:L,alt:`WhatsApp QR Code`,className:V===`waiting`?``:`blurred`}),(0,D.jsxs)(_,{children:[V===`scanned`&&(0,D.jsxs)(v.div,{className:`qr-overlay-status`,initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},exit:{opacity:0},children:[(0,D.jsx)(d,{size:40,className:`spin status-icon primary`}),(0,D.jsx)(`span`,{children:`Autenticando Aparelho...`})]}),V===`connected`&&(0,D.jsxs)(v.div,{className:`qr-overlay-status success`,initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},children:[(0,D.jsx)(`div`,{className:`success-circle`,children:(0,D.jsx)(b,{size:40,className:`status-icon`})}),(0,D.jsx)(`span`,{children:`Conexão Estabelecida!`})]})]}),(0,D.jsx)(`div`,{className:`qr-overlay-glow`})]})})}),(0,D.jsxs)(`div`,{className:`qr-instructions glass`,children:[(0,D.jsxs)(`div`,{className:`ins-item`,children:[(0,D.jsx)(`div`,{className:`ins-num`,children:`1`}),(0,D.jsx)(`span`,{children:`Abra o WhatsApp no celular`})]}),(0,D.jsxs)(`div`,{className:`ins-item`,children:[(0,D.jsx)(`div`,{className:`ins-num`,children:`2`}),(0,D.jsxs)(`span`,{children:[`Toque em `,(0,D.jsx)(`strong`,{children:`Configurações`}),` > `,(0,D.jsx)(`strong`,{children:`Aparelhos`})]})]}),(0,D.jsxs)(`div`,{className:`ins-item`,children:[(0,D.jsx)(`div`,{className:`ins-num`,children:`3`}),(0,D.jsx)(`span`,{children:`Aponte a câmera para esta tela`})]})]}),(0,D.jsxs)(`div`,{className:`step-actions split`,children:[(0,D.jsx)(`button`,{className:`btn-ghost`,onClick:W,children:`Voltar`}),(0,D.jsx)(`button`,{className:`btn-primary-lg`,onClick:V===`connected`?U:()=>{H(`scanned`),setTimeout(()=>{H(`connected`),setTimeout(()=>{U()},1e3)},1500)},children:V===`waiting`?`Já escaneei o QR Code`:V===`connected`?`Continuar`:`Autenticando...`})]})]},`step3`),y===4&&(0,D.jsxs)(v.section,{className:`step-card glass`,initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},children:[(0,D.jsx)(`div`,{className:`success-confetti`,children:(0,D.jsx)(s,{size:48,className:`icon-sparkle`})}),(0,D.jsxs)(`div`,{className:`trophy-wrap`,children:[(0,D.jsx)(T,{size:64,className:`trophy-icon`}),(0,D.jsx)(`div`,{className:`trophy-glow`})]}),(0,D.jsx)(`h1`,{className:`step-title`,children:`Você está pronto!`}),(0,D.jsxs)(`p`,{className:`step-desc`,children:[`Sua jornada no `,(0,D.jsx)(`strong`,{children:`Ruptur Cloud`}),` começa agora. Vamos decolar?`]}),(0,D.jsxs)(`div`,{className:`setup-summary`,children:[(0,D.jsxs)(`div`,{className:`sum-item`,children:[(0,D.jsx)(`div`,{className:`sum-icon`,children:(0,D.jsx)(p,{size:18})}),(0,D.jsxs)(`div`,{className:`sum-text`,children:[(0,D.jsx)(`strong`,{children:`Conta Verificada`}),(0,D.jsx)(`span`,{children:`Acesso total liberado`})]})]}),(0,D.jsxs)(`div`,{className:`sum-item`,children:[(0,D.jsx)(`div`,{className:`sum-icon`,children:(0,D.jsx)(h,{size:18})}),(0,D.jsxs)(`div`,{className:`sum-text`,children:[(0,D.jsxs)(`strong`,{children:[`Plano `,O.find(e=>e.id===k)?.name]}),(0,D.jsx)(`span`,{children:`Renovação automática ativa`})]})]})]}),(0,D.jsx)(`div`,{className:`step-actions`,children:(0,D.jsxs)(`button`,{className:`btn-primary-xl`,onClick:G,children:[`Explorar meu Dashboard `,(0,D.jsx)(u,{size:20})]})})]},`step4`)]})})]}),(0,D.jsx)(`style`,{children:`
        .onboarding-page {
          min-height: 100vh;
          background: #06060e;
          color: #fff;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
        }

        .bg-glow-top { position: absolute; top: -10%; right: -10%; width: 50%; height: 50%; background: radial-gradient(circle, rgba(0,242,255,0.08) 0%, transparent 70%); z-index: 0; }
        .bg-glow-bottom { position: absolute; bottom: -10%; left: -10%; width: 50%; height: 50%; background: radial-gradient(circle, rgba(112,0,255,0.08) 0%, transparent 70%); z-index: 0; }

        .onboarding-container { width: 100%; max-width: 600px; position: relative; z-index: 1; }
        .onboarding-container:has(.wide) { max-width: 900px; }

        .onboarding-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .brand { display: flex; align-items: center; gap: 12px; font-family: 'Outfit', sans-serif; font-size: 1.1rem; }
        .brand-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--secondary), var(--primary)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(112,0,255,0.3); }
        .brand strong { color: var(--primary); }

        .wizard-stepper {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .wizard-step {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }
        .step-icon-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.3s;
          z-index: 2;
        }
        .wizard-step.active .step-icon-circle {
          background: rgba(0,242,255,0.1);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 0 15px rgba(0,242,255,0.2);
        }
        .wizard-step.completed .step-icon-circle {
          background: var(--primary);
          border-color: var(--primary);
          color: #000;
        }
        .step-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          transition: all 0.3s;
        }
        .wizard-step.active .step-label { color: #fff; }
        .step-connector {
          width: 30px;
          height: 2px;
          background: rgba(255,255,255,0.05);
          margin: 0 4px;
        }
        .wizard-step.completed .step-connector { background: var(--primary); }

        .step-card { padding: 48px; border-radius: 32px; text-align: center; border: 1px solid rgba(255,255,255,0.08); position: relative; }
        .step-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 100px; font-size: 0.75rem; font-weight: 700; color: var(--primary); margin-bottom: 24px; text-transform: uppercase; }
        .step-title { font-size: 2.5rem; font-weight: 800; font-family: 'Outfit', sans-serif; margin-bottom: 12px; letter-spacing: -1px; }
        .step-desc { font-size: 1.1rem; color: var(--text-dim); margin-bottom: 40px; line-height: 1.6; }

        /* Goal Grid */
        .goal-grid { display: grid; gap: 16px; margin-bottom: 40px; }
        .goal-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          border: 1px solid transparent;
        }
        .goal-item:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); transform: translateX(5px); }
        .goal-item.active { background: rgba(0,242,255,0.05); border-color: var(--primary); box-shadow: 0 0 30px rgba(0,242,255,0.1); }

        .g-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; color: var(--text-dim); transition: all 0.3s; }
        .goal-item.active .g-icon { background: var(--primary); color: #000; box-shadow: 0 0 15px var(--primary-glow); }

        .g-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .g-info strong { font-size: 1.1rem; color: #fff; }
        .g-info span { font-size: 0.9rem; color: var(--text-muted); }

        .g-check { width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: transparent; transition: all 0.3s; }
        .goal-item.active .g-check { background: var(--primary); border-color: var(--primary); color: #000; }

        /* Plans Showcase */
        .plans-showcase { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; perspective: 1000px; }
        .plan-card {
          padding: 32px 24px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .plan-card:hover { transform: translateY(-10px) scale(1.02); background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.15); }
        .plan-card.selected { border-color: var(--primary); background: rgba(0,242,255,0.04); box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px var(--primary); }
        .plan-card.popular { border-color: var(--secondary); background: rgba(112,0,255,0.03); }
        .plan-card.popular.selected { border-color: var(--primary); }

        .popular-tag { position: absolute; top: -12px; background: var(--secondary); padding: 4px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: #fff; box-shadow: 0 5px 15px var(--secondary-glow); }

        .p-header { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .p-header h3 { font-size: 1.4rem; font-weight: 800; color: #fff; }

        .p-price-wrap { display: flex; align-items: baseline; gap: 4px; }
        .p-currency { font-size: 0.9rem; font-weight: 600; color: var(--text-dim); }
        .p-amount { font-size: 2.2rem; font-weight: 800; color: #fff; font-family: 'Outfit', sans-serif; }
        .p-period { font-size: 0.9rem; color: var(--text-muted); }

        .p-credits-pill { padding: 4px 12px; background: rgba(255,255,255,0.05); border-radius: 100px; font-size: 0.75rem; font-weight: 700; color: var(--text-dim); border: 1px solid rgba(255,255,255,0.08); }
        .plan-card.selected .p-credits-pill { background: var(--primary); color: #000; border-color: var(--primary); }

        .p-features { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 8px; }
        .p-features li { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text-dim); text-align: left; }
        .p-features li svg { color: var(--success); flex-shrink: 0; }

        .p-selector { margin-top: auto; width: 100%; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.05); color: #fff; font-weight: 700; font-size: 0.85rem; transition: all 0.3s; }
        .plan-card.selected .p-selector { background: var(--primary); color: #000; }

        .billing-trust { display: flex; justify-content: center; gap: 24px; margin-bottom: 32px; color: var(--text-muted); font-size: 0.85rem; }
        .trust-item { display: flex; align-items: center; gap: 8px; }
        .trust-item strong { color: var(--text-dim); }

        /* QR Step */
        .qr-wrapper { margin-bottom: 40px; display: flex; justify-content: center; }
        .qr-frame { width: 300px; height: 300px; padding: 25px; background: #fff; border-radius: 32px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .qr-display { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .qr-display img { width: 100%; border-radius: 12px; transition: filter 0.3s; }
        .qr-display img.blurred { filter: blur(8px) brightness(0.8); }
        .qr-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; color: #505060; font-weight: 600; text-align: center; }

        .qr-overlay-status { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; background: rgba(255,255,255,0.8); border-radius: 12px; font-weight: 700; color: #000; z-index: 10; }
        .qr-overlay-status.success { background: rgba(0,255,136,0.9); color: #000; }
        .status-icon.primary { color: var(--primary); }
        .success-circle { width: 64px; height: 64px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--success); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

        .qr-instructions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 24px; border-radius: 20px; text-align: left; }
        .ins-item { display: flex; flex-direction: column; gap: 12px; }
        .ins-num { width: 28px; height: 28px; border-radius: 8px; background: var(--primary); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; }
        .ins-item span { font-size: 0.85rem; color: var(--text-dim); line-height: 1.4; }

        /* Success Step */
        .trophy-wrap { position: relative; width: 120px; height: 120px; margin: 0 auto 32px; display: flex; align-items: center; justify-content: center; }
        .trophy-icon { color: var(--primary); position: relative; z-index: 2; filter: drop-shadow(0 0 20px var(--primary-glow)); }
        .trophy-glow { position: absolute; inset: 0; background: var(--primary); border-radius: 50%; filter: blur(40px); opacity: 0.2; animation: pulse 2s infinite; }

        .setup-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 40px; }
        .sum-item { display: flex; align-items: center; gap: 16px; padding: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; text-align: left; }
        .sum-icon { width: 40px; height: 40px; border-radius: 12px; background: rgba(0,255,136,0.1); color: var(--success); display: flex; align-items: center; justify-content: center; }
        .sum-text { display: flex; flex-direction: column; gap: 2px; }
        .sum-text strong { font-size: 0.95rem; color: #fff; }
        .sum-text span { font-size: 0.8rem; color: var(--text-muted); }

        /* Actions */
        .step-actions { margin-top: 10px; }
        .step-actions.split { display: flex; gap: 16px; }

        .btn-primary-lg { flex: 1; padding: 20px 32px; background: linear-gradient(135deg, var(--secondary), var(--primary)); border: none; border-radius: 20px; color: #fff; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 10px 30px var(--secondary-glow); }
        .btn-primary-lg:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 40px var(--secondary-glow); filter: brightness(1.1); }
        .btn-primary-lg:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-primary-xl { width: 100%; padding: 24px; background: linear-gradient(135deg, var(--secondary), var(--primary)); border: none; border-radius: 24px; color: #fff; font-weight: 800; font-size: 1.2rem; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 10px 40px var(--secondary-glow); }
        .btn-primary-xl:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 20px 50px var(--secondary-glow); }

        .btn-ghost { padding: 20px 32px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; color: var(--text-dim); font-weight: 700; cursor: pointer; transition: all 0.3s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.06); color: #fff; }

        .error-box { display: flex; align-items: center; gap: 12px; padding: 16px; background: rgba(255,0,80,0.1); border: 1px solid rgba(255,0,80,0.2); border-radius: 16px; color: #ff4d6a; margin-bottom: 24px; font-size: 0.9rem; font-weight: 600; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.2; } 50% { transform: scale(1.1); opacity: 0.4; } 100% { transform: scale(0.95); opacity: 0.2; } }

        @media (max-width: 768px) {
          .plans-showcase { grid-template-columns: 1fr; }
          .setup-summary { grid-template-columns: 1fr; }
          .onboarding-header { flex-direction: column; gap: 20px; align-items: flex-start; }
          .progress-hub { align-items: flex-start; width: 100%; }
          .progress-track { width: 100%; }
          .step-title { font-size: 2rem; }
          .step-card { padding: 32px 20px; }
        }
      `})]})}export{k as default};