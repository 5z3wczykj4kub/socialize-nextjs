import { NextApiHandler } from 'next';
import { withSessionRoute } from '../../lib/session';

const signInApiHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    req.session.destroy();
    return res.end();
  } catch (error) {
    return res.status(500).json({ message: 'Signing out failed unexpectedly' });
  }
};

export default withSessionRoute(signInApiHandler);
