import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  memberStatus: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('betia_session');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    // Simulação de login premium
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Pegar o perfil salvo no "banco" (localStorage profile) ou usar default
    const savedProfile = localStorage.getItem('betia_user_profile');
    const profile = savedProfile ? JSON.parse(savedProfile) : {
      name: "Diego Ruptur",
      email: "diego@ruptur.cloud",
      password: "password123",
      memberStatus: "Platinum"
    };

    if (email === profile.email && password === profile.password) {
      const sessionUser = { ...profile };
      delete sessionUser.password;
      setUser(sessionUser);
      localStorage.setItem('betia_session', JSON.stringify(sessionUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('betia_session');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const newUser = { ...user, ...data };
      setUser(newUser);
      localStorage.setItem('betia_session', JSON.stringify(newUser));
      
      // Atualiza também o "banco de dados" de perfis
      const savedProfile = localStorage.getItem('betia_user_profile');
      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      localStorage.setItem('betia_user_profile', JSON.stringify({ ...profile, ...data }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
