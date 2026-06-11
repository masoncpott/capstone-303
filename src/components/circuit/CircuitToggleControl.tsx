import { Button, Card, CardContent, Stack, Typography } from '@mui/material';

type CircuitToggleControlProps = {
  status: string;
};

export function CircuitToggleControl({ status }: CircuitToggleControlProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="overline" color="text.secondary">
            Manual Control
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current state: {status}
          </Typography>
          <Button variant="contained" fullWidth>
            Toggle Circuit
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}