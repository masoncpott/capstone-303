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
  const totalWatts = circuits.reduce((sum, circuit) => sum + circuit.currentWatts, 0);

  return (
    <Grid container spacing={2}>
      {circuits.map((circuit) => (
        <Grid key={circuit.id} size={{ xs: 12, sm: 6 }}>
          <CircuitBreakerCard
            circuitId={circuit.id}
            name={circuit.name}
            status={circuit.status}
            draw={`${(circuit.currentWatts / 1000).toFixed(1)} kW`}
            consumptionPercentage={totalWatts > 0 ? (circuit.currentWatts / totalWatts) * 100 : 0}
          />
        </Grid>
      ))}
    </Grid>
  );
}