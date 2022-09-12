import { Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import Navbar from '../../../components/layout/Navbar/Navbar';
import FriendsStatusButton from '../../../components/profile/FriendsStatusButton';
import ProfileBody from '../../../components/profile/ProfileBody';
import ProfileHeader from '../../../components/profile/ProfileHeader';
import connectToMongoDB from '../../../lib/db/connect';
import getFriendsStatusAction from '../../../lib/functions/getFriendsStatusAction';
import { withSessionSsr } from '../../../lib/session';
import Post, { Post as IPost } from '../../../models/Post';
import User, { Friend, User as IUser } from '../../../models/User';

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

    const isFriend = (friend: Friend) =>
      (friend.requesterId.toString() === userId ||
        friend.receiverId.toString() === userId) &&
      friend.status === 'accepted';

    const user = await User.findById(
      userId,
      (profile.friends as Friend[]).some(isFriend)
        ? {
            notifications: 0,
          }
        : { friends: 0, notifications: 0 }
    )

      .populate({
        path: 'friends.requesterId',
        select: 'firstName lastName',
      })
      .populate({
        path: 'friends.receiverId',
        select: 'firstName lastName',
      });

    /**
     * FIXME:
     * Very poor query.
     * Friends filtering by status should be done
     * at the database level.
     * This is very suboptimal!
     */
    user!.friends = (user?.friends as Friend[])?.filter(
      (friend) => friend.status === 'accepted'
    );

    let posts: any = [];

    if ((profile.friends as Friend[]).some(isFriend)) {
      posts = await Post.find({ authorId: userId })
        .populate('authorId', '_id firstName lastName')
        .populate('comments.authorId', '_id firstName lastName');
    }

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
        key: user.id.toString(),
        profile: profile.format(),
        user: (profile.friends as Friend[]).some(isFriend)
          ? { ...user.format(), posts: posts.map((post: any) => post.format()) }
          : user.format(),
      },
    };
  }
);

interface ProfileProps {
  profile: Omit<IUser, 'password'>;
  user: Omit<IUser, 'password'> & {
    posts?: Omit<IPost, 'authorId'>[] & {
      author: Pick<IUser, 'id' | 'firstName' | 'lastName'>;
    };
  };
}

const Profile: NextPage<ProfileProps> = ({ profile, user }) => {
  const [isProfileBodyDisabled, setIsProfileBodyDisabled] = useState(
    profile.id !== user.id
      ? getFriendsStatusAction(profile, user) !== 'remove'
      : false
  );

  const handleAcceptFriendRequest = () => setIsProfileBodyDisabled(false);
  const handleFriendRemove = () => setIsProfileBodyDisabled(true);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const fullName = `${user.firstName} ${user.lastName}`;

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
        <ProfileHeader
          profileInitials={`${user.firstName[0]}${user.lastName[0]}`}
        >
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
            <FriendsStatusButton
              profile={profile}
              user={user}
              onAccept={handleAcceptFriendRequest}
              onRemove={handleFriendRemove}
            />
          )}
        </ProfileHeader>
        <ProfileBody profile={user} disabled={isProfileBodyDisabled} />
      </Container>
    </>
  );
};

export { getServerSideProps };

export default Profile;
