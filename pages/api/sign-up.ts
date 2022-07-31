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

    const user = new User(signUpFormValues) as UserModelInstance;

    const isEmailAlreadyUsed = !!(await User.count({ email: user.email }));

    if (isEmailAlreadyUsed)
      return res.status(422).json({ message: 'Email already used' });

    bcrypt.genSalt(10, (error, salt) => {
      if (error) return res.status(500).end();

      bcrypt.hash(user.password, salt, async (error, hash) => {
        if (error) return res.status(500).end();

        user.password = hash;
        req.session.userId = user.id;
        await Promise.all([user.save(), req.session.save()]);
        return res.status(201).end();
      });
    });
  } catch (error) {
    const { message, errors } = error as ValidationError;
    return res.status(422).json({ message, errors });
  }
};

export default withSessionRoute(signUpApiHandler);
