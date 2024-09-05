import React from 'react'
import { useNavigate, useParams } from 'react-router';
import { SetStateAction, Dispatch, FC, useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel';
import { Paper, Button, CircularProgress, FormControl, Select, MenuItem, Box, Typography, Modal } from '@mui/material';
import { Container } from '@mui/material';
import "./ServiceDetail.css";
import "../../../constants/styles/TableService.css";
// import { getServicesById } from '../../../redux/apiRequest';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { ServiceSupplierDetail } from '../../../types/schema/serviceSupplier';
import { getListCategories, getPromotionBySupplier, getServiceSupplierById, getServicesByCategoryId, updateServiceSupplier } from '../../../redux/apiRequest';
import { PromotionItem } from '../../../types/schema/promotion';
import { ServiceItem } from '../../../types/schema/service';
import { CategoryItem } from '../../../types/schema/category';
import { ALL_SELECT, ECONOMY_SEGMENT, LUXURY_SEGMENT } from '../../../constants/consts';
import { useDispatch, useSelector } from 'react-redux';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ServiceCreate, ServiceUpdate } from '../../../types/entity/Entity';
import { SegmentItem } from '../../../types/schema/segment';
import { currencyMask, currencyMaskString, currencyToNumber } from '../../../constants/convert';

interface Props {
  setMessageStatus: Dispatch<SetStateAction<string>>;
  setMessage: Dispatch<SetStateAction<string>>;
}

const segments = [
  ECONOMY_SEGMENT,
  LUXURY_SEGMENT
]

const storage = getStorage();

const defaultValuePromotion: PromotionItem = {
  id: 'none',
  name: 'KHÔNG',
  value: 0,
  startDate: '',
  endDate: '',
  status: '',
  type: ''
}

