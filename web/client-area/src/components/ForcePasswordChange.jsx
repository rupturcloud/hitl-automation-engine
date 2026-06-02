/**
 * ForcePasswordChange — Modal obrigatório de troca de senha no primeiro acesso
 *
 * Aparece quando o usuário ainda usa a senha temporária (Ruptur@2026!).
 * Detectado via user_metadata.must_change_password = true (definido na criação).
 * Após trocar, atualiza metadata e some para sempre.
 */
import { useState } from 'react';
import { supabase } from '../services/supabase.js';

const MIN_LENGTH = 8;

function strength(pwd) {
  let s = 0;
  if (pwd.length >= 8)  s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s; // 0-5
}

const STRENGTH_LABEL = ['', 'Fraca', 'Razoável', 'Boa', 'Forte', 'Muito forte'];
const STRENGTH_COLOR = ['', '#EF4444', '#F59E0B', '#3B82F6', '#22C55E', '#10B981'];

export default function ForcePasswordChange({ onDone }) {
  const [pwd, setPwd]         = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const s = strength(pwd);
  const match = pwd === confirm;
  const valid = pwd.length >= MIN_LENGTH && match && s >= 2;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError('');

    try {
      // 1. Atualizar senha
      const { error: pwdErr } = await supabase.auth.updateUser({ password: pwd });
      if (pwdErr) throw pwdErr;

      // 2. Limpar flag must_change_password
      const { error: metaErr } = await supabase.auth.updateUser({
        data: { must_change_password: false, password_changed_at: new Date().toISOString() },
      });
      if (metaErr) throw metaErr;

      onDone?.();
    } catch (err) {
      setError(err.message || 'Erro ao trocar senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>🔑</div>
          <div>
            <h2 style={styles.title}>Crie sua senha definitiva</h2>
            <p style={styles.sub}>
              Você está usando uma senha temporária. Defina a sua agora para continuar.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Nova senha */}
          <div style={styles.field}>
            <label style={styles.label}>Nova senha</label>
            <input
              type="password"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setError(''); }}
              placeholder="Mínimo 8 caracteres"
              style={styles.input}
              autoFocus
              autoComplete="new-password"
            />
            {pwd.length > 0 && (
              <div style={styles.strengthRow}>
                <div style={styles.strengthBar}>
                  {[1,2,3,4,5].map(i => (
                    <div
                      key={i}
                      style={{
                        ...styles.strengthSegment,
                        background: i <= s ? STRENGTH_COLOR[s] : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </div>
                <span style={{ ...styles.strengthText, color: STRENGTH_COLOR[s] }}>
                  {STRENGTH_LABEL[s]}
                </span>
              </div>
            )}
          </div>

          {/* Confirmar */}
          <div style={styles.field}>
            <label style={styles.label}>Confirmar senha</label>
            <input
              type="password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setError(''); }}
              placeholder="Repita a senha"
              style={{
                ...styles.input,
                borderColor: confirm.length > 0
                  ? match ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'
                  : 'rgba(255,255,255,0.1)',
              }}
              autoComplete="new-password"
            />
            {confirm.length > 0 && !match && (
              <span style={styles.noMatch}>As senhas não coincidem</span>
            )}
          </div>

          {/* Requisitos */}
          <div style={styles.reqs}>
            <Req ok={pwd.length >= 8}  label="Mínimo 8 caracteres" />
            <Req ok={s >= 2}            label="Força razoável ou maior" />
            <Req ok={match && confirm.length > 0} label="Senhas iguais" />
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button
            type="submit"
            disabled={!valid || loading}
            style={{ ...styles.btn, opacity: (!valid || loading) ? 0.5 : 1 }}
          >
            {loading ? 'Salvando…' : 'Definir senha e entrar'}
          </button>
        </form>

        <p style={styles.footer}>
          Você só verá isso uma vez. Após definir a senha, o acesso é liberado normalmente.
        </p>
      </div>
    </div>
  );
}

function Req({ ok, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: ok ? '#22C55E' : '#6B7280' }}>
      <span>{ok ? '✓' : '○'}</span>
      <span>{label}</span>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(6px)',
    padding: '20px',
  },
  card: {
    background: '#111827',
    border: '1px solid rgba(255,106,61,0.25)',
    borderRadius: 16,
    padding: '32px 28px',
    maxWidth: 420,
    width: '100%',
    boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
  },
  header: {
    display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24,
  },
  iconWrap: {
    fontSize: 32, flexShrink: 0, marginTop: 2,
  },
  title: {
    color: 'white', fontSize: 18, fontWeight: 700,
    margin: '0 0 4px', letterSpacing: '-0.01em',
  },
  sub: {
    color: '#9CA3AF', fontSize: 13, lineHeight: 1.5, margin: 0,
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  field: {
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  label: {
    fontSize: 12, fontWeight: 600, color: '#D1D5DB', letterSpacing: '0.02em',
  },
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white', fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  strengthRow: {
    display: 'flex', alignItems: 'center', gap: 8, marginTop: 4,
  },
  strengthBar: {
    display: 'flex', gap: 3, flex: 1,
  },
  strengthSegment: {
    flex: 1, height: 4, borderRadius: 2,
    transition: 'background 0.2s',
  },
  strengthText: {
    fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
  },
  noMatch: {
    fontSize: 11, color: '#EF4444',
  },
  reqs: {
    display: 'flex', flexDirection: 'column', gap: 4,
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  errorBox: {
    padding: '10px 12px', borderRadius: 8,
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    color: '#FCA5A5', fontSize: 13,
  },
  btn: {
    padding: '12px',
    borderRadius: 10,
    background: '#FF6A3D',
    color: 'white',
    border: 'none',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  footer: {
    marginTop: 16,
    fontSize: 11, color: '#4B5563',
    textAlign: 'center', lineHeight: 1.5,
  },
};
