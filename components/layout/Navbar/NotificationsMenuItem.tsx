import { Avatar, MenuItem, Stack, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { MouseEventHandler } from 'react';
import { Notification } from '../../../models/User';

interface NotificationsMenuItemProps extends Notification {
  onClick: MouseEventHandler;
}

const NotificationsMenuItem = ({
  createdAt,
  message,
  read,
  onClick,
}: NotificationsMenuItemProps) => {
  return (
    <MenuItem
      disabled={read}
      onClick={onClick}
      sx={{
        columnGap: 2,
      }}
    >
      <Stack rowGap={0.5}>
        <Stack direction='row' alignItems='center' columnGap={2}>
          <Avatar sx={{ width: 28, height: 28 }} />
          <Typography
            sx={{
              whiteSpace: 'normal',
              overflowWrap: 'anywhere',
            }}
          >
            <b>{message.split(' ').slice(0, 2).join(' ')}</b>{' '}
            {message.split(' ').slice(2).join(' ')}
          </Typography>
        </Stack>
        <Typography fontSize='small' color='gray' ml='auto'>
          {formatDistanceToNow(new Date(createdAt!), { addSuffix: true })}
        </Typography>
      </Stack>
    </MenuItem>
  );
};

export default NotificationsMenuItem;
