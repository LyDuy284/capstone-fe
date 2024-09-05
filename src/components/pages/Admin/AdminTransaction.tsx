import React, { useEffect, useState, Dispatch, SetStateAction, FC } from 'react'
import "../ServiceSupplier/Services.css";
import { AdminBookingItem } from '../../../types/schema/booking';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import { getBookingByAdmin, getTransactionSummaryDetail } from '../../../redux/apiRequest';
import { useSelector } from 'react-redux';
import { SupplierAmountDetail, TransactionSummaryItem } from '../../../types/schema/transactionSummary';
import "./AdminTransaction.css";
import { currencyMask, currencyMaskString } from '../../../constants/convert';

interface Props {
    setMessage: Dispatch<SetStateAction<string>>;
    setMessageStatus: Dispatch<SetStateAction<string>>;
}

const AdminTransaction: FC<Props> = (props) => {
    const user = useSelector((state: any) => state.auth.login.currentUser);
    const [bookingList, setBookingList] = useState<AdminBookingItem[]>([]);
    const [transactionSummary, setTransactionSummary] = useState<TransactionSummaryItem>();
    const [rowsDetail, setRowsDetail] = useState<any>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const handleClose = () => { setRowsDetail([]); setOpen(false) };

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {

    }, [rowsDetail])

    async function fetchData() {
        setIsLoading(true);
        const response = await getBookingByAdmin(user?.token);
        setBookingList(response);
        setIsLoading(false);
    }

    async function handleOpen(id: string) {
        const response = await getTransactionSummaryDetail(id, user?.token);

        if (response instanceof Error) {
            props.setMessage("Booking chưa hoàn thành");
            props.setMessageStatus("red");
        } else {
            // Handle the successful data
            setTransactionSummary(response)
            if (transactionSummary) {
                let rows = response?.supplierAmountDetails.length > 0 ? response?.supplierAmountDetails.map((item: SupplierAmountDetail) => ({
                    id: item.supplierId,
                    name: item.supplierName,
                    phone: item.contactPhone,
                    price: currencyMaskString(parseInt(`${item.price}`)),
                })) : [];
                setRowsDetail(rows);
            }
        }
        setOpen(true)

    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const rows = bookingList?.length > 0 ? bookingList.map((booking) => ({
        id: booking.id,
        idDisplay: parseInt(`${booking.id.split('BOOKING-')[1]}`),
        status: booking?.status,
        totalPrice: booking.totalPrice,
        booking: booking
    })) : [];

    const columns: GridColDef[] = [
        { field: "idDisplay", headerName: "ID", flex: 0.2 },
        { field: "status", headerName: "Trạng thái", flex: 0.5 },
        { field: "totalPrice", headerName: "Tổng giá", flex: 0.5 },
        {
            field: 'booking',
            headerName: 'Chi tiết',
            flex: 0.5,
            width: 170,
            renderCell: (params) => (
                <>
                    <Button style={{ fontSize: '1.2rem' }} className="btn-admin-disable" onClick={() => {
                        handleOpen(params.row.id)
                    }}>
                        Xem chi tiết
                    </Button>
                </>
            ),
        },
    ];

    const columnsDetail: GridColDef[] = [
        { field: "name", headerName: "Nhà cung cấp", flex: 0.8 },
        { field: "phone", headerName: "Số điện thoại", flex: 0.5 },
        { field: "price", headerName: "Tiền nhận", flex: 0.5 },
    ];

    return (
        <div id='Services'>
            <h2 className="h2-title-page" >Thanh toán</h2>
            {isLoading && (
                <div className="w-full flex items-center justify-center h-[70vh]">
                    <CircularProgress />
                </div>
            )}

            {
                !isLoading && (
                    <>
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
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            id="TransactionSummaryModal"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    <div className="group-header">
                                        <div className="group-item">
                                            <label className='group-label'>Phí nền tảng:</label>
                                            <div>
                                                <span className='group-detail' >{currencyMaskString(parseInt(`${transactionSummary?.platformFee}`))}</span>
                                            </div>
                                        </div>
                                        <div className="group-item">
                                            <label className='group-label'>Nhà cung cấp:</label>
                                            <div>
                                                <span className='group-detail' >{currencyMaskString(parseInt(`${transactionSummary?.supplierTotalEarn}`))}</span>
                                            </div>
                                        </div>
                                        <div className="group-item">
                                            <label className='group-label'>Cặp đôi:</label>
                                            <div>
                                                <span className='group-detail' >{currencyMaskString(parseInt(`${transactionSummary?.totalAmount}`))}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        rowsDetail.length < 0 && (
                                            <CircularProgress />
                                        )
                                    }
                                    {
                                        rowsDetail.length > 0 && (
                                            <div className="table" style={{ height: 400, width: "100%", marginTop: "30px" }}>
                                                <DataGrid rows={rowsDetail}
                                                    columns={columnsDetail}
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
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    <div className="btn-handle">
                                        <Button className="btn-close mr-24" variant="contained" onClick={() => { handleClose() }}>Đóng</Button>
                                    </div>
                                </Typography>
                            </Box>
                        </Modal>
                    </>
                )
            }
        </div>
    )
}

export default AdminTransaction