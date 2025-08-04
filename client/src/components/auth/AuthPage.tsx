import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-secondary" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ReportAI
              </span>
            </div>
            <p className="text-muted-foreground">
              AI-powered report analysis and insights
            </p>
          </div>

          {/* Auth Forms */}
          {isLogin ? (
            <LoginForm
              onToggleForm={() => setIsLogin(false)}
            />
          ) : (
            <SignupForm
              onToggleForm={() => setIsLogin(true)}
            />
          )}

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-muted-foreground">
            <p>© 2024 ReportAI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};