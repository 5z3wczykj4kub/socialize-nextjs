import { Stack, SvgIconTypeMap, Typography } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { createElement, ReactNode } from 'react';

interface AboutListItemProps {
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
  children: ReactNode;
}

const AboutListItem = ({ icon, children }: AboutListItemProps) => {
  return (
    <Stack direction='row' alignItems='center' columnGap={2}>
      {createElement(icon)}
      <Typography
        sx={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
};

export default AboutListItem;
