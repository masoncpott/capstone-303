import { BatteryChargingFull, Home, Insights } from '@mui/icons-material';
import { BottomNavigation as MuiBottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const value = location.pathname.startsWith('/circuits') ? 'circuits' : 'home';

  return (
    <Paper sx={{ position: 'fixed', left: 0, right: 0, bottom: 0 }} elevation={8}>
      <MuiBottomNavigation value={value} showLabels>
        <BottomNavigationAction label="Home" value="home" icon={<Home />} onClick={() => navigate('/')} />
        <BottomNavigationAction
          label="Circuits"
          value="circuits"
          icon={<BatteryChargingFull />}
          onClick={() => navigate('/circuits')}
        />
        <BottomNavigationAction label="Analytics" value="analytics" icon={<Insights />} disabled />
      </MuiBottomNavigation>
    </Paper>
  );
}