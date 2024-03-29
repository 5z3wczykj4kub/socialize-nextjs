import {
  Document,
  isValidObjectId,
  Model,
  model,
  models,
  Schema,
  Types,
} from 'mongoose'

interface Post {
  id: string
  authorId: string
  content: string
  createdAt: Date | string
  likes: string[]
  comments: Comment[]
  imageUrl?: string
}

type PostModelInstance = Document<unknown, any, Post> &
  Post & {
    format: () => Post
  }

interface Comment {
  authorId: string
  content: string
  createdAt?: Date | string
}

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
  imageUrl: String,
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
})

postSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

postSchema.method('format', function () {
  const post: any = this.toObject()
  console.log('post', post)
  post.id = post._id.toHexString()
  delete post._id
  post.createdAt = post.createdAt.toISOString()
  if (isValidObjectId(post.authorId)) {
    post.authorId = post.authorId.toHexString()
  } else {
    post.author = post.authorId
    delete post.authorId
    post.author.id = post.author._id.toHexString()
    delete post.author._id
  }
  post.comments.forEach((comment: any) => {
    comment.id = comment._id.toHexString()
    delete comment._id
    if (comment.authorId._id) {
      comment.author = { ...comment.authorId }
      comment.author.id = comment.authorId._id.toHexString()
      delete comment.authorId
      delete comment.author._id
    }
    comment.createdAt = comment.createdAt.toISOString()
  })
  post.likes = post.likes.map((like: any) => like.toHexString())
  return post
})

export type { Post, Comment }

export default (models.Post as Model<PostModelInstance>) ||
  model<Post>('Post', postSchema)
