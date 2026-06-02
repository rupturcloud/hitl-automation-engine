/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, RefreshCw, X, Users, Loader2, Edit3, Trash2,
  CheckCircle, XCircle, UserPlus, UserMinus, Shield, Database,
  Building2, CreditCard, Zap,
} from 'lucide-react';
import { authFetch } from '../services/api';

/**
 * TenantManager — CRUD completo de tenants (plataforma super-admin)
 *
 * Rotas backend (gateway.mjs):
 *   GET    /api/admin/platform/tenants          — listar com dados ricos
 *   POST   /api/admin/platform/tenants          — criar tenant
 *   GET    /api/admin/platform/tenants/:id      — detalhe + membros
 *   PATCH  /api/admin/platform/tenants/:id      — atualizar (nome, plano, status, créditos)
 *   DELETE /api/admin/platform/tenants/:id      — suspender (soft delete)
 *   GET    /api/admin/platform/tenants/:id/members  — listar membros
 *   POST   /api/admin/platform/tenants/:id/members  — adicionar membro (cria user se necessário)
 *   DELETE /api/admin/platform/tenants/:id/members/:userId — remover membro
 */

const PLANS = ['trial', 'starter', 'pro', 'business', 'custom'];
const STATUS = ['active', 'suspended', 'cancelled', 'pending'];

const STATUS_COLOR = {
  active:    { bg: 'rgba(0,255,136,.12)', color: '#00ff88', label: 'Ativo' },
  suspended: { bg: 'rgba(255,170,0,.12)', color: '#ffaa00', label: 'Suspenso' },
  cancelled: { bg: 'rgba(255,77,106,.12)', color: '#ff4d6a', label: 'Cancelado' },
  pending:   { bg: 'rgba(0,242,255,.12)', color: '#00f2ff', label: 'Pendente' },
};

const PLAN_COLOR = {
  trial:    '#6B7280',
  starter:  '#3B82F6',
  pro:      '#8B5CF6',
  business: '#F59E0B',
  custom:   '#10B981',
};

function StatusBadge({ status }) {
  const s = STATUS_COLOR[status] || STATUS_COLOR.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '2px 8px', borderRadius: 6,
      fontSize: 11, fontWeight: 700,
    }}>{s.label}</span>
  );
}

function PlanBadge({ plan }) {
  return (
    <span style={{
      background: 'rgba(255,255,255,.06)',
      color: PLAN_COLOR[plan] || '#9CA3AF',
      padding: '2px 8px', borderRadius: 6,
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
    }}>{plan}</span>
  );
}

