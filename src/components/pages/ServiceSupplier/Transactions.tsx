import React, { SetStateAction, Dispatch, FC, useEffect, useState } from 'react'
import { getBalanceWallet, getWalletHistory } from '../../../redux/apiRequest';
import { useSelector } from 'react-redux';
import { TransactionItem } from '../../../types/schema/transaction';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CircularProgress } from '@mui/material';
import { currencyMaskString } from '../../../constants/convert';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';


interface Props {
    setMessageStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

const Transactions: FC<Props> = (props) => {
    const user = useSelector((state: any) => state.auth.login.currentUser);

    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const now = new Date();
    const date = dayjs();
    const [startDate, setStartDate] = React.useState<Dayjs | null>(date.startOf('month'));
    const [endDate, setEndDate] = React.useState<Dayjs | null>(date.endOf('month'));

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    async function fetchData() {
        setIsLoading(true);
        const wallet = await getBalanceWallet(user?.accountId, user?.token);
        const response = await getWalletHistory(wallet?.id, user?.token, formatDate(startDate), formatDate(endDate));
        setTransactions(response);
        setIsLoading(false);
    }

    const rows = transactions?.length > 0 ? transactions?.map((transaction) => ({
        id: transaction.id.split("WALLET-HISTORY-")[1],
        amount: currencyMaskString(transaction.amount),
        createDate: transaction.createDate,
        description: transaction.description,
        walletId: transaction.walletId
    })) : [];

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", flex: 0.3 },
        { field: "amount", headerName: "Số dư", flex: 0.5 },
        { field: "createDate", headerName: "Thời gian giao dịch", flex: 0.5 },
        { field: "description", headerName: "Chi tiết", flex: 1.2 },
    ];

    const formatDate = (date: Dayjs | null): string => {
        return date ? date.format('YYYY-MM-DD') : '';
    };

    return (
        <div id="Services">
            <div className="create-service">
                <h2 className="h2-title-page" >Quản lý giao dịch</h2>
                <div className="select-box-container">
                    <span className='label-select pt-8'>Ngày bắt đầu:</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                            <DateTimePicker
                                value={startDate}
                                className='mr-12'
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
                                    setStartDate(value);
                                }}
                                maxDate={(endDate) ? endDate : undefined}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <div className="divide-right"></div>

                    <span className='label-select pt-8'>Ngày kết thúc:</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                            <DateTimePicker
                                value={endDate}
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
                                    }
                                }}
                                minDate={
                                    startDate ?
                                        startDate
                                        : undefined
                                }
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
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
        </div>
    )
}

export default Transactions;