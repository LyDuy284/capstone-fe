import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { getTransactionHistoryByCoupleId } from '../../../redux/apiRequest';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { COMBO_STATUS, TRANSACTION_STATUS } from '../../../constants/consts';

const convertStatusName = (status: string) => {
  switch (status) {
    case TRANSACTION_STATUS.COMPLETED:
      return { label: "Đã thanh toán", color: "green" };
    case TRANSACTION_STATUS.PROCESSING:
      return { label: "Đang đợi", color: "orange" };
    default:
      return { label: "Quá hạn", color: "red" };
  }
};

const TransactionHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().startOf('month')
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf('month'));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số lượng mục trên mỗi trang
  const user = useSelector((state: any) => state.auth.login.currentUser);

  const getData = async () => {
    setLoading(true);
    const from = startDate ? startDate.format('YYYY-MM-DD') : '';
    const to = endDate ? endDate.format('YYYY-MM-DD') : '';

    const res = await getTransactionHistoryByCoupleId(
      user.userId,
      user.token,
      from,
      to
    );
    if (res) {
      setData(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [startDate, endDate]); // Cập nhật khi ngày thay đổi

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

  // Phân trang dữ liệu
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
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
          Lịch sử thanh toán
        </Divider>
      </Typography>

      <Box mb={4} display="flex" gap={2} alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
            format="DD/MM/YYYY"
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
            format="DD/MM/YYYY"
          />
        </LocalizationProvider>
      </Box>

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
                    Mã thanh toán
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Ngày thanh toán
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Tiền thanh toán
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Phương thức thanh toán
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Hình thức
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Trạng thái
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ fontSize: 14 }}>{item?.id}</TableCell>
                    <TableCell sx={{ fontSize: 14 }}>
                      {formatDate(item.dateCreated)}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14 }}>
                      {item.amount.toLocaleString()} VND
                    </TableCell>
                    <TableCell sx={{ fontSize: 14 }}>
                      {item.paymentMethod}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14 }}>
                      <Chip
                        color={`${
                          item.invoiceDetail.deposit ? 'primary' : 'success'
                        }`}
                        label={
                          item.invoiceDetail.deposit ? 'Cọc' : 'Tất toán'
                        }
                        sx={{
                          height: '24px',
                          width: '100px',
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, color: convertStatusName(item.status).color }}>
                          {convertStatusName(item.status).label}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(data.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default TransactionHistory;
