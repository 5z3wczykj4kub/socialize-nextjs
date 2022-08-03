import { Container, Paper } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import SignUpForm from '../../components/forms/SignUpForm/SignUpForm';
import Navbar from '../../components/layout/Navbar';
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

const SignUp: NextPage = () => {
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
          <SignUpForm />
        </Paper>
      </Container>
    </>
  );
};

export { getServerSideProps };

export default SignUp;
