import {
  Document,
  isValidObjectId,
  Model,
  model,
  models,
  Schema,
  Types,
} from 'mongoose';
import { SignUpFormValues } from '../components/forms/SignUpForm/SignUpForm';

interface User
  extends Omit<SignUpFormValues, 'confirmPassword' | 'dateOfBirth'> {
  id: string;
  dateOfBirth: Date;
  friends: Friend[] | User[];
  notifications: Notification[];
}

type UserModelInstance = Document<unknown, any, User> &
  User & {
    format: () => User;
  };

interface Friend {
  requesterId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface Notification {
  _id: string;
  message: string;
  initiatorId: string;
  createdAt?: Date | string;
  read?: boolean;
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
  notifications: [
    {
      message: {
        type: String,
        required: true,
      },
      initiatorId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      read: {
        type: Boolean,
        required: true,
        default: false,
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
  user.friends?.forEach((friend: any) => {
    friend.id = friend._id.toHexString();
    delete friend._id;
    if (isValidObjectId(friend.requesterId)) {
      friend.requesterId = friend.requesterId.toHexString();
    } else {
      friend.requester = {
        ...friend.requesterId,
        id: friend.requesterId._id.toHexString(),
      };
      delete friend.requesterId;
      delete friend.requester._id;
    }
    if (isValidObjectId(friend.receiverId)) {
      friend.receiverId = friend.receiverId.toHexString();
    } else {
      friend.receiver = {
        ...friend.receiverId,
        id: friend.receiverId._id.toHexString(),
      };
      delete friend.receiverId;
      delete friend.receiver._id;
    }
  });
  user.friends = user.friends?.map((friend: any) => {
    if (friend.requester && friend.receiver) {
      if (friend.requester.id === user.id) return { ...friend.receiver };
      return { ...friend.requester };
    }
    return friend;
  });
  if (user.friends === undefined) delete user.friends;
  user.notifications?.forEach((notification: any) => {
    notification.id = notification._id.toHexString();
    delete notification._id;
    notification.initiatorId = notification.initiatorId.toHexString();
    notification.createdAt = notification.createdAt.toISOString();
  });
  return user;
});

export type { User, Friend, Notification };

export default (models.User as Model<UserModelInstance>) ||
  model<User>('User', userSchema);
