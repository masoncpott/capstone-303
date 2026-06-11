import { Card, CardContent, Stack, TextField, Typography } from '@mui/material';

type CircuitHeaderProps = {
  name: string;
  category: string;
  status: string;
  room: string;
};

export function CircuitHeader({ name, category, status, room }: CircuitHeaderProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="overline" color="text.secondary">
            Circuit Overview
          </Typography>
          <TextField label="Circuit Name" value={name} fullWidth />
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              Category: {category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Room: {room}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}