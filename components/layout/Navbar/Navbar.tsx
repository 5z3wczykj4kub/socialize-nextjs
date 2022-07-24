import { Logout, Notifications, Person, Settings } from '@mui/icons-material';
import {
  AppBar,
  Autocomplete,
  Avatar,
  Badge,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { MouseEvent, useState } from 'react';

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);

  const handleCloseUserMenu = () => setAnchorElUser(null);

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
            <Typography>SOCIALIZE</Typography>
            <Autocomplete
              freeSolo
              size='small'
              options={[]}
              filterOptions={(x) => x}
              sx={{
                width: 280,
              }}
              renderInput={(params) => <TextField {...params} label='Search' />}
            />
            <Stack
              direction='row'
              justifyContent='center'
              alignItems='center'
              spacing={2}
            >
              <IconButton>
                <Badge badgeContent={1} color='primary'>
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar />
              </IconButton>
              <Menu
                open={!!anchorElUser}
                anchorEl={anchorElUser}
                onClick={handleCloseUserMenu}
                onClose={handleCloseUserMenu}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <Person fontSize='small' />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <Settings fontSize='small' />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <Logout fontSize='small' />
                  </ListItemIcon>
                  Sign out
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
