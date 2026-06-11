import { Grid } from '@mui/material';
import { CircuitBreakerCard } from './CircuitBreakerCard';

const placeholderCircuits = [
  { circuitId: 'ev-charger', name: 'EV Charger', status: 'On', draw: '7.2 kW' },
  { circuitId: 'hvac', name: 'HVAC', status: 'Off', draw: '0.0 kW' },
  { circuitId: 'water-heater', name: 'Water Heater', status: 'Scheduled', draw: '4.1 kW' },
];

export function CircuitGrid() {
  return (
    <Grid container spacing={2}>
      {placeholderCircuits.map((circuit) => (
        <Grid key={circuit.name} size={{ xs: 12, sm: 6 }}>
          <CircuitBreakerCard {...circuit} />
        </Grid>
      ))}
    </Grid>
  );
}