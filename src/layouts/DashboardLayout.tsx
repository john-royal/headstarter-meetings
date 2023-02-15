import { Person } from '@mui/icons-material';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import NavigationMenu, { MenuSectionProps } from '../components/NavigationMenu';
import SideMenu from '../components/SideMenu';

import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/lib/auth';

const sections: MenuSectionProps[] = [
  {
    items: [
      {
        title: 'Groups',
        icon: <PeopleAltRoundedIcon />,
        path: '/',
      },
      {
        title: 'Schedule Meeting',
        icon: <EventAvailableIcon/>,
        path: '/schedule-meeting',
      },
    ],
  },
];

export default function DashboardLayout() {
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
            <IconButton
              size='sm'
              variant='solid'
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              <MeetingRoomRoundedIcon />
            </IconButton>
            <Typography component='h1' fontWeight='xl'>
              Headstarter Meetings
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5 }}>
            <SideMenu
              id='app-selector'
              control={
                <IconButton size='sm' variant='outlined' color='primary' aria-label='Me'>
                  <Person />
                </IconButton>
              }
              menus={[
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
        <Layout.Main>
          <Outlet />
        </Layout.Main>
      </Layout.Root>
    </>
  );
}
