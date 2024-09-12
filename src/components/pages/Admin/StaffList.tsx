import React, { useState, useEffect, FC, Dispatch, SetStateAction } from 'react'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import "./AdminPage.css";
import { Box, Button, CircularProgress, FormControl, MenuItem, Modal, Select, SelectChangeEvent, Switch, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { activatedByAdmin, disabledByAdmin, getAllAccountByAdmin, registerStaff } from '../../../redux/apiRequest';
import { AccountResponse } from '../../../types/schema/account';
import { ACTIVATED, ALL_SELECT, DISABLED, SELECT_COUPLE, SELECT_STAFF, SELECT_SUPPLIER } from '../../../constants/consts';
import { SelectItem } from '../../../types/common';

const filtersStatus = [ALL_SELECT, ACTIVATED, DISABLED];

const filtersRole = [SELECT_STAFF, SELECT_COUPLE, SELECT_SUPPLIER];

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center'
};

interface Props {
    setMessageStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

const StaffList: FC<Props> = (props) => {
    const user = useSelector((state: any) => state.auth.login.currentUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedAccounts, setSelectedAccounts] = useState<AccountResponse[]>([]);
    const [status, setStatus] = useState<SelectItem>(filtersStatus[0]);
    const [role, setRole] = useState<SelectItem>(filtersRole[0]);

    const [username, setUsername] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [selectedId, setSelectedId] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(false);

    const [messageCreate, setMessageCreate] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openStatus, setOpenStatus] = useState(false);
    const handleOpenStatus = () => setOpenStatus(true);
    const handleCloseStatus = () => setOpenStatus(false);

