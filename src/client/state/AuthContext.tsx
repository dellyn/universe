import { AxiosInstance } from 'axios';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRefreshToken } from '@hooks/useRefreshToken';
import { useAxiosClient } from '@hooks/useAxiosClient';
import { tokenService } from '../services/tokenService';

interface User {
  id: string;
  email: string;
  createdAt: number;
  updatedAt: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  api: AxiosInstance;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the axios instance with interceptors
  const api = useAxiosClient();
  
  // Setup refresh token hook
  const { refresh } = useRefreshToken();
  
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      tokenService.clearToken();
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (accessToken: string) => {
    tokenService.setToken(accessToken);
    await fetchUserProfile();
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.clearToken();
      setUser(null);
      setIsLoading(false);
    }
  };
  
  // Attempt to refresh the token on page load
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // Try to refresh the token using the HTTP-only cookie
        console.log('Attempting to refresh token...');
        const newToken = await refresh();
        
        if (newToken) {
          console.log('Token refreshed successfully, fetching user profile...');
          // Token refreshed successfully, fetch user profile
          await fetchUserProfile();
        } else {
          console.log('No token received from refresh');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user && !!tokenService.getToken(),
        isLoading,
        login,
        logout,
        api
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 