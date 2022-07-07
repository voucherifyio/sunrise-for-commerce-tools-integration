export const LOCALE = 'LOCALE';
export const LOCATION = 'LOCATION';
export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const ALL = 'all';
export const DEFAULT_PAGE_SIZE = Number(
  process.env.VUE_APP_PAGE_SIZE || 10
);
export const CUSTOMER = 'CUSTOMER';
export const CHANNEL = 'CHANNEL';
export const AVAILABLE_CODES_NAMES = {
  DISCOUNT_CODES: 'discount_codes',
  APPLIED_CODES: 'applied_codes',
}
export const CODES_STATUSES = {
  APPLIED: 'APPLIED',
}
export const CODES_TYPES = {
  UNIT: 'UNIT',
}
export const CUSTOM_LINE_ITEM_VOUCHER_NAME = 'Voucher, '

