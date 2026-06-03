import { useState, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Icon } from '../../ds/index.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useIdleTimer } from '../../hooks/useIdleTimer.js';
import IdleWarningModal from '../../components/IdleWarningModal.jsx';
import ForcePasswordChange from '../../components/ForcePasswordChange.jsx';

const NAV = [
  { section: 'Operação', items: [
    { id: 'dashboard',   label: 'Cockpit',       icon: 'dashboard' },
    { id: 'inbox',       label: 'Inbox',         icon: 'wa', badge: 7, badgeTone: 'wa' },
    { id: 'pipeline',    label: 'CRM',           icon: 'pipeline' },
    { id: 'grupos',      label: 'Grupos',        icon: 'leads' },
    { id: 'outreach',    label: 'Outreach X1',   icon: 'broadcast' },
    { id: 'campaigns',   label: 'Campanhas',     icon: 'flag' },
    { id: 'remarketing', label: 'Remarketing',   icon: 'sparkles' },
    { id: 'canais',      label: 'Canais',        icon: 'wa' },
    { id: 'numbers',     label: 'Números',       icon: 'fire' },
    { id: 'aquecimento', label: 'Aquecimento',   icon: 'fire' },
    { id: 'rede-coletiva', label: 'Rede Coletiva', icon: 'grid', badge: 'NOVO', badgeTone: 'brand' },
  ]},
  { section: 'Receita', items: [
    { id: 'business',   label: 'Business',   icon: 'note' },
    { id: 'billing',    label: 'Receita',    icon: 'billing' },
    { id: 'growth',     label: 'Growth OS',  icon: 'trendUp' },
    { id: 'indicacoes', label: 'Indicações', icon: 'star' },
    { id: 'insights',   label: 'Insights',   icon: 'sparkles' },
  ]},
  { section: 'Sistema', items: [
    { id: 'integrations', label: 'Integrações',   icon: 'zap' },
    { id: 'webhooks',     label: 'Webhooks',      icon: 'zap' },
    { id: 'admin',        label: 'Configurações', icon: 'settings' },
  ]},
];

