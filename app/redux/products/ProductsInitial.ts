import { Strings } from '../../constants';
import type { Category, Product } from '../../modules/home/HomeTypes';
import type { ErrorResponse } from '../../types';

/**
 * Redux state for catalog-backed product category loading.
 */
export interface ProductsStateType {
  allProducts: Product[];
  categories: Category[];
  isLoading: boolean;
  isProductsLoading: boolean;
  isProductsRefreshing: boolean;
  error?: ErrorResponse;
  lastUpdated?: number;
  limit?: number;
  productsError?: ErrorResponse;
  productsLastUpdated?: number;
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
  isLoading: false,
  isProductsLoading: false,
  isProductsRefreshing: false,
  error: undefined,
  lastUpdated: undefined,
  limit: undefined,
  productsError: undefined,
  productsLastUpdated: undefined,
  skip: undefined,
  total: undefined
};

export default INITIAL_STATE;
