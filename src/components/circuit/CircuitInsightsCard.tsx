import { Card, CardContent, Stack, Typography } from '@mui/material';

type CircuitInsightsCardProps = {
  insights: string[];
};

export function CircuitInsightsCard({ insights }: CircuitInsightsCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            Insights
          </Typography>
          {insights.map((insight) => (
            <Typography key={insight} variant="body2" color="text.secondary">
              {insight}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}