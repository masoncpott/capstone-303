import { Box, Typography } from '@mui/material';
import type { ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './registerCharts';

type HighestUsageBarChartProps = {
  title: string;
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
};

const chartBoxSx = {
  minHeight: 240,
  height: 'min(50vh, 800px)',
  maxHeight: 800,
};

export function HighestUsageBarChart({ title, data, options }: HighestUsageBarChartProps) {
  return (
    <Box sx={chartBoxSx}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Bar data={data} options={options} />
    </Box>
  );
}
