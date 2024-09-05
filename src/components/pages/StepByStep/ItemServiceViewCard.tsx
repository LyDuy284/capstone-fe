import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Grid,
  Chip,
  Rating,
} from '@mui/material';
import { Star, FavoriteBorder, People } from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router';
import RequestPricePopup from '../Popup/Couple/RequestPricePopup';
import { addToCart } from '../../../utils/CartStorage';

interface VenueCardProps {
  id: string;
  imageUrl: string;
  title: string;
  location: string;
  rating: number;
  price: number;
  description: string;
  supplierID: string;
}

const ItemServiceViewCard: React.FC<VenueCardProps> = ({
  id,
  imageUrl,
  title,
  location,
  rating,
  price,
  description,
  supplierID,
}) => {
  const navigate = useNavigate();
  const type = 'LUXURY';
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  return (
    <Card
      sx={{
        display: 'flex',
        margin: '20px',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.05)',
          transition: 'transform 0.2s',
        },
      }}
      elevation={3}
    >
      <CardMedia
        component="img"
        sx={{ width: 200, maxHeight: 240 }}
        image={imageUrl}
        alt={title}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          textAlign: 'left',
        }}
      >
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Grid container alignItems="top" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" color="text.secondary">
                {location}
              </Typography>
              <Typography
                component="div"
                variant="h4"
                fontWeight={600}
                onClick={() => {
                  navigate(`/services/details/${id}`);
                }}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'var(--primary-color)',
                  },
                }}
              >
                {title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'bottom' }}>
                <Rating
                  name="text-feedback"
                  value={rating}
                  readOnly
                  precision={0.1}
                  size="large"
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
                <Typography
                  color="text.secondary"
                  sx={{ marginLeft: '5px' }}
                  fontSize={14}
                  fontWeight={500}
                >
                  {rating}
                </Typography>
              </Box>
              <Chip
                label={type === 'LUXURY' ? 'Cao cấp' : 'Phổ thông'}
                color={type === 'LUXURY' ? 'secondary' : 'warning'}
                sx={{ width: 80, fontSize: 10, fontWeight: 600 }}
                size="small"
              />
              <Typography
                color="text.secondary"
                fontSize={12}
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 5,
                  textOverflow: 'ellipsis',
                }}
              >
                {description}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{ px: 4, py: 1, mb: 1, mr: 1, fontSize: 14, fontWeight: 600 }}
            style={{ backgroundColor: 'var(--primary-color)' }}
            onClick={() => {
              addToCart({
                id: id,
                image: imageUrl,
                name: title,
                price: price,
                promotion: 0,
                quantity: 1,
                category: 'sss',
              });
              // window.location.href = '/quotation';
            }}
          >
            Đặt hàng
          </Button>
          <RequestPricePopup
            open={open}
            handleClose={handleClose}
            serviceId={id}
            serviceName={title}
            suplierID={supplierID}
          />
        </CardActions>
      </Box>
    </Card>
  );
};

export default ItemServiceViewCard;
