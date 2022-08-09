import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { LoadingButton } from '@mui/lab';
import { Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import Navbar from '../../../components/layout/Navbar/Navbar';
import ProfileBody from '../../../components/profile/ProfileBody';
import ProfileHeader from '../../../components/profile/ProfileHeader';
import connectToMongoDB from '../../../lib/db/connect';
import { withSessionSsr } from '../../../lib/session';
import User, { User as IUser } from '../../../models/User';

const getServerSideProps: GetServerSideProps = withSessionSsr(
  async ({ req, params }) => {
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

    const { userId } = params as { userId: string };

    const user = await User.findById(userId);

    if (!user)
      return {
        redirect: {
          destination: '/404',
          permanent: false,
          statusCode: 404,
        },
      };

    return {
      props: {
        profile: profile.format(),
        user: user.format(),
      },
    };
  }
);

interface ProfileProps {
  profile: Omit<IUser, 'password'>;
  user: Omit<IUser, 'password'>;
}

const Profile: NextPage<ProfileProps> = ({ profile, user }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <>
      <Navbar.Authenticated profileId={profile.id} />
      <Container
        maxWidth='lg'
        sx={{
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
          transform: { xs: 'translateY(56px)', sm: 'translateY(64px)' },
          py: { xs: 2, sm: 3 },
        }}
      >
        <ProfileHeader>
          <Typography
            variant='h5'
            align={matches ? 'left' : 'center'}
            sx={{
              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {fullName}
          </Typography>
          {profile.id !== user.id && (
            <LoadingButton
              variant='outlined'
              loadingPosition='end'
              endIcon={<PersonAddIcon />}
              sx={{ flexShrink: 0 }}
            >
              Add
            </LoadingButton>
          )}
        </ProfileHeader>
        <ProfileBody about={user} />
      </Container>
    </>
  );
};

export { getServerSideProps };

export default Profile;