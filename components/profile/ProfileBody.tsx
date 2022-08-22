import { User } from '../../models/User';
import ProfileTabs from './ProfileTabs';

interface ProfileBodyProps {
  about: Omit<User, 'password'>;
  disabled?: boolean;
}

const ProfileBody = ({ about, disabled = false }: ProfileBodyProps) => {
  return <ProfileTabs about={about} disabled={disabled} />;
};

export default ProfileBody;
