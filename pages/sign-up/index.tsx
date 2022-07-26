import { Container, Paper } from '@mui/material';
import type { NextPage } from 'next';
import SignUpForm from '../../components/forms/SignUpForm/SignUpForm';
import Navbar from '../../components/layout/Navbar';

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
          height: '100vh',
          pt: { xs: 7, sm: 8 },
        }}
      >
        <Paper
          elevation={4}
          sx={{ width: '100%', maxWidth: 420 /* 🌿🥦🌳 */, p: 2.5 }}
        >
          <SignUpForm />
        </Paper>
      </Container>
    </>
  );
};

export default SignUp;
