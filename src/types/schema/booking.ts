import { ServiceEntity } from "../entity/Entity"
import { CoupleItem } from "./couple"
import { PromotionItem } from "./promotion"
import { ServiceSupplierResponse } from "./serviceSupplier"

export interface BookingDetailItem {
    bookingDetailId: String,
    price: String,
    note: String,
    createAt: String,
    completedDate: String,
    status: String,
    promotionResponse: PromotionItem,
    couple: CoupleItem,
    serviceSupplierResponse: ServiceSupplierResponse
}

export interface ServiceBookingItem {
    service: ServiceEntity,
    bookingPrice: Number
}

export interface BookingItem {
    weddingDate: String,
    coupleResponse: CoupleItem,
    createAt: String,
    id: String,
    note: String,
    status: String,
    totalPrice: Number
}

export interface AdminBookingItem {
    id: String,
    weddingDate: String,
    couple: CoupleItem
    listBookingDetail: String,
    note: String,
    totalPrice: Number,
    createdAt: String,
    status: String,
}
