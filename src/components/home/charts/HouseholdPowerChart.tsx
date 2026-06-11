import { Box, Typography } from '@mui/material';
import type { ChartData, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './registerCharts';

type HouseholdPowerChartProps = {
  title: string;
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
};

const chartBoxSx = {
  minHeight: 240,
  height: 'min(50vh, 800px)',
  maxHeight: 800,
};

export function HouseholdPowerChart({ title, data, options }: HouseholdPowerChartProps) {
  return (
    <Box sx={chartBoxSx}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Line data={data} options={options} />
    </Box>
  );
}
