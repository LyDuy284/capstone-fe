import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RequestPricePopup from '../Popup/Couple/RequestPricePopup';
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
}) => {
  const navigate = useNavigate();
  console.log(categoryId);
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

        <Chip
          label={type === 'LUXURY' ? 'Cao cấp' : 'Phổ thông'}
          color={type === 'LUXURY' ? 'secondary' : 'warning'}
          sx={{ width: 80, fontSize: 10, fontWeight: 600 }}
          size="small"
        />
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
            className="btn-item"
            sx={{ minWidth: 200 }}
            style={{ backgroundColor: 'var(--primary-color)' }}
            variant="contained"
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
            Đặt hàng
          </Button>
        </div>
      </div>
    </li>
  );
};

export default ServiceItemViewCard;
