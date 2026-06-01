/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Loader, AlertCircle, RefreshCw, MessageSquare, Search, X,
  ChevronDown, Users, Archive, Bell, Filter, Send, Paperclip,
  Phone, MoreHorizontal, Tag, User, CheckCheck, Wifi, WifiOff,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../services/api';
import MessageThread from '../components/MessageThread';
import MessageComposer from '../components/MessageComposer';

/**
 * InboxV2 — Inbox nativo Ruptur OS
 *
 * Arquitetura:
 *   Frontend → Gateway (/api/inbox/*) → UAZAPI → WhatsApp
 *
 * Inspirações visuais:
 *   - Chatwoot: layout tri-coluna, atribuição, painel de lead, times
 *   - ManyChat: filtros rápidos (Não Lidas, Grupos), seletor de canal, lembretes
 *
 * Spec UAZAPI utilizada (via gateway routes-inbox.mjs):
 *   GET  /api/inbox/instances         → /instance/all (instâncias do tenant)
 *   POST /api/inbox/chats             → /chat/find    (lista conversas com filtros)
 *   POST /api/inbox/messages          → /message/find (histórico paginado)
 *   POST /api/inbox/send              → /send/text, /send/media
 *   POST /api/inbox/markread          → /message/markread
 *   POST /api/inbox/lead              → /chat/editLead (atribuição, tags, ticket)
 *   GET  /api/inbox/labels/:key       → /chat/labels
 *   GET  /api/inbox/groups/:key       → /group/list
 *   GET  /api/inbox/sse/:key?token=   → /sse (Server-Sent Events tempo real)
 *
 * Conexão Bubble (legada):
 *   O antigo Inbox.jsx carregava iframe Bubble (uazapigo-multiatendimento.bubbleapps.io).
 *   Este componente substitui o iframe com chamadas diretas ao gateway.
 *   O webhook UAZAPI → /api/bubble/validate ainda pode alimentar Supabase em paralelo.
 */

// ─── Filtros disponíveis na sidebar ──────────────────────────────────────────
const FILTERS = [
  { id: 'all',      label: 'Todas',      icon: MessageSquare },
  { id: 'unread',   label: 'Não Lidas',  icon: Bell          },
  { id: 'groups',   label: 'Grupos',     icon: Users         },
  { id: 'archived', label: 'Arquivadas', icon: Archive       },
];

// ─── Mapeia filtro → payload /chat/find ──────────────────────────────────────
function filterToPayload(filterId) {
  switch (filterId) {
    case 'unread':   return { lead_isTicketOpen: true };
    case 'groups':   return { wa_isGroup: true };
    case 'archived': return { wa_archived: true };
    default:         return {};
  }
}

