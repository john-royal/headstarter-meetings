import CheckIcon from '@mui/icons-material/Check';
import Alert from '@mui/joy/Alert';
import CircularProgress from '@mui/joy/CircularProgress';
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider, StyledEngineProvider } from '@mui/joy/styles';
import { PropsWithChildren } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout, { DashboardError } from './layouts/DashboardLayout';
import { AuthProvider } from './lib/auth';
import AvailabilitySelector, { loadAvailability } from './routes/AvailabilityForm';
import CreateAccount from './routes/CreateAccount';
import ScheduleMeeting, { loadUsers } from './routes/ScheduleMeeting';
import SignIn from './routes/SignIn';

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    errorElement: <DashboardError />,
    children: [
      {
        path: '/',
        element: <p>Select an option on the left.</p>,
      },
      {
        path: '/availability',
        element: <AvailabilitySelector />,
        loader: loadAvailability,
      },
      {
        path: '/zoom',
        element: (
          <Alert color='success' startDecorator={<CheckIcon />}>
            Your Zoom account has been connected.
          </Alert>
        ),
      },
      {
        path: '/new-meeting',
        element: <ScheduleMeeting />,
        loader: loadUsers,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/create-account',
        element: <CreateAccount />,
      },
    ],
  },
]);

export default function App() {
  return (
    <StylingProvider>
      <AuthProvider>
        <RouterProvider router={router} fallbackElement={<LoadingView />} />
      </AuthProvider>
    </StylingProvider>
  );
}

function StylingProvider({ children }: PropsWithChildren) {
  return (
    <StyledEngineProvider injectFirst>
      <CssVarsProvider>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </StyledEngineProvider>
  );
}

function LoadingView() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </div>
  );
}
