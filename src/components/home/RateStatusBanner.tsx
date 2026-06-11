import { Alert } from '@mui/material';

type RateStatusBannerProps = {
  rateType: 'peak' | 'mid_peak' | 'off_peak' | 'unknown';
  rangeText: string;
  pricePerKwh?: number;
};

export function RateStatusBanner({ rateType, rangeText, pricePerKwh }: RateStatusBannerProps) {
  const severity = rateType === 'peak' ? 'warning' : rateType === 'off_peak' ? 'success' : 'info';
  const rateLabel = rateType.replace('_', ' ');

  return (
    <Alert severity={severity}>
      Current rate: {rateLabel} ({rangeText})
      {typeof pricePerKwh === 'number' ? ` at $${pricePerKwh.toFixed(2)}/kWh` : ''}
    </Alert>
  );
}