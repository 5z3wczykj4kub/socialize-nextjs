import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Paper, Tab } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { User } from '../../models/User';
import AboutTab from './AboutTab';
import FriendsTab, { FriendsTabProps } from './FriendsTab';
import ProfileTab from './ProfileTab';

interface ProfileTabsProps {
  profile: Omit<User, 'password'>;
  disabled?: boolean;
}

const ProfileTabs = ({ profile, disabled = false }: ProfileTabsProps) => {
  const [value, setValue] = useState(disabled ? 'About' : 'Profile');

  const handleChange = (event: SyntheticEvent, value: string) =>
    setValue(value);

  useEffect(() => {
    if (disabled) setValue('About');
  }, [disabled]);

  return (
    <TabContext value={value}>
      <Paper elevation={4} sx={{ mt: 1.5 }}>
        <TabList onChange={handleChange}>
          <Tab
            label='Profile'
            value='Profile'
            disabled={disabled}
            sx={{ p: 2.5 }}
          />
          <Tab
            label='Friends'
            value='Friends'
            disabled={disabled}
            sx={{ p: 2.5 }}
          />
          <Tab label='About' value='About' sx={{ p: 2.5 }} />
        </TabList>
      </Paper>
      <TabPanel value='Profile' sx={{ mt: 1.5, p: 0 }}>
        <ProfileTab />
      </TabPanel>
      <TabPanel value='Friends' sx={{ mt: 1.5, p: 0 }}>
        <FriendsTab friends={profile.friends as FriendsTabProps['friends']} />
      </TabPanel>
      <TabPanel value='About' sx={{ mt: 1.5, p: 0 }}>
        <AboutTab {...profile} />
      </TabPanel>
    </TabContext>
  );
};

export default ProfileTabs;
