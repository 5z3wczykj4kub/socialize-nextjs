import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { MouseEvent, useRef, useState } from 'react';
import getFriendsStatusAction from '../../lib/functions/getFriendsStatusAction';
import getFriendsStatusButtonIconByFriendsStatusAction from '../../lib/functions/getFriendsStatusButtonIconByFriendsStatusAction';
import { User } from '../../models/User';
import {
  useCancelInviteOrRemoveFriendMutation,
  useRespondToFriendInviteMutation,
  useSendFriendInviteMutation,
} from '../../RTKQ/api';

interface FriendsStatusButtonProps {
  profile: Omit<User, 'password'>;
  user: Omit<User, 'password'>;
}

const FriendsStatusButton = ({ profile, user }: FriendsStatusButtonProps) => {
  const [friendsStatusAction, setFriendsStatusAction] = useState(
    getFriendsStatusAction(profile, user)
  );

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = !!menuAnchorEl;

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) =>
    setMenuAnchorEl(event.currentTarget);

  const handleMenuClose = () => setMenuAnchorEl(null);

  const [sendFriendInvite, { isLoading: isSendingFriendInvite }] =
    useSendFriendInviteMutation();

  const [cancelInviteOrRemoveFriend, { isLoading: isCancelingFriendInvite }] =
    useCancelInviteOrRemoveFriendMutation();

  const [respondToFriendInvite, { isLoading: isRespondingToFriendInvite }] =
    useRespondToFriendInviteMutation();

  const handleLoadingButtonClick = async (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    try {
      if (friendsStatusAction === 'invite') {
        await sendFriendInvite({
          requesterId: profile.id,
          receiverId: user.id,
        }).unwrap();
        setFriendsStatusAction('cancel');
      }
      if (friendsStatusAction === 'cancel') {
        await cancelInviteOrRemoveFriend({
          requesterId: profile.id,
          receiverId: user.id,
        }).unwrap();
        setFriendsStatusAction('invite');
      }
      if (
        friendsStatusAction === 'respond' ||
        friendsStatusAction === 'remove'
      ) {
        handleMenuOpen(event);
      }
    } catch (error) {}
  };

  const handleAcceptMenuItemClick = async () => {
    handleMenuClose();
    await respondToFriendInvite({
      requesterId: profile.id,
      receiverId: user.id,
      response: 'accept',
    }).unwrap();
    setFriendsStatusAction('remove');
  };

  const handleRejectMenuItemClick = async () => {
    handleMenuClose();
    await respondToFriendInvite({
      requesterId: profile.id,
      receiverId: user.id,
      response: 'reject',
    }).unwrap();
    setFriendsStatusAction('invite');
  };

  const handleRemoveMenuItemClick = async () => {
    handleMenuClose();
    await cancelInviteOrRemoveFriend({
      requesterId: profile.id,
      receiverId: user.id,
    }).unwrap();
    setFriendsStatusAction('invite');
  };

  const loadingButtonRef = useRef<HTMLButtonElement>(null);
  const loadingButtonWidth =
    loadingButtonRef.current?.getBoundingClientRect().width;

  const isInviteDisabled = friendsStatusAction === 'disable';

  const friendFullName = `${user.firstName} ${user.lastName}`;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <>
      <Tooltip
        title={
          isInviteDisabled
            ? `${friendFullName} has rejected your friend request`
            : ''
        }
        placement={matches ? 'left' : 'bottom'}
      >
        <Box>
          <LoadingButton
            ref={loadingButtonRef}
            variant='outlined'
            loading={
              isSendingFriendInvite ||
              isCancelingFriendInvite ||
              isRespondingToFriendInvite
            }
            loadingPosition='end'
            endIcon={getFriendsStatusButtonIconByFriendsStatusAction(
              friendsStatusAction
            )}
            onClick={handleLoadingButtonClick}
            disabled={isInviteDisabled}
            sx={{ flexShrink: 0 }}
          >
            {isInviteDisabled
              ? 'Invite'
              : friendsStatusAction === 'remove'
              ? 'Friends'
              : friendsStatusAction}
          </LoadingButton>
        </Box>
      </Tooltip>
      <Menu
        open={isMenuOpen}
        anchorEl={menuAnchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {friendsStatusAction === 'respond' && [
          <MenuItem
            key='accept'
            onClick={handleAcceptMenuItemClick}
            sx={{ minWidth: loadingButtonWidth }}
          >
            <ListItemIcon>
              <PersonAddIcon fontSize='small' />
            </ListItemIcon>
            Accept
          </MenuItem>,
          <MenuItem
            key='reject'
            onClick={handleRejectMenuItemClick}
            sx={{ minWidth: loadingButtonWidth }}
          >
            <ListItemIcon>
              <PersonAddDisabledIcon fontSize='small' />
            </ListItemIcon>
            Reject
          </MenuItem>,
        ]}
        {friendsStatusAction === 'remove' && (
          <MenuItem
            onClick={handleRemoveMenuItemClick}
            sx={{ minWidth: loadingButtonWidth }}
          >
            <ListItemIcon>
              <PersonRemoveIcon fontSize='small' />
            </ListItemIcon>
            Remove
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default FriendsStatusButton;
