import { NextApiHandler } from 'next';
import { withSessionRoute } from '../../../../lib/session';
import User from '../../../../models/User';

const notificationApiHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'PATCH') return res.status(405).end();

  const { profileId } = req.session;
  if (!profileId) return res.status(401).end();

  const profile = await User.findById(profileId);
  if (!profile) return res.status(404).json({ message: 'Profile not found' });

  const { notificationId } = req.query as {
    notificationId: string;
  };

  /**
   * TODO:
   * Iterating through the array seems ineffective
   * as this kind of task should probably be handled by the database.
   */
  const notification = profile.notifications.find(
    (notification) => notification._id.toString() === notificationId
  );

  if (!notification)
    return res.status(404).json({ message: 'Notification not found' });

  notification.read = true;

  try {
    profile.save();
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json(error);
  }
};

export default withSessionRoute(notificationApiHandler);
