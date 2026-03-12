import { useCallback, useMemo } from 'react';
import { ROUTES, Strings } from '../../constants';
import { CartActions, CartSelectors } from '../../redux/cart';
import { useAppDispatch, useAppSelector } from '../../redux/useRedux';
import { scale } from '../../theme';
import { navigateWithPush } from '../../utils';
import { CART_LIST_ITEM_HEIGHT, type CartSummaryRowKey, CART_SUMMARY_ROW_KEYS } from './CartData';
import type {
  CartEmptyStateContent,
  CartItemRowViewModel,
  CartRecoveryContent,
  CartSummaryRow,
  CheckoutCallToActionState,
  UseCartReturn
} from './CartTypes';

/**
 * Formats one numeric value into shopper-facing currency text.
 *
 * @param {number | undefined} value - Numeric value to format.
 * @returns {string} Currency label.
 */
function formatCurrency(value: number): string {
  return `${Strings.Home.pricePrefix}${value.toFixed(2)}`;
}

/**
 * Formats the value for one summary row.
 *
 * @param {CartSummaryRowKey} key - Summary row key.
 * @param {ReturnType<typeof CartSelectors.getCartSummary>} summary - Cart summary object.
 * @returns {string} Summary row value.
 */
function formatSummaryRowValue(
  key: CartSummaryRowKey,
  summary: ReturnType<typeof CartSelectors.getCartDisplaySummary>
): string {
  switch (key) {
    case 'subtotal':
      return formatCurrency(summary.subtotal);
    case 'discountedSubtotal':
      return formatCurrency(summary.discountedSubtotal);
    case 'discountAmount':
      return formatCurrency(summary.discountAmount);
    case 'tax':
      return formatCurrency(summary.tax);
    case 'shipping':
      return formatCurrency(summary.shipping);
    case 'grandTotal':
      return formatCurrency(summary.grandTotal);
    default:
      return formatCurrency(0);
  }
}

/**
 * Resolves the label for one summary row.
 *
 * @param {CartSummaryRowKey} key - Summary row key.
 * @returns {string} Summary row label.
 */
function getSummaryRowLabel(key: CartSummaryRowKey): string {
  switch (key) {
    case 'subtotal':
      return Strings.Cart.subtotalLabel;
    case 'discountedSubtotal':
      return Strings.Cart.discountedSubtotalLabel;
    case 'discountAmount':
      return Strings.Cart.discountAmountLabel;
    case 'tax':
      return Strings.Cart.taxLabel;
    case 'shipping':
      return Strings.Cart.shippingLabel;
    case 'grandTotal':
      return Strings.Cart.grandTotalLabel;
    default:
      return Strings.Cart.unavailableValue;
  }
}

/**
 * Screen-level cart orchestration hook.
 *
 * @returns {UseCartReturn} Cart screen state and handlers.
 */
