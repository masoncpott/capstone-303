import { Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type CircuitBreakerCardProps = {
  circuitId: string;
  name: string;
  status: string;
  draw: string;
  consumptionPercentage: number;
};

export function CircuitBreakerCard({ circuitId, name, status, draw, consumptionPercentage }: CircuitBreakerCardProps) {
  const navigate = useNavigate();

  return (
    <Card variant="outlined">
      <CardActionArea onClick={() => navigate(`/circuits/${circuitId}`)}>
        <CardContent>
          <Stack spacing={0.5}>
            <Typography sx={{ fontWeight: 700 }}>{name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current draw: {draw}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current power consumption: {consumptionPercentage.toFixed(1)}%
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}