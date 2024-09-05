export interface TransactionSummaryItem {
    id: String,
    totalAmount: Number,
    dateCreated: String,
    dateModified: String,
    platformFee: Number,
    supplierTotalEarn: Number,
    bookingId: String,
    supplierAmountDetails: Array<SupplierAmountDetail>,
}

export interface SupplierAmountDetail {
    supplierId: String,
    image: String,
    supplierName: String,
    contactPersonName: String,
    contactPhone: String,
    contactEmail: String,
    area: String,
    price: Number,
}

export interface AmountEachMonthMap {
    [key: string]: AmountEachMonth | null; // The key is a string (e.g., "5", "8")
}

export interface AmountEachMonth {
    totalAmountCouplePaid: number;
    totalAmountSupplierEarn: number;
    totalAmountPlatformFee: number;
    amountEachMonths: null | AmountEachMonthMap; // Recursive structure
}

