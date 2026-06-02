/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Loader, AlertCircle, RefreshCw, MessageSquare, Search, X,
  ChevronDown, Users, Archive, Bell, Tag, User,
  Send, Paperclip, MoreHorizontal, Wifi, WifiOff,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../services/api';
import MessageThread from '../components/MessageThread';

/**
 * InboxV2 — Inbox nativo Ruptur OS via UAZAPI
 *
 * Design: segue o design system do DashboardLayout
 *   - Variáveis CSS: var(--primary), var(--bg-secondary), var(--border-glass),
 *     var(--glass-bg), var(--text-main), var(--text-dim), var(--text-muted)
 *   - Classe .glass para painéis com backdrop-filter
 *   - Compensação do padding do .page-container (margin: -28px -36px)
 *     para o inbox ocupar todo o espaço disponível no shell
 *
 * Arquitetura (gateway routes-inbox.mjs):
 *   GET  /api/inbox/instances         → UAZAPI /instance/all (instâncias do tenant)
 *   POST /api/inbox/chats             → UAZAPI /chat/find    (lista + filtros)
 *   POST /api/inbox/messages          → UAZAPI /message/find (histórico paginado)
 *   POST /api/inbox/send              → UAZAPI /send/text, /send/media
 *   POST /api/inbox/markread          → UAZAPI /message/markread
 *   POST /api/inbox/lead              → UAZAPI /chat/editLead
 *   GET  /api/inbox/labels/:key       → UAZAPI /chat/labels
 *   GET  /api/inbox/groups/:key       → UAZAPI /group/list
 *   GET  /api/inbox/sse/:key?token=   → UAZAPI /sse relay (Server-Sent Events)
 *
 * Substituição:
 *   O Inbox.jsx legado carregava iframe do Bubble (uazapigo-multiatendimento.bubbleapps.io).
 *   Este componente chama o gateway diretamente — sem Bubble, sem Supabase uazapi_chats.
 */

// ─── Filtros da sidebar (inspirado Chatwoot + ManyChat) ──────────────────────
const FILTERS = [
  { id: 'all',      label: 'Todas',      icon: MessageSquare },
  { id: 'unread',   label: 'Não Lidas',  icon: Bell          },
  { id: 'groups',   label: 'Grupos',     icon: Users         },
  { id: 'archived', label: 'Arquivadas', icon: Archive       },
];

// Mapeia filtro → payload extra para /chat/find (spec UAZAPI: /chat/find)
function filterToPayload(id) {
  if (id === 'unread')   return { lead_isTicketOpen: true };
  if (id === 'groups')   return { wa_isGroup: true };
  if (id === 'archived') return { wa_archived: true };
  return {};
}

// ─── Utilitários ──────────────────────────────────────────────────────────────
function fmtTime(ts) {
  if (!ts) return '';
  const d = new Date(typeof ts === 'number' ? ts * 1000 : ts);
  const now = new Date();
  if (now - d < 86_400_000) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function chatName(c) {
  return c.wa_contactName || c.name || c.wa_name || c.wa_chatid?.replace(/@.+/, '') || 'Desconhecido';
}

function lastPreview(c) {
  const b = c.wa_lastMsg?.body || c.wa_lastMsg?.caption || '';
  return b ? (b.length > 52 ? b.slice(0, 49) + '…' : b) : '(sem mensagens)';
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function ChatAvatar({ name, isGroup, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: isGroup ? '9px' : '50%',
      background: 'rgba(0,242,255,.1)', border: '1px solid rgba(0,242,255,.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--primary)', fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
    }}>
      {isGroup ? <Users size={size * 0.42} /> : (name || '?')[0].toUpperCase()}
    </div>
  );
}