const useCart = (): UseCartReturn => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(CartSelectors.getCartItems);
  const cartSummary = useAppSelector(CartSelectors.getCartDisplaySummary);
  const totalProducts = useAppSelector(CartSelectors.getCartTotalProducts);
  const totalQuantity = useAppSelector(CartSelectors.getCartTotalQuantity);
  const cartError = useAppSelector(CartSelectors.getCartError);
  const isCartLoading = useAppSelector(CartSelectors.getCartLoading);
  const isCartMutationLocked = useAppSelector(CartSelectors.getCartMutationLocked);
  const activeMutationProductIds = useAppSelector(
    (state) => CartSelectors.getCart(state).activeMutationProductIds
  );
  const checkoutAction = useAppSelector(CartSelectors.getCheckoutCallToActionState);

  const emptyStateContent = useMemo<CartEmptyStateContent>(
    () => ({
      iconName: 'cart-outline',
      title: Strings.Cart.emptyTitle,
      message: Strings.Cart.emptyMessage
    }),
    []
  );

  const recoveryContent = useMemo<CartRecoveryContent>(
    () => ({
      title: Strings.Cart.errorTitle,
      message: cartError?.message?.trim() || Strings.Cart.errorMessage,
      actionLabel: Strings.Cart.retryButton
    }),
    [cartError?.message]
  );

  const itemRows = useMemo<CartItemRowViewModel[]>(
    () =>
      cartItems.map((item) => {
        const discountValue =
          Number.isFinite(item.discountPercentage) && item.discountPercentage > 0
            ? `${item.discountPercentage.toFixed(2)}%`
            : undefined;
        const discountedTotalValue = Number.isFinite(item.lineDiscountedTotal)
          ? formatCurrency(item.lineDiscountedTotal ?? 0)
          : undefined;
        const hasDiscount = Boolean(discountValue || discountedTotalValue);
        const primaryPriceLabel = hasDiscount
          ? Strings.Cart.discountedLineTotalLabel
          : Strings.Cart.lineTotalLabel;

        return {
          productId: item.productId,
          title: item.title,
          quantity: item.quantity,
          decrementAction: item.quantity <= 1 ? 'delete' : 'minus',
          imageState: item.thumbnailUrl ? 'remote' : 'placeholder',
          primaryPriceLabel,
          unitPriceValue: formatCurrency(item.unitPrice),
          primaryPriceValue: discountedTotalValue ?? formatCurrency(item.lineTotal),
          lineTotalValue: formatCurrency(item.lineTotal),
          discountedTotalValue,
          discountValue,
          hasDiscount,
          thumbnailUrl: item.thumbnailUrl,
          isMutating: activeMutationProductIds.includes(item.productId),
          isDisabled: isCartMutationLocked,
          canNavigate: item.productId.trim().length > 0,
          accessibilityLabel: `${Strings.Cart.openProductDetailsAccessibility}: ${item.title}`
        };
      }),
    [activeMutationProductIds, cartItems, isCartMutationLocked]
  );

  const summaryRows = useMemo<CartSummaryRow[]>(
    () =>
      CART_SUMMARY_ROW_KEYS.map((key) => ({
        key,
        label: getSummaryRowLabel(key),
        value: formatSummaryRowValue(key, cartSummary),
        isUnavailable: false
      })),
    [cartSummary]
  );

  const handleRetry = useCallback((): void => {
    dispatch(CartActions.clearCartError());
  }, [dispatch]);

  const handleIncrementCartItem = useCallback(
    (productId: string): void => {
      if (isCartMutationLocked) {
        return;
      }

      dispatch(CartActions.incrementCartProduct({ productId }));
    },
    [dispatch, isCartMutationLocked]
  );

  const handleDecrementCartItem = useCallback(
    (productId: string): void => {
      const cartItem = cartItems.find((item) => item.productId === productId);

      if (!cartItem || isCartMutationLocked) {
        return;
      }

      if (cartItem.quantity <= 1) {
        dispatch(CartActions.removeCartProduct({ productId }));
        return;
      }

      dispatch(CartActions.decrementCartProduct({ productId }));
    },
    [cartItems, dispatch, isCartMutationLocked]
  );

  const handlePressCartItem = useCallback((productId: string): void => {
    if (!productId.trim()) {
      return;
    }

    navigateWithPush(ROUTES.Details, { id: productId });
  }, []);

  const handleCheckout = useCallback((): void => {
    return;
  }, []);

  const getItemLayout = useCallback(
    (_: ArrayLike<CartItemRowViewModel> | null | undefined, index: number) => ({
      length: scale(CART_LIST_ITEM_HEIGHT),
      offset: scale(CART_LIST_ITEM_HEIGHT) * index,
      index
    }),
    []
  );

  return {
    cartItems: itemRows,
    summaryRows,
    checkoutAction: checkoutAction as CheckoutCallToActionState,
    totalProducts,
    totalQuantity,
    isCartLoading,
    hasItems: itemRows.length > 0,
    emptyStateContent,
    recoveryContent,
    cartErrorMessage: cartError?.message?.trim(),
    getItemLayout,
    handleRetry,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handlePressCartItem,
    handleCheckout
  };
};

export default useCart;
