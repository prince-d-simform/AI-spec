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
  quantity: number;
  decrementAction: 'minus' | 'delete';
  imageState: 'remote' | 'placeholder';
  primaryPriceLabel: string;
  unitPriceValue: string;
  primaryPriceValue: string;
  lineTotalValue: string;
  discountedTotalValue?: string;
  discountValue?: string;
  hasDiscount: boolean;
  thumbnailUrl?: string;
  isMutating: boolean;
  isDisabled: boolean;
  canNavigate: boolean;
  accessibilityLabel: string;
}

export interface CartSummaryRow {
  key: CartSummaryRowKey;
  label: string;
  value: string;
  isUnavailable?: boolean;
}

export interface CheckoutCallToActionState {
  isVisible: boolean;
  isDisabled: boolean;
  label: string;
}

export interface UseCartReturn {
  cartItems: CartItemRowViewModel[];
  summaryRows: CartSummaryRow[];
  checkoutAction: CheckoutCallToActionState;
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
  handleRetry: () => void;
  handleIncrementCartItem: (productId: string) => void;
  handleDecrementCartItem: (productId: string) => void;
  handlePressCartItem: (productId: string) => void;
  handleCheckout: () => void;
}
