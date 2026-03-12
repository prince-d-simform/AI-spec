import { createAsyncThunk, createSlice, type Draft, type PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { createAsyncThunkWithCancelToken, unauthorizedAPI } from '../../configs';
import { APIConst, Strings, ToolkitAction } from '../../constants';
import { CART_DUMMY_USER_ID } from '../../modules/cart/CartData';
import { getErrorResponse } from '../../utils/CommonUtils';
import INITIAL_STATE, {
  EMPTY_CART_PRICING_SUMMARY,
  type CartFailedOperation,
  type CartItem,
  type CartSnapshot,
  type CartStateType
} from './CartInitial';
import type {
  AddCartRequest,
  CartRequestProductInput,
  ErrorResponse,
  RemoteCartProductResponse,
  RemoteCartResponse,
  UpdateCartRequest
} from '../../types';
import type { AppDispatchType, RootStateType } from '../Store';

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
 * Raw API thunk for initial cart creation.
 */
const createCartRequest = createAsyncThunkWithCancelToken<RemoteCartResponse>(
  ToolkitAction.createCart,
  'POST',
  APIConst.cartAdd,
  unauthorizedAPI
);

/**
 * Raw API thunk for cart updates after a cart id exists.
 */
const updateCartRequest = createAsyncThunkWithCancelToken<RemoteCartResponse>(
  ToolkitAction.updateCart,
  'PUT',
  APIConst.cartUpdate,
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
  const discountAmount =
    Number.isFinite(subtotal) && Number.isFinite(discountedSubtotal)
      ? Math.max(subtotal - discountedSubtotal, 0)
      : EMPTY_CART_PRICING_SUMMARY.discountAmount;

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
      tax: undefined,
      shipping: undefined,
      grandTotal: undefined,
      pricingStatus: 'partial'
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
 * Starts one product-scoped cart mutation.
 *
 * @param {Draft<CartStateType>} state - Draft cart state.
 * @param {string} productId - Active product identifier.
 * @param {CartFailedOperation} operation - Mutation operation type.
 * @returns {void}
 */
function startMutation(
  state: Draft<CartStateType>,
  productId: string,
  operation: CartFailedOperation
): void {
  if (!state.activeMutationProductIds.includes(productId)) {
    state.activeMutationProductIds.push(productId);
  }

  state.isCartLoading = true;
  state.cartError = undefined;
  state.lastFailedOperation = operation;
}

/**
 * Finishes one product-scoped cart mutation.
 *
 * @param {Draft<CartStateType>} state - Draft cart state.
 * @param {string} productId - Completed product identifier.
 * @returns {void}
 */
function finishMutation(state: Draft<CartStateType>, productId: string): void {
  state.activeMutationProductIds = state.activeMutationProductIds.filter(
    (activeProductId) => activeProductId !== productId
  );
  state.isCartLoading = state.activeMutationProductIds.length > 0;
}

/**
 * Builds a full replacement cart payload for decrement and removal flows.
 *
 * @param {CartSnapshot} snapshot - Confirmed cart snapshot.
 * @param {string} productId - Target product identifier.
 * @param {number} nextQuantity - Desired next quantity.
 * @returns {CartRequestProductInput[]} Replacement payload.
 */
function buildReplacementProducts(
  snapshot: CartSnapshot,
  productId: string,
  nextQuantity: number
): CartRequestProductInput[] {
  return snapshot.items.reduce<CartRequestProductInput[]>((products, item) => {
    const quantity = item.productId === productId ? nextQuantity : item.quantity;

    if (quantity > 0) {
      products.push({
        id: Number(item.productId),
        quantity
      });
    }

    return products;
  }, []);
}

/**
 * Executes the additive create-or-update cart flow.
 *
 * @param {CartMutationThunkApi} thunkApi - Thunk helpers.
 * @param {string} productId - Target product identifier.
 * @param {number} quantity - Quantity to add.
 * @returns {Promise<CartSnapshot>} Normalized snapshot.
 */
async function syncAdditiveMutation(
  thunkApi: CartMutationThunkApi,
  productId: string,
  quantity: number
): Promise<CartSnapshot> {
  const normalizedProductId = normalizeText(productId);
  const numericProductId = Number(normalizedProductId);
  const snapshot = thunkApi.getState().cart?.snapshot;

  if (!normalizedProductId || !Number.isFinite(numericProductId) || quantity < 1) {
    throw getErrorResponse(Strings.Cart.invalidProductMessage);
  }

  const requestBody: AddCartRequest = {
    userId: CART_DUMMY_USER_ID,
    products: [{ id: numericProductId, quantity }]
  };

  try {
    const response = snapshot?.cartId
      ? await thunkApi
          .dispatch(
            updateCartRequest({
              paths: { cartId: snapshot.cartId },
              data: {
                merge: true,
                products: requestBody.products
              } satisfies UpdateCartRequest,
              shouldShowToast: false
            })
          )
          .unwrap()
      : await thunkApi
          .dispatch(
            createCartRequest({
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
 * Returns whether a new mutation is allowed for one product.
 *
 * @param {RootStateType} state - Redux root state.
 * @param {string} productId - Product identifier.
 * @returns {boolean} True when a new mutation is allowed.
 */
function canMutateProduct(state: RootStateType, productId: string): boolean {
  return !state.cart?.activeMutationProductIds.includes(productId);
}

/**
 * Adds a product to the cart, creating the cart first when needed.
 */
const addProductToCart = createAsyncThunk<CartSnapshot, CartMutationArgs, CartThunkConfig>(
  ToolkitAction.addProductToCart,
  async ({ productId, quantity = 1 }, thunkApi) => {
    try {
      return await syncAdditiveMutation(thunkApi, productId, quantity);
    } catch (error) {
      return thunkApi.rejectWithValue(toErrorResponse(error));
    }
  },
  {
    condition: ({ productId }, { getState }) => canMutateProduct(getState(), productId)
  }
);

/**
 * Increments one product quantity through the cart API.
 */
const incrementCartProduct = createAsyncThunk<CartSnapshot, CartMutationArgs, CartThunkConfig>(
  ToolkitAction.incrementCartProduct,
  async ({ productId }, thunkApi) => {
    try {
      return await syncAdditiveMutation(thunkApi, productId, 1);
    } catch (error) {
      return thunkApi.rejectWithValue(toErrorResponse(error));
    }
  },
  {
    condition: ({ productId }, { getState }) => canMutateProduct(getState(), productId)
  }
);

/**
 * Decrements one product quantity through a replacement cart update.
 */
const decrementCartProduct = createAsyncThunk<CartSnapshot, CartMutationArgs, CartThunkConfig>(
  ToolkitAction.decrementCartProduct,
  async ({ productId }, thunkApi) => {
    const normalizedProductId = normalizeText(productId);
    const snapshot = thunkApi.getState().cart?.snapshot;
    const currentItem = snapshot?.items.find(
      (item: CartItem) => item.productId === normalizedProductId
    );

    if (!snapshot?.cartId || !currentItem) {
      return thunkApi.rejectWithValue(getErrorResponse(Strings.Cart.invalidProductMessage));
    }

    try {
      const response = await thunkApi
        .dispatch(
          updateCartRequest({
            paths: { cartId: snapshot.cartId },
            data: {
              products: buildReplacementProducts(
                snapshot,
                normalizedProductId,
                currentItem.quantity - 1
              )
            } satisfies UpdateCartRequest,
            shouldShowToast: false
          })
        )
        .unwrap();

      return normalizeCartSnapshot(response);
    } catch (error) {
      return thunkApi.rejectWithValue(toErrorResponse(error));
    }
  },
  {
    condition: ({ productId }, { getState }) => canMutateProduct(getState(), productId)
  }
);

/**
 * Removes one product line through a replacement cart update.
 */
const removeCartProduct = createAsyncThunk<CartSnapshot, CartMutationArgs, CartThunkConfig>(
  ToolkitAction.removeCartProduct,
  async ({ productId }, thunkApi) => {
    const normalizedProductId = normalizeText(productId);
    const snapshot = thunkApi.getState().cart?.snapshot;
    const currentItem = snapshot?.items.find(
      (item: CartItem) => item.productId === normalizedProductId
    );

    if (!snapshot?.cartId || !currentItem) {
      return thunkApi.rejectWithValue(getErrorResponse(Strings.Cart.invalidProductMessage));
    }

    try {
      const response = await thunkApi
        .dispatch(
          updateCartRequest({
            paths: { cartId: snapshot.cartId },
            data: {
              products: buildReplacementProducts(snapshot, normalizedProductId, 0)
            } satisfies UpdateCartRequest,
            shouldShowToast: false
          })
        )
        .unwrap();

      return normalizeCartSnapshot(response);
    } catch (error) {
      return thunkApi.rejectWithValue(toErrorResponse(error));
    }
  },
  {
    condition: ({ productId }, { getState }) => canMutateProduct(getState(), productId)
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
        state.activeMutationProductIds = [];
        state.cartError = undefined;
        state.lastFailedOperation = inboundCartState?.snapshot ? 'hydrate' : undefined;
      }
    );

    builder.addCase(addProductToCart.pending, (state, action) => {
      startMutation(state, normalizeText(action.meta.arg.productId), 'create');
    });
    builder.addCase(addProductToCart.fulfilled, (state, action) => {
      state.snapshot = action.payload;
      state.isHydrated = true;
      state.cartError = undefined;
      state.lastFailedOperation = undefined;
      finishMutation(state, normalizeText(action.meta.arg.productId));
    });
    builder.addCase(addProductToCart.rejected, (state, action) => {
      state.cartError = action.payload ?? getErrorResponse(Strings.APIError.somethingWentWrong);
      state.lastFailedOperation = 'create';
      finishMutation(state, normalizeText(action.meta.arg.productId));
    });

    builder.addCase(incrementCartProduct.pending, (state, action) => {
      startMutation(state, normalizeText(action.meta.arg.productId), 'update');
    });
    builder.addCase(incrementCartProduct.fulfilled, (state, action) => {
      state.snapshot = action.payload;
      state.isHydrated = true;
      state.cartError = undefined;
      state.lastFailedOperation = undefined;
      finishMutation(state, normalizeText(action.meta.arg.productId));
    });
    builder.addCase(incrementCartProduct.rejected, (state, action) => {
      state.cartError = action.payload ?? getErrorResponse(Strings.APIError.somethingWentWrong);
      state.lastFailedOperation = 'update';
      finishMutation(state, normalizeText(action.meta.arg.productId));
    });

    builder.addCase(decrementCartProduct.pending, (state, action) => {
      startMutation(state, normalizeText(action.meta.arg.productId), 'update');
    });
    builder.addCase(decrementCartProduct.fulfilled, (state, action) => {
      state.snapshot = action.payload;
      state.isHydrated = true;
      state.cartError = undefined;
      state.lastFailedOperation = undefined;
      finishMutation(state, normalizeText(action.meta.arg.productId));
    });
    builder.addCase(decrementCartProduct.rejected, (state, action) => {
      state.cartError = action.payload ?? getErrorResponse(Strings.APIError.somethingWentWrong);
      state.lastFailedOperation = 'update';
      finishMutation(state, normalizeText(action.meta.arg.productId));
    });

    builder.addCase(removeCartProduct.pending, (state, action) => {
      startMutation(state, normalizeText(action.meta.arg.productId), 'update');
    });
    builder.addCase(removeCartProduct.fulfilled, (state, action) => {
      state.snapshot = action.payload;
      state.isHydrated = true;
      state.cartError = undefined;
      state.lastFailedOperation = undefined;
      finishMutation(state, normalizeText(action.meta.arg.productId));
    });
    builder.addCase(removeCartProduct.rejected, (state, action) => {
      state.cartError = action.payload ?? getErrorResponse(Strings.APIError.somethingWentWrong);
      state.lastFailedOperation = 'update';
      finishMutation(state, normalizeText(action.meta.arg.productId));
    });
  }
});

export const CartReducer = cartSlice.reducer;
export const CartActions = {
  ...cartSlice.actions,
  addProductToCart,
  createCartRequest,
  decrementCartProduct,
  incrementCartProduct,
  removeCartProduct,
  updateCartRequest
};
