import { Stack, Typography } from '@mui/material';
import { PageContainer } from '../components/layout/PageContainer';
import { CircuitGrid } from '../components/home/CircuitGrid';
import mockData from '../data/mockData.json';

type Circuit = {
  id: string;
  name: string;
  status: string;
  currentWatts: number;
};

export function CircuitsPage() {
  const circuits = mockData.circuits as Circuit[];

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        All Circuits
      </Typography>
      <Stack spacing={2}>
        <CircuitGrid circuits={circuits} />
      </Stack>
    </PageContainer>
  );
}
