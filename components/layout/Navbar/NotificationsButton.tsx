import { Notifications } from '@mui/icons-material';
import { Badge, IconButton } from '@mui/material';
import { Notification } from '../../../models/User';

// TODO: Consider renaming to `NotificationMenu`
interface NotificationsButtonProps {
  notifications: Notification[];
}

const NotificationsButton = ({ notifications }: NotificationsButtonProps) => {
  return (
    <IconButton>
      <Badge badgeContent={notifications.length} color='primary'>
        <Notifications />
      </Badge>
    </IconButton>
  );
};

export default NotificationsButton;
