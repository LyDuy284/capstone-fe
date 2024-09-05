import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import VisibilityIcon from '@mui/icons-material/Visibility';


export interface BlogViewModel {
    author: string;
    date: string;
    title: string;
    content: string;
    comments: number;
    views: number;
    avatar: string;
    lastCommenter: string;
    lastCommentDate: string;
  }

export const BlogListCardView : React.FC<BlogViewModel> = ({
    author,
    date,
    title,
    content,
    comments,
    views,
    avatar,
    lastCommenter,
    lastCommentDate
  }) => {
    return (
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Box display="flex" alignItems="center" marginBottom="10px">
          <Avatar>{author.charAt(0).toUpperCase()}</Avatar>
          <Box marginLeft="10px">
            <Typography variant="h6">{author}</Typography>
            <Typography variant="body2" color="textSecondary">{date}</Typography>
          </Box>
        </Box>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Typography variant="body1" paragraph>{content}</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar src={avatar} alt={lastCommenter} sx={{ width: 24, height: 24 }} />
            <Typography variant="body2" color="textSecondary" style={{ marginLeft: '5px' }}>{lastCommenter}, {lastCommentDate}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton size="small">
              <CommentIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2">{comments}</Typography>
            <IconButton size="small" style={{ marginLeft: '10px' }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2">{views}</Typography>
          </Box>
        </Box>
      </Paper>
    );
  };