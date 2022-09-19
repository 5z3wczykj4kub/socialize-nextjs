import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
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
  Typography,
} from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { formatDistanceToNow } from 'date-fns';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import Link from 'next/link';
import { useState } from 'react';
import { object, string } from 'yup';
import { Post as IPost } from '../../models/Post';
import { User } from '../../models/User';
import { useAddCommentMutation } from '../../RTKQ/api';

const COMMENTS_LIMIT = 2;

type PostProps = Omit<IPost, 'authorId'> & {
  author: Pick<User, 'id' | 'firstName' | 'lastName'>;
  action?: CardHeaderProps['action'];
  profileInitials: string;
};

const Post = ({
  id,
  author,
  createdAt,
  imageUrl,
  content,
  likes,
  action,
  profileInitials,
  ...props
}: PostProps) => {
  const [comments, setComments] = useState<any>(props.comments);
  const [commentsOffset, setCommentsOffset] = useState(COMMENTS_LIMIT);

  const [areCommentsExpanded, setAreCommentsExpanded] = useState(false);

  const handleCommentIconClick = () => {
    setAreCommentsExpanded(!areCommentsExpanded);
    if (!areCommentsExpanded) setCommentsOffset(COMMENTS_LIMIT);
  };

  const isShowMoreCommentsLinkVisible =
    comments.slice(commentsOffset, commentsOffset + COMMENTS_LIMIT).length !==
    0;

  const handleShowMoreCommentsLinkClick = () =>
    setCommentsOffset(
      (previousCommentsOffset) => previousCommentsOffset + COMMENTS_LIMIT
    );

  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();

  const handleAddComment = async (
    { comment }: { comment: string },
    {
      resetForm,
    }: FormikHelpers<{
      comment: string;
    }>
  ) => {
    const commentId = nanoid();
    setComments((previousComments: any) => [
      { id: commentId, author, content: comment, createdAt: new Date() },
      ...previousComments,
    ]);
    try {
      await addComment({ postId: id, content: comment }).unwrap();
      resetForm();
    } catch (error) {
      setComments((previousComments: any) =>
        previousComments.filter((comment: any) => comment.id !== commentId)
      );
    }
  };

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
                              edge='end'
                              disabled={isAddingComment}
                              onClick={submitForm}
                              onMouseDown={(event) => event.preventDefault()}
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
            {comments.slice(0, commentsOffset).map((comment: any) => (
              <Stack
                key={comment.id}
                component={Paper}
                rowGap={2}
                elevation={16}
                sx={{ p: 2, boxShadow: 'none' }}
              >
                <Stack direction='row' alignItems='center' columnGap={2}>
                  <Link href={`/users/${author.id}`}>
                    <MuiLink href={`/users/${author.id}`} underline='none'>
                      <Avatar>
                        {comment.author.firstName[0]}
                        {comment.author.lastName[0]}
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
            {isShowMoreCommentsLinkVisible && (
              <Box sx={{ mx: 'auto' }}>
                <Typography
                  component='span'
                  color='primary'
                  onClick={handleShowMoreCommentsLinkClick}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Show more
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Post;
