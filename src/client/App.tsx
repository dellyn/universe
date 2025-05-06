import React from 'react';
import { Box, CssBaseline, CircularProgress } from '@ui-library';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuthContext } from '@state/AuthContext';
import { Home } from '@pages/Home';
import { QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from '@components/layout/ProtectedRoute';
import { PageLayout } from '@components/layout/PageLayout';
import { AuthPage } from '@pages/AuthPage';
import { queryClient } from './services/queryClient';
import { Routes as AppRoutes} from '@interfaces';

const AppContent: React.FC = () => {
  const location = useLocation();
  const { isLoading } = useAuthContext();
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <CssBaseline />
      <Routes location={location}>
        <Route path={AppRoutes.Login} element={<AuthPage />} />
        <Route path={AppRoutes.Register} element={<AuthPage />} />
        <Route 
          path={AppRoutes.Home} 
          element={
          <PageLayout>
            <ProtectedRoute element={<Home />} />
          </PageLayout>}
        />
        <Route path="*" element={<Navigate to={AppRoutes.Home} replace />} />
      </Routes>
    </Box>
  );
};

export const App: React.FC = () => {
  return (
      <AuthProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AppContent />
          </QueryClientProvider>
        </BrowserRouter>
    </AuthProvider>
  );
};
