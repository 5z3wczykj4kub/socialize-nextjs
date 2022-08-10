import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Divider,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';
import { useSignInMutation } from '../../../RTKQ/api';
import initialValues from './initialValues';
import validationSchema from './validationSchema';

type SignInFormValues = typeof initialValues;

const SignInForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleShowPasswordClick = () =>
    setIsPasswordVisible((prevState) => !prevState);

  const handleShowPasswordMouseDown = (event: MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();

  const router = useRouter();

  const handleSignInFormSubmit = async (values: typeof initialValues) => {
    try {
      await signIn(values).unwrap();
      router.push('/');
    } catch (error) {}
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSignInFormSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form noValidate>
          <Stack spacing={2.5}>
            <Typography variant='h6' align='center'>
              Sign in
            </Typography>
            <Divider />
            <Field
              component={TextField}
              size='small'
              type='email'
              name='email'
              label='Email'
            />
            <Field
              component={TextField}
              size='small'
              type={isPasswordVisible ? 'text' : 'password'}
              name='password'
              label='Password'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleShowPasswordClick}
                      onMouseDown={handleShowPasswordMouseDown}
                    >
                      {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Link href='/sign-up'>
              <MuiLink sx={{ cursor: 'pointer' }} href='/sign-up'>
                Don&apos;t have an account yet? Sign up now!
              </MuiLink>
            </Link>
            <LoadingButton
              type='submit'
              variant='contained'
              loading={isSigningIn}
              loadingPosition='end'
              disabled={!isValid || isSubmitting}
              fullWidth
            >
              Sign in
            </LoadingButton>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export type { SignInFormValues };

export default SignInForm;
