import {
  Box,
  Button,
  Container,
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
import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { object, string } from 'yup';
import Navbar from '../components/layout/Navbar/Navbar';
import connectToMongoDB from '../lib/db/connect';
import { withSessionSsr } from '../lib/session';
import User, { User as IUser } from '../models/User';
import { useAddPostMutation } from '../RTKQ/api';

// TODO: Handle  SSR loading states
const getServerSideProps: GetServerSideProps = withSessionSsr(
  async ({ req }) => {
    const { profileId } = req.session;

    if (!profileId)
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };

    await connectToMongoDB();

    const profile = await User.findById(profileId);

    if (!profile)
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };

    return {
      props: {
        profile: profile.format(),
      },
    };
  }
);

interface HomeProps {
  profile: IUser;
}

const Home: NextPage<HomeProps> = ({ profile }) => {
  const [isAddPostDialogOpen, setIsAddPostDialogOpen] = useState(false);

  const handleAddPostButtonClick = () => setIsAddPostDialogOpen(true);

  const handleAddPostDialogCancelButtonClick = () => {
    setIsAddPostDialogOpen(false);
  };

  const [addPost] = useAddPostMutation();

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <>
      <Navbar.Authenticated {...profile} />
      <Container
        maxWidth='lg'
        sx={{
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
          transform: { xs: 'translateY(56px)', sm: 'translateY(64px)' },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Stack direction='row' justifyContent='center'>
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
            onSubmit={({ content }) => {
              addPost({ requesterId: profile.id, content });
              handleAddPostDialogCancelButtonClick();
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
                    <Button variant='outlined' fullWidth onClick={submitForm}>
                      Publish
                    </Button>
                  </Box>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>
      </Container>
    </>
  );
};

export { getServerSideProps };

export default Home;
