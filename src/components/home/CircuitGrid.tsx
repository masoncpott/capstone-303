import { Grid } from '@mui/material';
import { CircuitBreakerCard } from './CircuitBreakerCard';

type CircuitGridItem = {
  id: string;
  name: string;
  status: string;
  currentWatts: number;
};

type CircuitGridProps = {
  circuits: CircuitGridItem[];
};

export function CircuitGrid({ circuits }: CircuitGridProps) {
  return (
    <Grid container spacing={2}>
      {circuits.map((circuit) => (
        <Grid key={circuit.id} size={{ xs: 12, sm: 6 }}>
          <CircuitBreakerCard
            circuitId={circuit.id}
            name={circuit.name}
            status={circuit.status}
            draw={`${(circuit.currentWatts / 1000).toFixed(1)} kW`}
          />
        </Grid>
      ))}
    </Grid>
  );
}