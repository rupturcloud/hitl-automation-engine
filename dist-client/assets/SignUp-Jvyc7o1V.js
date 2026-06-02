import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{A as r,B as i,D as a,E as o,I as s,M as c,O as l,_ as u,h as d}from"./index-BPxAC5Go.js";var f=t(e(),1),p=n();function m(){let e=s(),{signUp:t}=i(),[n,m]=(0,f.useState)({name:``,email:``,password:``}),[h,g]=(0,f.useState)(!1),[_,v]=(0,f.useState)(!1),[y,b]=(0,f.useState)(``),x=e=>{m(t=>({...t,[e.target.name]:e.target.value})),b(``)};return(0,p.jsxs)(`div`,{className:`auth-page`,children:[(0,p.jsxs)(d.div,{className:`auth-card glass`,initial:{opacity:0,y:20},animate:{opacity:1,y:0},children:[(0,p.jsxs)(`div`,{className:`auth-logo`,children:[(0,p.jsx)(`div`,{className:`logo-icon-wrap`,children:(0,p.jsx)(u,{size:22,fill:`currentColor`})}),(0,p.jsxs)(`h1`,{className:`logo-text`,children:[`RUPTUR`,(0,p.jsx)(`span`,{children:`CLOUD`})]})]}),(0,p.jsx)(`h2`,{className:`auth-title`,children:`Crie sua conta`}),(0,p.jsx)(`p`,{className:`auth-sub`,children:`Comece grátis com 50 créditos. Sem cartão.`}),(0,p.jsxs)(`form`,{onSubmit:async r=>{if(r.preventDefault(),!n.name||!n.email||!n.password)return b(`Preencha todos os campos`);if(n.password.length<6)return b(`Senha mínima: 6 caracteres`);v(!0);try{await t(n.email,n.password,n.name),e(`/onboarding`)}catch(e){b(e.message||`Erro ao criar conta`)}finally{v(!1)}},className:`auth-form`,children:[(0,p.jsxs)(`div`,{className:`field`,children:[(0,p.jsx)(`label`,{children:`Nome do negócio`}),(0,p.jsx)(`input`,{name:`name`,placeholder:`Ex: Murilo Rifas`,value:n.name,onChange:x,autoFocus:!0})]}),(0,p.jsxs)(`div`,{className:`field`,children:[(0,p.jsx)(`label`,{children:`E-mail`}),(0,p.jsx)(`input`,{name:`email`,type:`email`,placeholder:`seu@email.com`,value:n.email,onChange:x})]}),(0,p.jsxs)(`div`,{className:`field`,children:[(0,p.jsx)(`label`,{children:`Senha`}),(0,p.jsxs)(`div`,{className:`pw-wrap`,children:[(0,p.jsx)(`input`,{name:`password`,type:h?`text`:`password`,placeholder:`Mínimo 6 caracteres`,value:n.password,onChange:x}),(0,p.jsx)(`button`,{type:`button`,className:`pw-toggle`,onClick:()=>g(e=>!e),children:h?(0,p.jsx)(l,{size:18}):(0,p.jsx)(a,{size:18})})]})]}),y&&(0,p.jsx)(`div`,{className:`auth-error`,children:y}),(0,p.jsx)(d.button,{type:`submit`,className:`auth-btn`,disabled:_,whileTap:{scale:.97},children:_?(0,p.jsx)(o,{size:20,className:`spin`}):(0,p.jsxs)(p.Fragment,{children:[`Começar Grátis `,(0,p.jsx)(r,{size:18})]})})]}),(0,p.jsx)(`div`,{className:`auth-divider`}),(0,p.jsxs)(`div`,{className:`auth-footer-container glass-highlight`,children:[(0,p.jsx)(`p`,{className:`auth-footer`,children:`Já é um de nossos parceiros?`}),(0,p.jsxs)(c,{to:`/login`,className:`login-link-highlight`,children:[`Acessar Minha Conta `,(0,p.jsx)(r,{size:18})]})]}),(0,p.jsxs)(`div`,{className:`trial-badge`,children:[(0,p.jsx)(`span`,{children:`🎁`}),` 50 créditos grátis inclusos • Sem cartão`]})]}),(0,p.jsx)(`style`,{children:`
        .glass-highlight {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .auth-footer { margin-bottom: 8px !important; opacity: 0.6; font-size: 0.9rem; }
        .auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg-primary,#0a0a14);padding:24px;background: radial-gradient(circle at top right, rgba(112,0,255,0.05), transparent), radial-gradient(circle at bottom left, rgba(0,242,255,0.05), transparent);}
        .auth-card{width:100%;max-width:440px;padding:48px 40px;border-radius:24px;border:1px solid var(--border-glass);background:rgba(12,12,24,.85);backdrop-filter:blur(20px);box-shadow: 0 20px 60px rgba(0,0,0,0.5);}
        .auth-logo{display:flex;align-items:center;gap:12px;margin-bottom:32px}
        .auth-logo .logo-icon-wrap{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,var(--secondary),var(--primary));display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 8px 20px rgba(112,0,255,.3)}
        .auth-logo .logo-text{font-size:1.3rem;font-weight:800;letter-spacing:-1px;font-family:'Outfit',sans-serif}
        .auth-logo .logo-text span{color:var(--primary)}
        .auth-title{font-size:1.75rem;font-weight:800;margin-bottom:8px;font-family:'Outfit',sans-serif}
        .auth-sub{font-size:1rem;color:var(--text-muted);margin-bottom:32px}
        .auth-form{display:flex;flex-direction:column;gap:20px}
        .auth-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 32px 0; }
        .field label{display:block;font-size:.8rem;font-weight:700;color:var(--text-dim);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px}
        .field input{width:100%;padding:14px 16px;background:rgba(255,255,255,0.03);border:1px solid var(--border-glass);border-radius:12px;color:#fff;font-size:1rem;transition: all 0.2s;font-family:'Inter',sans-serif}
        .field input:focus{outline:none;border-color:var(--primary);background:rgba(0,242,255,0.02);box-shadow:0 0 0 4px rgba(0,242,255,.1)}
        .field input::placeholder{color:rgba(255,255,255,0.15)}
        .pw-wrap{position:relative}.pw-wrap input{padding-right:42px}
        .pw-toggle{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px}
        .auth-error{padding:12px 16px;background:rgba(255,0,80,.1);border:1px solid rgba(255,0,80,.2);border-radius:12px;color:#ff4d6a;font-size:.88rem;margin-top:8px}
        .auth-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:16px;background:linear-gradient(135deg,var(--secondary),var(--primary));border:none;border-radius:12px;color:#fff;font-weight:800;font-size:1.1rem;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:0 10px 25px rgba(112,0,255,.3);transition:all 0.2s}
        .auth-btn:disabled{opacity:.6;cursor:not-allowed}.auth-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 15px 35px rgba(112,0,255,.4);filter:brightness(1.1)}
        .login-link-highlight {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--primary);
          text-decoration: none;
          font-weight: 800;
          font-size: 1rem;
          transition: all 0.2s;
          padding: 8px;
          border-bottom: 2px solid transparent;
        }
        .login-link-highlight:hover {
          color: #fff;
          border-bottom-color: var(--primary);
          transform: translateX(3px);
        }
        .trial-badge{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:24px;padding:12px;background:rgba(0,242,255,.05);border:1px solid rgba(0,242,255,.1);border-radius:12px;font-size:.85rem;color:var(--primary);font-weight:600}
        @keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .8s linear infinite}
      `})]})}export{m as default};