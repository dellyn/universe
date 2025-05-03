import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@ui-library';

interface RegisterProps {
  onRegister: (token: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      localStorage.setItem('token', data.token);
      onRegister(data.token);
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  return (
    <Box component={Paper} p={2} maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Register</Typography>
      
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
        
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          required
        />
        
        <Button 
          fullWidth 
          type="submit" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
}; 