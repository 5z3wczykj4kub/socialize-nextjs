import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import { FriendsStatusAction } from './getFriendsStatusAction';

const getFriendsStatusButtonIconByFriendsStatusAction = (
  action: FriendsStatusAction
) =>
  action === 'invite' || action === 'disable' ? (
    <PersonAddIcon />
  ) : action === 'cancel' ? (
    <PersonAddDisabledIcon />
  ) : (
    <ExpandMoreIcon />
  );

export default getFriendsStatusButtonIconByFriendsStatusAction;