function Badge({ n }) {
  if (!n) return null;
  return (
    <span style={{
      background: 'var(--primary)', color: '#000',
      borderRadius: 10, padding: '1px 6px',
      fontSize: 10, fontWeight: 800, minWidth: 16, textAlign: 'center',
    }}>{n > 99 ? '99+' : n}</span>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function InboxV2() {
  const { session, isAuthenticated, loading: authLoading } = useAuth();

  const [instances, setInstances]           = useState([]);
  const [sel, setSel]                       = useState(null);   // instância selecionada
  const [instLoading, setInstLoading]       = useState(true);

  const [chats, setChats]                   = useState([]);
  const [chatsLoading, setChatsLoading]     = useState(false);
  const [chat, setChat]                     = useState(null);   // chat selecionado
  const [filter, setFilter]                 = useState('all');
  const [q, setQ]                           = useState('');
  const [labels, setLabels]                 = useState([]);

  const [replyText, setReplyText]           = useState('');
  const [sending, setSending]               = useState(false);
  const [leadOpen, setLeadOpen]             = useState(false);
  const [sseOn, setSseOn]                   = useState(false);
  const [error, setError]                   = useState(null);
  const sseRef                              = useRef(null);

  // ── 1. Carregar instâncias ─────────────────────────────────────────────────
  useEffect(() => { if (isAuthenticated) loadInstances(); }, [isAuthenticated]);

  async function loadInstances() {
    try {
      setInstLoading(true);
      const d = await authFetch('/api/inbox/instances');
      const list = d.instances || [];
      setInstances(list);
      // Auto-seleciona a primeira instância conectada
      const first = list.find(i => i.status === 'connected') || list[0];
      if (first) setSel(first);
    } catch (e) { setError(e.message); }
    finally { setInstLoading(false); }
  }

  // ── 2. Carregar chats quando instância / filtro mudam ─────────────────────
  useEffect(() => {
    if (!sel) return;
    loadChats();
    loadLabels();
    openSSE();
    return () => closeSSE();
  }, [sel?.key, filter]);

  async function loadChats() {
    try {
      setChatsLoading(true);
      // POST /api/inbox/chats → spec UAZAPI /chat/find com sort + paginação
      const d = await authFetch('/api/inbox/chats', {
        method: 'POST',
        body: JSON.stringify({
          instanceKey: sel.key,
          sort: '-wa_lastMsgTimestamp',
          limit: 50, offset: 0,
          filters: filterToPayload(filter),
        }),
      });
      setChats(d.chats || []);
    } catch (e) { console.error('[Inbox] chats:', e.message); }
    finally { setChatsLoading(false); }
  }

  async function loadLabels() {
    try {
      // GET /api/inbox/labels/:key → spec UAZAPI /chat/labels
      const d = await authFetch(`/api/inbox/labels/${encodeURIComponent(sel.key)}`);
      setLabels(d.labels || []);
    } catch { /* labels são opcionais */ }
  }

  // ── 3. SSE — tempo real (spec UAZAPI: GET /sse) ───────────────────────────
  function openSSE() {
    if (!sel || !session?.access_token) return;
    closeSSE();
    // EventSource não suporta headers → JWT via query param
    const url = `/api/inbox/sse/${encodeURIComponent(sel.key)}?token=${session.access_token}`;
    const es = new EventSource(url);
    es.onopen  = () => setSseOn(true);
    es.onerror = () => setSseOn(false);
    es.addEventListener('messages', e => {
      try {
        const p = JSON.parse(e.data);
        const cid = p?.key?.remoteJid || p?.chatid;
        if (!cid) return;
        setChats(prev => prev.map(c =>
          c.wa_chatid === cid
            ? { ...c, wa_lastMsgTimestamp: p.messageTimestamp, wa_lastMsg: p.message }
            : c
        ));
        if (chat?.wa_chatid === cid) {
          window.dispatchEvent(new CustomEvent('inbox:newmsg', { detail: p }));
        }
      } catch { /* ignorar erros de parse de mensagem SSE */ }
    });
    sseRef.current = es;
  }

  function closeSSE() {
    sseRef.current?.close();
    sseRef.current = null;
    setSseOn(false);
  }

  // ── 4. Selecionar chat + markread ─────────────────────────────────────────
  async function selectChat(c) {
    setChat(c);
    if (c.wa_unreadCount > 0) {
      try {
        // POST /api/inbox/markread → spec UAZAPI /message/markread
        await authFetch('/api/inbox/markread', {
          method: 'POST',
          body: JSON.stringify({ instanceKey: sel.key, messageIds: [c.wa_chatid] }),
        });
        setChats(prev => prev.map(x => x.wa_chatid === c.wa_chatid ? { ...x, wa_unreadCount: 0 } : x));
      } catch { /* ignorar erros de markread */ }
    }
  }

  // ── 5. Enviar mensagem ────────────────────────────────────────────────────
  async function sendMsg() {
    const text = replyText.trim();
    if (!text || !chat || !sel) return;
    setReplyText(''); setSending(true);
    try {
      // POST /api/inbox/send → spec UAZAPI /send/text
      await authFetch('/api/inbox/send', {
        method: 'POST',
        body: JSON.stringify({ instanceKey: sel.key, to: chat.wa_chatid, type: 'text', content: text }),
      });
    } catch (e) {
      console.error('[Inbox] send:', e.message);
      setReplyText(text); // restaurar em caso de erro
    } finally { setSending(false); }
  }

  // ── fetchFn injetado no MessageThread ─────────────────────────────────────
  // POST /api/inbox/messages → spec UAZAPI /message/find (chatid + paginação)
  const fetchMessages = useCallback(async (offset = 0, limit = 50) => {
    if (!chat || !sel) return { messages: [], hasMore: false };
    const d = await authFetch('/api/inbox/messages', {
      method: 'POST',
      body: JSON.stringify({ instanceKey: sel.key, chatId: chat.wa_chatid, limit, offset }),
    });
    return { messages: d.messages || [], has_more: d.hasMore };
  }, [chat?.wa_chatid, sel?.key]);

  // ── Filtro de busca local ─────────────────────────────────────────────────
  const filtered = chats.filter(c => {
    if (!q) return true;
    const s = q.toLowerCase();
    return chatName(c).toLowerCase().includes(s)
        || (c.wa_chatid || '').includes(s)
        || lastPreview(c).toLowerCase().includes(s);
  });

  // ─── Loading / erro ────────────────────────────────────────────────────────
  if (authLoading || instLoading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:12 }}>
      <Loader size={28} style={{ animation:'spin 1s linear infinite', color:'var(--primary)' }} />
      <p style={{ color:'var(--text-muted)' }}>Carregando inbox…</p>
    </div>
  );

  if (error) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:12 }}>
      <AlertCircle size={28} color="var(--error)" />
      <p style={{ color:'var(--text-dim)' }}>{error}</p>
      <button className="btn-primary" onClick={loadInstances} style={{ display:'flex', gap:6 }}>
        <RefreshCw size={14} /> Tentar novamente
      </button>
    </div>
  );

  // ─── Render principal ──────────────────────────────────────────────────────
  // Compensamos o padding do .page-container (28px 36px) para o inbox ocupar
  // todo o espaço disponível no main-content sem padding lateral
  return (
    <>
      {/* CSS de animação do spinner inline (não polui o global) */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .inbox-root { animation: none !important; }
        .inbox-sidebar-item:hover { background: rgba(255,255,255,.04); }
        .inbox-chat-item:hover { background: rgba(0,242,255,.06); }
        .inbox-filter-btn:hover { color: var(--primary) !important; }
        .inbox-icon-btn:hover { color: var(--text-main) !important; }
        .inbox-send-btn:disabled { opacity: .45; cursor: not-allowed; }
        select.inbox-select option { background: var(--bg-secondary, #0a0a14); }
      `}</style>

      <div
        className="inbox-root"
        style={{
          // Cancela o padding do .page-container para ocupar todo o espaço
          margin: '-28px -36px',
          height: 'calc(100vh - var(--header-height, 64px) - 12px)',
          display: 'flex',
          overflow: 'hidden',
          borderTop: '1px solid var(--border-glass)',
        }}
      >
        {/* ── SIDEBAR de conversas ──────────────────────────────────────────── */}
        <aside style={{
          width: 288, minWidth: 200,
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border-glass)',
          background: 'var(--bg-secondary, #0a0a14)',
          overflow: 'hidden',
        }}>

          {/* Seletor de instância */}
          <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--border-glass)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: sseOn ? 'var(--success, #00ff88)' : 'var(--text-muted)',
                boxShadow: sseOn ? '0 0 8px var(--success, #00ff88)' : 'none',
              }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1.2 }}>
                {sseOn ? 'AO VIVO' : 'INSTÂNCIA'}
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <select
                className="inbox-select"
                value={sel?.key || ''}
                onChange={e => {
                  const i = instances.find(x => x.key === e.target.value);
                  setSel(i || null); setChat(null);
                }}
                style={{
                  width: '100%', appearance: 'none',
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 8, color: 'var(--text-main)',
                  padding: '7px 28px 7px 10px', fontSize: 13,
                  fontWeight: 500, cursor: 'pointer',
                }}
              >
                {instances.length === 0 && <option value="">Nenhuma instância</option>}
                {instances.map(i => (
                  <option key={i.key} value={i.key}>
                    {i.name || i.phone || i.key}{i.status !== 'connected' ? ' (offline)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }} />
            </div>
          </div>

          {/* Busca — inspirado ManyChat */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px',
            borderBottom: '1px solid var(--border-glass)',
            background: 'rgba(255,255,255,.02)',
          }}>
            <Search size={13} color="var(--text-muted)" />
            <input
              value={q} onChange={e => setQ(e.target.value)}
              placeholder="Pesquisar conversas…"
              style={{
                flex: 1, background: 'none', border: 'none',
                color: 'var(--text-main)', fontSize: 13, outline: 'none',
              }}
            />
            {q && (
              <button className="inbox-icon-btn" onClick={() => setQ('')}
                style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:2 }}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filtros rápidos — Chatwoot + ManyChat */}
          <div style={{ display:'flex', gap:2, padding:'6px 8px', borderBottom:'1px solid var(--border-glass)', flexWrap:'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f.id}
                className="inbox-filter-btn"
                onClick={() => { setFilter(f.id); setChat(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 9px', borderRadius: 6, border: 'none',
                  background: filter === f.id ? 'rgba(0,242,255,.12)' : 'transparent',
                  color: filter === f.id ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  transition: 'all .15s',
                }}
              >
                <f.icon size={12} />
                {f.label}
              </button>
            ))}
          </div>

          {/* Lista de chats */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {chatsLoading ? (
              <div style={{ display:'flex', justifyContent:'center', padding:24 }}>
                <Loader size={20} style={{ animation:'spin 1s linear infinite', color:'var(--primary)' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'32px 20px', gap:8, color:'var(--text-muted)' }}>
                <MessageSquare size={24} />
                <span style={{ fontSize: 13 }}>Nenhuma conversa</span>
              </div>
            ) : filtered.map(c => (
              <div
                key={c.wa_chatid || c.id}
                className="inbox-chat-item"
                onClick={() => selectChat(c)}
                style={{
                  display: 'flex', gap: 10, padding: '11px 12px',
                  borderBottom: '1px solid rgba(255,255,255,.04)',
                  cursor: 'pointer', transition: 'background .12s',
                  background: chat?.wa_chatid === c.wa_chatid ? 'rgba(0,242,255,.1)' : 'transparent',
                  borderLeft: chat?.wa_chatid === c.wa_chatid ? '3px solid var(--primary)' : '3px solid transparent',
                  alignItems: 'flex-start',
                }}
              >
                <ChatAvatar name={chatName(c)} isGroup={c.wa_isGroup} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2 }}>
                    <span style={{ fontWeight:600, color:'var(--text-main)', fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {chatName(c)}
                    </span>
                    <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
                      <span style={{ fontSize:10, color:'var(--text-muted)' }}>{fmtTime(c.wa_lastMsgTimestamp)}</span>
                      <Badge n={c.wa_unreadCount} />
                    </div>
                  </div>
                  <p style={{ margin:0, color:'var(--text-muted)', fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {lastPreview(c)}
                  </p>
                  {/* Tags do lead — spec UAZAPI: lead_tags */}
                  {c.lead_tags?.length > 0 && (
                    <div style={{ display:'flex', gap:3, marginTop:3 }}>
                      {c.lead_tags.slice(0, 2).map(t => (
                        <span key={t} style={{
                          background:'rgba(0,242,255,.08)', color:'var(--primary)',
                          padding:'1px 6px', borderRadius:4, fontSize:10, fontWeight:600,
                          border:'1px solid rgba(0,242,255,.15)',
                        }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Etiquetas disponíveis — spec UAZAPI: /chat/labels */}
          {labels.length > 0 && (
            <div style={{ borderTop:'1px solid var(--border-glass)', padding:'8px 12px' }}>
              <span style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', letterSpacing:1.2, display:'block', marginBottom:5 }}>ETIQUETAS</span>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                {labels.map(l => (
                  <button
                    key={l.id || l.name}
                    onClick={() => authFetch('/api/inbox/chats', {
                      method:'POST',
                      body: JSON.stringify({ instanceKey: sel?.key, filters:{ wa_label: l.name }, sort:'-wa_lastMsgTimestamp', limit:50 }),
                    }).then(d => setChats(d.chats || [])).catch(() => {})}
                    style={{
                      background:'rgba(0,242,255,.08)', color:'var(--primary)',
                      border:'1px solid rgba(0,242,255,.15)', borderRadius:5,
                      padding:'2px 7px', fontSize:10, fontWeight:600, cursor:'pointer',
                      display:'flex', alignItems:'center', gap:3,
                    }}
                  >
                    <Tag size={9} /> {l.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── PAINEL CENTRAL — mensagens ─────────────────────────────────────── */}
        <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'var(--bg-primary, #06060e)' }}>
          {!chat ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, color:'var(--text-muted)' }}>
              <MessageSquare size={44} color="rgba(255,255,255,.08)" />
              <p style={{ fontSize:14 }}>Selecione uma conversa</p>
            </div>
          ) : (
            <>
              {/* Header do chat */}
              <div style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'10px 16px',
                borderBottom:'1px solid var(--border-glass)',
                background:'var(--bg-secondary, #0a0a14)',
                flexShrink:0,
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <button className="inbox-icon-btn" onClick={() => setChat(null)}
                    style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:4, borderRadius:6 }}>
                    <X size={18} />
                  </button>
                  <ChatAvatar name={chatName(chat)} isGroup={chat.wa_isGroup} size={34} />
                  <div>
                    <div style={{ fontWeight:600, color:'var(--text-main)', fontSize:14 }}>{chatName(chat)}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>
                      {chat.wa_chatid?.replace(/@.+/, '')}
                      {chat.wa_isGroup && ' · Grupo'}
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  {/* Status SSE ao vivo */}
                  <span title={sseOn ? 'Tempo real ativo' : 'Offline'}>
                    {sseOn
                      ? <Wifi size={15} color="var(--success, #00ff88)" />
                      : <WifiOff size={15} color="var(--text-muted)" />}
                  </span>
                  <button className="inbox-icon-btn" onClick={() => setLeadOpen(v => !v)} title="Painel do lead"
                    style={{ background: leadOpen ? 'rgba(0,242,255,.1)' : 'none', border:'none', color: leadOpen ? 'var(--primary)' : 'var(--text-muted)', cursor:'pointer', padding:6, borderRadius:6 }}>
                    <User size={15} />
                  </button>
                  <button className="inbox-icon-btn"
                    style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:6, borderRadius:6 }}>
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>

              {/* Thread de mensagens — MessageThread com fetchFn injetada */}
              {/* Spec UAZAPI: /message/find (chatid, limit, offset, hasMore) */}
              <MessageThread
                chatId={chat.wa_chatid}
                instanceId={sel?.key}
                tenantId={null}
                fetchFn={fetchMessages}
                onNewMessage={() => {}}
              />

              {/* Composer — enter para enviar, shift+enter para nova linha */}
              <div style={{
                borderTop:'1px solid var(--border-glass)',
                background:'var(--bg-secondary, #0a0a14)',
                padding:'10px 14px', flexShrink:0,
              }}>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                  placeholder="Escreva uma mensagem… (Enter envia, Shift+Enter nova linha)"
                  disabled={sending}
                  rows={2}
                  style={{
                    width:'100%', background:'rgba(255,255,255,.04)',
                    border:'1px solid var(--border-glass)', borderRadius:10,
                    color:'var(--text-main)', padding:'9px 12px',
                    fontSize:13, outline:'none', resize:'none',
                    fontFamily:'inherit', lineHeight:1.5,
                  }}
                />
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
                  <button className="inbox-icon-btn"
                    style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:6, borderRadius:6 }}
                    title="Anexar mídia">
                    <Paperclip size={15} />
                  </button>
                  <button
                    className="inbox-send-btn"
                    onClick={sendMsg}
                    disabled={!replyText.trim() || sending}
                    style={{
                      display:'flex', alignItems:'center', gap:6,
                      background:'linear-gradient(135deg, var(--secondary, #7000ff), var(--primary, #00f2ff))',
                      color:'#000', border:'none', borderRadius:8,
                      padding:'8px 18px', fontWeight:700, fontSize:13, cursor:'pointer',
                    }}
                  >
                    {sending ? <Loader size={14} style={{ animation:'spin 1s linear infinite' }} /> : <Send size={14} />}
                    Enviar
                  </button>
                </div>
              </div>
            </>
          )}
        </main>

        {/* ── PAINEL DO LEAD (direita) — spec UAZAPI: /chat/editLead ─────────── */}
        {leadOpen && chat && (
          <aside className="glass" style={{
            width: 234, borderLeft:'1px solid var(--border-glass)',
            display:'flex', flexDirection:'column', overflowY:'auto',
            background:'var(--bg-secondary, #0a0a14)',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', borderBottom:'1px solid var(--border-glass)' }}>
              <span style={{ fontWeight:700, color:'var(--text-main)', fontSize:13 }}>Lead / Contato</span>
              <button className="inbox-icon-btn" onClick={() => setLeadOpen(false)}
                style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:4, borderRadius:6 }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ padding:'18px 14px 14px', display:'flex', flexDirection:'column', alignItems:'center', borderBottom:'1px solid var(--border-glass)' }}>
              <ChatAvatar name={chatName(chat)} isGroup={chat.wa_isGroup} size={52} />
              <div style={{ marginTop:10, textAlign:'center' }}>
                <div style={{ color:'var(--text-main)', fontWeight:600, fontSize:14 }}>{chatName(chat)}</div>
                <div style={{ color:'var(--text-muted)', fontSize:11, marginTop:2 }}>{chat.wa_chatid?.replace(/@.+/, '')}</div>
              </div>
            </div>

            {/* Status do ticket — spec UAZAPI: lead_isTicketOpen */}
            <Row label="Ticket">
              <button
                onClick={async () => {
                  const v = !chat.lead_isTicketOpen;
                  await authFetch('/api/inbox/lead', {
                    method:'POST',
                    body: JSON.stringify({ instanceKey: sel?.key, chatId: chat.wa_chatid, lead_isTicketOpen: v }),
                  }).catch(() => {});
                  setChat(c => ({ ...c, lead_isTicketOpen: v }));
                }}
                style={{
                  padding:'3px 10px', borderRadius:6, border:'1px solid',
                  borderColor: chat.lead_isTicketOpen ? 'rgba(0,255,136,.3)' : 'rgba(255,255,255,.1)',
                  background: chat.lead_isTicketOpen ? 'rgba(0,255,136,.1)' : 'rgba(255,255,255,.04)',
                  color: chat.lead_isTicketOpen ? 'var(--success, #00ff88)' : 'var(--text-muted)',
                  fontSize:11, fontWeight:700, cursor:'pointer',
                }}
              >
                {chat.lead_isTicketOpen ? 'Aberto' : 'Fechado'}
              </button>
            </Row>

            {/* Tags do lead — spec UAZAPI: lead_tags */}
            <Row label="Tags">
              <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                {(chat.lead_tags || []).map(t => (
                  <span key={t} style={{
                    background:'rgba(0,242,255,.08)', color:'var(--primary)',
                    padding:'1px 6px', borderRadius:4, fontSize:10, fontWeight:600,
                    border:'1px solid rgba(0,242,255,.15)',
                  }}>{t}</span>
                ))}
                {!chat.lead_tags?.length && <span style={{ color:'var(--text-muted)', fontSize:12 }}>Nenhuma</span>}
              </div>
            </Row>

            {/* Atendente — spec UAZAPI: lead_assignedAttendant_id */}
            <Row label="Atendente">
              <span style={{ color: chat.lead_assignedAttendant_id ? 'var(--text-main)' : 'var(--text-muted)', fontSize:12 }}>
                {chat.lead_assignedAttendant_id || 'Não atribuído'}
              </span>
            </Row>

            <Row label="Última msg">
              <span style={{ color:'var(--text-muted)', fontSize:12 }}>{fmtTime(chat.wa_lastMsgTimestamp)}</span>
            </Row>
          </aside>
        )}
      </div>
    </>
  );
}

// Sub-componente de linha do painel lead
function Row({ label, children }) {
  return (
    <div style={{
      display:'flex', justifyContent:'space-between', alignItems:'flex-start',
      padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,.04)',
    }}>
      <span style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:.5, marginRight:8, flexShrink:0 }}>
        {label}
      </span>
      {children}
    </div>
  );
}
