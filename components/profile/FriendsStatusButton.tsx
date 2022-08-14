import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
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

  const [sendFriendInvite, { isLoading: isSendingFriendInvite }] =
    useSendFriendInviteMutation();

  const [cancelFriendInvite, { isLoading: isCancelingFriendInvite }] =
    useCancelFriendInviteMutation();

  const handleLoadingButtonClick = async () => {
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
    } catch (error) {}
  };

  return (
    <LoadingButton
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
  );
};

export default FriendsStatusButton;
