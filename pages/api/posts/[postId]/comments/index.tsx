import { NextApiHandler } from 'next';
import { ValidationError } from 'yup';
import connectToMongoDB from '../../../../../lib/db/connect';
import { withSessionRoute } from '../../../../../lib/session';
import Post from '../../../../../models/Post';

const commentsApiHandler: NextApiHandler = async (req, res) => {
  const { profileId } = req.session;
  if (!profileId) return res.status(401).end();

  const { postId } = req.query as {
    postId: string;
  };

  if (!postId) return res.status(422).json({ message: 'Missing post id' });

  await connectToMongoDB();

  const post = await Post.findById(postId);
  if (!post) return res.status(402).json({ message: 'Post not found' });

  if (post.authorId.toString() !== profileId) return res.status(403).end();

  if (req.method === 'POST') {
    const { content } = req.body as { content: string };

    try {
      post.comments.push({ authorId: profileId, content });
      await post.save();
      return res.status(201).end();
    } catch (error) {
      const { message, errors } = error as ValidationError;
      return res.status(422).json({ message, errors });
    }
  }

  return res.status(405).end();
};

export default withSessionRoute(commentsApiHandler);
