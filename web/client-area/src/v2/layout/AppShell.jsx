import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Icon, Button, Avatar } from '../../ds/index.js';

const NAV = [
  { section: 'Operação', items: [
    { id: 'dashboard', label: 'Cockpit',    icon: 'dashboard' },
    { id: 'inbox',     label: 'Inbox',      icon: 'wa', badge: 7, badgeTone: 'wa' },
    { id: 'pipeline',  label: 'CRM',        icon: 'pipeline' },
    { id: 'leads',     label: 'Leads',      icon: 'leads' },
    { id: 'campaigns', label: 'Campanhas',  icon: 'broadcast' },
    { id: 'flows',     label: 'Fluxos',     icon: 'flow' },
    { id: 'numbers',   label: 'Números',    icon: 'fire' },
    { id: 'playbooks', label: 'Playbooks',  icon: 'playbook' },
  ]},
  { section: 'Receita', items: [
    { id: 'billing',    label: 'Receita',    icon: 'billing' },
    { id: 'indicacoes', label: 'Indicações', icon: 'star' },
    { id: 'insights',   label: 'Insights',   icon: 'sparkles' },
  ]},
  { section: 'Admin', items: [
    { id: 'sprints', label: 'Sprints',       icon: 'target' },
    { id: 'admin',   label: 'Configurações', icon: 'settings' },
  ]},
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="side-brand">
        <div className="side-logo">R</div>
        <div>
          <div className="side-brand-name">Ruptur OS</div>
          <div className="side-brand-sub">Revenue OS · AI</div>
        </div>
      </div>
      <div className="side-workspace">
        <div className="side-ws-avatar">CR</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="side-ws-name">Cervejaria Riacho</div>
          <div className="side-ws-plan">Plano Growth · 14 vendedores</div>
        </div>
        <Icon name="chevDown" size={14} />
      </div>
      {NAV.map(g => (
        <div key={g.section} className="side-section">
          <div className="side-section-label">{g.section}</div>
          <nav className="side-nav">
            {g.items.map(it => (
              <NavLink
                key={it.id}
                to={`/v0/${it.id}`}
                className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
              >
                <Icon name={it.icon} size={15} />
                <span>{it.label}</span>
                {it.badge != null && (
                  <span className={`badge badge-${it.badgeTone || 'brand'}`}>{it.badge}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      ))}
      <div className="side-spacer" />
      <div className="side-user">
        <Avatar name="Mariana Souza" presence="online" idx={1} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="side-user-name">Mariana Souza</div>
          <div className="side-user-role">Admin · SDR Lead</div>
        </div>
        <NavLink
          to="/v0/landing"
          className="btn btn-ghost btn-icon"
          style={{ color: 'var(--side-mute)' }}
          title="Sair"
        >
          <Icon name="logout" size={14} />
        </NavLink>
      </div>
    </aside>
  );
}

function Topbar() {
  const navigate = useNavigate();
  return (
    <div className="topbar">
      <div className="input-search" style={{ flex: 1, maxWidth: 380 }}>
        <Icon name="search" size={14} />
        <input className="input" placeholder="Buscar leads, contas, conversas…" />
      </div>
      <div className="topbar-actions">
        <Button variant="ghost" icon="bell" size="sm" />
        <button
          onClick={() => navigate('/v0/founder')}
          title="Founder Mode"
          style={{
            width: 32, height: 32, borderRadius: 8, border: '1px solid var(--ink-200)',
            background: 'var(--ink-0)', color: 'var(--ink-700)', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 12, letterSpacing: '-.02em',
          }}
        >
          F
        </button>
        <Button variant="primary" size="sm" icon="plus" onClick={() => navigate('/v0/leads?new=1')}>
          Novo lead
        </Button>
      </div>
    </div>
  );
}

export default function AppShell() {
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

