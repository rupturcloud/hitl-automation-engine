import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{B as r,d as i}from"./index-BPxAC5Go.js";import{t as a}from"./whatsapp.api-BFs-WdVW.js";var o=t(e(),1),s=n(),c=`
  .inbox-root {
    display: flex;
    height: calc(100vh - 120px);
    min-height: 400px;
    border: 1px solid var(--ink-200);
    border-radius: 14px;
    overflow: hidden;
    background: var(--ink-0);
    margin-top: 16px;
  }

  /* — Painel esquerdo: conversas — */
  .inbox-sidebar {
    width: 300px;
    flex-shrink: 0;
    border-right: 1px solid var(--ink-200);
    display: flex;
    flex-direction: column;
    background: var(--ink-0);
  }
  .inbox-sidebar-head {
    padding: 14px 16px 10px;
    border-bottom: 1px solid var(--ink-200);
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
  }
  .inbox-sidebar-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink-700);
    letter-spacing: -.01em;
  }
  .inbox-search {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    background: var(--ink-100);
    border-radius: 8px;
    border: 1px solid transparent;
    transition: border-color .15s;
  }
  .inbox-search:focus-within {
    border-color: var(--brand-300, #FFBFAB);
    background: var(--ink-0);
  }
  .inbox-search input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 12.5px;
    color: var(--ink-900);
  }
  .inbox-search input::placeholder { color: var(--ink-400); }

  /* Seletor de instância */
  .inbox-inst-select {
    padding: 5px 8px;
    border-radius: 7px;
    border: 1px solid var(--ink-200);
    font-size: 11.5px;
    font-weight: 600;
    color: var(--ink-700);
    background: var(--ink-0);
    cursor: pointer;
    outline: none;
  }
  .inbox-inst-select:focus { border-color: var(--brand-400, #FF8A65); }

  /* Lista de chats */
  .inbox-chat-list {
    flex: 1;
    overflow-y: auto;
  }
  .inbox-chat-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 11px 14px;
    cursor: pointer;
    border-bottom: 1px solid var(--ink-100);
    transition: background .1s;
  }
  .inbox-chat-item:hover { background: var(--ink-50); }
  .inbox-chat-item.active { background: var(--brand-50, #FFF4F1); border-left: 2px solid var(--brand-500); }
  .inbox-chat-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--brand-500), #FFB088);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 12px;
    flex-shrink: 0;
  }
  .inbox-chat-info { flex: 1; min-width: 0; }
  .inbox-chat-name {
    font-weight: 600;
    font-size: 12.5px;
    color: var(--ink-900);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .inbox-chat-preview {
    font-size: 11.5px;
    color: var(--ink-500);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }
  .inbox-chat-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }
  .inbox-chat-time {
    font-size: 10.5px;
    color: var(--ink-400);
    font-variant-numeric: tabular-nums;
  }
  .inbox-chat-badge {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: var(--brand-500);
    color: white;
    font-size: 9.5px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* — Painel direito: mensagens — */
  .inbox-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: #0B141A;
  }
  .inbox-main-head {
    padding: 13px 18px;
    background: #1A232A;
    border-bottom: 1px solid rgba(255,255,255,.07);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .inbox-main-head .name {
    font-weight: 700;
    font-size: 13.5px;
    color: rgba(255,255,255,.92);
  }
  .inbox-main-head .phone {
    font-size: 11px;
    color: rgba(255,255,255,.4);
    font-family: ui-monospace, monospace;
    margin-top: 1px;
  }

  /* Área de mensagens */
  .inbox-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .inbox-bubble {
    padding: 7px 11px;
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.45;
    max-width: 65%;
    word-break: break-word;
    position: relative;
    animation: bubble-in .2s ease;
  }
  @keyframes bubble-in { from { opacity: 0; transform: translateY(3px); } }
  .inbox-bubble.sent {
    background: #005C4B;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 3px;
  }
  .inbox-bubble.received {
    background: #1F2C33;
    color: rgba(255,255,255,.9);
    align-self: flex-start;
    border-bottom-left-radius: 3px;
  }
  .inbox-bubble .ts {
    font-size: 9.5px;
    color: rgba(255,255,255,.4);
    margin-top: 4px;
    text-align: right;
  }

  /* Footer de reply */
  .inbox-reply-bar {
    padding: 12px 18px;
    background: #1A232A;
    border-top: 1px solid rgba(255,255,255,.07);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .inbox-reply-input {
    flex: 1;
    padding: 9px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.05);
    color: rgba(255,255,255,.9);
    font-size: 13px;
    outline: none;
    cursor: text;
    transition: border-color .15s;
  }
  .inbox-reply-input:focus {
    border-color: rgba(255,106,61,.5);
  }
  .inbox-reply-input::placeholder { color: rgba(255,255,255,.3); }
  .inbox-reply-send-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--brand-500, #FF6A3D);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity .15s, transform .1s;
  }
  .inbox-reply-send-btn:disabled {
    opacity: .4;
    cursor: not-allowed;
  }
  .inbox-reply-send-btn:not(:disabled):hover { opacity: .85; }
  .inbox-reply-send-btn:not(:disabled):active { transform: scale(.92); }

  /* Estado vazio e loading */
  .inbox-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: rgba(255,255,255,.25);
    padding: 40px;
    text-align: center;
  }
  .inbox-empty .icon { font-size: 36px; }
  .inbox-empty .label { font-size: 13px; line-height: 1.5; }

  .inbox-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,106,61,.2);
    border-top-color: var(--brand-500, #FF6A3D);
    border-radius: 50%;
    animation: spin .75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .inbox-sidebar-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 32px 20px;
    text-align: center;
    color: var(--ink-400);
    font-size: 12.5px;
  }

  @media (max-width: 768px) {
    .inbox-sidebar { width: 100%; }
    .inbox-root { flex-direction: column; height: auto; }
  }
`;function l(e){if(!e)return``;let t=e>1e10?e:e*1e3,n=new Date(t),r=new Date;return n.toDateString()===r.toDateString()?n.toLocaleTimeString(`pt-BR`,{hour:`2-digit`,minute:`2-digit`}):n.toLocaleDateString(`pt-BR`,{day:`2-digit`,month:`2-digit`})}function u(e){return e.name||e.wa_contactName||e.wa_name||(e.wa_chatid||``).replace(`@s.whatsapp.net`,``).replace(`@g.us`,``)||`?`}function d(e){return String(e).slice(0,2).toUpperCase()}function f(e){let t=e.wa_lastMessageText||e.wa_lastMessageTextVote||``;if(!t){let t=e.wa_lastMessageType||``;return t.includes(`image`)?`📷 Imagem`:t.includes(`audio`)||t.includes(`ptt`)?`🎤 Áudio`:t.includes(`video`)?`🎥 Vídeo`:t.includes(`document`)?`📄 Documento`:``}return t.length>48?t.slice(0,48)+`…`:t}function p(e){let t=e.message||{};return t.conversation||t.extendedTextMessage?.text||t.imageMessage?.caption||t.videoMessage?.caption||t.documentMessage?.title||t.buttonsResponseMessage?.selectedDisplayText||t.listResponseMessage?.title||(e.messageType===`audioMessage`||e.messageType===`pttMessage`?`🎤 Áudio`:``)||(e.messageType===`imageMessage`?`📷 Imagem`:``)||(e.messageType===`videoMessage`?`🎥 Vídeo`:``)||(e.messageType===`documentMessage`?`📄 Documento`:``)||`[mensagem]`}function m(){return(0,s.jsx)(`span`,{className:`inbox-spinner`})}function h({chat:e,active:t,onClick:n}){let r=u(e),i=f(e),a=e.wa_lastMsgTimestamp||e.wa_timestamp,o=e.wa_unreadCount||0;return(0,s.jsxs)(`div`,{className:`inbox-chat-item${t?` active`:``}`,onClick:n,children:[(0,s.jsx)(`div`,{className:`inbox-chat-avatar`,children:d(r)}),(0,s.jsxs)(`div`,{className:`inbox-chat-info`,children:[(0,s.jsx)(`div`,{className:`inbox-chat-name`,children:r}),i&&(0,s.jsx)(`div`,{className:`inbox-chat-preview`,children:i})]}),(0,s.jsxs)(`div`,{className:`inbox-chat-meta`,children:[a&&(0,s.jsx)(`div`,{className:`inbox-chat-time`,children:l(a)}),o>0&&(0,s.jsx)(`div`,{className:`inbox-chat-badge`,children:o>9?`9+`:o})]})]})}function g({msg:e}){let t=p(e),n=e.key?.fromMe===!0||e.fromMe===!0,r=e.messageTimestamp||e.timestamp;return(0,s.jsxs)(`div`,{className:`inbox-bubble ${n?`sent`:`received`}`,children:[(0,s.jsx)(`div`,{children:t}),r&&(0,s.jsx)(`div`,{className:`ts`,children:l(r)})]})}function _(){let{authReady:e}=r(),[t,n]=(0,o.useState)([]),[l,f]=(0,o.useState)(null),[p,_]=(0,o.useState)([]),[v,y]=(0,o.useState)(!1),[b,x]=(0,o.useState)(!1),[S,C]=(0,o.useState)(null),[w,T]=(0,o.useState)([]),[E,D]=(0,o.useState)(!1),[O,k]=(0,o.useState)(``),[A,j]=(0,o.useState)(``),[M,N]=(0,o.useState)(!1),P=(0,o.useRef)(null);(0,o.useEffect)(()=>{e&&a.listNumbers().then(e=>{let t=e?.data||[];n(t);let r=t.find(e=>(e.status||``).toLowerCase()===`connected`)||t[0];r&&f(r.id)}).catch(e=>console.warn(`[Inbox] listNumbers falhou:`,e.message))},[e]);let F=(0,o.useCallback)(async e=>{if(e){y(!0),x(!1);try{let t=(await a.getChats(e,40))?.data||{};t.freeTrialExpired||t.error===`INSTANCE_EXPIRED`?(x(!0),_([])):_(t.chats||[])}catch(e){console.warn(`[Inbox] getChats falhou:`,e.message),_([])}finally{y(!1)}}},[]);(0,o.useEffect)(()=>{l&&(C(null),T([]),F(l))},[l,F]),(0,o.useEffect)(()=>{if(!l)return;let e=setInterval(()=>F(l),3e4);return()=>clearInterval(e)},[l,F]),(0,o.useEffect)(()=>{if(!l||!S)return;let e=S.wa_chatid||S.wa_fastid;if(!e)return;async function t(){D(!0),T([]);try{let t=(await a.getMessages(l,e,60))?.data?.messages||[];t.sort((e,t)=>(e.messageTimestamp||e.timestamp||0)-(t.messageTimestamp||t.timestamp||0)),T(t)}catch(e){console.warn(`[Inbox] getMessages falhou:`,e.message)}finally{D(!1)}}t()},[l,S]),(0,o.useEffect)(()=>{!E&&w.length>0&&P.current?.scrollIntoView({behavior:`smooth`})},[w,E]);let I=O.trim()?p.filter(e=>{let t=O.toLowerCase();return u(e).toLowerCase().includes(t)||(e.wa_chatid||``).toLowerCase().includes(t)}):p;async function L(){let e=A.trim();if(!e||!l||!S||M)return;let t=S.wa_chatid||S.wa_fastid;if(!t)return;N(!0),j(``);let n={messageid:`local-${Date.now()}`,fromMe:!0,messageTimestamp:Math.floor(Date.now()/1e3),message:{conversation:e}};T(e=>[...e,n]);try{await a.sendMessage(l,t,e)}catch(t){console.warn(`[Inbox] sendMessage falhou:`,t.message),T(e=>e.filter(e=>e.messageid!==n.messageid)),j(e)}finally{N(!1)}}let R=t.find(e=>e.id===l),z=S?u(S):null,B=S?(S.wa_chatid||``).replace(`@s.whatsapp.net`,``).replace(`@g.us`,``):null;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:c}),(0,s.jsx)(i,{title:`Inbox`,sub:`Conversas recebidas via WhatsApp · leitura em tempo real`}),(0,s.jsxs)(`div`,{className:`inbox-root`,children:[(0,s.jsxs)(`div`,{className:`inbox-sidebar`,children:[(0,s.jsxs)(`div`,{className:`inbox-sidebar-head`,children:[t.length>1&&(0,s.jsx)(`select`,{className:`inbox-inst-select`,value:l||``,onChange:e=>f(e.target.value),children:t.map(e=>(0,s.jsxs)(`option`,{value:e.id,children:[`📱 `,e.name||e.phone||e.id,e.status===`connected`?` ✓`:``]},e.id))}),t.length===1&&(0,s.jsxs)(`div`,{className:`inbox-sidebar-title`,children:[`📱 `,R?.name||R?.phone||`WhatsApp`]}),(0,s.jsxs)(`div`,{className:`inbox-search`,children:[(0,s.jsxs)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,style:{color:`var(--ink-400)`,flexShrink:0},children:[(0,s.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,s.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,s.jsx)(`input`,{type:`text`,placeholder:`Buscar conversas…`,value:O,onChange:e=>k(e.target.value)})]})]}),(0,s.jsxs)(`div`,{className:`inbox-chat-list`,children:[b&&!v&&(0,s.jsxs)(`div`,{style:{margin:`12px 12px 0`,padding:`10px 12px`,background:`rgba(255,106,61,0.1)`,border:`1px solid rgba(255,106,61,0.3)`,borderRadius:8,fontSize:12,color:`#FF6A3D`,lineHeight:1.4},children:[`⚠️ `,(0,s.jsx)(`b`,{children:`Sessão expirada.`}),` Vá em `,(0,s.jsx)(`b`,{children:`Números`}),` e reconecte o QR para continuar.`]}),v&&(0,s.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`,padding:20},children:(0,s.jsx)(m,{})}),!v&&!b&&I.length===0&&(0,s.jsxs)(`div`,{className:`inbox-sidebar-empty`,children:[(0,s.jsx)(`div`,{style:{fontSize:28},children:`💬`}),(0,s.jsx)(`div`,{children:O?`Nenhuma conversa encontrada.`:`Nenhuma conversa ainda.
Aguardando mensagens…`}),!O&&!l&&(0,s.jsx)(`div`,{style:{fontSize:11,color:`var(--ink-300)`,marginTop:4},children:`Conecte um número em Números.`})]}),!v&&I.map(e=>(0,s.jsx)(h,{chat:e,active:S?.wa_chatid===e.wa_chatid||S?.wa_fastid===e.wa_fastid,onClick:()=>C(e)},e.wa_chatid||e.wa_fastid||e.id))]})]}),(0,s.jsx)(`div`,{className:`inbox-main`,children:S?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(`div`,{className:`inbox-main-head`,children:[(0,s.jsx)(`div`,{style:{width:36,height:36,borderRadius:`50%`,background:`linear-gradient(135deg, var(--brand-500), #FFB088)`,color:`white`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:800,fontSize:12,flexShrink:0},children:d(z)}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{className:`name`,children:z}),B&&(0,s.jsx)(`div`,{className:`phone`,children:B})]})]}),(0,s.jsxs)(`div`,{className:`inbox-messages`,children:[E&&(0,s.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`,paddingTop:20},children:(0,s.jsx)(m,{})}),!E&&w.length===0&&(0,s.jsxs)(`div`,{className:`inbox-empty`,children:[(0,s.jsx)(`div`,{className:`icon`,style:{fontSize:24},children:`🔇`}),(0,s.jsx)(`div`,{className:`label`,children:`Sem mensagens carregadas`})]}),!E&&w.map((e,t)=>(0,s.jsx)(g,{msg:e},e.messageid||e.id||t)),(0,s.jsx)(`div`,{ref:P})]}),(0,s.jsxs)(`div`,{className:`inbox-reply-bar`,children:[(0,s.jsx)(`input`,{className:`inbox-reply-input`,type:`text`,placeholder:`Digite uma mensagem…`,value:A,onChange:e=>j(e.target.value),onKeyDown:e=>{e.key===`Enter`&&!e.shiftKey&&(e.preventDefault(),L())},disabled:M}),(0,s.jsx)(`button`,{className:`inbox-reply-send-btn`,onClick:L,disabled:M||!A.trim(),title:`Enviar mensagem`,children:M?(0,s.jsx)(`span`,{className:`inbox-spinner`,style:{width:14,height:14,borderWidth:2}}):(0,s.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`white`,strokeWidth:`2.5`,children:[(0,s.jsx)(`line`,{x1:`22`,y1:`2`,x2:`11`,y2:`13`}),(0,s.jsx)(`polygon`,{points:`22 2 15 22 11 13 2 9 22 2`})]})})]})]}):(0,s.jsxs)(`div`,{className:`inbox-empty`,children:[(0,s.jsx)(`div`,{className:`icon`,children:`💬`}),(0,s.jsxs)(`div`,{className:`label`,children:[`Selecione uma conversa`,(0,s.jsx)(`br`,{}),`para ver as mensagens`]})]})})]})]})}export{_ as default};