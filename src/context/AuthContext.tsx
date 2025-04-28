// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  UserData
} from '../services/auth.service';
import { initializeAuth, getToken } from '../services/auth.service';

interface AuthContextType {
  currentUser: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Set up axios headers with token if available
        initializeAuth();
        
        // Only fetch user data if a token exists
        if (getToken()) {
          const userData = await getCurrentUser();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await apiLogin(email, password);
    if (response.user) {
      setCurrentUser(response.user);
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    const response = await apiRegister(email, password);
    if (response.user) {
      setCurrentUser(response.user);
    }
  };

  const logout = async (): Promise<void> => {
    await apiLogout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.admin ?? false,
    isStaff: currentUser?.staff ?? false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };