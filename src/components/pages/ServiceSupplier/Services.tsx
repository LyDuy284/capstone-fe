import { SetStateAction, Dispatch, FC, useEffect, useState } from 'react'
import "./Services.css";
import { ServiceCreate, ServiceEntity } from '../../../types/entity/Entity';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ECONOMY_SEGMENT, LUXURY_SEGMENT } from '../../../constants/consts';
import { createServiceSupplier, getListCategories, getPromotionBySupplier, getServicesByCategoryId, getServicesSupplierFilter } from '../../../redux/apiRequest';
import { CategoryItem } from '../../../types/schema/category';
import { useDispatch, useSelector } from 'react-redux';
import { PromotionItem } from '../../../types/schema/promotion';
import { ServiceSupplierItem } from '../../../types/schema/serviceSupplier';
import { ServiceItem } from '../../../types/schema/service';
import { currencyMask, currencyMaskString, currencyToNumber } from '../../../constants/convert';

interface Props {
    setMessageStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

const storage = getStorage();

const segments = [
    ECONOMY_SEGMENT,
    LUXURY_SEGMENT
]

const defaultValueCategory: CategoryItem = {
    id: 'all',
    categoryName: 'TẤT CẢ',
    status: 'ACTIVATED'
}

const defaultValuePromotion: PromotionItem = {
    id: 'none',
    name: 'KHÔNG',
    value: 0,
    startDate: '',
    endDate: '',
    status: '',
    type: ''
}

const Services: FC<Props> = (props) => {
    const user = useSelector((state: any) => state.auth.login.currentUser);
    const [serviceSupplierList, setServiceSupplierList] = useState<ServiceSupplierItem[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [category, setCategory] = useState<CategoryItem>(defaultValueCategory);
    const [categoriesCreate, setCategoriesCreate] = useState<CategoryItem[]>([]);
    const [categoryCreate, setCategoryCreate] = useState<CategoryItem>(defaultValueCategory);

    const defaultValueService: ServiceItem = {
        id: 'all',
        name: 'TẤT CẢ',
        createAt: '',
        description: '',
        listImages: [],
        categoryResponse: defaultValueCategory
    }
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [service, setService] = useState<ServiceItem>(defaultValueService);

    const [servicesCreate, setServicesCreate] = useState<ServiceItem[]>([]);
    const [serviceCreate, setServiceCreate] = useState<ServiceItem>();

    const [promotions, setPromotions] = useState<PromotionItem[]>([]);
    const [promotion, setPromotion] = useState<any>();
    const [segment, setSegment] = useState<any>(ECONOMY_SEGMENT);
    const [segmentCreate, setSegmentCreate] = useState<any>(ECONOMY_SEGMENT);
    const [serviceName, setServiceName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('0');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCancel = () => {
        setCategoryCreate(defaultValueCategory);
        setServiceCreate(undefined);
        setPromotion(undefined);
        setServiceName("");
        setDescription("");
        setPrice("");
        setImages([]);
        setSegmentCreate(ECONOMY_SEGMENT);
        setOpen(false)
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchCategories();
        fetchPromotions();
        getServices();
    }, [category, service, segment])

    useEffect(() => {
        fetchData();
    }, [category, service, segment])

    useEffect(() => {
        fetchCategoriesCreate();
        getServicesCreate();
    }, [categoryCreate])

    useEffect(() => {
    }, [serviceCreate])

    async function fetchData() {
        setIsLoading(true);
        const categoryId = category?.id !== 'all' ? `${category?.id}` : undefined;
        const serviceId = service?.id !== 'all' ? `${service?.id}` : undefined;
        const segmentId = segment?.id;
        const response = await getServicesSupplierFilter(user?.userId, categoryId, serviceId, segmentId);
        if (response) {
            setServiceSupplierList(response);
        } else {
            setServiceSupplierList([]);
        }
        setIsLoading(false);
    }

    async function getServicesCreate() {
        if (categoryCreate?.id != 'all') {
            const response = await getServicesByCategoryId(categoryCreate?.id);
            if (Array.isArray(response)) {
                setServicesCreate([...response]);
                setServiceCreate(response[0]);
            } else {
                // Handle the case where response is not an array
                console.error('Response is not an array', response);
            }
        }
    }

    const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value);
    }

    const fetchCategoriesCreate = async () => {
        const response = await getListCategories(0, 10);
        if (response)
            if (response.status === "SUCCESS") {
                setCategoriesCreate([defaultValueCategory, ...response?.data]);
            }
            else setCategoriesCreate([]);
    }

    async function getServices() {
        if (category?.id != 'all') {
            const serviceList = [defaultValueService, ...await getServicesByCategoryId(category?.id)];
            setServices(serviceList);
        }
    }


    const fetchCategories = async () => {
        const response = await getListCategories(0, 10);
        if (response)
            if (response.status === "SUCCESS") {
                setCategories([defaultValueCategory, ...response?.data]);
            }
            else setCategories([]);
    }

    const fetchPromotions = async () => {
        const response = await getPromotionBySupplier(user?.userId);
        if (Array.isArray(response)) {
            setPromotions([defaultValuePromotion, ...response]);
            if (!promotion) {
                setPromotion(defaultValuePromotion);
            }
        } else {
            // Handle the case where response is not an array
            console.error('Response is not an array', response);
        }
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

    const handleChangeCategoryCreate = (event: any) => {
        const selectedCategory = categoriesCreate.find(cat => cat.id === event.target.value);
        if (selectedCategory) {
            setCategoryCreate(selectedCategory);
        }
        else {
            setServicesCreate([]);
        }
    };

    const handleChangeServiceCreate = (event: any) => {
        const selectedService = servicesCreate.find(ser => ser.id === event.target.value);
        if (selectedService) {
            setServiceCreate(selectedService);
        }
    };

    const handleChangeCategory = (event: any) => {
        const selectedCategory = categories.find(cat => cat.id === event.target.value);
        if (selectedCategory) {
            setCategory(selectedCategory);
            setService(defaultValueService);
        }
        else {
            setServices([]);
        }
    };

    const handleChangeService = (event: any) => {
        const selectedService = services.find(ser => ser.id === event.target.value);
        if (selectedService) {
            setService(selectedService);
        }
    };

    const handleCreate = async () => {
        try {
            let getImagesPayload = "";
            images.map((image) => {
                getImagesPayload += image + "\n, "
            })

            const newService: ServiceCreate = {
                serviceId: `${serviceCreate?.id}`,
                description: description,
                images: getImagesPayload,
                promotionId: (promotion?.id == 'none') ? '' : promotion?.id,
                name: serviceName,
                price: currencyToNumber(price),
                supplierId: user?.userId,
                type: segment.id,
            }
            console.log(newService);

            const status = await createServiceSupplier(newService, user?.token, dispatch, navigate);
            fetchData();
            handleClose();
            if (status == "SUCCESS") {
                props.setMessageStatus("green");
                props.setMessage("Tạo thành công");
            } else {
                props.setMessageStatus("red");
                props.setMessage(status);
            }
        } catch (error) {

        }
    }

    const rows = serviceSupplierList?.length > 0 ? serviceSupplierList.map((service) => ({
        id: parseInt(`${service.id.split('SERVICE-SUPPLIER-')[1]}`),
        // category: service?.categoryResponse?.categoryName,
        name: service?.name,
        rating: service?.rating,
        // promotion: (service?.promotionService) ? service?.promotionService.percent + "%" : "",
        createAt: service?.createAt,
        price: currencyMaskString(parseInt(`${service?.price}`)),
        type: service?.type,
        status: service?.status,
        promotionName: service?.promotion?.name
    })) : [];

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", flex: 0.2 },
        { field: "name", headerName: "Tên", flex: 1.8 },
        { field: "price", headerName: "Giá", flex: 0.5 },
        { field: "promotionName", headerName: "Giảm giá", flex: 0.5 },
        { field: "rating", headerName: "Đánh giá", flex: 0.3 },
        { field: "type", headerName: "Phân khúc", flex: 0.4 },
        { field: "createAt", headerName: "Ngày tạo", flex: 0.7 },
        {
            field: '',
            headerName: 'Tác vụ',
            flex: 0.35,
            width: 170,
            renderCell: (params) => (
                <div className="action">
                    <VisibilityIcon className="hover" style={{ color: "green" }} onClick={() => navigate(`/service-detail/SERVICE-SUPPLIER-${params.id}`)}></VisibilityIcon>
                    <DeleteIcon className="hover" style={{ color: "red" }}></DeleteIcon>
                </div>
            ),
        }
    ];

    return (
        <div id="Services">
            <>
                <div className="create-service">
                    <h2 className="h2-title-page" >Dịch vụ</h2>
                    <div className="select-box-container">
                        <span className='label-select'>Loại:</span>
                        {
                            (category) ? (
                                <FormControl className="select-box form-input mr-24">
                                    <Select
                                        className="input regis-input"
                                        id="demo-simple-select"
                                        value={category?.id}
                                        onChange={handleChangeCategory}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem className="menu-select-item" value={`${category?.id}`} key={`${category.id}`}>
                                                {category.categoryName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : null
                        }
                        <div className="divide-right"></div>
                        {
                            (category.id != 'all') ?
                                (<>
                                    <span className='label-select'>Dịch vụ:</span>
                                    <FormControl className="select-box form-input mr-24">
                                        <Select
                                            className="input regis-input"
                                            id="demo-simple-select"
                                            value={service?.id}
                                            onChange={handleChangeService}
                                        >
                                            {services.map((ser) => (
                                                <MenuItem className="menu-select-item" value={`${ser?.id}`} key={`${ser.id}`}>
                                                    {ser.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <div className="divide-right"></div>
                                </>
                                ) : null
                        }
                        <span className='label-select'>Phân khúc:</span>
                        <FormControl className="select-box form-input mr-24">
                            <Select
                                className="input regis-input"
                                id="demo-simple-select"
                                value={segment?.id}
                                onChange={(event) => { setSegment(segments.find(seg => seg.id === event.target.value)) }}
                            >
                                {segments.map((seg, index) => (
                                    <MenuItem className="menu-select-item" value={seg?.id} key={index}>
                                        {seg.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className="divide-right"></div>
                        <Button className="btn-create-service" onClick={() => { handleOpen() }}>TẠO MỚI</Button>
                    </div>
                </div>
                {isLoading && (
                    <div className="w-full flex items-center justify-center h-[70vh]">
                        <CircularProgress />
                    </div>
                )}

                {
                    !isLoading && (
                        <div className="table" style={{ height: 400, width: "100%" }}>
                            <DataGrid rows={rows}
                                columns={columns}
                                autoPageSize
                                pagination
                                sx={{
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        color: 'var(--primary-color)',
                                    },
                                }} />
                        </div>
                    )
                }
            </>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                id="ModalCreateService"
            >
                <Box
                    className="box"
                >
                    <Typography id="modal-modal-title" variant="h2" component="h2">
                        <span style={{ fontSize: "3rem !important" }}>
                            Tạo dịch vụ
                        </span>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className="create-container">
                            <div className="group-input mb-24">
                                <label>Tên dịch vụ:</label>
                                <div className="form-input">
                                    <input type="Username" className="input regis-input" required onChange={(e) => { setServiceName(e.target.value) }} />
                                    <span className="text-err"></span>
                                </div>
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
                            <div className="group-input mb-24">
                                <label className="label-select">Loại:</label>
                                {
                                    (categoryCreate) ? (
                                        <FormControl className="select-box form-input mr-24" style={{ width: '100%' }}>
                                            <Select
                                                className="input regis-input"
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={categoryCreate?.id}
                                                onChange={handleChangeCategoryCreate}
                                                sx={{ padding: "12px 8px 17px" }}
                                            >
                                                {categoriesCreate.map((category) => (
                                                    <MenuItem className="menu-select-item" value={`${category?.id}`} key={`${category.id}`}>
                                                        {category.categoryName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : null
                                }
                            </div>

                            <div className="group-input mb-24">
                                <label className="label-select">Phân khúc:</label>
                                <FormControl className="select-box form-input price">
                                    <Select
                                        className="input regis-input"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={segmentCreate}
                                        onChange={(e) => { setSegmentCreate(e.target.value) }}
                                        sx={{ padding: "12px 8px 17px" }}
                                    >
                                        {
                                            segments.map((segment: any, index) => {
                                                return (
                                                    <MenuItem className="menu-select-item" value={segment} key={index}>{segment.name}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </div>

                            {
                                (promotion?.id != undefined && promotion) ? (
                                    <div className="group-input mb-24">
                                        <label className="label-select">Mã giảm giá:</label>
                                        <FormControl className="select-box form-input price" style={{ width: '50%' }}>
                                            <Select
                                                className="input regis-input"
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={promotion}
                                                onChange={(e) => { setPromotion(e.target.value) }}
                                                sx={{ padding: "12px 8px 17px" }}
                                            >
                                                {
                                                    promotions?.map((promotion: any, index) => {
                                                        return (
                                                            <MenuItem className="menu-select-item" value={promotion} key={index}>{promotion.name}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                ) : null
                            }

                            {
                                (categoryCreate.id != 'all' && serviceCreate?.id != undefined && servicesCreate) ?
                                    (
                                        <div className="group-input mb-24">
                                            <label className="label-select">Dịch vụ:</label>
                                            <FormControl className="select-box form-input mr-24" style={{ width: '100%' }}>
                                                <Select
                                                    className="input regis-input"
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={serviceCreate?.id}
                                                    onChange={handleChangeServiceCreate}
                                                    sx={{ padding: "12px 8px 17px" }}
                                                >
                                                    {servicesCreate.map((ser) => (
                                                        <MenuItem className="menu-select-item" value={`${ser?.id}`} key={`${ser.id}`}>
                                                            {ser.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    ) : null
                            }
                            <div className="group-input mb-24"></div>
                            <div className="group-input individual-input mb-24">
                                <label>Mô tả:</label>
                                <div className="form-input">
                                    <textarea className="textarea regis-input" required onChange={(e) => { setDescription(e.target.value) }} />
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
                            <Button className="btn-close mr-24" variant="contained" onClick={() => { handleCancel() }}>Huỷ</Button>
                            <Button className="btn-create" variant="contained" onClick={() => { handleCreate() }}>Tạo mới</Button>
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}

export default Services