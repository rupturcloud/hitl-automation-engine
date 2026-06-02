/**
 * UsersPage — Gestão de Usuários & Times
 * Rota: /admin/usuarios
 * Visual: Ruptur OS design system (fundo #0E1116, laranja #FF6A3D)
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUsersTenant } from '../hooks/useUsersTenant';

const BRAND = '#FF6A3D';
const BG = '#0E1116';
const CARD = '#161B22';
const BORDER = 'rgba(255,255,255,.08)';

const ROLE_LABELS = { owner: 'Owner', admin: 'Admin', member: 'Membro', inactive: 'Inativo' };
const ROLE_COLORS = {
  owner:    { bg: 'rgba(255,106,61,.18)', color: '#FF6A3D' },
  admin:    { bg: 'rgba(99,102,241,.18)', color: '#818CF8' },
  member:   { bg: 'rgba(255,255,255,.08)', color: '#9AA2AE' },
  inactive: { bg: 'rgba(255,255,255,.04)', color: '#4B5563' },
};

function Avatar({ name, email }) {
  const initials = (name || email || '?').charAt(0).toUpperCase();
  return (
    <div style={{
      width: 38, height: 38, borderRadius: '50%',
      background: 'linear-gradient(135deg,#FF6A3D,#F0531F)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] || ROLE_COLORS.member;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 999,
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
      border: `1px solid ${c.color}30`,
    }}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}

function MemberRow({ member, onChangeRole, onConfirmEmail, onResetPassword, isSelf }) {
  const [roleOpen, setRoleOpen] = useState(false);
  const [loading, setLoading] = useState(null); // 'role' | 'confirm' | 'reset'
  const [msg, setMsg] = useState(null);

  const handle = async (action, fn) => {
    setLoading(action);
    setMsg(null);
    const r = await fn();
    setLoading(null);
    setMsg(r.success ? { ok: true, text: 'Salvo!' } : { ok: false, text: r.error });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 20px',
      borderBottom: `1px solid ${BORDER}`,
      background: 'transparent',
      transition: 'background .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <Avatar name={member.full_name} email={member.email} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>
            {member.full_name || member.email?.split('@')[0] || 'Sem nome'}
          </span>
          {isSelf && (
            <span style={{ fontSize: 10, color: BRAND, fontWeight: 700, letterSpacing: '0.06em' }}>VOCÊ</span>
          )}
          {!member.email_confirmed && (
            <span style={{
              fontSize: 10, background: 'rgba(251,191,36,.12)', color: '#FCD34D',
              padding: '2px 7px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.04em',
            }}>
              E-MAIL NÃO CONFIRMADO
            </span>
          )}
        </div>
        <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>{member.email}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
        {/* Role dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setRoleOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,.05)', border: `1px solid ${BORDER}`,
              borderRadius: 8, padding: '5px 12px', cursor: 'pointer', color: '#C9CFD8',
              fontSize: 13,
            }}
          >
            <RoleBadge role={member.role} />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {roleOpen && (
            <div style={{
              position: 'absolute', top: '110%', right: 0, zIndex: 50,
              background: '#1C2230', border: `1px solid ${BORDER}`, borderRadius: 10,
              padding: 6, minWidth: 130, boxShadow: '0 8px 24px rgba(0,0,0,.4)',
            }}>
              {['owner', 'admin', 'member'].filter(r => r !== member.role).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setRoleOpen(false);
                    handle('role', () => onChangeRole(member.user_id, r));
                  }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 12px', borderRadius: 6, cursor: 'pointer',
                    background: 'transparent', border: 'none', color: '#C9CFD8', fontSize: 13,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,106,61,.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <RoleBadge role={r} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Confirmar email */}
        {!member.email_confirmed && (
          <button
            onClick={() => handle('confirm', () => onConfirmEmail(member.user_id))}
            disabled={loading === 'confirm'}
            style={{
              padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600,
              background: 'rgba(251,191,36,.12)', color: '#FCD34D',
              border: '1px solid rgba(251,191,36,.2)', cursor: 'pointer',
              opacity: loading === 'confirm' ? .6 : 1,
            }}
          >
            {loading === 'confirm' ? '...' : 'Confirmar e-mail'}
          </button>
        )}

        {/* Reset senha */}
        <button
          onClick={() => handle('reset', () => onResetPassword(member.user_id))}
          disabled={loading === 'reset'}
          style={{
            padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600,
            background: 'rgba(255,255,255,.05)', color: '#9AA2AE',
            border: `1px solid ${BORDER}`, cursor: 'pointer',
            opacity: loading === 'reset' ? .6 : 1,
          }}
        >
          {loading === 'reset' ? '...' : 'Resetar senha'}
        </button>
      </div>

      {/* Feedback */}
      {msg && (
        <div style={{
          fontSize: 12, fontWeight: 600,
          color: msg.ok ? '#34D399' : '#F87171',
          minWidth: 60,
        }}>
          {msg.text}
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  const { session } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [loadingTenants, setLoadingTenants] = useState(true);

  const { members, loading, error, changeRole, confirmEmail, resetPassword, refresh } =
    useUsersTenant(selectedTenant?.id);

  // Buscar todos os tenants (super admin vê todos)
  useEffect(() => {
    if (!session?.access_token) return;
    const load = async () => {
      try {
        const res = await fetch('/api/admin/platform/tenants', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const list = data.tenants || [];
          setTenants(list);
          // Seleciona ruptur-os por padrão
          const ruptur = list.find(t => t.slug === 'ruptur-os') || list[0];
          if (ruptur) setSelectedTenant(ruptur);
        }
      } catch {
        // fallback: usar membership do próprio user
      } finally {
        setLoadingTenants(false);
      }
    };
    load();
  }, [session?.access_token]);

  const confirmed = members.filter(m => m.email_confirmed);
  const pending = members.filter(m => !m.email_confirmed);

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'Inter, sans-serif', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, color: BRAND, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Gestão de Acesso
            </div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-.02em' }}>
              Usuários & Times
            </h1>
            <p style={{ margin: '6px 0 0', color: '#6B7280', fontSize: 13 }}>
              Gerencie membros, papéis e acesso por tenant
            </p>
          </div>
          <button
            onClick={refresh}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
              background: 'rgba(255,255,255,.05)', color: '#9AA2AE',
              border: `1px solid ${BORDER}`, cursor: 'pointer',
            }}
          >
            ↻ Atualizar
          </button>
        </div>

        {/* Tenant selector */}
        {!loadingTenants && tenants.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {tenants.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTenant(t)}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all .15s',
                  background: selectedTenant?.id === t.id ? BRAND : 'rgba(255,255,255,.05)',
                  color: selectedTenant?.id === t.id ? '#fff' : '#9AA2AE',
                  border: `1px solid ${selectedTenant?.id === t.id ? BRAND : BORDER}`,
                }}
              >
                {t.name || t.slug}
              </button>
            ))}
          </div>
        )}

        {/* Card principal */}
        <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          {/* Card header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 20px', borderBottom: `1px solid ${BORDER}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(255,106,61,.15)', color: BRAND,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {selectedTenant?.name || 'Tenant'}
                </div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>
                  {members.length} membro{members.length !== 1 ? 's' : ''} · {pending.length} pendente{pending.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                background: 'rgba(16,185,129,.1)', color: '#34D399',
                border: '1px solid rgba(16,185,129,.2)',
              }}>
                {confirmed.length} ativo{confirmed.length !== 1 ? 's' : ''}
              </span>
              {pending.length > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                  background: 'rgba(251,191,36,.1)', color: '#FCD34D',
                  border: '1px solid rgba(251,191,36,.2)',
                }}>
                  {pending.length} não confirmado{pending.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Lista de membros */}
          {loading && (
            <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>
              Carregando...
            </div>
          )}
          {error && (
            <div style={{ padding: 20, color: '#F87171', fontSize: 13 }}>
              Erro: {error}
            </div>
          )}
          {!loading && !error && members.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>
              Nenhum membro encontrado neste tenant.
            </div>
          )}
          {!loading && members.map(member => (
            <MemberRow
              key={member.user_id || member.id}
              member={member}
              isSelf={member.user_id === session?.user?.id}
              onChangeRole={changeRole}
              onConfirmEmail={confirmEmail}
              onResetPassword={resetPassword}
            />
          ))}
        </div>

        {/* Legenda de roles */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20, padding: '0 4px' }}>
          {[
            ['owner', 'Acesso total ao tenant + gestão de membros'],
            ['admin', 'Acesso operacional, sem gestão de membros'],
            ['member', 'Acesso básico conforme permissões do plano'],
          ].map(([role, desc]) => (
            <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RoleBadge role={role} />
              <span style={{ fontSize: 11, color: '#6B7280' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
