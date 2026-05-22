/**
 * Admin.jsx — Configurações da plataforma
 * Abas: Usuários e papéis · Workspace · Conta · Cobrança · Notificações
 *       Privacidade & LGPD · Conectores · Permissões · Instâncias uazapi · Webhooks
 *
 * Abas funcionais (API real):
 *   - Conectores: mostra integrações ativas / disponíveis
 *   - Instâncias uazapi: CRUD de provider_accounts (/api/admin/provider-accounts)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  PageHeader, Button, Modal, Input, Icon,
} from '../../ds/index.js';
import { useToast } from '../../ds/toast.js';
import { providerApi } from '../../api/admin.api.js';

// ─── helpers ─────────────────────────────────────────────────────────────────

const KIND_LABEL = { free: 'Free', paid: 'Pago', dedicated: 'Dedicado', internal: 'Interno' };
const KIND_TONE  = { free: 'wa', paid: 'brand', dedicated: 'brand', internal: 'muted' };
const STATUS_LABEL = { active: 'Ativo', capacity_full: 'Capacidade cheia', draining: 'Drenando', disabled: 'Desabilitado', expired: 'Expirado' };
const STATUS_COLOR = { active: '#22c55e', capacity_full: '#f59e0b', draining: '#f59e0b', disabled: '#6b7280', expired: '#ef4444' };

function dot(color) {
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7,
      borderRadius: '50%', background: color, marginRight: 6, flexShrink: 0,
    }} />
  );
}

// ─── Aba: Usuários e papéis ───────────────────────────────────────────────────

const MOCK_USERS = [
  { id: 1, name: 'Mariana Souza', role: 'SDR Lead', email: 'mariana@riacho.com.br', lastAccess: 'há 3h', status: 'Ativo' },
  { id: 2, name: 'Rafael Lima',   role: 'AE Sênior', email: 'rafael@riacho.com.br', lastAccess: 'há 5h', status: 'Ativo' },
  { id: 3, name: 'Bruna Castro',  role: 'SDR',        email: 'bruna@riacho.com.br',  lastAccess: 'há 5h', status: 'Ativo' },
  { id: 4, name: 'Diego Marques', role: 'AE',         email: 'diego@riacho.com.br',  lastAccess: 'há 5h', status: 'Ativo' },
  { id: 5, name: 'Camila Reis',   role: 'CSM',        email: 'camila@riacho.com.br', lastAccess: 'há 1h', status: 'Ativo' },
  { id: 6, name: 'João Pedro',    role: 'AE',         email: 'joao@riacho.com.br',   lastAccess: 'há 1h', status: 'Ativo' },
  { id: 7, name: 'Sara Aldana',   role: 'CSM',        email: 'sara@riacho.com.br',   lastAccess: 'há 4h', status: 'Ativo' },
];

function UsersTab() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontWeight: 600, color: 'var(--ink-900)', fontSize: 15 }}>Equipe</div>
        <Button variant="primary" icon="plus" size="sm">Convidar</Button>
      </div>
      <div style={{ border: '1px solid var(--ink-150)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--ink-50)' }}>
              {['NOME', 'PAPEL', 'E-MAIL', 'ÚLTIMO ACESSO', 'STATUS'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: 'var(--ink-500)', letterSpacing: '.04em' }}>{h}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((u, i) => (
              <tr key={u.id} style={{ borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--brand-100)', color: 'var(--brand-600)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 12,
                    }}>
                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontWeight: 500, color: 'var(--ink-900)' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: 'var(--brand-50)', color: 'var(--brand-600)',
                    padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                  }}>● {u.role}</span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-600)' }}>{u.email}</td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-500)' }}>{u.lastAccess}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', color: '#22c55e', fontWeight: 500 }}>
                    {dot('#22c55e')}{u.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Icon name="more" size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Aba: Conectores ──────────────────────────────────────────────────────────

const STATIC_CONNECTORS = [
  {
    id: 'getnet',
    name: 'Getnet',
    desc: 'Gateway de pagamento — PIX, Boleto, Cartão. Integrado ao módulo de billing.',
    icon: 'billing',
    connected: true,
    badge: 'Ativo',
    badgeColor: '#22c55e',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    desc: 'Banco de dados e autenticação da plataforma.',
    icon: 'shield',
    connected: true,
    badge: 'Ativo',
    badgeColor: '#22c55e',
  },
  {
    id: 'crm',
    name: 'CRM Externo',
    desc: 'Integre com HubSpot, Salesforce, Pipedrive ou qualquer CRM via webhook.',
    icon: 'pipeline',
    connected: false,
    badge: 'Disponível',
    badgeColor: '#6b7280',
  },
  {
    id: 'openai',
    name: 'OpenAI / GPT-4',
    desc: 'IA para geração de mensagens, playbooks e análise de conversas.',
    icon: 'sparkles',
    connected: false,
    badge: 'Disponível',
    badgeColor: '#6b7280',
  },
];

function UazapiConnectorCard({ accounts, loading, onAdd, onSync }) {
  const { toast } = useToast();
  const [testing, setTesting] = useState(null); // id da conta sendo testada

  const totalInstances = accounts.reduce((s, a) => s + (a.used_instances || 0), 0);
  const isConnected = accounts.length > 0;

  async function handleTest(account) {
    setTesting(account.id);
    try {
      await providerApi.syncAccount(account.id);
      toast({ type: 'success', title: `UAZAPI "${account.label}" — conexão OK ✓` });
      onSync?.();
    } catch (e) {
      toast({ type: 'error', title: `Falha na conexão: ${e.message}` });
    } finally {
      setTesting(null);
    }
  }

  return (
    <div style={{
      border: '1px solid var(--ink-150)', borderRadius: 10,
      background: 'var(--ink-0)',
    }}>
      {/* Cabeçalho do conector */}
      <div style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
        borderBottom: isConnected && accounts.length > 0 ? '1px solid var(--ink-100)' : 'none',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: isConnected ? 'var(--brand-50)' : 'var(--ink-100)',
          color: isConnected ? 'var(--brand-500)' : 'var(--ink-400)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="wa" size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontWeight: 600, color: 'var(--ink-900)', fontSize: 14 }}>UAZAPI</span>
            {loading ? (
              <span style={{ fontSize: 11, color: 'var(--ink-400)' }}>Carregando…</span>
            ) : (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                background: isConnected ? '#dcfce7' : 'var(--ink-100)',
                color: isConnected ? '#22c55e' : '#6b7280',
              }}>
                {dot(isConnected ? '#22c55e' : '#6b7280')}
                {isConnected ? `${accounts.length} conta${accounts.length > 1 ? 's' : ''} · ${totalInstances} instância${totalInstances !== 1 ? 's' : ''}` : 'Não configurado'}
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-500)' }}>
            Provedor de instâncias WhatsApp — free (1h) e pagas (persistentes). Suporte a múltiplas contas por tenant.
          </p>
        </div>
        <Button variant="primary" size="sm" icon="plus" onClick={onAdd}>
          Adicionar conta
        </Button>
      </div>

      {/* Lista de contas existentes */}
      {!loading && accounts.length > 0 && (
        <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {accounts.map(acc => {
            const statusColor = STATUS_COLOR[acc.status] || '#6b7280';
            return (
              <div key={acc.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 8,
                background: 'var(--ink-50)', border: '1px solid var(--ink-100)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-900)' }}>{acc.label}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                      background: acc.account_kind === 'free' ? 'var(--ink-100)' : 'var(--brand-50)',
                      color: acc.account_kind === 'free' ? 'var(--ink-500)' : 'var(--brand-600)',
                    }}>
                      {KIND_LABEL[acc.account_kind] || acc.account_kind}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 2, fontFamily: 'monospace' }}>
                    {acc.server_url}
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', color: statusColor }}>
                  {dot(statusColor)}{acc.used_instances || 0}/{acc.capacity_instances > 0 ? acc.capacity_instances : '∞'} inst.
                </div>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => handleTest(acc)}
                  disabled={testing === acc.id}
                >
                  {testing === acc.id ? 'Testando…' : 'Testar'}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Estado vazio */}
      {!loading && accounts.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ink-400)', fontSize: 13 }}>
          Nenhuma conta UAZAPI configurada. Clique em "Adicionar conta" para começar.
        </div>
      )}
    </div>
  );
}

