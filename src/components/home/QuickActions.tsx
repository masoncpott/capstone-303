import { Button, Stack } from '@mui/material';

type QuickAction = {
  label: string;
  variant: 'contained' | 'outlined';
};

export function QuickActions() {
  const actions: QuickAction[] = [
    { label: 'Low Power Mode', variant: 'contained' },
    { label: 'View Top Circuits', variant: 'outlined' },
    { label: 'Cheapest Charging', variant: 'outlined' },
    { label: 'Add Circuit', variant: 'outlined' },
  ];

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
      {actions.map((action) => (
        <Button key={action.label} variant={action.variant}>
          {action.label}
        </Button>
      ))}
    </Stack>
  );
}