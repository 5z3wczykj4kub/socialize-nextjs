import { Paper } from '@mui/material';
import React from 'react';
import { Post } from '../../models/Post';
import { User } from '../../models/User';

const ProfileTab = ({
  posts,
  friends,
}: Omit<User, 'password'> & {
  posts?: Omit<Post, 'authorId'>[] & {
    author: Pick<User, 'id' | 'firstName' | 'lastName'>;
  };
}) => {
  return (
    <Paper elevation={4} sx={{ width: '100%', p: 2.5 }}>
      Posts:
      {JSON.stringify(posts, null, 2)}
      Friends:
      {JSON.stringify(friends, null, 2)}
    </Paper>
  );
};

export default ProfileTab;
