import React, { useEffect, useState, Dispatch, SetStateAction, FC } from 'react'
import { getAllCoupleByAdmin, topupWallet } from '../../../redux/apiRequest';
import { useSelector } from 'react-redux';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import "./Deposit.css";
import { currencyMask, currencyToNumber } from '../../../constants/convert';
import { WalletTopupPayload } from '../../../types/schema/wallet';
import { CoupleItem } from '../../../types/schema/couple';

interface Props {
    setMessage: Dispatch<SetStateAction<string>>;
    setMessageStatus: Dispatch<SetStateAction<string>>;
}

const Deposit: FC<Props> = (props) => {
    const user = useSelector((state: any) => state.auth.login.currentUser);

    const [couples, setCouples] = useState<CoupleItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedCouple, setSelectedCouple] = useState<CoupleItem>();
    const [value, setValue] = useState<string>('0');

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        setIsLoading(true);
        const response = await getAllCoupleByAdmin(user?.token);
        setCouples(response);
        setIsLoading(false);
    }

    async function handleDeposit() {
        setIsLoading(true);
        try {
            if (selectedCouple) {
                const payload: WalletTopupPayload = {
                    amount: currencyToNumber(value),
                    coupleId: selectedCouple?.id
                }
                await topupWallet(payload, user?.token);
            }
        } catch (error) {

        } finally {
            props.setMessage("Nạp tiền thành công");
            props.setMessageStatus("green");
            handleClose();
            setIsLoading(false);
        }

    }

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const rows = couples?.length > 0 ? couples.map((couple) => ({
        id: couple.id,
        idDisplay: couple.id.split("COUPLE-")[1],
        name: couple?.account.name,
        phone: couple?.account.phoneNumber,
        couple: couple
    })) : [];

    const columns: GridColDef[] = [
        { field: "idDisplay", headerName: "ID", flex: 0.2 },
        { field: "name", headerName: "Tên", flex: 1.8 },
        { field: "phone", headerName: "Điện thoại", flex: 0.5 },
        {
            field: '',
            headerName: 'Tác vụ',
            flex: 0.5,
            width: 170,
            renderCell: (params) => (
                <div className="btn-deposit">
                    <Button className="btn-create" variant="contained" onClick={() => {
                        setSelectedCouple(params.row.couple);
                        handleOpen()
                    }}>Nạp tiền</Button>
                </div>
            ),
        }
    ];

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div id="Deposit">
            <h2 className="h2-title-page" >nạp tiền</h2>
            {
                (isLoading) && (
                    <div className="w-full flex items-center justify-center h-[70vh]">
                        <CircularProgress />
                    </div>
                )
            }
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
                            id="DepositModal"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    <span style={{ fontSize: "3rem !important" }}>
                                        Nạp tiền
                                    </span>
                                    <div className="group">
                                        <div className="group-item">
                                            <label className=''>Tên khách hàng:</label>
                                            <div>
                                                <span className='booking-detail-info' >{selectedCouple?.account.name}</span>
                                            </div>
                                        </div>
                                        <div className="group-item">
                                            <label>Số tiền nạp:</label>
                                            <div className="group-item-value">
                                                <input type="text" value={value} className="deposit-input" required onChange={(e) => {
                                                    handleChangeValue(currencyMask(e));
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    <div className="btn-handle">
                                        <Button className="btn-close mr-24" variant="contained" onClick={() => { handleClose() }}>Huỷ</Button>
                                        <Button className="btn-create mr-24" variant="contained" onClick={() => { handleDeposit() }}>Nạp tiền</Button>
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

export default Deposit