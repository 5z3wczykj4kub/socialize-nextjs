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
import { Post as IPost } from '../../models/Post';
import { User } from '../../models/User';
import Post from '../posts/Post';
import AboutTab from './AboutTab';

type ProfileTabProps = Omit<User, 'password'> & {
  posts?: (Omit<IPost, 'authorId'> & {
    author: Pick<User, 'id' | 'firstName' | 'lastName'>;
  })[];
  setTabValue: Dispatch<SetStateAction<string>>;
};

const ProfileTab = (props: ProfileTabProps) => {
  const { friends = [], posts, setTabValue } = props;

  const handleSeeAllLinkClick = () => setTabValue('Friends');

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
              {friends.length > 0 && <Divider />}
              <Grid container>
                {(friends as Pick<User, 'id' | 'firstName' | 'lastName'>[])
                  .slice(0, 6)
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
                            <Avatar variant='rounded' />
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
        <Grid container rowSpacing={1.5}>
          {posts?.map((post) => (
            <Grid item xs={12} key={post.id}>
              <Post {...post} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfileTab;
