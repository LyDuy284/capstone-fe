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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { getTransactionHistoryByCoupleId } from '../../../redux/apiRequest';

const TransactionHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const getData = async () => {
    setLoading(true);
    const res = await getTransactionHistoryByCoupleId(user.userId, user.token);
    if (res) {
      setData(res);
    }
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);
  console.log(data);
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
          Lịch sử thanh toán
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
                    Trạng thái
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.map((item: any) => (
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
                            item.invoiceDetail.deposit
                              ? 'Đã cọc'
                              : 'Đã tất toán'
                          }
                          sx={{
                            height: '24px',
                            width: '100px',
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default TransactionHistory;
