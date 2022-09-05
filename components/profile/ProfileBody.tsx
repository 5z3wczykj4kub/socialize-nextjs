import { User } from '../../models/User';
import ProfileTabs from './ProfileTabs';

interface ProfileBodyProps {
  profile: Omit<User, 'password'>;
  disabled?: boolean;
}

const ProfileBody = ({ profile, disabled = false }: ProfileBodyProps) => {
  return <ProfileTabs profile={profile} disabled={disabled} />;
};

export default ProfileBody;
