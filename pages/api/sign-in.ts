import bcrypt from 'bcryptjs';
import { NextApiHandler } from 'next';
import { ValidationError } from 'yup';
import { SignInFormValues } from '../../components/forms/SignInForm/SignInForm';
import validationSchema from '../../components/forms/SignInForm/validationSchema';
import MongoDBConnector from '../../lib/MongoDBConnector';
import { withSessionRoute } from '../../lib/session';
import User, { UserModelInstance } from '../../models/User';

const signInApiHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { email, password } = await validationSchema.validate(
      req.body as SignInFormValues,
      { abortEarly: false }
    );

    await MongoDBConnector();

    const profile = (await User.findOne({ email })) as UserModelInstance;

    if (!profile)
      return res.status(401).json({ message: 'Incorrect email or password' });

    const isPasswordCorrect = await bcrypt.compare(password, profile.password);

    if (!isPasswordCorrect)
      return res.status(401).json({ message: 'Incorrect email or password' });

    req.session.profileId = profile.id;
    await req.session.save();

    return res.end();
  } catch (error) {
    const { message, errors } = error as ValidationError;
    return res.status(422).json({ message, errors });
  }
};

export default withSessionRoute(signInApiHandler);
