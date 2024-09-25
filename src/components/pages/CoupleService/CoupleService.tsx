import { useEffect, useState } from 'react';
import './CoupleService.css';
import {
  Box,
  Button,
  CircularProgress,
  Pagination,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import ServiceItemViewCard from './ServiceItemViewCard';
import { ServiceData } from '../../../utils/ServiceData';
import {
  getServiceByCategory,
  getServicesByCategory,
} from '../../../api/CoupleAPI';
import { Inventory } from '@mui/icons-material';

const CoupleService = () => {
  const { categoryID } = useParams();

  const location = useLocation();
  // const coupleServiceData = ServiceData.find((e) => e.name === path);
  const [selectedService, setSelectedService] = useState<any[]>([]);

  const [selectedServiceList, setSelectedServiceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New filter states
  const [type, setType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [service, setService] = useState('');
  const [status, setStatus] = useState('');

  const getServices = async (categoryID: string) => {
    setLoading(true);

    const response = await getServicesByCategory(categoryID);
    setSelectedService(response);
  };
  const getSelectedServiceList = async (
    categoryID: string,
    type: string,
    priceRange: string,
    serviceID: string,
    status: string
  ) => {
    // Convert price range to minPrice and maxPrice
    setLoading(true);

    let minPrice, maxPrice;
    switch (priceRange) {
      case '1':
        minPrice = 0;
        maxPrice = 5000000;
        break;
      case '2':
        minPrice = 5000000;
        maxPrice = 10000000;
        break;
      case '3':
        minPrice = 10000000;
        maxPrice = 15000000;
        break;
      case '4':
        minPrice = 15000000;
        maxPrice = 20000000;
        break;
      case '5':
        minPrice = 20000000;
        maxPrice = undefined; // No upper limit
        break;
      default:
        minPrice = undefined;
        maxPrice = undefined;
        break;
    }

    const response = await getServiceByCategory(
      categoryID,
      minPrice,
      maxPrice,
      type,
      serviceID,
      status
    );
    setSelectedServiceList(response);
    setLoading(false);
  };

  useEffect(() => {
    getServices(categoryID ?? '');
    getSelectedServiceList(categoryID ?? '', '', '', '', '');
  }, []);
  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  // Handle type change
  const handleTypeChange = (event: any) => {
    setCurrentPage(1);
    const newType = event.target.value;
    setType(newType);
    getSelectedServiceList(
      categoryID ?? '',
      newType,
      priceRange,
      service,
      status
    );
  };
  const handleServiceChange = (event: any) => {
    setCurrentPage(1);
    const newService = event.target.value;
    setService(newService);
    getSelectedServiceList(
      categoryID ?? '',
      type,
      priceRange,
      newService,
      status
    );
  };

  // Handle price range change
  const handlePriceRangeChange = (event: any) => {
    setCurrentPage(1);
    const newPriceRange = event.target.value;
    setPriceRange(newPriceRange);
    getSelectedServiceList(
      categoryID ?? '',
      type,
      newPriceRange,
      service,
      status
    );
  };
  const handleStatusChange = (event: any) => {
    setCurrentPage(1);
    const newStatus = event.target.value;
    setStatus(newStatus);
    getSelectedServiceList(
      categoryID ?? '',
      type,
      priceRange,
      service,
      newStatus
    );
  };
  // Paginate items
  const paginatedItems = selectedServiceList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setType('');
    setPriceRange('');
    setService('');
    setCurrentPage(1);
    getSelectedServiceList(categoryID ?? '', '', '', '', '');
  };
  return (
    <div id="CoupleService">
      <div className="image-service">
        {/* <img src={coupleServiceData?.imageBig} alt={coupleServiceData?.alt} /> */}
      </div>

      <div className="content">
        <aside className="aside-bar">
          <div className="filter-component">
            <legend className="filter-name">Trạng thái</legend>
            <ul className="filter-list">
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={status}
                onChange={handleStatusChange}
                name="radio-buttons-group"
              >
                <li className="filter-item">
                  <Radio
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    value="ACTIVATED"
                  />
                  Hoạt động
                </li>
                <li className="filter-item">
                  <Radio
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    value="DISABLED"
                  />
                  Ngừng kinh doanh
                </li>
              </RadioGroup>
            </ul>
          </div>
          <div className="filter-component">
            <legend className="filter-name">Phân cấp</legend>
            <ul className="filter-list">
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={type}
                onChange={handleTypeChange}
                name="radio-buttons-group"
              >
                <li className="filter-item">
                  <Radio
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    value="ECONOMY"
                  />
                  Phổ thông
                </li>
                <li className="filter-item">
                  <Radio
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    value="LUXURY"
                  />
                  Cao cấp
                </li>
              </RadioGroup>
            </ul>
          </div>

          {selectedService?.length !== 0 && (
            <div className="filter-component">
              <legend className="filter-name">Dịch vụ</legend>
              <ul className="filter-list">
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={service}
                  onChange={handleServiceChange}
                  name="radio-buttons-group"
                >
                  {selectedService.map((item, index) => (
                    <li key={index} className="filter-item">
                      <Radio
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                        value={item.id}
                      />
                      {item.name.charAt(0).toUpperCase() +
                        item.name.slice(1).toLowerCase()}
                    </li>
                  ))}
                </RadioGroup>
              </ul>
            </div>
          )}

          <div className="filter-component">
            <legend className="filter-name">Chi phí</legend>
            <ul className="filter-list">
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={priceRange}
                onChange={handlePriceRangeChange}
                name="radio-buttons-group"
              >
                <li className="filter-item">
                  <Radio
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    value="1"
                  />{' '}
                  Dưới 5.000.000 VNĐ
                </li>
                <li className="filter-item">
                  <Radio
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    value="2"
                  />
                  5.000.000 - 10.000.000 VNĐ
                </li>
                <li className="filter-item">
                  <Radio
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    value="3"
                  />
                  10.000.000 - 15.000.000 VNĐ
                </li>
                <li className="filter-item">
                  <Radio
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    value="4"
                  />
                  15.000.000 - 20.000.000 VNĐ
                </li>
                <li className="filter-item">
                  <Radio
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    value="5"
                  />
                  Trên 20.000.000 VNĐ
                </li>
              </RadioGroup>
            </ul>
          </div>
          <Button onClick={resetFilters} variant="contained" color="secondary">
            Đặt lại
          </Button>
        </aside>
        <div className="filter-content">
          <div className="content-header">
            <strong>{selectedServiceList?.length}</strong> kết quả
          </div>
          <ul className="content-list">
            {loading && (
              <div className="w-full flex items-center justify-center h-[70vh]">
                <CircularProgress />
              </div>
            )}
            {!paginatedItems && (
              <div className="w-full h-[70vh] flex flex-col justify-center items-center gap-4">
                <div>
                  <Inventory sx={{ width: 60, height: 60, color: 'gray' }} />
                </div>
                <div className="font-semibold text-3xl text-gray-500">
                  Không có kết quả tìm kiếm
                </div>
              </div>
            )}
            {!loading &&
              paginatedItems?.map((item, index) => (
                <ServiceItemViewCard
                  key={index}
                  id={item.id}
                  imageUrl={item?.listImages[0]}
                  location={''}
                  title={item.name}
                  type={item.type}
                  promotion={item.promotion}
                  description={item.description}
                  price={item.price}
                  suplierID={item.id}
                  categoryId={categoryID ?? ''}
                  status={item.status}
                />
              ))}
          </ul>
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(selectedServiceList?.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
            />
          </Box>
        </div>
      </div>
    </div>
  );
};

export default CoupleService;
