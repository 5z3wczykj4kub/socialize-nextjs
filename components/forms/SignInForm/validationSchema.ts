import { object, string } from 'yup';

const validationSchema = object({
  email: string()
    .required('Please enter your email')
    .email('Invalid email format'),
  password: string()
    .required('Please enter your password')
    .matches(/^\S*$/, 'Password cannot have whitespace characters')
    .min(8, 'Password must be at least 8 characters long'),
});

export default validationSchema;
