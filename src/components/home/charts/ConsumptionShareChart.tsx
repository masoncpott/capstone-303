import { Box, Typography } from '@mui/material';
import type { ChartData, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './registerCharts';

type ConsumptionShareChartProps = {
  title: string;
  subtitle?: string;
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
};

const chartBoxSx = {
  minHeight: 240,
  height: 'min(50vh, 800px)',
  maxHeight: 800,
};

export function ConsumptionShareChart({ title, subtitle, data, options }: ConsumptionShareChartProps) {
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
      <Doughnut data={data} options={options} />
    </Box>
  );
}
