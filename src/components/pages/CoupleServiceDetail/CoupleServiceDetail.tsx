import './CoupleServiceDetail.css';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  Box,
  Grid,
  Typography,
  Button,
  Link,
  Rating,
  Paper,
  LinearProgress,
  Pagination,
  Chip,
  Input,
  TextField,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlagOutlined from '@mui/icons-material/Flag';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ReviewCard, ReviewCardModel } from './ReviewCard';
import { getLabel } from '../../../utils/Utils';
import RatingPopup from '../Popup/Couple/RatingPopup';
import RequestPricePopup from '../Popup/Couple/RequestPricePopup';
import { getServiceById } from '../../../api/CoupleAPI';
import { addToCart } from '../../../utils/CartStorage';
import { getServiceSupplierById } from '../../../redux/apiRequest';

const reviews: ReviewCardModel[] = [
  {
    username: 'Ahri',
    rating: 5,
    date: '2023-10-19 13:13',
    content: 'Dịch vụ uy tín',
    avatar: 'https://ggmeo.com/images/linh-thu-dtcl/ahri-ti-ni.jpg',
  },
  {
    username: 'Ahri',
    rating: 5,
    date: '2023-10-19 13:13',
    content: 'Dịch vụ uy tín',
    avatar: 'https://ggmeo.com/images/linh-thu-dtcl/ahri-ti-ni.jpg',
  },
];

const totalReviews = 369;

const ratings = [
  { name: 'Số lượng', rating: 5.0 },
  { name: 'Chất lượng', rating: 5.0 },
  { name: 'Đúng giờ', rating: 5.0 },
];

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
      promotion: (service?.promotion && service?.promotion.value) ?? 0,
      quantity: number,
      category: service?.serviceResponse?.categoryResponse?.id,
    });
  };
  const [openReview, setOpenReview] = useState(false);

  const getData = async () => {
    setLoading(true);
    const response = await getServiceSupplierById(id ?? '');
    setService(response);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [id]);

  const handleOpenReview = () => {
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
  };

  const handleSubmitReview = (ratingData: {
    quantity: number;
    quality: number;
    timeliness: number;
    description: string;
  }) => {
    console.log('Submitted Rating:', ratingData);
    // Handle the submitted rating data here
  };
  function calculateFinalPrice() {
    const price = service?.price;
    const promotionValue = service?.promotion?.value ?? 1;
    const finalPrice =
      promotionValue !== 1
        ? price * number - (price * number * promotionValue) / 100
        : price * number;

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

                <Box mt={4} mb={4}>
                  <Typography variant="h4" gutterBottom align="left">
                    Đánh giá {service?.name}
                  </Typography>
                  <Grid container spacing={2} mt={2}>
                    <Grid item xs={5} sx={{ textAlign: 'left' }}>
                      <Box>
                        <Box display="flex" alignItems="center">
                          <Typography
                            variant="h6"
                            component="span"
                            sx={{ fontSize: 20, fontWeight: 600 }}
                          >
                            4.8
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: 16, ml: 1 }}
                          >
                            {getLabel(4.8)}
                          </Typography>
                        </Box>
                        <Rating
                          name="rating-service-feedback"
                          value={service?.rating}
                          readOnly
                          precision={0.1}
                          size="large"
                          emptyIcon={
                            <StarIcon
                              style={{ opacity: 0.55 }}
                              fontSize="inherit"
                            />
                          }
                        />
                        <Typography
                          variant="body1"
                          sx={{ fontSize: 14, lineHeight: 2 }}
                        >
                          {totalReviews} đánh giá
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          backgroundColor: 'var(--primary-color)',
                          '&:hover': {
                            backgroundColor: 'var(--btn-hover-color)',
                          },
                        }}
                        style={{
                          marginTop: '10px',
                          width: '300px',
                          padding: '10px 20px',
                        }}
                        onClick={handleOpenReview}
                      >
                        Viết đánh giá
                      </Button>
                      <RatingPopup
                        open={openReview}
                        onClose={handleCloseReview}
                        serviceName="Service Name"
                        onSubmit={handleSubmitReview}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        {ratings.map((item, index) => (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            mt={2}
                            width={400}
                          >
                            <Typography fontSize={16}>{item.name}</Typography>
                            <Box display="flex" alignItems="center">
                              <LinearProgress
                                variant="determinate"
                                value={(item.rating / 5) * 100}
                                style={{
                                  width: '200px',
                                  height: '10px',
                                  marginRight: '10px',
                                  borderRadius: '5px',
                                }}
                                sx={{
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: 'var(--primary-color)',
                                  },
                                }}
                              />
                              <Typography fontSize={16}>
                                {item.rating.toFixed(1)}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box mt={4}>
                  {reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                  ))}
                  <Box display="flex" justifyContent="center" my={4}>
                    <Pagination count={10} variant="outlined" />
                  </Box>
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
                  >
                    <Rating
                      name="rating-service"
                      value={service?.rating}
                      readOnly
                      precision={0.1}
                      size="large"
                      emptyIcon={
                        <StarIcon
                          style={{ opacity: 0.55 }}
                          fontSize="inherit"
                        />
                      }
                    />
                    <Typography variant="h5" sx={{ ml: 1 }}>
                      {service?.rating}
                    </Typography>
                    <Typography variant="h5" sx={{ ml: 1 }}>
                      {getLabel(service?.rating)}
                    </Typography>
                  </Box>
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
                            {service?.promotion.value}%
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
                    {calculateFinalPrice()} VND
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
