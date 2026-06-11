import { Alert, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import type { ChartOptions } from 'chart.js';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChartTimeframeSelector } from '../components/home/charts/ChartTimeframeSelector';
import { HouseholdPowerChart } from '../components/home/charts/HouseholdPowerChart';
import { SummaryCard } from '../components/home/SummaryCard';
import { PageContainer } from '../components/layout/PageContainer';
import mockData from '../data/mockData.json';
import powerAnalyticsConfig from '../data/powerAnalyticsConfig.json';
import {
  buildLineChartData,
  buildTimeframeWattsSeries,
  ChartTimeframe,
  filterPointsByTimeframe,
  getChartTimeframeLabel,
  sharedLineChartOptions,
} from '../utils/lineChart';

type Circuit = {
  id: string;
  name: string;
  category: string;
  status: string;
  currentWatts: number;
  voltage: number;
  room: string;
  schedulingEnabled: boolean;
};

type UsagePoint = {
  circuitId: string;
  timestamp: string;
  watts: number;
  estimatedCost: number;
};

export function CircuitDetailPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<ChartTimeframe>('1d');
  const activeRangeTitle = `Active range: ${getChartTimeframeLabel(selectedTimeframe)}`;
  const { circuitId } = useParams();
  const circuitsMap = mockData.circuits.reduce((acc, circuit) => {
    acc[circuit.id] = circuit as Circuit;
    return acc;
  }, {} as Record<string, Circuit>);
  const circuit = circuitId ? circuitsMap[circuitId] : null;
  const usageHistory = mockData.usageHistory as UsagePoint[];

  const analytics = useMemo(() => {
    if (!circuitId) {
      return null;
    }

    const circuitUsage = usageHistory.filter((point) => point.circuitId === circuitId);
    if (circuitUsage.length === 0) {
      return null;
    }

    const filteredUsage = filterPointsByTimeframe(circuitUsage, selectedTimeframe);
    if (filteredUsage.length === 0) {
      return null;
    }

    const hourlySeries = buildTimeframeWattsSeries(filteredUsage, selectedTimeframe);
    const averageWatts = Math.round(filteredUsage.reduce((sum, point) => sum + point.watts, 0) / filteredUsage.length);
    const peakWatts = Math.max(...filteredUsage.map((point) => point.watts));
    const monthlyCostEstimate = filteredUsage.reduce((sum, point) => sum + point.estimatedCost, 0) * 30;

    return {
      hourlyLabels: hourlySeries.labels,
      hourlyValues: hourlySeries.values,
      averageWatts,
      peakWatts,
      monthlyCostEstimate,
    };
  }, [circuitId, usageHistory, selectedTimeframe]);

  const lineChartData = buildLineChartData(analytics?.hourlyLabels ?? [], analytics?.hourlyValues ?? [], {
    label: circuit ? `${circuit.name} Power` : 'Circuit Power',
    borderColor: powerAnalyticsConfig.charts.line.borderColor,
    backgroundColor: powerAnalyticsConfig.charts.line.backgroundColor,
    tension: powerAnalyticsConfig.charts.line.tension,
  });

  const lineChartOptions: ChartOptions<'line'> = sharedLineChartOptions;

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        Circuit Detail
      </Typography>

      {!circuit ? (
        <Alert severity="warning">Circuit not found for ID: {circuitId}</Alert>
      ) : (
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">{circuit.name}</Typography>
                <Typography variant="body2">Status: {circuit.status}</Typography>
                <Typography variant="body2">Power Draw: {circuit.currentWatts} watts</Typography>
                <Typography variant="body2">Room: {circuit.room}</Typography>
                <Typography variant="body2">Category: {circuit.category}</Typography>
                <Typography variant="body2">Voltage: {circuit.voltage}V</Typography>
              </Stack>
            </CardContent>
          </Card>

          {analytics ? (
            <>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <SummaryCard title="Average Usage" value={`${(analytics.averageWatts / 1000).toFixed(2)} kW`} subtitle="Across 3 months" />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <SummaryCard title="Peak Usage" value={`${(analytics.peakWatts / 1000).toFixed(2)} kW`} subtitle="Highest hourly draw" />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <SummaryCard title="Est. Monthly Cost" value={`$${analytics.monthlyCostEstimate.toFixed(2)}`} subtitle="From hourly history" />
                </Grid>
              </Grid>

              <ChartTimeframeSelector value={selectedTimeframe} onChange={setSelectedTimeframe} />

              <HouseholdPowerChart
                title={`${circuit.name} Power Over Time`}
                subtitle={activeRangeTitle}
                data={lineChartData}
                options={lineChartOptions}
              />
            </>
          ) : (
            <Alert severity="info">No usage history available for this circuit yet.</Alert>
          )}
        </Stack>
      )}
    </PageContainer>
  );
}