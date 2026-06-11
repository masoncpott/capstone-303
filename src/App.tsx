import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomeDashboard } from './pages/HomeDashboard';
import { CircuitsPage } from './pages/CircuitsPage';
import { CircuitDetailPage } from './pages/CircuitDetailPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/circuits" element={<CircuitsPage />} />
        <Route path="/circuits/:circuitId" element={<CircuitDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
