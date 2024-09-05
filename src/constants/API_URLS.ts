// Authentication
export const ACCOUNT_LOGIN = '/auth/login';
export const ACCOUNT_LOGIN_GOOGLE = '/auth/loginGoogle';
export const ACCOUNT_REGISTER_COUPLE = '/auth/register/couple';
export const ACCOUNT_REGISTER_SUPPLIER = '/auth/register/supplier';
export const ACCOUNT_REGISTER_STAFF = '/auth/register/staff';
export const GET_COUPLE_BY_ID = '/account/getCoupleProfile';

// Staff API
export const GET_ALL_BLOGS = '/blog/getAllBlogPosts';
export const GET_ACTIVE_BLOGS = '/blog/getAllActiveBlogPosts';
export const GET_PENDING_BLOGS = '/blog/getAllPendingBlogPosts';
export const GET_REJECTED_BLOGS = '/blog/getAllRejectedBlogPosts';
export const GET_SUPPLIERS_BLOGS = '/blog/getAllBlogPostsByServiceSupplier';
export const GET_ALL_CATEGORIES = '/category/getAllCategory';
export const CREATE_CATEGORY = '/category/create';
export const CREATE_POST = '/blog/create';
export const GET_BLOG_BY_ID = '/blog/getBlogPostById/';
export const UPDATE_POST = '/blog/update';
export const CREATE_COMBO = '/combo/create';
export const GET_ALL_COMBO_BY_ID = '/combo/getById/'
export const GET_COMBO_BY_FILTER = '/combo/getComboByFilter'
export const GET_ALL_COMBO = '/combo/getComboByFilter'
export const GET_SERVICE_BY_ID = '/service/getById/{id}';
export const GET_ALL_SERVICES_SUPPLIER = '/service-supplier/filter'
export const UPDATE_COMBO = '/combo/update';
export const CREATE_SERVICES = '/service/create';
export const GET_ALL_SERVICES = '/service/getAllServices';
export const UPDATE_SERVICE = '/service/update';

// Promotion
export const CREATE_PROMOTION = '/promotion/create';
export const GET_PROMOTION_BY_SUPPLIER = '/promotion/getPromotionBySupplier';

// Booking
export const GET_BOOKING_BY_SUPPLIER = '/booking/getBySupplier';
export const POST_BOOKING = '/booking/create';
export const GET_BOOKING_BY_ID = '/booking/getById';
export const REQUEST_PAYMENT = '/payment/request';
export const GET_BOOKING_BY_COUPLE = '/booking/getByCouple';
export const CANCEL_BOOKING = '/booking-service/cancle';
export const RATING_BOOKING = '/rating/create';
export const GET_BY_ADMIN = '/booking/getByAdmin';

export const GET_TRANSACTION_BY_COUPLE =
  '/transaction/getCoupleTransactionsHistoryByFilter';

// Booking Detail
export const UPDATE_REJECT_BOOKING_STATUS = '/booking-service/reject';
export const UPDATE_CONFIRM_BOOKING_STATUS = '/booking-service/confirm';
export const UPDATE_CONFIRM_PROCESSING_STATUS = '/booking-service/processing';
export const UPDATE_CONFIRM_DONE_STATUS = '/booking-service/done';
export const GET_BOOKING_DETAIL_BY_SUPPLIER_ID =
  '/booking/getBookingDetailBySupplierAndBooking';

// Service
export const CREATE_SERVICE = '/service/create';
export const GET_SERVICE_BY_CATEGORY_ID = '/service/getByCategory';

// Service Supplier
export const CREATE_SERVICE_SUPPLIER = '/service-supplier/create';
export const UPDATE_SERVICE_SUPPLIER = '/service-supplier/update';
export const GET_SERVICE_SUPPLIER_FILTER = '/service-supplier/filter';
export const GET_SERVICE_SUPPLIER_BY_ID = '/service-supplier/getById';
export const GET_SERVICE_SUPPLIER_BY_SUPPLIER_ID =
  '/service-supplier/getBySuppler';

// Wallet
export const GET_BALANCE_WALLET = '/wallet/balance';
export const TOP_UP_BY_STAFF = '/wallet/topUpByStaff';

// Wallet history
export const GET_WALLET_HISTORY = '/wallet-history/byFilter';

// Account
export const GET_ALL_ACCOUNT_BY_ROLE = '/account/getAllAccountByRole';
export const GET_ALL_ACCOUNT_BY_ADMIN = '/account/getAllAccountByAdmin';
export const ACTIVATED_BY_ADMIN = '/account/activateAccountByAdmin';
export const DISABLED_BY_ADMIN = '/account/disableAccountByAdmin';
export const UPDATE_COUPLE_PROFILE = '/account/updateCoupleProfile';
export const UPDATE_SUPPLIER_PROFILE = '/account/updateSupplierProfile';

// Couple
export const GET_ALL_COUPLE_BY_ADMIN = '/couple/getAllCoupleByAdmin';

// Transaction summary
export const GET_TRANSACTION_SUMMARY_DETAIL = '/transaction-summary/detail';
export const GET_TRANSACTION_SUMMARY_STATISTIC = '/transaction-summary/statistic';