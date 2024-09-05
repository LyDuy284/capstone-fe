import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { getBookingHistoryByCoupleId } from '../../../redux/apiRequest';
import { Inventory, Visibility } from '@mui/icons-material';
import StatusChip from './StatusChip';
import { BOOKING_STATUS } from '../../../constants/consts';

const BookingHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: any) => state.auth.login.currentUser);

  const getData = async () => {
    setLoading(true);
    const res = await getBookingHistoryByCoupleId(user.userId, user.token);
    if (res) {
      const sortedData = res.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setData(sortedData);
      setFilteredData(sortedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status') || 'all';
    setSelectedStatus(status);

    if (status === 'all') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((booking: any) => booking.status === status));
    }
  }, [location.search, data]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(`?status=${newValue}`);
  };

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
    <Box p={3}>
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
          Đơn hàng
        </Divider>
      </Typography>

      <Tabs
        value={selectedStatus}
        onChange={handleTabChange}
        TabIndicatorProps={{
          style: {
            backgroundColor: 'var(--primary-color)',
          },
        }}
        sx={{
          '& .MuiTab-root': {
            fontWeight: 600,
          },
          '& .MuiTab-root.Mui-selected': {
            color: 'var(--primary-color)',
            fontSize: 9,
            fontWeight: 600,
          },
        }}
      >
        <Tab label="Tất cả" value="all" />
        <Tab label="Chờ xử lý" value={BOOKING_STATUS.pending} />
        <Tab label="Đã phê duyệt" value={BOOKING_STATUS.approved} />
        <Tab label="Đã đặt cọc" value={BOOKING_STATUS.deposited} />
        <Tab label="Đang xử lý" value={BOOKING_STATUS.processing} />
        <Tab label="Hoàn tất" value={BOOKING_STATUS.done} />
        <Tab label="Đã hoàn thành" value={BOOKING_STATUS.completed} />
        <Tab label="Đã hủy" value={BOOKING_STATUS.cancel} />
      </Tabs>

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
                    Tổng giá
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Ngày tạo đơn
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
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    Chi tiết
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell sx={{ fontSize: 14 }}>{booking?.id}</TableCell>

                    <TableCell sx={{ fontSize: 14 }}>
                      {booking.totalPrice.toLocaleString()} VND
                    </TableCell>
                    <TableCell sx={{ fontSize: 14 }}>
                      {formatDate(booking.createdAt)}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, textAlign: 'center' }}>
                      <StatusChip status={booking.status} />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton
                        onClick={() =>
                          navigate(`/booking-history/${booking.id}`)
                        }
                      >
                        <Visibility
                          sx={{
                            fontSize: 20,
                            color: 'blue',
                          }}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredData.length === 0 && (
              <div className="w-full h-[40vh] flex flex-col justify-center items-center gap-4">
                <div>
                  <Inventory sx={{ width: 60, height: 60, color: 'gray' }} />
                </div>
                <div className="font-semibold text-3xl text-gray-500">
                  Không có kết quả tìm kiếm
                </div>
              </div>
            )}
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default BookingHistory;
