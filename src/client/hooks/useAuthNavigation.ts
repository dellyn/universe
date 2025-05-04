import { useNavigate } from 'react-router-dom';
import { useAuth } from '@state/AuthContext';

export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  
  const handleLogin = async (token: string) => {
    await auth.login(token);
    navigate('/', { replace: true });
  };
  
  const handleLogout = async () => {
    await auth.logout();
    navigate('/auth', { replace: true });
  };
  
  return {
    ...auth,
    handleLogin,
    handleLogout
  };
}; 