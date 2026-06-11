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
  minHeight: 260,
  height: 'min(50vh, 800px)',
  maxHeight: 800,
  marginBottom: 4
};

export function ConsumptionShareChart({ title, subtitle, data, options }: ConsumptionShareChartProps) {
  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.1,
    cutout: '58%',
    layout: {
      padding: {
        top: 8,
        right: 12,
        bottom: 20,
        left: 12,
      },
    },
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          padding: 14,
          generateLabels: (chart) => {
            const labels = (chart.data.labels ?? []).map((label) => String(label));
            const dataset = chart.data.datasets[0];
            const values = Array.isArray(dataset?.data) ? dataset.data : [];
            const backgroundColors = Array.isArray(dataset?.backgroundColor) ? dataset.backgroundColor : [];

            return labels.map((label, index) => {
              const numericValue = Number(values[index] ?? 0);
              const color = backgroundColors[index] ?? '#95a4b8';

              return {
                text: `${label} • ${(numericValue / 1000).toFixed(1)} kW`,
                fillStyle: color,
                strokeStyle: color,
                hidden: !chart.getDataVisibility(index),
                index,
                pointStyle: 'circle' as const,
              };
            });
          },
        },
      },
    },
  };

  const resolvedOptions = options ?? defaultOptions;

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
      <Doughnut data={data} options={resolvedOptions} />
    </Box>
  );
}
