import {
  createSlice,
  type ActionReducerMapBuilder,
  type Draft,
  type PayloadAction
} from '@reduxjs/toolkit';
import { createAsyncThunkWithCancelToken, unauthorizedAPI } from '../../configs';
import { APIConst, Strings, ToolkitAction } from '../../constants';
import INITIAL_STATE, { DEFAULT_ALL_CATEGORY, type ProductsStateType } from './ProductsInitial';
import type { Category, Product } from '../../modules/home/HomeTypes';
import type { ErrorResponse } from '../../types';
import type {
  ProductCategoryResponse,
  RemoteCategoryRecord
} from '../../types/ProductCategoryResponse';
import type {
  RemoteCategoryProductsResponse,
  RemoteProductRecord,
  RemoteProductsResponse
} from '../../types/ProductListResponse';

/**
 * Fetches all product categories from the catalog API.
 */
const getProductCategoriesRequest = createAsyncThunkWithCancelToken<ProductCategoryResponse>(
  ToolkitAction.getProductCategories,
  'GET',
  APIConst.productCategories,
  unauthorizedAPI
);

/**
 * Fetches the full product catalog from the catalog API.
 */
const getAllProductsRequest = createAsyncThunkWithCancelToken<RemoteProductsResponse>(
  ToolkitAction.getAllProducts,
  'GET',
  APIConst.products,
  unauthorizedAPI
);

/**
 * Fetches the selected category product catalog from the catalog API.
 */
const getCategoryProductsRequest = createAsyncThunkWithCancelToken<RemoteCategoryProductsResponse>(
  ToolkitAction.getCategoryProducts,
  'GET',
  APIConst.productsByCategory,
  unauthorizedAPI
);

/**
 * Converts a slug value into a shopper-friendly label.
 *
 * @param {string} slug - The category slug.
 * @returns {string} The formatted fallback label.
 */
function formatCategoryNameFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Normalizes a category slug for comparisons and filtering.
 *
 * @param {string} slug - The incoming category slug.
 * @returns {string} The normalized slug.
 */
function normalizeCategorySlug(slug: string): string {
  return slug.trim().toLowerCase();
}

/**
 * Builds the synthetic All category.
 *
 * @returns {Category} The All category object.
 */
function createAllCategory(): Category {
  return {
    ...DEFAULT_ALL_CATEGORY,
    name: Strings.Home.categoryAll
  };
}

/**
 * Normalizes remote category records for Home screen consumption.
 *
 * @param {ProductCategoryResponse} records - The raw response from the API.
 * @returns {Category[]} The normalized category list with a prepended All option.
 */
function normalizeCategories(records: ProductCategoryResponse): Category[] {
  const normalizedCategories: Category[] = [];
  const seenSlugs = new Set<string>();

  records.forEach((record: RemoteCategoryRecord) => {
    const normalizedSlug = normalizeCategorySlug(record.slug ?? '');

    if (!normalizedSlug || seenSlugs.has(normalizedSlug) || normalizedSlug === 'all') {
      return;
    }

    seenSlugs.add(normalizedSlug);

    const trimmedName = record.name?.trim();

    normalizedCategories.push({
      slug: normalizedSlug,
      name: trimmedName || formatCategoryNameFromSlug(normalizedSlug)
    });
  });

  return [createAllCategory(), ...normalizedCategories];
}

/**
 * Resolves the primary image URL for a product card.
 *
 * @param {RemoteProductRecord} record - The remote product item.
 * @returns {string} The preferred image URL.
 */
function getProductImageUrl(record: RemoteProductRecord): string {
  const thumbnail = record.thumbnail?.trim();

  if (thumbnail) {
    return thumbnail;
  }

  return record.images.find((imageUrl) => imageUrl?.trim())?.trim() ?? '';
}

/**
 * Normalizes a remote product item into the Home grid product contract.
 *
 * @param {RemoteProductRecord} record - The remote product item.
 * @returns {Product | null} The normalized product or null when invalid.
 */
function normalizeProduct(record: RemoteProductRecord): Product | null {
  const normalizedCategory = normalizeCategorySlug(record.category ?? '');
  const normalizedTitle = record.title?.trim();
  const normalizedPrice = Number(record.price);
  const normalizedRating = Number(record.rating);

  if (
    !Number.isFinite(record.id) ||
    !normalizedCategory ||
    !normalizedTitle ||
    !Number.isFinite(normalizedPrice) ||
    !Number.isFinite(normalizedRating)
  ) {
    return null;
  }

  return {
    category: normalizedCategory,
    id: String(record.id),
    imageUrl: getProductImageUrl(record),
    price: normalizedPrice,
    rating: normalizedRating,
    title: normalizedTitle
  };
}

/**
 * Normalizes the full products response for Redux state.
 *
 * @param {RemoteProductsResponse} response - The remote catalog response.
 * @returns {{ products: Product[]; total: number; skip: number; limit: number }} Normalized data.
 */