const ServiceDetail: FC<Props> = (props) => {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const { id } = useParams();
  const [serviceDetail, setServiceDetail] = useState<ServiceSupplierDetail>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(false);

  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [promotion, setPromotion] = useState<PromotionItem>(defaultValuePromotion);
  const [segment, setSegment] = useState<SegmentItem>();
  const [serviceName, setServiceName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('0');
  const [images, setImages] = useState<string[]>([]);

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
    try {
      setIsLoadingEdit(true);
      if (serviceDetail?.promotion == null) {
        setPromotion(defaultValuePromotion);
      } else {
        setPromotion(serviceDetail?.promotion);
      }
      fetchPromotions();
      setServiceName(`${serviceDetail?.name}`);
      setDescription(`${serviceDetail?.description}`);
      (serviceDetail?.price) && setPrice(currencyMaskString(serviceDetail?.price));
      setImages(serviceDetail?.listImages?.map(image => image.toString()) ?? []);
      setSegment(segments?.find((seg) => seg.id === serviceDetail?.type) ?? undefined);
    } catch (error) {

    } finally {
      setIsLoadingEdit(false)
    }
  };
  const handleClose = () => setOpen(false);


  useEffect(() => {
    fetchData();
  }, [])


  async function fetchData() {
    setIsLoading(true);
    const response =
      await getServiceSupplierById(id);
    setServiceDetail(response);
    setIsLoading(false);
  }

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  }

  const uploadImage = async (files: FileList | null) => {
    if (files) {
      const fileRef = files[0];
      const storageRef = ref(storage, `images/${fileRef?.name}`);

      try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, fileRef);

        // Get the download URL for the file
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Set the state to the download URL
        setImages([...images, downloadURL]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchPromotions = async () => {
    const response = await getPromotionBySupplier(user?.userId);
    if (Array.isArray(response)) {
      setPromotions([defaultValuePromotion, ...response]);
    } else {
      // Handle the case where response is not an array
      console.error('Response is not an array', response);
    }
  }

  const handleChangePromotion = (event: any) => {
    const selectedPromotion = promotions.find(pro => pro.id === event.target.value);
    if (selectedPromotion) {
      setPromotion(selectedPromotion);
    }
  };

  const handleChangeSegment = (event: any) => {
    const selectedSegment = segments.find(seg => seg.id === event.target.value);
    if (selectedSegment) {
      setSegment(selectedSegment);
    }
  };

  const handleCreate = async () => {
    try {
      let getImagesPayload = "";
      images.map((image) => {
        getImagesPayload += image + "\n, "
      })
      console.log("images", images);
      console.log("service images", serviceDetail?.listImages);


      const newService: ServiceUpdate = {
        id: `${serviceDetail?.id}`,
        description: description,
        images: getImagesPayload,
        promotionId: (promotion?.id == 'none') ? "" : `${promotion?.id}`,
        name: serviceName,
        price: currencyToNumber(price),
        supplierId: user?.userId,
        type: `${segment?.id}`,
      }
      console.log(newService);

      const status = await updateServiceSupplier(newService, user?.token, dispatch, navigate);
      fetchData();
      handleClose();
      if (status == "SUCCESS") {
        props.setMessageStatus("green");
        props.setMessage("Cập nhật thành công");
      } else {
        props.setMessageStatus("red");
        props.setMessage(status);
      }
    } catch (error) {

    }
  }

  const handleRemoveImage = (image: string) => {
    setImages(images.filter((img) => img != image));
  }

  const ImageSlider: React.FC = () => {
    return (
      <Carousel autoPlay indicators>
        {serviceDetail?.listImages?.map((item, i) =>
          <Paper key={i}>
            <img src={`${item}`} alt={`${item}`} style={{ width: '458px', height: '600px' }} key={i} />
          </Paper>
        )}
      </Carousel>
    );
  }

  return (
    <div id="ServiceDetail">
      {isLoading && (
        <div className="w-full flex items-center justify-center h-[70vh]">
          <CircularProgress />
        </div>
      )}
      {
        !isLoading && (
          <div className="container">
            <Container className='images-container'>
              <ImageSlider />
            </Container>
            <div className="service-information">
              <div className="edit">
                <Button className="btn-edit-service mb-24" onClick={() => { handleOpen() }}>SỬA</Button>
              </div>
              <div className="information-container">
                <h1 className="header">{serviceDetail?.name}</h1>
                <span className="service-price">{(serviceDetail?.price) && currencyMaskString(serviceDetail?.price)} VNĐ</span>
                <h2 className="promotion">{serviceDetail?.promotion?.name}</h2>
                <div className="underline"></div>
                <div className="description">
                  <p className="description-header">Chi tiết</p>
                  <div className="description-text">{serviceDetail?.description}</div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title-h2"
        aria-describedby="modal-modal-description"
        id="ModalCreateService"
      >
        <Box
          className="box"
        >
          <Typography id="modal-title-h2" variant="h2" component="h2">
            Sửa dịch vụ
          </Typography>
          {
            (isLoadingEdit) && (
              <div className="w-full flex items-center justify-center h-[70vh]">
                <CircularProgress />
              </div>
            )
          }
          {
            (!isLoadingEdit) && (
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <div className="create-container">
                  <div className="group-input mb-24">
                    <label>Tên dịch vụ:</label>
                    <div className="form-input">
                      <input type="Username" className="input regis-input" value={serviceName} required onChange={(e) => { setServiceName(e.target.value) }} />
                      <span className="text-err"></span>
                    </div>
                  </div>

                  <div className="group-input mb-24">
                    <label>Phân khúc:</label>
                    <FormControl className="select-box form-input price" style={{ width: '50%' }}>
                      <Select
                        className="input regis-input"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={segment?.id}
                        onChange={handleChangeSegment}
                        sx={{ padding: "12px 8px 17px" }}
                      >
                        {
                          segments.map((segment) => {
                            return (
                              <MenuItem className="menu-select-item" value={segment?.id} key={segment?.id}>{segment?.name}</MenuItem>
                            )
                          })
                        }
                      </Select>
                    </FormControl>
                  </div>

                  <div className="group-input mb-24">
                    <label>Mã giảm giá:</label>
                    <FormControl className="select-box form-input price" style={{ width: '50%' }}>
                      <Select
                        className="input regis-input"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={promotion?.id}
                        onChange={handleChangePromotion}
                        sx={{ padding: "12px 8px 17px" }}
                      >
                        {
                          promotions?.map((pro) => {
                            return (
                              <MenuItem className="menu-select-item" value={`${pro?.id}`} key={`${pro?.id}`}>{`${pro?.name}`}</MenuItem>
                            )
                          })
                        }
                      </Select>
                    </FormControl>
                  </div>

                  <div className="group-input mb-24">
                    <label>Giá:</label>
                    <div className="form-input price">
                      <div className="form-input price-input">
                        <input type="text" value={price} className="input regis-input" required onChange={(e) => {
                          handleChangePrice(currencyMask(e));
                        }} />
                        <span className="text-err"></span>
                      </div>
                    </div>
                  </div>

                  <div className="group-input mb-24"></div>
                  <div className="group-input individual-input mb-24">
                    <label>Mô tả:</label>
                    <div className="form-input">
                      <textarea className="textarea regis-input" value={description} required onChange={(e) => { setDescription(e.target.value) }} />
                      <span className="text-err"></span>
                    </div>
                  </div>
                  <div className="group-input individual-input mb-24">
                    <label>Ảnh:</label>
                    <div className="form-input">
                      <div className="img-input" style={{ cursor: "pointer" }} onClick={(e) => {
                        document.getElementById("img-file")?.click();
                      }}>
                        <input type="file" id="img-file" accept='.jpg, .png' style={{ display: "none" }} onChange={(e) => { uploadImage(e.target.files) }} />
                        <Button className="btn-create" variant="contained">Thêm ảnh</Button>
                      </div>
                      <div className="images">
                        {
                          images.map((item, index) => {
                            return (
                              <div className="img-item" key={index}>
                                <HighlightOffIcon className="hover btn-remove-image" style={{ color: "grey" }} onClick={() => { handleRemoveImage(item) }}></HighlightOffIcon>
                                <img src={item} alt="" />
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="btn-handle">
                  <Button className="btn-close mr-24" variant="contained" onClick={() => { handleClose() }}>Huỷ</Button>
                  <Button className="btn-create" variant="contained" onClick={() => { handleCreate() }}>Xác nhận</Button>
                </div>
              </Typography>
            )
          }
        </Box>
      </Modal >
    </div >
  )
}

export default ServiceDetail