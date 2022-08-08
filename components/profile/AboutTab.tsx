import CakeIcon from '@mui/icons-material/Cake';
import EmailIcon from '@mui/icons-material/Email';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import { User } from '../../models/User';
import AboutList from './AboutList';
import AboutListItem from './AboutListItem';

const AboutTab = ({
  email,
  firstName,
  lastName,
  gender,
  dateOfBirth,
  residence,
}: Omit<User, 'password'>) => {
  const fullName = `${firstName} ${lastName}`;
  const dateOfBirthFormatted = new Date(dateOfBirth).toLocaleDateString(
    'en-us',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <AboutList>
      <AboutListItem icon={EmailIcon}>{email}</AboutListItem>
      <AboutListItem icon={PersonIcon}>{fullName}</AboutListItem>
      <AboutListItem icon={gender === 'female' ? FemaleIcon : MaleIcon}>
        {gender}
      </AboutListItem>
      <AboutListItem icon={CakeIcon}>{dateOfBirthFormatted}</AboutListItem>
      <AboutListItem icon={PlaceIcon}>{residence}</AboutListItem>
    </AboutList>
  );
};

export default AboutTab;
