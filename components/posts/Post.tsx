import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  Avatar,
  Badge,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardHeaderProps,
  CardMedia,
  Collapse,
  Divider,
  IconButton,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import { Post as IPost } from '../../models/Post';
import { User } from '../../models/User';

type PostProps = Omit<IPost, 'authorId'> & {
  author: Pick<User, 'id' | 'firstName' | 'lastName'>;
  action?: CardHeaderProps['action'];
};

const Post = ({
  author,
  createdAt,
  imageUrl,
  content,
  likes,
  comments,
  action,
}: PostProps) => {
  const [areCommentsExpanded, setAreCommentsExpanded] = useState(false);

  const handleCommentIconClick = () =>
    setAreCommentsExpanded(!areCommentsExpanded);

  return (
    <Card elevation={4}>
      <CardHeader
        avatar={
          <Link href={`/users/${author.id}`}>
            <MuiLink href={`/users/${author.id}`}>
              <Avatar />
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
      <Collapse in={areCommentsExpanded} timeout='auto' unmountOnExit>
        <Divider />
        <CardContent>{/* TODO: Comments section */}</CardContent>
      </Collapse>
    </Card>
  );
};

export default Post;
