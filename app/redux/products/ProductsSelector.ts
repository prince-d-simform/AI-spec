import type { ProductsStateType } from './ProductsInitial';
import type { Category } from '../../modules/home';
import type { ErrorResponse } from '../../types';
import type { RootStateType } from '../Store';

/**
 * Selectors for the products slice.
 */
interface ProductsSelectorsType {
  getProducts: (state: RootStateType) => ProductsStateType;
  getCategories: (state: RootStateType) => Category[];
  getLoading: (state: RootStateType) => boolean;
  getError: (state: RootStateType) => ErrorResponse | undefined;
}

/**
 * Centralized selectors for product category state.
 */
const ProductsSelectors: ProductsSelectorsType = {
  getProducts: (state: RootStateType): ProductsStateType => state.products,
  getCategories: (state: RootStateType): Category[] => state.products.categories,
  getLoading: (state: RootStateType): boolean => state.products.isLoading,
  getError: (state: RootStateType): ErrorResponse | undefined => state.products.error
};

export default ProductsSelectors;
