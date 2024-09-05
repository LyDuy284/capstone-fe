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
import { getBalanceWallet, getWalletHistory } from '../../../redux/apiRequest';

const WalletHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const user = useSelector((state: any) => state.auth.login.currentUser);

  const getData = async () => {
    setLoading(true);
    const res = await getBalanceWallet(user.accountId, user.token);
    if (res) {
      const response = await getWalletHistory(res.id, user.token);
      if (response) setData(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

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
          Lịch sử ví
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
                {data &&
                  data.map((item: any) => (
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
        </>
      )}
    </Box>
  );
};

export default WalletHistory;
