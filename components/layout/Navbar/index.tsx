import { AppBar, Container, Stack, Toolbar } from '@mui/material';
import AvatarMenu from './AvatarMenu';
import Logo from './Logo';
import NotificationsButton from './NotificationsButton';
import SearchBar from './SearchBar';

const Authenticated = () => {
  return (
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
              <AvatarMenu />
            </Stack>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const Unauthenticated = () => {
  return (
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
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default { Authenticated, Unauthenticated };
