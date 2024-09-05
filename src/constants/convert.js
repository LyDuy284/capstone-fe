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