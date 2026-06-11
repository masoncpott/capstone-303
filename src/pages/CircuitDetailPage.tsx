import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';

export function CircuitDetailPage() {
  const { circuitId } = useParams();

  return (
    <PageContainer>
      <Typography variant="h5" fontWeight={800}>
        Circuit Detail
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Placeholder circuit
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {circuitId ?? 'unknown-circuit'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detail controls, charts, schedule editor, and circuit insights will be added here.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </PageContainer>
  );
}