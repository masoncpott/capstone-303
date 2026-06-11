import { Alert, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import type { ChartOptions } from 'chart.js';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { HouseholdPowerChart } from '../components/home/charts/HouseholdPowerChart';
import { SummaryCard } from '../components/home/SummaryCard';
import { PageContainer } from '../components/layout/PageContainer';
import mockData from '../data/mockData.json';

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

function formatHourLabel(timestamp: string) {
  const date = new Date(timestamp);
  return `${date.getUTCHours().toString().padStart(2, '0')}:00`;
}

export function CircuitDetailPage() {
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

    const recentPoints = circuitUsage
      .slice()
      .sort((left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime())
      .slice(-24);

    const hourlyLabels = recentPoints.map((point) => formatHourLabel(point.timestamp));
    const hourlyValues = recentPoints.map((point) => point.watts);
    const averageWatts = Math.round(circuitUsage.reduce((sum, point) => sum + point.watts, 0) / circuitUsage.length);
    const peakWatts = Math.max(...circuitUsage.map((point) => point.watts));
    const monthlyCostEstimate = circuitUsage.reduce((sum, point) => sum + point.estimatedCost, 0) / 3;

    return {
      hourlyLabels,
      hourlyValues,
      averageWatts,
      peakWatts,
      monthlyCostEstimate,
    };
  }, [circuitId, usageHistory]);

  const lineChartData = {
    labels: analytics?.hourlyLabels ?? [],
    datasets: [
      {
        label: circuit ? `${circuit.name} Power` : 'Circuit Power',
        data: analytics?.hourlyValues ?? [],
        borderColor: '#1452cc',
        backgroundColor: 'rgba(20, 82, 204, 0.18)',
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const lineChartOptions: ChartOptions<'line'> = { responsive: true, maintainAspectRatio: false };

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

              <HouseholdPowerChart
                title={`${circuit.name} Power Over Time`}
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