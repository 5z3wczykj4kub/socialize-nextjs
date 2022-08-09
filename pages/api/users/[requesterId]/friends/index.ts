import { NextApiHandler } from 'next';
import connectToMongoDB from '../../../../../lib/db/connect';
import { withSessionRoute } from '../../../../../lib/session';
import User, { Friend } from '../../../../../models/User';

type RequestQuery = {
  requesterId: string;
  receiverId: string;
};

const friendsApiHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { profileId } = req.session;
  if (!profileId) return res.status(401).end();

  const { requesterId, receiverId } = req.query as RequestQuery;
  if (!requesterId)
    return res.status(422).json({ message: 'Unknown requester' });
  if (!receiverId) return res.status(422).json({ message: 'Unknown receiver' });

  if (requesterId === receiverId)
    return res.status(422).json({ message: 'User cannot invite himself' });

  if (profileId !== requesterId) return res.status(403).end();

  await connectToMongoDB();

  const requester = await User.findById(requesterId);
  if (!requester)
    return res.status(404).json({ message: 'Requester not found' });

  const receiver = await User.findById(receiverId);
  if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

  const isFriends = (friend: Friend) =>
    (friend.requesterId.toString() === requesterId &&
      friend.receiverId.toString() === receiverId) ||
    (friend.requesterId.toString() === receiverId &&
      friend.receiverId.toString() === requesterId);

  const isRequesterFriendsWithReceiver = (requester.friends as Friend[]).some(
    isFriends
  );
  const isReceiverFriendsWithRequester = (receiver.friends as Friend[]).some(
    isFriends
  );

  if (isRequesterFriendsWithReceiver || isReceiverFriendsWithRequester)
    return res.status(422).json({ message: 'Friendship already exists' });

  const friend: Friend = {
    requesterId,
    receiverId,
    status: 'pending',
  };
  (requester.friends as Friend[]).push(friend);
  (receiver.friends as Friend[]).push(friend);

  try {
    await Promise.all([requester.save(), receiver.save()]);
    return res.status(201).end();
  } catch (error) {
    return res.status(500).json(error);
  }
};

export default withSessionRoute(friendsApiHandler);