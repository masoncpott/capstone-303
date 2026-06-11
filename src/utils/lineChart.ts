import type { ChartData, ChartOptions } from 'chart.js';

type TimestampedWattsPoint = {
  timestamp: string;
  watts: number;
};

export type ChartTimeframe = '1d' | '1w' | '1m' | '3m';

export const chartTimeframeOptions: Array<{ value: ChartTimeframe; label: string }> = [
  { value: '1d', label: '1 day' },
  { value: '1w', label: '1 week' },
  { value: '1m', label: '1 month' },
  { value: '3m', label: '3 months' },
];

export function getChartTimeframeLabel(timeframe: ChartTimeframe) {
  return chartTimeframeOptions.find((option) => option.value === timeframe)?.label ?? timeframe;
}

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

function formatDayLabel(timestamp: string) {
  const date = new Date(timestamp);
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}

function getLatestTimestamp(points: Array<{ timestamp: string }>) {
  return points.reduce((latest, point) => {
    const pointTime = new Date(point.timestamp).getTime();
    return Math.max(latest, pointTime);
  }, 0);
}

function getWindowStart(latestTimestamp: number, timeframe: ChartTimeframe) {
  const latest = new Date(latestTimestamp);

  if (timeframe === '1d') {
    latest.setUTCDate(latest.getUTCDate() - 1);
  }

  if (timeframe === '1w') {
    latest.setUTCDate(latest.getUTCDate() - 7);
  }

  if (timeframe === '1m') {
    latest.setUTCMonth(latest.getUTCMonth() - 1);
  }

  if (timeframe === '3m') {
    latest.setUTCMonth(latest.getUTCMonth() - 3);
  }

  return latest.getTime();
}

export function filterPointsByTimeframe<T extends { timestamp: string }>(points: T[], timeframe: ChartTimeframe) {
  if (points.length === 0) {
    return [];
  }

  const latestTimestamp = getLatestTimestamp(points);
  const windowStart = getWindowStart(latestTimestamp, timeframe);

  return points.filter((point) => {
    const timestamp = new Date(point.timestamp).getTime();
    return timestamp >= windowStart && timestamp <= latestTimestamp;
  });
}

export function buildTimeframeWattsSeries(points: TimestampedWattsPoint[], timeframe: ChartTimeframe) {
  const filteredPoints = filterPointsByTimeframe(points, timeframe);
  const buckets = new Map<string, { timestamp: number; label: string; watts: number }>();

  for (const point of filteredPoints) {
    const date = new Date(point.timestamp);

    if (timeframe === '1d') {
      date.setUTCMinutes(0, 0, 0);
    } else {
      date.setUTCHours(0, 0, 0, 0);
    }

    const bucketKey = date.toISOString();
    const existing = buckets.get(bucketKey);
    const label = timeframe === '1d' ? formatHourLabel(bucketKey) : formatDayLabel(bucketKey);

    if (!existing) {
      buckets.set(bucketKey, {
        timestamp: date.getTime(),
        label,
        watts: point.watts,
      });
      continue;
    }

    existing.watts += point.watts;
  }

  const ordered = Array.from(buckets.values()).sort((left, right) => left.timestamp - right.timestamp);

  return {
    labels: ordered.map((bucket) => bucket.label),
    values: ordered.map((bucket) => bucket.watts),
  };
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
