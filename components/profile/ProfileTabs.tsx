import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Paper, Tab } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { User } from '../../models/User';
import AboutTab from './AboutTab';
import FriendsTab from './FriendsTab';
import ProfileTab from './ProfileTab';

interface ProfileTabsProps {
  profile: Omit<User, 'password'>;
}

const ProfileTabs = ({ profile }: ProfileTabsProps) => {
  const [value, setValue] = useState('Profile');

  const handleChange = (event: SyntheticEvent, value: string) =>
    setValue(value);

  return (
    <TabContext value={value}>
      <Paper elevation={4} sx={{ mt: 1.5 }}>
        <TabList onChange={handleChange}>
          <Tab label='Profile' value='Profile' sx={{ p: 2.5 }} />
          <Tab label='Friends' value='Friends' sx={{ p: 2.5 }} />
          <Tab label='About' value='About' sx={{ p: 2.5 }} />
        </TabList>
      </Paper>
      <TabPanel value='Profile' sx={{ mt: 1.5, p: 0 }}>
        <ProfileTab />
      </TabPanel>
      <TabPanel value='Friends' sx={{ mt: 1.5, p: 0 }}>
        <FriendsTab />
      </TabPanel>
      <TabPanel value='About' sx={{ mt: 1.5, p: 0 }}>
        <AboutTab {...profile} />
      </TabPanel>
    </TabContext>
  );
};

export default ProfileTabs;
