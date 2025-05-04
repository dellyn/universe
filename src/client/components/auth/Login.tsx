import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@ui-library';
import { useAuthNavigation } from '../../hooks/useAuthNavigation';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('testuser@mail.com');
  const [password, setPassword] = useState('4$^wglhw92uFOvWm');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { api, handleLogin } = useAuthNavigation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await api('/auth/login', {
        method: 'POST',
        data: { email, password }
      });
      
      // Use the accessToken from the response
      await handleLogin(response.data.accessToken);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box component={Paper} p={2} maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Login</Typography>
      
      {error && (
        <Typography color="error" mb={2}>{error}</Typography>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          disabled={isLoading}
        />
        
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          disabled={isLoading}
        />
        
        <Button 
          fullWidth 
          type="submit" 
          variant="contained" 
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Box>
  );
}; 