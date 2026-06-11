import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';

type CircuitHeaderProps = {
  name: string;
  category: string;
  status: string;
  room: string;
  editableName: string;
  onEditableNameChange: (value: string) => void;
  onSaveName: () => void;
  savingName: boolean;
};

export function CircuitHeader({
  name,
  category,
  status,
  room,
  editableName,
  onEditableNameChange,
  onSaveName,
  savingName,
}: CircuitHeaderProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="overline" color="text.secondary">
            Circuit Overview
          </Typography>
          <TextField
            label="Circuit Name"
            value={editableName}
            onChange={(event) => onEditableNameChange(event.target.value)}
            helperText={`Current name: ${name}`}
            fullWidth
          />
          <Button variant="contained" onClick={onSaveName} disabled={savingName || editableName.trim().length === 0}>
            {savingName ? 'Saving Name...' : 'Save Name'}
          </Button>
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