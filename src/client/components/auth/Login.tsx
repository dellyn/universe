import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@ui-library';

interface LoginProps {
  onLogin: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      onLogin(data.token);
    } catch (err: any) {
      setError(err.message);
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
        />
        
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        
        <Button 
          fullWidth 
          type="submit" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
}; 