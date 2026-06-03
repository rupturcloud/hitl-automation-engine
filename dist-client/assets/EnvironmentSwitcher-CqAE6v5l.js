import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{A as r,F as i,N as a,j as o,n as s,s as c}from"./index-Bq7qbGXE.js";var l=c(`activity`,[[`path`,{d:`M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2`,key:`169zse`}]]),u=c(`layout-dashboard`,[[`rect`,{width:`7`,height:`9`,x:`3`,y:`3`,rx:`1`,key:`10lvy0`}],[`rect`,{width:`7`,height:`5`,x:`14`,y:`3`,rx:`1`,key:`16une8`}],[`rect`,{width:`7`,height:`9`,x:`14`,y:`12`,rx:`1`,key:`1hutg5`}],[`rect`,{width:`7`,height:`5`,x:`3`,y:`16`,rx:`1`,key:`ldoo1y`}]]),d=c(`plus`,[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`M12 5v14`,key:`s699le`}]]),f=c(`trash-2`,[[`path`,{d:`M10 11v6`,key:`nco0om`}],[`path`,{d:`M14 11v6`,key:`outv1u`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`,key:`miytrc`}],[`path`,{d:`M3 6h18`,key:`d0wm0j`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`,key:`e791ji`}]]),p=c(`user-round`,[[`circle`,{cx:`12`,cy:`8`,r:`5`,key:`1hypcn`}],[`path`,{d:`M20 21a8 8 0 0 0-16 0`,key:`rfgkzh`}]]),m=c(`x`,[[`path`,{d:`M18 6 6 18`,key:`1bl5f8`}],[`path`,{d:`m6 6 12 12`,key:`d8bk6v`}]]),h=t(e(),1),g=n(),_={client:{key:`client`,label:`Cliente`,shortLabel:`Cliente`,to:`/dashboard`,icon:p,color:`#00f2ff`,bg:`rgba(0,242,255,0.08)`,border:`rgba(0,242,255,0.22)`},admin:{key:`admin`,label:`Admin`,shortLabel:`Admin`,to:`/admin`,icon:l,color:`#8fa2ff`,bg:`rgba(102,126,234,0.12)`,border:`rgba(102,126,234,0.32)`},superadmin:{key:`superadmin`,label:`Superadmin`,shortLabel:`Superadmin`,to:`/admin/superadmin`,icon:s,color:`#c084fc`,bg:`rgba(192,132,252,0.12)`,border:`rgba(192,132,252,0.32)`}};function v(e){return e.startsWith(`/admin/superadmin`)?`superadmin`:e.startsWith(`/admin`)?`admin`:`client`}function y({variant:e=`dark`,showLabel:t=!0,className:n=``}){let{tenant:s,tenantId:c,isPlatformAdmin:l,isAuthenticated:d}=i(),f=r(),p=o(),m=v(f.pathname),y=_[m]||_.client,[b,x]=(0,h.useState)(null),S=(0,h.useMemo)(()=>[d&&(c||s?.id)?{..._.client,source:`auth-context`}:null,l?{..._.admin,source:`auth-context`}:null,l?{..._.superadmin,source:`auth-context`}:null].filter(Boolean),[d,l,s?.id,c]);(0,h.useEffect)(()=>{let e=!1;if(d)return a.getMyEnvironments().then(t=>{e||x(t)}).catch(()=>{e||x(null)}),()=>{e=!0}},[d]);let C=(0,h.useMemo)(()=>{let e=(b?.environments||[]).filter(e=>e?.available!==!1).map(e=>({..._[e.key]||{key:e.key,label:e.label||e.key,shortLabel:e.shortLabel||e.label||e.key,to:e.to||`/`,icon:u,color:`#94a3b8`,bg:`rgba(148,163,184,0.10)`,border:`rgba(148,163,184,0.25)`},...e})),t=e.length?e:S,n=new Map;for(let e of t)!e?.key||n.has(e.key)||n.set(e.key,e);return[...n.values()]},[b,S]);if(!d||C.length===0)return null;let w=e===`light`?`rgba(255,255,255,0.05)`:`rgba(0,0,0,0.18)`;return(0,g.jsxs)(`div`,{className:`env-switcher ${n}`,style:{"--env-surface":w},children:[t&&(0,g.jsxs)(`div`,{className:`env-active`,title:`Ambiente ativo: ${y.label}`,children:[(0,g.jsx)(u,{size:13}),(0,g.jsx)(`span`,{children:`Ambiente ativo`}),(0,g.jsx)(`strong`,{style:{color:y.color},children:y.label})]}),(0,g.jsx)(`div`,{className:`env-shortcuts`,"aria-label":`Atalhos de ambientes disponíveis`,children:C.filter(e=>e.key!==m).map(e=>{let t=e.icon;return(0,g.jsxs)(`button`,{type:`button`,className:`env-shortcut`,onClick:()=>p(e.to),title:`${e.reason||`Ir para ${e.label}`}${e.plan?` • Plano ${e.plan}`:``}`,style:{"--env-color":e.color,"--env-bg":e.bg,"--env-border":e.border},children:[(0,g.jsx)(t,{size:13}),(0,g.jsx)(`span`,{children:e.shortLabel})]},e.key)})}),(0,g.jsx)(`style`,{children:`
        .env-switcher {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .env-active {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 999px;
          background: var(--env-surface);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-muted, #94a3b8);
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }
        .env-active strong {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        .env-shortcuts {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px;
          border-radius: 999px;
          background: var(--env-surface);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .env-shortcut {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-muted, #94a3b8);
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
          transition: .15s ease;
          white-space: nowrap;
        }
        .env-shortcut:hover:not(:disabled) {
          color: var(--env-color);
          background: var(--env-bg);
          border-color: var(--env-border);
        }
        .env-shortcut.active,
        .env-shortcut:disabled {
          color: var(--env-color);
          background: var(--env-bg);
          border-color: var(--env-border);
          cursor: default;
          opacity: 1;
        }
        @media (max-width: 720px) {
          .env-active span { display: none; }
          .env-shortcut span { display: none; }
          .env-shortcut { padding: 7px; }
        }
      `})]})}export{l as a,d as i,m as n,f as r,y as t};