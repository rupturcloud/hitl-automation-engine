/**
 * CheckoutModal — Formulário de pagamento integrado Getnet
 *
 * Modes:
 *   credits     → compra de pacote de créditos avulso
 *   subscription → assinar plano recorrente
 *   one-time    → venda única (produto/serviço)
 *
 * Fluxo:
 *   1. Usuário preenche formulário de cartão
 *   2. Frontend tokeniza o cartão via /api/billing/tokenize-card
 *   3. Backend processa pagamento via Getnet /v1/payments/credit
 *   4. Resultado exibido (sucesso / erro)
 */
import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// ── Detecção de bandeira ──────────────────────────────────────────────────
function detectBrand(number) {
  const n = number.replace(/\D/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011)/.test(n)) return 'elo';
  if (/^(606282|3841)/.test(n)) return 'hipercard';
  return null;
}

const BRAND_LABELS = {
  visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex',
  elo: 'Elo', hipercard: 'Hipercard',
};

// ── Formatação ────────────────────────────────────────────────────────────
function fmtCardNumber(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function fmtExpiry(v) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
}

// ── Ícones de bandeira simples ────────────────────────────────────────────
function BrandIcon({ brand }) {
  const colors = {
    visa: '#1A1F71', mastercard: '#EB001B', amex: '#016FD0',
    elo: '#FFD700', hipercard: '#CC0000',
  };
  return brand ? (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 36, height: 24, borderRadius: 4, fontSize: 9, fontWeight: 800,
      background: colors[brand] || '#374151', color: 'white', letterSpacing: '.5px',
      textTransform: 'uppercase', flexShrink: 0,
    }}>
      {BRAND_LABELS[brand]}
    </span>
  ) : (
    <span style={{
      width: 36, height: 24, borderRadius: 4, border: '1px dashed #374151',
      display: 'inline-block', flexShrink: 0,
    }} />
  );
}

// ── Estilos base ──────────────────────────────────────────────────────────
const S = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, backdropFilter: 'blur(4px)', padding: 16,
  },
  modal: {
    background: '#111827', borderRadius: 16, width: '100%', maxWidth: 440,
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  body: { padding: '20px 24px' },
  footer: {
    padding: '16px 24px 20px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  label: {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: '#9CA3AF', marginBottom: 6, letterSpacing: '.02em',
  },
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 12px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)', color: 'white',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  },
  row: { display: 'flex', gap: 12, marginBottom: 14 },
  field: { display: 'flex', flexDirection: 'column', marginBottom: 14 },
  btn: {
    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
    fontWeight: 700, fontSize: 15, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnPrimary: { background: '#FF6A3D', color: 'white' },
  btnDisabled: { background: '#374151', color: '#6B7280', cursor: 'not-allowed' },
  error: {
    padding: '10px 14px', borderRadius: 8,
    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#FCA5A5', fontSize: 13, marginBottom: 14,
  },
  success: {
    padding: '20px', textAlign: 'center',
  },
};

// ── Spinner ───────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
    </svg>
  );
}

