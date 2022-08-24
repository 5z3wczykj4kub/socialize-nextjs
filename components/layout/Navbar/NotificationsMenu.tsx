import { Notifications } from '@mui/icons-material';
import { Badge, IconButton, Menu } from '@mui/material';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';
import { Notification } from '../../../models/User';
import NotificationsMenuItem from './NotificationsMenuItem';

interface NotificationsMenuProps {
  notifications: Notification[];
}

const NotificationsMenu = ({ notifications }: NotificationsMenuProps) => {
  const [notificationsButtonAnchorEl, setNotificationsButtonAnchorEl] =
    useState<HTMLElement | null>(null);

  const handleNotificationsMenuOpen = (event: MouseEvent<HTMLElement>) =>
    setNotificationsButtonAnchorEl(event.currentTarget);

  const handleNotificationsMenuClose = () =>
    setNotificationsButtonAnchorEl(null);

  const router = useRouter();

  const handleNotificationsMenuItemClick = (profileId: string) =>
    router.push(`/users/${profileId}`);

  const unreadNotifications = notifications.filter(({ read }) => !read);

  return (
    <>
      <IconButton onClick={handleNotificationsMenuOpen}>
        <Badge badgeContent={unreadNotifications.length} color='primary'>
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        open={!!notificationsButtonAnchorEl}
        anchorEl={notificationsButtonAnchorEl}
        onClick={handleNotificationsMenuClose}
        onClose={handleNotificationsMenuClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        MenuListProps={{
          sx: {
            maxWidth: 320,
          },
        }}
      >
        {notifications.map((notification, index) => (
          <NotificationsMenuItem
            key={`${notification.initiatorId}${notification.createdAt}${index}`}
            onClick={() =>
              handleNotificationsMenuItemClick(notification.initiatorId)
            }
            {...notification}
          />
        ))}
      </Menu>
    </>
  );
};

export default NotificationsMenu;
