import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import { LoadingButton } from '@mui/lab';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import { MouseEvent, useRef, useState } from 'react';
import getFriendsStatusAction from '../../lib/functions/getFriendsStatusAction';
import getFriendsStatusButtonIconByFriendsStatusAction from '../../lib/functions/getFriendsStatusButtonIconByFriendsStatusAction';
import { User } from '../../models/User';
import {
  useCancelFriendInviteMutation,
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

  const [cancelFriendInvite, { isLoading: isCancelingFriendInvite }] =
    useCancelFriendInviteMutation();

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
        await cancelFriendInvite({
          requesterId: profile.id,
          receiverId: user.id,
        }).unwrap();
        setFriendsStatusAction('invite');
      }
      if (friendsStatusAction === 'respond') {
        handleMenuOpen(event);
      }
    } catch (error) {}
  };

  const handleAcceptMenuItemClick = () => {
    handleMenuClose();
    /**
     * TODO:
     * Handle accepting friend request.
     */
    console.log('accept');
  };

  const handleRejectMenuItemClick = () => {
    handleMenuClose();
    /**
     * TODO:
     * Handle rejecting friend request.
     */
    console.log('reject');
  };

  const loadingButtonRef = useRef<HTMLButtonElement>(null);
  const loadingButtonWidth =
    loadingButtonRef.current?.getBoundingClientRect().width;

  return (
    <>
      <LoadingButton
        ref={loadingButtonRef}
        variant='outlined'
        loading={isSendingFriendInvite || isCancelingFriendInvite}
        loadingPosition='end'
        endIcon={getFriendsStatusButtonIconByFriendsStatusAction(
          friendsStatusAction
        )}
        onClick={handleLoadingButtonClick}
        sx={{ flexShrink: 0 }}
      >
        {friendsStatusAction}
      </LoadingButton>
      <Menu open={isMenuOpen} anchorEl={menuAnchorEl} onClose={handleMenuClose}>
        <MenuItem
          onClick={handleAcceptMenuItemClick}
          sx={{ width: loadingButtonWidth }}
        >
          <ListItemIcon>
            <PersonAddIcon fontSize='small' />
          </ListItemIcon>
          Accept
        </MenuItem>
        <MenuItem
          onClick={handleRejectMenuItemClick}
          sx={{ width: loadingButtonWidth }}
        >
          <ListItemIcon>
            <PersonAddDisabledIcon fontSize='small' />
          </ListItemIcon>
          Reject
        </MenuItem>
      </Menu>
    </>
  );
};

export default FriendsStatusButton;
