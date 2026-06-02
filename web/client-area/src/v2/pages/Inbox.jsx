/**
 * Inbox — listagem de conversas e mensagens WhatsApp via UAZAPI.
 *
 * Layout de duas colunas:
 *  - Esquerda: lista de conversas (chats) com busca e seleção de instância
 *  - Direita: mensagens da conversa selecionada
 *
 * Dados:
 *  - Instâncias: whatsappApi.listNumbers()
 *  - Chats:      whatsappApi.getChats(id, limit)
 *  - Mensagens:  whatsappApi.getMessages(id, chatId, limit)
 *
 * Polling de chats a cada 30s para atualizar a lista.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { PageHeader } from '../../ds/index.js';
import { whatsappApi } from '../../api/whatsapp.api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

// ---------------------------------------------------------------------------
// CSS inline — escopo local, segue padrão dark do Numbers.jsx
// ---------------------------------------------------------------------------
const STYLES = `
  .inbox-root {
    display: flex;
    height: calc(100vh - 120px);
    min-height: 400px;
    border: 1px solid var(--ink-200);
    border-radius: 14px;
    overflow: hidden;
    background: var(--ink-0);
    margin-top: 16px;
  }

  /* — Painel esquerdo: conversas — */
  .inbox-sidebar {
    width: 300px;
    flex-shrink: 0;
    border-right: 1px solid var(--ink-200);
    display: flex;
    flex-direction: column;
    background: var(--ink-0);
  }
  .inbox-sidebar-head {
    padding: 14px 16px 10px;
    border-bottom: 1px solid var(--ink-200);
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
  }
  .inbox-sidebar-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink-700);
    letter-spacing: -.01em;
  }
  .inbox-search {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    background: var(--ink-100);
    border-radius: 8px;
    border: 1px solid transparent;
    transition: border-color .15s;
  }
  .inbox-search:focus-within {
    border-color: var(--brand-300, #FFBFAB);
    background: var(--ink-0);
  }
  .inbox-search input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 12.5px;
    color: var(--ink-900);
  }
  .inbox-search input::placeholder { color: var(--ink-400); }

  /* Seletor de instância */
  .inbox-inst-select {
    padding: 5px 8px;
    border-radius: 7px;
    border: 1px solid var(--ink-200);
    font-size: 11.5px;
    font-weight: 600;
    color: var(--ink-700);
    background: var(--ink-0);
    cursor: pointer;
    outline: none;
  }
  .inbox-inst-select:focus { border-color: var(--brand-400, #FF8A65); }

  /* Lista de chats */
  .inbox-chat-list {
    flex: 1;
    overflow-y: auto;
  }
  .inbox-chat-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 11px 14px;
    cursor: pointer;
    border-bottom: 1px solid var(--ink-100);
    transition: background .1s;
  }
  .inbox-chat-item:hover { background: var(--ink-50); }
  .inbox-chat-item.active { background: var(--brand-50, #FFF4F1); border-left: 2px solid var(--brand-500); }
  .inbox-chat-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--brand-500), #FFB088);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 12px;
    flex-shrink: 0;
  }
  .inbox-chat-info { flex: 1; min-width: 0; }
  .inbox-chat-name {
    font-weight: 600;
    font-size: 12.5px;
    color: var(--ink-900);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .inbox-chat-preview {
    font-size: 11.5px;
    color: var(--ink-500);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }
  .inbox-chat-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }
  .inbox-chat-time {
    font-size: 10.5px;
    color: var(--ink-400);
    font-variant-numeric: tabular-nums;
  }
  .inbox-chat-badge {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: var(--brand-500);
    color: white;
    font-size: 9.5px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* — Painel direito: mensagens — */
  .inbox-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: #0B141A;
  }
  .inbox-main-head {
    padding: 13px 18px;
    background: #1A232A;
    border-bottom: 1px solid rgba(255,255,255,.07);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .inbox-main-head .name {
    font-weight: 700;
    font-size: 13.5px;
    color: rgba(255,255,255,.92);
  }
  .inbox-main-head .phone {
    font-size: 11px;
    color: rgba(255,255,255,.4);
    font-family: ui-monospace, monospace;
    margin-top: 1px;
  }

  /* Área de mensagens */
  .inbox-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .inbox-bubble {
    padding: 7px 11px;
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.45;
    max-width: 65%;
    word-break: break-word;
    position: relative;
    animation: bubble-in .2s ease;
  }
  @keyframes bubble-in { from { opacity: 0; transform: translateY(3px); } }
  .inbox-bubble.sent {
    background: #005C4B;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 3px;
  }
  .inbox-bubble.received {
    background: #1F2C33;
    color: rgba(255,255,255,.9);
    align-self: flex-start;
    border-bottom-left-radius: 3px;
  }
  .inbox-bubble .ts {
    font-size: 9.5px;
    color: rgba(255,255,255,.4);
    margin-top: 4px;
    text-align: right;
  }

  /* Footer de reply */
  .inbox-reply-bar {
    padding: 12px 18px;
    background: #1A232A;
    border-top: 1px solid rgba(255,255,255,.07);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .inbox-reply-input {
    flex: 1;
    padding: 9px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.05);
    color: rgba(255,255,255,.9);
    font-size: 13px;
    outline: none;
    cursor: text;
    transition: border-color .15s;
  }
  .inbox-reply-input:focus {
    border-color: rgba(255,106,61,.5);
  }
  .inbox-reply-input::placeholder { color: rgba(255,255,255,.3); }
  .inbox-reply-send-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--brand-500, #FF6A3D);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity .15s, transform .1s;
  }
  .inbox-reply-send-btn:disabled {
    opacity: .4;
    cursor: not-allowed;
  }
  .inbox-reply-send-btn:not(:disabled):hover { opacity: .85; }
  .inbox-reply-send-btn:not(:disabled):active { transform: scale(.92); }

  /* Estado vazio e loading */
  .inbox-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: rgba(255,255,255,.25);
    padding: 40px;
    text-align: center;
  }
  .inbox-empty .icon { font-size: 36px; }
  .inbox-empty .label { font-size: 13px; line-height: 1.5; }

  .inbox-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,106,61,.2);
    border-top-color: var(--brand-500, #FF6A3D);
    border-radius: 50%;
    animation: spin .75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .inbox-sidebar-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 32px 20px;
    text-align: center;
    color: var(--ink-400);
    font-size: 12.5px;
  }

  @media (max-width: 768px) {
    .inbox-sidebar { width: 100%; }
    .inbox-root { flex-direction: column; height: auto; }
  }
