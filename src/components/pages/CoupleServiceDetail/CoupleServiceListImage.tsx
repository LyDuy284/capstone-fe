import React from 'react';
import { Box, Button, ImageList, ImageListItem, ImageListItemBar, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const imageData: string[] = [
  'https://ggmeo.com/images/linh-thu-dtcl/gwen-ti-ni.jpg',
  'https://ggmeo.com/images/linh-thu-dtcl/ahri-ve-binh-tinh-tu-ti-ni.jpg',
  'https://ggmeo.com/images/linh-thu-dtcl/kaisa-ti-ni.png',
  'https://ggmeo.com/images/linh-thu-dtcl/sona-ti-ni.jpg',
  'https://ggmeo.com/images/linh-thu-dtcl/akali-ti-ni.jpg',
  'https://ggmeo.com/images/linh-thu-dtcl/annie-ti-ni.jpg',
  'https://ggmeo.com/images/linh-thu-dtcl/vi-ti-ni.jpg',
  'https://ggmeo.com/images/linh-thu-dtcl/jinx-ti-ni.jpg',
  'https://ggmeo.com/images/linh-thu-dtcl/ashe-ti-ni.jpg',
  'https://ggmeo.com/images/linh-thu-dtcl/lux-ve-binh-tinh-tu-ti-ni.jpg'
];

const CoupleServiceListImage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { images, title } = location.state as { images: string[], title: string };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', m: 2 }}>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon 
        sx={{
            color: 'var(--primary-color)', 
            '&:hover': {
                color: 'var(--btn-hover-color)', 
            },
          }}
        />}>
      <Typography variant="h4" 
      sx={{
        fontWeight: 500,
        color: 'var(--primary-color)', 
        '&:hover': {
            color: 'var(--btn-hover-color)', 
        },
      }}
      >{title}</Typography>
    </Button>
        </Box>
    
    
    <Box sx={{  flexGrow: 1, overflowY: 'scroll' }}> 
    <ImageList cols={3} gap={8} >
      {images?.map((img, index) => (
        <ImageListItem key={index}>
          <img
            src={`${img}?w=248&fit=crop&auto=format`}
            srcSet={`${img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={`Image ${index + 1}`}
            loading="lazy"
          />
          <ImageListItemBar
            title={`Ảnh ${index + 1}`}
          />
        </ImageListItem>
      ))}
    </ImageList>
    </Box>
    </Box>
  );
};

export default CoupleServiceListImage;