function Sidebar({ collapsed, onToggle, onSignOut }) {
  const navigate = useNavigate();
  const { session, tenant, isPlatformAdmin } = useAuth();

  const userName =
    session?.user?.user_metadata?.full_name ||
    session?.user?.email?.split('@')[0] ||
    'Usuário';

  const userInitials = userName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const planLabel = tenant?.plan || tenant?.name || 'Free';

  return (
    <aside
      style={{
        position: 'relative',
        flexShrink: 0,
        width: collapsed ? 56 : 240,
        transition: 'width 0.2s ease',
        background: '#0E1116',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Botão toggle collapse */}
      <button
        onClick={onToggle}
        title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        style={{
          position: 'absolute',
          right: -12,
          top: 20,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: '#1F2937',
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9CA3AF',
          zIndex: 10,
          fontSize: 14,
          lineHeight: 1,
        }}
      >
        {collapsed ? '›' : '‹'}
      </button>

      {/* Logo / Brand */}
      <div
        style={{
          padding: collapsed ? '16px 0' : '16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: '#FF6A3D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 800,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          R
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB', whiteSpace: 'nowrap' }}>
              Ruptur OS
            </div>
            <div style={{ fontSize: 10, color: '#6B7280', whiteSpace: 'nowrap' }}>
              Revenue OS · AI
            </div>
          </div>
        )}
      </div>

      {/* Área de navegação — scroll independente */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: 8,
        }}
      >
        {NAV.map(g => (
          <div key={g.section} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#4B5563',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '10px 14px 4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {g.section}
              </div>
            )}
            {collapsed && <div style={{ height: 8 }} />}
            <nav>
              {g.items.map(it => (
                <NavLink
                  key={it.id}
                  to={`/v0/${it.id}`}
                  title={collapsed ? it.label : undefined}
                  className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? 0 : 9,
                    padding: collapsed ? '9px 0' : '7px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    margin: '0 4px',
                    borderRadius: 7,
                    textDecoration: 'none',
                    color: '#9CA3AF',
                    fontSize: 13,
                    fontWeight: 500,
                    transition: 'background 0.12s, color 0.12s',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  <Icon name={it.icon} size={15} />
                  {!collapsed && <span style={{ flex: 1 }}>{it.label}</span>}
                  {!collapsed && it.badge != null && (
                    <span className={`badge badge-${it.badgeTone || 'brand'}`}>{it.badge}</span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}

        {/* Seção Plataforma — só para super admins (platform_admin) */}
        {isPlatformAdmin && (
          <div style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div style={{
                fontSize: 10, fontWeight: 600, color: '#FF8C69',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                padding: '10px 14px 4px', whiteSpace: 'nowrap',
              }}>
                Plataforma
              </div>
            )}
            {collapsed && <div style={{ height: 8 }} />}
            <nav>
              {[
                { to: '/admin', label: 'Painel Admin', icon: 'settings' },
                { to: '/admin/superadmin', label: 'Super Admin', icon: 'shield' },
              ].map(it => (
                <a
                  key={it.to}
                  href={it.to}
                  title={collapsed ? it.label : undefined}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: collapsed ? 0 : 9,
                    padding: collapsed ? '9px 0' : '7px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    margin: '0 4px', borderRadius: 7, textDecoration: 'none',
                    color: '#9CA3AF', fontSize: 13, fontWeight: 500,
                    whiteSpace: 'nowrap', overflow: 'hidden',
                  }}
                >
                  <Icon name={it.icon} size={15} />
                  {!collapsed && <span style={{ flex: 1 }}>{it.label}</span>}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Rodapé fixo com perfil do usuário — NUNCA some da viewport */}
      <div
        style={{
          flexShrink: 0,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: '#0E1116',
        }}
      >
        {collapsed ? (
          /* Collapsed: avatar + ícone logout empilhados */
          <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#FF6A3D',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
                cursor: 'pointer', flexShrink: 0,
              }}
              title={userName}
              onClick={() => navigate('/v0/admin')}
            >
              {userInitials}
            </div>
            <button
              onClick={onSignOut}
              title="Sair da conta"
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: '1px solid rgba(255,106,61,0.3)',
                background: 'rgba(255,106,61,0.06)',
                color: '#FF8C69', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        ) : (
          /* Expanded: avatar + nome + plano + botão sair */
          <div style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <UserProfileRow
              userInitials={userInitials}
              userName={userName}
              planLabel={planLabel}
              onClick={() => navigate('/v0/admin')}
            />
            <button
              onClick={onSignOut}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 10px', borderRadius: 8,
                border: '1px solid rgba(255,106,61,0.25)',
                background: 'rgba(255,106,61,0.06)',
                color: '#FF8C69', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,106,61,0.14)'; e.currentTarget.style.borderColor = 'rgba(255,106,61,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,106,61,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,106,61,0.25)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sair da conta
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function UserProfileRow({ userInitials, userName, planLabel, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: 8,
        padding: '8px 10px',
        cursor: 'pointer',
        background: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#FF6A3D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {userInitials}
      </div>

      {/* Nome + plano */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#F9FAFB',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {userName}
        </div>
        <div
          style={{
            fontSize: 11,
            color: '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22C55E',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          {planLabel}
        </div>
      </div>

      {/* Ícone de configurações */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6B7280"
        strokeWidth="2"
        style={{ flexShrink: 0 }}
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </div>
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
        <button className="btn btn-ghost btn-icon" aria-label="Notificações">
          <Icon name="bell" size={15} />
        </button>
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
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/v0/leads?new=1')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Icon name="plus" size={13} />
          Novo lead
        </button>
      </div>
    </div>
  );
}

export default function AppShell() {
  const { signOut, isAuthenticated, session } = useAuth();
  const navigate = useNavigate();

  // Detecta senha temporária: flag definida na criação via Admin API
  const mustChangePassword = session?.user?.user_metadata?.must_change_password === true;
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  const [idleWarning, setIdleWarning] = useState(null);

  // signOut + redirect explícito (rota /v0 não tem ProtectedRoute)
  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate('/login', { replace: true });
  }, [signOut, navigate]);

  const handleIdle    = useCallback(() => { setIdleWarning(null); handleSignOut(); }, [handleSignOut]);
  const handleWarning = useCallback((s) => setIdleWarning(s), []);
  const handleStay    = useCallback(() => setIdleWarning(null), []);

  useIdleTimer({
    enabled: isAuthenticated,
    onIdle: handleIdle,
    onWarning: handleWarning,
    onActive: () => setIdleWarning(null),
  });

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar-collapsed', String(next));
  }

  return (
    <>
      {/* Troca de senha obrigatória no primeiro acesso */}
      {mustChangePassword && (
        <ForcePasswordChange onDone={() => {/* session será atualizada pelo Supabase listener */}} />
      )}

      {idleWarning !== null && (
        <IdleWarningModal
          secondsLeft={idleWarning}
          onStay={handleStay}
          onLeave={handleSignOut}
        />
      )}
      <div
        style={{
          display: 'flex',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} onSignOut={handleSignOut} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          <Topbar />
          <div
            className="page"
            style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
