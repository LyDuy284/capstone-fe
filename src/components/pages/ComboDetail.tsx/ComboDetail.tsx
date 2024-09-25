import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getServiceSupplierByComboId } from '../../../api/CoupleAPI';
import '../CoupleService/CoupleService.css';
import { CircularProgress } from '@mui/material';
import ServiceItemViewCard from '../CoupleService/ServiceItemViewCard';
import { getServiceSupplierById } from '../../../redux/apiRequest';

const ComboDetail = () => {
  const { id } = useParams();
  const [combo, setCombo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const getDetail = async (comboId: string) => {
    setLoading(true);

    const res = await getServiceSupplierByComboId(comboId);
    if (res) {
      setCombo(res);
      const categoryIds: string[] = [];

      for (const i of res) {
        const response = await getServiceSupplierById(i.id);
        if (response) {
          const categoryId = response.serviceResponse.categoryResponse.id;
          console.log(categoryId);
          categoryIds.push(categoryId);
        }
      }
      setCategories(categoryIds);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (id) {
      getDetail(id);
    }
  }, []);
  return (
    <div id="CoupleService">
      <div className="flex justify-center ml-60">
        <div className="filter-content">
          <div className="content-header">
            <strong>{combo?.length}</strong> kết quả
          </div>
          <ul className="content-list">
            {loading && (
              <div className="w-full flex items-center justify-center h-[70vh]">
                <CircularProgress />
              </div>
            )}

            {!loading &&
              combo?.map((item: any, index: number) => {
                return (
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
                    categoryId={categories[index]}
                    status={item.status}
                  />
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComboDetail;
