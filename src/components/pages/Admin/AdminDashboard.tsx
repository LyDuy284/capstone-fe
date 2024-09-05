import { InputLabel, MenuItem, Select, FormControl, CircularProgress, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import "./AdminDashboard.css"
import { currencyMaskString } from '../../../constants/convert';
import { getTransactionSummaryStatistic } from '../../../redux/apiRequest';
import { useSelector } from 'react-redux';
import { AmountEachMonthMap } from '../../../types/schema/transactionSummary';


const chartSetting = {
    height: 300,
    sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
        }
    },
};

interface DatasetEntry extends DatasetElementType {
    totalAmountCouplePaid: number;
    totalAmountSupplierEarn: number;
    totalAmountPlatformFee: number;
    month: string;
}

type DatasetElementType = {
    [key: string]: string | number | Date | null | undefined;
};

const valueFormatter = (value: number | null) => currencyMaskString(parseInt(`${value}`));

const AdminDashboard = () => {
    const user = useSelector((state: any) => state.auth.login.currentUser);
    const [selectedYear, setSelectedYear] = useState<number | string>(new Date().getFullYear());
    const [dataset, setDataset] = useState<DatasetElementType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, [selectedYear])

    async function fetchData() {
        setIsLoading(true);
        try {
            const response = await getTransactionSummaryStatistic(selectedYear, user?.token);
            const mappedDataset = mapAmountEachMonthsToDataset(response?.amountEachMonths)
            setDataset(mappedDataset);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    const handleYearChange = (event: SelectChangeEvent<number | string>) => {
        setSelectedYear(event.target.value as number);
    };

    const years = Array.from(new Array(50), (val, index) => 2000 + index);

    const allMonths = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

    function mapAmountEachMonthsToDataset(amountEachMonths: AmountEachMonthMap): DatasetElementType[] {
        return allMonths.map((month) => {
            const monthData = amountEachMonths[month];

            return {
                totalAmountCouplePaid: monthData ? monthData.totalAmountCouplePaid : 0,
                totalAmountSupplierEarn: monthData ? monthData.totalAmountSupplierEarn : 0,
                totalAmountPlatformFee: monthData ? monthData.totalAmountPlatformFee : 0,
                month: `Tháng ${month}`, // Convert the key to the "Tháng X" format
            };
        });
    }

    return (
        <div id="AdminDashboard">
            <h2 className="h2-title-page" >Bảng điều khiển</h2>
            {
                isLoading && (
                    <CircularProgress />
                )
            }
            {
                !isLoading && dataset?.length > 0 && (
                    <>
                        <FormControl sx={{ m: 1, minWidth: 80, maxHeight: 50, position: 'absolute', top: '15%', right: '15%' }}>
                            <InputLabel id="year-select-label">Year</InputLabel>
                            <Select
                                labelId="year-select-label"
                                id="year-select"
                                value={selectedYear}
                                label="Year"
                                onChange={handleYearChange}
                            >
                                {years.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <BarChart
                            dataset={dataset}
                            xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                            series={[
                                { dataKey: 'totalAmountCouplePaid', label: 'Tổng tiền cặp đôi thanh toán', valueFormatter },
                                { dataKey: 'totalAmountSupplierEarn', label: 'Tổng tiền nhà cung cấp nhận', valueFormatter },
                                { dataKey: 'totalAmountPlatformFee', label: 'Tổng tiền chi phí nền tảng', valueFormatter },
                            ]}
                            {...chartSetting}
                        />
                    </>
                )
            }
        </div>
    )
}

export default AdminDashboard