import { NextApiHandler } from 'next';
import MongoDBConnector from '../../lib/MongoDBConnector';
import { withSessionRoute } from '../../lib/session';
import User from '../../models/User';

type RequestQuery = {
  search: string | undefined;
};

const searchApiHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  if (!req.session.profileId) return res.status(401).end();

  const { search } = req.query as RequestQuery;

  await MongoDBConnector();

  // TODO: Extract query to a helper function
  const users = (
    await User.populate(
      (
        await User.aggregate([
          {
            $project: { search: { $concat: ['$firstName', ' ', '$lastName'] } },
          },
          {
            $match: { search: { $regex: search?.trim() || '', $options: 'i' } },
          },
        ])
      ).map(({ _id }) => ({ _id })),
      { path: '_id' }
    )
  ).map(({ _id }) => ({ ..._id.format() }));

  return res.json(users);
};

export default withSessionRoute(searchApiHandler);
