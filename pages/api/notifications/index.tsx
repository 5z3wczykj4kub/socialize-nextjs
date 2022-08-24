import { NextApiHandler } from 'next';
import { withSessionRoute } from '../../../lib/session';
import User from '../../../models/User';

const notificationsApiHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  const { profileId } = req.session;
  if (!profileId) return res.status(401).end();

  const profile = await User.findById(profileId);

  if (!profile) return res.status(404).json({ message: 'Profile not found' });

  return res.json(profile.format().notifications);
};

export default withSessionRoute(notificationsApiHandler);
