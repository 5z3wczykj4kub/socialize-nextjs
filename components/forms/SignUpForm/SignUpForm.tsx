import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Divider,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Radio,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Field, Form, Formik } from 'formik';
import { RadioGroup, TextField } from 'formik-mui';
import { DatePicker } from 'formik-mui-x-date-pickers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';
import { useSignUpMutation } from '../../../api';
import initialValues from './initialValues';
import styles from './SignUpForm.module.scss';
import validationSchema from './validationSchema';

type SignUpFormValues = typeof initialValues;

const SignUpForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const handleShowPasswordClick = () =>
    setIsPasswordVisible((prevState) => !prevState);

  const handleShowPasswordMouseDown = (event: MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const handleShowConfirmPasswordClick = () =>
    setIsConfirmPasswordVisible((prevState) => !prevState);

  const handleShowConfirmPasswordMouseDown = (
    event: MouseEvent<HTMLButtonElement>
  ) => event.preventDefault();

  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();

  const router = useRouter();

  const handleSignUpFormSubmit = async (values: SignUpFormValues) => {
    try {
      await signUp({
        ...values,
        residence: values.residence.trim(),
      }).unwrap();
      router.push('/');
    } catch (error) {}
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const firstNameTextField = (
    <Field
      component={TextField}
      size='small'
      type='text'
      name='firstName'
      label='First name'
    />
  );

  const lastNameTextField = (
    <Field
      component={TextField}
      size='small'
      type='text'
      name='lastName'
      label='Last name'
    />
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSignUpFormSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form noValidate>
          <Stack spacing={2.5}>
            <Typography variant='h6' align='center'>
              Sign up
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
            <Field
              component={TextField}
              size='small'
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              name='confirmPassword'
              label='Confirm password'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleShowConfirmPasswordClick}
                      onMouseDown={handleShowConfirmPasswordMouseDown}
                    >
                      {isConfirmPasswordVisible ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {matches ? (
              <Stack direction='row' spacing={2}>
                {firstNameTextField}
                {lastNameTextField}
              </Stack>
            ) : (
              <>
                {firstNameTextField}
                {lastNameTextField}
              </>
            )}
            <FormLabel>Gender</FormLabel>
            <Field
              className={styles.gender}
              component={RadioGroup}
              name='gender'
              row
            >
              <FormControlLabel
                value='female'
                control={<Radio disabled={isSubmitting} />}
                label='Female'
                disabled={isSubmitting}
              />
              <FormControlLabel
                value='male'
                control={<Radio disabled={isSubmitting} />}
                label='Male'
                disabled={isSubmitting}
              />
              <FormControlLabel
                value='other'
                control={<Radio disabled={isSubmitting} />}
                label='Other'
                disabled={isSubmitting}
              />
            </Field>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Field
                component={DatePicker}
                name='dateOfBirth'
                label='Date of birth'
                openTo='year'
                views={['year', 'month', 'day']}
                textField={{ size: 'small' }}
              />
            </LocalizationProvider>
            <Field
              component={TextField}
              size='small'
              type='text'
              name='residence'
              label='Residence'
            />
            <Link href='/sign-in'>
              <MuiLink className={styles.link} href='/sign-in'>
                Already have an account? Sign in!
              </MuiLink>
            </Link>
            <LoadingButton
              type='submit'
              variant='contained'
              loading={isSigningUp}
              loadingPosition='end'
              disabled={!isValid || isSubmitting}
              fullWidth
            >
              Sign up
            </LoadingButton>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export type { SignUpFormValues };

export default SignUpForm;
