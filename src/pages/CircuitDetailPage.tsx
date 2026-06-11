import { Alert, Card, CardContent, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import mockData from '../data/mockData.json';

type Circuit = {
  id: string;
  name: string;
  category: string;
  status: string;
  currentWatts: number;
  voltage: number;
  room: string;
  schedulingEnabled: boolean;
};

export function CircuitDetailPage() {
  const { circuitId } = useParams();
  const circuitsMap = mockData.circuits.reduce((acc, circuit) => {
    acc[circuit.id] = circuit as Circuit;
    return acc;
  }, {} as Record<string, Circuit>);
  const circuit = circuitId ? circuitsMap[circuitId] : null;

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        Circuit Detail
      </Typography>

      {!circuit ? (
        <Alert severity="warning">Circuit not found for ID: {circuitId}</Alert>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">{circuit.name}</Typography>
              <Typography variant="body2">Status: {circuit.status}</Typography>
              <Typography variant="body2">Power Draw: {circuit.currentWatts} watts</Typography>
              <Typography variant="body2">Room: {circuit.room}</Typography>
              <Typography variant="body2">Category: {circuit.category}</Typography>
              <Typography variant="body2">Voltage: {circuit.voltage}V</Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}