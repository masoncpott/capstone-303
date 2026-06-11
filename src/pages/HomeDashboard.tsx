import { Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { RateStatusBanner } from '../components/home/RateStatusBanner';
import { SummaryCard } from '../components/home/SummaryCard';
import { CircuitGrid } from '../components/home/CircuitGrid';
import { PowerAnalyticsPanel } from '../components/home/PowerAnalyticsPanel';
import mockData from '../data/mockData.json';

type Circuit = {
  id: string;
  name: string;
  status: string;
  currentWatts: number;
};

type PricingPeriod = {
  id: string;
  startTime: string;
  endTime: string;
  rateType: 'peak' | 'mid_peak' | 'off_peak';
  pricePerKwh: number;
};

function resolveCurrentRatePeriod(pricingPeriods: PricingPeriod[]) {
  const currentHour = new Date().getHours();

  return pricingPeriods.find((period) => {
    const startHour = Number(period.startTime.slice(0, 2));
    const endHour = Number(period.endTime.slice(0, 2));

    if (startHour <= endHour) {
      return currentHour >= startHour && currentHour < endHour;
    }

    return currentHour >= startHour || currentHour < endHour;
  });
}

export function HomeDashboard() {
  const circuits = mockData.circuits as Circuit[];
  const pricingPeriods = mockData.pricingPeriods as PricingPeriod[];

  const totalUsageKw = useMemo(() => circuits.reduce((sum, circuit) => sum + circuit.currentWatts, 0) / 1000, [circuits]);
  const currentRatePeriod = useMemo(() => resolveCurrentRatePeriod(pricingPeriods), [pricingPeriods]);

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        Home Dashboard
      </Typography>

      <RateStatusBanner
        rateType={currentRatePeriod?.rateType ?? 'unknown'}
        rangeText={currentRatePeriod ? `${currentRatePeriod.startTime} - ${currentRatePeriod.endTime}` : 'No active period'}
        pricePerKwh={currentRatePeriod?.pricePerKwh}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <SummaryCard title="Current Usage" value={`${totalUsageKw.toFixed(1)} kW`} subtitle={`${circuits.length} tracked circuits`} />
        <SummaryCard
          title="Current Price"
          value={currentRatePeriod ? `$${currentRatePeriod.pricePerKwh.toFixed(2)}/kWh` : 'Unavailable'}
          subtitle={currentRatePeriod ? `${currentRatePeriod.rateType.replace('_', ' ')} period` : 'No pricing period loaded'}
        />
      </Stack>

      <CircuitGrid circuits={circuits} />
      <PowerAnalyticsPanel />
    </PageContainer>
  );
}