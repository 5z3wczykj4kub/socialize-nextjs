import type { GetServerSideProps, NextPage } from 'next';
import Navbar from '../components/layout/Navbar';
import MongoDBConnector from '../lib/MongoDBConnector';
import { withSessionSsr } from '../lib/session';
import User, { User as IUser, UserModelInstance } from '../models/User';

/**
 * TODO:
 * Handle authentication loading states:
 * - signing up, signing in, signing out.
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

    await MongoDBConnector();

    const profile = (await User.findById(profileId)) as UserModelInstance;

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
      <Navbar.Authenticated profileId={profile.id} />
    </>
  );
};

export { getServerSideProps };

export default Home;
