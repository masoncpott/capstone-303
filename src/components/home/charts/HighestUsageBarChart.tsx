import { Box, Typography } from '@mui/material';
import type { ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './registerCharts';

type HighestUsageBarChartProps = {
  title: string;
  subtitle?: string;
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
};

const chartBoxSx = {
  minHeight: 180,
  height: 280,
  maxHeight: 320,
};

export function HighestUsageBarChart({ title, subtitle, data, options }: HighestUsageBarChartProps) {
  return (
    <Box sx={chartBoxSx}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {subtitle}
        </Typography>
      ) : null}
      <Bar data={data} options={options} />
    </Box>
  );
}
