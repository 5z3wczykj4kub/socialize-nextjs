import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { object, string } from 'yup';
import { Post as IPost } from '../../models/Post';
import { User as IUser } from '../../models/User';
import { useAddPostMutation } from '../../RTKQ/api';
import Post from './Post';

interface WallProps {
  profile: IUser;
  posts: Omit<IPost, 'authorId'>[] & {
    author: Pick<IUser, 'id' | 'firstName' | 'lastName'>;
  };
}

const Wall = ({ profile, posts: initialPosts }: WallProps) => {
  const [posts, setPosts] = useState(initialPosts);

  const [isAddPostDialogOpen, setIsAddPostDialogOpen] = useState(false);

  const handleAddPostButtonClick = () => setIsAddPostDialogOpen(true);

  const handleAddPostDialogCancelButtonClick = () => {
    setIsAddPostDialogOpen(false);
  };

  const [addPost, { isLoading: isAddingPost }] = useAddPostMutation();

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <>
      <Stack
        direction='row'
        justifyContent='center'
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        <Paper elevation={4} sx={{ width: '100%', maxWidth: 764, p: 2 }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            gap={2}
          >
            <Typography>
              Hey {fullName}, tell your friends what your up to!
            </Typography>
            <Button
              variant='contained'
              sx={{ flexShrink: 0 }}
              onClick={handleAddPostButtonClick}
            >
              Add Post
            </Button>
          </Stack>
        </Paper>
      </Stack>
      <Dialog
        open={isAddPostDialogOpen}
        onClose={handleAddPostDialogCancelButtonClick}
        maxWidth='sm'
        fullWidth
      >
        <Formik
          initialValues={{ content: '' }}
          validationSchema={object().shape({
            content: string().required(
              'Content must be at least 1 character long'
            ),
          })}
          onSubmit={async ({ content }) => {
            try {
              const post = await addPost({
                requesterId: profile.id,
                content,
              }).unwrap();
              setPosts((posts) => [post, ...posts]);
              handleAddPostDialogCancelButtonClick();
            } catch (error) {}
          }}
        >
          {({ submitForm }) => (
            <Form>
              <DialogTitle sx={{ px: 2, pt: 1.5, pb: 1.25 }}>
                Add post
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 2 }}>
                <DialogContentText>
                  Share ideas with your friends with just one click!
                </DialogContentText>
                <Field
                  component={TextField}
                  name='content'
                  size='small'
                  margin='normal'
                  label='Content'
                  maxRows={4}
                  multiline
                  fullWidth
                />
              </DialogContent>
              <DialogActions
                disableSpacing
                sx={{
                  p: 2,
                  pt: 0,
                }}
              >
                <Button onClick={handleAddPostDialogCancelButtonClick}>
                  Cancel
                </Button>
                <Box sx={{ ml: 2 }}>
                  <LoadingButton
                    loading={isAddingPost}
                    loadingPosition='end'
                    variant='outlined'
                    fullWidth
                    onClick={submitForm}
                  >
                    Publish
                  </LoadingButton>
                </Box>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
      <Stack rowGap={1.5} sx={{ width: '100%', maxWidth: 764, mx: 'auto' }}>
        {posts.map((post) => (
          <Post
            key={post.id}
            profileInitials={`${post.author.firstName[0]}${post.author.lastName[0]}`}
            {...post}
          />
        ))}
      </Stack>
    </>
  );
};

export default Wall;
