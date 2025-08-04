import React from 'react';
import { AuthPage } from '@/components/auth/AuthPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        <AuthPage />
      ) : (
        <Dashboard />
      )}
    </>
  );
};

export default Index;
