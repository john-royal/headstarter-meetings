import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider, StyledEngineProvider } from '@mui/joy/styles';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import DashboardLayout, { DashboardError } from './layouts/DashboardLayout';
import { auth } from './lib/firebase';

import CircularProgress from '@mui/joy/CircularProgress';
import { PropsWithChildren } from 'react';
import AuthLayout from './layouts/AuthLayout';
import { AuthProvider } from './lib/auth';
import CreateAccount from './routes/CreateAccount';
import SignIn from './routes/SignIn';
import AvailabilitySelector from './routes/AvailabilityForm';
import ScheduleMeeting, { loadUsers } from './routes/ScheduleMeeting';

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
      {
        path: '/sign-out',
        loader: async () => {
          await auth.signOut();
          return redirect('/sign-in');
        },
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
