import { Container } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import Navbar from '../components/layout/Navbar/Navbar';
import Wall from '../components/posts/Wall';
import connectToMongoDB from '../lib/db/connect';
import { withSessionSsr } from '../lib/session';
import PostModel, { Post as IPost } from '../models/Post';
import User, { Friend, User as IUser } from '../models/User';

// TODO: Handle  SSR loading states
const getServerSideProps: GetServerSideProps = withSessionSsr(
  async ({ req }) => {
    const { profileId } = req.session;

    if (!profileId)
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };

    await connectToMongoDB();

    const profile = await User.findById(profileId);

    if (!profile)
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };

    const posts = await PostModel.find({
      $or: [
        { authorId: profile.id },
        {
          authorId: {
            $in: (profile.friends as Friend[])
              .filter(({ status }) => status === 'accepted')
              .map(({ requesterId, receiverId }) =>
                requesterId.toString() === profile.id.toString()
                  ? receiverId
                  : requesterId
              ),
          },
        },
      ],
    })
      .sort({ createdAt: 'desc' })
      .populate('authorId', '_id firstName lastName')
      .populate('comments.authorId', '_id firstName lastName');

    return {
      props: {
        profile: profile.format(),
        posts: posts
          .map((post: any) => post.format())
          .map((post: any) => ({
            ...post,
            /**
             * NOTE:
             * Again, such sorting is complete crap.
             * Optimistic update when adding a comment also makes no sene.
             */
            comments: post.comments
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
          })),
      },
    };
  }
);

interface HomeProps {
  profile: IUser;
  posts: Omit<IPost, 'authorId'>[] & {
    author: Pick<IUser, 'id' | 'firstName' | 'lastName'>;
  };
}

const Home: NextPage<HomeProps> = ({ profile, posts }) => {
  return (
    <>
      <Navbar.Authenticated {...profile} />
      <Container
        maxWidth='lg'
        sx={{
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
          transform: { xs: 'translateY(56px)', sm: 'translateY(64px)' },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Wall profile={profile} posts={posts} />
      </Container>
    </>
  );
};

export { getServerSideProps };

export default Home;
