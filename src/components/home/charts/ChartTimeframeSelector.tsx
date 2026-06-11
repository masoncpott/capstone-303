import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { ChartTimeframe, chartTimeframeOptions } from '../../../utils/lineChart';

type ChartTimeframeSelectorProps = {
  value: ChartTimeframe;
  onChange: (timeframe: ChartTimeframe) => void;
};

export function ChartTimeframeSelector({ value, onChange }: ChartTimeframeSelectorProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        Time range
      </Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={value}
        onChange={(_event, nextValue: ChartTimeframe | null) => {
          if (nextValue) {
            onChange(nextValue);
          }
        }}
      >
        {chartTimeframeOptions.map((option) => (
          <ToggleButton key={option.value} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}
