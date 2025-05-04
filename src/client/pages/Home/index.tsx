import { Card, CardHeader, Grid, Typography } from '@ui-library';
import React from 'react';
import { testAlias } from '@shared/testAlias';

export const Home: React.FC = () => {
  

  
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Universe2' />
        <Typography variant="body1" sx={{ p: 2 }}>
          Client alias test: {testAlias()}
        </Typography>
      </Card>
    </Grid>
  );
};
