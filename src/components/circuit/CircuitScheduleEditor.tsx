import { Card, CardContent, Stack, TextField, Typography, Button } from '@mui/material';

type ScheduleItem = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
};

type CircuitScheduleEditorProps = {
  schedules: ScheduleItem[];
};

export function CircuitScheduleEditor({ schedules }: CircuitScheduleEditorProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="overline" color="text.secondary">
            Schedule Editor
          </Typography>
          <TextField label="Preferred Start" placeholder="22:00" fullWidth />
          <TextField label="Preferred End" placeholder="06:00" fullWidth />
          <Button variant="outlined">Save Schedule</Button>
          <Typography variant="body2" color="text.secondary">
            {schedules.length} schedule entries loaded from the API.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}