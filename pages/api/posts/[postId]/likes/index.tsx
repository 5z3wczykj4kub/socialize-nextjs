import { NextApiHandler } from 'next';
import { ValidationError } from 'yup';
import connectToMongoDB from '../../../../../lib/db/connect';
import { withSessionRoute } from '../../../../../lib/session';
import Post from '../../../../../models/Post';

const likesApiHandler: NextApiHandler = async (req, res) => {
  const { profileId } = req.session;
  if (!profileId) return res.status(401).end();

  const { postId } = req.query as {
    postId: string;
  };

  if (!postId) return res.status(422).json({ message: 'Missing post id' });

  await connectToMongoDB();

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  /**
   * TODO:
   * Missing guard clause.
   * Should be checking if the person liking post
   * is a friend of the post's author.
   */

  try {
    if (req.method === 'POST') {
      if (post.likes.includes(profileId))
        return res.status(422).json({ message: 'Post already liked' });
      post.likes.push(profileId);
      await post.save();
      return res.status(201).end();
    }
    if (req.method === 'DELETE') {
      if (!post.likes.includes(profileId))
        return res.status(422).json({ message: 'Post not liked' });
      post.likes = post.likes.filter((like) => like.toString() !== profileId);
      await post.save();
      return res.status(201).end();
    }
  } catch (error) {
    const { message, errors } = error as ValidationError;
    return res.status(422).json({ message, errors });
  }

  return res.status(405).end();
};

export default withSessionRoute(likesApiHandler);
