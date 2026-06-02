import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{t as r}from"./flame-9mPRREct.js";import{n as i,t as a}from"./wallet-Be_F3VBq.js";import{t as o}from"./sparkles-B5GycDc-.js";import{B as s,I as c,_ as l,h as u,k as d,y as f,z as p}from"./index-BPxAC5Go.js";import{t as m}from"./useApi-CIhQ2Jk5.js";var h=t(e(),1),g=n(),_=()=>{let{tenantId:e}=s(),t=c(),{data:n,loading:_,request:v}=m(p.getDashboardStats);(0,h.useEffect)(()=>{e&&v(e)},[e,v]);let y=[{label:`Saldo Wallet`,value:n?.walletBalance||0,unit:`créditos`,icon:(0,g.jsx)(a,{size:24}),color:`#00f2ff`,suffix:` credits`},{label:`Envios Hoje`,value:n?.sendsToday||0,unit:`mensagens`,icon:(0,g.jsx)(i,{size:24}),color:`#7000ff`},{label:`Instâncias`,value:`${n?.connectedInstances||0}/${n?.totalInstances||0}`,unit:`online`,icon:(0,g.jsx)(l,{size:24}),color:`#00ff88`},{label:`Aquecimento`,value:n?.heatingNow||n?.warmupHeatingNow||0,unit:`em ciclo`,icon:(0,g.jsx)(r,{size:24}),color:`#ff7a00`}];return(0,g.jsxs)(`div`,{className:`dashboard-home`,children:[(0,g.jsx)(`header`,{className:`page-header`,children:(0,g.jsxs)(u.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},children:[(0,g.jsxs)(`h1`,{children:[`Bem-vindo ao `,(0,g.jsx)(`span`,{children:`Ruptur Cloud`})]}),(0,g.jsx)(`p`,{children:`Acompanhe o desempenho das suas automações em tempo real.`})]})}),(0,g.jsxs)(`section`,{className:`quick-start-checklist glass`,children:[(0,g.jsxs)(`div`,{className:`checklist-header`,children:[(0,g.jsxs)(`h3`,{children:[(0,g.jsx)(o,{size:18,color:`#00f2ff`}),` Complete sua configuração`]}),(0,g.jsx)(`span`,{className:`badge-outline`,children:`2/4 concluídos`})]}),(0,g.jsxs)(`div`,{className:`checklist-grid`,children:[(0,g.jsxs)(`div`,{className:`check-item done`,children:[(0,g.jsx)(`div`,{className:`check-circle`,children:(0,g.jsx)(d,{size:14})}),(0,g.jsxs)(`div`,{className:`check-text`,children:[(0,g.jsx)(`strong`,{children:`Criar Conta`}),(0,g.jsx)(`span`,{children:`Sua conta está ativa e pronta.`})]})]}),(0,g.jsxs)(`div`,{className:`check-item done`,children:[(0,g.jsx)(`div`,{className:`check-circle`,children:(0,g.jsx)(d,{size:14})}),(0,g.jsxs)(`div`,{className:`check-text`,children:[(0,g.jsx)(`strong`,{children:`Escolher Plano`}),(0,g.jsx)(`span`,{children:`Você está no plano Trial (50 créditos).`})]})]}),(0,g.jsxs)(`div`,{className:`check-item pending`,children:[(0,g.jsx)(`div`,{className:`check-circle`,children:`3`}),(0,g.jsxs)(`div`,{className:`check-text`,children:[(0,g.jsx)(`strong`,{children:`Conectar WhatsApp`}),(0,g.jsx)(`span`,{children:`Vincule uma instância para começar os envios.`})]}),(0,g.jsx)(`button`,{className:`check-action`,onClick:()=>t(`/instancias`),children:`Conectar`})]}),(0,g.jsxs)(`div`,{className:`check-item pending`,children:[(0,g.jsx)(`div`,{className:`check-circle`,children:`4`}),(0,g.jsxs)(`div`,{className:`check-text`,children:[(0,g.jsx)(`strong`,{children:`Ativar Aquecimento`}),(0,g.jsx)(`span`,{children:`Aqueça a conta antes dos primeiros disparos.`})]}),(0,g.jsx)(`button`,{className:`check-action`,onClick:()=>t(`/aquecimento`),children:`Aquecer`})]})]})]}),(0,g.jsx)(`div`,{className:`stats-grid`,children:y.map((e,t)=>(0,g.jsxs)(u.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},transition:{delay:t*.1},className:`stat-card glass neon-border`,children:[(0,g.jsx)(`div`,{className:`stat-icon`,style:{background:`${e.color}15`,color:e.color},children:e.icon}),(0,g.jsxs)(`div`,{className:`stat-info`,children:[(0,g.jsx)(`span`,{className:`stat-label`,children:e.label}),(0,g.jsxs)(`div`,{className:`stat-value-group`,children:[(0,g.jsx)(`span`,{className:`stat-value`,children:_?`...`:e.value}),(0,g.jsx)(`span`,{className:`stat-unit`,children:e.unit})]})]})]},t))}),(0,g.jsxs)(`div`,{className:`dashboard-content`,children:[(0,g.jsxs)(`section`,{className:`recent-activity glass`,children:[(0,g.jsx)(`div`,{className:`section-header`,children:(0,g.jsxs)(`h3`,{children:[(0,g.jsx)(f,{size:20,className:`neon-text-purple`}),` Atividade do Sistema`]})}),(0,g.jsxs)(`div`,{className:`activity-list`,children:[(0,g.jsxs)(`div`,{className:`activity-item border-bottom`,children:[(0,g.jsx)(`div`,{className:`dot pulse green`}),(0,g.jsxs)(`div`,{className:`details`,children:[(0,g.jsx)(`span`,{className:`title`,children:`Conexão Estabelecida`}),(0,g.jsx)(`span`,{className:`time`,children:`Há 5 minutos • Instância Suporte 01`})]})]}),(0,g.jsxs)(`div`,{className:`activity-item border-bottom`,children:[(0,g.jsx)(`div`,{className:`dot pulse purple`}),(0,g.jsxs)(`div`,{className:`details`,children:[(0,g.jsx)(`span`,{className:`title`,children:`Disparo Concluído`}),(0,g.jsx)(`span`,{className:`time`,children:`Há 12 minutos • Campanha: Lançamento Verão`})]})]}),(0,g.jsxs)(`div`,{className:`activity-item`,children:[(0,g.jsx)(`div`,{className:`dot orange`}),(0,g.jsxs)(`div`,{className:`details`,children:[(0,g.jsx)(`span`,{className:`title`,children:`Créditos Adicionados`}),(0,g.jsx)(`span`,{className:`time`,children:`Há 2 horas • +R$ 500,00`})]})]})]})]}),(0,g.jsxs)(`section`,{className:`quick-actions glass`,children:[(0,g.jsx)(`h3`,{children:`Ações Rápidas`}),(0,g.jsxs)(`div`,{className:`actions-buttons`,children:[(0,g.jsx)(`button`,{className:`neon-btn purple`,onClick:()=>t(`/campanhas`),children:`Novo Disparo`}),(0,g.jsx)(`button`,{className:`neon-btn cyan`,onClick:()=>t(`/instancias`),children:`Conectar WhatsApp`}),(0,g.jsx)(`button`,{className:`neon-btn orange`,onClick:()=>t(`/aquecimento`),children:`Aquecimento`}),(0,g.jsx)(`button`,{className:`neon-btn outline`,children:`Gerar Relatório`})]})]})]}),(0,g.jsx)(`style`,{jsx:`true`,children:`
        .dashboard-home { display: flex; flex-direction: column; gap: 30px; }
        
        .quick-start-checklist { padding: 30px; border-radius: 24px; background: rgba(0,242,255,0.02); border: 1px solid rgba(0,242,255,0.1); }
        .checklist-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .checklist-header h3 { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; }
        .badge-outline { padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; color: var(--text-muted); }
        
        .checklist-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
        .check-item { display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); position: relative; }
        .check-item.done { opacity: 0.7; }
        .check-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem; font-weight: 700; color: var(--text-muted); }
        .check-item.done .check-circle { background: #00ff88; border-color: #00ff88; color: #000; }
        .check-item.pending .check-circle { border-color: #00f2ff; color: #00f2ff; box-shadow: 0 0 10px rgba(0,242,255,0.2); }
        
        .check-text { display: flex; flex-direction: column; gap: 2px; flex-grow: 1; }
        .check-text strong { font-size: 0.95rem; }
        .check-text span { font-size: 0.75rem; color: var(--text-muted); }
        
        .check-action { padding: 6px 14px; border-radius: 8px; background: #00f2ff; border: none; color: #000; font-weight: 700; font-size: 0.75rem; cursor: pointer; transition: 0.2s; }
        .check-action:hover { transform: scale(1.05); }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
        
        .stat-card { padding: 24px; border-radius: 20px; display: flex; align-items: center; gap: 20px; transition: 0.3s; }
        .stat-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.05); }
        .stat-icon { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .stat-info { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .stat-value { font-size: 2rem; font-weight: 800; font-family: 'Outfit', sans-serif; }
        .stat-unit { font-size: 0.85rem; color: var(--text-muted); margin-left: 8px; }

        .dashboard-content { display: grid; grid-template-columns: 2fr 1fr; gap: 25px; }
        .recent-activity, .quick-actions { padding: 30px; border-radius: 24px; }
        
        .section-header { margin-bottom: 25px; }
        .activity-list { display: flex; flex-direction: column; }
        .activity-item { padding: 15px 0; display: flex; align-items: flex-start; gap: 15px; }
        .border-bottom { border-bottom: 1px solid rgba(255,255,255,0.05); }

        .dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; }
        .dot.green { background: #00ff88; box-shadow: 0 0 10px #00ff88; }
        .dot.purple { background: #7000ff; box-shadow: 0 0 10px #7000ff; }
        .dot.orange { background: #ffaa00; }
        
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        .activity-item .title { display: block; font-weight: 600; font-size: 0.95rem; }
        .activity-item .time { font-size: 0.8rem; color: var(--text-muted); }

        .actions-buttons { display: flex; flex-direction: column; gap: 12px; margin-top: 20px; }
      `})]})};export{_ as default};