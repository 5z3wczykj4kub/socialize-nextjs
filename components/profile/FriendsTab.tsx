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
import { User } from '../../models/User';

interface FriendsTabProps {
  friends: Pick<User, 'id' | 'firstName' | 'lastName'>[];
}

const FriendsTab = ({ friends }: FriendsTabProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Paper elevation={4} sx={{ width: '100%', overflow: 'hidden' }}>
      <Grid container>
        {friends.map(({ id, firstName, lastName }) => {
          const fullName = `${firstName} ${lastName}`;

          /**
           * TODO:
           * Link to profiles.
           * Add common friends number.
           * Handle text overflow.
           * Remove the dummy array.
           */
          return Array(10)
            .fill(null)
            .map(() => (
              <Grid item xs={12} sm={6}>
                <ListItemButton sx={{ py: 2 }}>
                  <Stack direction='row' alignItems='center' columnGap={2}>
                    <Avatar
                      variant={matches ? 'rounded' : 'circular'}
                      sx={{
                        width: { xs: 40, sm: 60 },
                        height: { xs: 40, sm: 60 },
                      }}
                    />
                    <Typography>{fullName}</Typography>
                  </Stack>
                </ListItemButton>
              </Grid>
            ));
        })}
      </Grid>
    </Paper>
  );
};

export type { FriendsTabProps };

export default FriendsTab;
