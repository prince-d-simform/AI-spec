import INITIAL_STATE, {
  type CartItem,
  type CartPricingSummary,
  type CartSnapshot,
  type CartStateType
} from './CartInitial';
import type { ProductDetailCartControlState } from '../../modules/details';
import type { RootStateType } from '../Store';

interface CartSelectorsType {
  getCart: (state: RootStateType) => CartStateType;
  getCartSnapshot: (state: RootStateType) => CartSnapshot | undefined;
  getCartItems: (state: RootStateType) => CartItem[];
  getCartSummary: (state: RootStateType) => CartPricingSummary | undefined;
  getCartHydrated: (state: RootStateType) => boolean;
  getCartLoading: (state: RootStateType) => boolean;
  getCartError: (state: RootStateType) => CartStateType['cartError'];
  getCartTotalProducts: (state: RootStateType) => number;
  getCartTotalQuantity: (state: RootStateType) => number;
  getCartItemByProductId: (state: RootStateType, productId: string) => CartItem | undefined;
  getCartQuantityByProductId: (state: RootStateType, productId: string) => number;
  getCartIsProductMutating: (state: RootStateType, productId: string) => boolean;
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

const CartSelectors: CartSelectorsType = {
  getCart: (state: RootStateType): CartStateType => getCartState(state),
  getCartSnapshot: (state: RootStateType): CartSnapshot | undefined => getCartState(state).snapshot,
  getCartItems: (state: RootStateType): CartItem[] => getCartState(state).snapshot?.items ?? [],
  getCartSummary: (state: RootStateType): CartPricingSummary | undefined =>
    getCartState(state).snapshot?.pricing,
  getCartHydrated: (state: RootStateType): boolean => getCartState(state).isHydrated,
  getCartLoading: (state: RootStateType): boolean => getCartState(state).isCartLoading,
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
  getProductDetailCartControlState: (
    state: RootStateType,
    productId: string
  ): ProductDetailCartControlState => {
    const quantity =
      getCartState(state).snapshot?.items.find((item) => item.productId === productId)?.quantity ??
      0;

    return {
      mode: quantity > 0 ? 'added' : 'add',
      quantity,
      isMutating: getCartState(state).activeMutationProductIds.includes(productId)
    };
  }
};

export default CartSelectors;
