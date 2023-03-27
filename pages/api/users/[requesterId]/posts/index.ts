import { NextApiHandler, NextApiRequest } from 'next'
import { ValidationError } from 'yup'
import validationSchema from '../../../../../components/forms/AddPostForm/validationSchema'
import connectToMongoDB from '../../../../../lib/db/connect'
import { withSessionRoute } from '../../../../../lib/session'
import Post, { Post as IPost } from '../../../../../models/Post'
import User from '../../../../../models/User'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'
import { randomUUID } from 'crypto'

export const config = {
  api: {
    bodyParser: false,
  },
}

const parseFormData = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; file: formidable.Files }> =>
  new Promise((resolve, reject) =>
    formidable({
      uploadDir: path.join(process.cwd(), '/public/images'),
      filename: () => randomUUID(),
      encoding: 'binary',
    }).parse(req, (error, fields, files) => {
      error ? reject(error) : resolve({ fields, files })
    })
  )

const postsApiHandler: NextApiHandler = async (req, res) => {
  const { profileId } = req.session
  if (!profileId) return res.status(401).end()

  const { requesterId } = req.query as {
    requesterId: string
  }
  if (!requesterId)
    return res.status(422).json({ message: 'Unknown requester' })

  if (req.method === 'POST') {
    if (profileId !== requesterId) return res.status(403).end()

    // const { content } = req.body as Pick<IPost, 'content'>

    const {
      fields: { content },
      files,
    } = await parseFormData(req)

    try {
      await validationSchema.validate({ content }, { abortEarly: false })

      await connectToMongoDB()

      const requester = await User.findById(requesterId)
      if (!requester)
        return res.status(404).json({ message: 'Requester not found' })

      const post = await Post.create({
        authorId: requesterId,
        content,
        imageUrl: files?.image?.newFilename,
      })

      return res
        .status(201)
        .json(
          (await post.populate('authorId', '_id firstName lastName')).format()
        )
    } catch (error) {
      const { message, errors } = error as ValidationError
      return res.status(422).json({ message, errors })
    }
  }

  return res.status(405).end()
}

export default withSessionRoute(postsApiHandler)
