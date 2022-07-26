import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
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
import { MouseEvent, useState } from 'react';
import initialValues from './initialValues';
import validationSchema from './validationSchema';

const SignInForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleShowPasswordClick = () =>
    setIsPasswordVisible((prevState) => !prevState);

  const handleShowPasswordMouseDown = (event: MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const handleSignInFormSubmit = (values: typeof initialValues) => {};

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
              <MuiLink sx={{ cursor: 'pointer' }}>
                Don't have an account yet? Sign up now!
              </MuiLink>
            </Link>
            <Button
              type='submit'
              variant='contained'
              disabled={!isValid || isSubmitting}
            >
              Sign in
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default SignInForm;
