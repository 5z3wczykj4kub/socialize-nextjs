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
import { User } from '../../../models/User';
import { api, useLazySignOutQuery } from '../../../RTKQ/api';
import { useAppDispatch } from '../../../RTKQ/store';

const ProfileMenu = (profile: Omit<User, 'password'>) => {
  const [avatarElement, setAvatarElement] = useState<HTMLElement | null>(null);

  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) =>
    setAvatarElement(event.currentTarget);

  const handleProfileMenuClose = () => setAvatarElement(null);

  const router = useRouter();

  const [signOut] = useLazySignOutQuery();

  const handleProfileMenuItemClick = () => router.push(`/users/${profile.id}`);

  const dispatch = useAppDispatch();

  const handleSignOutMenuItemClick = async () => {
    try {
      await signOut().unwrap();
      await router.push('/sign-in');
      dispatch(api.util.resetApiState());
    } catch (error) {}
  };

  return (
    <>
      <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
        <Avatar>
          {profile.firstName[0]}
          {profile.lastName[0]}
        </Avatar>
      </IconButton>
      <Menu
        open={!!avatarElement}
        anchorEl={avatarElement}
        onClick={handleProfileMenuClose}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem onClick={handleProfileMenuItemClick}>
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

export default ProfileMenu;
