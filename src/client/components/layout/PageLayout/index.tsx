import React from 'react';
import { Header } from '@components/Header';
import { Toolbar, Container } from '@ui-library';

export const PageLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
      <>
        <Header />
        <main>
          <Toolbar />
          <Container>
            {children}
          </Container>
        </main>
      </>
    );
  };
  