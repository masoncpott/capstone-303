import { Button, Stack } from '@mui/material';

export function QuickActions() {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
      <Button variant="contained">Low Power Mode</Button>
      <Button variant="outlined">View Top Circuits</Button>
      <Button variant="outlined">Cheapest Charging</Button>
      <Button variant="outlined">Add Circuit</Button>
    </Stack>
  );
}