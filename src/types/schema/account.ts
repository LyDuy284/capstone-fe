import { RoleItem } from "./role";

export interface AccountItem {
    id: String;
    email: String;
    name: String;
    image: String;
    phoneNumber: String;
    address: String;
    status: String;
    provider: String;
    role: RoleItem;
}

export interface AccountResponse {
    id: String,
    roleName: String,
    name: String,
    email: String,
    phoneNumber: String,
    status: String,
    image: String,
    address: String,
}