function normalizeProductsResponse(response: RemoteProductsResponse): {
  limit: number;
  products: Product[];
  skip: number;
  total: number;
} {
  const products: Product[] = [];
  const seenIds = new Set<string>();

  response.products.forEach((record) => {
    const normalizedProduct = normalizeProduct(record);

    if (!normalizedProduct || seenIds.has(normalizedProduct.id)) {
      return;
    }

    seenIds.add(normalizedProduct.id);
    products.push(normalizedProduct);
  });

  return {
    limit: Number.isFinite(response.limit) ? response.limit : products.length,
    products,
    skip: Number.isFinite(response.skip) ? response.skip : 0,
    total: Number.isFinite(response.total) ? response.total : products.length
  };
}

/**
 * Clears selected-category product state.
 *
 * @param {Draft<ProductsStateType>} state - The draft products state.
 * @returns {void}
 */
function clearCategoryProductsStateReducer(state: Draft<ProductsStateType>): void {
  state.productsByCategory = [];
  state.isCategoryProductsLoading = false;
  state.categoryProductsError = undefined;
  state.categoryProductsLastUpdated = undefined;
  state.categoryProductsLimit = undefined;
  state.categoryProductsRequestId = undefined;
  state.categoryProductsSkip = undefined;
  state.categoryProductsTotal = undefined;
  state.selectedCategorySlug = undefined;
}

/**
 * Creates the products slice for category loading.
 */
const productsSlice = createSlice({
  name: 'products',
  initialState: INITIAL_STATE,
  reducers: {
    clearCategoryProductsState: (state: Draft<ProductsStateType>) => {
      clearCategoryProductsStateReducer(state);
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<ProductsStateType>) => {
    builder.addCase(getProductCategoriesRequest.pending, (state: Draft<ProductsStateType>) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(
      getProductCategoriesRequest.fulfilled,
      (state: Draft<ProductsStateType>, action: PayloadAction<ProductCategoryResponse>) => {
        state.isLoading = false;
        state.error = undefined;
        state.categories = normalizeCategories(action.payload);
        state.lastUpdated = Date.now();
      }
    );
    builder.addCase(
      getProductCategoriesRequest.rejected,
      (state: Draft<ProductsStateType>, action: PayloadAction<ErrorResponse | undefined>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.categories = [createAllCategory()];
      }
    );
    builder.addCase(getAllProductsRequest.pending, (state: Draft<ProductsStateType>) => {
      state.isProductsLoading = state.allProducts.length === 0;
      state.isProductsRefreshing = state.allProducts.length > 0;
      state.productsError = undefined;
    });
    builder.addCase(
      getAllProductsRequest.fulfilled,
      (state: Draft<ProductsStateType>, action: PayloadAction<RemoteProductsResponse>) => {
        const normalizedResponse = normalizeProductsResponse(action.payload);

        state.allProducts = normalizedResponse.products;
        state.isProductsLoading = false;
        state.isProductsRefreshing = false;
        state.limit = normalizedResponse.limit;
        state.productsError = undefined;
        state.productsLastUpdated = Date.now();
        state.skip = normalizedResponse.skip;
        state.total = normalizedResponse.total;
      }
    );
    builder.addCase(
      getAllProductsRequest.rejected,
      (state: Draft<ProductsStateType>, action: PayloadAction<ErrorResponse | undefined>) => {
        state.isProductsLoading = false;
        state.isProductsRefreshing = false;
        state.productsError = action.payload;
      }
    );
    builder.addCase(
      getCategoryProductsRequest.pending,
      (state: Draft<ProductsStateType>, action) => {
        state.productsByCategory = [];
        state.isCategoryProductsLoading = true;
        state.categoryProductsError = undefined;
        state.categoryProductsLastUpdated = undefined;
        state.categoryProductsLimit = undefined;
        state.categoryProductsRequestId = action.meta.requestId;
        state.categoryProductsSkip = undefined;
        state.categoryProductsTotal = undefined;
        state.selectedCategorySlug = normalizeCategorySlug(action.meta.arg.paths?.slug ?? '');
      }
    );
    builder.addCase(
      getCategoryProductsRequest.fulfilled,
      (state: Draft<ProductsStateType>, action) => {
        if (action.meta.requestId !== state.categoryProductsRequestId) {
          return;
        }

        const normalizedResponse = normalizeProductsResponse(action.payload);

        state.productsByCategory = normalizedResponse.products;
        state.isCategoryProductsLoading = false;
        state.categoryProductsError = undefined;
        state.categoryProductsLastUpdated = Date.now();
        state.categoryProductsLimit = normalizedResponse.limit;
        state.categoryProductsSkip = normalizedResponse.skip;
        state.categoryProductsTotal = normalizedResponse.total;
      }
    );
    builder.addCase(
      getCategoryProductsRequest.rejected,
      (state: Draft<ProductsStateType>, action) => {
        if (action.meta.requestId !== state.categoryProductsRequestId) {
          return;
        }

        state.productsByCategory = [];
        state.isCategoryProductsLoading = false;
        state.categoryProductsError = action.payload;
        state.categoryProductsLastUpdated = undefined;
        state.categoryProductsLimit = undefined;
        state.categoryProductsSkip = undefined;
        state.categoryProductsTotal = undefined;
      }
    );
  }
});

export const ProductsReducer = productsSlice.reducer;
export const ProductsActions = {
  ...productsSlice.actions,
  getAllProductsRequest,
  getCategoryProductsRequest,
  getProductCategoriesRequest
};
