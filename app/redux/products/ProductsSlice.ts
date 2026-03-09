import {
  createSlice,
  type ActionReducerMapBuilder,
  type Draft,
  type PayloadAction
} from '@reduxjs/toolkit';
import { createAsyncThunkWithCancelToken, unauthorizedAPI } from '../../configs';
import { APIConst, Strings, ToolkitAction } from '../../constants';
import INITIAL_STATE, { DEFAULT_ALL_CATEGORY, type ProductsStateType } from './ProductsInitial';
import type { Category } from '../../modules/home';
import type { ErrorResponse } from '../../types';
import type {
  ProductCategoryResponse,
  RemoteCategoryRecord
} from '../../types/ProductCategoryResponse';

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
    const normalizedSlug = record.slug?.trim().toLowerCase();

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
 * Creates the products slice for category loading.
 */
const productsSlice = createSlice({
  name: 'products',
  initialState: INITIAL_STATE,
  reducers: {},
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
  }
});

export const ProductsReducer = productsSlice.reducer;
export const ProductsActions = {
  ...productsSlice.actions,
  getProductCategoriesRequest
};
