import { User } from '../../models/User';
import ProfileTabs from './ProfileTabs';

interface ProfileBodyProps {
  profile: Omit<User, 'password'>;
}

const ProfileBody = ({ profile }: ProfileBodyProps) => {
  return <ProfileTabs profile={profile} />;
};

export default ProfileBody;
