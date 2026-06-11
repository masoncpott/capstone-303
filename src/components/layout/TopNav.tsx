import { AppBar, Box, Toolbar, Typography } from '@mui/material';

export function TopNav() {
  return (
    <AppBar position="sticky" elevation={0} color="transparent" sx={{ backdropFilter: 'blur(12px)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72 }}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Smart Electical Panel
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Manage my profile
        </Typography>
      </Toolbar>
    </AppBar>
  );
}