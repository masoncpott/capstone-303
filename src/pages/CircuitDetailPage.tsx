import { Alert, Card, CardContent, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';

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

const HARDCODED_CIRCUITS: Record<string, Circuit> = {
  '1': {
    id: '1',
    name: 'EV Charger',
    category: 'EV Charger',
    status: 'on',
    currentWatts: 5500,
    voltage: 240,
    room: 'Garage',
    schedulingEnabled: true,
  },
  '2': {
    id: '2',
    name: 'HVAC',
    category: 'HVAC',
    status: 'on',
    currentWatts: 3200,
    voltage: 240,
    room: 'Utility Closet',
    schedulingEnabled: false,
  },
  '10': {
    id: '10',
    name: 'Refrigerator',
    category: 'Refrigerator',
    status: 'on',
    currentWatts: 600,
    voltage: 120,
    room: 'Kitchen',
    schedulingEnabled: false,
  },
};

export function CircuitDetailPage() {
  const { circuitId } = useParams();
  const circuit = circuitId ? HARDCODED_CIRCUITS[circuitId] : null;

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