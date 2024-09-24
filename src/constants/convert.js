export const currencyMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{3})$/, "$1.$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    e.target.value = value;
    return e;
};

export const currencyMaskString = (num: Number) => {
    let str = "";
    let value = `${num}`;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{3})$/, "$1.$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    str = value;
    return str;
};

export const currencyToNumber = (currency: string) => {
    console.log(currency.replace(/\./g, ""));
    return parseInt(currency.replace(/\./g, ""))
}

export const getColorStatus = (status: string) => {
    switch (status) {
        case "PENDING":
            return "#ffa500"
        case "APPROVED":
            return "#0000ff"
        case "DEPOSITED":
            return "#800080"
        case "REJECTED":
        case "CANCELED":
            return "#a82f28"
        case "PROCESSING":
            return "#fbc02d"
        case "COMPLETED":
            return "#43a047"
        default:
            return "#afb42b"
    }
}