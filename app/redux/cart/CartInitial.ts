import type { ErrorResponse } from '../../types';

export type CartPricingStatus = 'complete' | 'partial';
export type CartSnapshotSource = 'api' | 'local-fallback';
export type CartFailedOperation = 'hydrate' | 'create' | 'update';

export interface CartItem {
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  discountPercentage: number;
  lineDiscountedTotal?: number;
  thumbnailUrl?: string;
}

export interface CartPricingSummary {
  subtotal: number;
  discountedSubtotal: number;
  discountAmount: number;
  tax?: number;
  shipping?: number;
  grandTotal?: number;
  pricingStatus: CartPricingStatus;
}

export interface CartSnapshot {
  cartId: string;
  apiUserId?: number;
  items: CartItem[];
  totalProducts: number;
  totalQuantity: number;
  pricing: CartPricingSummary;
  lastSyncedAt: number;
  source: CartSnapshotSource;
}

export interface CartStateType {
  snapshot?: CartSnapshot;
  isHydrated: boolean;
  isCartLoading: boolean;
  activeMutationProductIds: string[];
  cartError?: ErrorResponse;
  lastFailedOperation?: CartFailedOperation;
}

export const EMPTY_CART_PRICING_SUMMARY: CartPricingSummary = {
  subtotal: 0,
  discountedSubtotal: 0,
  discountAmount: 0,
  tax: undefined,
  shipping: undefined,
  grandTotal: undefined,
  pricingStatus: 'partial'
};

const INITIAL_STATE: CartStateType = {
  snapshot: undefined,
  isHydrated: false,
  isCartLoading: false,
  activeMutationProductIds: [],
  cartError: undefined,
  lastFailedOperation: undefined
};

export default INITIAL_STATE;
