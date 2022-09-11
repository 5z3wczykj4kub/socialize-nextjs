import {
  Avatar,
  Grid,
  ListItemButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { User } from '../../models/User';

interface FriendsTabProps {
  friends: Pick<User, 'id' | 'firstName' | 'lastName'>[];
}

const FriendsTab = ({ friends = [] }: FriendsTabProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Paper elevation={4} sx={{ width: '100%', overflow: 'hidden' }}>
      <Grid container>
        {friends.map(({ id, firstName, lastName }) => (
          <Grid item xs={12} sm={6} key={id}>
            <Link href={`/users/${id}`}>
              <ListItemButton href={`/users/${id}`} sx={{ py: 2 }}>
                <Stack
                  direction='row'
                  alignItems='center'
                  columnGap={2}
                  sx={{ overflowX: 'hidden' }}
                >
                  <Avatar variant={matches ? 'rounded' : 'circular'} />
                  <Typography noWrap>
                    {firstName} {lastName}
                  </Typography>
                </Stack>
              </ListItemButton>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export type { FriendsTabProps };

export default FriendsTab;