// ── Componente principal ──────────────────────────────────────────────────
export default function CheckoutModal({
  mode = 'credits',   // 'credits' | 'subscription' | 'one-time'
  packageId,          // para mode=credits
  planId,             // para mode=subscription
  productLabel,       // ex: "1.000 créditos", "Plano Pro"
  productPrice,       // ex: "R$ 49,00"
  onSuccess,
  onClose,
}) {
  const { tenant, user } = useAuth();
  const tenantId = tenant?.id;

  const [form, setForm] = useState({
    cardNumber: '', holderName: '', expiry: '', cvv: '',
    docType: 'CPF', docNumber: '',
  });
  const [brand, setBrand] = useState(null);
  const [step, setStep] = useState('form'); // form | processing | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = useCallback((k, v) => setForm(f => ({ ...f, [k]: v })), []);

  function handleCardNumber(e) {
    const v = fmtCardNumber(e.target.value);
    set('cardNumber', v);
    setBrand(detectBrand(v));
  }

  function handleExpiry(e) {
    set('expiry', fmtExpiry(e.target.value));
  }

  const isFormValid = () => {
    const { cardNumber, holderName, expiry, cvv } = form;
    return cardNumber.replace(/\s/g,'').length >= 13
      && holderName.trim().length >= 2
      && expiry.length === 5
      && cvv.length >= 3;
  };

  async function handlePay() {
    if (!tenantId) return;
    setStep('processing');
    setErrorMsg('');

    try {
      const [expMonth, expYear] = form.expiry.split('/');

      // 1. Tokenizar cartão
      const tokenResult = await apiService.tokenizeCard(tenantId, {
        cardNumber:  form.cardNumber.replace(/\s/g, ''),
        holderName:  form.holderName.trim(),
        expiryMonth: expMonth,
        expiryYear:  expYear,
        cvv:         form.cvv,
      });

      const cardData = {
        numberToken:  tokenResult.numberToken,
        holderName:   form.holderName.trim(),
        securityCode: form.cvv,
        brand:        tokenResult.brand,
        expMonth,
        expYear,
      };

      const customer = {
        firstName:      user?.user_metadata?.full_name?.split(' ')[0] || '',
        lastName:       user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        email:          user?.email || '',
        documentType:   form.docType,
        documentNumber: form.docNumber.replace(/\D/g, ''),
      };

      // 2. Processar pagamento conforme mode
      let result;
      if (mode === 'credits') {
        result = await apiService.createCheckout(tenantId, packageId, cardData, customer);
      } else if (mode === 'subscription') {
        result = await apiService.createSubscription(tenantId, planId, cardData, customer);
      }

      // 3. Verificar resultado
      if (result?.status === 'APPROVED' || result?.status === 'authorized') {
        setStep('success');
        setTimeout(() => onSuccess?.(result), 1800);
      } else if (result?.checkoutUrl || result?.redirect_url) {
        // Fallback: redirect para checkout externo (Cakto etc.)
        window.location.href = result.checkoutUrl || result.redirect_url;
      } else {
        throw new Error(result?.statusDetail || result?.error || 'Pagamento não aprovado');
      }
    } catch (e) {
      setErrorMsg(e.message || 'Erro ao processar pagamento. Tente novamente.');
      setStep('error');
    }
  }

  // Fechar com ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={S.modal}>
        {/* Header */}
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>
                {mode === 'subscription' ? 'Assinar plano' : 'Comprar créditos'}
              </div>
              {productLabel && (
                <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{productLabel}</div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {productPrice && (
                <div style={{ fontSize: 20, fontWeight: 800, color: '#FF6A3D' }}>{productPrice}</div>
              )}
              <button onClick={onClose} style={{
                background: 'transparent', border: 'none', color: '#6B7280',
                cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4,
              }}>×</button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={S.body}>
          {step === 'success' && (
            <div style={S.success}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Pagamento aprovado!</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6 }}>
                {mode === 'subscription' ? 'Sua assinatura está ativa.' : 'Créditos adicionados à sua conta.'}
              </div>
            </div>
          )}

          {step !== 'success' && (
            <>
              {step === 'error' && (
                <div style={S.error}>{errorMsg}</div>
              )}

              {/* Número do cartão */}
              <div style={S.field}>
                <label style={S.label}>Número do cartão</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    style={{ ...S.input, paddingRight: 50 }}
                    placeholder="0000 0000 0000 0000"
                    value={form.cardNumber}
                    onChange={handleCardNumber}
                    inputMode="numeric"
                    disabled={step === 'processing'}
                  />
                  <div style={{ position: 'absolute', right: 10 }}>
                    <BrandIcon brand={brand} />
                  </div>
                </div>
              </div>

              {/* Nome */}
              <div style={S.field}>
                <label style={S.label}>Nome no cartão</label>
                <input
                  style={S.input}
                  placeholder="NOME SOBRENOME"
                  value={form.holderName}
                  onChange={e => set('holderName', e.target.value.toUpperCase())}
                  disabled={step === 'processing'}
                />
              </div>

              {/* Validade + CVV */}
              <div style={S.row}>
                <div style={{ ...S.field, flex: 1, marginBottom: 0 }}>
                  <label style={S.label}>Validade</label>
                  <input
                    style={S.input}
                    placeholder="MM/AA"
                    value={form.expiry}
                    onChange={handleExpiry}
                    inputMode="numeric"
                    disabled={step === 'processing'}
                  />
                </div>
                <div style={{ ...S.field, width: 100, marginBottom: 0 }}>
                  <label style={S.label}>CVV</label>
                  <input
                    style={S.input}
                    placeholder="123"
                    value={form.cvv}
                    onChange={e => set('cvv', e.target.value.replace(/\D/g,'').slice(0,4))}
                    inputMode="numeric"
                    disabled={step === 'processing'}
                  />
                </div>
              </div>

              {/* CPF/CNPJ */}
              <div style={{ ...S.field, marginTop: 14 }}>
                <label style={S.label}>CPF do titular</label>
                <input
                  style={S.input}
                  placeholder="000.000.000-00"
                  value={form.docNumber}
                  onChange={e => set('docNumber', e.target.value.replace(/\D/g,'').slice(0,14))}
                  inputMode="numeric"
                  disabled={step === 'processing'}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {step !== 'success' && (
          <div style={S.footer}>
            <button
              style={{
                ...S.btn,
                ...(step === 'processing' || !isFormValid() ? S.btnDisabled : S.btnPrimary),
              }}
              onClick={handlePay}
              disabled={step === 'processing' || !isFormValid()}
            >
              {step === 'processing' ? (
                <><Spinner /> Processando...</>
              ) : (
                <>🔒 Pagar {productPrice}</>
              )}
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#4B5563' }}>
              Pagamento seguro via Getnet / Santander
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
