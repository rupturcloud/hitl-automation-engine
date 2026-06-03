import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import CheckoutModal from '../../components/CheckoutModal';

const PLAN_HIGHLIGHTS = {
  trial:    { color: '#6B7280', badge: 'Grátis 7 dias' },
  starter:  { color: '#3B82F6', badge: 'Mais popular' },
  pro:      { color: '#FF6A3D', badge: 'Recomendado', highlight: true },
  business: { color: '#8B5CF6', badge: 'Empresarial' },
};

function PlanCard({ plan, currentPlanId, onSelect }) {
  const meta = PLAN_HIGHLIGHTS[plan.id] || {};
  const isCurrent = plan.id === currentPlanId;
  const isHighlighted = meta.highlight;

  return (
    <div style={{
      border: `1px solid ${isHighlighted ? 'rgba(255,106,61,0.4)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 12,
      padding: '20px',
      background: isHighlighted ? 'rgba(255,106,61,0.05)' : 'rgba(255,255,255,0.02)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {meta.badge && (
        <div style={{
          position: 'absolute', top: -10, left: 16,
          background: meta.color, color: 'white',
          fontSize: 10, fontWeight: 700, letterSpacing: '.05em',
          padding: '2px 10px', borderRadius: 999,
        }}>
          {meta.badge}
        </div>
      )}

      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{plan.name}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: meta.color || 'white', marginTop: 6 }}>
          {plan.price_cents === 0 ? 'Grátis' : `R$ ${(plan.price_cents / 100).toFixed(2).replace('.', ',')}`}
          {plan.price_cents > 0 && (
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 400, marginLeft: 4 }}>/mês</span>
          )}
        </div>
      </div>

      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {(plan.features || []).slice(0, 5).map((f, i) => (
          <li key={i} style={{ fontSize: 12, color: '#9CA3AF', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <span style={{ color: meta.color || '#FF6A3D', marginTop: 1, flexShrink: 0 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => !isCurrent && onSelect(plan)}
        style={{
          marginTop: 'auto', padding: '10px', borderRadius: 8,
          border: isCurrent ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${meta.color || '#FF6A3D'}`,
          background: isCurrent ? 'transparent' : (isHighlighted ? '#FF6A3D' : 'transparent'),
          color: isCurrent ? '#6B7280' : (isHighlighted ? 'white' : (meta.color || '#FF6A3D')),
          fontWeight: 700, fontSize: 13, cursor: isCurrent ? 'default' : 'pointer',
        }}
      >
        {isCurrent ? 'Plano atual' : plan.price_cents === 0 ? 'Começar grátis' : 'Assinar'}
      </button>
    </div>
  );
}

function PackageCard({ pkg, onBuy }) {
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
      padding: '16px 18px', background: 'rgba(255,255,255,0.02)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>
          {(pkg.credits || 0).toLocaleString('pt-BR')}
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 400, marginLeft: 4 }}>créditos</span>
        </div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
          R$ {((pkg.price_cents || 0) / pkg.credits).toFixed(4).replace('.', ',')} / crédito
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#FF6A3D' }}>
          R$ {((pkg.price_cents || 0) / 100).toFixed(2).replace('.', ',')}
        </div>
        <button
          onClick={() => onBuy(pkg)}
          style={{
            marginTop: 6, padding: '6px 14px', borderRadius: 8,
            border: '1px solid #FF6A3D', background: 'rgba(255,106,61,0.1)',
            color: '#FF6A3D', fontWeight: 700, fontSize: 12, cursor: 'pointer',
          }}
        >
          Comprar
        </button>
      </div>
    </div>
  );
}

export default function Billing() {
  const { tenant } = useAuth();
  const [plans, setPlans] = useState([]);
  const [packages, setPackages] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode, packageId?, planId?, label, price }
  const [activeTab, setActiveTab] = useState('planos');

  useEffect(() => {
    async function load() {
      try {
        const [p, pkgs] = await Promise.all([
          apiService.getPlans(),
          apiService.getPackages(),
        ]);
        setPlans(p || []);
        setPackages(pkgs?.packages || []);

        if (tenant?.id) {
          try {
            const sub = await apiService.authFetch('/api/billing/subscription');
            setSubscription(sub?.subscription);
          } catch { /* sem assinatura */ }
        }
      } catch (e) {
        console.error('[Billing] Erro ao carregar:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tenant?.id]);

  function handleSelectPlan(plan) {
    if (plan.price_cents === 0) {
      apiService.createSubscription(tenant.id, plan.id).then(() => window.location.reload());
      return;
    }
    setModal({
      mode: 'subscription',
      planId: plan.id,
      label: `Plano ${plan.name}`,
      price: `R$ ${(plan.price_cents / 100).toFixed(2).replace('.', ',')}`,
    });
  }

  function handleBuyPackage(pkg) {
    setModal({
      mode: 'credits',
      packageId: pkg.id,
      label: `${(pkg.credits).toLocaleString('pt-BR')} créditos`,
      price: `R$ ${(pkg.price_cents / 100).toFixed(2).replace('.', ',')}`,
    });
  }

  return (
    <div style={{ padding: '24px 28px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>Receita</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
          Planos de assinatura e créditos para campanhas
        </p>
      </div>

      {/* Assinatura atual */}
      {subscription && (
        <div style={{
          padding: '14px 18px', borderRadius: 10, marginBottom: 24,
          background: 'rgba(255,106,61,0.08)', border: '1px solid rgba(255,106,61,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#FF8C69', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase' }}>
              Plano atual
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginTop: 2 }}>
              {subscription.plan_id} · {subscription.status}
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>
            Renova em {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
        {[['planos', 'Planos'], ['creditos', 'Créditos avulsos']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: '8px 16px', border: 'none', borderRadius: '8px 8px 0 0',
            background: activeTab === id ? 'rgba(255,106,61,0.1)' : 'transparent',
            color: activeTab === id ? '#FF6A3D' : '#6B7280',
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
            borderBottom: activeTab === id ? '2px solid #FF6A3D' : '2px solid transparent',
          }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>Carregando...</div>
      ) : activeTab === 'planos' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlanId={subscription?.plan_id}
              onSelect={handleSelectPlan}
            />
          ))}
          {plans.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6B7280', padding: 40 }}>
              Planos não disponíveis no momento.
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
          {Object.entries(packages).map(([id, pkg]) => (
            <PackageCard key={id} pkg={{ id, ...pkg }} onBuy={handleBuyPackage} />
          ))}
          {Object.keys(packages).length === 0 && (
            <div style={{ textAlign: 'center', color: '#6B7280', padding: 40 }}>
              Pacotes não disponíveis no momento.
            </div>
          )}
        </div>
      )}

      {/* Modal de checkout */}
      {modal && (
        <CheckoutModal
          mode={modal.mode}
          packageId={modal.packageId}
          planId={modal.planId}
          productLabel={modal.label}
          productPrice={modal.price}
          onSuccess={() => { setModal(null); window.location.reload(); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