`;

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

/** Formata timestamp UNIX (segundos ou milissegundos) para hora ou data */
function fmtTime(ts) {
  if (!ts) return '';
  const ms = ts > 1e10 ? ts : ts * 1000;
  const d = new Date(ms);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

/** Extrai nome legível de um chat */
function chatName(chat) {
  return (
    chat.name ||
    chat.wa_contactName ||
    chat.wa_name ||
    (chat.wa_chatid || '').replace('@s.whatsapp.net', '').replace('@g.us', '') ||
    '?'
  );
}

/** Extrai iniciais para avatar */
function initials(name) {
  return String(name).slice(0, 2).toUpperCase();
}

/** Extrai prévia da última mensagem */
function lastMsgPreview(chat) {
  const txt = chat.wa_lastMessageText || chat.wa_lastMessageTextVote || '';
  if (!txt) {
    const type = chat.wa_lastMessageType || '';
    if (type.includes('image')) return '📷 Imagem';
    if (type.includes('audio') || type.includes('ptt')) return '🎤 Áudio';
    if (type.includes('video')) return '🎥 Vídeo';
    if (type.includes('document')) return '📄 Documento';
    return '';
  }
  return txt.length > 48 ? txt.slice(0, 48) + '…' : txt;
}

/** Extrai texto de uma mensagem UAZAPI (vários subtipos possíveis) */
function msgText(msg) {
  // msg.message é objeto com o tipo como chave
  const m = msg.message || {};
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.documentMessage?.title ||
    m.buttonsResponseMessage?.selectedDisplayText ||
    m.listResponseMessage?.title ||
    (msg.messageType === 'audioMessage' || msg.messageType === 'pttMessage' ? '🎤 Áudio' : '') ||
    (msg.messageType === 'imageMessage' ? '📷 Imagem' : '') ||
    (msg.messageType === 'videoMessage' ? '🎥 Vídeo' : '') ||
    (msg.messageType === 'documentMessage' ? '📄 Documento' : '') ||
    '[mensagem]'
  );
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
function Spinner() {
  return <span className="inbox-spinner" />;
}

// ---------------------------------------------------------------------------
// ChatItem
// ---------------------------------------------------------------------------
function ChatItem({ chat, active, onClick }) {
  const name    = chatName(chat);
  const preview = lastMsgPreview(chat);
  const ts      = chat.wa_lastMsgTimestamp || chat.wa_timestamp;
  const unread  = chat.wa_unreadCount || 0;

  return (
    <div className={`inbox-chat-item${active ? ' active' : ''}`} onClick={onClick}>
      <div className="inbox-chat-avatar">{initials(name)}</div>
      <div className="inbox-chat-info">
        <div className="inbox-chat-name">{name}</div>
        {preview && <div className="inbox-chat-preview">{preview}</div>}
      </div>
      <div className="inbox-chat-meta">
        {ts && <div className="inbox-chat-time">{fmtTime(ts)}</div>}
        {unread > 0 && <div className="inbox-chat-badge">{unread > 9 ? '9+' : unread}</div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MessageBubble
// ---------------------------------------------------------------------------
function MessageBubble({ msg }) {
  const text     = msgText(msg);
  const isSent   = msg.key?.fromMe === true || msg.fromMe === true;
  const ts       = msg.messageTimestamp || msg.timestamp;

  return (
    <div className={`inbox-bubble ${isSent ? 'sent' : 'received'}`}>
      <div>{text}</div>
      {ts && <div className="ts">{fmtTime(ts)}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inbox — componente principal
// ---------------------------------------------------------------------------
export default function Inbox() {
  const { authReady } = useAuth();

  // Instâncias WhatsApp disponíveis
  const [instances, setInstances]         = useState([]);
  const [selectedInstId, setSelectedInstId] = useState(null);

  // Conversas
  const [chats, setChats]                 = useState([]);
  const [chatsLoading, setChatsLoading]   = useState(false);
  const [instanceExpired, setInstanceExpired] = useState(false);

  // Chat selecionado + mensagens
  const [selectedChat, setSelectedChat]   = useState(null);
  const [messages, setMessages]           = useState([]);
  const [msgsLoading, setMsgsLoading]     = useState(false);

  // Busca local na lista de chats
  const [search, setSearch]               = useState('');

  // Reply bar
  const [replyText, setReplyText]         = useState('');
  const [sendingMsg, setSendingMsg]       = useState(false);

  // Ref para bottom scroll
  const bottomRef = useRef(null);

  // -- Carregar instâncias --
  useEffect(() => {
    if (!authReady) return;
    whatsappApi.listNumbers()
      .then(res => {
        const rows = res?.data || [];
        setInstances(rows);
        // Seleciona o primeiro número conectado
        const connected = rows.find(r => (r.status || '').toLowerCase() === 'connected');
        const first = connected || rows[0];
        if (first) setSelectedInstId(first.id);
      })
      .catch(e => console.warn('[Inbox] listNumbers falhou:', e.message));
  }, [authReady]);

  // -- Carregar chats quando instância muda --
  const loadChats = useCallback(async (instId) => {
    if (!instId) return;
    setChatsLoading(true);
    setInstanceExpired(false);
    try {
      const res = await whatsappApi.getChats(instId, 40);
      const data = res?.data || {};
      // Detecta expiração: freeTrialExpired (campo novo) ou error legado INSTANCE_EXPIRED
      if (data.freeTrialExpired || data.error === 'INSTANCE_EXPIRED') {
        setInstanceExpired(true);
        setChats([]);
      } else {
        setChats(data.chats || []);
      }
    } catch (e) {
      console.warn('[Inbox] getChats falhou:', e.message);
      setChats([]);
    } finally {
      setChatsLoading(false);
    }
  }, []);

  // Reset de chat/mensagens ao trocar instância — eslint-disable necessário por setState síncrono
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (selectedInstId) { setSelectedChat(null); setMessages([]); loadChats(selectedInstId); } }, [selectedInstId, loadChats]);

  // Polling de chats a cada 30s
  useEffect(() => {
    if (!selectedInstId) return;
    const tid = setInterval(() => loadChats(selectedInstId), 30_000);
    return () => clearInterval(tid);
  }, [selectedInstId, loadChats]);

  // -- Carregar mensagens quando chat muda --
  useEffect(() => {
    if (!selectedInstId || !selectedChat) return;
    const chatId = selectedChat.wa_chatid || selectedChat.wa_fastid;
    if (!chatId) return;

    async function fetchMsgs() {
      setMsgsLoading(true);
      setMessages([]);
      try {
        const res = await whatsappApi.getMessages(selectedInstId, chatId, 60);
        const msgs = res?.data?.messages || [];
        // Ordena por timestamp crescente (mais antigas primeiro)
        msgs.sort((a, b) => {
          const ta = a.messageTimestamp || a.timestamp || 0;
          const tb = b.messageTimestamp || b.timestamp || 0;
          return ta - tb;
        });
        setMessages(msgs);
      } catch (e) {
        console.warn('[Inbox] getMessages falhou:', e.message);
      } finally {
        setMsgsLoading(false);
      }
    }
    fetchMsgs();
  }, [selectedInstId, selectedChat]);

  // Scroll para o fim ao carregar mensagens
  useEffect(() => {
    if (!msgsLoading && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, msgsLoading]);

  // -- Filtro local de chats por busca --
  const filteredChats = search.trim()
    ? chats.filter(c => {
        const q = search.toLowerCase();
        return (
          chatName(c).toLowerCase().includes(q) ||
          (c.wa_chatid || '').toLowerCase().includes(q)
        );
      })
    : chats;

  // -- Enviar mensagem --
  async function handleSend() {
    const text = replyText.trim();
    if (!text || !selectedInstId || !selectedChat || sendingMsg) return;
    const chatId = selectedChat.wa_chatid || selectedChat.wa_fastid;
    if (!chatId) return;

    setSendingMsg(true);
    setReplyText('');
    // Adiciona mensagem otimisticamente ao array local
    const optimistic = {
      messageid: `local-${Date.now()}`,
      fromMe: true,
      messageTimestamp: Math.floor(Date.now() / 1000),
      message: { conversation: text },
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      await whatsappApi.sendMessage(selectedInstId, chatId, text);
    } catch (e) {
      console.warn('[Inbox] sendMessage falhou:', e.message);
      // Remove a mensagem otimista em caso de falha
      setMessages(prev => prev.filter(m => m.messageid !== optimistic.messageid));
      setReplyText(text);
    } finally {
      setSendingMsg(false);
    }
  }

  // -- Instância selecionada --
  const selectedInst = instances.find(i => i.id === selectedInstId);

  // -- Nome/phone do chat selecionado --
  const selectedChatName  = selectedChat ? chatName(selectedChat) : null;
  const selectedChatPhone = selectedChat
    ? (selectedChat.wa_chatid || '').replace('@s.whatsapp.net', '').replace('@g.us', '')
    : null;

  return (
    <>
      <style>{STYLES}</style>

      <PageHeader
        title="Inbox"
        sub="Conversas recebidas via WhatsApp · leitura em tempo real"
      />

      <div className="inbox-root">
        {/* ── Coluna esquerda: conversas ── */}
        <div className="inbox-sidebar">
          <div className="inbox-sidebar-head">
            {/* Seletor de instância */}
            {instances.length > 1 && (
              <select
                className="inbox-inst-select"
                value={selectedInstId || ''}
                onChange={e => setSelectedInstId(e.target.value)}
              >
                {instances.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    📱 {inst.name || inst.phone || inst.id}
                    {inst.status === 'connected' ? ' ✓' : ''}
                  </option>
                ))}
              </select>
            )}
            {instances.length === 1 && (
              <div className="inbox-sidebar-title">
                📱 {selectedInst?.name || selectedInst?.phone || 'WhatsApp'}
              </div>
            )}

            {/* Busca */}
            <div className="inbox-search">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--ink-400)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar conversas…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Lista de chats */}
          <div className="inbox-chat-list">
            {/* Banner: instância expirada (free server 1h TTL) */}
            {instanceExpired && !chatsLoading && (
              <div style={{
                margin: '12px 12px 0',
                padding: '10px 12px',
                background: 'rgba(255,106,61,0.1)',
                border: '1px solid rgba(255,106,61,0.3)',
                borderRadius: 8,
                fontSize: 12,
                color: '#FF6A3D',
                lineHeight: 1.4,
              }}>
                ⚠️ <b>Sessão expirada.</b> Vá em <b>Números</b> e reconecte o QR para continuar.
              </div>
            )}

            {chatsLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                <Spinner />
              </div>
            )}

            {!chatsLoading && !instanceExpired && filteredChats.length === 0 && (
              <div className="inbox-sidebar-empty">
                <div style={{ fontSize: 28 }}>💬</div>
                <div>
                  {search
                    ? 'Nenhuma conversa encontrada.'
                    : 'Nenhuma conversa ainda.\nAguardando mensagens…'
                  }
                </div>
                {!search && !selectedInstId && (
                  <div style={{ fontSize: 11, color: 'var(--ink-300)', marginTop: 4 }}>
                    Conecte um número em Números.
                  </div>
                )}
              </div>
            )}

            {!chatsLoading && filteredChats.map(chat => {
              const isActive = selectedChat?.wa_chatid === chat.wa_chatid ||
                               selectedChat?.wa_fastid === chat.wa_fastid;
              return (
                <ChatItem
                  key={chat.wa_chatid || chat.wa_fastid || chat.id}
                  chat={chat}
                  active={isActive}
                  onClick={() => setSelectedChat(chat)}
                />
              );
            })}
          </div>
        </div>

        {/* ── Painel direito: mensagens ── */}
        <div className="inbox-main">
          {!selectedChat ? (
            <div className="inbox-empty">
              <div className="icon">💬</div>
              <div className="label">
                Selecione uma conversa<br />para ver as mensagens
              </div>
            </div>
          ) : (
            <>
              {/* Cabeçalho do chat */}
              <div className="inbox-main-head">
                <div
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--brand-500), #FFB088)',
                    color: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 800, fontSize: 12, flexShrink: 0,
                  }}
                >
                  {initials(selectedChatName)}
                </div>
                <div>
                  <div className="name">{selectedChatName}</div>
                  {selectedChatPhone && <div className="phone">{selectedChatPhone}</div>}
                </div>
              </div>

              {/* Mensagens */}
              <div className="inbox-messages">
                {msgsLoading && (
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
                    <Spinner />
                  </div>
                )}

                {!msgsLoading && messages.length === 0 && (
                  <div className="inbox-empty">
                    <div className="icon" style={{ fontSize: 24 }}>🔇</div>
                    <div className="label">Sem mensagens carregadas</div>
                  </div>
                )}

                {!msgsLoading && messages.map((msg, idx) => (
                  <MessageBubble
                    key={msg.messageid || msg.id || idx}
                    msg={msg}
                  />
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Barra de reply */}
              <div className="inbox-reply-bar">
                <input
                  className="inbox-reply-input"
                  type="text"
                  placeholder="Digite uma mensagem…"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  disabled={sendingMsg}
                />
                <button
                  className="inbox-reply-send-btn"
                  onClick={handleSend}
                  disabled={sendingMsg || !replyText.trim()}
                  title="Enviar mensagem"
                >
                  {sendingMsg ? (
                    <span className="inbox-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
