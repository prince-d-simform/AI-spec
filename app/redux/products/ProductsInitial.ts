import { Strings } from '../../constants';
import type { ProductDetail } from '../../modules/details';
import type { Category, Product } from '../../modules/home/HomeTypes';
import type { ErrorResponse } from '../../types';

/**
 * Redux state for catalog-backed product category loading.
 */
export interface ProductsStateType {
  allProducts: Product[];
  categories: Category[];
  productsByCategory: Product[];
  isLoading: boolean;
  isCategoryProductsLoading: boolean;
  isProductDetailLoading: boolean;
  isProductsLoading: boolean;
  isProductsRefreshing: boolean;
  categoryProductsError?: ErrorResponse;
  categoryProductsLastUpdated?: number;
  categoryProductsLimit?: number;
  categoryProductsRequestId?: string;
  categoryProductsSkip?: number;
  categoryProductsTotal?: number;
  productDetailError?: ErrorResponse;
  productDetailLastUpdated?: number;
  productDetailRequestId?: string;
  productDetailUnavailable?: boolean;
  error?: ErrorResponse;
  lastUpdated?: number;
  limit?: number;
  productsError?: ErrorResponse;
  productsLastUpdated?: number;
  selectedCategorySlug?: string;
  selectedProductDetail?: ProductDetail;
  selectedProductId?: string;
  skip?: number;
  total?: number;
}

/**
 * Synthetic All category that keeps the Home screen usable under empty/failure states.
 */
export const DEFAULT_ALL_CATEGORY: Category = {
  name: Strings.Home.categoryAll,
  slug: 'all'
};

/**
 * Default fallback category list.
 */
export const DEFAULT_CATEGORIES: Category[] = [DEFAULT_ALL_CATEGORY];

/**
 * Initial Redux state for products category loading.
 */
const INITIAL_STATE: ProductsStateType = {
  allProducts: [],
  categories: DEFAULT_CATEGORIES,
  productsByCategory: [],
  isLoading: false,
  isCategoryProductsLoading: false,
  isProductDetailLoading: false,
  isProductsLoading: false,
  isProductsRefreshing: false,
  categoryProductsError: undefined,
  categoryProductsLastUpdated: undefined,
  categoryProductsLimit: undefined,
  categoryProductsRequestId: undefined,
  categoryProductsSkip: undefined,
  categoryProductsTotal: undefined,
  productDetailError: undefined,
  productDetailLastUpdated: undefined,
  productDetailRequestId: undefined,
  productDetailUnavailable: false,
  error: undefined,
  lastUpdated: undefined,
  limit: undefined,
  productsError: undefined,
  productsLastUpdated: undefined,
  selectedCategorySlug: undefined,
  selectedProductDetail: undefined,
  selectedProductId: undefined,
  skip: undefined,
  total: undefined
};

export default INITIAL_STATE;
