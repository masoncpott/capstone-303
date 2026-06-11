import { Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';

type CircuitBreakerCardProps = {
  name: string;
  status: string;
  draw: string;
};

export function CircuitBreakerCard({ name, status, draw }: CircuitBreakerCardProps) {
  return (
    <Card variant="outlined">
      <CardActionArea>
        <CardContent>
          <Stack spacing={0.5}>
            <Typography fontWeight={700}>{name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current draw: {draw}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}