import { useNavigate, useParams } from 'react-router';
import { Box, Grid, Typography, Button, Paper, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { getServiceById } from '../../../api/CoupleAPI';
import { addToCart } from '../../../utils/CartStorage';
import ItemServiceViewCard from '../StepByStep/ItemServiceViewCard';

const ComboServiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleAddToCart = () => {
    addToCart({
      id: service?.id,
      image: service?.imageUrl,
      name: service?.title,
      price: service?.price,
      promotion: (service?.promotion && service?.promotion.value) ?? 0,
      quantity: 1,
      category: service?.serviceResponse?.categoryResponse?.id,
    });
    window.location.href = '/quotation';
    // navigate(`/quotation`);
  };
  const [service, setService] = useState<any>(null);

  const getData = async () => {
    const response = await getServiceById(id ?? '');
    setService(response);
  };

  useEffect(() => {
    // getData();
  }, [id]);

  return (
    <div id="ComboServiceDetail">
      <div>
        <Box sx={{ p: 4 }}>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={8}>
              <Typography
                fontSize={32}
                fontWeight={600}
                sx={{ color: 'var(--primary-color)' }}
              >
                {' '}
                Danh sách dịch vụ
              </Typography>
              <ItemServiceViewCard
                id={''}
                imageUrl={
                  'https://ggmeo.com/images/linh-thu-dtcl/ahri-ti-ni.jpg'
                }
                title={'Ahri'}
                location="Tp. Hồ Chí Minh"
                rating={4.5}
                description={'service.description'}
                price={45000}
                supplierID={'1'}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box
                component={Paper}
                elevation={3}
                sx={{
                  textAlign: 'left',
                  position: 'fixed',
                  p: 2,
                  width: '550px',
                  top: '130px',
                  right: '20px',
                }}
              >
                <Typography variant="h3" fontWeight={600}>
                  Combo thần thánh
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box my={2} display="flex" alignItems="center">
                  <Typography fontSize={12}> Description </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth={true}
                  size="large"
                  sx={{
                    marginTop: 4,
                    backgroundColor: 'var(--primary-color)',
                    '&:hover': {
                      backgroundColor: 'var(--btn-hover-color)',
                    },
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default ComboServiceDetail;
