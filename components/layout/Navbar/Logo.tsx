import { Typography } from '@mui/material';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href='/'>
      <Typography sx={{ cursor: 'pointer' }}>SOCIALIZE</Typography>
    </Link>
  );
};

export default Logo;
