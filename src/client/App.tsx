import { Box, CssBaseline, Toolbar, CircularProgress } from '@ui-library';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Header } from '@components/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from '@components/auth/AuthPage';
import { Home } from '@pages/Home';

const ProtectedRoute: React.FC<{element: React.ReactNode}> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  console.log('isAuthenticated', isAuthenticated);
  if (isLoading) {
    return <CircularProgress />;
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
  const { isLoading, login } = useAuth();
  const location = useLocation();
  console.log('location', location);
  if (isLoading) {
    return (
      <Box >
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <CssBaseline />
      <Routes location={location}>
        <Route path="/auth" element={<AuthPage onAuthenticated={login} />} />
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
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};
