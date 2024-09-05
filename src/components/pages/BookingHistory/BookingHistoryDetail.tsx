import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import {
  cancelBooking,
  getBalanceWallet,
  getBookingById,
  getBookingHistoryByCoupleId,
  ratingBooking,
  requestPayment,
} from '../../../redux/apiRequest';
import { BOOKING_STATUS } from '../../../constants/consts';
import { KeyboardBackspace, Visibility } from '@mui/icons-material';
import StatusChip from './StatusChip';
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const BookingHistoryDetail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [balance, setBalance] = useState<string>('0');

  const [reason, setReason] = useState('');
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const [rating, setRating] = useState<number | null>(0);
  const [description, setDescription] = useState('');
  const [detailId, setDetailId] = useState('');

  const { id } = useParams();
  const getBookingDetails = async (bookingId: string) => {
    setLoading(true);
    const res = await getBookingById(bookingId, user.token);
    if (res) setData(res);
  };
  async function fetchBalanceWallet() {
    const response = await getBalanceWallet(user?.accountId, user?.token);
    setBalance(response?.balance);
    setLoading(false);
  }
  useEffect(() => {
    if (id) {
      getBookingDetails(id);
      fetchBalanceWallet();
    }
  }, []);
  const hasApprovedItem = data?.listBookingDetail?.some(
    (item: any) => item.status === BOOKING_STATUS.approved
  );
  const hasDoneItem = data?.listBookingDetail?.some(
    (item: any) => item.status === BOOKING_STATUS.done
  );
  const remainingPayment = async (listBookingIds: string[]) => {
    console.log(listBookingIds);
    const args = { deposit: false, listBookingDetailId: listBookingIds };
    const res = await requestPayment(args, user.token);
    if (res) {
      if (
        res.urlPaymentVNPay === '' ||
        res.urlPaymentVNPay === null ||
        res.urlPaymentVNPay === undefined
      ) {
        if (id) {
          getBookingDetails(id);
        }
      } else window.location.href = res.urlPaymentVNPay;
    }
  };
  const totalPrice = () => {
    let total = 0;
    data.listBookingDetail.map((item: any) => {
      if (item.status === BOOKING_STATUS.done) {
        total = total + item.price;
      }
    });
    return total;
  };

  const handleDelete = async () => {
    setLoading(true);
    const res = await cancelBooking(detailId, reason, user.token);
    if (res) {
      if (id) getBookingDetails(id);
      setOpen(false);
      setReason('');
      setLoading(false);
      setDetailId('');
    }
  };
  const handleRating = async () => {
    setLoading(true);
    const res = await ratingBooking(
      detailId,
      rating,
      user.userId,
      description,
      user.token
    );
    if (res) {
      if (id) getBookingDetails(id);
      setOpenRating(false);
      setDescription('');
      setRating(0);
      setLoading(false);
      setDetailId('');
    }
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return `${formattedDate}`;
  };
  console.log(data);
  return (
    <Box p={3}>
      <Button
        variant="contained"
        className="text-start flex text-lg items-center gap-2 font-bold cursor-pointer "
        onClick={() => navigate(-1)}
      >
        <div>
          <KeyboardBackspace sx={{ width: 20, height: 20 }} />
        </div>
        <div>Trở về</div>
      </Button>
      <Typography
        variant="h4"
        my={4}
        fontWeight={600}
        sx={{ textTransform: 'uppercase', color: 'var(--primary-color)' }}
      >
        <Divider
          sx={{
            mx: 'auto',
            width: 700,
            '&::before, &::after': {
              borderColor: 'var(--primary-color)',
              borderWidth: '2px',
            },
          }}
        >
          Chi tiết đơn hàng
        </Divider>
      </Typography>
      {loading ? (
        <div className="flex h-[50vh] justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer elevation={4} sx={{ mt: 4 }} component={Card}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Mã đơn
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Dịch vụ
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Nhà cung cấp{' '}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    Số lượng
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Khuyến mãi{' '}
                  </TableCell>{' '}
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Tổng giá
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    Ngày hoàn thành
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    Trạng thái
                  </TableCell>
                  {(data?.status === BOOKING_STATUS.processing ||
                    data?.status === BOOKING_STATUS.completed ||
                    data?.status === BOOKING_STATUS.deposited) && (
                    <TableCell
                      sx={{
                        fontSize: 16,
                        color: 'var(--primary-color)',
                        fontWeight: 600,
                        textAlign: 'center',
                      }}
                    >
                      Hành động
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data?.listBookingDetail.map((detail: any) => (
                    <TableRow key={detail.id}>
                      <TableCell sx={{ fontSize: 14 }}>{detail?.id}</TableCell>
                      <TableCell sx={{ fontSize: 14 }}>
                        {detail.serviceSupplier.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14 }}>
                        {detail.serviceSupplier.supplierResponse.supplierName}{' '}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, textAlign: 'center' }}>
                        {detail.quantity}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: 14, fontWeight: 550, color: 'green' }}
                      >
                        {detail.promotionServiceSupplier ? (
                          detail.promotionServiceSupplier?.type === 'MONEY' ? (
                            <span>
                              -{' '}
                              {detail.promotionServiceSupplier?.value.toLocaleString()}{' '}
                              VNĐ{' '}
                            </span>
                          ) : (
                            <span>
                              - {detail.promotionServiceSupplier?.value} %{' '}
                            </span>
                          )
                        ) : (
                          <>-</>
                        )}{' '}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14 }}>
                        {detail.promotionServiceSupplier ? (
                          detail.promotionServiceSupplier?.type === 'MONEY' ? (
                            <>
                              {(
                                (detail.price -
                                  detail.promotionServiceSupplier?.value) *
                                detail.quantity
                              ).toLocaleString()}
                            </>
                          ) : (
                            <>
                              {(
                                (detail.price -
                                  (detail.price *
                                    (detail.promotionServiceSupplier?.value ??
                                      0)) /
                                    100) *
                                detail.quantity
                              ).toLocaleString()}{' '}
                            </>
                          )
                        ) : (
                          <>
                            {(detail.price * detail.quantity).toLocaleString()}
                          </>
                        )}{' '}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, textAlign: 'center' }}>
                        {formatDate(detail.completedDate)}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, textAlign: 'center' }}>
                        <StatusChip status={detail.status} />
                      </TableCell>
                      {(detail?.status === BOOKING_STATUS.processing ||
                        detail?.status === BOOKING_STATUS.deposited) && (
                        <>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <IconButton
                              disabled={detail.status === BOOKING_STATUS.cancel}
                              onClick={() => {
                                setOpen(true);
                                setDetailId(detail.id);
                              }}
                            >
                              <DeleteIcon
                                sx={{
                                  fontSize: 20,
                                  color:
                                    detail.status === BOOKING_STATUS.cancel
                                      ? 'gray'
                                      : 'red',
                                }}
                              />
                            </IconButton>
                          </TableCell>
                          <Modal
                            open={open}
                            onClose={() => setOpen(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                              <Typography fontWeight={500} fontSize={16} mb={2}>
                                Điền lý do hủy
                              </Typography>
                              <TextField
                                type="text"
                                fullWidth
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                label={'Lý do'}
                              />
                              <Box sx={{ textAlign: 'end', mt: 2 }}>
                                <Button
                                  sx={{
                                    px: 2,
                                    py: 0.5,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white',
                                  }}
                                  variant="contained"
                                  onClick={() => handleDelete()}
                                  disabled={reason === ''}
                                >
                                  Xác nhận
                                </Button>
                              </Box>
                            </Box>
                          </Modal>
                        </>
                      )}
                      {data?.status === BOOKING_STATUS.completed && (
                        <>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Box>
                              <Button
                                sx={{
                                  px: 2,
                                  py: 0.5,
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}
                                disabled={detail.serviceSupplier.rating !== 0}
                                onClick={() => {
                                  setOpenRating(true);
                                  setDetailId(detail.id);
                                }}
                              >
                                {detail.serviceSupplier.rating !== 0
                                  ? 'Đã đánh giá'
                                  : 'Đánh giá'}
                              </Button>
                            </Box>
                          </TableCell>
                          <Modal
                            open={openRating}
                            onClose={() => setOpenRating(true)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                              <Typography fontWeight={500} fontSize={16} mb={2}>
                                Đánh giá
                              </Typography>
                              <Rating
                                name="simple-controlled"
                                value={rating}
                                onChange={(event, newValue) => {
                                  setRating(newValue);
                                }}
                                size="large"
                              />
                              <TextField
                                type="text"
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                label={'Mô tả đánh giá'}
                                multiline
                                rows={3}
                              />
                              <Box sx={{ textAlign: 'end', mt: 2 }}>
                                <Button
                                  onClick={() => handleRating()}
                                  sx={{
                                    px: 2,
                                    py: 0.5,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white',
                                  }}
                                  variant="contained"
                                  disabled={rating === 0}
                                >
                                  Xác nhận
                                </Button>
                              </Box>
                            </Box>
                          </Modal>
                        </>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            my={2}
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
          >
            {hasApprovedItem && (
              <>
                <Typography my={1} variant="h5">
                  Tổng cộng:{' '}
                  <Box
                    component="span"
                    sx={{ color: 'green', fontWeight: 'bold' }}
                  >
                    {data?.totalPrice?.toLocaleString()} VND
                  </Box>
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 1,
                      fontSize: 14,
                      fontWeight: 600,
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                    }}
                    onClick={() => navigate(`/booking-details/${id}`)}
                  >
                    Đặt cọc
                  </Button>
                </Box>
              </>
            )}
            {hasDoneItem && (
              <>
                <Typography my={1} variant="h5">
                  Tổng cộng:{' '}
                  <Box
                    component="span"
                    sx={{ color: 'green', fontWeight: 'bold' }}
                  >
                    {totalPrice().toLocaleString()} VND
                  </Box>
                </Typography>
                <Typography my={1} variant="h5">
                  Tiền đã cọc (20%):{' '}
                  <Box
                    component="span"
                    sx={{ color: 'blue', fontWeight: 'bold' }}
                  >
                    {(totalPrice() * 0.2)?.toLocaleString()} VND
                  </Box>
                </Typography>
                <Typography my={1} variant="h5">
                  Còn lại:{' '}
                  <Box
                    component="span"
                    sx={{ color: 'red', fontWeight: 'bold' }}
                  >
                    {(totalPrice() - totalPrice() * 0.2)?.toLocaleString()} VND
                  </Box>
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 1,
                      fontSize: 14,
                      fontWeight: 600,
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                    }}
                    onClick={() => setOpenDeposit(true)}
                  >
                    Tất toán
                  </Button>
                </Box>
                <Modal
                  open={openDeposit}
                  onClose={() => setOpenDeposit(false)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="h5">Số dư ví:</Typography>
                      <Typography variant="h5">
                        <Box
                          component="span"
                          sx={{ color: 'green', fontWeight: 'bold' }}
                        >
                          {balance.toLocaleString()} VNĐ
                        </Box>
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 3,
                      }}
                    >
                      <Typography variant="h5">
                        {' '}
                        Tổng tiền cần thanh toán:
                      </Typography>
                      <Typography variant="h5">
                        <Box
                          component="span"
                          sx={{ color: 'red', fontWeight: 'bold' }}
                        >
                          {(totalPrice() * 0.2).toLocaleString()} VNĐ
                        </Box>
                      </Typography>
                    </Box>
                    <Typography color={'red'} mt={2}>
                      <i>
                        Ghi chú: Số tiền sẽ được trừ trực tiếp vào ví nếu số dư
                        còn đủ. Nếu không, bạn cần thanh toán qua phương thức
                        trực tuyến.
                      </i>
                    </Typography>

                    <Box sx={{ textAlign: 'end', mt: 2 }}>
                      <Button
                        onClick={() => {
                          const listBookingIds: string[] = [];
                          data.listBookingDetail.map((item: any) => {
                            if (item.status === BOOKING_STATUS.done)
                              listBookingIds.push(item.id);
                          });
                          remainingPayment(listBookingIds);
                        }}
                        sx={{
                          px: 2,
                          py: 0.5,
                          fontSize: 12,
                          fontWeight: 600,
                          backgroundColor: 'var(--primary-color)',
                          color: 'white',
                        }}
                        variant="contained"
                      >
                        Xác nhận
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              </>
            )}
            {/* {data?.status === BOOKING_STATUS.done && (
              <>
                <Typography my={1} variant="h5">
                  Tổng cộng:{' '}
                  <Box
                    component="span"
                    sx={{ color: 'green', fontWeight: 'bold' }}
                  >
                    {data?.totalPrice?.toLocaleString()} VND
                  </Box>
                </Typography>
                <Typography my={1} variant="h5">
                  Tiền đã cọc (20%):{' '}
                  <Box
                    component="span"
                    sx={{ color: 'blue', fontWeight: 'bold' }}
                  >
                    {(data?.totalPrice * 0.2)?.toLocaleString()} VND
                  </Box>
                </Typography>
                <Typography my={1} variant="h5">
                  Còn lại:{' '}
                  <Box
                    component="span"
                    sx={{ color: 'red', fontWeight: 'bold' }}
                  >
                    {(
                      data?.totalPrice -
                      data?.totalPrice * 0.2
                    )?.toLocaleString()}{' '}
                    VND
                  </Box>
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 1,
                      fontSize: 14,
                      fontWeight: 600,
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                    }}
                    onClick={remainingPayment}
                  >
                    Tất toán
                  </Button>
                </Box>
              </>
            )} */}
          </Box>
        </>
      )}
    </Box>
  );
};

export default BookingHistoryDetail;