function ConnectorsTab() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await providerApi.listAccounts();
      setAccounts(result.accounts || []);
    } catch (e) {
      if (e.status !== 401 && e.status !== 403) {
        toast({ type: 'error', title: e.message || 'Erro ao carregar contas UAZAPI.' });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* UAZAPI — card dinâmico com dados reais */}
      <UazapiConnectorCard
        accounts={accounts}
        loading={loading}
        onAdd={() => setAddOpen(true)}
        onSync={loadAccounts}
      />

      {/* Demais conectores — estáticos por ora */}
      {STATIC_CONNECTORS.map(c => (
        <div key={c.id} style={{
          border: '1px solid var(--ink-150)', borderRadius: 10,
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 16,
          background: c.connected ? 'var(--ink-0)' : 'var(--ink-25, #fafafa)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: c.connected ? 'var(--brand-50)' : 'var(--ink-100)',
            color: c.connected ? 'var(--brand-500)' : 'var(--ink-400)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name={c.icon} size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontWeight: 600, color: 'var(--ink-900)', fontSize: 14 }}>{c.name}</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                background: c.connected ? '#dcfce7' : 'var(--ink-100)',
                color: c.badgeColor,
              }}>
                {dot(c.badgeColor)}{c.badge}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-500)' }}>{c.desc}</p>
          </div>
          {c.connected ? (
            <Button variant="ghost" size="sm">Configurar</Button>
          ) : (
            <Button variant="secondary" size="sm" icon="plus">Conectar</Button>
          )}
        </div>
      ))}

      {addOpen && (
        <AddAccountModal onClose={() => setAddOpen(false)} onSaved={loadAccounts} />
      )}
    </div>
  );
}

