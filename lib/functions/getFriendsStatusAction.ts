import { Friend, User } from '../../models/User';

type FriendsStatusAction =
  | 'invite'
  | 'cancel'
  | 'respond'
  | 'remove'
  | 'disable';

const getFriendsStatusAction = (
  profile: Omit<User, 'password'>,
  user: Omit<User, 'password'>
): FriendsStatusAction => {
  const friends = profile.friends as Friend[];
  const friend = friends.find(
    (friend) => friend.requesterId === user.id || friend.receiverId === user.id
  );

  if (
    !friend ||
    (friend.requesterId === user.id && friend.status === 'rejected')
  )
    return 'invite';
  if (friend.requesterId === profile.id && friend.status === 'pending')
    return 'cancel';
  if (friend.requesterId === user.id && friend.status === 'pending')
    return 'respond';
  if (friend.requesterId === profile.id && friend.status === 'rejected')
    return 'disable';
  if (friend.status === 'accepted') return 'remove';

  throw new Error('Function returned unexpectedly');
};

export type { FriendsStatusAction };

export default getFriendsStatusAction;
