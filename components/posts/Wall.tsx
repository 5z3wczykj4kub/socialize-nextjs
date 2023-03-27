import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { SimpleFileUpload, TextField } from 'formik-mui'
import { useRef, useState } from 'react'
import { object, string } from 'yup'
import { Post as IPost } from '../../models/Post'
import { User as IUser } from '../../models/User'
import { useAddPostMutation } from '../../RTKQ/api'
import Post from './Post'

interface WallProps {
  profile: IUser
  posts: Omit<IPost, 'authorId'>[] & {
    author: Pick<IUser, 'id' | 'firstName' | 'lastName'>
  }
}

const Wall = ({ profile, posts: initialPosts }: WallProps) => {
  const [posts, setPosts] = useState(initialPosts)

  const [isAddPostDialogOpen, setIsAddPostDialogOpen] = useState(false)

  const handleAddPostButtonClick = () => setIsAddPostDialogOpen(true)

  const handleAddPostDialogCancelButtonClick = () => {
    setIsAddPostDialogOpen(false)
  }

  const [addPost, { isLoading: isAddingPost }] = useAddPostMutation()

  const fullName = `${profile.firstName} ${profile.lastName}`

  const inputRef = useRef<HTMLInputElement>()

  return (
    <>
      <Stack
        direction='row'
        justifyContent='center'
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        <Paper elevation={4} sx={{ width: '100%', maxWidth: 764, p: 2 }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            gap={2}
          >
            <Typography>
              Hey {fullName}, tell your friends what your up to!
            </Typography>
            <Button
              variant='contained'
              sx={{ flexShrink: 0 }}
              onClick={handleAddPostButtonClick}
            >
              Add Post
            </Button>
          </Stack>
        </Paper>
      </Stack>
      <Dialog
        open={isAddPostDialogOpen}
        onClose={handleAddPostDialogCancelButtonClick}
        maxWidth='sm'
        fullWidth
      >
        <Formik
          initialValues={{ content: '', image: undefined as undefined | File }}
          validationSchema={object().shape({
            content: string().required(
              'Content must be at least 1 character long'
            ),
          })}
          onSubmit={async ({ content, image }) => {
            const formData = new FormData()
            formData.append('content', content)
            if (image) formData.append('image', image)
            try {
              const post = await addPost({
                requesterId: profile.id,
                post: formData,
              }).unwrap()
              setPosts((posts) => [post, ...posts])
              handleAddPostDialogCancelButtonClick()
            } catch (error) {}
          }}
        >
          {({ submitForm }) => (
            <Form>
              <DialogTitle sx={{ px: 2, pt: 1.5, pb: 1.25 }}>
                Add post
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 2, overflowY: 'initial' }}>
                <DialogContentText>
                  Share ideas with your friends with just one click!
                </DialogContentText>
                <Field
                  component={TextField}
                  name='content'
                  size='small'
                  margin='normal'
                  label='Content'
                  maxRows={4}
                  multiline
                  fullWidth
                />
                <Field
                  component={SimpleFileUpload}
                  name='image'
                  label={
                    <Stack rowGap={0.5}>
                      <Button
                        size='large'
                        htmlFor='image'
                        component='label'
                        variant='contained'
                        startIcon={<PhotoCamera />}
                        sx={{ fontSize: 18.5 }}
                      >
                        Upload
                      </Button>
                      <Typography marginLeft={1.75} noWrap>
                        {inputRef.current?.files?.[0]?.name}
                      </Typography>
                    </Stack>
                  }
                  InputProps={{
                    id: 'image',
                    inputRef,
                    sx: {
                      display: 'none',
                    },
                  }}
                  FormControlProps={{
                    fullWidth: true,
                    variant: 'standard',
                    sx: {
                      mt: 1.5,
                      minWidth: 112,
                      maxWidth: 112,
                    },
                  }}
                />
              </DialogContent>
              <DialogActions
                disableSpacing
                sx={{
                  p: 2,
                  pt: 0,
                }}
              >
                <Button onClick={handleAddPostDialogCancelButtonClick}>
                  Cancel
                </Button>
                <Box sx={{ ml: 2 }}>
                  <LoadingButton
                    type='submit'
                    loading={isAddingPost}
                    loadingPosition='end'
                    variant='outlined'
                    fullWidth
                  >
                    Publish
                  </LoadingButton>
                </Box>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
      <Stack rowGap={1.5} sx={{ width: '100%', maxWidth: 764, mx: 'auto' }}>
        {posts.map((post) => (
          <Post
            key={post.id}
            profileId={profile.id}
            profileInitials={`${post.author.firstName[0]}${post.author.lastName[0]}`}
            {...post}
          />
        ))}
      </Stack>
    </>
  )
}

export default Wall
