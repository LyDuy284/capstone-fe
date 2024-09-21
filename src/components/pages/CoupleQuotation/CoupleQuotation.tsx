import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from '../../../utils/CartStorage';
import FormBooking from './FormBooking';

const CoupleQuotation: React.FC = () => {
  const navigate = useNavigate();
  const [servicesPrice, setServicePrice] = useState(getCart());
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const handleStorageChange = () => {
      setServicePrice(getCart());
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
    setServicePrice(getCart());
  };

  const totalPrice = servicesPrice.reduce((total, product) => {
    const price = product.price ?? 0;
    return total + product.quantity * price;
  }, 0);

  const totalPromotionPrice = servicesPrice.reduce((total, product) => {
    const price = product.price ?? 0;
    const quantity = product.quantity ?? 1;
    const promotion = product.promotion ?? { type: 'PERCENT', value: 0 };

    if (promotion.type === 'MONEY') {
      return total + promotion.value * quantity;
    } else if (promotion.type === 'PERCENT') {
      return total + price * (promotion.value / 100) * quantity;
    }
    return total;
  }, 0);

  const finalTotalPrice = totalPrice - totalPromotionPrice;
  return (
    <Box p={3}>
      <Typography
        variant="h4"
        my={2}
        fontWeight={600}
        sx={{ textTransform: 'uppercase', color: 'var(--primary-color)' }}
      >
        <Divider
          sx={{
            mx: 'auto',
            width: 500,
            '&::before, &::after': {
              borderColor: 'var(--primary-color)',
              borderWidth: '1px',
            },
          }}
        >
          Danh sách dịch vụ
        </Divider>
      </Typography>
      <TableContainer elevation={4} sx={{ my: 4 }} component={Card}>
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
                STT
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 16,
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                }}
              >
                Hình ảnh
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 16,
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                }}
              >
                Tên sản phẩm
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 16,
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                }}
              >
                Giá bán
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 16,
                  color: 'var(--primary-color)',
                  fontWeight: 600,
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
                Khuyến mãi
              </TableCell>

              <TableCell
                sx={{
                  fontSize: 16,
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Xóa
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicesPrice.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell sx={{ fontSize: 14 }}>{index + 1}</TableCell>
                <TableCell>
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    sx={{ borderRadius: '8px' }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: 14, fontWeight: 550 }}>
                  {product.name}
                </TableCell>
                <TableCell sx={{ fontSize: 14 }}>
                  {product.price.toLocaleString()} VNĐ
                </TableCell>
                <TableCell sx={{ fontSize: 14 }}>
                  <TextField
                    value={product.quantity}
                    onChange={(event) => {
                      updateCartItemQuantity(
                        product.id,
                        parseInt(event.target.value)
                      );
                      setServicePrice(getCart());
                    }}
                    id="outlined-number"
                    label="Number"
                    type="number"
                    size="small"
                    InputProps={{ inputProps: { min: 1 } }}
                    disabled={
                      product.category !== 'CATEGORY-1' &&
                      product.category !== 'CATEGORY-7'
                    }
                  />
                </TableCell>
                <TableCell
                  sx={{ fontSize: 14, fontWeight: 550, color: 'green' }}
                >
                  {product.promotion ? (
                    product.promotion?.type === 'MONEY' ? (
                      <span>
                        - {product.promotion?.value.toLocaleString()} VNĐ{' '}
                      </span>
                    ) : (
                      <span>- {product.promotion?.value} % </span>
                    )
                  ) : (
                    <>-</>
                  )}
                </TableCell>

                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton onClick={() => handleRemoveFromCart(product.id)}>
                    <DeleteIcon sx={{ fontSize: 30, color: 'red' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display="flex" flexDirection="column" alignItems="flex-end">
        <Typography variant="h5">
          Tổng cộng:{' '}
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            {totalPrice.toLocaleString('vi-VN')} VND
          </Box>
        </Typography>
        <Typography variant="h5">
          Giảm giá khuyến mãi:{' '}
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            -{totalPromotionPrice.toLocaleString('vi-VN')} VND
          </Box>
        </Typography>
        <Typography my={2} variant="h5">
          Tổng thanh toán:{' '}
          <Box component="span" sx={{ color: 'green', fontWeight: 'bold' }}>
            {finalTotalPrice.toLocaleString('vi-VN')} VND
          </Box>
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2, px: 4, py: 1, fontSize: 14, fontWeight: 600 }}
            onClick={() => navigate(-1)}
          >
            Tiếp tục đặt dịch vụ
          </Button>
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
            disabled={servicesPrice.length === 0}
            onClick={() => setModalOpen(true)}
          >
            Đặt dịch vụ
          </Button>
        </Box>
      </Box>
      <FormBooking
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        services={servicesPrice}
        totalPrice={totalPrice}
        totalPromotionPrice={totalPromotionPrice}
      />
    </Box>
  );
};

export default CoupleQuotation;
