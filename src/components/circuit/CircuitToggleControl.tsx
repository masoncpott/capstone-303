import { Button, Card, CardContent, Stack, Typography } from '@mui/material';

type CircuitToggleControlProps = {
  status: string;
  onToggle: () => void;
  toggling: boolean;
};

export function CircuitToggleControl({ status, onToggle, toggling }: CircuitToggleControlProps) {
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
          <Button variant="contained" fullWidth onClick={onToggle} disabled={toggling}>
            {toggling ? 'Updating...' : 'Toggle Circuit'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}