// ─── Modal de criação/edição de tenant ───────────────────────────────────────
function TenantModal({ tenant, onClose, onSave }) {
  const isEdit = !!tenant?.id;
  const [form, setForm] = useState({
    slug:             tenant?.slug || '',
    name:             tenant?.name || '',
    email:            tenant?.email || '',
    plan:             tenant?.plan || 'trial',
    status:           tenant?.status || 'active',
    credits_balance:  tenant?.balance ?? 0,
    max_instances:    tenant?.maxInstances ?? 5,
    monthly_credits:  tenant?.monthly_credits ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      const url = isEdit
        ? `/api/admin/platform/tenants/${tenant.id}`
        : '/api/admin/platform/tenants';
      await authFetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        body: JSON.stringify(form),
      });
      onSave();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
            {isEdit ? `Editar — ${tenant.name}` : 'Novo Tenant'}
          </h3>
          <button style={styles.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {err && <div style={styles.errorBanner}>{err}</div>}

          <div style={styles.formGrid}>
            {!isEdit && (
              <label style={styles.label}>
                Slug (URL)
                <input style={styles.input} value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="ex: amais-nagila" required />
              </label>
            )}
            <label style={styles.label}>
              Nome *
              <input style={styles.input} value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Nome do cliente" required />
            </label>
            <label style={styles.label}>
              Email
              <input style={styles.input} type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="contato@empresa.com" />
            </label>
            <label style={styles.label}>
              Plano
              <select style={styles.input} value={form.plan}
                onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}>
                {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label style={styles.label}>
              Status
              <select style={styles.input} value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {STATUS.map(s => <option key={s} value={s}>{STATUS_COLOR[s]?.label || s}</option>)}
              </select>
            </label>
            <label style={styles.label}>
              Créditos iniciais
              <input style={styles.input} type="number" min="0" value={form.credits_balance}
                onChange={e => setForm(f => ({ ...f, credits_balance: Number(e.target.value) }))} />
            </label>
            <label style={styles.label}>
              Máx. instâncias
              <input style={styles.input} type="number" min="0" value={form.max_instances}
                onChange={e => setForm(f => ({ ...f, max_instances: Number(e.target.value) }))} />
            </label>
            <label style={styles.label}>
              Créditos mensais (renovação)
              <input style={styles.input} type="number" min="0" value={form.monthly_credits}
                onChange={e => setForm(f => ({ ...f, monthly_credits: Number(e.target.value) }))} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button type="button" style={styles.btnGhost} onClick={onClose}>Cancelar</button>
            <button type="submit" style={styles.btnPrimary} disabled={saving}>
              {saving ? <Loader2 size={15} className="spin" /> : <CheckCircle size={15} />}
              {isEdit ? 'Salvar alterações' : 'Criar tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal de membros do tenant ──────────────────────────────────────────────
function MembersModal({ tenant, onClose }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState('member');
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => { loadMembers(); }, []);

  async function loadMembers() {
    try {
      setLoading(true);
      const d = await authFetch(`/api/admin/platform/tenants/${tenant.id}/members`);
      setMembers(d.members || []);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  async function addMember(e) {
    e.preventDefault();
    if (!addEmail.trim()) return;
    setAdding(true); setErr('');
    try {
      await authFetch(`/api/admin/platform/tenants/${tenant.id}/members`, {
        method: 'POST',
        body: JSON.stringify({ email: addEmail.trim(), role: addRole }),
      });
      setAddEmail(''); await loadMembers();
    } catch (e) { setErr(e.message); }
    finally { setAdding(false); }
  }

  async function removeMember(userId) {
    if (!window.confirm('Remover este membro do tenant?')) return;
    setRemoving(userId);
    try {
      await authFetch(`/api/admin/platform/tenants/${tenant.id}/members/${userId}`, { method: 'DELETE' });
      await loadMembers();
    } catch (e) { setErr(e.message); }
    finally { setRemoving(''); }
  }

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, width: 540 }}>
        <div style={styles.modalHeader}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: 16 }}>
              <Users size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Membros — {tenant.name}
            </h3>
            <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: 12 }}>
              Adicione ou remova usuários deste tenant
            </p>
          </div>
          <button style={styles.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {err && <div style={styles.errorBanner}>{err}</div>}

        {/* Adicionar membro */}
        <form onSubmit={addMember} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            style={{ ...styles.input, flex: 1 }}
            type="email" placeholder="email@exemplo.com"
            value={addEmail} onChange={e => setAddEmail(e.target.value)} required
          />
          <select style={{ ...styles.input, width: 110 }} value={addRole} onChange={e => setAddRole(e.target.value)}>
            <option value="owner">owner</option>
            <option value="admin">admin</option>
            <option value="member">member</option>
            <option value="viewer">viewer</option>
          </select>
          <button type="submit" style={styles.btnPrimary} disabled={adding}>
            {adding ? <Loader2 size={14} className="spin" /> : <UserPlus size={14} />}
            Adicionar
          </button>
        </form>

        {/* Lista de membros */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Loader2 size={20} className="spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : members.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>Nenhum membro</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {members.map(m => (
              <div key={m.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,.03)', border: '1px solid var(--border-glass)',
              }}>
                <div>
                  <div style={{ color: 'var(--text-main)', fontSize: 13, fontWeight: 500 }}>{m.email}</div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: 'var(--primary)',
                    background: 'rgba(0,242,255,.1)', padding: '1px 6px', borderRadius: 4,
                  }}>{m.role}</span>
                </div>
                <button
                  onClick={() => removeMember(m.id)}
                  disabled={removing === m.id}
                  style={{ ...styles.iconBtn, color: '#ff4d6a' }}
                >
                  {removing === m.id ? <Loader2 size={14} className="spin" /> : <UserMinus size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function TenantManager() {
  const [tenants, setTenants]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [err, setErr]               = useState('');
  const [modal, setModal]           = useState(null);   // null | 'create' | { tenant }
  const [membersOf, setMembersOf]   = useState(null);   // null | tenant

  const load = useCallback(async (q = search) => {
    setLoading(true); setErr('');
    try {
      const d = await authFetch(`/api/admin/platform/tenants?search=${encodeURIComponent(q)}`);
      setTenants(d.tenants || []);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(''); }, []);
  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  async function suspend(t) {
    if (!window.confirm(`Suspender tenant "${t.name}"?`)) return;
    try {
      await authFetch(`/api/admin/platform/tenants/${t.id}`, { method: 'DELETE' });
      await load();
    } catch (e) { setErr(e.message); }
  }

  const onSave = () => { setModal(null); load(); };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.04)', border: '1px solid var(--border-glass)',
            borderRadius: 9, padding: '7px 13px',
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: 13, outline: 'none', width: 220 }}
              placeholder="Buscar por nome, email, slug…"
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button style={styles.btnGhost} onClick={() => load()}>
            <RefreshCw size={14} />
          </button>
        </div>
        <button style={styles.btnPrimary} onClick={() => setModal('create')}>
          <Plus size={15} /> Novo Tenant
        </button>
      </div>

      {err && <div style={styles.errorBanner}>{err}</div>}

      {/* Resumo */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        {[
          { label: 'Total',    value: tenants.length,                                                  icon: <Building2 size={16} />, color: '#00f2ff' },
          { label: 'Ativos',   value: tenants.filter(t => t.status === 'active').length,               icon: <CheckCircle size={16} />, color: '#00ff88' },
          { label: 'Suspensos',value: tenants.filter(t => t.status === 'suspended').length,            icon: <XCircle size={16} />, color: '#ffaa00' },
          { label: 'Créditos', value: tenants.reduce((s, t) => s + (t.balance || 0), 0).toLocaleString('pt-BR'), icon: <Zap size={16} />, color: '#a855f7' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: 'rgba(255,255,255,.03)',
            border: '1px solid var(--border-glass)', borderRadius: 10,
            padding: '12px 16px',
          }}>
            <div style={{ color: s.color, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div className="panel glass" style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px 80px 80px 80px 90px 110px', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--border-glass)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          <span>Tenant</span>
          <span>Plano</span>
          <span>Status</span>
          <span style={{ textAlign: 'right' }}>Créditos</span>
          <span style={{ textAlign: 'right' }}>Inst.</span>
          <span style={{ textAlign: 'right' }}>Membros</span>
          <span style={{ textAlign: 'right' }}>Criado</span>
          <span style={{ textAlign: 'right' }}>Ações</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
            <Loader2 size={22} className="spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : tenants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
            <Database size={28} style={{ marginBottom: 8, opacity: .4 }} />
            <p>Nenhum tenant encontrado</p>
          </div>
        ) : tenants.map(t => (
          <div key={t.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 100px 90px 80px 80px 80px 90px 110px',
            gap: 8, padding: '12px 14px',
            borderBottom: '1px solid rgba(255,255,255,.04)',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 13 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                /{t.slug}
              </div>
              {t.email && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.email}</div>}
            </div>
            <span><PlanBadge plan={t.plan} /></span>
            <span><StatusBadge status={t.status} /></span>
            <span style={{ textAlign: 'right', color: 'var(--text-dim)', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
              {Number(t.balance || 0).toLocaleString('pt-BR')}
            </span>
            <span style={{ textAlign: 'right', color: 'var(--text-dim)', fontSize: 13 }}>
              {t.connectedInstances}/{t.instances}
            </span>
            <span style={{ textAlign: 'right', color: 'var(--text-dim)', fontSize: 13 }}>
              {t.users?.length || 0}
            </span>
            <span style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: 11 }}>
              {t.createdAt ? new Date(t.createdAt).toLocaleDateString('pt-BR') : '—'}
            </span>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
              <button
                style={{ ...styles.iconBtn, color: 'var(--primary)' }}
                title="Gerenciar membros"
                onClick={() => setMembersOf(t)}
              ><Users size={14} /></button>
              <button
                style={{ ...styles.iconBtn }}
                title="Editar tenant"
                onClick={() => setModal(t)}
              ><Edit3 size={14} /></button>
              {t.status !== 'suspended' && (
                <button
                  style={{ ...styles.iconBtn, color: '#ffaa00' }}
                  title="Suspender tenant"
                  onClick={() => suspend(t)}
                ><Trash2 size={14} /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modais */}
      {modal && (
        <TenantModal
          tenant={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={onSave}
        />
      )}
      {membersOf && (
        <MembersModal
          tenant={membersOf}
          onClose={() => setMembersOf(null)}
        />
      )}
    </div>
  );
}

// ─── Estilos (segue o design system do AdminDashboard) ───────────────────────
const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 999,
    background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
  },
  modal: {
    background: '#0f0f1a', border: '1px solid var(--border-glass)',
    borderRadius: 16, padding: 24, width: 560, maxWidth: '100%',
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 24px 60px rgba(0,0,0,.5)',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 20,
  },
  formGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px',
  },
  label: {
    display: 'flex', flexDirection: 'column', gap: 4,
    fontSize: 12, fontWeight: 600, color: 'var(--text-dim)',
  },
  input: {
    background: 'rgba(255,255,255,.05)',
    border: '1px solid var(--border-glass)',
    borderRadius: 8, color: 'var(--text-main)',
    padding: '8px 12px', fontSize: 13,
    outline: 'none',
  },
  btnPrimary: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'linear-gradient(135deg, var(--secondary, #7000ff), var(--primary, #00f2ff))',
    color: '#000', border: 'none', borderRadius: 8,
    padding: '9px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer',
  },
  btnGhost: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(255,255,255,.05)',
    border: '1px solid var(--border-glass)',
    color: 'var(--text-dim)', borderRadius: 8,
    padding: '8px 14px', fontSize: 13, cursor: 'pointer',
  },
  iconBtn: {
    background: 'none', border: 'none',
    color: 'var(--text-muted)', cursor: 'pointer',
    padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center',
  },
  errorBanner: {
    background: 'rgba(255,77,106,.12)', border: '1px solid rgba(255,77,106,.3)',
    color: '#ff4d6a', borderRadius: 8, padding: '10px 14px',
    fontSize: 13, marginBottom: 12,
  },
};
