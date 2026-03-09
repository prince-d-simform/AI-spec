import { Strings } from '../../constants';
import type { Category } from '../../modules/home';
import type { ErrorResponse } from '../../types';

/**
 * Redux state for catalog-backed product category loading.
 */
export interface ProductsStateType {
  categories: Category[];
  isLoading: boolean;
  error?: ErrorResponse;
  lastUpdated?: number;
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
  categories: DEFAULT_CATEGORIES,
  isLoading: false,
  error: undefined,
  lastUpdated: undefined
};

export default INITIAL_STATE;
