import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardHeaderProps,
  CardMedia,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import Link from 'next/link';
import { useState } from 'react';
import { Post as IPost } from '../../models/Post';
import { User } from '../../models/User';
import { object, string } from 'yup';

type PostProps = Omit<IPost, 'authorId'> & {
  author: Pick<User, 'id' | 'firstName' | 'lastName'>;
  action?: CardHeaderProps['action'];
  profileInitials: string;
};

const Post = ({
  author,
  createdAt,
  imageUrl,
  content,
  likes,
  comments,
  action,
  profileInitials,
}: PostProps) => {
  const [areCommentsExpanded, setAreCommentsExpanded] = useState(false);

  const handleCommentIconClick = () =>
    setAreCommentsExpanded(!areCommentsExpanded);

  const handleAddComment = () => {};

  return (
    <Card elevation={4}>
      <CardHeader
        avatar={
          <Link href={`/users/${author.id}`}>
            <MuiLink href={`/users/${author.id}`} underline='none'>
              <Avatar>
                {author.firstName[0]}
                {author.lastName[0]}
              </Avatar>
            </MuiLink>
          </Link>
        }
        action={action}
        title={
          <Typography>
            <Link href={`/users/${author.id}`}>
              <MuiLink
                href={`/users/${author.id}`}
                color='text.primary'
                underline='hover'
              >
                {author.firstName} {author.lastName}
              </MuiLink>
            </Link>
          </Typography>
        }
        subheader={
          <Typography fontSize='small' color='gray'>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </Typography>
        }
      />
      {imageUrl && (
        <CardMedia
          component='img'
          image='https://images.pexels.com/photos/13386712/pexels-photo-13386712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        />
      )}
      <CardContent sx={{ py: imageUrl ? 2 : 0 }}>
        <Typography>{content}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton>
          <Badge
            badgeContent={likes.length}
            color='primary'
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <FavoriteIcon />
          </Badge>
        </IconButton>
        <IconButton sx={{ ml: 'auto' }} onClick={handleCommentIconClick}>
          <Badge
            badgeContent={comments.length}
            color='primary'
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <CommentIcon />
          </Badge>
        </IconButton>
      </CardActions>
      <Collapse
        in={areCommentsExpanded}
        timeout='auto'
        unmountOnExit
        sx={{ '.MuiCardContent-root:last-child': { pb: 2 } }}
      >
        <Divider />
        <CardContent>
          <Stack rowGap={2}>
            <Stack direction='row' alignItems='center' columnGap={2}>
              <Link href={`/users/${author.id}`}>
                <MuiLink href={`/users/${author.id}`} underline='none'>
                  <Avatar>{profileInitials}</Avatar>
                </MuiLink>
              </Link>
              <Formik
                initialValues={{ comment: '' }}
                validationSchema={object().shape({
                  comment: string().required(
                    'Comment must be at least 1 character long'
                  ),
                })}
                onSubmit={handleAddComment}
              >
                {({ submitForm }) => (
                  <Box component={Form} sx={{ width: '100%' }}>
                    <Field
                      component={TextField}
                      size='small'
                      type='text'
                      name='comment'
                      label='Comment'
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={submitForm}
                              onMouseDown={(event) => event.preventDefault()}
                              edge='end'
                            >
                              <SendIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
              </Formik>
            </Stack>
            {comments.length > 0 && (
              <Typography>
                Comments{' '}
                <Typography component='span' fontSize='small' color='gray'>
                  {comments.length}
                </Typography>
              </Typography>
            )}
            {comments.map((comment) => (
              <Stack
                component={Paper}
                rowGap={2}
                elevation={16}
                sx={{ p: 2, boxShadow: 'none' }}
              >
                <Stack direction='row' alignItems='center' columnGap={2}>
                  <Link href={`/users/${author.id}`}>
                    <MuiLink href={`/users/${author.id}`} underline='none'>
                      <Avatar>
                        {(comment as any).author.firstName[0]}
                        {(comment as any).author.lastName[0]}
                      </Avatar>
                    </MuiLink>
                  </Link>
                  <Stack>
                    <Link href={`/users/${author.id}`}>
                      <MuiLink
                        href={`/users/${author.id}`}
                        color='text.primary'
                        underline='hover'
                      >
                        <Typography noWrap>
                          {(comment as any).author.firstName}{' '}
                          {(comment as any).author.lastName}
                        </Typography>
                      </MuiLink>
                    </Link>
                    <Typography component='span' fontSize='small' color='gray'>
                      {formatDistanceToNow(
                        new Date((comment as any).createdAt),
                        {
                          addSuffix: true,
                        }
                      )}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography sx={{ wordWrap: 'break-word' }}>
                  {comment.content}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Post;
