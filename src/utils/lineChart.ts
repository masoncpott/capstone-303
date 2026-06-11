import type { ChartData, ChartOptions } from 'chart.js';

type TimestampedWattsPoint = {
  timestamp: string;
  watts: number;
};

type LineDatasetStyle = {
  label: string;
  borderColor: string;
  backgroundColor: string;
  tension: number;
};

function formatHourLabel(timestamp: string) {
  const date = new Date(timestamp);
  return `${date.getUTCHours().toString().padStart(2, '0')}:00`;
}

export function buildRecentHourlyWattsSeries(points: TimestampedWattsPoint[], hours = 24) {
  const totalsByTimestamp = new Map<string, number>();

  for (const point of points) {
    totalsByTimestamp.set(point.timestamp, (totalsByTimestamp.get(point.timestamp) ?? 0) + point.watts);
  }

  const recentPoints = Array.from(totalsByTimestamp.entries())
    .sort((left, right) => new Date(left[0]).getTime() - new Date(right[0]).getTime())
    .slice(-hours);

  return {
    labels: recentPoints.map(([timestamp]) => formatHourLabel(timestamp)),
    values: recentPoints.map(([, watts]) => watts),
  };
}

export function buildLineChartData(
  labels: string[],
  values: number[],
  datasetStyle: LineDatasetStyle,
): ChartData<'line'> {
  return {
    labels,
    datasets: [
      {
        label: datasetStyle.label,
        data: values,
        borderColor: datasetStyle.borderColor,
        backgroundColor: datasetStyle.backgroundColor,
        tension: datasetStyle.tension,
        fill: true,
      },
    ],
  };
}

export const sharedLineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
};
