import { Stack, Typography } from '@mui/material';
import { PageContainer } from '../components/layout/PageContainer';
import { RateStatusBanner } from '../components/home/RateStatusBanner';
import { SummaryCard } from '../components/home/SummaryCard';
import { QuickActions } from '../components/home/QuickActions';
import { CircuitGrid } from '../components/home/CircuitGrid';
import { PowerAnalyticsPanel } from '../components/home/PowerAnalyticsPanel';

export function HomeDashboard() {
  return (
    <PageContainer>
      <Typography variant="h5" fontWeight={800}>
        Home Dashboard
      </Typography>
      <RateStatusBanner />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <SummaryCard title="Current Usage" value="8.4 kW" subtitle="Household draw placeholder" />
        <SummaryCard title="Current Price" value="$0.31/kWh" subtitle="Rate window placeholder" />
      </Stack>
      <QuickActions />
      <CircuitGrid />
      <PowerAnalyticsPanel />
    </PageContainer>
  );
}