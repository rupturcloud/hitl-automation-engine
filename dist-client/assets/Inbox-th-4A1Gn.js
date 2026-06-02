import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{t as r}from"./supabase-EexxNZgp.js";import{t as i}from"./circle-alert-DfP4N4b3.js";import{t as a}from"./clock-D5uRyZNP.js";import{t as o}from"./loader-B4OMqXoU.js";import{t as s}from"./message-square-5IXhojL7.js";import{t as c}from"./refresh-cw-qBxrYwIX.js";import{t as l}from"./search-DGVAnRxK.js";import{t as u}from"./settings-Cj0z6qiH.js";import{B as d,j as f}from"./index-BPxAC5Go.js";var p=f(`phone`,[[`path`,{d:`M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`,key:`9njp5v`}]]),m=t(e(),1),h=n(),g=()=>{let{session:e,isAuthenticated:t,loading:n,tenantId:f}=d(),[g,_]=(0,m.useState)(null),[v,y]=(0,m.useState)(!0),[b,x]=(0,m.useState)(null),[S,C]=(0,m.useState)([]),[w,T]=(0,m.useState)(null),[E,D]=(0,m.useState)(``),[O,k]=(0,m.useState)(!1),A=(0,m.useRef)(null);(0,m.useEffect)(()=>{async function r(){if(!n){if(!t||!e?.access_token){x(`Usuário não autenticado`),y(!1);return}try{y(!0),x(null);let t=await fetch(`/api/bubble/token`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${e.access_token}`}});if(!t.ok){let e=await t.json().catch(()=>({}));throw Error(e.error||`HTTP ${t.status}`)}_((await t.json()).bubble_url)}catch(e){console.error(`[Inbox] Erro ao buscar token Bubble:`,e),x(e.message||`Erro ao carregar inbox`)}finally{y(!1)}}}n||r()},[e,t,n]),(0,m.useEffect)(()=>{async function e(){if(!(!t||!f))try{k(!0);let{data:e,error:t}=await r.from(`uazapi_chats`).select(`
            id,
            chat_id,
            contact_phone,
            last_message,
            last_message_timestamp,
            unread_count,
            status,
            created_at
          `).eq(`tenant_id`,f).order(`last_message_timestamp`,{ascending:!1}).limit(50);if(t&&t.code!==`PGRST116`){console.warn(`[Inbox] Tabela uazapi_chats não encontrada, mostrando Bubble apenas`);return}e&&C(e)}catch(e){console.warn(`[Inbox] Erro ao carregar chats:`,e.message)}finally{k(!1)}}let n=setTimeout(e,500);return()=>clearTimeout(n)},[t,f]),(0,m.useEffect)(()=>{if(!(!t||!f)){try{A.current=r.channel(`chats:${f}`).on(`postgres_changes`,{event:`*`,schema:`public`,table:`uazapi_chats`,filter:`tenant_id=eq.${f}`},e=>{console.log(`[Inbox] Mudança em tempo real:`,e),(e.eventType===`INSERT`||e.eventType===`UPDATE`)&&C(t=>{let n=[...t],r=n.findIndex(t=>t.id===e.new?.id);return r>=0?n[r]=e.new:n.unshift(e.new),n.sort((e,t)=>new Date(t.last_message_timestamp)-new Date(e.last_message_timestamp))})}).subscribe()}catch(e){console.warn(`[Inbox] Erro ao setup realtime:`,e.message)}return()=>{A.current&&A.current.unsubscribe()}}},[t,f]);let j=()=>{y(!0),x(null),_(null),window.location.reload()},M=S.filter(e=>(e.contact_phone||``).toLowerCase().includes(E.toLowerCase())||(e.last_message||``).toLowerCase().includes(E.toLowerCase()));return(0,h.jsxs)(`div`,{className:`inbox-container`,children:[v&&(0,h.jsxs)(`div`,{className:`inbox-loading`,children:[(0,h.jsx)(o,{size:40,className:`spinner`}),(0,h.jsx)(`p`,{children:`Carregando Inbox Omnichannel...`})]}),b&&!v&&(0,h.jsxs)(`div`,{className:`inbox-error`,children:[(0,h.jsx)(i,{size:40}),(0,h.jsx)(`h3`,{children:`Erro ao carregar Inbox`}),(0,h.jsx)(`p`,{children:b}),(0,h.jsxs)(`button`,{className:`btn-retry`,onClick:j,children:[(0,h.jsx)(c,{size:16}),`Tentar novamente`]})]}),g&&!b&&(0,h.jsxs)(`div`,{className:`inbox-layout`,children:[(0,h.jsxs)(`div`,{className:`inbox-sidebar`,children:[(0,h.jsxs)(`div`,{className:`sidebar-header`,children:[(0,h.jsx)(`h2`,{children:`Conversas`}),(0,h.jsx)(`button`,{className:`btn-icon`,title:`Configurações`,children:(0,h.jsx)(u,{size:18})})]}),(0,h.jsxs)(`div`,{className:`sidebar-search`,children:[(0,h.jsx)(l,{size:16}),(0,h.jsx)(`input`,{type:`text`,placeholder:`Buscar...`,value:E,onChange:e=>D(e.target.value)})]}),(0,h.jsx)(`div`,{className:`sidebar-chats`,children:O?(0,h.jsx)(`div`,{className:`chat-loading`,children:(0,h.jsx)(o,{size:20,className:`spinner-small`})}):M.length>0?M.map(e=>(0,h.jsxs)(`div`,{className:`chat-item ${w?.id===e.id?`active`:``}`,onClick:()=>T(e),children:[(0,h.jsx)(`div`,{className:`chat-avatar`,children:(0,h.jsx)(p,{size:16})}),(0,h.jsxs)(`div`,{className:`chat-content`,children:[(0,h.jsxs)(`div`,{className:`chat-header`,children:[(0,h.jsx)(`span`,{className:`chat-name`,children:e.contact_phone||`Desconhecido`}),e.unread_count>0&&(0,h.jsx)(`span`,{className:`unread-badge`,children:e.unread_count})]}),(0,h.jsx)(`p`,{className:`chat-preview`,children:e.last_message||`(sem mensagens)`}),e.last_message_timestamp&&(0,h.jsxs)(`div`,{className:`chat-time`,children:[(0,h.jsx)(a,{size:12}),new Date(e.last_message_timestamp).toLocaleTimeString(`pt-BR`,{hour:`2-digit`,minute:`2-digit`})]})]})]},e.id)):(0,h.jsxs)(`div`,{className:`no-chats`,children:[(0,h.jsx)(s,{size:24}),(0,h.jsx)(`p`,{children:`Nenhuma conversa encontrada`})]})})]}),(0,h.jsx)(`iframe`,{src:g,className:`bubble-iframe`,title:`Ruptur Inbox (Powered by Bubble)`,allow:`camera;microphone;clipboard-read;clipboard-write`,sandbox:`allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox`})]}),(0,h.jsx)(`style`,{children:`
        .inbox-container {
          width: 100%;
          height: calc(100vh - 130px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10, 10, 18, 0.3);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-glass);
          overflow: hidden;
        }

        .inbox-loading,
        .inbox-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 40px;
          text-align: center;
        }

        .inbox-loading .spinner {
          animation: spin 2s linear infinite;
          color: var(--primary);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .inbox-loading p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .inbox-error {
          color: var(--accent);
        }

        .inbox-error h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 8px 0;
        }

        .inbox-error p {
          color: var(--text-muted);
          font-size: 0.9rem;
          max-width: 400px;
        }

        .btn-retry {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          border: 1px solid var(--primary);
          background: rgba(0, 242, 255, 0.1);
          color: var(--primary);
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .btn-retry:hover {
          background: rgba(0, 242, 255, 0.2);
        }

        /* Novo layout com sidebar */
        .inbox-layout {
          width: 100%;
          height: 100%;
          display: flex;
          gap: 1px;
          background: var(--border-glass);
        }

        .inbox-sidebar {
          width: 320px;
          height: 100%;
          background: rgba(10, 10, 18, 0.5);
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border-glass);
          overflow: hidden;
        }

        .sidebar-header {
          padding: 16px;
          border-bottom: 1px solid var(--border-glass);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: var(--text-primary);
        }

        .btn-icon {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .btn-icon:hover {
          color: var(--text-primary);
        }

        .sidebar-search {
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 242, 255, 0.05);
          border-bottom: 1px solid var(--border-glass);
        }

        .sidebar-search input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 0.9rem;
          outline: none;
        }

        .sidebar-search input::placeholder {
          color: var(--text-muted);
        }

        .sidebar-search svg {
          color: var(--text-muted);
        }

        .sidebar-chats {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-chats::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-chats::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-chats::-webkit-scrollbar-thumb {
          background: rgba(0, 242, 255, 0.3);
          border-radius: 3px;
        }

        .sidebar-chats::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 242, 255, 0.5);
        }

        .chat-item {
          padding: 12px 8px;
          border-bottom: 1px solid rgba(0, 242, 255, 0.1);
          cursor: pointer;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          transition: background 0.2s;
          position: relative;
        }

        .chat-item:hover {
          background: rgba(0, 242, 255, 0.1);
        }

        .chat-item.active {
          background: rgba(0, 242, 255, 0.15);
          border-left: 3px solid var(--primary);
          padding-left: 5px;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 242, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }

        .chat-content {
          flex: 1;
          min-width: 0;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          gap: 8px;
        }

        .chat-name {
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .unread-badge {
          background: var(--accent);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .chat-preview {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.85rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .chat-time {
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .chat-loading,
        .no-chats {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px 20px;
          color: var(--text-muted);
          text-align: center;
        }

        .spinner-small {
          animation: spin 2s linear infinite;
          color: var(--primary);
        }

        .no-chats svg {
          opacity: 0.5;
          margin-bottom: 8px;
        }

        .bubble-iframe {
          flex: 1;
          border: none;
          border-radius: 0;
        }

        @media (max-width: 768px) {
          .inbox-layout {
            flex-direction: column;
          }

          .inbox-sidebar {
            width: 100%;
            height: 200px;
            border-right: none;
            border-bottom: 1px solid var(--border-glass);
          }

          .bubble-iframe {
            flex: 1;
          }
        }

        @media (max-width: 640px) {
          .inbox-container {
            height: calc(100vh - 100px);
          }

          .inbox-sidebar {
            height: 150px;
          }

          .sidebar-header h2 {
            font-size: 1rem;
          }

          .chat-item {
            padding: 10px 6px;
          }

          .chat-avatar {
            width: 36px;
            height: 36px;
          }
        }
      `})]})};export{g as default};