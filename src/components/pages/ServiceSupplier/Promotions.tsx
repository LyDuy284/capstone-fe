import * as React from 'react';
import { SetStateAction, Dispatch, FC, useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, FormControl, MenuItem, Modal, Select, Typography } from '@mui/material';
import "../../../constants/styles/TableService.css";
import { PromotionItem, PromotionItemCreate } from '../../../types/schema/promotion';
import { createPromotion, getPromotionBySupplier } from '../../../redux/apiRequest';
import { useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import { PROMOTION_TYPE_MONEY, PROMOTION_TYPE_PERCENT } from '../../../constants/consts';
import { currencyMask, currencyMaskString, currencyToNumber } from '../../../constants/convert';


interface Props {
    setMessageStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const promotionTypes = [
    PROMOTION_TYPE_MONEY,
    PROMOTION_TYPE_PERCENT
]

const Promotions: FC<Props> = (props) => {
    const user = useSelector((state: any) => state.auth.login.currentUser);
    const now = new Date();
    const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs(now));
    const [endDate, setEndDate] = React.useState<Dayjs | null>();
    const [usedDates, setUsedDates] = useState<Set<string>>(new Set());
    const date = dayjs();
    const [promotionType, setPromotionType] = useState<any>(PROMOTION_TYPE_MONEY);
    const [name, setName] = useState<string>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [promotions, setPromotions] = useState<PromotionItem[]>([]);
    const [percent, setPercent] = useState('1');


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    useEffect(() => {
        fetchData();
    }, [])

    const formatDate = (date: Dayjs | null): string => {
        return date ? date.format('YYYY-MM-DDTHH:mm:ss') : '';
    };

    const handleDateChange = (date: Dayjs | null) => {
        if (!date || !startDate) return;
        setStartDate(date)

        const selectedDate = formatDate(date);

        // Update used dates
        setUsedDates((prevDates) => new Set(prevDates).add(selectedDate));
    };

    async function fetchData() {
        setIsLoading(true);
        const response = await getPromotionBySupplier(user?.userId);
        setPromotions(response);
        setIsLoading(false);
    }

    const handleChangeMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPercent(e.target.value);
    }

    const handleChangePercent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Regular expression to match numbers from 0 to 100 (including 0 and 100)
        const validPattern = /^(\d{1,2}|100)?$/;
        const numericValue = value === '' ? '' : parseFloat(value);
        const isValidNumber = validPattern.test(value) && (numericValue === '' || (numericValue >= 1 && numericValue <= 100));

        if (isValidNumber) {
            setPercent(value);
        } else {
            alert("Chỉ giảm từ 1% đến 50%.");
            e.target.value = percent; // Reset to the last valid state
        }
    };
    const handleCreate = async () => {
        try {
            const newPromotion: PromotionItemCreate = {
                supplierId: user?.userId,
                value: currencyToNumber(percent),
                name: `${name}`,
                startDate: startDate ? moment(startDate.toString()).format('YYYY-MM-DD') : '',
                endDate: endDate ? moment(endDate.toString()).format('YYYY-MM-DD') : '',
                type: promotionType?.id
            }

            const status = await createPromotion(newPromotion, user?.token);
            if (status == "SUCCESS") {
                handleClose();
                fetchData();
            }
        } catch (error) {

        }
    }

    const rows = promotions?.length > 0 ? promotions?.map((promotion) => ({
        id: promotion.id,
        idDisplay: promotion.id.split("PROMOTION-")[1],
        name: promotion.name,
        value: (promotion.type == PROMOTION_TYPE_MONEY?.id) ? currencyMaskString(promotion.value) : promotion.value,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        status: promotion.status,
        type: promotion.type
    })) : [];

    const columns: GridColDef[] = [
        { field: "idDisplay", headerName: "ID", flex: 0.3 },
        { field: "name", headerName: "Giảm", flex: 0.5 },
        { field: "startDate", headerName: "Ngày bắt đầu", flex: 0.5 },
        { field: "endDate", headerName: "Ngày hết hạn", flex: 0.5 },
        { field: "value", headerName: "Giá trị", flex: 0.5 },
        { field: "type", headerName: "Đơn vị", flex: 0.5 },
        { field: "status", headerName: "Trạng thái", flex: 0.5 },
    ];

    return (
        <div id="Services">
            <div className="create-service">
                <h2 className="h2-title-page" >Khuyến mãi</h2>
                <Button className="btn-create-service" onClick={() => { handleOpen() }}>Tạo mới</Button>
            </div>
            {
                (isLoading) && (
                    <div className="w-full flex items-center justify-center h-[70vh]">
                        <CircularProgress />
                    </div>
                )
            }
            {
                (!isLoading) && (
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
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                id="ModalCreateService"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h2" component="h2">
                        <span>
                            Tạo giảm giá
                        </span>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className="create-container group-create-promotion">
                            <div className="group-input-100 mb-24">
                                <label>Tên mã giảm giá:</label>
                                <div className="form-input">
                                    <input type="Username" className="input regis-input" required onChange={(e) => { setName(e.target.value) }} />
                                    <span className="text-err"></span>
                                </div>
                            </div>
                        </div>
                        <div className="create-container group-create-promotion">

                            <div className="group-input mb-24">
                                <label>Loại giảm giá:</label>
                                <div className="form-input">
                                    <FormControl className="form-input mr-24">
                                        <Select
                                            className="input regis-input"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={promotionType}
                                            onChange={(event) => { setPromotionType(event.target.value) }}
                                            sx={{ padding: "8px 8px 17px" }}
                                        >
                                            {promotionTypes.map((type: any, index) => (
                                                <MenuItem className="menu-select-item" value={type} key={index}>
                                                    {type?.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="group-input-40 mb-24 ml-8">
                                <label>Giảm:</label>
                                <div className="form-input">
                                    {
                                        (promotionType?.id == PROMOTION_TYPE_MONEY.id) ? (
                                            <input type="text" value={percent} className="input regis-input" required onChange={(e) => {
                                                handleChangeMoney(currencyMask(e));
                                            }} />
                                        )
                                            :
                                            (
                                                <input
                                                    type="text"
                                                    className="input regis-input"
                                                    onChange={handleChangePercent}
                                                    value={percent} // Controlled input
                                                />
                                            )
                                    }
                                    <span className="text-err"></span>
                                </div>
                            </div>

                        </div>

                        <div className="create-container group-create-promotion">
                            <div className="group-input-40 mb-24">
                                <label>Ngày bắt đầu:</label>
                                <div className="form-input">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <DateTimePicker
                                                sx={{
                                                    minWidth: '100px !important',
                                                    width: '140px !important',
                                                    '& .Mui-error': {
                                                        color: 'black !important',
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'gray !important',
                                                    },
                                                }}
                                                onChange={(value: Dayjs | null) => {
                                                    handleDateChange(value);
                                                }}
                                                disablePast

                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className="group-input-40 mb-24">
                                <div className="form-input">
                                    <label>Ngày hết hạn:</label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <DateTimePicker
                                                sx={{
                                                    minWidth: '100px !important',
                                                    width: '140px !important',
                                                    '& .Mui-error': {
                                                        color: 'black !important',
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'gray !important',
                                                    },
                                                }}
                                                onChange={(value: Dayjs | null) => {
                                                    if (value) {
                                                        setEndDate(value);
                                                        setUsedDates(new Set());
                                                    }
                                                }}
                                                disablePast
                                                disabled={startDate === null}
                                                shouldDisableDate={(date) =>
                                                    usedDates.has(formatDate(date))
                                                }
                                                minDate={
                                                    startDate ?
                                                        date?.add(startDate?.date() - date.date(), 'day')
                                                        : undefined
                                                }
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </div>
                        <div className="btn-handle">
                            <Button className="btn-close mr-24" variant="contained" onClick={() => { handleClose() }}>Huỷ</Button>
                            <Button className="btn-create" variant="contained" onClick={() => { handleCreate() }}>Tạo mới</Button>
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}

export default Promotions