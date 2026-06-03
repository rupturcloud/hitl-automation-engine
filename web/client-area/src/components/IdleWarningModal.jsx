/**
 * IdleWarningModal — aviso de sessão prestes a expirar
 * Aparece 2 min antes do logout automático.
 */
import { useState, useEffect } from 'react';

export default function IdleWarningModal({ secondsLeft, onStay, onLeave }) {
  const [count, setCount] = useState(secondsLeft);

  useEffect(() => {
    setCount(secondsLeft);
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const minutes = Math.floor(count / 60);
  const secs    = count % 60;
  const display = minutes > 0
    ? `${minutes}:${String(secs).padStart(2, '0')}`
    : `${secs}s`;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.icon}>⏱</div>
        <h2 style={styles.title}>Sessão prestes a expirar</h2>
        <p style={styles.body}>
          Por segurança, você será desconectado automaticamente em caso de inatividade.
        </p>
        <div style={styles.counter}>{display}</div>
        <div style={styles.actions}>
          <button style={styles.btnStay} onClick={onStay}>
            Continuar conectado
          </button>
          <button style={styles.btnLeave} onClick={onLeave}>
            Sair agora
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.72)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#111827',
    border: '1px solid rgba(255,106,61,0.3)',
    borderRadius: '16px',
    padding: '36px 32px',
    maxWidth: '380px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },
  icon: {
    fontSize: '40px', marginBottom: '12px',
  },
  title: {
    color: 'white', fontSize: '18px', fontWeight: 700,
    margin: '0 0 10px', letterSpacing: '-0.01em',
  },
  body: {
    color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6,
    margin: '0 0 20px',
  },
  counter: {
    fontSize: '40px', fontWeight: 800,
    fontFamily: 'JetBrains Mono, monospace',
    color: '#FF6A3D',
    margin: '0 0 24px',
    letterSpacing: '-0.02em',
  },
  actions: {
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  btnStay: {
    padding: '12px', borderRadius: '10px',
    background: '#FF6A3D', color: 'white',
    border: 'none', fontWeight: 700, fontSize: '14px',
    cursor: 'pointer',
  },
  btnLeave: {
    padding: '12px', borderRadius: '10px',
    background: 'transparent', color: '#6B7280',
    border: '1px solid rgba(255,255,255,0.1)',
    fontWeight: 600, fontSize: '14px',
    cursor: 'pointer',
  },
};