// ─── Aba: Instâncias UAZAPI ────────────────────────────────────────────────────

function AddAccountModal({ onClose, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    label: '', serverUrl: 'https://free.uazapi.com',
    adminToken: '', accountKind: 'free', capacityInstances: 1,
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.label.trim()) { toast({ type: 'error', title: 'Informe um nome para a conta.' }); return; }
    if (!form.adminToken.trim()) { toast({ type: 'error', title: 'Token de admin obrigatório.' }); return; }
    setSaving(true);
    try {
      await providerApi.createAccount({
        label: form.label.trim(),
        serverUrl: form.serverUrl.trim() || 'https://free.uazapi.com',
        adminToken: form.adminToken.trim(),
        accountKind: form.accountKind,
        capacityInstances: Number(form.capacityInstances) || 1,
      });
      toast({ type: 'success', title: 'Conta UAZAPI adicionada!' });
      onSaved();
      onClose();
    } catch (e) {
      toast({ type: 'error', title: e.message || 'Erro ao salvar conta.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Adicionar conta UAZAPI" onClose={onClose} size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0' }}>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-600)', marginBottom: 6 }}>
            NOME DA CONTA
          </label>
          <Input
            placeholder="Ex: UAZAPI Free — Ruptur"
            value={form.label}
            onChange={e => set('label', e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-600)', marginBottom: 6 }}>
            TIPO
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['free', 'paid', 'dedicated'].map(k => (
              <button
                key={k}
                onClick={() => set('accountKind', k)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid',
                  borderColor: form.accountKind === k ? 'var(--brand-500)' : 'var(--ink-150)',
                  background: form.accountKind === k ? 'var(--brand-50)' : 'var(--ink-0)',
                  color: form.accountKind === k ? 'var(--brand-600)' : 'var(--ink-600)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                {KIND_LABEL[k]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-600)', marginBottom: 6 }}>
            URL DO SERVIDOR
          </label>
          <Input
            placeholder="https://free.uazapi.com"
            value={form.serverUrl}
            onChange={e => set('serverUrl', e.target.value)}
          />
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--ink-400)' }}>
            Servidor free: https://free.uazapi.com · Pago: URL do seu servidor UAZAPI
          </p>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-600)', marginBottom: 6 }}>
            TOKEN DE ADMIN
          </label>
          <Input
            type="password"
            placeholder="Token gerado no painel UAZAPI"
            value={form.adminToken}
            onChange={e => set('adminToken', e.target.value)}
          />
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--ink-400)' }}>
            Nunca exposto no frontend — armazenado criptografado (AES-256-GCM).
          </p>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-600)', marginBottom: 6 }}>
            CAPACIDADE (instâncias)
          </label>
          <Input
            type="number"
            min={1}
            placeholder="Ex: 100"
            value={form.capacityInstances}
            onChange={e => set('capacityInstances', e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando…' : 'Adicionar conta'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function AccountCard({ account, onSync, onDisable }) {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);

  const usedPct = account.capacity_instances > 0
    ? Math.min(100, Math.round((account.used_instances / account.capacity_instances) * 100))
    : 0;

  async function handleSync() {
    setSyncing(true);
    try {
      const result = await providerApi.syncAccount(account.id);
      toast({ type: 'success', title: `Sync OK — ${result.upserted ?? '?'} instâncias sincronizadas.` });
      onSync?.();
    } catch (e) {
      toast({ type: 'error', title: e.message || 'Erro ao sincronizar.' });
    } finally {
      setSyncing(false);
    }
  }

  async function handleToggle() {
    const next = account.status === 'active' ? 'disabled' : 'active';
    try {
      await providerApi.updateStatus(account.id, next);
      toast({ type: 'success', title: `Conta ${next === 'active' ? 'ativada' : 'desabilitada'}.` });
      onDisable?.();
    } catch (e) {
      toast({ type: 'error', title: e.message || 'Erro ao atualizar status.' });
    }
  }

  const statusColor = STATUS_COLOR[account.status] || '#6b7280';

  return (
    <div style={{
      border: '1px solid var(--ink-150)', borderRadius: 12, padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: 'var(--brand-50)', color: 'var(--brand-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="wa" size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, color: 'var(--ink-900)', fontSize: 14 }}>{account.label}</span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
              background: KIND_TONE[account.account_kind] === 'brand' ? 'var(--brand-50)' : 'var(--ink-100)',
              color: KIND_TONE[account.account_kind] === 'brand' ? 'var(--brand-600)' : 'var(--ink-500)',
            }}>
              {KIND_LABEL[account.account_kind] || account.account_kind}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{account.server_url}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: statusColor }}>
          {dot(statusColor)}{STATUS_LABEL[account.status] || account.status}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)', marginBottom: 2 }}>INSTÂNCIAS</div>
          <div style={{ fontWeight: 700, color: 'var(--ink-900)' }}>
            {account.used_instances} / {account.capacity_instances > 0 ? account.capacity_instances : '∞'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)', marginBottom: 2 }}>TOKEN</div>
          <div style={{ fontWeight: 500, color: 'var(--ink-700)', fontFamily: 'monospace' }}>
            ···· {account.admin_token_last4 || '????'}
          </div>
        </div>
        {account.expires_at && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)', marginBottom: 2 }}>EXPIRA</div>
            <div style={{ fontWeight: 500, color: 'var(--ink-700)' }}>
              {new Date(account.expires_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        )}
      </div>

      {/* Capacity bar */}
      {account.capacity_instances > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-500)', marginBottom: 4 }}>
            <span>Uso de capacidade</span>
            <span>{usedPct}%</span>
          </div>
          <div style={{ height: 4, background: 'var(--ink-100)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${usedPct}%`,
              background: usedPct > 90 ? '#ef4444' : usedPct > 70 ? '#f59e0b' : 'var(--brand-500)',
              transition: 'width .3s',
            }} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" size="sm" icon="sparkles" onClick={handleSync} disabled={syncing}>
          {syncing ? 'Sincronizando…' : 'Sincronizar'}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleToggle}>
          {account.status === 'active' ? 'Desabilitar' : 'Ativar'}
        </Button>
      </div>
    </div>
  );
}

