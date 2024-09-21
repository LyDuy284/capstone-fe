import { SetStateAction, Dispatch, FC, useEffect, useState } from 'react'
import "./Services.css";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import { Box, Button, CircularProgress, FormControl, MenuItem, Modal, Select, Typography } from '@mui/material';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { CategoryItem } from '../../../types/schema/category';
import { useDispatch, useSelector } from 'react-redux';
import { PromotionItem } from '../../../types/schema/promotion';
import { confirmBookingDetail, doneBookingDetail, getBookingBySupplierId, getBookingDetailBySupplierId, processingBookingDetail, rejectBookingDetail } from '../../../redux/apiRequest';
import { BOOKING_STATUS, STATUS } from '../../../constants/consts';
import "./BookingList.css";
import { BookingDetailItem, BookingItem } from '../../../types/schema/booking';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { currencyMaskString } from '../../../constants/convert';
var bookingDetailIdItem = "";
var bookingDetailWeddingDateItem = "";
interface Props {
    setMessageStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

const storage = getStorage();

const convertStatusName = (status: string) => {
    switch (status) {
        case BOOKING_STATUS.cancel:
            return "Đã huỷ"
        case BOOKING_STATUS.deposited:
            return "Đã cọc"
        case BOOKING_STATUS.done:
            return "Đã xong"
        case BOOKING_STATUS.completed:
            return "Đã hoàn thành"
        case BOOKING_STATUS.approved:
            return "Đã xác nhận"
        case BOOKING_STATUS.reject:
            return "Đã từ chối"
        case BOOKING_STATUS.processing:
            return "Đang thực hiện"
        default: return "Đang đợi"
    }
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

const BookingList: FC<Props> = (props) => {
    const user = useSelector((state: any) => state.auth.login.currentUser);
    const [bookingList, setBookingList] = useState<BookingItem[]>([]);
    const [note, setNote] = useState<string>('');
    const [bookingDetails, setBookingDetails] = useState<BookingDetailItem[]>([]);
    const [rejectReason, setRejectReason] = useState<string>('');
    const [rejectId, setRejectId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingPopup, setIsLoadingPopup] = useState<boolean>(false);
    const [rowsBookingDetail, setRowsBookingDetail] = useState<any>([]);
    const [columnsBookingDetail, setColumnsBookingDetail] = useState<GridColDef[]>([]);

    const [open, setOpen] = useState(false);
    const [openRejectBooking, setOpenRejectBooking] = useState(false);
    const [openNote, setOpenNote] = useState(false);
    const handleClose = () => { setNote(''); setOpen(false) };
    const handleCloseNote = () => { setNote(''); setOpenNote(false) };
    const handleCloseRejectBooking = () => {
        setRejectId('');
        setRejectReason('');
        setOpenRejectBooking(false);
    }
    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        setIsLoading(true);
        const response = await getBookingBySupplierId(user?.userId, user?.token);
        setBookingList(response);
        setIsLoading(false);
    }

    async function rejectBooking() {
        try {
            const rejectObject = {
                "bookingDetailId": rejectId,
                "reason": rejectReason
            }
            await rejectBookingDetail(rejectObject, user?.token);
            setIsLoadingPopup(true);
        } catch (error) {

        } finally {
            handleCloseRejectBooking();
            await fetchBookingDetails();
        }
    }

    async function approveBooking(id: string) {
        try {
            await confirmBookingDetail(id, user?.token)
            setIsLoadingPopup(true);
        } catch (error) {

        } finally {
            await fetchBookingDetails();
        }
    }

    async function processingBooking(id: string) {
        try {
            await processingBookingDetail(id, user?.token)
            setIsLoadingPopup(true);
        } catch (error) {

        } finally {
            await fetchBookingDetails();
        }
    }

    async function doneBooking(id: string) {
        try {
            await doneBookingDetail(id, user?.token)
            setIsLoadingPopup(true);
        } catch (error) {

        } finally {
            await fetchBookingDetails();
        }
    }

    const rows = bookingList?.length > 0 ? bookingList.map((booking) => ({
        id: booking.id,
        idDisplay: booking.id.split("BOOKING-")[1],
        coupleName: booking.coupleResponse.account.name,
        phoneNumber: booking.coupleResponse.account.phoneNumber,
        weddingDate: booking.weddingDate,
        createAt: booking.createAt,
        status: convertStatusName(`${booking.status}`),
        booking: booking
    })) : [];

    const columns: GridColDef[] = [
        { field: "idDisplay", headerName: "ID", flex: 0.5 },
        { field: "coupleName", headerName: "Tên couple", flex: 0.5 },
        { field: "weddingDate", headerName: "Ngày cưới", flex: 0.5 },
        { field: "phoneNumber", headerName: "Số điện thoại", flex: 0.5 },
        {
            field: 'booking',
            headerName: 'Chi tiết',
            flex: 0.5,
            width: 170,
            renderCell: (params) => (
                <>
                    <Button style={{ fontSize: '1.2rem' }} className="btn-admin-disable" onClick={() => {
                        handleOpen()
                        bookingDetailIdItem = params.row.id;
                        bookingDetailWeddingDateItem = params.row.weddingDate;
                        try {
                            fetchBookingDetails();
                        } catch (error) {
                        } finally {
                            setIsLoadingPopup(true);
                        }
                    }}>
                        Xem chi tiết
                    </Button>
                </>
            ),
        },
    ];

    async function fetchBookingDetails() {

        try {
            const response = await getBookingDetailBySupplierId(user?.userId, bookingDetailIdItem, user?.token);
            setBookingDetails(response);

            const rows = response?.length > 0 ? response?.map((item: BookingDetailItem) => ({
                id: item.bookingDetailId,
                name: item.serviceSupplierResponse.name,
                completedDate: item.completedDate,
                price: currencyMaskString(parseInt(`${item.price}`)),
                note: item.note,
                status: convertStatusName(`${item.status}`),
            })) : [];

            const columns: GridColDef[] = [
                { field: "name", headerName: "Tên dịch vụ", flex: 1.2 },
                { field: "price", headerName: "Giá tiền", flex: 0.5 },
                { field: "completedDate", headerName: "Hoàn thành", flex: 0.5 },
                { field: "status", headerName: "Trạng thái", flex: 0.5 },
                {
                    field: 'note',
                    headerName: 'Ghi chú',
                    flex: 0.5,
                    width: 170,
                    renderCell: (params) => (
                        handleDisplayNote(params.row?.note)
                    ),
                },
                {
                    field: '',
                    headerName: 'Tác vụ',
                    flex: 0.255,
                    width: 170,
                    renderCell: (params) => (
                        handleAction(params.row.status, params.row.id)
                    ),
                },
            ];
            setRowsBookingDetail(rows);
            setColumnsBookingDetail(columns);
        } catch (error) {

        } finally {
            setIsLoadingPopup(false);
        }
    }

    const handleAction = (status: string, id: string) => {
        switch (status) {
            case convertStatusName(BOOKING_STATUS.pending):
                return (
                    <div className="group-btn">
                        <HighlightOffIcon className="hover" style={{ color: "red" }} sx={{ fontSize: 30 }} onClick={() => { handleOpenRejectBooking(id) }}></HighlightOffIcon>
                        <TaskAltIcon className="hover" style={{ color: "green" }} sx={{ fontSize: 30 }} onClick={() => { approveBooking(id) }}></TaskAltIcon>
                    </div>
                )
            case convertStatusName(BOOKING_STATUS.deposited):
                return (
                    <TaskAltIcon className="hover" style={{ color: "green" }} sx={{ fontSize: 30 }} onClick={() => { processingBooking(id) }}></TaskAltIcon>
                )
            case convertStatusName(BOOKING_STATUS.processing):
                return (
                    <TaskAltIcon className="hover" style={{ color: "green" }} sx={{ fontSize: 30 }} onClick={() => { doneBooking(id) }}></TaskAltIcon>
                )
            default:
                return null
        }
    }

    const handleDisplayNote = (isNote: string) => {
        if (!(isNote == "")) {
            return (
                <Button id="btn-show-detail" onClick={() => {
                    setNote(isNote);
                    handleOpenNote();
                }}>
                    Xem chi tiết
                </Button>
            )
        } else {
            return null;
        }
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleOpenNote = () => {
        setOpenNote(true);
    }

    const handleOpenRejectBooking = (id: string) => {
        setRejectId(id)
        setOpenRejectBooking(true);
    }

    return (
        <div id="Services">
            {isLoading && (
                <div className="w-full flex items-center justify-center h-[70vh]">
                    <CircularProgress />
                </div>
            )}
            {
                !isLoading && (
                    <>
                        <div className="create-booking">
                            <h2 className="h2-title-page" >Booking</h2>
                        </div>
                        <div className="table" style={{ height: 400, width: "100%" }}>
                            <DataGrid rows={rows}
                                columns={columns}
                                autoPageSize
                                pagination />
                        </div>
                    </>
                )
            }

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                id="BookingDetailModal"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <span style={{ fontSize: "3rem !important" }}>
                            Chi tiết dịch vụ
                        </span>
                        <div className="create-container">
                            <div className="group-input mb-24">
                                <label className='booking-detail-label'>Tên khách hàng:</label>
                                <div className="form-input">
                                    <span className='booking-detail-info' >{bookingDetails[0]?.couple.account.name}</span>
                                </div>
                            </div>
                            <div className="group-input mb-24">
                                <label className='booking-detail-label'>Ngày cưới:</label>
                                <div className="form-input">
                                    <span className='booking-detail-info' >{bookingDetailWeddingDateItem}</span>
                                </div>
                            </div>
                            <div className="group-input mb-24">
                                <label className='booking-detail-label'>Tổng tiền:</label>
                                <div className="form-input">
                                    <span className='booking-detail-info' >{currencyMaskString(bookingDetails.reduce((sum, item) => sum + parseInt(item.price.toString()), 0))}</span>
                                </div>
                            </div>
                        </div>
                        {
                            isLoadingPopup && (
                                <div className="w-full flex items-center justify-center h-[70vh]">
                                    <CircularProgress />
                                </div>
                            )
                        }
                        {
                            !isLoadingPopup && rowsBookingDetail?.length > 0 && (
                                <div className="table" style={{ height: 400, width: "100%" }}>
                                    <DataGrid rows={rowsBookingDetail}
                                        columns={columnsBookingDetail}
                                        autoPageSize
                                        pagination />
                                </div>
                            )
                        }
                        {
                            (note != '') ? (
                                <Modal
                                    open={openNote}
                                    onClose={handleCloseNote}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    id="BookingDetailModal"
                                >
                                    <Box sx={style}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            <span style={{ fontSize: "3rem !important" }}>
                                                {note}
                                            </span>
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            <div className="btn-handle">
                                                <Button className="btn-close mr-24" variant="contained" onClick={() => { handleCloseNote() }}>Đóng</Button>
                                            </div>
                                        </Typography>
                                    </Box>
                                </Modal>
                            ) : null
                        }
                        <Modal
                            open={openRejectBooking}
                            onClose={handleCloseRejectBooking}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            id="BookingDetailModal"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    <div className="group-input individual-input mb-24">
                                        <label>Lý do từ chối:</label>
                                        <div className="form-input">
                                            <textarea className="textarea regis-input" required onChange={(e) => { setRejectReason(e.target.value) }} />
                                            <span className="text-err"></span>
                                        </div>
                                    </div>
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    <div className="btn-handle">
                                        <Button className="btn-close mr-24" variant="contained" onClick={() => { handleCloseRejectBooking() }}>Đóng</Button>
                                        <Button className="btn-reject mr-24" variant="contained" onClick={() => { rejectBooking() }}>Từ chối</Button>

                                    </div>
                                </Typography>
                            </Box>
                        </Modal>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className="btn-handle">
                            <Button className="btn-close mr-24" variant="contained" onClick={() => { handleClose() }}>Đóng</Button>
                        </div>
                    </Typography>
                </Box>
            </Modal>

        </div>
    )
}

export default BookingList