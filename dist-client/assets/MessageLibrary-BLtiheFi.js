import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{n as r,t as i}from"./errorHelper-pZOAc_yK.js";import{t as a}from"./message-square-text-DXZp2iEU.js";import{t as o}from"./plus-pbL6Jqcj.js";import{t as s}from"./save-CU7Uzaiy.js";import{t as c}from"./trash-2-s-R89qYP.js";import{t as l}from"./ConfirmDialog-_vxdPF3e.js";import{z as u}from"./index-BPxAC5Go.js";var d=t(e(),1),f=n();function p(){return{id:`client-message-${Date.now()}`,name:`Nova mensagem`,category:`Geral`,text:`Oi, tudo certo por aí?`,createdAt:new Date().toISOString()}}function m(){let[e,t]=(0,d.useState)(null),[n,m]=(0,d.useState)([]),[h,g]=(0,d.useState)(!0),[_,v]=(0,d.useState)(!1),[y,b]=(0,d.useState)(null),[x,S]=(0,d.useState)(null);async function C(){g(!0);try{let e=await u.getWarmupConfig();t(e),m(Array.isArray(e.messages)?e.messages:[])}catch(e){b({type:`error`,message:i(e,`warmup`)})}finally{g(!1)}}(0,d.useEffect)(()=>{Promise.resolve().then(()=>C())},[]);function w(e,t){m(n=>n.map((n,r)=>r===e?{...n,...t}:n))}async function T(){v(!0);try{await u.syncWarmupConfig({settings:e?.settings||{},routines:e?.routines||[],messages:n}),b({type:`success`,message:`Biblioteca de mensagens salva com sucesso.`}),await C()}catch(e){b({type:`error`,message:i(e,`warmup`)})}finally{v(!1)}}function E(e){S(e)}function D(){x!==null&&(m(e=>e.filter((e,t)=>t!==x)),b({type:`info`,message:`Mensagem removida. Clique em Salvar para confirmar.`})),S(null)}return(0,f.jsxs)(`div`,{className:`global-page`,children:[(0,f.jsxs)(`header`,{className:`page-header`,children:[(0,f.jsxs)(`div`,{children:[(0,f.jsxs)(`h1`,{children:[`Biblioteca de `,(0,f.jsx)(`span`,{children:`Mensagens`})]}),(0,f.jsx)(`p`,{children:`Modelos reutilizáveis para aquecimento, campanhas e fluxos do cliente.`})]}),(0,f.jsxs)(`div`,{className:`header-actions`,children:[(0,f.jsxs)(`button`,{className:`btn-secondary`,onClick:()=>m(e=>[...e,p()]),children:[(0,f.jsx)(o,{size:18}),` Nova mensagem`]}),(0,f.jsxs)(`button`,{className:`btn-primary`,onClick:T,disabled:_,children:[(0,f.jsx)(s,{size:18}),` `,_?`Salvando...`:`Salvar`]})]})]}),(0,f.jsx)(`section`,{className:`glass panel`,children:h?(0,f.jsx)(`div`,{style:{padding:`40px`,textAlign:`center`,color:`var(--text-muted)`},children:`Carregando mensagens...`}):n.length===0?(0,f.jsxs)(`div`,{className:`empty`,children:[(0,f.jsx)(a,{size:36}),(0,f.jsx)(`strong`,{children:`Nenhuma mensagem cadastrada`}),(0,f.jsx)(`span`,{children:`Crie modelos para reaproveitar nas funcionalidades do cliente.`})]}):(0,f.jsx)(`div`,{className:`message-grid`,children:n.map((e,t)=>(0,f.jsxs)(`article`,{className:`message-card glass`,children:[(0,f.jsxs)(`div`,{className:`message-card-head`,children:[(0,f.jsx)(`input`,{value:e.name||``,onChange:e=>w(t,{name:e.target.value}),placeholder:`Nome da mensagem`,maxLength:50}),(0,f.jsx)(`button`,{className:`icon-btn danger`,title:`Deletar mensagem`,onClick:()=>E(t),children:(0,f.jsx)(c,{size:15})})]}),(0,f.jsx)(`input`,{value:e.category||``,onChange:e=>w(t,{category:e.target.value}),placeholder:`Categoria (ex: Promoção, Suporte)`,maxLength:30}),(0,f.jsx)(`textarea`,{rows:`5`,value:e.text||``,onChange:e=>w(t,{text:e.target.value}),placeholder:`Texto da mensagem. Use {{name}} para personalizar.`,maxLength:1e3}),(0,f.jsx)(`div`,{className:`message-card-footer`,children:(0,f.jsxs)(`span`,{className:`char-count`,children:[(e.text||``).length,` / 1000`]})})]},e.id||t))})}),(0,f.jsx)(l,{open:x!==null,title:`Deletar mensagem?`,message:`Essa ação não pode ser desfeita. A mensagem será removida do banco de dados.`,confirmLabel:`Deletar`,cancelLabel:`Cancelar`,isDangerous:!0,onConfirm:D,onCancel:()=>S(null)}),(0,f.jsx)(`style`,{children:`
        .global-page { display: flex; flex-direction: column; gap: 24px; }
        .page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; }
        .page-header h1 span { color: var(--primary); }
        .page-header p { color: var(--text-muted); margin-top: 6px; }
        .header-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .panel { padding: 18px; border-radius: 20px; }
        .message-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
        .message-card {
          padding: 16px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s;
        }
        .message-card:hover { border-color: rgba(0, 242, 255, 0.3); box-shadow: 0 0 20px rgba(0, 242, 255, 0.1); }
        .message-card-head { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: start; }
        .message-card-head input { min-height: 36px; }
        .message-card-footer { display: flex; justify-content: flex-end; font-size: 0.7rem; color: var(--text-muted); }
        input, textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 10px;
          font-family: inherit;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        input:focus, textarea:focus { outline: none; border-color: rgba(0, 242, 255, 0.5); background: rgba(0, 242, 255, 0.05); }
        textarea { resize: vertical; font-family: 'Monaco', 'Courier New', monospace; }
        .empty {
          min-height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
          color: var(--text-muted);
          text-align: center;
        }
        .empty svg { color: var(--primary); filter: drop-shadow(0 0 12px var(--primary-glow)); }
        .empty strong { color: white; }
        @media (max-width: 768px) {
          .page-header { align-items: stretch; flex-direction: column; }
          .message-grid { grid-template-columns: 1fr; }
        }
      `}),y&&(0,f.jsx)(r,{type:y.type,message:y.message,onClose:()=>b(null)})]})}export{m as default};