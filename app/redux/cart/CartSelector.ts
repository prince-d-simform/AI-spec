import { Strings } from '../../constants';
import INITIAL_STATE, {
  type CartDisplayPricingSummary,
  type CartItem,
  type CartPricingSummary,
  type CartSnapshot,
  type CartStateType
} from './CartInitial';
import type { ProductDetailCartControlState } from '../../modules/details';
import type { RootStateType } from '../Store';

interface CheckoutCallToActionState {
  isVisible: boolean;
  isDisabled: boolean;
  label: string;
}

interface CartSelectorsType {
  getCart: (state: RootStateType) => CartStateType;
  getCartSnapshot: (state: RootStateType) => CartSnapshot | undefined;
  getCartItems: (state: RootStateType) => CartItem[];
  getCartSummary: (state: RootStateType) => CartPricingSummary | undefined;
  getCartDisplaySummary: (state: RootStateType) => CartDisplayPricingSummary;
  getCartHydrated: (state: RootStateType) => boolean;
  getCartLoading: (state: RootStateType) => boolean;
  getCartMutationLocked: (state: RootStateType) => boolean;
  getCartError: (state: RootStateType) => CartStateType['cartError'];
  getCartTotalProducts: (state: RootStateType) => number;
  getCartTotalQuantity: (state: RootStateType) => number;
  getCartItemByProductId: (state: RootStateType, productId: string) => CartItem | undefined;
  getCartQuantityByProductId: (state: RootStateType, productId: string) => number;
  getCartIsProductMutating: (state: RootStateType, productId: string) => boolean;
  getCheckoutCallToActionState: (state: RootStateType) => CheckoutCallToActionState;
  getProductDetailCartControlState: (
    state: RootStateType,
    productId: string
  ) => ProductDetailCartControlState;
}

/**
 * Safely resolves the cart slice from the Redux root state.
 *
 * @param {RootStateType} state - Redux root state.
 * @returns {CartStateType} Cart slice state.
 */
const getCartState = (state: RootStateType): CartStateType => state.cart ?? INITIAL_STATE;

/**
 * Derives numeric display pricing values for the cart summary.
 *
 * @param {CartPricingSummary | undefined} summary - Canonical pricing summary.
 * @returns {CartDisplayPricingSummary} UI-facing pricing summary.
 */
function toDisplayPricingSummary(summary?: CartPricingSummary): CartDisplayPricingSummary {
  const subtotal = summary?.subtotal ?? 0;
  const discountedSubtotal = summary?.discountedSubtotal ?? 0;
  const discountAmount = summary?.discountAmount ?? 0;
  const tax = summary?.tax ?? 0;
  const shipping = summary?.shipping ?? 0;
  const grandTotal = summary?.grandTotal ?? discountedSubtotal + tax + shipping;

  return {
    subtotal,
    discountedSubtotal,
    discountAmount,
    tax,
    shipping,
    grandTotal,
    usesFallbackValues:
      !Number.isFinite(summary?.tax) ||
      !Number.isFinite(summary?.shipping) ||
      !Number.isFinite(summary?.grandTotal)
  };
}

const CartSelectors: CartSelectorsType = {
  getCart: (state: RootStateType): CartStateType => getCartState(state),
  getCartSnapshot: (state: RootStateType): CartSnapshot | undefined => getCartState(state).snapshot,
  getCartItems: (state: RootStateType): CartItem[] => getCartState(state).snapshot?.items ?? [],
  getCartSummary: (state: RootStateType): CartPricingSummary | undefined =>
    getCartState(state).snapshot?.pricing,
  getCartDisplaySummary: (state: RootStateType): CartDisplayPricingSummary =>
    toDisplayPricingSummary(getCartState(state).snapshot?.pricing),
  getCartHydrated: (state: RootStateType): boolean => getCartState(state).isHydrated,
  getCartLoading: (state: RootStateType): boolean => getCartState(state).isCartLoading,
  getCartMutationLocked: (state: RootStateType): boolean =>
    getCartState(state).isCartMutationLocked,
  getCartError: (state: RootStateType): CartStateType['cartError'] => getCartState(state).cartError,
  getCartTotalProducts: (state: RootStateType): number =>
    getCartState(state).snapshot?.totalProducts ?? 0,
  getCartTotalQuantity: (state: RootStateType): number =>
    getCartState(state).snapshot?.totalQuantity ?? 0,
  getCartItemByProductId: (state: RootStateType, productId: string): CartItem | undefined =>
    getCartState(state).snapshot?.items.find((item) => item.productId === productId),
  getCartQuantityByProductId: (state: RootStateType, productId: string): number =>
    getCartState(state).snapshot?.items.find((item) => item.productId === productId)?.quantity ?? 0,
  getCartIsProductMutating: (state: RootStateType, productId: string): boolean =>
    getCartState(state).activeMutationProductIds.includes(productId),
  getCheckoutCallToActionState: (state: RootStateType): CheckoutCallToActionState => ({
    isVisible: (getCartState(state).snapshot?.items.length ?? 0) > 0,
    isDisabled: getCartState(state).isCartMutationLocked,
    label: Strings.Cart.checkoutButton
  }),
  getProductDetailCartControlState: (
    state: RootStateType,
    productId: string
  ): ProductDetailCartControlState => {
    const quantity =
      getCartState(state).snapshot?.items.find((item) => item.productId === productId)?.quantity ??
      0;
    const isLocked = getCartState(state).isCartMutationLocked;

    return {
      mode: quantity > 0 ? 'quantity' : 'add',
      quantity,
      decrementAction: quantity <= 1 ? 'delete' : 'minus',
      isMutating: getCartState(state).activeMutationProductIds.includes(productId),
      isDisabled: isLocked
    };
  }
};

export default CartSelectors;
