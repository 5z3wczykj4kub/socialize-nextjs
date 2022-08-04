import { Avatar, Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface ProfileHeaderProps {
  children: ReactNode;
}

const ProfileHeader = ({ children }: ProfileHeaderProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Paper elevation={4} sx={{ p: 2.5 }}>
      <Paper sx={{ position: 'relative', height: matches ? 300 : 150, p: 2.5 }}>
        <Avatar
          sx={{
            position: 'absolute',
            bottom: 0,
            left: matches ? 0 : '50%',
            transform: matches ? 'translate(0, 50%)' : 'translate(-50%, 50%)',
            width: matches ? 150 : 100,
            height: matches ? 150 : 100,
            ml: matches ? 9.375 : 0,
          }}
        />
      </Paper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: matches ? 'row' : 'column',
          [matches ? 'justifyContent' : 'alignItems']: matches
            ? 'space-between'
            : 'center',
          rowGap: 2,
          mt: matches ? 3 : 8.5,
          mb: matches ? 2 : 0,
          ml: matches ? 9.375 * 3 + 3 : 0,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default ProfileHeader;
