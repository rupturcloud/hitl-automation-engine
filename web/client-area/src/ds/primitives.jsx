import { useEffect, useRef, useState, useCallback, Fragment } from 'react';
import Icon from './Icon.jsx';
import { ToastContext } from './toast.js';

export { Icon };

export function Button({ variant = 'secondary', size, icon, children, onClick, type = 'button', href, ...rest }) {
  const cls = `btn btn-${variant} ${size ? 'btn-' + size : ''}`;
  if (href) {
    return (
      <a className={cls} href={href} onClick={onClick} {...rest}>
        {icon && <Icon name={icon} size={14} />}
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
}

export function Input({ label, hint, icon, ...rest }) {
  const inner = icon
    ? (<div className="input-search"><Icon name={icon} size={14} /><input className="input" {...rest} /></div>)
    : (<input className="input" {...rest} />);
  if (!label && !hint) return inner;
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {inner}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

export function Select({ label, hint, children, ...rest }) {
  const inner = <select className="select" {...rest}>{children}</select>;
  if (!label && !hint) return inner;
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {inner}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

export function Badge({ tone = 'neutral', dot = true, children }) {
  return (
    <span className={`badge badge-${tone}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

export function Avatar({ name, size, presence, idx = 1 }) {
  const initials = (name || '?').split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();
  const cls = `avatar av-${((idx - 1) % 6) + 1}${size === 'sm' ? ' avatar-sm' : size === 'lg' ? ' avatar-lg' : ''}${presence ? ' presence ' + presence : ''}`;
  return <span className={cls} title={name}>{initials}</span>;
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map(t => {
        const id = t.id || t;
        const label = t.label || t;
        return (
          <button
            key={id}
            className={`tab ${active === id ? 'active' : ''}`}
            onClick={() => onChange(id)}
          >
            {label}
            {t.count != null && <span className="muted" style={{ marginLeft: 6 }}>{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Card({ title, action, children, padding = true, style }) {
  return (
    <div className="card" style={style}>
      {(title || action) && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {action}
        </div>
      )}
      {padding ? <div className="card-body">{children}</div> : children}
    </div>
  );
}

export function EmptyState({ icon = 'sparkles', title, text, action }) {
  return (
    <div className="empty">
      <div className="empty-icon"><Icon name={icon} size={22} /></div>
      <h4 className="empty-title">{title}</h4>
      <p className="empty-text">{text}</p>
      {action}
    </div>
  );
}

export function Modal({ title, onClose, children, footer, width }) {
  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={width ? { width } : null} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ title, onClose, children, footer }) {
  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ background: 'rgba(11,15,20,.35)' }} />
      <div className="drawer">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="modal-body" style={{ flex: 1, overflow: 'auto' }}>{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </>
  );
}

export function ToastProvider({ children }) {
  const [list, setList] = useState([]);
  const push = useCallback((message, tone = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setList(l => [...l, { id, message, tone }]);
    setTimeout(() => setList(l => l.filter(x => x.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="toast-container">
        {list.map(t => (
          <div key={t.id} className={`toast toast-${t.tone}`}>
            <span className="dot" />{t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export function KPI({ label, value, delta, deltaTone, hint, accent }) {
  return (
    <div className="card kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={accent ? { color: accent } : null}>{value}</div>
      {delta && (
        <div className={`kpi-delta ${deltaTone || 'up'}`}>
          <Icon name={deltaTone === 'down' ? 'arrowDown' : 'arrowUp'} size={12} />
          {delta}
        </div>
      )}
      {hint && <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export function Skeleton({ w = '100%', h = 14, style }) {
  return <div className="skeleton" style={{ width: w, height: h, ...style }} />;
}

export function PageHeader({ crumbs, title, sub, actions }) {
  return (
    <div>
      {crumbs && (
        <div className="crumbs">
          {crumbs.map((c, i) => (
            <Fragment key={i}>
              {i > 0 && <span>/</span>}
              <span style={i === crumbs.length - 1 ? { color: 'var(--ink-700)' } : null}>{c}</span>
            </Fragment>
          ))}
        </div>
      )}
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          {sub && <div className="page-sub">{sub}</div>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
      </div>
    </div>
  );
}

export function AIChip({ text, tone = 'brand', onClick, compact }) {
  const tones = {
    brand:  { bg: 'var(--brand-50)', fg: 'var(--brand-600)', dot: 'var(--brand-500)' },
    wa:     { bg: 'var(--wa-50)',    fg: 'var(--wa-600)',    dot: 'var(--wa-500)' },
    info:   { bg: '#EFF6FF',         fg: '#1D4ED8',          dot: '#3B82F6' },
    purple: { bg: '#F5F3FF',         fg: '#6D28D9',          dot: '#8B5CF6' },
  };
  const t = tones[tone] || tones.brand;
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: compact ? '4px 9px' : '5px 11px 5px 8px',
        background: t.bg, color: t.fg,
        borderRadius: 999, fontSize: 11.5, fontWeight: 600, letterSpacing: '-.005em',
        border: '1px solid transparent', cursor: onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span style={{
          width: 14, height: 14, borderRadius: 4, background: t.dot, color: 'white',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700, fontStyle: 'italic', letterSpacing: '-.04em',
        }}>ai</span>
      </span>
      {text}
    </span>
  );
}

export function SocialProofToasts() {
  const messages = [
    { name: 'Marina S.',  action: 'assinou o plano Growth', tone: 'wa' },
    { name: 'Pedro A.',   action: 'completou o onboarding em 4min37', tone: 'brand' },
    { name: 'Camila R.',  action: 'aqueceu mais 1 chip · 0 ban risk', tone: 'wa' },
    { name: 'Diego M.',   action: 'escalou para Scale OS · R$ 1.997/mês', tone: 'purple' },
    { name: 'Letícia A.', action: 'migrou de HubSpot em 12 min', tone: 'brand' },
    { name: 'Carlos B.',  action: 'recebeu R$ 397 em créditos de indicação', tone: 'wa' },
    { name: 'Ruptur OS',  action: 'fechou R$ 4.200 nos últimos 10 minutos', tone: 'brand' },
    { name: 'Ana B.',     action: 'gerou 18 leads qualificados pela IA', tone: 'purple' },
  ];
  const [active, setActive] = useState(null);
  const idxRef = useRef(null);
  useEffect(() => {
    if (idxRef.current == null) {
      idxRef.current = Math.floor(Math.random() * messages.length);
    }
    const tick = () => {
      const i = idxRef.current % messages.length;
      idxRef.current++;
      setActive({ id: Math.random(), ...messages[i] });
    };
    const open = setTimeout(tick, 4500);
    const id = setInterval(tick, 25000);
    return () => { clearInterval(id); clearTimeout(open); };
    // messages é estático dentro do componente — não precisa ser dependência
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(null), 5500);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;
  const tones = {
    wa:     { bg: 'var(--wa-500)',    fg: 'white' },
    brand:  { bg: 'var(--brand-500)', fg: 'white' },
    purple: { bg: '#8B5CF6',          fg: 'white' },
  };
  const t = tones[active.tone] || tones.brand;
  return (
    <div style={{
      position: 'fixed', left: 20, bottom: 20, zIndex: 200,
      background: 'var(--ink-900)', color: 'white', padding: '12px 16px 12px 12px',
      borderRadius: 14, boxShadow: '0 12px 32px rgba(0,0,0,.22)',
      display: 'flex', alignItems: 'center', gap: 12,
      animation: 'sp-in .35s cubic-bezier(.2,.6,.4,1)',
      maxWidth: 360, fontSize: 13, fontWeight: 500,
      border: '1px solid rgba(255,255,255,.08)',
    }}>
      <style>{`@keyframes sp-in { from { transform: translateY(12px); opacity: 0; } } @keyframes sp-pulse { 50% { opacity: .35; } }`}</style>
      <div style={{
        width: 34, height: 34, borderRadius: 10, background: t.bg, color: t.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        fontWeight: 700, fontSize: 12,
      }}>
        {active.name.split(' ').map(s => s[0]).slice(0, 2).join('')}
      </div>
      <div style={{ lineHeight: 1.35 }}>
        <b style={{ color: 'white' }}>{active.name}</b> <span style={{ opacity: .8 }}>{active.action}</span>
        <div style={{ fontSize: 11, opacity: .55, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'sp-pulse 1.4s infinite' }} />
          ao vivo · agora
        </div>
      </div>
    </div>
  );
}
