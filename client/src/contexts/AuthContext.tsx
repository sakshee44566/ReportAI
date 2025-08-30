import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User, AuthResponse } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Validate existing token by fetching profile
    const token = localStorage.getItem('authToken');
    (async () => {
      if (token) {
        try {
          const profile = await apiService.getProfile();
          setUser(profile);
        } catch (err) {
          // Invalid token; clear it
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const resp: AuthResponse = await apiService.login({ email, password });
    // Save real JWT and user
    localStorage.setItem('authToken', resp.token);
    setUser(resp.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const resp: AuthResponse = await apiService.register({ name, email, password });
    localStorage.setItem('authToken', resp.token);
    setUser(resp.user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 