import { NextApiHandler } from 'next';
import connectToMongoDB from '../../../lib/db/connect';
import { getUsersBySearch } from '../../../lib/db/queries';
import { withSessionRoute } from '../../../lib/session';

type RequestQuery = {
  search: string | undefined;
};

// TODO: Exclude everything but id, first name and last name
const searchApiHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  if (!req.session.profileId) return res.status(401).end();

  const { search } = req.query as RequestQuery;
  await connectToMongoDB();
  const users = await getUsersBySearch(search);
  return res.json(users);
};

export default withSessionRoute(searchApiHandler);
