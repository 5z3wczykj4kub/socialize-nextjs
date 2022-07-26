import {
  AppBar,
  Button,
  Container,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { User } from '../../../models/User';
import { useGetNotificationsQuery } from '../../../RTKQ/api';
import Logo from './Logo';
import NotificationsMenu from './NotificationsMenu';
import ProfileMenu from './ProfileMenu';
import SearchBar from './SearchBar';

/**
 * TODO:
 * 1. Mobile version only:
 * replace the search bar with a button icon
 * that will trigger the top drawer upon click.
 * 2. Consider using navbar as layout in order
 * to persist search state.
 */
const Authenticated = (profile: Omit<User, 'password'>) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const { data: notifications } = useGetNotificationsQuery(null, {
    pollingInterval: 10000,
  });

  return (
    <AppBar>
      <Container maxWidth='lg'>
        <Toolbar disableGutters>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            width='100%'
            spacing={matches ? 0 : 2}
          >
            {matches && <Logo />}
            <SearchBar />
            <Stack
              direction='row'
              justifyContent='center'
              alignItems='center'
              spacing={2}
            >
              <NotificationsMenu notifications={notifications} />
              <ProfileMenu {...profile} />
            </Stack>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const Unauthenticated = () => (
  <AppBar>
    <Container maxWidth='lg'>
      <Toolbar disableGutters>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          width='100%'
        >
          <Logo />
          <Stack direction='row' spacing={2}>
            <Link href='/sign-in'>
              <Button href='/sign-in'>Sign in</Button>
            </Link>
            <Link href='/sign-up'>
              <Button href='/sign-up' variant='outlined'>
                Sign up
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Toolbar>
    </Container>
  </AppBar>
);

const Navbar = { Authenticated, Unauthenticated };

export default Navbar;
