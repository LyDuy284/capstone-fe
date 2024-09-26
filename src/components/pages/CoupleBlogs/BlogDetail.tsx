import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Container,
  Link,
  ImageList,
  ImageListItem,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { title } from 'process';
import { useParams } from 'react-router';
import SendIcon from '@mui/icons-material/Send';
import { getBlogById } from '../../../api/CoupleAPI';

export interface BlogDetailProps {
  author: string;
  date: string;
  title: string;
  content: string;
  avatar: string;
}

const BlogDetails: React.FC = () => {
  const [blogDetail, setBlogDetail] = useState<any>(null);
  const [content, setContent] = useState('');
  const { id } = useParams();

  const handleAddComment = () => {
    // const newComment = {
    //   avatar: 'path/to/avatar.jpg',
    //   date: new Date().toLocaleDateString(),
    //   status: 'New', // Adjust the status as needed
    //   content,
    // };
    // onAddComment(newComment);
    // setName('');
    // setContent('');
  };

  const getData = async () => {
    const response = await getBlogById(id ?? '');
    setBlogDetail(response);
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((item, index) => (
      <p key={index}>{item}</p>
    ));
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(blogDetail);
  return (
    <Container style={{ padding: '20px', textAlign: 'left' }}>
      <Typography fontSize={40} fontWeight={600}>
        {blogDetail?.title}
      </Typography>
      <Box display="flex" alignItems="center" marginTop="10px">
        <Box marginLeft="10px">
          <Typography variant="body1">
            By {blogDetail?.staffName} — {blogDetail?.createAt}
          </Typography>
        </Box>
      </Box>
      <Paper style={{ marginTop: '20px', padding: '20px' }} elevation={4}>
        <Grid container spacing={2}>
          {blogDetail?.listImages?.map((image: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={image}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={image}
                  alt={image}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="body1" my={4}>
          {/* {blogDetail?.content} */}
          {blogDetail?.content && renderContent(blogDetail.content)}
        </Typography>
      </Paper>

      {/* <Paper sx={{ my: 4, p: 2 }} elevation={4}>
        <Box p={2}>
          <Typography variant="h4" gutterBottom>
            {blogDetail?.listComments?.length} Bình luận
          </Typography>
          <Divider />
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src="https://ggmeo.com/images/linh-thu-dtcl/ahri-ti-ni.jpg" />

                    <Box sx={{ pl: 2, width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Bình luận"
                        variant="outlined"
                        multiline
                        rows={2}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        InputProps={{
                          style: { fontSize: 16 },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleAddComment}
                                color="primary"
                              >
                                <SendIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          style: { fontSize: 14 },
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {blogDetail?.listComments?.map((item: any, index: number) => {
              return (
                <Grid item>
                  <Card variant="outlined" style={{ marginBottom: '8px' }}>
                    <CardContent>
                      <Box
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <Avatar src="https://ggmeo.com/images/linh-thu-dtcl/ahri-ti-ni.jpg" />
                        <Box style={{ marginLeft: '16px' }}>
                          <Typography fontSize={14}>{'Huy'}</Typography>
                          <Typography variant="body1" color="textSecondary">
                            {' '}
                            {'12-12-2022'}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ m: 1, ml: 6 }} />
                      <Box style={{ paddingLeft: '56px' }}>
                        <Typography variant="body2">
                          {'NOONONONONONONOONONON'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper> */}
    </Container>
  );
};

export default BlogDetails;
