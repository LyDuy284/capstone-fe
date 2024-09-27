// Blog.tsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { getBlogsList } from '../../../api/CoupleAPI';
import { Inventory } from '@mui/icons-material';

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    try {
      const response = await getBlogsList({
        pageNo: 0,
        pageSize: 100,
      });
      setBlogsList(response);
      setLoading(false);
    } catch (error) {
      setBlogsList([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return `${formattedTime}, ${formattedDate}`;
  };
  return (
    <Box mx={40}>
      <Typography
        variant="h2"
        fontWeight={600}
        m={4}
        sx={{ color: 'var(--primary-color)' }}
      >
        <Divider
          sx={{
            mx: 'auto',
            width: 700,
            '&::before, &::after': {
              borderColor: 'var(--primary-color)',
              borderWidth: '1px',
            },
          }}
        >
          Cẩm nang cưới
        </Divider>
      </Typography>
      {loading ? (
        <>
          <div className="flex h-[50vh] justify-center items-center">
            <CircularProgress />
          </div>
        </>
      ) : (
        <>
          {blogsList.length !== 0 ? (
            blogsList.map((post, index) => (
              <Card
                onClick={() => {
                  navigate(`/blogs/details/${post.id}`);
                }}
                sx={{
                  my: 2,
                  display: 'flex',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s',
                  },
                }}
                elevation={4}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: 140,
                    width: 140,
                  }}
                  image={post?.listImages[0]}
                  alt={post.title}
                />
                <CardContent sx={{ textAlign: 'left' }}>
                  <Typography
                    variant="h4"
                    fontWeight={600}
                    sx={{ color: 'var(--primary-color)' }}
                  >
                    {post.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {formatDate(post.createAt)}
                  </Typography>
                  <Typography
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: 12,
                    }}
                  >
                    {post.content}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <div className="w-full h-[32vh] flex flex-col justify-center items-center gap-4">
                <div>
                  <Inventory sx={{ width: 60, height: 60, color: 'gray' }} />
                </div>
                <div className="font-semibold text-3xl text-gray-500">
                  Không có kết quả
                </div>
              </div>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default BlogList;