function UazapiTab() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await providerApi.listAccounts();
      setAccounts(result.accounts || []);
    } catch (e) {
      // Migração pendente ou sem permissão
      if (e.status === 503) {
        toast({ type: 'error', title: 'Migration pendente', message: e.message });
      } else if (e.status === 401 || e.status === 403) {
        toast({ type: 'error', title: 'Acesso restrito a admins da plataforma.' });
      } else {
        toast({ type: 'error', title: e.message || 'Erro ao carregar contas.' });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--ink-900)', fontSize: 15 }}>Contas UAZAPI</div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 2 }}>
            Gerencie servidores WhatsApp — free (1h) e pagos (persistentes).
          </div>
        </div>
        <Button variant="primary" icon="plus" size="sm" onClick={() => setAddOpen(true)}>
          Adicionar conta
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2].map(i => (
            <div key={i} style={{
              height: 160, border: '1px solid var(--ink-150)', borderRadius: 12,
              background: 'var(--ink-50)', animation: 'pulse 1.4s infinite',
            }} />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          border: '1px dashed var(--ink-200)', borderRadius: 12,
          color: 'var(--ink-400)',
        }}>
          <Icon name="wa" size={32} />
          <div style={{ marginTop: 12, fontWeight: 600, color: 'var(--ink-600)' }}>Nenhuma conta UAZAPI</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Adicione uma conta para começar a gerenciar instâncias WhatsApp.
          </div>
          <div style={{ marginTop: 16 }}>
            <Button variant="primary" icon="plus" onClick={() => setAddOpen(true)}>
              Adicionar conta
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {accounts.map(a => (
            <AccountCard key={a.id} account={a} onSync={load} onDisable={load} />
          ))}
        </div>
      )}

      {/* Info box */}
      <div style={{
        marginTop: 24, padding: '14px 16px', borderRadius: 10,
        background: 'var(--brand-25, #fff7f4)', border: '1px solid var(--brand-100)',
        fontSize: 13, color: 'var(--ink-700)',
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="alert" size={14} /> Modelo multi-conta
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Cada conta pode servir N tenants (plataforma gerencia o roteamento).</li>
          <li>Um tenant pode ter múltiplas contas atribuídas (free + paid, por exemplo).</li>
          <li>Free: instâncias expiram em 1h — ideal para testes. Paid: persistentes.</li>
          <li>Token admin nunca é exibido no frontend — armazenado criptografado.</li>
        </ul>
      </div>

      {addOpen && (
        <AddAccountModal onClose={() => setAddOpen(false)} onSaved={load} />
      )}
    </div>
  );
}

