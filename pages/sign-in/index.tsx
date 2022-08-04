import { Container, Paper } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import SignInForm from '../../components/forms/SignInForm/SignInForm';
import Navbar from '../../components/layout/Navbar/Navbar';
import { withSessionSsr } from '../../lib/session';

const getServerSideProps: GetServerSideProps = withSessionSsr(
  async ({ req }) => {
    const { profileId } = req.session;

    if (profileId)
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    return {
      props: {},
    };
  }
);

const SignIn: NextPage = () => {
  return (
    <>
      <Navbar.Unauthenticated />
      <Container
        maxWidth='lg'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
          transform: { xs: 'translateY(56px)', sm: 'translateY(64px)' },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Paper elevation={4} sx={{ width: '100%', maxWidth: 440, p: 2.5 }}>
          <SignInForm />
        </Paper>
      </Container>
    </>
  );
};

export { getServerSideProps };

export default SignIn;
