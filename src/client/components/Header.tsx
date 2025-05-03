import { AppBar, Toolbar, Typography } from '@ui-library';
import React from 'react';

export const Header: React.FC = () => {
  return (
    <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant='h6' noWrap>
          universe
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
