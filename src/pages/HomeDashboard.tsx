import { Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { RateStatusBanner } from '../components/home/RateStatusBanner';
import { SummaryCard } from '../components/home/SummaryCard';
import { QuickActions } from '../components/home/QuickActions';
import { CircuitGrid } from '../components/home/CircuitGrid';
import { PowerAnalyticsPanel } from '../components/home/PowerAnalyticsPanel';

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

const HARDCODED_CIRCUITS: Circuit[] = [
  { id: '1', name: 'EV Charger', status: 'on', currentWatts: 5500 },
  { id: '2', name: 'HVAC', status: 'on', currentWatts: 3200 },
  { id: '3', name: 'Water Heater', status: 'off', currentWatts: 0 },
  { id: '4', name: 'Kitchen Outlets', status: 'on', currentWatts: 1200 },
  { id: '5', name: 'Oven', status: 'off', currentWatts: 0 },
  { id: '6', name: 'Dryer', status: 'off', currentWatts: 0 },
  { id: '7', name: 'Basement Lights', status: 'off', currentWatts: 0 },
  { id: '8', name: 'Office', status: 'on', currentWatts: 450 },
  { id: '9', name: 'Garage', status: 'off', currentWatts: 0 },
  { id: '10', name: 'Refrigerator', status: 'on', currentWatts: 600 },
];

const HARDCODED_PRICING_PERIODS: PricingPeriod[] = [
  { id: '1', startTime: '00:00', endTime: '06:00', rateType: 'off_peak', pricePerKwh: 0.18 },
  { id: '2', startTime: '06:00', endTime: '16:00', rateType: 'mid_peak', pricePerKwh: 0.26 },
  { id: '3', startTime: '16:00', endTime: '21:00', rateType: 'peak', pricePerKwh: 0.41 },
  { id: '4', startTime: '21:00', endTime: '24:00', rateType: 'mid_peak', pricePerKwh: 0.22 },
];

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
  const circuits = HARDCODED_CIRCUITS;
  const pricingPeriods = HARDCODED_PRICING_PERIODS;

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

      <QuickActions />
      <CircuitGrid circuits={circuits} />
      <PowerAnalyticsPanel />
    </PageContainer>
  );
}