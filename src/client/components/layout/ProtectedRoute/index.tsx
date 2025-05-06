import React, { useState } from 'react';
import { Box, CircularProgress } from '@ui-library';
import { useAuthContext } from '@state/AuthContext';
import { Navigate } from 'react-router-dom';
import { Routes } from '@interfaces';
import { useAuth } from '@hooks/auth/useAuth';
import { VerificationDialog } from '@components/auth/VerificationDialog';
export const ProtectedRoute: React.FC<{element: React.ReactNode}> = ({ element }) => {
    const { isAuthenticated, isLoading, user,showVerificationDialog,  setShowVerificationDialog  } = useAuthContext();
    
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      );
    }
    
    // Not authenticated at all
    if (!isAuthenticated && !isLoading) {
      return <Navigate to={Routes.Login}  />;
    }
    
    // Authenticated but email not verified
    if (user && !user.isEmailVerified) {
      return (
        <>
          <VerificationDialog
            open={showVerificationDialog}
            onClose={() => setShowVerificationDialog(false)}
          />
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            minHeight="60vh"
            p={3}
          >
            <Box 
              p={3} 
              textAlign="center" 
              maxWidth={600} 
              bgcolor="background.paper" 
              borderRadius={1}
              boxShadow={3}
            >
              <h2>Email Verification Required</h2>
              <p>You need to verify your email address before accessing this page.</p>
              <button 
                onClick={() => setShowVerificationDialog(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginTop: '16px'
                }}
              >
                Verify Email Now
              </button>
            </Box>
          </Box>

       
        </>
      );
    }
    
    // Authenticated and email verified
    return <>{element}</>;
};