import { createAsyncThunk, createSlice, type Draft, type PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { createAsyncThunkWithCancelToken, unauthorizedAPI } from '../../configs';
import { APIConst, Strings, ToolkitAction } from '../../constants';
import { CART_DUMMY_USER_ID } from '../../modules/cart/CartData';
import { getErrorResponse } from '../../utils/CommonUtils';
import INITIAL_STATE, {
  EMPTY_CART_PRICING_SUMMARY,
  type CartItem,
  type CartSnapshot,
  type CartStateType
} from './CartInitial';
import type {
  AddCartRequest,
  CartRequestProductInput,
  ErrorResponse,
  RemoteCartProductResponse,
  RemoteCartResponse
} from '../../types';
import type { AppDispatchType, RootStateType } from '../Store';

type CartMutationType = 'add' | 'increment' | 'decrement' | 'delete';

interface CartMutationArgs {
  productId: string;
  quantity?: number;
}

interface CartThunkConfig {
  dispatch: AppDispatchType;
  state: RootStateType;
  rejectValue: ErrorResponse;
}

interface PersistedRootState {
  cart?: Partial<CartStateType>;
}

interface CartMutationThunkApi {
  dispatch: AppDispatchType;
  getState: () => RootStateType;
}

/**
 * Raw API thunk for cart confirmation.
 */
const confirmCartRequest = createAsyncThunkWithCancelToken<RemoteCartResponse>(
  ToolkitAction.confirmCart,
  'POST',
  APIConst.cartAdd,
  unauthorizedAPI
);

/**
 * Trims a required text value.
 *
 * @param {string} value - Incoming text value.
 * @returns {string} Normalized text.
 */
function normalizeText(value: string): string {
  return value.trim();
}

/**
 * Trims an optional text value.
 *
 * @param {string | undefined} value - Incoming optional text value.
 * @returns {string | undefined} Normalized optional text.
 */
function normalizeOptionalText(value?: string): string | undefined {
  const normalizedValue = value?.trim();

  return normalizedValue || undefined;
}

/**
 * Normalizes one remote cart line into the app cart-item contract.
 *
 * @param {RemoteCartProductResponse} record - Raw cart line payload.
 * @returns {CartItem | null} Normalized cart item or null when invalid.
 */
function normalizeCartProduct(record: RemoteCartProductResponse): CartItem | null {
  const productId = Number.isFinite(record.id) ? String(record.id) : '';
  const title = normalizeText(record.title ?? '');
  const unitPrice = Number(record.price);
  const quantity = Number(record.quantity);
  const lineTotal = Number(record.total);
  const discountPercentage = Number(record.discountPercentage);
  const lineDiscountedTotal = Number(record.discountedPrice ?? record.discountedTotal);

  if (
    !productId ||
    !title ||
    !Number.isFinite(unitPrice) ||
    !Number.isFinite(quantity) ||
    !Number.isFinite(lineTotal) ||
    !Number.isFinite(discountPercentage)
  ) {
    return null;
  }

  return {
    productId,
    title,
    unitPrice,
    quantity,
    lineTotal,
    discountPercentage,
    lineDiscountedTotal: Number.isFinite(lineDiscountedTotal) ? lineDiscountedTotal : undefined,
    thumbnailUrl: normalizeOptionalText(record.thumbnail)
  };
}

/**
 * Normalizes a successful cart response into the persisted cart snapshot.
 *
 * @param {RemoteCartResponse} response - Raw remote cart response.
 * @param {CartSnapshot['source']} [source='api'] - Snapshot source label.
 * @returns {CartSnapshot} Normalized cart snapshot.
 */
function normalizeCartSnapshot(
  response: RemoteCartResponse,
  source: CartSnapshot['source'] = 'api'
): CartSnapshot {
  const items = response.products
    .map((product) => normalizeCartProduct(product))
    .filter((product): product is CartItem => !!product);
  const subtotal = Number(response.total);
  const discountedSubtotal = Number(response.discountedTotal);
  const tax = Number(response.tax);
  const shipping = Number(response.shipping);
  const grandTotal = Number(response.grandTotal);
  const discountAmount =
    Number.isFinite(subtotal) && Number.isFinite(discountedSubtotal)
      ? Math.max(subtotal - discountedSubtotal, 0)
      : EMPTY_CART_PRICING_SUMMARY.discountAmount;
  const hasCompletePricing =
    Number.isFinite(tax) && Number.isFinite(shipping) && Number.isFinite(grandTotal);

  return {
    cartId: String(response.id),
    apiUserId: Number.isFinite(response.userId) ? Number(response.userId) : undefined,
    items,
    totalProducts: Number.isFinite(response.totalProducts)
      ? Number(response.totalProducts)
      : items.length,
    totalQuantity: Number.isFinite(response.totalQuantity)
      ? Number(response.totalQuantity)
      : items.reduce((total, item) => total + item.quantity, 0),
    pricing: {
      subtotal: Number.isFinite(subtotal) ? subtotal : 0,
      discountedSubtotal: Number.isFinite(discountedSubtotal) ? discountedSubtotal : 0,
      discountAmount,
      tax: Number.isFinite(tax) ? tax : undefined,
      shipping: Number.isFinite(shipping) ? shipping : undefined,
      grandTotal: Number.isFinite(grandTotal) ? grandTotal : undefined,
      pricingStatus: hasCompletePricing ? 'complete' : 'partial'
    },
    lastSyncedAt: Date.now(),
    source
  };
}

/**
 * Converts an unknown rejected value into the shared error contract.
 *
 * @param {unknown} error - Unknown error payload.
 * @returns {ErrorResponse} Shared error response.
 */
function toErrorResponse(error: unknown): ErrorResponse {
  if (error && typeof error === 'object' && 'message' in error) {
    return error as ErrorResponse;
  }

  return getErrorResponse(Strings.APIError.somethingWentWrong);
}

/**
 * Starts one cart mutation.
 *
 * @param {Draft<CartStateType>} state - Draft cart state.
 * @param {string} productId - Active product identifier.
 * @returns {void}
 */
function startMutation(state: Draft<CartStateType>, productId: string): void {
  state.activeMutationProductIds = productId ? [productId] : [];
  state.isCartLoading = true;
  state.isCartMutationLocked = true;
  state.cartError = undefined;
  state.lastFailedOperation = undefined;
}

/**
 * Finishes one cart mutation.
 *
 * @param {Draft<CartStateType>} state - Draft cart state.
 * @returns {void}
 */
function finishMutation(state: Draft<CartStateType>): void {
  state.activeMutationProductIds = [];
  state.isCartLoading = false;
  state.isCartMutationLocked = false;
}

/**
 * Builds the full cart payload for the next confirmation.
 *
 * @param {CartSnapshot | undefined} snapshot - Current confirmed cart snapshot.
 * @param {string} productId - Target product identifier.
 * @param {number} targetQuantity - Desired confirmed quantity.
 * @returns {CartRequestProductInput[]} Full desired cart payload.
 */
function buildCartProducts(
  snapshot: CartSnapshot | undefined,
  productId: string,
  targetQuantity: number
): CartRequestProductInput[] {
  const normalizedProductId = normalizeText(productId);
  const numericProductId = Number(normalizedProductId);

  if (!normalizedProductId || !Number.isFinite(numericProductId)) {
    return [];
  }

  const currentProducts =
    snapshot?.items.reduce<CartRequestProductInput[]>((products, item) => {
      const itemId = Number(item.productId);

      if (!Number.isFinite(itemId) || item.quantity < 1) {
        return products;
      }

      products.push({
        id: itemId,
        quantity: item.quantity
      });

      return products;
    }, []) ?? [];

  let hasTarget = false;

  const nextProducts = currentProducts.reduce<CartRequestProductInput[]>((products, item) => {
    if (item.id !== numericProductId) {
      products.push(item);
      return products;
    }

    hasTarget = true;

    if (targetQuantity > 0) {
      products.push({
        id: item.id,
        quantity: targetQuantity
      });
    }

    return products;
  }, []);

  if (!hasTarget && targetQuantity > 0) {
    nextProducts.push({
      id: numericProductId,
      quantity: targetQuantity
    });
  }

  return nextProducts;
}

/**
 * Resolves the desired quantity for the current mutation.
 *
 * @param {CartSnapshot | undefined} snapshot - Confirmed cart snapshot.
 * @param {string} productId - Product identifier.
 * @param {CartMutationType} mutationType - Requested mutation type.
 * @param {number} quantity - Requested quantity delta.
 * @returns {number} Target confirmed quantity.
 */
function resolveTargetQuantity(
  snapshot: CartSnapshot | undefined,
  productId: string,
  mutationType: CartMutationType,
  quantity: number
): number {
  const currentQuantity =
    snapshot?.items.find((item) => item.productId === productId)?.quantity ?? 0;

  switch (mutationType) {
    case 'add':
      return currentQuantity + Math.max(quantity, 1);
    case 'increment':
      return Math.max(currentQuantity, 0) + 1;
    case 'decrement':
      if (currentQuantity < 1) {
        throw getErrorResponse(Strings.Cart.invalidProductMessage);
      }

      return Math.max(currentQuantity - 1, 0);
    case 'delete':
      if (currentQuantity < 1) {
        throw getErrorResponse(Strings.Cart.invalidProductMessage);
      }

      return 0;
    default:
      return currentQuantity;
  }
}

/**
 * Executes one full-snapshot cart confirmation mutation.
 *
 * @param {CartMutationThunkApi} thunkApi - Thunk helpers.
 * @param {string} productId - Target product identifier.
 * @param {CartMutationType} mutationType - Requested mutation type.
 * @param {number} [quantity=1] - Requested quantity delta.
 * @returns {Promise<CartSnapshot>} Normalized confirmed snapshot.
 */
async function syncCartMutation(
  thunkApi: CartMutationThunkApi,
  productId: string,
  mutationType: CartMutationType,
  quantity = 1
): Promise<CartSnapshot> {
  const normalizedProductId = normalizeText(productId);
  const numericProductId = Number(normalizedProductId);
  const snapshot = thunkApi.getState().cart?.snapshot;

  if (!normalizedProductId || !Number.isFinite(numericProductId)) {
    throw getErrorResponse(Strings.Cart.invalidProductMessage);
  }

  const targetQuantity = resolveTargetQuantity(
    snapshot,
    normalizedProductId,
    mutationType,
    quantity
  );
  const products = buildCartProducts(snapshot, normalizedProductId, targetQuantity);

  const requestBody: AddCartRequest = {
    userId: CART_DUMMY_USER_ID,
    products
  };

  try {
    const response = await thunkApi
      .dispatch(
        confirmCartRequest({
          data: requestBody,
          shouldShowToast: false
        })
      )
      .unwrap();

    return normalizeCartSnapshot(response);
  } catch (error) {
    throw toErrorResponse(error);
  }
}

/**
 * Returns whether a new cart mutation can start.
 *
 * @param {RootStateType} state - Redux root state.
 * @returns {boolean} True when the cart is unlocked.
 */
function canMutateCart(state: RootStateType): boolean {
  return !state.cart?.isCartMutationLocked;
}

/**
 * Adds a product to the cart through the shared confirmation flow.
 */
const addProductToCart = createAsyncThunk<CartSnapshot, CartMutationArgs, CartThunkConfig>(
  ToolkitAction.addProductToCart,
  async ({ productId, quantity = 1 }, thunkApi) => {
    try {
      return await syncCartMutation(thunkApi, productId, 'add', quantity);
    } catch (error) {
      return thunkApi.rejectWithValue(toErrorResponse(error));
    }
  },
  {
    condition: (_args, { getState }) => canMutateCart(getState())
  }
);

/**
 * Increments one cart product through the shared confirmation flow.
 */
const incrementCartProduct = createAsyncThunk<CartSnapshot, CartMutationArgs, CartThunkConfig>(
  ToolkitAction.incrementCartProduct,
  async ({ productId }, thunkApi) => {
    try {
      return await syncCartMutation(thunkApi, productId, 'increment');
    } catch (error) {
      return thunkApi.rejectWithValue(toErrorResponse(error));
    }
  },
  {
    condition: (_args, { getState }) => canMutateCart(getState())
  }
);

/**
 * Decrements one cart product through the shared confirmation flow.
 */
const decrementCartProduct = createAsyncThunk<CartSnapshot, CartMutationArgs, CartThunkConfig>(
  ToolkitAction.decrementCartProduct,
  async ({ productId }, thunkApi) => {
    try {
      return await syncCartMutation(thunkApi, productId, 'decrement');
    } catch (error) {
      return thunkApi.rejectWithValue(toErrorResponse(error));
    }
  },
  {
    condition: (_args, { getState }) => canMutateCart(getState())
  }
);

/**
 * Removes one cart product through the shared confirmation flow.
 */
const removeCartProduct = createAsyncThunk<CartSnapshot, CartMutationArgs, CartThunkConfig>(
  ToolkitAction.removeCartProduct,
  async ({ productId }, thunkApi) => {
    try {
      return await syncCartMutation(thunkApi, productId, 'delete');
    } catch (error) {
      return thunkApi.rejectWithValue(toErrorResponse(error));
    }
  },
  {
    condition: (_args, { getState }) => canMutateCart(getState())
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: INITIAL_STATE,
  reducers: {
    clearCartError: (state: Draft<CartStateType>) => {
      state.cartError = undefined;
      state.lastFailedOperation = undefined;
    },
    hydrateCartSnapshot: (
      state: Draft<CartStateType>,
      action: PayloadAction<CartSnapshot | undefined>
    ) => {
      state.snapshot = action.payload
        ? {
            ...action.payload,
            source: 'local-fallback'
          }
        : undefined;
      state.isHydrated = true;
      state.isCartLoading = false;
      state.isCartMutationLocked = false;
      state.activeMutationProductIds = [];
      state.cartError = undefined;
      state.lastFailedOperation = undefined;
    },
    resetCartState: () => INITIAL_STATE
  },
  extraReducers: (builder) => {
    builder.addCase(
      REHYDRATE as unknown as string,
      (state, action: PayloadAction<PersistedRootState | undefined>) => {
        const inboundCartState = action.payload?.cart;

        state.snapshot = inboundCartState?.snapshot
          ? {
              ...inboundCartState.snapshot,
              source: 'local-fallback'
            }
          : undefined;
        state.isHydrated = true;
        state.isCartLoading = false;
        state.isCartMutationLocked = false;
        state.activeMutationProductIds = [];
        state.cartError = undefined;
        state.lastFailedOperation = undefined;
      }
    );

    builder.addCase(addProductToCart.pending, (state, action) => {
      startMutation(state, normalizeText(action.meta.arg.productId));
    });
    builder.addCase(addProductToCart.fulfilled, (state, action) => {
      state.snapshot = action.payload;
      state.isHydrated = true;
      state.cartError = undefined;
      state.lastFailedOperation = undefined;
      finishMutation(state);
    });
    builder.addCase(addProductToCart.rejected, (state, action) => {
      state.cartError = action.payload ?? getErrorResponse(Strings.APIError.somethingWentWrong);
      state.lastFailedOperation = 'add';
      finishMutation(state);
    });

    builder.addCase(incrementCartProduct.pending, (state, action) => {
      startMutation(state, normalizeText(action.meta.arg.productId));
    });
    builder.addCase(incrementCartProduct.fulfilled, (state, action) => {
      state.snapshot = action.payload;
      state.isHydrated = true;
      state.cartError = undefined;
      state.lastFailedOperation = undefined;
      finishMutation(state);
    });
    builder.addCase(incrementCartProduct.rejected, (state, action) => {
      state.cartError = action.payload ?? getErrorResponse(Strings.APIError.somethingWentWrong);
      state.lastFailedOperation = 'increment';
      finishMutation(state);
    });

    builder.addCase(decrementCartProduct.pending, (state, action) => {
      startMutation(state, normalizeText(action.meta.arg.productId));
    });
    builder.addCase(decrementCartProduct.fulfilled, (state, action) => {
      state.snapshot = action.payload;
      state.isHydrated = true;
      state.cartError = undefined;
      state.lastFailedOperation = undefined;
      finishMutation(state);
    });
    builder.addCase(decrementCartProduct.rejected, (state, action) => {
      state.cartError = action.payload ?? getErrorResponse(Strings.APIError.somethingWentWrong);
      state.lastFailedOperation = 'decrement';
      finishMutation(state);
    });

    builder.addCase(removeCartProduct.pending, (state, action) => {
      startMutation(state, normalizeText(action.meta.arg.productId));
    });
    builder.addCase(removeCartProduct.fulfilled, (state, action) => {
      state.snapshot = action.payload;
      state.isHydrated = true;
      state.cartError = undefined;
      state.lastFailedOperation = undefined;
      finishMutation(state);
    });
    builder.addCase(removeCartProduct.rejected, (state, action) => {
      state.cartError = action.payload ?? getErrorResponse(Strings.APIError.somethingWentWrong);
      state.lastFailedOperation = 'delete';
      finishMutation(state);
    });
  }
});

export const CartReducer = cartSlice.reducer;
export const CartActions = {
  ...cartSlice.actions,
  addProductToCart,
  incrementCartProduct,
  decrementCartProduct,
  removeCartProduct,
  confirmCartRequest
};
