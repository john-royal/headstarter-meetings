import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      <Sheet
        sx={{
          width: 300,
          mx: 'auto',
          my: 'auto',
          py: 3,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
        }}
      >
        <Outlet />
      </Sheet>
    </Box>
  );
}
