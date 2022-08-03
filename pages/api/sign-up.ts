import bcrypt from 'bcryptjs';
import { NextApiHandler } from 'next';
import { ValidationError } from 'yup';
import { SignUpFormValues } from '../../components/forms/SignUpForm/SignUpForm';
import validationSchema from '../../components/forms/SignUpForm/validationSchema';
import MongoDBConnector from '../../lib/MongoDBConnector';
import { withSessionRoute } from '../../lib/session';
import User, { UserModelInstance } from '../../models/User';

const signUpApiHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const signUpFormValues = await validationSchema.validate(
      req.body as SignUpFormValues,
      { abortEarly: false }
    );

    await MongoDBConnector();

    const profile = new User(signUpFormValues) as UserModelInstance;

    const isEmailAlreadyUsed = !!(await User.count({
      email: profile.email,
    }));

    if (isEmailAlreadyUsed)
      return res.status(422).json({ message: 'Email already used' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(profile.password, salt);

    profile.password = hashedPassword;
    req.session.profileId = profile.id;
    await Promise.all([profile.save(), req.session.save()]);

    return res.status(201).end();
  } catch (error) {
    const { message, errors } = error as ValidationError;
    return res.status(422).json({ message, errors });
  }
};

export default withSessionRoute(signUpApiHandler);
