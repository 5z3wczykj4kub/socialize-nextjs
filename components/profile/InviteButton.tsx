import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import getFriendsStatusAction from '../../lib/functions/getFriendsStatusAction';
import getInviteButtonIconByFriendsStatusAction from '../../lib/functions/getInviteButtonIconByFriendsStatusAction';
import { User } from '../../models/User';
import { useSendFriendInviteMutation } from '../../RTKQ/api';

interface InviteButtonProps {
  profile: Omit<User, 'password'>;
  user: Omit<User, 'password'>;
}

const InviteButton = ({ profile, user }: InviteButtonProps) => {
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
      endIcon={getInviteButtonIconByFriendsStatusAction(friendsStatusAction)}
      onClick={handleLoadingButtonClick}
      sx={{ flexShrink: 0 }}
    >
      {friendsStatusAction}
    </LoadingButton>
  );
};

export default InviteButton;
