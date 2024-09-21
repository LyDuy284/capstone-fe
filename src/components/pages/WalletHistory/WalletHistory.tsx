import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { getBalanceWallet, getWalletHistory } from '../../../redux/apiRequest';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const WalletHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const date = dayjs();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    date.startOf('month')
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(
    date.endOf('month')
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const getData = async () => {
    setLoading(true);
    const res = await getBalanceWallet(user.accountId, user.token);
    if (res) {
      const response = await getWalletHistory(
        res?.id,
        user?.token,
        formatDateToFilter(startDate),
        formatDateToFilter(endDate)
      );

      if (response) setData(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [startDate, endDate]); // Depend on date changes

  const formatDateToFilter = (date: Dayjs | null): string => {
    return date ? date.format('YYYY-MM-DD') : '';
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

  // Paginate data
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          Lịch sử ví
        </Divider>
      </Typography>
      <Box mb={4} display="flex" gap={2} alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Ngày bắt đầu"
            value={startDate}
            onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
            format="DD/MM/YYYY"
          />
          <DatePicker
            label="Ngày kết thúc"
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
                    Mã lịch sử
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Ngày tạo
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Số tiền
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Loại giao dịch
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 16,
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                    }}
                  >
                    Mô tả
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ fontSize: 14 }}>{item?.id}</TableCell>
                    <TableCell sx={{ fontSize: 14 }}>
                      {formatDate(item.createDate)}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14 }}>
                      {item.amount.toLocaleString()} VND
                    </TableCell>
                    <TableCell sx={{ fontSize: 14 }}>
                      <Chip
                        color={item.type === 'PlUS' ? 'success' : 'error'}
                        label={item.type === 'PlUS' ? 'Cộng' : 'Trừ'}
                        sx={{
                          height: '24px',
                          width: '60px',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 14 }}>
                      {item.description}
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

export default WalletHistory;
