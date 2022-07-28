import { date, object, ref, string } from 'yup';

const passwordValidation = string()
  .required('Please enter your password')
  .matches(/^\S*$/, 'Password cannot have whitespace characters')
  .min(8, 'Password must be at least 8 characters long');

const validationSchema = object({
  email: string()
    .required('Please enter your email')
    .email('Invalid email format'),
  password: passwordValidation,
  confirmPassword: passwordValidation.oneOf(
    [ref('password')],
    "Passwords don't match"
  ),
  firstName: string().required('Please enter your first name'),
  lastName: string().required('Please enter your last name'),
  gender: string().required('Please select your gender'),
  dateOfBirth: date()
    .required('Please enter your date of birth')
    .typeError('Invalid date format')
    .nullable(),
  residence: string().trim().required('Please enter your residence'),
});

export default validationSchema;
