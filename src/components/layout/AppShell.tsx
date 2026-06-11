import { BottomNavigation } from './BottomNavigation';
import { TopNav } from './TopNav';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb' }}>
      <TopNav />
      <main style={{ padding: '16px 16px 88px' }}>{children}</main>
      <BottomNavigation />
    </div>
  );
}