import { Paper, Stack } from '@mui/material';
import { ReactNode } from 'react';

interface AboutListProps {
  children: ReactNode;
}

const AboutList = ({ children }: AboutListProps) => {
  return (
    <Paper elevation={4} sx={{ width: '100%', p: 2.5 }}>
      <Stack rowGap={2}>{children}</Stack>
    </Paper>
  );
};

export default AboutList;
