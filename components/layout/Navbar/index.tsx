import { AppBar, Button, Container, Stack, Toolbar } from '@mui/material';
import Link from 'next/link';
import Logo from './Logo';
import NotificationsButton from './NotificationsButton';
import ProfileMenu from './ProfileMenu';
import SearchBar from './SearchBar';

interface AuthenticatedProps {
  profileId: string;
}

const Authenticated = ({ profileId }: AuthenticatedProps) => (
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
          <SearchBar />
          <Stack
            direction='row'
            justifyContent='center'
            alignItems='center'
            spacing={2}
          >
            <NotificationsButton />
            <ProfileMenu profileId={profileId} />
          </Stack>
        </Stack>
      </Toolbar>
    </Container>
  </AppBar>
);

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

export default { Authenticated, Unauthenticated };
