import { Card, CardHeader, Grid, Typography } from '@ui-library';
import React, { useEffect, useState } from 'react';
import { testAlias } from '@shared/testAlias';

export const Home: React.FC = () => {
  const [serverAliasTest, setServerAliasTest] = useState<string | null>(null);
  
  useEffect(() => {
    testAlias();
    fetch('/api/test-alias')
      .then(response => response.json())
      .then(data => setServerAliasTest(data.message))
      .catch(error => console.error('Error testing server alias:', error));
  }, []);
  
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='universe' />
        <Typography variant="body1" sx={{ p: 2 }}>
          Client alias test: {testAlias()}
        </Typography>
        {serverAliasTest && (
          <Typography variant="body1" sx={{ p: 2 }}>
            Server alias test: {serverAliasTest}
          </Typography>
        )}
      </Card>
    </Grid>
  );
};
