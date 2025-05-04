import React from 'react';
import { Box, CssBaseline, Toolbar, CircularProgress } from '@ui-library';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Header } from '@components/Header';
import { AuthProvider, useAuth } from '@state/AuthContext';
import { AuthPage } from '@components/auth/AuthPage';
import { Home } from '@pages/Home';

const ProtectedRoute: React.FC<{element: React.ReactNode}> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated ? <>{element}</> : <Navigate to="/auth" replace />;
};

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <>
      <Header />
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </>
  );
};

// App content component
const AppContent: React.FC = () => {
  const location = useLocation();
  const { isLoading } = useAuth();
  
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
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/" 
          element={
          <Layout>
            <ProtectedRoute element={<Home />} />
          </Layout>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};
