import type { ProductsStateType } from './ProductsInitial';
import type { Category, Product } from '../../modules/home/HomeTypes';
import type { ErrorResponse } from '../../types';
import type { RootStateType } from '../Store';

/**
 * Selectors for the products slice.
 */
interface ProductsSelectorsType {
  getProducts: (state: RootStateType) => ProductsStateType;
  getCategories: (state: RootStateType) => Category[];
  getLoading: (state: RootStateType) => boolean;
  getAllProducts: (state: RootStateType) => Product[];
  getError: (state: RootStateType) => ErrorResponse | undefined;
  getProductsError: (state: RootStateType) => ErrorResponse | undefined;
  getProductsLastUpdated: (state: RootStateType) => number | undefined;
  getProductsLoading: (state: RootStateType) => boolean;
  getProductsRefreshing: (state: RootStateType) => boolean;
}

/**
 * Safely resolves the products slice from the persisted root state.
 *
 * @param {RootStateType} state - The Redux root state.
 * @returns {ProductsStateType} The products slice state.
 */
const getProductsState = (state: RootStateType): ProductsStateType =>
  (state as RootStateType & { products: ProductsStateType }).products;

/**
 * Centralized selectors for product category state.
 */
const ProductsSelectors: ProductsSelectorsType = {
  getProducts: (state: RootStateType): ProductsStateType => getProductsState(state),
  getAllProducts: (state: RootStateType): Product[] => getProductsState(state).allProducts,
  getCategories: (state: RootStateType): Category[] => getProductsState(state).categories,
  getLoading: (state: RootStateType): boolean => getProductsState(state).isLoading,
  getError: (state: RootStateType): ErrorResponse | undefined => getProductsState(state).error,
  getProductsError: (state: RootStateType): ErrorResponse | undefined =>
    getProductsState(state).productsError,
  getProductsLastUpdated: (state: RootStateType): number | undefined =>
    getProductsState(state).productsLastUpdated,
  getProductsLoading: (state: RootStateType): boolean => getProductsState(state).isProductsLoading,
  getProductsRefreshing: (state: RootStateType): boolean =>
    getProductsState(state).isProductsRefreshing
};

export default ProductsSelectors;
