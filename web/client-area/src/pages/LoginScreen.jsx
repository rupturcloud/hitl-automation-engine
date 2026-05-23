import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * LoginScreen — Autenticação via Supabase Auth
 *
 * Visual: estética V0 (laranja #FF6A3D sobre #0E1116) — split desktop com
 * formulário branco à esquerda + painel dark à direita; stack vertical mobile.
 * Lógica Supabase preservada 100% (signIn, redirect ?next, mensagens pt-BR).
 */
const LoginScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Informe seu e-mail');
    if (!password) return setError('Informe sua senha');

    setLoading(true);
    try {
      await signIn(email, password);
      const next = searchParams.get('next');
      // D1 (sprint cliente pagante): redirect padrão vai pro dashboard novo /v0/dashboard.
      // Quem precisa do dashboard antigo passa ?next=/dashboard explicitamente.
      navigate(next || '/v0/dashboard');
    } catch (err) {
      if (err.message?.includes('Invalid login')) {
        setError('E-mail ou senha incorretos.');
      } else {
        setError(err.message || 'Erro ao fazer login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rlogin">
      <style>{LOGIN_CSS}</style>

      {/* COLUNA ESQUERDA — FORMULÁRIO */}
      <section className="rlogin-form-side">
        <div className="rlogin-brand">
          <div className="rlogin-brand-mark">R</div>
          <span className="rlogin-brand-name">Ruptur OS</span>
        </div>

        <div className="rlogin-form-wrap">
          <div className="rlogin-eyebrow">
            <span className="rlogin-eyebrow-pill">SAAS</span>
            <span>Sistema operacional de receita</span>
          </div>

          <h1 className="rlogin-h1">
            Bem-vindo de <em>volta.</em>
          </h1>
          <p className="rlogin-sub">
            Entre para retomar suas campanhas, fluxos e pipeline de receita.
          </p>

          <form onSubmit={handleSubmit} className="rlogin-form" autoComplete="on">
            <div className="rlogin-field">
              <label className="rlogin-label" htmlFor="rlogin-email">E-mail</label>
              <div className="rlogin-input-wrap">
                <Mail size={16} className="rlogin-input-icon" />
                <input
                  id="rlogin-email"
                  type="email"
                  className="rlogin-input"
                  placeholder="voce@empresa.com.br"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoFocus
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="rlogin-field">
              <label className="rlogin-label" htmlFor="rlogin-pass">Senha</label>
              <div className="rlogin-input-wrap">
                <Lock size={16} className="rlogin-input-icon" />
                <input
                  id="rlogin-pass"
                  type={showPass ? 'text' : 'password'}
                  className="rlogin-input rlogin-input-pass"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="rlogin-pass-toggle"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rlogin-error" role="alert">
                <span className="rlogin-error-dot" />
                {error}
              </div>
            )}

            <button type="submit" className="rlogin-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="rlogin-spin" />
                  <span>Entrando…</span>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="rlogin-footer">
            Não tem conta? <Link to="/signup">Cadastre-se grátis</Link>
          </p>

          <p className="rlogin-legal">
            Ao entrar você concorda com os{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>Termos</a> e{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>Privacidade</a>.
          </p>
        </div>
      </section>

      {/* COLUNA DIREITA — PAINEL DARK */}
      <aside className="rlogin-aside" aria-hidden="true">
        <div className="rlogin-aside-glow" />
        <div className="rlogin-aside-glow rlogin-aside-glow-2" />

        <div className="rlogin-aside-inner">
          <div className="rlogin-aside-eyebrow">
            <span className="rlogin-aside-pill">RUPTUR OS</span>
            <span>Receita previsível pelo WhatsApp</span>
          </div>

          <h2 className="rlogin-aside-h">
            Conecte. Aqueça. <em>Venda em escala.</em>
          </h2>
          <p className="rlogin-aside-sub">
            Multi-instância com warmup automático, fluxos conversacionais e CRM
            assistido por IA — tudo em um sistema operacional só.
          </p>

          <ul className="rlogin-usps">
            <li>
              <span className="rlogin-usp-ic"><Zap size={16} /></span>
              <div>
                <b>Warmup automático</b>
                <small>Aquece seus chips sem queimar reputação no WhatsApp.</small>
              </div>
            </li>
            <li>
              <span className="rlogin-usp-ic"><TrendingUp size={16} /></span>
              <div>
                <b>Pipeline previsível</b>
                <small>Funil Seeds/Nets/Spears com forecast ponderado.</small>
              </div>
            </li>
            <li>
              <span className="rlogin-usp-ic"><ShieldCheck size={16} /></span>
              <div>
                <b>LGPD compliant</b>
                <small>Dados no Brasil, DPA pronto, auditoria nativa.</small>
              </div>
            </li>
          </ul>

          <div className="rlogin-aside-foot">
            <div className="rlogin-aside-foot-stars">★★★★★</div>
            <div className="rlogin-aside-foot-text">
              <b>4,8/5</b> — 412 operações vendendo melhor
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

const LOGIN_CSS = `
  .rlogin {
    min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
    background: var(--ink-0, #FFFFFF); color: var(--ink-900, #111827);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* ===== LADO ESQUERDO — FORM ===== */
  .rlogin-form-side {
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 32px 48px; min-height: 100vh;
  }
  .rlogin-brand { display: flex; align-items: center; gap: 9px; }
  .rlogin-brand-mark {
    width: 30px; height: 30px; border-radius: 8px;
    background: var(--brand-500, #FF6A3D); color: white;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 14px;
  }
  .rlogin-brand-name { font-weight: 700; font-size: 16px; letter-spacing: -.01em; color: var(--ink-900, #111827); }

  .rlogin-form-wrap {
    width: 100%; max-width: 380px; margin: auto 0;
    padding: 24px 0;
  }
  .rlogin-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 12px 5px 6px;
    background: var(--brand-50, #FFF1EB); color: var(--brand-600, #F0531F);
    border: 1px solid var(--brand-100, #FFE0D2);
    border-radius: 999px; font-size: 12px; font-weight: 550;
    margin-bottom: 20px;
  }
  .rlogin-eyebrow-pill {
    background: var(--brand-500, #FF6A3D); color: white;
    padding: 1px 8px; border-radius: 999px;
    font-size: 10px; font-weight: 700; letter-spacing: .04em;
  }

  .rlogin-h1 {
    font-size: 32px; font-weight: 800; letter-spacing: -.03em;
    line-height: 1.1; margin: 0 0 10px;
  }
  .rlogin-h1 em { font-style: normal; color: var(--brand-500, #FF6A3D); }
  .rlogin-sub {
    font-size: 14.5px; color: var(--ink-600, #4B5563); line-height: 1.55;
    margin: 0 0 28px;
  }

  .rlogin-form { display: flex; flex-direction: column; gap: 14px; }
  .rlogin-field { display: flex; flex-direction: column; gap: 6px; }
  .rlogin-label {
    font-size: 12.5px; font-weight: 600; color: var(--ink-700, #374151);
    letter-spacing: .005em;
  }
  .rlogin-input-wrap { position: relative; display: flex; align-items: center; }
  .rlogin-input-icon {
    position: absolute; left: 12px; color: var(--ink-400, #9CA3AF);
    pointer-events: none;
  }
  .rlogin-input {
    width: 100%; height: 44px;
    padding: 0 14px 0 38px;
    background: var(--ink-0, #FFFFFF);
    border: 1px solid var(--ink-200, #E5E7EB);
    border-radius: 10px;
    color: var(--ink-900, #111827); font-size: 14px;
    outline: none; transition: border-color .15s, box-shadow .15s;
    font-family: inherit;
  }
  .rlogin-input-pass { padding-right: 44px; }
  .rlogin-input:focus {
    border-color: var(--brand-500, #FF6A3D);
    box-shadow: 0 0 0 3px rgba(255, 106, 61, .15);
  }
  .rlogin-input::placeholder { color: var(--ink-400, #9CA3AF); }
  .rlogin-pass-toggle {
    position: absolute; right: 8px;
    width: 32px; height: 32px;
    background: transparent; border: none;
    color: var(--ink-500, #6B7280); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    border-radius: 6px; transition: background .15s;
  }
  .rlogin-pass-toggle:hover { background: var(--ink-100, #F3F4F6); color: var(--ink-700, #374151); }

  .rlogin-error {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px;
    background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: 10px; color: #B91C1C; font-size: 13px; font-weight: 500;
  }
  .rlogin-error-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--danger, #EF4444); flex-shrink: 0;
  }

  .rlogin-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; height: 48px; margin-top: 4px;
    background: var(--brand-500, #FF6A3D);
    background-image: linear-gradient(180deg, #FF7A52 0%, #FF6A3D 60%, #F0531F 100%);
    border: none; border-radius: 10px;
    color: white; font-weight: 600; font-size: 14.5px; letter-spacing: -.005em;
    cursor: pointer;
    box-shadow:
      0 1px 0 rgba(255, 255, 255, .25) inset,
      0 8px 20px -8px rgba(255, 106, 61, .55),
      0 2px 4px rgba(255, 106, 61, .25);
    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
    font-family: inherit;
  }
  .rlogin-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, .25) inset,
      0 12px 24px -8px rgba(255, 106, 61, .65),
      0 4px 8px rgba(255, 106, 61, .3);
  }
  .rlogin-btn:active:not(:disabled) { transform: translateY(0); filter: brightness(.97); }
  .rlogin-btn:disabled { opacity: .7; cursor: not-allowed; }

  .rlogin-spin { animation: rlogin-spin .8s linear infinite; }
  @keyframes rlogin-spin { to { transform: rotate(360deg); } }

  .rlogin-footer {
    text-align: center; margin: 22px 0 0;
    font-size: 13.5px; color: var(--ink-600, #4B5563);
  }
  .rlogin-footer a {
    color: var(--brand-500, #FF6A3D); font-weight: 600;
    text-decoration: none; transition: color .15s;
  }
  .rlogin-footer a:hover { color: var(--brand-600, #F0531F); text-decoration: underline; }

  .rlogin-legal {
    text-align: center; margin: 12px 0 0;
    font-size: 11.5px; color: var(--ink-500, #6B7280); line-height: 1.5;
  }
  .rlogin-legal a {
    color: var(--ink-700, #374151); text-decoration: underline;
    text-decoration-color: var(--ink-300, #D1D5DB);
    text-underline-offset: 2px;
  }
  .rlogin-legal a:hover { color: var(--brand-500, #FF6A3D); }

  /* ===== LADO DIREITO — PAINEL DARK ===== */
  .rlogin-aside {
    position: relative; overflow: hidden;
    background: var(--side-bg, #0E1116);
    color: white;
    display: flex; align-items: center; justify-content: center;
    padding: 48px;
  }
  .rlogin-aside-glow {
    position: absolute; width: 480px; height: 480px;
    border-radius: 50%; filter: blur(120px); pointer-events: none;
    background: radial-gradient(circle, rgba(255, 106, 61, .28), transparent 70%);
    top: -120px; right: -100px;
  }
  .rlogin-aside-glow-2 {
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(139, 92, 246, .18), transparent 70%);
    bottom: -100px; left: -80px; top: auto; right: auto;
  }
  .rlogin-aside-inner {
    position: relative; z-index: 1;
    max-width: 460px; width: 100%;
  }

  .rlogin-aside-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 12px 5px 6px;
    background: rgba(255, 255, 255, .05);
    border: 1px solid rgba(255, 255, 255, .08);
    color: rgba(255, 255, 255, .75);
    border-radius: 999px; font-size: 11.5px; font-weight: 550;
    margin-bottom: 22px;
    backdrop-filter: blur(8px);
  }
  .rlogin-aside-pill {
    background: var(--brand-500, #FF6A3D); color: white;
    padding: 1px 8px; border-radius: 999px;
    font-size: 10px; font-weight: 700; letter-spacing: .04em;
  }

  .rlogin-aside-h {
    font-size: 38px; font-weight: 800; letter-spacing: -.035em;
    line-height: 1.1; margin: 0 0 14px; color: white;
  }
  .rlogin-aside-h em { font-style: normal; color: var(--brand-500, #FF6A3D); }
  .rlogin-aside-sub {
    font-size: 15px; line-height: 1.6;
    color: rgba(255, 255, 255, .68);
    margin: 0 0 32px; max-width: 420px;
  }

  .rlogin-usps {
    list-style: none; padding: 0; margin: 0 0 32px;
    display: flex; flex-direction: column; gap: 14px;
  }
  .rlogin-usps li {
    display: flex; align-items: flex-start; gap: 12px;
  }
  .rlogin-usp-ic {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(255, 106, 61, .14);
    color: var(--brand-500, #FF6A3D);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(255, 106, 61, .25);
  }
  .rlogin-usps b {
    display: block; font-size: 14px; font-weight: 600;
    color: white; margin: 2px 0 2px;
  }
  .rlogin-usps small {
    font-size: 12.5px; color: rgba(255, 255, 255, .55);
    line-height: 1.45;
  }

  .rlogin-aside-foot {
    display: flex; align-items: center; gap: 12px;
    padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, .08);
  }
  .rlogin-aside-foot-stars {
    color: var(--brand-500, #FF6A3D); letter-spacing: 1px; font-size: 14px;
  }
  .rlogin-aside-foot-text {
    font-size: 12.5px; color: rgba(255, 255, 255, .65);
  }
  .rlogin-aside-foot-text b { color: white; font-weight: 700; }

  /* ===== RESPONSIVO ===== */
  @media (max-width: 960px) {
    .rlogin { grid-template-columns: 1fr; }
    .rlogin-form-side { min-height: auto; padding: 28px 28px 40px; }
    .rlogin-form-wrap { margin: 32px auto; }
    .rlogin-aside {
      padding: 40px 28px;
      border-top: 1px solid rgba(255, 255, 255, .06);
    }
    .rlogin-aside-h { font-size: 28px; }
    .rlogin-aside-sub { font-size: 14px; }
  }

  @media (max-width: 480px) {
    .rlogin-form-side { padding: 24px 20px 32px; }
    .rlogin-h1 { font-size: 26px; }
    .rlogin-sub { font-size: 13.5px; }
    .rlogin-aside { padding: 32px 20px; }
    .rlogin-aside-h { font-size: 24px; }
  }
`;

export default LoginScreen;
