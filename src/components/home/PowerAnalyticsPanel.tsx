import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import type { ChartOptions } from 'chart.js';
import mockData from '../../data/mockData.json';
import powerAnalyticsConfig from '../../data/powerAnalyticsConfig.json';
import {
  buildLineChartData,
  buildTimeframeWattsSeries,
  ChartTimeframe,
  filterPointsByTimeframe,
  getChartTimeframeLabel,
  sharedLineChartOptions,
} from '../../utils/lineChart';
import { SummaryCard } from './SummaryCard';
import { ChartTimeframeSelector } from './charts/ChartTimeframeSelector';
import { ConsumptionShareChart } from './charts/ConsumptionShareChart';
import { HighestUsageBarChart } from './charts/HighestUsageBarChart';
import { HouseholdPowerChart } from './charts/HouseholdPowerChart';

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

type SummaryCardConfigKey = 'currentUsage' | 'estimatedMonthlyBill' | 'ratePeriod' | 'potentialSavings';

type SummaryCardConfig = {
  key: SummaryCardConfigKey;
  title: string;
  subtitle?: string;
  subtitleFallback?: string;
};

type SummaryCardViewModel = {
  title: string;
  value: string;
  subtitle?: string;
};

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
  const [selectedTimeframe, setSelectedTimeframe] = useState<ChartTimeframe>('1d');
  const activeRangeTitle = `Active range: ${getChartTimeframeLabel(selectedTimeframe)}`;
  const circuits = mockData.circuits.slice(0, 5) as Circuit[];
  const usageHistory = mockData.usageHistory as UsagePoint[];
  const pricingPeriods = mockData.pricingPeriods as PricingPeriod[];

  const analytics = useMemo(() => {
    const filteredUsageHistory = filterPointsByTimeframe(usageHistory, selectedTimeframe);
    const totalUsage = circuits.reduce((sum, circuit) => sum + circuit.currentWatts, 0);
    const currentRatePeriod = getCurrentRatePeriod(pricingPeriods);
    const circuitUsageMap = new Map<string, number>();

    for (const point of filteredUsageHistory) {
      circuitUsageMap.set(point.circuitId, (circuitUsageMap.get(point.circuitId) ?? 0) + point.watts);
    }
    const hourlySeries = buildTimeframeWattsSeries(usageHistory, selectedTimeframe);

    const topCircuits = circuits
      .map((circuit) => ({
        ...circuit,
        usage: circuitUsageMap.get(circuit.id) ?? circuit.currentWatts,
      }))
      .sort((left, right) => right.usage - left.usage)
      .slice(0, 5);

    const doughnutLabels = topCircuits.map((circuit) => circuit.name);
    const doughnutValues = topCircuits.map((circuit) => circuit.usage);

    const estimatedMonthlyBill = filteredUsageHistory.reduce((sum, point) => sum + point.estimatedCost, 0) * 30;
    const cheapestRate = pricingPeriods.reduce((lowest, period) => Math.min(lowest, period.pricePerKwh), Infinity);
    const potentialSavings = currentRatePeriod ? Math.max(0, (currentRatePeriod.pricePerKwh - cheapestRate) * 75) : 0;

    return {
      totalUsage,
      currentRatePeriod,
      hourlyLabels: hourlySeries.labels,
      hourlyValues: hourlySeries.values,
      topCircuits,
      doughnutLabels,
      doughnutValues,
      estimatedMonthlyBill,
      potentialSavings,
    };
  }, [circuits, usageHistory, pricingPeriods, selectedTimeframe]);

  const lineChartData = buildLineChartData(analytics.hourlyLabels, analytics.hourlyValues, {
    label: powerAnalyticsConfig.charts.line.label,
    borderColor: powerAnalyticsConfig.charts.line.borderColor,
    backgroundColor: powerAnalyticsConfig.charts.line.backgroundColor,
    tension: powerAnalyticsConfig.charts.line.tension,
  });

  const barChartData = {
    labels: analytics.topCircuits.map((circuit) => circuit.name),
    datasets: [
      {
        label: powerAnalyticsConfig.charts.bar.label,
        data: analytics.topCircuits.map((circuit) => circuit.usage),
        backgroundColor: powerAnalyticsConfig.charts.bar.backgroundColor,
      },
    ],
  };

  const doughnutData = {
    labels: analytics.doughnutLabels,
    datasets: [
      {
        data: analytics.doughnutValues,
        backgroundColor: powerAnalyticsConfig.charts.doughnut.backgroundColor,
      },
    ],
  };

  const lineChartOptions: ChartOptions<'line'> = sharedLineChartOptions;
  const barChartOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false, indexAxis: 'y' };

  const summaryCardResolvers: Record<
    SummaryCardConfigKey,
    (cardConfig: SummaryCardConfig) => Omit<SummaryCardViewModel, 'title'>
  > = {
    currentUsage: (cardConfig) => ({
      value: `${(analytics.totalUsage / 1000).toFixed(1)} kW`,
      subtitle: (cardConfig.subtitle ?? '').replace('{count}', String(circuits.length)),
    }),
    estimatedMonthlyBill: (cardConfig) => ({
      value: `$${analytics.estimatedMonthlyBill.toFixed(0)}`,
      subtitle: cardConfig.subtitle,
    }),
    ratePeriod: (cardConfig) => ({
      value: (analytics.currentRatePeriod?.rateType ?? 'unknown').replace('_', ' '),
      subtitle: analytics.currentRatePeriod
        ? `${analytics.currentRatePeriod.startTime} - ${analytics.currentRatePeriod.endTime}`
        : cardConfig.subtitleFallback,
    }),
    potentialSavings: (cardConfig) => ({
      value: `$${analytics.potentialSavings.toFixed(2)}`,
      subtitle: cardConfig.subtitle,
    }),
  };

  const summaryCards: SummaryCardViewModel[] = (powerAnalyticsConfig.summaryCards as SummaryCardConfig[]).map((cardConfig) => ({
    title: cardConfig.title,
    ...summaryCardResolvers[cardConfig.key](cardConfig),
  }));

  return (
    <Card 
    variant="outlined" 
    sx={{ pb: { xs: 4, sm: 8 } }}
    >
      <CardContent>
        {/* <Stack> */}
          <div>
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
              {powerAnalyticsConfig.panel.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {powerAnalyticsConfig.panel.description}
            </Typography>
          </div>

          <Grid container spacing={1.5}>
            {summaryCards.map((card) => (
              <Grid key={card.title} size={{ xs: 12, sm: 6 }}>
                <SummaryCard title={card.title} value={card.value} subtitle={card.subtitle} />
              </Grid>
            ))}
          </Grid>

          <ChartTimeframeSelector value={selectedTimeframe} onChange={setSelectedTimeframe} />

          <Stack 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 4, sm: 12 }
          }}
          >
            <HouseholdPowerChart
              title={powerAnalyticsConfig.sections.householdPowerOverTime}
              subtitle={activeRangeTitle}
              data={lineChartData}
              options={lineChartOptions}
            />

            <HighestUsageBarChart
              title={powerAnalyticsConfig.sections.highestUsageCircuits}
              subtitle={activeRangeTitle}
              data={barChartData}
              options={barChartOptions}
            />

            <ConsumptionShareChart
              title={powerAnalyticsConfig.sections.shareOfTotalConsumption}
              subtitle={activeRangeTitle}
              data={doughnutData}
            />
          </Stack>
        {/* </Stack> */}
      </CardContent>
    </Card>
  );
}