// ─── Aba: Webhooks ────────────────────────────────────────────────────────────

function WebhooksTab() {
  const endpoints = [
    { event: 'whatsapp.message.received', url: '/api/v1/webhooks/wa/message', method: 'POST', active: true },
    { event: 'whatsapp.qr.updated',       url: '/api/v1/webhooks/wa/qr',      method: 'POST', active: true },
    { event: 'whatsapp.status.changed',   url: '/api/v1/webhooks/wa/status',  method: 'POST', active: true },
    { event: 'billing.payment.confirmed', url: '/api/v1/webhooks/getnet',     method: 'POST', active: true },
  ];

  return (
    <div>
      <div style={{ fontWeight: 600, color: 'var(--ink-900)', fontSize: 15, marginBottom: 16 }}>Webhooks registrados</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {endpoints.map(ep => (
          <div key={ep.event} style={{
            border: '1px solid var(--ink-150)', borderRadius: 10, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
              background: '#dbeafe', color: '#1d4ed8', fontFamily: 'monospace',
            }}>{ep.method}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-900)' }}>{ep.event}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)', fontFamily: 'monospace', marginTop: 2 }}>{ep.url}</div>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 600, color: '#22c55e' }}>
              {dot('#22c55e')}Ativo
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Aba genérica: Placeholder ────────────────────────────────────────────────

function ComingSoonTab({ label }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--ink-400)' }}>
      <Icon name="sparkles" size={36} />
      <div style={{ marginTop: 14, fontWeight: 600, color: 'var(--ink-600)', fontSize: 15 }}>{label}</div>
      <div style={{ fontSize: 13, marginTop: 4 }}>Em construção — disponível em breve.</div>
    </div>
  );
}

// ─── Tabs config ─────────────────────────────────────────────────────────────

const TABS = [
  { id: 'users',       label: 'Usuários e papéis', badge: 7, component: UsersTab },
  { id: 'workspace',   label: 'Workspace',          component: () => <ComingSoonTab label="Workspace" /> },
  { id: 'conta',       label: 'Conta',              component: () => <ComingSoonTab label="Conta" /> },
  { id: 'billing',     label: 'Cobrança',           component: () => <ComingSoonTab label="Cobrança" /> },
  { id: 'notifs',      label: 'Notificações',       component: () => <ComingSoonTab label="Notificações" /> },
  { id: 'lgpd',        label: 'Privacidade & LGPD', component: () => <ComingSoonTab label="Privacidade & LGPD" /> },
  { id: 'conectores',  label: 'Conectores',         component: ConnectorsTab },
  { id: 'permissions', label: 'Permissões',         component: () => <ComingSoonTab label="Permissões" /> },
  { id: 'uazapi',      label: 'Instâncias uazapi',  component: UazapiTab },
  { id: 'webhooks',    label: 'Webhooks',           component: WebhooksTab },
];

// ─── Página principal ─────────────────────────────────────────────────────────

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users');

  const currentTab = TABS.find(t => t.id === activeTab) || TABS[0];
  const TabComponent = currentTab.component;

  return (
    <>
      <PageHeader
        crumbs={['Ruptur OS', 'Sistema', 'Configurações']}
        title="Admin"
        sub="Workspace, equipe, integrações e segurança"
      />

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 0, borderBottom: '1px solid var(--ink-150)',
        marginBottom: 28, overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 16px', fontSize: 13, fontWeight: 500,
              border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: activeTab === t.id ? '2px solid var(--brand-500)' : '2px solid transparent',
              color: activeTab === t.id ? 'var(--brand-500)' : 'var(--ink-500)',
              whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'color .15s',
            }}
          >
            {t.label}
            {t.badge != null && (
              <span style={{
                fontSize: 11, fontWeight: 700, minWidth: 18, height: 18, padding: '0 5px',
                borderRadius: 9, background: activeTab === t.id ? 'var(--brand-500)' : 'var(--ink-200)',
                color: activeTab === t.id ? '#fff' : 'var(--ink-600)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <TabComponent key={activeTab} />
    </>
  );
}
