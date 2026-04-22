import { useState } from 'react';
import { BancaView } from './modules/banca/BancaView';
import { RoboView } from './modules/robo/RoboView';
import { WalletView } from './modules/wallet/WalletView';
import { ProfileView } from './modules/profile/ProfileView';
import { AviatorView } from './modules/aviator/AviatorView';
import { HomeView } from './modules/home/HomeView';
import { DashboardLayout } from './components/DashboardLayout';
import { WalletProvider } from './modules/wallet/WalletContext';
import { AuthProvider, useAuth } from './modules/auth/AuthContext';
import { LoginView } from './modules/auth/LoginView';
import { BacBoSpecialistView } from './modules/robo/BacBoSpecialistView';

function AppContent() {
  const [activeView, setActiveView] = useState('home');
  const { isAuthenticated } = useAuth();
  
  // Detecta se estamos rodando como uma extensão Side Panel
  const isExtensionContext = typeof chrome !== 'undefined' && (chrome.sidePanel || chrome.runtime?.id);
  const urlParams = new URLSearchParams(window.location.search);
  const forceRobo = urlParams.get('mode') === 'robo';

  if (!isAuthenticated) {
    return <LoginView />;
  }

  if (isExtensionContext || forceRobo) {
    const roboType = urlParams.get('type') || 'generic';
    return (
      <WalletProvider>
        {roboType === 'bacbo' ? <BacBoSpecialistView /> : <RoboView />}
      </WalletProvider>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'home': return <HomeView onViewChange={setActiveView} />;
      case 'bacbo': return <BancaView />;
      case 'aviator': return <AviatorView />;
      case 'wallet': return <WalletView />;
      case 'profile': return <ProfileView />;
      default: return <HomeView onViewChange={setActiveView} />;
    }
  };

  return (
    <WalletProvider>
      <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
        {renderView()}
      </DashboardLayout>
    </WalletProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
