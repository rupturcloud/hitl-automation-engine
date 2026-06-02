import{n as e,s as t,t as n}from"./jsx-runtime-2UHhqg_S.js";import{t as r}from"./activity-BpoBqj5R.js";import{B as i,F as a,I as o,j as s,x as c,z as l}from"./index-BPxAC5Go.js";var u=s(`layout-dashboard`,[[`rect`,{width:`7`,height:`9`,x:`3`,y:`3`,rx:`1`,key:`10lvy0`}],[`rect`,{width:`7`,height:`5`,x:`14`,y:`3`,rx:`1`,key:`16une8`}],[`rect`,{width:`7`,height:`9`,x:`14`,y:`12`,rx:`1`,key:`1hutg5`}],[`rect`,{width:`7`,height:`5`,x:`3`,y:`16`,rx:`1`,key:`ldoo1y`}]]),d=s(`user-round`,[[`circle`,{cx:`12`,cy:`8`,r:`5`,key:`1hypcn`}],[`path`,{d:`M20 21a8 8 0 0 0-16 0`,key:`rfgkzh`}]]),f=t(e(),1),p=n(),m={client:{key:`client`,label:`Cliente`,shortLabel:`Cliente`,to:`/dashboard`,icon:d,color:`#00f2ff`,bg:`rgba(0,242,255,0.08)`,border:`rgba(0,242,255,0.22)`},admin:{key:`admin`,label:`Admin`,shortLabel:`Admin`,to:`/admin`,icon:r,color:`#8fa2ff`,bg:`rgba(102,126,234,0.12)`,border:`rgba(102,126,234,0.32)`},superadmin:{key:`superadmin`,label:`Superadmin`,shortLabel:`Superadmin`,to:`/admin/superadmin`,icon:c,color:`#c084fc`,bg:`rgba(192,132,252,0.12)`,border:`rgba(192,132,252,0.32)`}};function h(e){return e.startsWith(`/admin/superadmin`)?`superadmin`:e.startsWith(`/admin`)?`admin`:`client`}function g({variant:e=`dark`,showLabel:t=!0,className:n=``}){let{tenant:r,tenantId:s,isPlatformAdmin:c,isAuthenticated:d}=i(),g=a(),_=o(),v=h(g.pathname),y=m[v]||m.client,[b,x]=(0,f.useState)(null),S=(0,f.useMemo)(()=>[d&&(s||r?.id)?{...m.client,source:`auth-context`}:null,c?{...m.admin,source:`auth-context`}:null,c?{...m.superadmin,source:`auth-context`}:null].filter(Boolean),[d,c,r?.id,s]);(0,f.useEffect)(()=>{let e=!1;if(d)return l.getMyEnvironments().then(t=>{e||x(t)}).catch(()=>{e||x(null)}),()=>{e=!0}},[d]);let C=(0,f.useMemo)(()=>{let e=(b?.environments||[]).filter(e=>e?.available!==!1).map(e=>({...m[e.key]||{key:e.key,label:e.label||e.key,shortLabel:e.shortLabel||e.label||e.key,to:e.to||`/`,icon:u,color:`#94a3b8`,bg:`rgba(148,163,184,0.10)`,border:`rgba(148,163,184,0.25)`},...e})),t=e.length?e:S,n=new Map;for(let e of t)!e?.key||n.has(e.key)||n.set(e.key,e);return[...n.values()]},[b,S]);if(!d||C.length===0)return null;let w=e===`light`?`rgba(255,255,255,0.05)`:`rgba(0,0,0,0.18)`;return(0,p.jsxs)(`div`,{className:`env-switcher ${n}`,style:{"--env-surface":w},children:[t&&(0,p.jsxs)(`div`,{className:`env-active`,title:`Ambiente ativo: ${y.label}`,children:[(0,p.jsx)(u,{size:13}),(0,p.jsx)(`span`,{children:`Ambiente ativo`}),(0,p.jsx)(`strong`,{style:{color:y.color},children:y.label})]}),(0,p.jsx)(`div`,{className:`env-shortcuts`,"aria-label":`Atalhos de ambientes disponíveis`,children:C.filter(e=>e.key!==v).map(e=>{let t=e.icon;return(0,p.jsxs)(`button`,{type:`button`,className:`env-shortcut`,onClick:()=>_(e.to),title:`${e.reason||`Ir para ${e.label}`}${e.plan?` • Plano ${e.plan}`:``}`,style:{"--env-color":e.color,"--env-bg":e.bg,"--env-border":e.border},children:[(0,p.jsx)(t,{size:13}),(0,p.jsx)(`span`,{children:e.shortLabel})]},e.key)})}),(0,p.jsx)(`style`,{children:`
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
      `})]})}export{u as n,g as t};