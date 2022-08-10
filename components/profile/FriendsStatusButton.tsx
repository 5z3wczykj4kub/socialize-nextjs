import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import getFriendsStatusAction from '../../lib/functions/getFriendsStatusAction';
import getFriendsStatusButtonIconByFriendsStatusAction from '../../lib/functions/getFriendsStatusButtonIconByFriendsStatusAction';
import { User } from '../../models/User';
import { useSendFriendInviteMutation } from '../../RTKQ/api';

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

  const handleLoadingButtonClick = async () => {
    try {
      if (friendsStatusAction === 'invite') {
        await sendFriendInvite({
          requesterId: profile.id,
          receiverId: user.id,
        }).unwrap();
        setFriendsStatusAction('cancel');
      }
    } catch (error) {}
  };

  return (
    <LoadingButton
      variant='outlined'
      loading={isSendingFriendInvite}
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
