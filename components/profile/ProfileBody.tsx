import { User } from '../../models/User';
import ProfileTabs from './ProfileTabs';

interface ProfileBodyProps {
  about: Omit<User, 'password'>;
}

const ProfileBody = ({ about }: ProfileBodyProps) => {
  return <ProfileTabs about={about} />;
};

export default ProfileBody;
