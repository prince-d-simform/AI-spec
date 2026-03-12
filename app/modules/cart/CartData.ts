export const CART_DUMMY_USER_ID = 1;

export const CART_LIST_ITEM_HEIGHT = 188;

export const CART_SUMMARY_ROW_KEYS = Object.freeze([
  'subtotal',
  'discountedSubtotal',
  'discountAmount',
  'tax',
  'shipping',
  'grandTotal'
] as const);

export type CartSummaryRowKey = (typeof CART_SUMMARY_ROW_KEYS)[number];
