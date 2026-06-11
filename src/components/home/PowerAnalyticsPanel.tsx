import { Box, Card, CardContent, Typography } from '@mui/material';

export function PowerAnalyticsPanel() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
          Power Analytics
        </Typography>
        <Box
          sx={{
            minHeight: 160,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            color: 'text.secondary',
          }}
        >
          Chart and insights placeholder
        </Box>
      </CardContent>
    </Card>
  );
}