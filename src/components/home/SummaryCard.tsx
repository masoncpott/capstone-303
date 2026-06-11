import { Card, CardContent, Typography } from '@mui/material';

type SummaryCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export function SummaryCard({ title, value, subtitle }: SummaryCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}