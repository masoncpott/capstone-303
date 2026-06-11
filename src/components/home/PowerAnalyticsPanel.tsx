import { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import mockData from '../../data/mockData.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

type Circuit = {
  id: string;
  name: string;
  currentWatts: number;
};

type UsagePoint = {
  circuitId: string;
  timestamp: string;
  watts: number;
  estimatedCost: number;
};

type PricingPeriod = {
  rateType: 'peak' | 'mid_peak' | 'off_peak';
  pricePerKwh: number;
  startTime: string;
  endTime: string;
};

function getCurrentHourLabel(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.getUTCHours().toString().padStart(2, '0') + ':00';
}

function getHourOnly(timestamp: string) {
  return new Date(timestamp).getUTCHours().toString().padStart(2, '0') + ':00';
}

function getCurrentRatePeriod(periods: PricingPeriod[]) {
  const currentHour = new Date().getHours();

  return periods.find((period) => {
    const start = Number(period.startTime.slice(0, 2));
    const end = Number(period.endTime.slice(0, 2));

    if (start <= end) {
      return currentHour >= start && currentHour < end;
    }

    return currentHour >= start || currentHour < end;
  });
}

export function PowerAnalyticsPanel() {
  const circuits = mockData.circuits.slice(0, 5) as Circuit[];
  const usageHistory = mockData.usageHistory as UsagePoint[];
  const pricingPeriods = mockData.pricingPeriods as PricingPeriod[];

  const analytics = useMemo(() => {
    const totalUsage = circuits.reduce((sum, circuit) => sum + circuit.currentWatts, 0);
    const currentRatePeriod = getCurrentRatePeriod(pricingPeriods);
    
    // Group usage history by timestamp to get total household usage per hour
    const hourlyTotalsMap = new Map<string, number>();
    const circuitUsageMap = new Map<string, number>();

    for (const point of usageHistory) {
      const fullLabel = getCurrentHourLabel(point.timestamp);
      hourlyTotalsMap.set(fullLabel, (hourlyTotalsMap.get(fullLabel) ?? 0) + point.watts);
      circuitUsageMap.set(point.circuitId, (circuitUsageMap.get(point.circuitId) ?? 0) + point.watts);
    }

    // Get the last 24 hours of data, sorted chronologically
    const recentHours = Array.from(hourlyTotalsMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-24);
    
    const hourlyLabels = recentHours.map((entry) => {
      const date = new Date(entry[0]);
      return `${date.getUTCHours().toString().padStart(2, '0')}:00`;
    });
    const hourlyValues = recentHours.map((entry) => entry[1]);

    const topCircuits = circuits
      .map((circuit) => ({
        ...circuit,
        usage: circuitUsageMap.get(circuit.id) ?? circuit.currentWatts,
      }))
      .sort((left, right) => right.usage - left.usage)
      .slice(0, 5);

    const doughnutLabels = circuits.slice(0, 5).map((circuit) => circuit.name);
    const doughnutValues = circuits.slice(0, 5).map((circuit) => circuit.currentWatts);

    const estimatedMonthlyBill = usageHistory.reduce((sum, point) => sum + point.estimatedCost, 0) * 30;
    const cheapestRate = pricingPeriods.reduce((lowest, period) => Math.min(lowest, period.pricePerKwh), Infinity);
    const potentialSavings = currentRatePeriod ? Math.max(0, (currentRatePeriod.pricePerKwh - cheapestRate) * 75) : 0;

    return {
      totalUsage,
      currentRatePeriod,
      hourlyLabels,
      hourlyValues,
      topCircuits,
      doughnutLabels,
      doughnutValues,
      estimatedMonthlyBill,
      potentialSavings,
    };
  }, [circuits, usageHistory, pricingPeriods]);

  const lineChartData = {
    labels: analytics.hourlyLabels,
    datasets: [
      {
        label: 'Household Power',
        data: analytics.hourlyValues,
        borderColor: '#1452cc',
        backgroundColor: 'rgba(20, 82, 204, 0.18)',
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: analytics.topCircuits.map((circuit) => circuit.name),
    datasets: [
      {
        label: 'Watts',
        data: analytics.topCircuits.map((circuit) => circuit.usage),
        backgroundColor: '#00a389',
      },
    ],
  };

  const doughnutData = {
    labels: analytics.doughnutLabels,
    datasets: [
      {
        data: analytics.doughnutValues,
        backgroundColor: ['#1452cc', '#00a389', '#ffb020', '#6b7cff', '#95a4b8'],
      },
    ],
  };

  const chartBoxSx = {
    minHeight: 240,
    height: 'min(50vh, 800px)',
    maxHeight: 800,
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
              Power Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current household usage, rate status, and the circuits driving the bill.
            </Typography>
          </Box>

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="overline" color="text.secondary">
                  Current Usage
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {(analytics.totalUsage / 1000).toFixed(1)} kW
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="overline" color="text.secondary">
                  Estimated Monthly Bill
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  ${analytics.estimatedMonthlyBill.toFixed(0)}
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="overline" color="text.secondary">
                  Rate Period
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {analytics.currentRatePeriod?.rateType ?? 'unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {analytics.currentRatePeriod ? `${analytics.currentRatePeriod.startTime} - ${analytics.currentRatePeriod.endTime}` : 'No pricing period loaded'}
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="overline" color="text.secondary">
                  Potential Savings
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ${analytics.potentialSavings.toFixed(2)}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Box sx={chartBoxSx}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Household Power Over Time
            </Typography>
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Box>

          <Box sx={chartBoxSx}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Highest Usage Circuits
            </Typography>
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
          </Box>

          <Box sx={chartBoxSx}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Share of Total Consumption
            </Typography>
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Box>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {analytics.topCircuits.map((circuit) => (
              <Chip
                key={circuit.id}
                label={`${circuit.name} • ${(circuit.usage / 1000).toFixed(1)} kW`}
                variant="outlined"
              />
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}