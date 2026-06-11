import { Card, CardContent, Box, Stack, Typography } from '@mui/material';

type UsagePoint = {
  timestamp: string;
  watts: number;
  estimatedCost: number;
};

type CircuitUsageChartProps = {
  usageHistory: UsagePoint[];
};

export function CircuitUsageChart({ usageHistory }: CircuitUsageChartProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="overline" color="text.secondary">
            Usage History
          </Typography>
          <Box
            sx={{
              minHeight: 220,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              color: 'text.secondary',
            }}
          >
            Historical usage chart placeholder ({usageHistory.length} points loaded)
          </Box>
          <Typography variant="body2" color="text.secondary">
            Estimated cost and trend lines will sit here in the next iteration.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}