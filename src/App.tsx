import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomeDashboard } from './pages/HomeDashboard';
import { CircuitDetailPage } from './pages/CircuitDetailPage';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/circuits/:circuitId" element={<CircuitDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
