import { ServiceSupplierListResponse } from "./serviceSupplier";

export interface ComboItem {
    id: string;
    name: string;
    description: String,
    status: string,
    images: String,
    comboServices: ServiceSupplierListResponse,
    staffId: String,
}

export interface ComboDetail {
    id: String,
    name: String,
    description: String,
    images: String;
    createAt: String,
    comboServices: ServiceSupplierListResponse,
}