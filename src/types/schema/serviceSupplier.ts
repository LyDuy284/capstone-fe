import { CategoryItem } from "./category";
import { PromotionItem } from "./promotion";
import { SegmentItem } from "./segment";
import { ServiceItem } from "./service";

export interface ServiceSupplierListResponse {
    categoryId: String,
    categoryName: String,
    listServices: Array<ServiceItem>,
}

export interface ServiceSupplierItem {
    id: String,
    name: String,
    description: String,
    rating: String,
    listImages: Array<String>,
    type: String,
    createAt: String,
    price: String,
    status: String,
    promotion: PromotionItem
}

export interface ServiceSupplierResponse {
    id: String,
    name: String,
    description: String,
    rating: String,
    listImages: Array<String>,
    type: String,
    createAt: String,
    price: String,
    status: String,
    serviceResponse: ServiceItem
}

export interface ServiceSupplierDetail {
    id: String,
    name: String,
    description: String,
    rating: String,
    listImages: Array<String>,
    type: String,
    createAt: String,
    price: Number,
    status: String,
    supplierResponse: any,
    serviceResponse: ServiceItem,
    categoryResponse: CategoryItem,
    promotion: PromotionItem
}