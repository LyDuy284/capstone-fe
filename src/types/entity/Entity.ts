import { PromotionItem } from "../schema/promotion"

export interface StaffEntity {
    id: String,
    name: String,
    phone: String,
    createAt: String,
    status: String,
    position: String,
    department: String,
}

// SUPPLIER
export interface SupplierEntity {
    image: String,
    supplierName: String,
    contactPersonName: String,
    contactPhone: String,
    contactEmail: String,
    area: AreaEntity
}

export interface SupplierUpdate {
    apartmentNumber: String,
    contactEmail: String,
    contactNumber: String,
    district: String,
    image: String,
    name: String,
    province: String,
    supplierId: String,
    ward: String
}

export interface AreaEntity {
    id: String,
    province: String,
    district: String,
    ward: String,
    apartmentNumber: String,
    status: String,
}

// CATEGORY
export interface CategoryEntity {
    id: String,
    categoryName: String,
    status: String,
}

// SERVICE
export interface ServiceEntity {
    id: String,
    name: String,
    description: String,
    listImages: Array<String>,
    price: Number,
    status: String,
    categoryResponse: CategoryEntity,
    type: String,
    promotionService: PromotionItem,
}

export interface ServiceCreate {
    description: String,
    images: String,
    name: String,
    price: Number,
    promotionId: String,
    serviceId: String,
    supplierId: String,
    type: String,
}

export interface ServiceUpdate {
    description: String,
    images: String,
    name: String,
    price: Number,
    promotionId: String,
    id: String,
    supplierId: String,
    type: String,
}

export interface ProductPriceReporterEntity {
    id: String,
    coupleName: String,
    categoryName: String,
    serviceName: String,
    requirement: String,
    priceReport: String,
}

export interface BlogEntity {
    id: String,
    title: String,
    content: String,
    date: String
}

// Staff
export interface PostCreate {
    content: String,
    images: String,
    staff: String,
    title: String,
}
export interface PostUpdate {
    content: String,
    id: String,
    images: String,
    title: String,
}
export interface ServicesCreate {
    categoryId: string,
    description: String,
    images: String,
    name: String,
}
export interface ServicesUpdate {
    description: String,
    id: string,
    images: String,
    name: String,
}
export interface ComboCreate {
    description: String,
    image: String,
    listServiceSupplierId: Array<String>,
    name: String,
    staffId: String,
}

export interface ComboUpdate {
    description: String,
    image: String,
    name: String,
    id: String,
}