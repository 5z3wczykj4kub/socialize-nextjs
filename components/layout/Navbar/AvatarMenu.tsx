import { Logout, Person, Settings } from '@mui/icons-material';
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';

const AvatarMenu = () => {
  const [avatarElement, setAvatarElement] = useState<HTMLElement | null>(null);

  const handleOpenAvatarMenu = (event: MouseEvent<HTMLElement>) =>
    setAvatarElement(event.currentTarget);

  const handleCloseAvatarMenu = () => setAvatarElement(null);

  const router = useRouter();

  const handleSignOutMenuItemClick = () => router.push('/sign-in');

  return (
    <>
      <IconButton onClick={handleOpenAvatarMenu} sx={{ p: 0 }}>
        <Avatar />
      </IconButton>
      <Menu
        open={!!avatarElement}
        anchorEl={avatarElement}
        onClick={handleCloseAvatarMenu}
        onClose={handleCloseAvatarMenu}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Link href='/users/1'>
          <MenuItem>
            <ListItemIcon>
              <Person fontSize='small' />
            </ListItemIcon>
            Profile
          </MenuItem>
        </Link>
        <Link href='/settings'>
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize='small' />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem onClick={handleSignOutMenuItemClick}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
};

export default AvatarMenu;
