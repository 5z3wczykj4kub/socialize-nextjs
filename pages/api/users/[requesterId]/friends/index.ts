import { NextApiHandler } from 'next';
import connectToMongoDB from '../../../../../lib/db/connect';
import { withSessionRoute } from '../../../../../lib/session';
import User, { Friend } from '../../../../../models/User';

const friendsApiHandler: NextApiHandler = async (req, res) => {
  const { profileId } = req.session;
  if (!profileId) return res.status(401).end();

  const { requesterId, receiverId } = req.query as {
    requesterId: string;
    receiverId: string;
  };
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

  const requesterFriend = (requester.friends as Friend[]).find(isFriends);
  const receiverFriend = (receiver.friends as Friend[]).find(isFriends);

  if (
    JSON.stringify({
      requesterId: requesterFriend?.requesterId,
      receiverId: requesterFriend?.receiverId,
      status: requesterFriend?.status,
    }) !==
    JSON.stringify({
      requesterId: receiverFriend?.requesterId,
      receiverId: receiverFriend?.receiverId,
      status: receiverFriend?.status,
    })
  )
    return res
      .status(500)
      .json({ message: "Requester's and receiver's friendship differs" });

  if (req.method === 'PUT') {
    if (
      !(
        (!requesterFriend && !receiverFriend) ||
        (requesterFriend?.status === 'rejected' &&
          receiverFriend?.status === 'rejected')
      )
    )
      return res.status(409).end();

    if (!requesterFriend && !receiverFriend) {
      const friend: Friend = {
        requesterId,
        receiverId,
        status: 'pending',
      };
      (requester.friends as Friend[]).push(friend);
      (receiver.friends as Friend[]).push(friend);
      res.status(201);
    }

    if (
      requesterFriend?.status === 'rejected' &&
      receiverFriend?.status === 'rejected'
    ) {
      requesterFriend.status = 'pending';
      requesterFriend.requesterId = requester.id;
      requesterFriend.receiverId = receiver.id;
      receiverFriend.status = 'pending';
      receiverFriend.requesterId = requester.id;
      receiverFriend.receiverId = receiver.id;
      res.status(204);
    }

    try {
      await Promise.all([requester.save(), receiver.save()]);
      return res.end();
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  if (req.method === 'DELETE') {
    if (
      !(
        (requesterFriend?.status === 'pending' &&
          receiverFriend?.status === 'pending') ||
        (requesterFriend?.status === 'accepted' &&
          receiverFriend?.status === 'accepted')
      )
    )
      return res.status(409).end();

    const isNotFriends = (friend: Friend) =>
      !(
        (friend.requesterId.toString() === requesterId &&
          friend.receiverId.toString() === receiverId) ||
        (friend.requesterId.toString() === receiverId &&
          friend.receiverId.toString() === requesterId)
      );

    requester.friends = (requester.friends as Friend[]).filter(isNotFriends);
    receiver.friends = (receiver.friends as Friend[]).filter(isNotFriends);

    try {
      await Promise.all([requester.save(), receiver.save()]);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  if (req.method === 'PATCH') {
    if (
      requesterFriend?.status !== 'pending' ||
      receiverFriend?.status !== 'pending'
    )
      return res.status(409).end();

    const { response } = req.body as { response: 'accept' | 'reject' };

    if (response !== 'accept' && response !== 'reject')
      return res.status(422).json({
        message:
          "Response to a friend request must be either 'accept' or 'reject'",
      });

    requester.friends = (requester.friends as Friend[]).map((friend) => {
      if (isFriends(friend))
        return {
          ...friend,
          status: response === 'accept' ? 'accepted' : 'rejected',
        };
      return friend;
    }) as Friend[];
    receiver.friends = (receiver.friends as Friend[]).map((friend) => {
      if (isFriends(friend))
        return {
          ...friend,
          status: response === 'accept' ? 'accepted' : 'rejected',
        };
      return friend;
    }) as Friend[];

    try {
      await Promise.all([requester.save(), receiver.save()]);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  return res.status(405).end();
};

export default withSessionRoute(friendsApiHandler);
