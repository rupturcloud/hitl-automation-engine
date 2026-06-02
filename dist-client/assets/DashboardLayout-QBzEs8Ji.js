import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{t as r}from"./chart-column-B4Fcx5-8.js";import{t as i}from"./circle-alert-DfP4N4b3.js";import{t as a}from"./flame-9mPRREct.js";import{t as o}from"./history-DyOR3cb4.js";import{n as s,t as c}from"./EnvironmentSwitcher-DHzVuuGt.js";import{t as l}from"./loader-B4OMqXoU.js";import{t as u}from"./message-square-text-DXZp2iEU.js";import{t as d}from"./message-square-5IXhojL7.js";import{n as f,t as p}from"./wallet-Be_F3VBq.js";import{B as m,N as h,P as g,_,b as v,j as y,k as b}from"./index-BPxAC5Go.js";var x=y(`bell`,[[`path`,{d:`M10.268 21a2 2 0 0 0 3.464 0`,key:`vwvbt9`}],[`path`,{d:`M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326`,key:`11g9vi`}]]),S=y(`log-out`,[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]]),C=y(`menu`,[[`path`,{d:`M4 5h16`,key:`1tepv9`}],[`path`,{d:`M4 12h16`,key:`1lakjw`}],[`path`,{d:`M4 19h16`,key:`1djgab`}]]),w=y(`panel-left-close`,[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`,key:`afitv7`}],[`path`,{d:`M9 3v18`,key:`fh3hqa`}],[`path`,{d:`m16 15-3-3 3-3`,key:`14y99z`}]]),T=y(`panel-left-open`,[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`,key:`afitv7`}],[`path`,{d:`M9 3v18`,key:`fh3hqa`}],[`path`,{d:`m14 9 3 3-3 3`,key:`8010ee`}]]),E=t(e(),1),D=n(),O=[{to:`/dashboard`,label:`Dashboard`,icon:(0,D.jsx)(s,{size:20})},{to:`/campanhas`,label:`Campanhas`,icon:(0,D.jsx)(f,{size:20})},{to:`/carteira`,label:`Carteira`,icon:(0,D.jsx)(p,{size:20})},{to:`/instancias`,label:`Instâncias`,icon:(0,D.jsx)(v,{size:20})},{to:`/aquecimento`,label:`Aquecimento`,icon:(0,D.jsx)(a,{size:20})},{to:`/mensagens`,label:`Mensagens`,icon:(0,D.jsx)(u,{size:20})},{to:`/relatorios`,label:`Relatórios`,icon:(0,D.jsx)(r,{size:20})},{to:`/logs`,label:`Logs`,icon:(0,D.jsx)(o,{size:20})},{to:`/inbox`,label:`Inbox`,icon:(0,D.jsx)(d,{size:20})}],k=({collapsed:e=!1,mobileOpen:t=!1,onMobileClose:n,onToggleCollapse:r,onLogout:i,tenantId:a,tenantName:o})=>(0,D.jsxs)(`aside`,{className:`sidebar glass ${e?`collapsed`:``} ${t?`mobile-open`:``}`,children:[(0,D.jsxs)(`div`,{className:`logo-container`,children:[(0,D.jsx)(`div`,{className:`logo-icon-wrap`,children:(0,D.jsx)(_,{size:20,fill:`currentColor`})}),(0,D.jsxs)(`div`,{className:`logo-copy`,children:[(0,D.jsxs)(`h2`,{className:`logo-text`,children:[`RUPTUR`,(0,D.jsx)(`span`,{children:`CLOUD`})]}),(0,D.jsx)(`p`,{className:`logo-sub`,children:`Automação WhatsApp`})]})]}),(0,D.jsx)(`button`,{type:`button`,className:`collapse-toggle`,onClick:r,"aria-label":e?`Expandir menu lateral`:`Recolher menu lateral`,title:e?`Expandir menu`:`Recolher menu`,children:e?(0,D.jsx)(T,{size:18}):(0,D.jsx)(w,{size:18})}),(0,D.jsx)(`nav`,{className:`sidebar-nav`,children:O.map(e=>(0,D.jsxs)(h,{to:e.to,className:({isActive:e})=>`nav-item ${e?`active`:``}`,onClick:n,children:[(0,D.jsx)(`span`,{className:`icon`,children:e.icon}),(0,D.jsx)(`span`,{className:`label`,children:e.label})]},e.to))}),(0,D.jsxs)(`div`,{className:`sidebar-footer`,children:[(o||a)&&(0,D.jsxs)(`div`,{className:`tenant-info`,children:[(0,D.jsx)(`div`,{className:`tenant-avatar`,children:(o||a||`?`).charAt(0).toUpperCase()}),(0,D.jsxs)(`div`,{className:`tenant-text`,children:[(0,D.jsx)(`span`,{className:`tenant-name`,children:o||a}),(0,D.jsx)(`span`,{className:`tenant-role`,children:`Cliente`})]})]}),(0,D.jsxs)(`button`,{className:`nav-item logout`,onClick:()=>{n?.(),i?.()},children:[(0,D.jsx)(`span`,{className:`icon`,children:(0,D.jsx)(S,{size:18})}),(0,D.jsx)(`span`,{className:`label`,children:`Sair`})]})]}),(0,D.jsx)(`style`,{children:`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0; top: 0;
          display: flex;
          flex-direction: column;
          padding: 28px 16px;
          border-right: 1px solid var(--border-glass);
          z-index: 100;
          background: rgba(8, 8, 14, 0.9);
          transition: width 0.28s ease, padding 0.28s ease;
          overflow: visible;
        }

        .sidebar.collapsed {
          width: var(--sidebar-collapsed-width);
          padding: 24px 12px;
        }

        /* Logo */
        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
          padding: 0 8px;
          min-height: 40px;
        }
        .logo-icon-wrap {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
          box-shadow: 0 4px 16px var(--secondary-glow);
        }
        .logo-text {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          line-height: 1;
          font-family: 'Outfit', sans-serif;
        }
        .logo-text span { color: var(--primary); }
        .logo-sub {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .logo-copy,
        .nav-item .label,
        .tenant-text {
          transition: opacity 0.18s ease, width 0.24s ease, transform 0.24s ease;
          white-space: nowrap;
        }

        .collapse-toggle {
          position: absolute;
          top: 24px;
          right: -14px;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          background: rgba(8, 8, 14, 0.96);
          border: 1px solid rgba(0, 242, 255, 0.24);
          box-shadow: 0 8px 24px rgba(0,0,0,0.28), 0 0 16px rgba(0,242,255,0.14);
          z-index: 2;
        }

        .collapse-toggle:hover {
          background: rgba(0, 242, 255, 0.12);
          transform: translateX(1px);
        }

        /* Nav */
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          text-align: left;
          width: 100%;
          position: relative;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
          font-size: 0.92rem;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.04);
          color: var(--text-main);
        }

        .nav-item.active {
          color: var(--primary);
          background: rgba(0, 242, 255, 0.08);
          font-weight: 600;
        }

        .nav-item .icon {
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nav-item .label { font-size: 0.92rem; }

        .sidebar.collapsed .logo-container {
          justify-content: center;
          padding: 0;
        }

        .sidebar.collapsed .logo-copy,
        .sidebar.collapsed .nav-item .label,
        .sidebar.collapsed .tenant-text {
          opacity: 0;
          width: 0;
          transform: translateX(-8px);
          pointer-events: none;
          overflow: hidden;
        }

        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 12px;
          gap: 0;
        }

        .sidebar.collapsed .tenant-info {
          justify-content: center;
          padding: 10px;
        }

        .sidebar.collapsed .tenant-avatar {
          width: 38px;
          height: 38px;
        }

        /* Footer */
        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 20px;
          border-top: 1px solid var(--border-glass);
        }

        .tenant-info {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-glass);
          margin-bottom: 4px;
        }
        .tenant-avatar {
          width: 34px; height: 34px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--secondary), var(--primary));
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.9rem; color: white;
          flex-shrink: 0;
        }
        .tenant-text { display: flex; flex-direction: column; min-width: 0; }
        .tenant-name {
          font-size: 0.82rem; font-weight: 600;
          color: white; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .tenant-role { font-size: 0.7rem; color: var(--text-muted); }

        .nav-item.logout { color: var(--text-muted); }
        .nav-item.logout:hover {
          color: var(--accent);
          background: rgba(255, 0, 122, 0.08);
        }

        @media (max-width: 1024px) {
          .sidebar,
          .sidebar.collapsed {
            width: min(82vw, var(--sidebar-width));
            transform: translateX(-105%);
            padding: 24px 16px;
            box-shadow: 24px 0 60px rgba(0,0,0,0.38);
          }

          .sidebar.mobile-open,
          .sidebar.collapsed.mobile-open {
            transform: translateX(0);
          }

          .sidebar.collapsed .logo-container { justify-content: flex-start; padding: 0 8px; }
          .sidebar.collapsed .logo-copy,
          .sidebar.collapsed .nav-item .label,
          .sidebar.collapsed .tenant-text {
            opacity: 1; width: auto; transform: none; pointer-events: auto; overflow: hidden;
          }
          .sidebar.collapsed .nav-item { justify-content: flex-start; padding: 11px 14px; gap: 12px; }
          .sidebar.collapsed .tenant-info { justify-content: flex-start; padding: 10px 12px; }
          .collapse-toggle { display: none; }
        }
      `})]});function A(e){let[t,n]=(0,E.useState)(!1),[r,i]=(0,E.useState)(!1),[a,o]=(0,E.useState)(!1),[s,c]=(0,E.useState)(!1),[l,u]=(0,E.useState)(null);(0,E.useEffect)(()=>{let e=typeof window<`u`&&`serviceWorker`in navigator&&`PushManager`in window;n(e),e&&d()},[]);let d=async()=>{try{if(!(`serviceWorker`in navigator)){u(`Service Workers não suportados`);return}let e=await navigator.serviceWorker.register(`/sw.js`,{scope:`/`});console.log(`✓ Service Worker registrado:`,e.scope),i(!0),await e.pushManager.getSubscription()&&(console.log(`✓ Subscription ativa encontrada`),o(!0))}catch(e){let t=e instanceof Error?e.message:String(e);console.error(`❌ Erro ao registrar SW:`,t),u(t)}};return{isSupported:t,isRegistered:r,isSubscribed:a,isPending:s,error:l,subscribe:(0,E.useCallback)(async()=>{c(!0),u(null);try{if(!r)throw Error(`Service Worker não registrado`);if(await Notification.requestPermission()!==`granted`)throw Error(`Permissão de notificações negada pelo usuário`);let t=await navigator.serviceWorker.ready,n;try{let e=await fetch(`/api/fase7/notifications/vapid-public-key`);e.ok&&(n=(await e.json()).publicKey)}catch{}if(n||=`BDYcq-e1N1bkXrigsULqMB4xtR83PKqHDa3pfVhbbpbemCvpS4H3IPdjO_349NHUriHqUCMOaYMIKWGdFAK-ovY`,!n)throw Error(`VAPID public key não configurada (servidor + env vazios)`);let i=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:j(n)});console.log(`✓ Push subscription criada`),await M(i,e),o(!0)}catch(e){let t=e instanceof Error?e.message:String(e);console.error(`❌ Erro ao subscribir:`,t),u(t)}finally{c(!1)}},[r,e]),unsubscribe:(0,E.useCallback)(async()=>{c(!0),u(null);try{if(!r)throw Error(`Service Worker não registrado`);let e=await(await navigator.serviceWorker.ready).pushManager.getSubscription();if(!e)throw Error(`Nenhuma subscription ativa`);await e.unsubscribe(),console.log(`✓ Subscription removida`),o(!1)}catch(e){let t=e instanceof Error?e.message:String(e);console.error(`❌ Erro ao unsubscribe:`,t),u(t)}finally{c(!1)}},[r]),sendTest:(0,E.useCallback)(async()=>{c(!0),u(null);try{if(!e)throw Error(`Token de autenticação não fornecido`);let t=await fetch(`/api/fase7/notifications/test`,{method:`POST`,headers:{Authorization:`Bearer ${e}`,"Content-Type":`application/json`}});if(!t.ok){let e=await t.json();throw Error(e.detail||`Erro ao enviar notificação teste`)}console.log(`✓ Notificação teste enviada`)}catch(e){let t=e instanceof Error?e.message:String(e);console.error(`❌ Erro ao enviar teste:`,t),u(t)}finally{c(!1)}},[e]),getSubscription:(0,E.useCallback)(async()=>{try{return await(await navigator.serviceWorker.ready).pushManager.getSubscription()}catch(e){return console.error(`Erro ao obter subscription:`,e),null}},[])}}function j(e){let t=(e+`=`.repeat((4-e.length%4)%4)).replace(/\-/g,`+`).replace(/_/g,`/`),n=window.atob(t),r=new Uint8Array(n.length);for(let e=0;e<n.length;++e)r[e]=n.charCodeAt(e);return r}async function M(e,t){if(!t){console.warn(`Token não fornecido, subscription não será salva no servidor`);return}let n=await fetch(`/api/fase7/notifications/subscribe`,{method:`POST`,headers:{Authorization:`Bearer ${t}`,"Content-Type":`application/json`},body:JSON.stringify(e)});if(!n.ok){let e=await n.json();throw Error(e.detail||`Erro ao salvar subscription`)}let r=await n.json();console.log(`✓ Subscription salva no servidor:`,r)}function N({token:e,className:t=``}){let[n,r]=(0,E.useState)(!1),{isSupported:a,isSubscribed:o,isPending:s,error:c,subscribe:u,sendTest:d}=A(e);return(0,E.useEffect)(()=>{r(!0)},[]),!n||!a?null:(0,D.jsxs)(`div`,{className:`flex items-center gap-2 ${t}`,children:[(0,D.jsx)(`button`,{onClick:o?d:u,disabled:s,className:`
          flex items-center gap-2 px-3 py-2 rounded-lg font-medium
          transition-all duration-200
          ${s?`opacity-50 cursor-not-allowed`:o?`bg-green-100 text-green-700 hover:bg-green-200`:`bg-blue-100 text-blue-700 hover:bg-blue-200`}
        `,title:o?`Clique para testar notificações`:`Ativar notificações push`,children:s?(0,D.jsxs)(D.Fragment,{children:[(0,D.jsx)(l,{size:16,className:`animate-spin`}),(0,D.jsx)(`span`,{className:`text-sm`,children:`Carregando...`})]}):o?(0,D.jsxs)(D.Fragment,{children:[(0,D.jsx)(b,{size:16}),(0,D.jsx)(`span`,{className:`text-sm`,children:`Notificações ativas`})]}):(0,D.jsxs)(D.Fragment,{children:[(0,D.jsx)(x,{size:16}),(0,D.jsx)(`span`,{className:`text-sm`,children:`Ativar notificações`})]})}),c&&(0,D.jsxs)(`div`,{className:`flex items-center gap-1 text-red-600 text-xs`,children:[(0,D.jsx)(i,{size:14}),(0,D.jsx)(`span`,{children:c})]}),o&&!c&&(0,D.jsx)(`div`,{className:`text-xs text-gray-500`,children:`📬 Push notifications ativadas`})]})}function P(){let{tenant:e,signOut:t}=m(),[n,r]=(0,E.useState)(!1),[i,a]=(0,E.useState)(()=>typeof window>`u`?!1:window.localStorage.getItem(`ruptur-sidebar-collapsed`)===`true`);return(0,E.useEffect)(()=>{window.localStorage.setItem(`ruptur-sidebar-collapsed`,String(i))},[i]),(0,D.jsxs)(`div`,{className:`app-container ${i?`sidebar-collapsed`:``} ${n?`mobile-sidebar-open`:``}`,children:[(0,D.jsx)(k,{collapsed:i,mobileOpen:n,onMobileClose:()=>r(!1),onToggleCollapse:()=>a(e=>!e),onLogout:t,tenantId:e?.id,tenantName:e?.name}),n&&(0,D.jsx)(`button`,{type:`button`,className:`mobile-sidebar-backdrop`,"aria-label":`Fechar menu lateral`,onClick:()=>r(!1)}),(0,D.jsxs)(`main`,{className:`main-content`,children:[(0,D.jsxs)(`header`,{className:`top-header glass`,children:[(0,D.jsx)(`button`,{type:`button`,className:`mobile-menu-button`,"aria-label":`Abrir menu lateral`,onClick:()=>r(!0),children:(0,D.jsx)(C,{size:20})}),(0,D.jsxs)(`div`,{className:`header-right`,children:[(0,D.jsx)(c,{}),(0,D.jsx)(N,{token:localStorage.getItem(`auth_token`)}),(0,D.jsxs)(`div`,{className:`tenant-pill`,children:[(0,D.jsx)(`span`,{className:`tenant-dot`}),(0,D.jsx)(`span`,{className:`tenant-label`,children:e?.name||e?.slug||`Carregando...`})]})]})]}),(0,D.jsx)(`div`,{className:`page-container`,children:(0,D.jsx)(g,{})})]})]})}export{P as default};