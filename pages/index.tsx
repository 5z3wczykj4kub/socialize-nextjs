import type { GetServerSideProps, NextPage } from 'next';
import Navbar from '../components/layout/Navbar/Navbar';
import connectToMongoDB from '../lib/db/connect';
import { withSessionSsr } from '../lib/session';
import User, { User as IUser } from '../models/User';

/**
 * TODO:
 * 1. Handle authentication loading states:
 * - signing up, signing in, signing out.
 * 2. Handle general SSR loading states.
 */
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

    return {
      props: {
        profile: profile.format(),
      },
    };
  }
);

interface HomeProps {
  profile: IUser;
}

const Home: NextPage<HomeProps> = ({ profile }) => {
  return (
    <>
      <Navbar.Authenticated
        profileId={profile.id}
        notifications={profile.notifications}
      />
    </>
  );
};

export { getServerSideProps };

export default Home;
