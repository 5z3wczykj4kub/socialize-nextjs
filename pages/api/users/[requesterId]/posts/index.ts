import { NextApiHandler } from 'next';
import { ValidationError } from 'yup';
import validationSchema from '../../../../../components/forms/AddPostForm/validationSchema';
import connectToMongoDB from '../../../../../lib/db/connect';
import { withSessionRoute } from '../../../../../lib/session';
import Post, { Post as IPost } from '../../../../../models/Post';
import User from '../../../../../models/User';

const postsApiHandler: NextApiHandler = async (req, res) => {
  const { profileId } = req.session;
  if (!profileId) return res.status(401).end();

  const { requesterId } = req.query as {
    requesterId: string;
  };
  if (!requesterId)
    return res.status(422).json({ message: 'Unknown requester' });

  if (req.method === 'POST') {
    if (profileId !== requesterId) return res.status(403).end();

    const { content } = req.body as Pick<IPost, 'content'>;

    try {
      await validationSchema.validate({ content }, { abortEarly: false });

      await connectToMongoDB();

      const requester = await User.findById(requesterId);
      if (!requester)
        return res.status(404).json({ message: 'Requester not found' });

      const post = new Post({
        authorId: requesterId,
        content,
      });

      await post.save();
      return res.status(201).end();
    } catch (error) {
      const { message, errors } = error as ValidationError;
      return res.status(422).json({ message, errors });
    }
  }

  return res.status(405).end();
};

export default withSessionRoute(postsApiHandler);
