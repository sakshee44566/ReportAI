import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User } from '@/lib/api';

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
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      // Bypass server validation - assume token is valid if it exists
      const mockUser = {
        id: '1',
        name: 'User',
        email: 'user@example.com'
      };
      setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Bypass server authentication - accept any email and password
      const mockUser = {
        id: '1',
        name: email.split('@')[0] || 'User',
        email: email
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('authToken', mockToken);
      setUser(mockUser);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Bypass server authentication - accept any registration
      const mockUser = {
        id: '1',
        name: name,
        email: email
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('authToken', mockToken);
      setUser(mockUser);
    } catch (error) {
      throw error;
    }
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