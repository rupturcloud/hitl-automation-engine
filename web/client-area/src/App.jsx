/**
 * App.jsx — Roteamento principal
 *
 * Layout oficial: V0 LARANJA — AppShellV2 em /v0/*
 * NUNCA usar /v2/* — obsoleto. Toda nova rota vai em /v0/*.
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastProvider as RupturToastProvider } from './ds/index.js';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

// Público
import LoginScreen from './pages/LoginScreen';
import SignUp from './pages/SignUp';
import AcceptAdminInvite from './pages/AcceptAdminInvite';
import AccessDenied from './pages/AccessDenied';
import Health from './pages/Health';

// V0 Layout + Landing
import AppShellV2 from './v2/layout/AppShell.jsx';
import LandingV2 from './v2/pages/Landing.jsx';

// V0 Páginas (lazy)
const DashboardV2    = lazy(() => import('./v2/pages/Dashboard.jsx'));
const NumbersV2      = lazy(() => import('./v2/pages/Numbers.jsx'));
const AdminV2        = lazy(() => import('./v2/pages/Admin.jsx'));
const AquecimentoV2  = lazy(() => import('./v2/pages/Aquecimento.jsx'));
const InboxV2        = lazy(() => import('./v2/pages/Inbox.jsx'));
const IntegrationsV2 = lazy(() => import('./v2/pages/Integrations.jsx'));
const BillingV2      = lazy(() => import('./v2/pages/Billing.jsx'));
const PlaceholderV2  = lazy(() => import('./v2/pages/Placeholder.jsx'));

// Admin plataforma (super admin)
const AdminDashboard      = lazy(() => import('./pages/AdminDashboard.jsx'));
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard.jsx'));

const V0_STUBS = [
  'personas','pricing','leads','pipeline','accounts','campaigns',
  'flows','playbooks','insights','indicacoes','sprints',
  'founder','remarketing','outreach','grupos','canais',
  'rede-coletiva','business','growth',
];

function LoadingScreen() {
  return (
    <div style={{
      minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',
      background:'#0E1116',color:'#9aa3b2',fontFamily:'Inter,sans-serif',fontSize:14,
    }}>Carregando…</div>
  );
}

function RootRedirect() {
  const { session, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return <Navigate to={session ? '/v0/dashboard' : '/v0/landing'} replace />;
}

function App() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister())).catch(() => {});
      return;
    }
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(r => console.log('SW:', r.scope))
      .catch(e => console.error('SW erro:', e));
  }, []);

  return (
    <RupturToastProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/"       element={<RootRedirect />} />
            <Route path="/login"  element={<LoginScreen />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin/accept-invite" element={<AcceptAdminInvite />} />
            <Route path="/403"    element={<AccessDenied />} />
            <Route path="/health" element={<Health />} />

            {/* V0 landing pública */}
            <Route path="/v0/landing" element={<LandingV2 />} />
            <Route path="/v0"         element={<Navigate to="/v0/landing" replace />} />

            {/* V0 app autenticado */}
            <Route element={<ProtectedRoute />}>
              <Route path="/v0" element={<AppShellV2 />}>
                <Route path="dashboard"   element={<DashboardV2 />} />
                <Route path="numbers"     element={<NumbersV2 />} />
                <Route path="admin"       element={<AdminV2 />} />
                <Route path="aquecimento" element={<AquecimentoV2 />} />
                <Route path="inbox"       element={<InboxV2 />} />
                <Route path="integracoes" element={<IntegrationsV2 />} />
                <Route path="billing"     element={<BillingV2 />} />
                {V0_STUBS.map(id => (
                  <Route key={id} path={id} element={<PlaceholderV2 name={id} />} />
                ))}
                <Route path="*" element={<Navigate to="/v0/dashboard" replace />} />
              </Route>
            </Route>

            {/* Admin plataforma */}
            <Route element={<ProtectedRoute requirePlatformAdmin />}>
              <Route path="/admin"            element={<AdminDashboard />} />
              <Route path="/admin/superadmin" element={<SuperAdminDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </RupturToastProvider>
  );
}

export default App;
