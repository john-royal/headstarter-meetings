import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import { ReactElement, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useRouteError } from 'react-router-dom';
import { useAuth } from 'src/lib/auth';
import Layout from '../components/Layout';
import NavigationMenu, { MenuSectionProps } from '../components/NavigationMenu';
import SideMenu from '../components/SideMenu';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VideocamIcon from '@mui/icons-material/Videocam';

const sections: MenuSectionProps[] = [
  {
    title: 'Personal',
    items: [
      {
        title: 'Availability',
        icon: <ScheduleIcon />,
        path: '/availability',
      },
      {
        title: 'Zoom',
        icon: <VideocamIcon />,
        path: '/api/zoom/connect',
      },
    ],
  },
  {
    title: 'Meetings',
    items: [
      {
        title: 'New Meeting',
        icon: <EventAvailableIcon />,
        path: '/new-meeting',
      },
    ],
  },
];

export default function DashboardLayout({ children }: { children?: ReactElement }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate('/sign-in');
    }
  }, [navigate, user]);

  return (
    <>
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <NavigationMenu sections={sections} />
        </Layout.SideDrawer>
      )}
      <Layout.Root
        sx={{
          ...(drawerOpen && {
            height: '100vh',
            overflow: 'hidden',
          }),
        }}
      >
        <Layout.Header>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <IconButton
              variant='outlined'
              size='sm'
              onClick={() => {
                setDrawerOpen(true);
              }}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Link
              to='/'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <IconButton
                size='sm'
                variant='solid'
                sx={{ display: { xs: 'none', sm: 'inline-flex' }, mr: 1.5 }}
              >
                <MeetingRoomRoundedIcon />
              </IconButton>
              <Typography component='h1' fontWeight='xl'>
                Headstarter Meetings
              </Typography>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5 }}>
            <SideMenu
              id='app-selector'
              control={
                <IconButton size='sm' variant='outlined' color='primary' aria-label='Me'>
                  <PersonIcon />
                </IconButton>
              }
              menus={[
                { label: `Hi, ${user?.name ?? 'User'}` },
                {
                  label: 'Sign Out',
                  onClick: () => {
                    signOut().then(() => navigate('/sign-in'));
                  },
                },
              ]}
            />
          </Box>
        </Layout.Header>
        <Layout.SideNav>
          <NavigationMenu sections={sections} />
        </Layout.SideNav>
        <Layout.Main>{children ?? <Outlet />}</Layout.Main>
      </Layout.Root>
    </>
  );
}

export function DashboardError() {
  const error = useRouteError() as Error & { status: number; statusText: string };

  return (
    <DashboardLayout>
      <>
        <Typography level='h3' component='h1'>
          {error.status} {error.statusText}
        </Typography>
      </>
    </DashboardLayout>
  );
}
