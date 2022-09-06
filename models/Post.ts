import {
  Document,
  isValidObjectId,
  Model,
  model,
  models,
  Schema,
  Types,
} from 'mongoose';

interface Post {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date | string;
  likes: string[];
  comments: string[];
}

type PostModelInstance = Document<unknown, any, Post> &
  Post & {
    format: () => Post;
  };

const postSchema = new Schema<Post>({
  // @ts-ignore
  authorId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  likes: [
    {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
  ],
  comments: [
    {
      authorId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
});

postSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

postSchema.method('format', function () {
  const post: any = this.toObject();
  post.id = post._id.toHexString();
  delete post._id;
  post.createdAt = post.createdAt.toISOString();
  if (isValidObjectId(post.authorId)) {
    post.authorId = post.authorId.toHexString();
  } else {
    post.author = post.authorId;
    delete post.authorId;
    post.author.id = post.author._id.toHexString();
    delete post.author._id;
  }
  return post;
});

export type { Post };

export default (models.Post as Model<PostModelInstance>) ||
  model<Post>('Post', postSchema);
