import {
  Avatar,
  Divider,
  Grid,
  Link as MuiLink,
  ListItemButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import AboutTab from './AboutTab';

const ProfileTab = (
  props: Omit<User, 'password'> & {
    posts?: Omit<Post, 'authorId'>[] & {
      author: Pick<User, 'id' | 'firstName' | 'lastName'>;
    };
    setTabValue: Dispatch<SetStateAction<string>>;
  }
) => {
  const { friends, posts, setTabValue } = props;

  const handleSeeAllLinkClick = () => setTabValue('Friends');
  /**
   * TODO:
   * Create post component.
   */
  return (
    <Grid container columnSpacing={1.5}>
      <Grid
        item
        md={4}
        sx={{
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        <Grid container rowSpacing={1.5}>
          <Grid item xs={12}>
            <AboutTab {...props} />
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={4} sx={{ width: '100%', overflow: 'hidden' }}>
              <Stack
                direction='row'
                justifyContent='space-between'
                sx={{ p: 2, pb: 1.5 }}
              >
                <Typography>
                  Friends{' '}
                  <Typography component='span' fontSize='small' color='gray'>
                    {friends.length}
                  </Typography>
                </Typography>
                <MuiLink
                  href='#'
                  underline='hover'
                  onClick={handleSeeAllLinkClick}
                >
                  See all
                </MuiLink>
              </Stack>
              <Divider />
              <Grid container>
                {(friends as Pick<User, 'id' | 'firstName' | 'lastName'>[])
                  .slice(0, 9)
                  .map(({ id, firstName, lastName }) => (
                    <Grid item xs={6} key={id}>
                      <Link href={`/users/${id}`}>
                        <ListItemButton href={`/users/${id}`} sx={{ py: 2 }}>
                          <Stack
                            direction='row'
                            alignItems='center'
                            columnGap={2}
                            sx={{ overflowX: 'hidden' }}
                          >
                            <Avatar
                              variant='rounded'
                              sx={{
                                width: 60,
                                height: 60,
                              }}
                            />
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
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper elevation={4} sx={{ width: '100%', p: 2.5 }}>
          {JSON.stringify(posts, null, 2)}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProfileTab;
