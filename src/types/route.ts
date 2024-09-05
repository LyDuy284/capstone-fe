export type Role = 'ADMIN' | 'COUPLE' | 'STAFF' | 'SERVICE_SUPPLIER';

export interface User {
    accountId: Number
    token: String
    roleName: Role
    email: String
    status: String
}
