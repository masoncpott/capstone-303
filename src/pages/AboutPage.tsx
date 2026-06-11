import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { PageContainer } from '../components/layout/PageContainer';

export function AboutPage() {
  return (
    <PageContainer>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            About This App
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Power Management Dashboard
          </Typography>
        </Box>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  What This App Does
                </Typography>
                <Typography variant="body2" paragraph>
                  This is a real-time energy management dashboard designed to help you monitor and understand your household power consumption. It provides comprehensive insights into how much electricity each circuit in your home is drawing and how it impacts your energy costs.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Key Features
                </Typography>
                <Typography component="div" variant="body2">
                  <ul style={{ margin: '0 0 0 20px', paddingLeft: 0 }}>
                    <li>Real-time power consumption tracking for individual circuits</li>
                    <li>Dynamic pricing information based on current utility rates</li>
                    <li>Historical usage analytics with multiple time period views (1 day, 1 week, 1 month, 3 months)</li>
                    <li>Power consumption percentages to understand circuit distribution</li>
                    <li>Cost analysis showing the financial impact of your energy usage</li>
                    <li>Circuit status monitoring with detailed breakdown</li>
                  </ul>
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  How to Use
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Home Dashboard:</strong> View your overall consumption, current electricity rate, and all your circuits at a glance. See power analytics with customizable time ranges.
                </Typography>
                <Typography variant="body2">
                  <strong>Circuits:</strong> Explore detailed information about each individual circuit, including historical usage patterns and cost estimates.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Data Privacy
                </Typography>
                <Typography variant="body2">
                  This application uses simulated data for demonstration purposes. No real energy data is collected or transmitted.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </PageContainer>
  );
}
