import {
  createSlice,
  type ActionReducerMapBuilder,
  type Draft,
  type PayloadAction
} from '@reduxjs/toolkit';
import { createAsyncThunkWithCancelToken, unauthorizedAPI } from '../../configs';
import { APIConst, Strings, ToolkitAction } from '../../constants';
import INITIAL_STATE, { DEFAULT_ALL_CATEGORY, type ProductsStateType } from './ProductsInitial';
import type {
  ProductDetail,
  ProductDimensions,
  ProductMeta,
  ProductReview
} from '../../modules/details';
import type { Category, Product } from '../../modules/home/HomeTypes';
import type { ErrorResponse } from '../../types';
import type {
  ProductCategoryResponse,
  RemoteCategoryRecord
} from '../../types/ProductCategoryResponse';
import type {
  RemoteCategoryProductsResponse,
  RemoteProductDetailResponse,
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
 * Fetches one product-detail record from the catalog API.
 */
const getProductDetailRequest = createAsyncThunkWithCancelToken<RemoteProductDetailResponse>(
  ToolkitAction.getProductDetail,
  'GET',
  APIConst.productDetail,
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
 * Trims a required shopper-facing text field.
 *
 * @param {string} value - The incoming text value.
 * @returns {string} The normalized text value.
 */
function normalizeText(value: string): string {
  return value.trim();
}

/**
 * Trims an optional text field.
 *
 * @param {string | undefined} value - The incoming optional text value.
 * @returns {string | undefined} The normalized optional value.
 */
function normalizeOptionalText(value?: string): string | undefined {
  const trimmedValue = value?.trim();

  return trimmedValue || undefined;
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
 * Returns a de-duplicated image list for a product detail view.
 *
 * @param {RemoteProductRecord} record - The remote product record.
 * @returns {string[]} The ordered image URLs.
 */
function getProductImageGallery(record: RemoteProductRecord): string[] {
  const seenImages = new Set<string>();
  const images = [record.thumbnail, ...record.images]
    .map((imageUrl) => imageUrl?.trim() ?? '')
    .filter(Boolean)
    .filter((imageUrl) => {
      if (seenImages.has(imageUrl)) {
        return false;
      }

      seenImages.add(imageUrl);
      return true;
    });

  return images;
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
 * Normalizes one remote review entry for product-detail rendering.
 *
 * @param {RemoteProductDetailResponse['reviews'][number]} review - The remote review entry.
 * @returns {ProductReview | null} The normalized review or null when invalid.
 */
function normalizeProductReview(
  review: RemoteProductDetailResponse['reviews'][number]
): ProductReview | null {
  const normalizedComment = normalizeText(review.comment ?? '');
  const normalizedReviewerName = normalizeText(review.reviewerName ?? '');
  const normalizedReviewerEmail = normalizeText(review.reviewerEmail ?? '');
  const normalizedRating = Number(review.rating);
  const normalizedDate = normalizeText(review.date ?? '');

  if (
    !normalizedComment ||
    !normalizedReviewerName ||
    !normalizedReviewerEmail ||
    !normalizedDate ||
    !Number.isFinite(normalizedRating)
  ) {
    return null;
  }

  return {
    comment: normalizedComment,
    date: normalizedDate,
    rating: normalizedRating,
    reviewerEmail: normalizedReviewerEmail,
    reviewerName: normalizedReviewerName
  };
}

/**
 * Normalizes the dimensions block for product-detail rendering.
 *
 * @param {RemoteProductDetailResponse['dimensions']} dimensions - The remote dimensions block.
 * @returns {ProductDimensions} The normalized dimensions.
 */
function normalizeProductDimensions(
  dimensions: RemoteProductDetailResponse['dimensions']
): ProductDimensions {
  return {
    depth: Number.isFinite(dimensions?.depth) ? Number(dimensions.depth) : 0,
    height: Number.isFinite(dimensions?.height) ? Number(dimensions.height) : 0,
    width: Number.isFinite(dimensions?.width) ? Number(dimensions.width) : 0
  };
}

/**
 * Normalizes product metadata for product-detail rendering.
 *
 * @param {RemoteProductDetailResponse['meta']} meta - The remote metadata block.
 * @returns {ProductMeta} The normalized metadata block.
 */
function normalizeProductMeta(meta: RemoteProductDetailResponse['meta']): ProductMeta {
  return {
    barcode: normalizeText(meta?.barcode ?? ''),
    createdAt: normalizeText(meta?.createdAt ?? ''),
    qrCode: normalizeText(meta?.qrCode ?? ''),
    updatedAt: normalizeText(meta?.updatedAt ?? '')
  };
}

/**
 * Normalizes one remote product-detail response.
 *
 * @param {RemoteProductDetailResponse} record - The remote product-detail response.
 * @returns {ProductDetail | null} The normalized product detail or null when invalid.
 */
function normalizeProductDetail(record: RemoteProductDetailResponse): ProductDetail | null {
  const normalizedId = Number.isFinite(record.id) ? String(record.id) : '';
  const normalizedTitle = normalizeText(record.title ?? '');
  const normalizedDescription = normalizeText(record.description ?? '');
  const normalizedCategory = normalizeCategorySlug(record.category ?? '');
  const normalizedPrice = Number(record.price);
  const normalizedDiscountPercentage = Number(record.discountPercentage);
  const normalizedRating = Number(record.rating);
  const normalizedStock = Number(record.stock);
  const normalizedWeight = Number(record.weight);
  const normalizedMinimumOrderQuantity = Number(record.minimumOrderQuantity);
  const normalizedReviews = record.reviews
    .map((review) => normalizeProductReview(review))
    .filter((review): review is ProductReview => !!review);

  if (
    !normalizedId ||
    !normalizedTitle ||
    !normalizedDescription ||
    !normalizedCategory ||
    !Number.isFinite(normalizedPrice) ||
    !Number.isFinite(normalizedDiscountPercentage) ||
    !Number.isFinite(normalizedRating) ||
    !Number.isFinite(normalizedStock) ||
    !Number.isFinite(normalizedWeight) ||
    !Number.isFinite(normalizedMinimumOrderQuantity)
  ) {
    return null;
  }

  return {
    availabilityStatus: normalizeText(record.availabilityStatus ?? ''),
    brand: normalizeOptionalText(record.brand),
    category: normalizedCategory,
    description: normalizedDescription,
    dimensions: normalizeProductDimensions(record.dimensions),
    discountPercentage: normalizedDiscountPercentage,
    id: normalizedId,
    images: getProductImageGallery(record),
    meta: normalizeProductMeta(record.meta),
    minimumOrderQuantity: normalizedMinimumOrderQuantity,
    price: normalizedPrice,
    rating: normalizedRating,
    returnPolicy: normalizeText(record.returnPolicy ?? ''),
    reviews: normalizedReviews,
    shippingInformation: normalizeText(record.shippingInformation ?? ''),
    sku: normalizeText(record.sku ?? ''),
    stock: normalizedStock,
    tags: record.tags.map((tag) => tag?.trim() ?? '').filter(Boolean),
    thumbnail: getProductImageUrl(record),
    title: normalizedTitle,
    warrantyInformation: normalizeText(record.warrantyInformation ?? ''),
    weight: normalizedWeight
  };
}

/**
 * Returns whether an API error message should be treated as a product-unavailable state.
 *
 * @param {ErrorResponse | undefined} error - The rejected API error response.
 * @returns {boolean} True when the product is unavailable or not found.
 */
function isUnavailableProductError(error?: ErrorResponse): boolean {
  const normalizedMessage = error?.message?.trim().toLowerCase() ?? '';

  return (
    normalizedMessage.includes('not found') ||
    normalizedMessage.includes('unavailable') ||
    normalizedMessage.includes('does not exist')
  );
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
 * Clears active product-detail state.
 *
 * @param {Draft<ProductsStateType>} state - The draft products state.
 * @returns {void}
 */
function clearProductDetailStateReducer(state: Draft<ProductsStateType>): void {
  state.selectedProductId = undefined;
  state.selectedProductDetail = undefined;
  state.isProductDetailLoading = false;
  state.productDetailError = undefined;
  state.productDetailUnavailable = false;
  state.productDetailLastUpdated = undefined;
  state.productDetailRequestId = undefined;
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
    },
    clearProductDetailState: (state: Draft<ProductsStateType>) => {
      clearProductDetailStateReducer(state);
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
    builder.addCase(getProductDetailRequest.pending, (state: Draft<ProductsStateType>, action) => {
      clearProductDetailStateReducer(state);
      state.selectedProductId = normalizeText(String(action.meta.arg.paths?.id ?? ''));
      state.isProductDetailLoading = true;
      state.productDetailRequestId = action.meta.requestId;
    });
    builder.addCase(
      getProductDetailRequest.fulfilled,
      (state: Draft<ProductsStateType>, action) => {
        if (action.meta.requestId !== state.productDetailRequestId) {
          return;
        }

        const normalizedProductDetail = normalizeProductDetail(action.payload);

        state.isProductDetailLoading = false;
        state.productDetailError = undefined;
        state.productDetailUnavailable = false;
        state.productDetailLastUpdated = Date.now();

        if (!normalizedProductDetail) {
          state.selectedProductDetail = undefined;
          state.productDetailError = { message: Strings.APIError.somethingWentWrong };
          return;
        }

        state.selectedProductId = normalizedProductDetail.id;
        state.selectedProductDetail = normalizedProductDetail;
      }
    );
    builder.addCase(getProductDetailRequest.rejected, (state: Draft<ProductsStateType>, action) => {
      if (action.meta.requestId !== state.productDetailRequestId) {
        return;
      }

      state.selectedProductDetail = undefined;
      state.isProductDetailLoading = false;
      state.productDetailError = action.payload;
      state.productDetailUnavailable = isUnavailableProductError(action.payload);
      state.productDetailLastUpdated = undefined;
    });
  }
});

export const ProductsReducer = productsSlice.reducer;
export const ProductsActions = {
  ...productsSlice.actions,
  getAllProductsRequest,
  getCategoryProductsRequest,
  getProductDetailRequest,
  getProductCategoriesRequest
};
