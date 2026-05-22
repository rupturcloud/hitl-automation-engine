/**
 * App.jsx — Roteamento principal com React Router
 *
 * Domínio: saas.ruptur.cloud
 * Estrutura:
 *   /login       → LoginScreen
 *   /signup      → SignUp (criar conta)
 *   /onboarding  → Wizard 3 passos (pós sign-up)
 *   /dashboard   → Dashboard do cliente
 *   /campanhas   → Gestão de campanhas
 *   /carteira    → Wallet + comprar créditos
 *   /inbox       → Mensagens
 *   /config      → Configurações
 *   /admin       → Painel administrativo (apenas admins)
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginScreen from './pages/LoginScreen';
import SignUp from './pages/SignUp';
import Onboarding from './pages/Onboarding';
import DashboardHome from './pages/DashboardHome';
import Campaigns from './pages/Campaigns';
import Wallet from './pages/Wallet';
import Inbox from './pages/Inbox';
import Instances from './pages/Instances';
import Warmup from './pages/Warmup';
import MessageLibrary from './pages/MessageLibrary';
import ClientLogs from './pages/ClientLogs';
import Reports from './pages/Reports';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AcceptAdminInvite from './pages/AcceptAdminInvite';
import AccessDenied from './pages/AccessDenied';
import Health from './pages/Health';
import './App.css';

import LandingPage from './pages/LandingPage';

// V2 — Ruptur SaaS · WhatsApp Sales OS (handoff portado em paralelo)
import { ToastProvider as RupturToastProvider } from './ds/index.js';
import AppShellV2 from './v2/layout/AppShell.jsx';
import LandingV2 from './v2/pages/Landing.jsx';
import DashboardV2 from './v2/pages/Dashboard.jsx';
import NumbersV2 from './v2/pages/Numbers.jsx';
import AdminV2 from './v2/pages/Admin.jsx';
import AquecimentoV2 from './v2/pages/Aquecimento.jsx';
import PlaceholderV2 from './v2/pages/Placeholder.jsx';

const V2_PENDING = [
  // Operação
  'pipeline', 'inbox', 'campaigns', 'grupos', 'outreach',
  'remarketing', 'canais', 'rede-coletiva',
  // Receita
  'business', 'billing', 'growth', 'indicacoes', 'insights',
  // Sistema
  'webhooks',
  // Misc
  'personas', 'onboarding', 'pricing', 'leads',
  'accounts', 'flows', 'playbooks', 'sprints', 'founder',
];

// /demo -> Standalone Ruptur OS v3.9.1 (full mock do handoff, ex-/v0)
// O HTML auto-contido vive em public/demo/index.html e é servido pelo Vite/web
// como estático. React Router só faz o redirect — fora do SPA.
function RedirectToDemo() {
  useEffect(() => {
    // Apontar direto para o asset estático evita o SPA fallback do Vite/dev
    // reescrever /demo/ -> index.html do React Router.
    window.location.replace('/demo/index.html');
  }, []);
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0E1116', color: '#9aa3b2', fontFamily: 'Inter, sans-serif',
    }}>
      Abrindo Ruptur OS (demo)…
    </div>
  );
}

// /v1/warmup -> Warmup Manager (frontlindona)
// Em produção, Traefik faz proxy de app.ruptur.cloud/warmup/* para o service warmup:4173.
// Em dev, apontamos direto para o warmup runtime local em :8787.
function WarmupRedirect() {
  useEffect(() => {
    const target = import.meta.env.DEV
      ? 'http://localhost:8787/warmup/'
      : '/warmup/';
    window.location.replace(target);
  }, []);
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0E1116', color: '#9aa3b2', fontFamily: 'Inter, sans-serif',
    }}>
      Abrindo Warmup Manager…
    </div>
  );
}

function App() {
  // Service Worker — só em produção. Em dev o cache-first do sw.js sequestra
  // navegações HTML e serve bundle congelado, atrapalhando hot reload e
  // mascarando mudanças de código (rotas, lazy imports, etc.).
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (import.meta.env.DEV) {
      // Em dev: garantir que nenhum SW antigo continue rodando.
      navigator.serviceWorker.getRegistrations()
        .then(regs => regs.forEach(r => r.unregister()))
        .catch(() => {});
      return;
    }
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
      .catch(err => console.error('❌ Erro ao registrar Service Worker:', err));
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Roteamento de versões:
            /v0 = port React do handoff Ruptur OS v3.13, conectado às APIs reais.
                  Só dados padrão do sistema (planos, packages, etc) — sem dados
                  de usuário fake. Em construção (V2_PENDING).
            /v1 = LandingPage original com Supabase (produto antigo).
            /demo = HTML standalone v3.13 totalmente mockado (preview de design). */}
        <Route path="/" element={<Navigate to="/v0" replace />} />
        <Route path="/demo" element={<RedirectToDemo />} />
        <Route path="/v1" element={<LandingPage />} />
        {/* /v1/warmup -> redirect ao Warmup Manager (frontlindona) */}
        <Route path="/v1/warmup" element={<WarmupRedirect />} />
        <Route path="/v1/warmup/*" element={<WarmupRedirect />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/accept-invite" element={<AcceptAdminInvite />} />
        <Route path="/403" element={<AccessDenied />} />
        <Route path="/health" element={<Health />} />

        {/* Rotas autenticadas — Cliente */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/campanhas" element={<Campaigns />} />
            <Route path="/carteira" element={<Wallet />} />
            <Route path="/instancias" element={<Instances />} />
            <Route path="/aquecimento" element={<Warmup />} />
            <Route path="/mensagens" element={<MessageLibrary />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/logs" element={<ClientLogs />} />
            <Route path="/inbox" element={<Inbox />} />
          </Route>
        </Route>

        {/* Rotas autenticadas — Admin operacional da plataforma */}
        <Route element={<ProtectedRoute requirePlatformAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Rotas autenticadas — Superadmin */}
        <Route element={<ProtectedRoute requirePlatformAdmin />}>
          <Route path="/admin/superadmin" element={<SuperAdminDashboard />} />
        </Route>

        {/* /v0 — Ruptur SaaS · WhatsApp Sales OS (port v3.13, sem auth ainda) */}
        <Route
          path="/v0/*"
          element={
            <RupturToastProvider>
              <Routes>
                <Route index element={<Navigate to="landing" replace />} />
                <Route path="landing" element={<LandingV2 />} />
                <Route element={<AppShellV2 />}>
                  <Route path="dashboard" element={<DashboardV2 />} />
                  <Route path="numbers" element={<NumbersV2 />} />
                  <Route path="aquecimento" element={<AquecimentoV2 />} />
                  <Route path="admin" element={<AdminV2 />} />
                  {V2_PENDING.map(id => (
                    <Route key={id} path={id} element={<PlaceholderV2 name={id} />} />
                  ))}
                </Route>
                <Route path="*" element={<Navigate to="landing" replace />} />
              </Routes>
            </RupturToastProvider>
          }
        />

        {/* Fallback: rotas desconhecidas → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
