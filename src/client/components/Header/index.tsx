import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@ui-library';
import { useAuthContext } from '@state/AuthContext';
import { useAuth } from '@hooks/auth/useAuth';

export const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext();
  const { logout } = useAuth();
  
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GitHub CRM
        </Typography>
        
        {isAuthenticated && (
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user?.email}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
