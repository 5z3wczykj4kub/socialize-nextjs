import { NextApiHandler } from 'next';
import connectToMongoDB from '../../../../../lib/db/connect';
import { withSessionRoute } from '../../../../../lib/session';

type RequestQuery = {
  requesterId: string;
};

type RequestBody = {
  receiverId: string;
};

const friendsApiHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { profileId } = req.session;
  if (!profileId) return res.status(401).end();

  const { requesterId } = req.query as RequestQuery;
  if (profileId !== requesterId) return res.status(403);

  const { receiverId } = req.body as RequestBody;
  if (!receiverId) return res.status(422).json({ message: 'Unknown receiver' });

  await connectToMongoDB();

  /**
   * TODO:
   * Throw error if friendship already exists:
   * check for objects where `requesterId` and `receiverId`
   * equal those from payload as well as the other way around,
   * meaning, check for objects where `receiverId` is equal to `requesterId` from payload etc.
   */
};

export default withSessionRoute(friendsApiHandler);
