import mongoose, { Document } from 'mongoose';
import { SignUpFormValues } from '../components/forms/SignUpForm/SignUpForm';

interface User
  extends Omit<SignUpFormValues, 'confirmPassword' | 'dateOfBirth'> {
  id: string;
  dateOfBirth: Date;
}

type UserModelInstance = Document<unknown, any, User> &
  User & {
    format: () => void;
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

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.method('format', function () {
  const user: any = this.toObject();
  user.id = user._id.toHexString();
  user.dateOfBirth = user.dateOfBirth.toISOString();
  delete user._id;
  delete user.password;
  delete user.__v;
  return user;
});

export type { User, UserModelInstance };

export default mongoose.models.User || mongoose.model<User>('User', userSchema);
