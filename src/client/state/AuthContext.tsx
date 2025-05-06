import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRefreshToken } from '@hooks/auth/useRefreshToken';
import { tokenService } from '@services/accessToken';
import { User } from '@data/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  showVerificationDialog: boolean;
  setShowVerificationDialog: (show: boolean) => void;
  emailVerificationError: string;
  isVerifying: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailVerificationError, setEmailVerificationError] = useState('');
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const { refresh } = useRefreshToken();

  
  const initAuth = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting to refresh token...');
      const result = await refresh();
      
      if (result && result.user) {
        setUser(result.user);
        tokenService.setToken(result.accessToken);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        setUser,
        isAuthenticated: !!user && !!tokenService.getToken(),
        isLoading,
        showVerificationDialog,
        setShowVerificationDialog,
      }}
    >
      {children}

    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 