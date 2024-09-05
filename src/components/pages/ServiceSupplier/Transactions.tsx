import { SetStateAction, Dispatch, FC, useEffect, useState } from 'react'
import { getBalanceWallet, getWalletHistory } from '../../../redux/apiRequest';
import { useSelector } from 'react-redux';
import { TransactionItem } from '../../../types/schema/transaction';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CircularProgress } from '@mui/material';
import { currencyMaskString } from '../../../constants/convert';


interface Props {
    setMessageStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

const Transactions: FC<Props> = (props) => {
    const user = useSelector((state: any) => state.auth.login.currentUser);

    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setIsLoading(true);
        const wallet = await getBalanceWallet(user?.accountId, user?.token);
        const response = await getWalletHistory(wallet?.id, user?.token);
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

    return (
        <div id="Services">
            <div className="create-service">
                <h2 className="h2-title-page" >Quản lý giao dịch</h2>
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