    const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchData();
    }, [role, status])

    async function fetchData() {
        setIsLoading(true);
        const response = await getAllAccountByAdmin(user?.token);
        if (status?.id != ALL_SELECT.id) {
            const list = response.filter((e: AccountResponse) => e.roleName == role.id && e.status == status?.id);
            setSelectedAccounts(list)
        } else {
            setSelectedAccounts(response.filter((e: AccountResponse) => e.roleName == role.id))
        }
        setIsLoading(false);
    }

    const handleChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedId(id);
        setSelectedStatus(event.target.checked);
        handleOpenStatus();
    };

    const handleRefresh = () => {
        fetchData();
    }

    async function handleConfirmChange(newChecked: boolean) {
        if (selectedId) {
            const userConfirmed = window.confirm("Bạn có muốn thay đổi trạng thái?");
            if (userConfirmed) {
                try {
                    let response = null;
                    if (selectedStatus) {
                        response = await activatedByAdmin(selectedId, user?.token);
                    } else {
                        response = await disabledByAdmin(selectedId, user?.token);
                    }
                    props.setMessage("Cập nhật trạng thái thành công");
                    props.setMessageStatus("green");
                    await fetchData();
                } catch (error) {
                    props.setMessage("Có lỗi xảy ra");
                    props.setMessageStatus("red");
                } finally {
                    setOpenStatus(false);
                }
            } else {
                // Revert switch state
                setSwitchStates(prevStates => ({
                    ...prevStates,
                    [selectedId]: !newChecked
                }));
                setOpenStatus(false);
            }
        }
    }

    const handleChangeStatus = (event: SelectChangeEvent<number | string>) => {
        setIsLoading(true);
        const selectedStatus = filtersStatus.find(status => status.id === event.target.value);
        if (selectedStatus) {
            setStatus(selectedStatus);
        }
        setIsLoading(false);
    };

    const handleChangeRole = (event: SelectChangeEvent<number | string>) => {
        setIsLoading(true);
        const selectedRole = filtersRole.find(role => role.id === event.target.value);
        if (selectedRole) {
            setRole(selectedRole);
        }
        setIsLoading(false);
    };

    const handleCreate = async () => {
        setMessageCreate('');
        try {
            const newStaff = {
                address: address,
                email: email,
                name: username,
                password: password,
                phoneNumber: phoneNumber,
            }

            const status = await registerStaff(newStaff, user?.token, dispatch, navigate);
            if (status == "SUCCESS") {
                props.setMessageStatus("green");
                props.setMessage("Tạo thành công");
                setMessageCreate('');
                handleClose();
            } else {
                setMessageCreate(status);
            }
        } catch (error) {

        }
    }

    const rows = selectedAccounts?.length > 0 ? selectedAccounts.map((account) => ({
        id: account.id,
        name: account.name,
        phone: account.phoneNumber,
        email: account.email,
        status: account.status,
    })) : [];

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", flex: 0.2 },
        { field: "name", headerName: "Tên", flex: 0.8 },
        { field: "phone", headerName: "Số điện thoại", flex: 0.8 },
        { field: "email", headerName: "Email", flex: 0.8 },
        {
            field: 'status',
            headerName: '',
            flex: 0.5,
            width: 170,
            renderCell: (params) => (
                <Switch
                    onChange={(event) => handleChange(params.row.id, event)}
                    checked={switchStates[params.row.id] || params.row.status === "ACTIVATED"}
                />
            ),
        }
    ];

    return (
        <div id='AdminPage'>
            <h2>Quản lý người dùng</h2>
            <div className="filter-container">
                <FormControl className='filter-dropdown'>
                    <Select
                        labelId="demo-simple-select-label"
                        value={`${role?.id}`}
                        onChange={handleChangeRole}
                    >
                        {
                            filtersRole.map((role, index) => {
                                return (
                                    <MenuItem value={role?.id} key={index}>{role?.name}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl className='filter-dropdown'>
                    <Select
                        labelId="demo-simple-select-label"
                        value={`${status?.id}`}
                        onChange={handleChangeStatus}
                    >
                        {
                            filtersStatus.map((status, index) => {
                                return (
                                    <MenuItem value={status?.id} key={index}>{status?.name}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <Button onClick={handleRefresh} className='filter-dropdown btn-refresh' variant="contained" color="primary">
                    Làm mới
                </Button>
            </div>
            {
                isLoading && (
                    <CircularProgress sx={{ marginTop: 10 }} />
                )
            }
            {
                (!isLoading) && (
                    <>
                        <div style={{ height: 400, width: "100%" }}>
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
                            keepMounted
                            open={openStatus}
                            onClose={handleCloseStatus}
                            aria-labelledby="keep-mounted-modal-title"
                            aria-describedby="keep-mounted-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="keep-mounted-modal-title" variant="h6" component="h2" style={{ color: "var(--primary-color)", fontSize: "1.8rem" }}>
                                    Xác nhận thay đổi trạng thái
                                </Typography>
                                <Typography id="keep-mounted-modal-description" sx={{ mt: 2, mb: 2, fontSize: "1.2rem" }}>
                                    Bạn có muốn thay đổi trạng thái?
                                </Typography>
                                <Button onClick={() => handleConfirmChange(true)}>Yes</Button>
                                <Button onClick={() => handleConfirmChange(false)}>No</Button>
                            </Box>
                        </Modal>
                    </>
                )
            }
            <button className="btn float-right mt-24" onClick={handleOpen}>Tạo nhân viên mới</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                id="ModalCreateStaff"
            >
                <Box
                    className="box"
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Tạo nhân viên mới
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className="create-container">
                            <div className="group-input">
                                <label>Tên đăng nhập:</label>
                                <div className="form-input">
                                    <input type="Name" className="input regis-input" required onChange={(e) => { setEmail(e.target.value) }} />
                                    <span className="text-err"></span>
                                </div>
                            </div>
                            <div className="group-input">
                                <label>Mật khẩu:</label>
                                <div className="form-input">
                                    <input type="Password" className="input regis-input" required onChange={(e) => { setPassword(e.target.value) }} />
                                    <span className="text-err"></span>
                                </div>
                            </div>
                            <div className="group-input">
                                <label>Địa chỉ:</label>
                                <div className="form-input">
                                    <input type="Address" className="input regis-input" required onChange={(e) => { setAddress(e.target.value) }} />
                                    <span className="text-err"></span>
                                </div>
                            </div>
                            <div className="group-input">
                                <label>Tên nhân viên:</label>
                                <div className="form-input">
                                    <input type="Username" className="input regis-input" required onChange={(e) => { setUsername(e.target.value) }} />
                                    <span className="text-err"></span>
                                </div>
                            </div>
                            <div className="group-input">
                                <label>Số điện thoại:</label>
                                <div className="form-input">
                                    <input type="Phone" className="input regis-input" required onChange={(e) => { setPhoneNumber(e.target.value) }} />
                                    <span className="text-err"></span>
                                </div>
                            </div>
                            <span className="text-err" style={{ color: 'red', fontSize: '1.5rem', width: '100%' }}>{messageCreate}</span>
                            <div className="btn-handle">
                                <Button className="btn-close mr-24" variant="contained" onClick={() => { handleClose() }}>Huỷ</Button>
                                <Button className="btn-create" variant="contained" onClick={() => { handleCreate() }}>Tạo</Button>
                            </div>
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </div>

    )
}

export default StaffList