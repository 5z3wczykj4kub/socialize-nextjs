import { Document, Model, model, models, Schema, Types } from 'mongoose';
import { SignUpFormValues } from '../components/forms/SignUpForm/SignUpForm';

interface User
  extends Omit<SignUpFormValues, 'confirmPassword' | 'dateOfBirth'> {
  id: string;
  dateOfBirth: Date;
  friends: Friend[] | User[];
}

type UserModelInstance = Document<unknown, any, User> &
  User & {
    format: () => void;
  };

interface Friend {
  requesterId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const userSchema = new Schema<User>({
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
  friends: [
    {
      requesterId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
      },
      receiverId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
      },
      status: {
        type: String,
        required: true,
        enum: {
          values: ['pending', 'accepted', 'rejected'],
          message:
            'Status must be either pending, accepted, rejected or not exist at all',
        },
      },
    },
  ],
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
  for (const friend of user.friends) {
    friend.id = friend._id.toHexString();
    delete friend._id;
    friend.requesterId = friend.requesterId.toHexString();
    friend.receiverId = friend.receiverId.toHexString();
  }
  return user;
});

export type { User, Friend };

export default (models.User as Model<UserModelInstance>) ||
  model<User>('User', userSchema);
