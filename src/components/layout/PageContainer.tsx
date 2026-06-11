import { Box } from '@mui/material';

type PageContainerProps = {
  children: React.ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return <Box sx={{ display: 'grid', gap: 2 }}>{children}</Box>;
}