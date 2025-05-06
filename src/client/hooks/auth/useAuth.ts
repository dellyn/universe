import { useState } from 'react';
import { getErrorMessage } from '@api/getErrorMessage';
import { useHttpClient } from '@hooks/api/useHttpClient';
import { Routes } from '@interfaces';
import { useAuthContext } from '@state/AuthContext';
import { tokenService } from '@services/accessToken';
import { ApiEndpoints } from '@data/apiInterface';
import { useNavigate } from 'react-router';

/**
 * Hook for handling authentication operations
 */
export const useAuth = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { privateHttpClient } = useHttpClient();
  const { setUser, isAuthenticated, setShowVerificationDialog } = useAuthContext();
  const [emailVerificationError, setEmailVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const register = async (email: string, password: string) => {
    setError('');
    setIsLoading(true);
    
    try {
      const response = await privateHttpClient.post(ApiEndpoints.Register, {
        email,
        password
      });
      
      tokenService.setToken(response.data.accessToken);
      setUser(response.data.user);
      setShowVerificationDialog(true);
      return response.data;
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setError('');
    setIsLoading(true);
    
    try {
      const response = await privateHttpClient.post(ApiEndpoints.Login, {
        email,
        password
      });
      console.log('response', response);
      if (response.data.user) {
        tokenService.setToken(response.data.accessToken);
        setUser(response.data.user);
      }
      return response.data;
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await privateHttpClient.post(ApiEndpoints.Logout);

    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.clearToken();
      setUser(null);
      setIsLoading(false);
    }
  };

  const verifyEmailCode = async (code: string) => {
    setEmailVerificationError('');
    setIsVerifying(true);
    try {
      const response = await privateHttpClient.post(ApiEndpoints.VerifyEmailCode, { code });
      console.log(response.data);
      setShowVerificationDialog(false);
      setUser(response.data.user);
      return response.data;
    } catch (err: any) {
      setEmailVerificationError(getErrorMessage(err));
      throw err;
    } finally {
      setIsVerifying(false);
    }
  };
  
  const resendVerification = async () => {
    setEmailVerificationError('');
    setIsVerifying(true);
    try {
      const response = await privateHttpClient.post(ApiEndpoints.ResendVerification);
      return response.data;
    } catch (err: any) {
      setEmailVerificationError(getErrorMessage(err));
      throw err;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    register,
    login,
    logout,
    verifyEmailCode,
    resendVerification,
    error,
    isVerifying,
    emailVerificationError,
    isLoading,
    isAuthenticated,
    clearError: () => setError('')
  };
}; 