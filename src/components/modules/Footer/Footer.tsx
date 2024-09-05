import React from 'react'
import "./Footer.css"
import { LOGO } from '../../../constants/consts'
import CopyrightIcon from '@mui/icons-material/Copyright';

const Footer = () => {
  return (
    <div id='Footer'>
      <div className="main-section">
        <div className="logo">
          <img src={LOGO} alt="" />
        </div>
        <div className="content-footer">
          <span className="title">NỀN TẢNG DỊCH VỤ CƯỚI THE DAY</span>
          <ul className="content-list">
            <li className="content-item">Địa chỉ: Vinhomes Grand Park, 18 Nguyễn Xiển, phường Long Thạnh Mỹ, Thành phố Thủ Đức, Thành Phố Hồ Chí Minh</li>
            <li className="content-item">Mobile: 0979477952 - Mr.Duy</li>
            <li className="content-item">Email: lyhieuduy9190@gmail.com</li>
          </ul>
        </div>
        <div className="service-footer">
          <span className="title">DỊCH VỤ</span>
          <ul className="service-list">
            <li className="service-item">THIỆP CƯỚI</li>
            <li className="service-item">DẠM NGÕ</li>
            <li className="service-item">ẢNH CƯỚI</li>
            <li className="service-item">TRANG PHỤC</li>
            <li className="service-item">MAKEUP</li>
            <li className="service-item">XE HOA</li>
            <li className="service-item">NHÀ HÀNG VÀ ĐỊA ĐIỂM</li>
            <li className="service-item">TRANG TRÍ</li>
            <li className="service-item">LỄ VẬT</li>
          </ul>
        </div>
        <div className="policies-footer">
          <span className="title">CHÍNH SÁCH</span>
          <ul className="content-list">
            <li className="service-item">Chính sách hoàn/ trả tiền</li>
          </ul>
        </div>
      </div>
      <div className="founder">
        <CopyrightIcon className='icon-footer'></CopyrightIcon><span>2024 thuộc về The Day</span>
      </div>
    </div>
  )
}

export default Footer