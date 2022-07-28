import mongoose, { Document, Types } from 'mongoose';
import { SignUpFormValues } from '../components/forms/SignUpForm/SignUpForm';

interface User
  extends Omit<SignUpFormValues, 'confirmPassword' | 'dateOfBirth'> {
  dateOfBirth: Date;
}

type UserModelInstance = Document<unknown, any, User> &
  User & {
    _id: Types.ObjectId;
  };

const userSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  residence: {
    type: String,
    required: true,
  },
});

export type { UserModelInstance };

export default mongoose.models.User || mongoose.model<User>('User', userSchema);
