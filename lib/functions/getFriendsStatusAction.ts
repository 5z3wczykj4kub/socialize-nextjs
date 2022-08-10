import { Friend, User } from '../../models/User';

type FriendsStatusAction = 'invite' | 'cancel' | 'reply';

const getFriendsStatusAction = (
  profile: Omit<User, 'password'>,
  user: Omit<User, 'password'>
): FriendsStatusAction => {
  const friends = profile.friends as Friend[];
  const friend = friends.find(
    (friend) => friend.requesterId === user.id || friend.receiverId === user.id
  );

  if (!friend) return 'invite';
  if (friend.requesterId === profile.id && friend.status === 'pending')
    return 'cancel';
  if (friend.requesterId === user.id && friend.status === 'pending')
    return 'reply';

  throw new Error('Function returned unexpectedly');
};

export type { FriendsStatusAction };

export default getFriendsStatusAction;
