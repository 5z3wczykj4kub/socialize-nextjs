import { NextApiHandler } from 'next';
import { ValidationError } from 'yup';
import { SignUpFormValues } from '../../components/forms/SignUpForm/SignUpForm';
import validationSchema from '../../components/forms/SignUpForm/validationSchema';

const signUpApiHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const signUpFormValues = await validationSchema.validate(
      req.body as SignUpFormValues,
      { abortEarly: false }
    );
    // TODO: Handle sign in...
  } catch (error) {
    const { message, errors } = error as ValidationError;
    return res.status(422).json({ message, errors });
  }

  return res.status(201).end();
};

export default signUpApiHandler;
