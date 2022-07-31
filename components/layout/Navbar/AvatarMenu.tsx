import { Logout, Person, Settings } from '@mui/icons-material';
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';
import { useLazySignOutQuery } from '../../../api';

const AvatarMenu = () => {
  const [avatarElement, setAvatarElement] = useState<HTMLElement | null>(null);

  const handleOpenAvatarMenu = (event: MouseEvent<HTMLElement>) =>
    setAvatarElement(event.currentTarget);

  const handleCloseAvatarMenu = () => setAvatarElement(null);

  const router = useRouter();

  const [signOut] = useLazySignOutQuery();

  const handleSignOutMenuItemClick = async () => {
    try {
      // TODO: Handle loading state
      await signOut().unwrap();
      router.push('/sign-in');
    } catch (error) {}
  };

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
