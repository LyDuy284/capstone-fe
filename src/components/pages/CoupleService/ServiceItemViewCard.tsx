import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Chip } from '@mui/material';

import { addToCart } from '../../../utils/CartStorage';

interface ServiceItemViewCardProps {
  id: string;
  imageUrl: string;
  location: string;
  title: string;
  description: string;
  type: string;
  price: number;
  suplierID: string;
  promotion: any;
  categoryId: string;
  status: string;
}

const ServiceItemViewCard: React.FC<ServiceItemViewCardProps> = ({
  id,
  imageUrl,
  location,
  title,
  description,
  type,
  price,
  suplierID,
  promotion,
  categoryId,
  status,
}) => {
  const navigate = useNavigate();
  return (
    <li className="content-item">
      <div className="content-gallery">
        <img src={imageUrl} alt="" />
      </div>
      <div className="content-infor">
        <div className="item-subtitle">
          <div className="item-location">{location}</div>
        </div>
        <h2
          className="item-title mb-2"
          onClick={() => {
            navigate(`/services/details/${id}`);
          }}
        >
          {title}
        </h2>
        <div className="flex justify-between">
          <Chip
            label={type === 'LUXURY' ? 'Cao cấp' : 'Phổ thông'}
            color={type === 'LUXURY' ? 'secondary' : 'warning'}
            sx={{ width: 80, fontSize: 10, fontWeight: 600 }}
            size="small"
          />
          {status === 'ACTIVATED' ? (
            <div className="text-xl font-bold text-green-400">Hoạt động</div>
          ) : (
            <div className="text-xl font-bold text-gray-400">
              Ngừng kinh doanh
            </div>
          )}
        </div>

        <div className="font-bold text-2xl my-5">
          {' '}
          {price.toLocaleString('vi-VN')} VNĐ
          {promotion && (
            <div className="text-xl font-medium text-green-400">
              {promotion.type === 'MONEY' ? (
                <span>(- {promotion.value.toLocaleString()} VNĐ) </span>
              ) : (
                <span>(- {promotion.value} %) </span>
              )}
            </div>
          )}
        </div>

        <p className="item-description">
          <span>{description}</span>
        </p>
        <div className="item-footer">
          <Button
            variant="contained"
            disabled={status !== 'ACTIVATED'}
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
            onClick={() => {
              addToCart({
                id: id,
                image: imageUrl,
                name: title,
                price: price,
                promotion: promotion,
                quantity: 1,
                category: categoryId,
              });
            }}
          >
            Đặt dịch vụ
          </Button>
        </div>
      </div>
    </li>
  );
};

export default ServiceItemViewCard;
