import { CategoryItem } from "./category";

export interface ServiceItem {
    id: String,
    name: String,
    description: String,
    createAt: String,
    listImages: Array<String>,
    categoryResponse: CategoryItem,
}

export interface ServiceDetail {
    id: String,
    name: String,
    description: String,
    createAt: String,
    listImages: Array<String>,
    categoryResponse: CategoryItem,
    status: String,
}