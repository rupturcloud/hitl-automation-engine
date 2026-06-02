import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{n as r,t as i}from"./errorHelper-pZOAc_yK.js";import{t as a}from"./plus-pbL6Jqcj.js";import{t as o}from"./trash-2-s-R89qYP.js";import{t as s}from"./ConfirmDialog-_vxdPF3e.js";import{t as c}from"./x-BVVFqqBf.js";import{B as l,g as u,h as d,j as f,z as p}from"./index-BPxAC5Go.js";import{t as m}from"./useApi-CIhQ2Jk5.js";var h=f(`bold`,[[`path`,{d:`M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8`,key:`mg9rjx`}]]),g=f(`check-check`,[[`path`,{d:`M18 6 7 17l-5-5`,key:`116fxf`}],[`path`,{d:`m22 10-7.5 7.5L13 16`,key:`ke71qq`}]]),_=f(`code`,[[`path`,{d:`m16 18 6-6-6-6`,key:`eg8j8`}],[`path`,{d:`m8 6-6 6 6 6`,key:`ppft3o`}]]),v=f(`grip-vertical`,[[`circle`,{cx:`9`,cy:`12`,r:`1`,key:`1vctgf`}],[`circle`,{cx:`9`,cy:`5`,r:`1`,key:`hp0tcf`}],[`circle`,{cx:`9`,cy:`19`,r:`1`,key:`fkjjf6`}],[`circle`,{cx:`15`,cy:`12`,r:`1`,key:`1tmaij`}],[`circle`,{cx:`15`,cy:`5`,r:`1`,key:`19l28e`}],[`circle`,{cx:`15`,cy:`19`,r:`1`,key:`f4zoj3`}]]),y=f(`italic`,[[`line`,{x1:`19`,x2:`10`,y1:`4`,y2:`4`,key:`15jd3p`}],[`line`,{x1:`14`,x2:`5`,y1:`20`,y2:`20`,key:`bu0au3`}],[`line`,{x1:`15`,x2:`9`,y1:`4`,y2:`20`,key:`uljnxc`}]]),b=f(`link-2`,[[`path`,{d:`M9 17H7A5 5 0 0 1 7 7h2`,key:`8i5ue5`}],[`path`,{d:`M15 7h2a5 5 0 1 1 0 10h-2`,key:`1b9ql8`}],[`line`,{x1:`8`,x2:`16`,y1:`12`,y2:`12`,key:`1jonct`}]]),x=f(`paperclip`,[[`path`,{d:`m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551`,key:`1miecu`}]]),S=t(e(),1),C=n();function w({value:e,onChange:t}){let[n,r]=(0,S.useState)(!1),i=[{name:`{{name}}`,label:`Nome`},{name:`{{phone}}`,label:`Telefone`},{name:`{{email}}`,label:`Email`},{name:`{{company}}`,label:`Empresa`}],a=n=>{let r=document.getElementById(`message-input`),i=r.selectionStart,a=r.selectionEnd;t(e.slice(0,i)+n+e.slice(a)),setTimeout(()=>{r.focus(),r.setSelectionRange(i+n.length,i+n.length)},0)},o=(n,r=``)=>{let i=document.getElementById(`message-input`),a=i.selectionStart,o=i.selectionEnd,s=e.slice(a,o);t(e.slice(0,a)+n+s+r+e.slice(o))};return(0,C.jsxs)(`div`,{className:`message-composer`,children:[(0,C.jsxs)(`div`,{className:`composer-toolbar`,children:[(0,C.jsxs)(`div`,{className:`toolbar-group`,children:[(0,C.jsx)(`button`,{className:`toolbar-btn`,onClick:()=>o(`*`,`*`),title:`Negrito`,children:(0,C.jsx)(h,{size:16})}),(0,C.jsx)(`button`,{className:`toolbar-btn`,onClick:()=>o(`_`,`_`),title:`Itálico`,children:(0,C.jsx)(y,{size:16})}),(0,C.jsx)(`button`,{className:`toolbar-btn`,onClick:()=>o("`","`"),title:`Código`,children:(0,C.jsx)(_,{size:16})})]}),(0,C.jsx)(`div`,{className:`toolbar-group`,children:(0,C.jsx)(`button`,{className:`toolbar-btn`,onClick:()=>o(`[Link](`,`)]})`),title:`Link`,children:(0,C.jsx)(b,{size:16})})}),(0,C.jsx)(`div`,{className:`toolbar-group`,children:(0,C.jsx)(`button`,{className:`toolbar-btn ${n?`active`:``}`,onClick:()=>r(!n),title:`Adicionar variáveis`,children:{}})}),(0,C.jsx)(`div`,{style:{flex:1}}),(0,C.jsxs)(`div`,{className:`char-count`,children:[(e||``).length,` / 1000`]})]}),n&&(0,C.jsxs)(d.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:`auto`},exit:{opacity:0,height:0},className:`variables-panel`,children:[(0,C.jsx)(`div`,{className:`variables-header`,children:(0,C.jsx)(`p`,{children:`Variáveis disponíveis`})}),(0,C.jsx)(`div`,{className:`variables-grid`,children:i.map(e=>(0,C.jsxs)(`button`,{className:`variable-btn`,onClick:()=>a(e.name),children:[(0,C.jsx)(`code`,{children:e.name}),(0,C.jsx)(`span`,{children:e.label})]},e.name))})]}),(0,C.jsx)(`textarea`,{id:`message-input`,className:`message-input`,value:e,onChange:e=>t(e.target.value),placeholder:`Digite sua mensagem aqui... Use {{name}} para personalizar, {opção1|opção2} para variações`,rows:8,maxLength:1e3}),(0,C.jsxs)(`div`,{className:`composer-hints`,children:[(0,C.jsxs)(`div`,{className:`hint-item`,children:[(0,C.jsx)(`code`,{children:`*texto*`}),` → `,(0,C.jsx)(`strong`,{children:`negrito`})]}),(0,C.jsxs)(`div`,{className:`hint-item`,children:[(0,C.jsx)(`code`,{children:`_texto_`}),` → `,(0,C.jsx)(`em`,{children:`itálico`})]}),(0,C.jsxs)(`div`,{className:`hint-item`,children:[(0,C.jsx)(`code`,{children:`{{name}}`}),` → personalização`]}),(0,C.jsxs)(`div`,{className:`hint-item`,children:[(0,C.jsx)(`code`,{children:`{{opção1|opção2}}`}),` → variação (anti-spam)`]})]}),(0,C.jsx)(`style`,{jsx:!0,children:`
        .message-composer {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
        }

        .composer-toolbar {
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-wrap: wrap;
        }

        .toolbar-group {
          display: flex;
          gap: 4px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding-right: 8px;
        }

        .toolbar-group:last-of-type {
          border-right: none;
        }

        .toolbar-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .toolbar-btn:hover {
          background: rgba(0, 242, 255, 0.1);
          color: var(--primary);
          border-color: rgba(0, 242, 255, 0.3);
        }

        .toolbar-btn.active {
          background: rgba(0, 242, 255, 0.2);
          color: var(--primary);
          border-color: rgba(0, 242, 255, 0.5);
        }

        .char-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
        }

        .variables-panel {
          background: rgba(0, 242, 255, 0.05);
          border: 1px solid rgba(0, 242, 255, 0.2);
          border-radius: 8px;
          padding: 12px;
        }

        .variables-header {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .variables-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 6px;
        }

        .variable-btn {
          padding: 8px 10px;
          background: rgba(0, 242, 255, 0.1);
          border: 1px solid rgba(0, 242, 255, 0.3);
          border-radius: 6px;
          color: var(--primary);
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
        }

        .variable-btn:hover {
          background: rgba(0, 242, 255, 0.2);
          border-color: rgba(0, 242, 255, 0.5);
        }

        .variable-btn code {
          font-weight: 600;
        }

        .variable-btn span {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .message-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          resize: vertical;
          transition: all 0.2s;
          min-height: 120px;
        }

        .message-input:focus {
          outline: none;
          border-color: rgba(0, 242, 255, 0.5);
          background: rgba(0, 242, 255, 0.05);
          box-shadow: 0 0 12px rgba(0, 242, 255, 0.1);
        }

        .composer-hints {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
          margin-top: 8px;
        }

        .hint-item {
          font-size: 0.75rem;
          color: var(--text-muted);
          padding: 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          border-left: 2px solid rgba(0, 242, 255, 0.3);
        }

        .hint-item code {
          color: var(--primary);
          font-size: 0.7rem;
        }
      `})]})}function T({message:e=``,mediaUrl:t=``,mediaType:n=`text`,buttons:r=[],showTimestamp:i=!0}){let a=(e=>{if(!e)return[];let t=[],n=[{regex:/\*\*(.+?)\*\*/g,tag:`strong`},{regex:/_(.+?)_/g,tag:`em`},{regex:/`(.+?)`/g,tag:`code`},{regex:/\{\{([^}]+)\}\}/g,tag:`variable`},{regex:/\{([^}|]+)\|(.+?)\}/g,tag:`spintext`}],r=0,i=[];return n.forEach(({regex:t,tag:n})=>{let r;for(;(r=t.exec(e))!==null;)i.push({start:r.index,end:r.index+r[0].length,tag:n,content:r[1]||r[0],original:r[0]})}),i.sort((e,t)=>e.start-t.start),r=0,i.forEach(n=>{n.start>r&&t.push({type:`text`,content:e.slice(r,n.start)}),t.push({type:n.tag,content:n.content}),r=n.end}),r<e.length&&t.push({type:`text`,content:e.slice(r)}),t})(e);return(0,C.jsxs)(`div`,{className:`phone-preview`,children:[(0,C.jsxs)(d.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},className:`phone-frame`,children:[(0,C.jsxs)(`div`,{className:`phone-header`,children:[(0,C.jsxs)(`div`,{className:`status-bar`,children:[(0,C.jsx)(`span`,{className:`time`,children:`9:41`}),(0,C.jsxs)(`div`,{className:`status-icons`,children:[(0,C.jsx)(`span`,{children:`📶`}),(0,C.jsx)(`span`,{children:`🔋`})]})]}),(0,C.jsxs)(`div`,{className:`chat-header`,children:[(0,C.jsxs)(`div`,{className:`contact-info`,children:[(0,C.jsx)(`div`,{className:`avatar`,children:`👤`}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`p`,{className:`contact-name`,children:`João Silva`}),(0,C.jsx)(`p`,{className:`contact-status`,children:`Online`})]})]}),(0,C.jsxs)(`div`,{className:`chat-actions`,children:[(0,C.jsx)(`button`,{children:`☎️`}),(0,C.jsx)(`button`,{children:`ℹ️`})]})]})]}),(0,C.jsxs)(`div`,{className:`messages-area`,children:[e&&(0,C.jsxs)(d.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:`message-bubble received`,children:[t&&n!==`text`&&(0,C.jsxs)(`div`,{className:`message-media`,children:[n===`image`&&(0,C.jsx)(`img`,{src:t,alt:`preview`,onError:e=>{e.target.src=`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120"%3E%3Crect fill="%23333" width="200" height="120"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EImagem inválida%3C/text%3E%3C/svg%3E`}}),n===`video`&&(0,C.jsx)(`div`,{className:`media-placeholder`,children:`🎬 Vídeo`}),n===`audio`&&(0,C.jsx)(`div`,{className:`media-placeholder`,children:`🎵 Áudio`}),n===`document`&&(0,C.jsx)(`div`,{className:`media-placeholder`,children:`📄 Documento`})]}),e&&(0,C.jsx)(`p`,{className:`message-text`,children:a.map((e,t)=>e.type===`text`?e.content:e.type===`strong`?(0,C.jsx)(`strong`,{style:{fontWeight:600},children:e.content},t):e.type===`em`?(0,C.jsx)(`em`,{style:{fontStyle:`italic`},children:e.content},t):e.type===`code`?(0,C.jsx)(`code`,{style:{background:`rgba(255,255,255,0.1)`,padding:`2px 4px`,borderRadius:3},children:e.content},t):e.type===`variable`?(0,C.jsx)(`span`,{style:{color:`#ffaa00`,fontWeight:500,padding:`0 2px`},children:`{{`+e.content+`}}`},t):e.type===`spintext`?(0,C.jsxs)(`span`,{title:`Variação de texto (anti-spam)`,style:{background:`rgba(0, 242, 255, 0.1)`,padding:`2px 4px`,borderRadius:3,cursor:`help`},children:[e.content,`*`]},t):e.content)}),r.length>0&&(0,C.jsx)(`div`,{className:`message-buttons`,children:r.map((e,t)=>(0,C.jsx)(d.button,{whileHover:{scale:1.02},whileTap:{scale:.98},className:`action-button`,children:e.buttonText||`Botão `+(t+1)},t))}),i&&(0,C.jsxs)(`div`,{className:`message-timestamp`,children:[(0,C.jsx)(`span`,{children:`9:41`}),(0,C.jsx)(g,{size:12})]})]}),!e&&(0,C.jsx)(`div`,{className:`preview-empty`,children:(0,C.jsx)(`p`,{children:`👇 Digite sua mensagem acima para ver o preview`})})]}),(0,C.jsxs)(`div`,{className:`input-area`,children:[(0,C.jsx)(`button`,{className:`input-btn`,children:(0,C.jsx)(x,{size:18})}),(0,C.jsx)(`input`,{type:`text`,placeholder:`Escrever uma mensagem...`,disabled:!0}),(0,C.jsx)(`button`,{className:`input-btn`,children:`🎙️`})]})]}),(0,C.jsx)(`style`,{jsx:!0,children:`
        .phone-preview {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 20px;
        }

        .phone-frame {
          width: 100%;
          max-width: 320px;
          height: 600px;
          background: #fff;
          border-radius: 40px;
          border: 12px solid #000;
          border-top-width: 26px;
          border-bottom-width: 26px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .phone-frame::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 24px;
          background: #000;
          border-radius: 0 0 20px 20px;
          z-index: 10;
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px 4px;
          font-size: 12px;
          color: #000;
          font-weight: 600;
          background: #f5f5f5;
        }

        .status-icons {
          display: flex;
          gap: 4px;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: linear-gradient(135deg, #075e54 0%, #128c7e 100%);
          color: white;
        }

        .contact-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .contact-name {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .contact-status {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
        }

        .chat-actions {
          display: flex;
          gap: 16px;
        }

        .chat-actions button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 12px 8px;
          background: #ece5dd;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .messages-area::-webkit-scrollbar {
          width: 4px;
        }

        .messages-area::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }

        .message-bubble {
          max-width: 85%;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.4;
          word-wrap: break-word;
          animation: slideIn 0.3s ease;
        }

        .message-bubble.received {
          background: #fff;
          color: #000;
          align-self: flex-start;
          border-bottom-left-radius: 2px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        }

        .message-text {
          margin: 0 0 4px 0;
          word-break: break-word;
        }

        .message-media {
          width: 100%;
          max-height: 150px;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 8px;
          background: rgba(0, 0, 0, 0.1);
        }

        .message-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-placeholder {
          width: 100%;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ddd 0%, #999 100%);
          color: #666;
          font-weight: 600;
          font-size: 14px;
        }

        .message-buttons {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 8px;
        }

        .action-button {
          padding: 10px 16px;
          background: #075e54;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-button:hover {
          background: #054a3d;
        }

        .message-timestamp {
          display: flex;
          gap: 4px;
          align-items: center;
          font-size: 11px;
          color: #999;
          margin-top: 2px;
        }

        .preview-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 14px;
          text-align: center;
        }

        .input-area {
          display: flex;
          gap: 8px;
          padding: 8px 12px;
          background: #f5f5f5;
          border-top: 1px solid #e0e0e0;
          align-items: center;
        }

        .input-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #075e54;
        }

        .input-area input {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 20px;
          padding: 8px 12px;
          font-size: 13px;
          outline: none;
          background: white;
        }

        @media (max-width: 480px) {
          .phone-preview {
            padding: 0;
          }

          .phone-frame {
            border-radius: 0;
            border: none;
            max-width: 100%;
          }

          .phone-frame::before {
            display: none;
          }
        }
      `})]})}function E({buttons:e=[],onChange:t,maxButtons:n=3,mode:r=`quick`}){let i=()=>{e.length<n&&t([...e,{id:`btn-${Date.now()}`,text:``,type:r===`quick`?`reply`:`url`,value:``}])},s=(n,r,i)=>{let a=[...e];a[n]={...a[n],[r]:i},t(a)},c=n=>{t(e.filter((e,t)=>t!==n))},l=n=>{let r=e[n];t([...e,{...r,id:`btn-${Date.now()}`}])};return(0,C.jsxs)(`div`,{className:`button-builder`,children:[(0,C.jsxs)(`div`,{className:`builder-header`,children:[(0,C.jsx)(`h4`,{children:r===`quick`?`⚡ Botões de Resposta Rápida`:`📋 Botões com Link`}),(0,C.jsxs)(`span`,{className:`button-count`,children:[e.length,` / `,n]})]}),(0,C.jsx)(u,{children:e.map((e,t)=>(0,C.jsxs)(d.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},exit:{opacity:0,x:20},className:`button-row`,children:[(0,C.jsx)(`div`,{className:`button-drag-handle`,children:(0,C.jsx)(v,{size:16})}),(0,C.jsxs)(`div`,{className:`button-inputs`,children:[(0,C.jsx)(`input`,{type:`text`,placeholder:`Texto do botão`,value:e.text,onChange:e=>s(t,`text`,e.target.value),maxLength:24,className:`button-text-input`}),r===`url`&&(0,C.jsx)(`input`,{type:`text`,placeholder:`https://seu-link.com`,value:e.value,onChange:e=>s(t,`value`,e.target.value),className:`button-value-input`}),r===`quick`&&(0,C.jsx)(`input`,{type:`text`,placeholder:`ID único (ex: btn_comprar)`,value:e.value,onChange:e=>s(t,`value`,e.target.value),maxLength:20,className:`button-id-input`})]}),(0,C.jsxs)(`div`,{className:`button-actions`,children:[(0,C.jsx)(`button`,{className:`action-btn copy`,onClick:()=>l(t),title:`Duplicar`,children:`📋`}),(0,C.jsx)(`button`,{className:`action-btn delete`,onClick:()=>c(t),title:`Deletar`,children:(0,C.jsx)(o,{size:14})})]})]},e.id))}),e.length<n&&(0,C.jsxs)(d.button,{whileHover:{scale:1.02},whileTap:{scale:.98},className:`btn-add-button`,onClick:i,children:[(0,C.jsx)(a,{size:16}),` Adicionar Botão`]}),e.length===n&&(0,C.jsxs)(`div`,{className:`button-limit-reached`,children:[`⚠️ Limite máximo de `,n,` botões atingido`]}),(0,C.jsxs)(`div`,{className:`button-preview`,children:[(0,C.jsx)(`p`,{className:`preview-label`,children:`Preview:`}),(0,C.jsx)(`div`,{className:`preview-buttons`,children:e.length===0?(0,C.jsx)(`span`,{className:`preview-empty`,children:`Nenhum botão adicionado`}):e.map(e=>(0,C.jsx)(d.button,{whileHover:{scale:1.05},className:`preview-button`,disabled:!0,children:e.text||`Botão`},e.id))})]}),(0,C.jsx)(`style`,{jsx:!0,children:`
        .button-builder {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
        }

        .builder-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .builder-header h4 {
          margin: 0;
          font-size: 0.95rem;
          color: white;
        }

        .button-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .button-row {
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          animation: slideIn 0.3s ease;
        }

        .button-drag-handle {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: grab;
          padding: 4px;
        }

        .button-drag-handle:active {
          cursor: grabbing;
        }

        .button-inputs {
          flex: 1;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .button-text-input,
        .button-id-input,
        .button-value-input {
          flex: 1;
          min-width: 120px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: white;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .button-text-input::placeholder,
        .button-id-input::placeholder,
        .button-value-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .button-text-input:focus,
        .button-id-input:focus,
        .button-value-input:focus {
          outline: none;
          border-color: rgba(0, 242, 255, 0.5);
          background: rgba(0, 242, 255, 0.05);
        }

        .button-actions {
          display: flex;
          gap: 6px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(0, 242, 255, 0.1);
          color: var(--primary);
          border-color: rgba(0, 242, 255, 0.3);
        }

        .action-btn.delete:hover {
          background: rgba(255, 68, 102, 0.1);
          color: #ff4466;
          border-color: rgba(255, 68, 102, 0.3);
        }

        .btn-add-button {
          padding: 10px 16px;
          background: rgba(0, 242, 255, 0.1);
          border: 1px dashed rgba(0, 242, 255, 0.3);
          border-radius: 8px;
          color: var(--primary);
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .btn-add-button:hover {
          background: rgba(0, 242, 255, 0.2);
          border-color: rgba(0, 242, 255, 0.5);
        }

        .button-limit-reached {
          padding: 10px;
          background: rgba(255, 170, 0, 0.1);
          border: 1px solid rgba(255, 170, 0, 0.3);
          border-radius: 6px;
          color: #ffaa00;
          font-size: 0.8rem;
          text-align: center;
        }

        .button-preview {
          margin-top: 8px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .preview-label {
          margin: 0 0 8px 0;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .preview-buttons {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .preview-button {
          padding: 12px;
          background: rgba(7, 94, 84, 0.3);
          border: 1px solid rgba(7, 94, 84, 0.5);
          border-radius: 6px;
          color: #075e54;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: default;
          transition: all 0.2s;
          text-align: center;
        }

        .preview-button:hover {
          background: rgba(7, 94, 84, 0.4);
        }

        .preview-empty {
          display: block;
          padding: 12px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .button-row {
            flex-direction: column;
            align-items: stretch;
          }

          .button-inputs {
            flex-direction: column;
          }

          .button-text-input,
          .button-id-input,
          .button-value-input {
            width: 100%;
          }

          .button-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `})]})}function D({campaign:e,onCampaignChange:t,onSave:n,onCancel:r,fileInputRef:i,onFileUpload:o,csvContacts:s,onClearCsv:l,loading:u}){return(0,C.jsx)(d.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:`campaign-editor-overlay`,onClick:r,children:(0,C.jsxs)(d.div,{initial:{scale:.9,y:20},animate:{scale:1,y:0},className:`campaign-editor-modal`,onClick:e=>e.stopPropagation(),children:[(0,C.jsxs)(`div`,{className:`editor-header`,children:[(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`h2`,{children:`✨ Criar Nova Campanha`}),(0,C.jsx)(`p`,{children:`Editor visual com preview em tempo real`})]}),(0,C.jsx)(`button`,{className:`close-btn`,onClick:r,title:`Fechar`,children:(0,C.jsx)(c,{size:20})})]}),(0,C.jsxs)(`div`,{className:`editor-body`,children:[(0,C.jsxs)(`div`,{className:`editor-left`,children:[(0,C.jsxs)(`section`,{className:`form-section`,children:[(0,C.jsx)(`h4`,{className:`section-title`,children:`📋 Informações Básicas`}),(0,C.jsxs)(`div`,{className:`form-group`,children:[(0,C.jsx)(`label`,{children:`Nome da Campanha`}),(0,C.jsx)(`input`,{type:`text`,placeholder:`Ex: Oferta Especial Maio`,value:e.name,onChange:n=>t({...e,name:n.target.value}),maxLength:50})]}),(0,C.jsxs)(`div`,{className:`form-row`,children:[(0,C.jsxs)(`div`,{className:`form-group`,children:[(0,C.jsx)(`label`,{children:`Tipo de Mensagem`}),(0,C.jsxs)(`select`,{value:e.mediaType,onChange:n=>t({...e,mediaType:n.target.value}),children:[(0,C.jsx)(`option`,{value:`text`,children:`📝 Texto Simples`}),(0,C.jsx)(`option`,{value:`image`,children:`🖼️ Imagem (JPG/PNG)`}),(0,C.jsx)(`option`,{value:`video`,children:`🎬 Vídeo (MP4)`}),(0,C.jsx)(`option`,{value:`audio`,children:`🎵 Áudio (MP3)`}),(0,C.jsx)(`option`,{value:`document`,children:`📄 Documento (PDF)`})]})]}),e.mediaType!==`text`&&(0,C.jsxs)(`div`,{className:`form-group`,children:[(0,C.jsx)(`label`,{children:`URL da Mídia`}),(0,C.jsx)(`input`,{type:`text`,placeholder:`https://seu-dominio.com/arquivo.jpg`,value:e.mediaUrl,onChange:n=>t({...e,mediaUrl:n.target.value})})]})]})]}),(0,C.jsxs)(`section`,{className:`form-section`,children:[(0,C.jsx)(`h4`,{className:`section-title`,children:`💬 Conteúdo da Mensagem`}),(0,C.jsx)(w,{value:e.message,onChange:n=>t({...e,message:n})})]}),(0,C.jsxs)(`section`,{className:`form-section`,children:[(0,C.jsx)(`h4`,{className:`section-title`,children:`🔘 Botões Interativos`}),(0,C.jsx)(E,{buttons:e.buttons,onChange:n=>t({...e,buttons:n}),maxButtons:3,mode:`quick`})]}),(0,C.jsxs)(`section`,{className:`form-section`,children:[(0,C.jsx)(`h4`,{className:`section-title`,children:`📊 Público-Alvo`}),(0,C.jsxs)(`div`,{className:`form-group`,children:[(0,C.jsx)(`label`,{children:`Selecione o público`}),(0,C.jsxs)(`select`,{value:e.list,onChange:n=>t({...e,list:n.target.value}),children:[(0,C.jsx)(`option`,{value:`leads`,children:`👥 Leads Orgânicos (1.2k)`}),(0,C.jsx)(`option`,{value:`clients`,children:`⭐ Clientes Base (450)`}),(0,C.jsx)(`option`,{value:`custom`,children:`📤 Upload Manual (CSV)`})]})]}),e.list===`custom`&&(0,C.jsxs)(`div`,{className:`form-group`,children:[(0,C.jsx)(`label`,{children:`Upload de Contatos`}),(0,C.jsxs)(`div`,{className:`upload-area`,onClick:()=>i.current?.click(),children:[(0,C.jsx)(`p`,{children:`📤 Arraste ou clique para selecionar`}),(0,C.jsx)(`p`,{style:{fontSize:`0.75rem`,color:`var(--text-muted)`},children:`CSV com colunas: phone, name, email`}),(0,C.jsx)(`input`,{type:`file`,accept:`.csv`,ref:i,onChange:o,style:{display:`none`}})]}),s.length>0&&(0,C.jsxs)(`div`,{className:`upload-status`,children:[(0,C.jsxs)(`p`,{children:[`✅ `,s.length,` contatos carregados`]}),(0,C.jsx)(`button`,{className:`btn-small`,onClick:l,children:`Limpar`})]})]}),(0,C.jsxs)(`div`,{className:`form-group`,children:[(0,C.jsx)(`label`,{children:`Intervalo entre envios`}),(0,C.jsxs)(`div`,{className:`input-group`,children:[(0,C.jsx)(`input`,{type:`number`,value:e.interval,onChange:n=>t({...e,interval:parseInt(n.target.value)||15}),min:1,max:300}),(0,C.jsx)(`span`,{className:`unit`,children:`segundos`})]})]})]})]}),(0,C.jsx)(`div`,{className:`editor-right`,children:(0,C.jsxs)(`div`,{className:`preview-card`,children:[(0,C.jsx)(`h4`,{className:`preview-title`,children:`📱 Preview do Celular`}),(0,C.jsx)(T,{message:e.message,mediaUrl:e.mediaUrl,mediaType:e.mediaType,buttons:e.buttons,showTimestamp:!0})]})})]}),(0,C.jsxs)(`div`,{className:`editor-footer`,children:[(0,C.jsx)(`button`,{className:`btn btn-secondary`,onClick:r,children:`Cancelar`}),(0,C.jsxs)(`button`,{className:`btn btn-primary`,onClick:n,disabled:u,children:[(0,C.jsx)(a,{size:18}),` `,u?`Criando...`:`Criar Campanha`]})]}),(0,C.jsx)(`style`,{jsx:!0,children:`
          .campaign-editor-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .campaign-editor-modal {
            width: 100%;
            max-width: 1200px;
            max-height: 90vh;
            background: linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(10, 15, 25, 0.95) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .editor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .editor-header h2 {
            margin: 0;
            font-size: 1.3rem;
            color: white;
          }

          .editor-header p {
            margin: 6px 0 0 0;
            color: var(--text-muted);
            font-size: 0.9rem;
          }

          .close-btn {
            background: none;
            border: none;
            color: var(--text-dim);
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
          }

          .close-btn:hover {
            color: white;
          }

          .editor-body {
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 24px;
            padding: 24px;
            overflow-y: auto;
            flex: 1;
          }

          .editor-left {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .editor-right {
            position: sticky;
            top: 0;
            height: fit-content;
          }

          .form-section {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
          }

          .section-title {
            margin: 0 0 12px 0;
            font-size: 0.95rem;
            font-weight: 600;
            color: white;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 12px;
          }

          .form-group:last-child {
            margin-bottom: 0;
          }

          .form-group label {
            font-size: 0.8rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 500;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: white;
            font-size: 0.85rem;
            font-family: inherit;
            transition: all 0.2s;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: rgba(0, 242, 255, 0.5);
            background: rgba(0, 242, 255, 0.05);
            box-shadow: 0 0 12px rgba(0, 242, 255, 0.1);
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .input-group {
            position: relative;
            display: flex;
            align-items: center;
          }

          .input-group input {
            width: 100%;
            padding-right: 60px;
          }

          .unit {
            position: absolute;
            right: 12px;
            font-size: 0.8rem;
            color: var(--text-muted);
            pointer-events: none;
          }

          .upload-area {
            border: 2px dashed rgba(0, 242, 255, 0.3);
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
          }

          .upload-area:hover {
            border-color: rgba(0, 242, 255, 0.5);
            background: rgba(0, 242, 255, 0.05);
          }

          .upload-area p {
            margin: 0;
            color: white;
            font-weight: 500;
          }

          .upload-status {
            margin-top: 12px;
            padding: 12px;
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .upload-status p {
            margin: 0;
            color: #00ff88;
            font-size: 0.85rem;
            font-weight: 500;
          }

          .btn-small {
            padding: 6px 12px;
            background: rgba(0, 242, 255, 0.1);
            border: 1px solid rgba(0, 242, 255, 0.3);
            border-radius: 6px;
            color: var(--primary);
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.2s;
          }

          .btn-small:hover {
            background: rgba(0, 242, 255, 0.2);
            border-color: rgba(0, 242, 255, 0.5);
          }

          .preview-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
          }

          .preview-title {
            margin: 0 0 12px 0;
            font-size: 0.95rem;
            font-weight: 600;
            color: white;
          }

          .editor-footer {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            padding: 16px 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.02);
          }

          .btn {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }

          .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .btn-primary {
            background: rgba(0, 242, 255, 0.8);
            color: white;
          }

          .btn-primary:hover:not(:disabled) {
            background: rgba(0, 242, 255, 1);
            box-shadow: 0 0 20px rgba(0, 242, 255, 0.3);
          }

          .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
          }

          @media (max-width: 1024px) {
            .editor-body {
              grid-template-columns: 1fr;
            }

            .editor-right {
              position: relative;
            }
          }

          @media (max-width: 768px) {
            .campaign-editor-modal {
              max-height: 95vh;
            }

            .editor-body {
              gap: 16px;
              padding: 16px;
            }

            .form-row {
              grid-template-columns: 1fr;
            }
          }
        `})]})})}var O={name:``,message:``,list:`leads`,interval:15,mediaType:`text`,mediaUrl:``,enableSpinText:!0,buttonType:``,buttons:[{buttonId:``,buttonText:``}],sections:[{title:``,rows:[{title:``,description:``,rowId:``}]}]},k=e=>{let t=e.split(/\r?\n/).map(e=>e.trim()).filter(Boolean);if(t.length===0)return[];let n=t[0].split(`,`).map(e=>e.trim().toLowerCase()),r=n.some(e=>[`phone`,`telefone`,`name`,`nome`,`email`].includes(e)),i=r?n:[`phone`,`name`,`email`];return(r?t.slice(1):t).map(e=>{let t=e.split(`,`).map(e=>e.trim()),n=i.reduce((e,n,r)=>(e[n]=t[r]||``,e),{});return{phone:n.phone||n.telefone||t[0]||``,name:n.name||n.nome||t[1]||``,email:n.email||t[2]||``}}).filter(e=>e.phone)},A=()=>{let{tenantId:e}=l(),[t,n]=(0,S.useState)(!1),{data:o,loading:c,request:d}=m(p.getCampaigns),[f,h]=(0,S.useState)(O),[g,_]=(0,S.useState)([]),[v,y]=(0,S.useState)(``),[b,x]=(0,S.useState)(null),[w,T]=(0,S.useState)(null),E=(0,S.useRef)(null);return(0,S.useEffect)(()=>{e&&d(e)},[e,d]),(0,C.jsxs)(`div`,{className:`campaigns-page`,children:[(0,C.jsxs)(`header`,{className:`page-header`,children:[(0,C.jsxs)(`div`,{className:`header-info`,children:[(0,C.jsxs)(`h1`,{children:[`Minhas `,(0,C.jsx)(`span`,{children:`Campanhas`})]}),(0,C.jsx)(`p`,{children:`Gerencie seus disparos em massa e sequências automáticas.`})]}),(0,C.jsxs)(`button`,{className:`btn-primary`,onClick:()=>n(!0),children:[(0,C.jsx)(a,{size:20}),` Nova Campanha`]})]}),(0,C.jsx)(u,{children:t&&(0,C.jsx)(D,{campaign:f,onCampaignChange:h,onSave:async()=>{if(!f.name||!f.message){x({type:`error`,message:`Preencha o nome e a mensagem da campanha.`});return}let t={...f,list:f.list===`custom`&&g.length>0?`custom`:f.list,customNumbers:f.list===`custom`?g.map(e=>e.phone):[]};try{await p.createCampaign(e,t),x({type:`success`,message:`Campanha "${f.name}" criada com sucesso.`}),n(!1),d(e),h(O),_([]),E.current&&(E.current.value=``)}catch(e){x({type:`error`,message:i(e,`campaign`)})}},onCancel:()=>n(!1),fileInputRef:E,onFileUpload:async e=>{let t=e.target.files?.[0];if(t)try{let e=k(await t.text());_(e),e.length===0?x({type:`warning`,message:`Nenhum contato válido encontrado. Use colunas: phone, name, email.`}):x({type:`success`,message:`${e.length} contatos carregados com sucesso.`})}catch{x({type:`error`,message:`Não conseguimos ler o CSV. Tente novamente.`})}},csvContacts:g,onClearCsv:()=>{_([]),E.current&&(E.current.value=``)},loading:v.startsWith(`create`)})}),(0,C.jsx)(s,{open:w!==null,title:`Deletar campanha?`,message:`Esta ação não pode ser desfeita. A campanha, seu histórico e todas as métricas serão removidos permanentemente.`,confirmLabel:`Deletar`,cancelLabel:`Cancelar`,isDangerous:!0,onConfirm:async()=>{if(w){y(`delete:${w}`);try{await p.deleteCampaign(e,w),x({type:`success`,message:`Campanha deletada com sucesso.`}),d(e)}catch(e){x({type:`error`,message:i(e,`campaign`)})}finally{y(``),T(null)}}},onCancel:()=>T(null)}),b&&(0,C.jsx)(r,{type:b.type,message:b.message,onClose:()=>x(null)})]})};export{A as default};