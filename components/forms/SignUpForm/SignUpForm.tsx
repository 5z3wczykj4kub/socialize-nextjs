import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  Divider,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Radio,
  Stack,
  TextField as MuiTextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Field, Form, Formik } from 'formik';
import { RadioGroup, TextField } from 'formik-mui';
import Link from 'next/link';
import { MouseEvent, useState } from 'react';
import initialValues from './initialValues';
import styles from './SignUpForm.module.scss';

const SignUpForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [dateOfBirth, setDateOfBirth] = useState();

  const handleShowPasswordClick = () =>
    setIsPasswordVisible((prevState) => !prevState);

  const handleShowPasswordMouseDown = (event: MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const handleShowConfirmPasswordClick = () =>
    setIsConfirmPasswordVisible((prevState) => !prevState);

  const handleShowConfirmPasswordMouseDown = (
    event: MouseEvent<HTMLButtonElement>
  ) => event.preventDefault();

  const handleDateOfBirthChange = (
    value: any,
    keyboardInputValue?: string | undefined
  ) => setDateOfBirth(value);

  const handleSignUpFormSubmit = (values: typeof initialValues) => {};

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema}
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
              <DatePicker
                openTo='year'
                views={['year', 'month', 'day']}
                label='Date of birth'
                value={dateOfBirth}
                onChange={handleDateOfBirthChange}
                disabled={isSubmitting}
                renderInput={(params) => (
                  <MuiTextField {...params} size='small' />
                )}
              />
            </LocalizationProvider>
            <Field
              component={TextField}
              size='small'
              type='residence'
              name='residence'
              label='Residence'
            />
            <Link href='/sign-in'>
              <MuiLink className={styles.link}>
                Already have an account? Sign in!
              </MuiLink>
            </Link>
            <Button type='submit' variant='contained' disabled={!isValid}>
              Sign up
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
