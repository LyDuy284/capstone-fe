import './CoupleServiceDetail.css';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Chip,
  TextField,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlagOutlined from '@mui/icons-material/Flag';
import { useEffect, useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { addToCart } from '../../../utils/CartStorage';
import { getServiceSupplierById } from '../../../redux/apiRequest';

const CoupleServiceDetail = () => {
  const [number, setNumber] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddToCart = () => {
    addToCart({
      id: service?.id,
      image: service?.listImages[0],
      name: service?.name,
      price: service?.price,
      promotion: service?.promotion,
      quantity: number,
      category: service?.serviceResponse?.categoryResponse?.id,
    });
  };

  const getData = async () => {
    setLoading(true);
    const response = await getServiceSupplierById(id ?? '');
    setService(response);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [id]);

  const handleSubmitReview = (ratingData: {
    quantity: number;
    quality: number;
    timeliness: number;
    description: string;
  }) => {
    console.log('Submitted Rating:', ratingData);
    // Handle the submitted rating data here
  };
  console.log(service);
  function calculateFinalPrice() {
    const price = service?.price;
    let finalPrice = 0;
    if (service?.promotion?.type === 'PERCENT') {
      const promotionValue = service?.promotion?.value ?? 1;
      finalPrice =
        promotionValue !== 1
          ? price * number - (price * number * promotionValue) / 100
          : price * number;
    } else {
      const promotionValue = service?.promotion?.value ?? 1;
      finalPrice =
        promotionValue !== 1
          ? price * number - number * promotionValue
          : price * number;
    }

    return finalPrice.toLocaleString();
  }
  const [slide, setSlide] = useState(0);

  const nextSlide = () => {
    setSlide(slide === service?.listImages.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? service?.listImages.length - 1 : slide - 1);
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB').format(date);
  };

  return (
    <div id="CoupleServiceDetail">
      <div>
        <Box sx={{ p: 4 }}>
          {loading ? (
            <div className="flex h-[50vh] justify-center items-center">
              <CircularProgress />
            </div>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} sm={8}>
                <div className="carousel">
                  <Button
                    variant="outlined"
                    size="large"
                    className="img-view-btn"
                    onClick={() => {
                      navigate('/services/details/item/img', {
                        state: {
                          images: service?.listImages,
                          title: service?.name,
                        },
                      });
                    }}
                  >
                    Xem ảnh {service?.listImages.length}
                  </Button>
                  <KeyboardArrowLeftIcon
                    onClick={prevSlide}
                    className="arrow arrow-left"
                  />
                  {service?.listImages.map((item: any, idx: number) => {
                    return (
                      <img
                        src={item}
                        alt=""
                        key={idx}
                        className={
                          slide === idx ? 'slide' : 'slide slide-hidden'
                        }
                      />
                    );
                  })}
                  <KeyboardArrowRightIcon
                    sx={{ color: 'red' }}
                    onClick={nextSlide}
                    className="arrow arrow-right"
                  />
                  <span className="indicators">
                    {service?.listImages.map((_: any, idx: number) => {
                      return (
                        <button
                          key={idx}
                          className={
                            slide === idx
                              ? 'indicator'
                              : 'indicator indicator-inactive'
                          }
                          onClick={() => setSlide(idx)}
                        ></button>
                      );
                    })}
                  </span>
                </div>

                <Box sx={{ mt: 8, textAlign: 'left' }}>
                  <Typography variant="h3" component="div" gutterBottom>
                    Mô tả
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 2,
                    }}
                  >
                    <FlagOutlined sx={{ marginRight: 1, fontSize: 20 }} />
                    <Typography variant="subtitle2" fontSize={14}>
                      Đăng ngày: {formatDate(service?.createAt)}
                    </Typography>
                  </Box>
                  {service?.description
                    .split('\n')
                    .map((line: string, index: number) => (
                      <Typography
                        variant="body1"
                        sx={{ fontSize: 14 }}
                        paragraph
                        key={index}
                      >
                        - {line}
                      </Typography>
                    ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box
                  component={Paper}
                  elevation={3}
                  sx={{
                    textAlign: 'left',
                    position: 'sticky',
                    p: 2,
                    width: '100%',
                    top: '130px',
                    right: '20px',
                  }}
                >
                  <Typography variant="h3" fontWeight={600}>
                    {service?.name}
                  </Typography>
                  <Box
                    sx={{
                      marginTop: 1,
                      marginBottom: 1,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  ></Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Chip
                      label={
                        service?.type === 'LUXURY' ? 'Cao cấp' : 'Phổ thông'
                      }
                      color={
                        service?.type === 'LUXURY' ? 'secondary' : 'warning'
                      }
                      sx={{ width: 80, fontSize: 10, fontWeight: 600 }}
                      size="small"
                    />
                    <Box sx={{ fontSize: 12 }}>
                      Nhà cung cấp: {service?.supplierResponse?.supplierName}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 16,
                      marginTop: 2,
                    }}
                  >
                    <b> Đơn giá: {service?.price.toLocaleString()} VNĐ</b>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 16,
                      marginTop: 2,
                    }}
                  >
                    <LocationOnIcon />
                    <Box
                      sx={{
                        color: 'black',
                        textDecorationColor: 'black',
                        ml: 1,
                      }}
                    >
                      {service?.supplierResponse?.area?.ward}
                      {', '}
                      {service?.supplierResponse?.area?.district}
                      {', '}
                      {service?.supplierResponse?.area?.province}
                    </Box>
                  </Box>
                  {(service?.serviceResponse?.categoryResponse.id ===
                    'CATEGORY-1' ||
                    service?.serviceResponse?.categoryResponse.id ===
                      'CATEGORY-7') && (
                    <Box
                      sx={{
                        mt: 2,
                      }}
                    >
                      <TextField
                        value={number}
                        onChange={(event) =>
                          setNumber(parseInt(event.target.value))
                        }
                        id="outlined-number"
                        label="Number"
                        type="number"
                        size="small"
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </Box>
                  )}
                  {service?.promotion && (
                    <Box>
                      <Box>
                        <Typography fontSize={12} my={1}>
                          Khuyến mãi:{' '}
                          <span
                            style={{
                              fontWeight: 'bold',
                              color: 'red',
                              fontSize: 16,
                            }}
                          >
                            {service?.promotion?.type === 'PERCENT'
                              ? `${service?.promotion.value} %`
                              : `${service?.promotion.value.toLocaleString()} VNĐ`}
                          </span>
                        </Typography>
                        <Typography fontSize={12}>
                          Từ ngày:{' '}
                          <span style={{ fontWeight: 'bold' }}>
                            {service?.promotion?.startDate}
                            {' -> '}
                            {service?.promotion?.endDate}
                          </span>
                        </Typography>
                      </Box>
                    </Box>
                  )}
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
                    Đặt dịch vụ
                  </Button>
                  {/* <RequestPricePopup
                  open={openRequest}
                  handleClose={handleCloseRequest}
                  serviceId=""
                  serviceName=""
                  suplierID=""
                /> */}
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </div>
    </div>
  );
};

export default CoupleServiceDetail;
