import { Notifications } from '@mui/icons-material';
import { Badge, IconButton } from '@mui/material';

const NotificationsButton = () => {
  return (
    <IconButton>
      <Badge badgeContent={1} color='primary'>
        <Notifications />
      </Badge>
    </IconButton>
  );
};

export default NotificationsButton;
