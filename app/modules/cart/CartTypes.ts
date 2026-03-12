import type { CartSummaryRowKey } from './CartData';
import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

export interface CartEmptyStateContent {
  iconName: ComponentProps<typeof Ionicons>['name'];
  message: string;
  title: string;
}

export interface CartRecoveryContent {
  actionLabel: string;
  message: string;
  title: string;
}

export interface CartItemRowViewModel {
  productId: string;
  title: string;
  productIdValue: string;
  quantity: number;
  unitPriceValue: string;
  lineTotalValue: string;
  discountedTotalValue?: string;
  discountValue: string;
  thumbnailUrl?: string;
  isMutating: boolean;
}

export interface CartSummaryRow {
  key: CartSummaryRowKey;
  label: string;
  value: string;
  isUnavailable?: boolean;
}

export interface UseCartReturn {
  cartItems: CartItemRowViewModel[];
  summaryRows: CartSummaryRow[];
  totalProducts: number;
  totalQuantity: number;
  isCartLoading: boolean;
  hasItems: boolean;
  emptyStateContent: CartEmptyStateContent;
  recoveryContent: CartRecoveryContent;
  cartErrorMessage?: string;
  getItemLayout: (
    data: ArrayLike<CartItemRowViewModel> | null | undefined,
    index: number
  ) => { length: number; offset: number; index: number };
  handleIncrement: (productId: string) => void;
  handleDecrement: (productId: string, quantity: number) => void;
  handleRetry: () => void;
}