// ─── Helper: formatar timestamp ───────────────────────────────────────────────
function fmtTime(ts) {
  if (!ts) return '';
  const d = new Date(typeof ts === 'number' ? ts * 1000 : ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 86_400_000) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// ─── Helper: extrair nome legível do chat ─────────────────────────────────────
function chatName(chat) {
  return chat.wa_contactName || chat.name || chat.wa_name
    || chat.wa_chatid?.replace(/@.+/, '') || 'Desconhecido';
}

// ─── Helper: preview da última mensagem ──────────────────────────────────────
function lastMsgPreview(chat) {
  const body = chat.wa_lastMsg?.body || chat.wa_lastMsg?.caption || '';
  if (!body) return '(sem mensagens)';
  return body.length > 55 ? body.slice(0, 52) + '…' : body;
}

// ─── Sub-componente: avatar com initial ───────────────────────────────────────
function Avatar({ name, size = 40, isGroup = false }) {
  const initial = (name || '?')[0].toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: isGroup ? '10px' : '50%',
      background: isGroup ? 'rgba(255,106,61,.2)' : 'rgba(255,106,61,.15)',
      border: `1px solid rgba(255,106,61,${isGroup ? '.4' : '.25'})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#FF6A3D', fontWeight: 700, fontSize: size * 0.4,
      flexShrink: 0,
    }}>
      {isGroup ? <Users size={size * 0.45} /> : initial}
    </div>
  );
}

// ─── Sub-componente: badge de não-lidas ──────────────────────────────────────
function UnreadBadge({ count }) {
  if (!count) return null;
  return (
    <span style={{
      background: '#FF6A3D', color: 'white', borderRadius: '10px',
      padding: '1px 6px', fontSize: '11px', fontWeight: 700, minWidth: '18px',
      textAlign: 'center',
    }}>{count > 99 ? '99+' : count}</span>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
const InboxV2 = () => {
  const { session, isAuthenticated, loading: authLoading } = useAuth();

  // ── Instâncias ──────────────────────────────────────────────────────────────
  const [instances, setInstances]           = useState([]);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [instancesLoading, setInstancesLoading] = useState(true);

  // ── Chats ───────────────────────────────────────────────────────────────────
  const [chats, setChats]                   = useState([]);
  const [chatsLoading, setChatsLoading]     = useState(false);
  const [selectedChat, setSelectedChat]     = useState(null);
  const [filter, setFilter]                 = useState('all');
  const [searchTerm, setSearchTerm]         = useState('');
  const [labels, setLabels]                 = useState([]);

  // ── Envio ───────────────────────────────────────────────────────────────────
  const [sending, setSending]               = useState(false);
  const [replyText, setReplyText]           = useState('');

  // ── SSE ─────────────────────────────────────────────────────────────────────
  const [sseConnected, setSseConnected]     = useState(false);
  const sseRef                              = useRef(null);

  // ── Painel de lead (direita) ─────────────────────────────────────────────────
  const [showLeadPanel, setShowLeadPanel]   = useState(false);

  // ── Erros globais ────────────────────────────────────────────────────────────
  const [error, setError]                   = useState(null);

  // ─── 1. Carregar instâncias ao montar ──────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    loadInstances();
  }, [isAuthenticated]);

  const loadInstances = async () => {
    try {
      setInstancesLoading(true);
      // GET /api/inbox/instances — lista instâncias do tenant com status UAZAPI
      const data = await authFetch('/api/inbox/instances');
      const list = data.instances || [];
      setInstances(list);
      // Auto-selecionar a primeira instância conectada
      const connected = list.find(i => i.status === 'connected') || list[0];
      if (connected) setSelectedInstance(connected);
    } catch (e) {
      setError(e.message);
    } finally {
      setInstancesLoading(false);
    }
  };

  // ─── 2. Carregar chats quando instância ou filtro muda ─────────────────────
  useEffect(() => {
    if (!selectedInstance) return;
    loadChats();
    loadLabels();
    connectSSE();
    return () => disconnectSSE();
  }, [selectedInstance?.key, filter]);

  const loadChats = async () => {
    if (!selectedInstance) return;
    try {
      setChatsLoading(true);
      // POST /api/inbox/chats — spec UAZAPI: /chat/find com filtros
      const data = await authFetch('/api/inbox/chats', {
        method: 'POST',
        body: JSON.stringify({
          instanceKey: selectedInstance.key,
          sort: '-wa_lastMsgTimestamp',
          limit: 50,
          offset: 0,
          filters: filterToPayload(filter),
        }),
      });
      setChats(data.chats || []);
    } catch (e) {
      console.error('[InboxV2] Erro ao carregar chats:', e.message);
    } finally {
      setChatsLoading(false);
    }
  };

  const loadLabels = async () => {
    if (!selectedInstance) return;
    try {
      // GET /api/inbox/labels/:instanceKey — spec UAZAPI: /chat/labels
      const data = await authFetch(`/api/inbox/labels/${encodeURIComponent(selectedInstance.key)}`);
      setLabels(data.labels || []);
    } catch {
      // Labels são opcionais — não bloquear a UI
    }
  };

  // ─── 3. SSE — tempo real via /api/inbox/sse/:instanceKey ──────────────────
  const connectSSE = () => {
    if (!selectedInstance || !session?.access_token) return;
    disconnectSSE();

    // Spec UAZAPI: GET /sse com header 'token' — aqui usamos query param para EventSource
    const url = `/api/inbox/sse/${encodeURIComponent(selectedInstance.key)}?token=${session.access_token}`;
    const es = new EventSource(url);

    es.onopen = () => setSseConnected(true);
    es.onerror = () => setSseConnected(false);

    // Evento de nova mensagem → atualizar chat na lista
    es.addEventListener('messages', (e) => {
      try {
        const payload = JSON.parse(e.data);
        const chatId = payload?.key?.remoteJid || payload?.chatid;
        if (!chatId) return;
        // Atualizar preview na lista sem recarregar tudo
        setChats(prev => prev.map(c =>
          c.wa_chatid === chatId
            ? { ...c, wa_lastMsgTimestamp: payload.messageTimestamp, wa_lastMsg: payload.message }
            : c
        ));
        // Se chat selecionado, acrescentar mensagem ao thread (via pubSub/evento customizado)
        if (selectedChat?.wa_chatid === chatId) {
          window.dispatchEvent(new CustomEvent('inbox:newmsg', { detail: payload }));
        }
      } catch {}
    });

    sseRef.current = es;
  };

  const disconnectSSE = () => {
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
      setSseConnected(false);
    }
  };

  // ─── 4. Selecionar chat ────────────────────────────────────────────────────
  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    // Marcar como lido — spec UAZAPI: /message/markread
    if (chat.wa_unreadCount > 0) {
      try {
        await authFetch('/api/inbox/markread', {
          method: 'POST',
          body: JSON.stringify({
            instanceKey: selectedInstance.key,
            messageIds: [chat.wa_chatid],
          }),
        });
        setChats(prev => prev.map(c =>
          c.wa_chatid === chat.wa_chatid ? { ...c, wa_unreadCount: 0 } : c
        ));
      } catch {}
    }
  };

  // ─── 5. Enviar mensagem ────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!replyText.trim() || !selectedChat || !selectedInstance) return;
    const text = replyText.trim();
    setReplyText('');
    setSending(true);
    try {
      // POST /api/inbox/send — spec UAZAPI: /send/text
      await authFetch('/api/inbox/send', {
        method: 'POST',
        body: JSON.stringify({
          instanceKey: selectedInstance.key,
          to: selectedChat.wa_chatid,
          type: 'text',
          content: text,
        }),
      });
    } catch (e) {
      console.error('[InboxV2] Erro ao enviar:', e.message);
      setReplyText(text); // restaurar
    } finally {
      setSending(false);
    }
  };

  // ─── fetchFn injetada no MessageThread ────────────────────────────────────
  // POST /api/inbox/messages — spec UAZAPI: /message/find (chatid + paginação)
  const fetchMessages = useCallback(async (offset = 0, limit = 50) => {
    if (!selectedChat || !selectedInstance) return { messages: [], hasMore: false };
    const data = await authFetch('/api/inbox/messages', {
      method: 'POST',
      body: JSON.stringify({
        instanceKey: selectedInstance.key,
        chatId: selectedChat.wa_chatid,
        limit,
        offset,
      }),
    });
    return { messages: data.messages || [], has_more: data.hasMore };
  }, [selectedChat?.wa_chatid, selectedInstance?.key]);

  // ─── Filtros de busca local ────────────────────────────────────────────────
  const filteredChats = chats.filter(chat => {
    if (!searchTerm) return true;
    const name = chatName(chat).toLowerCase();
    const phone = (chat.wa_chatid || '').toLowerCase();
    const body = lastMsgPreview(chat).toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || phone.includes(q) || body.includes(q);
  });

  // ─── Loading global ────────────────────────────────────────────────────────
  if (authLoading || instancesLoading) {
    return (
      <div style={styles.center}>
        <Loader size={32} style={styles.spinner} />
        <p style={styles.muted}>Carregando inbox…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <AlertCircle size={32} color="#FF6A3D" />
        <p style={{ color: '#fff', margin: '8px 0 0' }}>{error}</p>
        <button style={styles.retryBtn} onClick={loadInstances}>
          <RefreshCw size={14} /> Tentar novamente
        </button>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={styles.root}>

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <aside style={styles.sidebar}>

        {/* Seletor de instância */}
        <div style={styles.instanceSelector}>
          <div style={styles.instanceLabel}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: sseConnected ? '#25D366' : '#6B7280',
              }} />
              <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, letterSpacing: 1 }}>
                {sseConnected ? 'AO VIVO' : 'INSTÂNCIA'}
              </span>
            </div>
          </div>
          <select
            style={styles.instanceSelect}
            value={selectedInstance?.key || ''}
            onChange={e => {
              const inst = instances.find(i => i.key === e.target.value);
              setSelectedInstance(inst || null);
              setSelectedChat(null);
            }}
          >
            {instances.length === 0 && <option value="">Nenhuma instância</option>}
            {instances.map(i => (
              <option key={i.key} value={i.key}>
                {i.name || i.phone || i.key} {i.status !== 'connected' ? '(offline)' : ''}
              </option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
        </div>

        {/* Busca — inspirado ManyChat */}
        <div style={styles.searchBar}>
          <Search size={14} color="#6B7280" />
          <input
            style={styles.searchInput}
            placeholder="Pesquisar conversas…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button style={styles.iconBtn} onClick={() => setSearchTerm('')}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filtros rápidos — inspirado Chatwoot + ManyChat */}
        <div style={styles.filterRow}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              style={{ ...styles.filterBtn, ...(filter === f.id ? styles.filterBtnActive : {}) }}
              onClick={() => { setFilter(f.id); setSelectedChat(null); }}
              title={f.label}
            >
              <f.icon size={13} />
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Lista de chats */}
        <div style={styles.chatList}>
          {chatsLoading ? (
            <div style={styles.center}>
              <Loader size={20} style={styles.spinner} />
            </div>
          ) : filteredChats.length === 0 ? (
            <div style={styles.emptyState}>
              <MessageSquare size={28} color="#4B5563" />
              <p style={styles.muted}>Nenhuma conversa</p>
            </div>
          ) : filteredChats.map(chat => (
            <div
              key={chat.wa_chatid || chat.id}
              style={{
                ...styles.chatItem,
                ...(selectedChat?.wa_chatid === chat.wa_chatid ? styles.chatItemActive : {}),
              }}
              onClick={() => handleChatSelect(chat)}
            >
              <Avatar name={chatName(chat)} isGroup={chat.wa_isGroup} />
              <div style={styles.chatItemInfo}>
                <div style={styles.chatItemRow}>
                  <span style={styles.chatItemName}>{chatName(chat)}</span>
                  <span style={styles.chatItemTime}>{fmtTime(chat.wa_lastMsgTimestamp)}</span>
                </div>
                <div style={styles.chatItemRow}>
                  <span style={styles.chatItemPreview}>{lastMsgPreview(chat)}</span>
                  <UnreadBadge count={chat.wa_unreadCount} />
                </div>
                {/* Etiquetas do lead — spec UAZAPI: lead_tags */}
                {chat.lead_tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
                    {chat.lead_tags.slice(0, 2).map(tag => (
                      <span key={tag} style={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Etiquetas disponíveis (bottom da sidebar) */}
        {labels.length > 0 && (
          <div style={styles.labelsSection}>
            <span style={styles.sectionLabel}>ETIQUETAS</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '6px 12px' }}>
              {labels.map(l => (
                <button
                  key={l.id || l.name}
                  style={{ ...styles.tag, cursor: 'pointer', background: 'rgba(255,106,61,.12)' }}
                  onClick={() => {
                    setFilter('all');
                    // Filtrar por etiqueta via /chat/find com wa_label
                    authFetch('/api/inbox/chats', {
                      method: 'POST',
                      body: JSON.stringify({
                        instanceKey: selectedInstance?.key,
                        filters: { wa_label: l.name },
                        sort: '-wa_lastMsgTimestamp',
                        limit: 50,
                      }),
                    }).then(d => setChats(d.chats || [])).catch(() => {});
                  }}
                >
                  <Tag size={10} /> {l.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── PAINEL CENTRAL ─────────────────────────────────────────────────── */}
      <main style={styles.main}>
        {!selectedChat ? (
          <div style={styles.center}>
            <MessageSquare size={40} color="#374151" />
            <p style={styles.muted}>Selecione uma conversa</p>
          </div>
        ) : (
          <>
            {/* Header do chat */}
            <div style={styles.chatHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button style={styles.iconBtn} onClick={() => setSelectedChat(null)}>
                  <X size={18} />
                </button>
                <Avatar name={chatName(selectedChat)} isGroup={selectedChat.wa_isGroup} size={34} />
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{chatName(selectedChat)}</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>
                    {selectedChat.wa_chatid?.replace(/@.+/, '')}
                    {selectedChat.wa_isGroup && ' · Grupo'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {/* Status SSE */}
                <span title={sseConnected ? 'Tempo real ativo' : 'Offline'}>
                  {sseConnected
                    ? <Wifi size={16} color="#25D366" />
                    : <WifiOff size={16} color="#6B7280" />}
                </span>
                <button style={styles.iconBtn} onClick={() => setShowLeadPanel(v => !v)} title="Dados do lead">
                  <User size={16} />
                </button>
                <button style={styles.iconBtn} title="Mais ações">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            {/* Thread de mensagens */}
            {/* MessageThread com fetchFn → /api/inbox/messages (spec: /message/find) */}
            <MessageThread
              chatId={selectedChat.wa_chatid}
              instanceId={selectedInstance?.key}
              tenantId={null}
              fetchFn={fetchMessages}
              onNewMessage={() => {}}
            />

            {/* Composer + envio */}
            <div style={styles.composer}>
              <textarea
                style={styles.composerInput}
                placeholder="Escreva uma mensagem… (Enter para enviar)"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                disabled={sending}
              />
              <div style={styles.composerActions}>
                <button style={styles.iconBtn} title="Anexar mídia">
                  <Paperclip size={16} />
                </button>
                <button
                  style={{
                    ...styles.sendBtn,
                    opacity: (!replyText.trim() || sending) ? 0.5 : 1,
                  }}
                  onClick={handleSend}
                  disabled={!replyText.trim() || sending}
                >
                  {sending ? <Loader size={15} style={styles.spinnerSm} /> : <Send size={15} />}
                  Enviar
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── PAINEL DO LEAD (direita) ────────────────────────────────────────── */}
      {showLeadPanel && selectedChat && (
        <aside style={styles.leadPanel}>
          <div style={styles.leadPanelHeader}>
            <span style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>Lead / Contato</span>
            <button style={styles.iconBtn} onClick={() => setShowLeadPanel(false)}>
              <X size={16} />
            </button>
          </div>

          <div style={styles.leadSection}>
            <Avatar name={chatName(selectedChat)} isGroup={selectedChat.wa_isGroup} size={52} />
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 600 }}>{chatName(selectedChat)}</div>
              <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
                {selectedChat.wa_chatid?.replace(/@.+/, '')}
              </div>
            </div>
          </div>

          {/* Status ticket — spec UAZAPI: lead_isTicketOpen */}
          <div style={styles.leadRow}>
            <span style={styles.leadRowLabel}>Ticket</span>
            <button
              style={{
                ...styles.ticketBtn,
                background: selectedChat.lead_isTicketOpen ? 'rgba(34,197,94,.15)' : 'rgba(107,114,128,.15)',
                color: selectedChat.lead_isTicketOpen ? '#22C55E' : '#6B7280',
                borderColor: selectedChat.lead_isTicketOpen ? 'rgba(34,197,94,.3)' : 'rgba(107,114,128,.3)',
              }}
              onClick={async () => {
                const newStatus = !selectedChat.lead_isTicketOpen;
                await authFetch('/api/inbox/lead', {
                  method: 'POST',
                  body: JSON.stringify({
                    instanceKey: selectedInstance?.key,
                    chatId: selectedChat.wa_chatid,
                    lead_isTicketOpen: newStatus,
                  }),
                }).catch(() => {});
                setSelectedChat(c => ({ ...c, lead_isTicketOpen: newStatus }));
              }}
            >
              {selectedChat.lead_isTicketOpen ? 'Aberto' : 'Fechado'}
            </button>
          </div>

          {/* Tags */}
          <div style={styles.leadRow}>
            <span style={styles.leadRowLabel}>Tags</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {(selectedChat.lead_tags || []).map(t => (
                <span key={t} style={styles.tag}>{t}</span>
              ))}
              {(!selectedChat.lead_tags?.length) && (
                <span style={{ color: '#4B5563', fontSize: 12 }}>Nenhuma</span>
              )}
            </div>
          </div>

          {/* Atribuição — spec UAZAPI: lead_assignedAttendant_id */}
          <div style={styles.leadRow}>
            <span style={styles.leadRowLabel}>Atendente</span>
            <span style={{ color: selectedChat.lead_assignedAttendant_id ? '#fff' : '#4B5563', fontSize: 12 }}>
              {selectedChat.lead_assignedAttendant_id || 'Não atribuído'}
            </span>
          </div>

          {/* Última mensagem timestamp */}
          <div style={styles.leadRow}>
            <span style={styles.leadRowLabel}>Última msg</span>
            <span style={{ color: '#9CA3AF', fontSize: 12 }}>
              {fmtTime(selectedChat.wa_lastMsgTimestamp)}
            </span>
          </div>
        </aside>
      )}
    </div>
  );
};

// ─── Estilos inline — design system Ruptur (orange #FF6A3D / dark #0E1116) ───
const styles = {
  root: {
    display: 'flex', height: 'calc(100vh - 64px)',
    background: '#0E1116', overflow: 'hidden',
    fontFamily: 'Inter, -apple-system, sans-serif',
    fontSize: 13,
  },
  // Sidebar
  sidebar: {
    width: 280, minWidth: 220, maxWidth: 320,
    display: 'flex', flexDirection: 'column',
    borderRight: '1px solid rgba(255,255,255,.07)',
    background: '#111827', overflow: 'hidden',
  },
  instanceSelector: {
    padding: '10px 12px 8px',
    borderBottom: '1px solid rgba(255,255,255,.06)',
    position: 'relative',
  },
  instanceLabel: {
    marginBottom: 4,
  },
  instanceSelect: {
    width: '100%', background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.1)', borderRadius: 8,
    color: '#fff', padding: '7px 28px 7px 10px',
    fontSize: 13, fontWeight: 500, appearance: 'none', cursor: 'pointer',
  },
  searchBar: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 12px',
    borderBottom: '1px solid rgba(255,255,255,.06)',
    background: 'rgba(255,255,255,.02)',
  },
  searchInput: {
    flex: 1, background: 'none', border: 'none', color: '#fff',
    fontSize: 13, outline: 'none',
  },
  filterRow: {
    display: 'flex', gap: 2, padding: '6px 8px',
    borderBottom: '1px solid rgba(255,255,255,.06)',
    flexWrap: 'wrap',
  },
  filterBtn: {
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '4px 8px', borderRadius: 6,
    border: 'none', background: 'transparent',
    color: '#6B7280', cursor: 'pointer', fontSize: 11,
    fontWeight: 600, transition: 'all .15s',
  },
  filterBtnActive: {
    background: 'rgba(255,106,61,.15)',
    color: '#FF6A3D',
  },
  chatList: {
    flex: 1, overflowY: 'auto', overflowX: 'hidden',
  },
  chatItem: {
    display: 'flex', gap: 10, padding: '11px 12px',
    borderBottom: '1px solid rgba(255,255,255,.04)',
    cursor: 'pointer', transition: 'background .15s',
    alignItems: 'flex-start',
  },
  chatItemActive: {
    background: 'rgba(255,106,61,.1)',
    borderLeft: '3px solid #FF6A3D',
    paddingLeft: 9,
  },
  chatItemInfo: { flex: 1, minWidth: 0 },
  chatItemRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', gap: 4, marginBottom: 2,
  },
  chatItemName: {
    color: '#F9FAFB', fontWeight: 600, fontSize: 13,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  chatItemTime: { color: '#4B5563', fontSize: 11, flexShrink: 0 },
  chatItemPreview: {
    color: '#6B7280', fontSize: 12,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
  },
  tag: {
    background: 'rgba(255,106,61,.1)', color: '#FF6A3D',
    padding: '1px 6px', borderRadius: 4, fontSize: 10,
    fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3,
    border: '1px solid rgba(255,106,61,.2)',
  },
  labelsSection: {
    borderTop: '1px solid rgba(255,255,255,.06)',
    paddingTop: 6,
  },
  sectionLabel: {
    display: 'block', padding: '4px 12px',
    fontSize: 10, fontWeight: 700, color: '#4B5563', letterSpacing: 1.2,
  },
  // Main
  main: {
    flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    background: '#0E1116',
  },
  chatHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,.07)',
    background: '#111827',
    flexShrink: 0,
  },
  composer: {
    borderTop: '1px solid rgba(255,255,255,.07)',
    background: '#111827', padding: '10px 12px',
    flexShrink: 0,
  },
  composerInput: {
    width: '100%', background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.1)', borderRadius: 10,
    color: '#fff', padding: '10px 12px', fontSize: 13,
    outline: 'none', resize: 'none', fontFamily: 'inherit',
    lineHeight: 1.5,
  },
  composerActions: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 8,
  },
  sendBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: '#FF6A3D', color: '#fff',
    border: 'none', borderRadius: 8, padding: '8px 16px',
    fontWeight: 600, fontSize: 13, cursor: 'pointer',
    transition: 'opacity .15s',
  },
  // Lead panel
  leadPanel: {
    width: 240, borderLeft: '1px solid rgba(255,255,255,.07)',
    background: '#111827', overflowY: 'auto',
    display: 'flex', flexDirection: 'column',
  },
  leadPanelHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 14px',
    borderBottom: '1px solid rgba(255,255,255,.07)',
  },
  leadSection: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '20px 14px 14px',
    borderBottom: '1px solid rgba(255,255,255,.07)',
  },
  leadRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '10px 14px',
    borderBottom: '1px solid rgba(255,255,255,.04)',
  },
  leadRowLabel: {
    fontSize: 11, fontWeight: 700, color: '#4B5563',
    letterSpacing: 0.5, marginRight: 8, flexShrink: 0,
  },
  ticketBtn: {
    padding: '3px 10px', borderRadius: 6, border: '1px solid',
    fontSize: 11, fontWeight: 700, cursor: 'pointer',
  },
  // Utilitários
  center: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  muted: { color: '#4B5563', margin: 0, fontSize: 13 },
  spinner: { animation: 'spin 1s linear infinite', color: '#FF6A3D' },
  spinnerSm: { animation: 'spin 1s linear infinite' },
  iconBtn: {
    background: 'none', border: 'none', color: '#6B7280',
    cursor: 'pointer', padding: 4, display: 'flex',
    alignItems: 'center', borderRadius: 6,
    transition: 'color .15s',
  },
  retryBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    marginTop: 8, padding: '8px 14px', borderRadius: 8,
    border: '1px solid rgba(255,106,61,.4)',
    background: 'rgba(255,106,61,.08)', color: '#FF6A3D',
    cursor: 'pointer', fontWeight: 600, fontSize: 12,
  },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 8, padding: '40px 20px',
    color: '#4B5563',
  },
};

export default InboxV2;
