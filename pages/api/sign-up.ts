import { NextApiHandler } from 'next';
import { ValidationError } from 'yup';
import { SignUpFormValues } from '../../components/forms/SignUpForm/SignUpForm';
import validationSchema from '../../components/forms/SignUpForm/validationSchema';
import MongoDBConnector from '../../lib/MongoDBConnector';
import User, { UserModelInstance } from '../../models/User';

const signUpApiHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const signUpFormValues = await validationSchema.validate(
      req.body as SignUpFormValues,
      { abortEarly: false }
    );

    await MongoDBConnector();

    const user = new User(signUpFormValues) as UserModelInstance;

    /**
     * TODO:
     * Steps to perform before
     * saving user to a database:
     * 1. Fix `dateOfBirth` date format
     * calculated on form submission
     * as incorrect date is being saved to a database.
     * 2. Hash password with `bcrypt`.
     * 3. Start a session with `iron-session`.
     */
    await user.save();
  } catch (error) {
    const { message, errors } = error as ValidationError;
    return res.status(422).json({ message, errors });
  }

  return res.status(201).end();
};

export default signUpApiHandler;
