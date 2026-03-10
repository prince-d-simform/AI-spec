import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { APIDispatch } from '../../configs';
import { ProductsActions, ProductsSelectors } from '../../redux/products';
import { useAppDispatch, useAppSelector } from '../../redux/useRedux';
import { ProductCard } from './sub-components/product-card';
import type { Category, Product } from './HomeTypes';
import type { ProductCategoryResponse } from '../../types/ProductCategoryResponse';
import type {
  RemoteCategoryProductsResponse,
  RemoteProductsResponse
} from '../../types/ProductListResponse';

/**
 * Return type for the useHome hook.
 */
export interface UseHomeReturn {
  /** Full CATEGORIES list (including 'All' chip) */
  categories: readonly Category[];
  /** Whether at least one product is currently available for browsing. */
  hasProducts: boolean;
  /** Products filtered by activeCategory — memoised */
  filteredProducts: readonly Product[];
  /** Currently selected category slug, default 'all' */
  activeCategory: string;
  /** Empty-state copy based on the active filter. */
  emptyStateMessage: string;
  /** Remote category loading state. */
  isCategoryLoading: boolean;
  /** Initial product-loading state. */
  isProductsLoading: boolean;
  /** Pull-to-refresh loading state. */
  isProductsRefreshing: boolean;
  /** Selected-category loading state. */
  isCategoryProductsLoading: boolean;
  /** Whether retry/error UI should be shown for category loading. */
  shouldShowCategoryRetry: boolean;
  /** Whether a blocking retry should be shown for the first product load failure. */
  shouldShowProductRetry: boolean;
  /** Whether a blocking retry should be shown for selected-category failure. */
  shouldShowCategoryProductsRetry: boolean;
  /** Whether non-blocking refresh failure feedback should be shown. */
  shouldShowRefreshError: boolean;
  /** Stable callback — sets the active category slug */
  handleCategoryPress: (slug: string) => void;
  /** Stable callback — retries product loading */
  handleRetryProducts: () => void;
  /** Stable callback — retries selected-category loading. */
  handleRetryCategoryProducts: () => void;
  /** Stable callback — refreshes the product catalog */
  handleRefreshProducts: () => void;
  /** Stable callback — retries category loading */
  handleRetryCategories: () => void;
  /** Stable renderItem function for FlatList */
  renderProductItem: ({ item }: { item: Product }) => React.ReactElement;
  /** Stable keyExtractor function for FlatList */
  keyExtractor: (item: Product) => string;
}

/**
 * Screen-level hook for HomeScreen.
 *
 * Holds the active category filter state and consumes Redux-backed category
 * data, loading, and failure state for the Home screen.
 */
const useHome = (): UseHomeReturn => {
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const refCategoriesDispatch = useRef<APIDispatch<ProductCategoryResponse> | null>(null);
  const refCategoryProductsDispatch = useRef<APIDispatch<RemoteCategoryProductsResponse> | null>(
    null
  );
  const refProductsDispatch = useRef<APIDispatch<RemoteProductsResponse> | null>(null);

  const allProducts = useAppSelector(ProductsSelectors.getAllProducts);
  const categories = useAppSelector(ProductsSelectors.getCategories);
  const productsByCategory = useAppSelector(ProductsSelectors.getProductsByCategory);
  const isCategoryLoading = useAppSelector(ProductsSelectors.getLoading);
  const isCategoryProductsLoading = useAppSelector(ProductsSelectors.getCategoryProductsLoading);
  const isProductsLoading = useAppSelector(ProductsSelectors.getProductsLoading);
  const isProductsRefreshing = useAppSelector(ProductsSelectors.getProductsRefreshing);
  const categoryError = useAppSelector(ProductsSelectors.getError);
  const categoryProductsError = useAppSelector(ProductsSelectors.getCategoryProductsError);
  const productsError = useAppSelector(ProductsSelectors.getProductsError);
  const productsLastUpdated = useAppSelector(ProductsSelectors.getProductsLastUpdated);

  const handleFetchCategories = useCallback((): void => {
    refCategoriesDispatch.current?.abort();
    refCategoriesDispatch.current = dispatch(
      ProductsActions.getProductCategoriesRequest({ shouldShowToast: false })
    );
  }, [dispatch]);

  const handleFetchProducts = useCallback((): void => {
    refProductsDispatch.current?.abort();
    refProductsDispatch.current = dispatch(
      ProductsActions.getAllProductsRequest({ params: { limit: 0 }, shouldShowToast: false })
    );
  }, [dispatch]);

  const handleFetchCategoryProducts = useCallback(
    (slug: string): void => {
      if (!slug || slug === 'all') {
        dispatch(ProductsActions.clearCategoryProductsState());
        refCategoryProductsDispatch.current?.abort();
        return;
      }

      refCategoryProductsDispatch.current?.abort();
      refCategoryProductsDispatch.current = dispatch(
        ProductsActions.getCategoryProductsRequest({
          paths: { slug },
          shouldShowToast: false
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    handleFetchCategories();

    if (!productsLastUpdated && allProducts.length === 0) {
      handleFetchProducts();
    }

    return () => {
      refCategoriesDispatch.current?.abort();
      refCategoryProductsDispatch.current?.abort();
      refProductsDispatch.current?.abort();
    };
  }, [allProducts.length, handleFetchCategories, handleFetchProducts, productsLastUpdated]);

  useEffect(() => {
    const hasActiveCategory = categories.some((category) => category.slug === activeCategory);

    if (!hasActiveCategory) {
      dispatch(ProductsActions.clearCategoryProductsState());
      refCategoryProductsDispatch.current?.abort();
      setActiveCategory('all');
    }
  }, [activeCategory, categories, dispatch]);

  const filteredProducts = useMemo<readonly Product[]>(
    () => (activeCategory === 'all' ? allProducts : productsByCategory),
    [activeCategory, allProducts, productsByCategory]
  );

  const emptyStateMessage = useMemo<string>(
    () => (activeCategory === 'all' ? 'ALL_EMPTY' : 'CATEGORY_EMPTY'),
    [activeCategory]
  );

  const handleCategoryPress = useCallback(
    (slug: string): void => {
      setActiveCategory(slug);

      if (slug === 'all') {
        dispatch(ProductsActions.clearCategoryProductsState());
        refCategoryProductsDispatch.current?.abort();
        return;
      }

      handleFetchCategoryProducts(slug);
    },
    [dispatch, handleFetchCategoryProducts]
  );

  const handleRetryProducts = useCallback((): void => {
    handleFetchProducts();
  }, [handleFetchProducts]);

  const handleRetryCategoryProducts = useCallback((): void => {
    if (activeCategory === 'all') {
      return;
    }

    handleFetchCategoryProducts(activeCategory);
  }, [activeCategory, handleFetchCategoryProducts]);

  const handleRefreshProducts = useCallback((): void => {
    if (isProductsLoading || isProductsRefreshing) {
      return;
    }

    handleFetchProducts();
  }, [handleFetchProducts, isProductsLoading, isProductsRefreshing]);

  const handleRetryCategories = useCallback((): void => {
    handleFetchCategories();
  }, [handleFetchCategories]);

  const shouldShowCategoryRetry = useMemo<boolean>(
    () => !isCategoryLoading && !!categoryError,
    [categoryError, isCategoryLoading]
  );

  const shouldShowProductRetry = useMemo<boolean>(
    () =>
      !isProductsLoading && !isProductsRefreshing && !!productsError && allProducts.length === 0,
    [allProducts.length, isProductsLoading, isProductsRefreshing, productsError]
  );

  const shouldShowCategoryProductsRetry = useMemo<boolean>(
    () =>
      activeCategory !== 'all' &&
      !isCategoryProductsLoading &&
      !!categoryProductsError &&
      productsByCategory.length === 0,
    [activeCategory, categoryProductsError, isCategoryProductsLoading, productsByCategory.length]
  );

  const shouldShowRefreshError = useMemo<boolean>(
    () => !isProductsRefreshing && !!productsError && allProducts.length > 0,
    [allProducts.length, isProductsRefreshing, productsError]
  );

  const renderProductItem = useCallback(
    ({ item }: { item: Product }): React.ReactElement => <ProductCard product={item} />,
    []
  );

  const keyExtractor = useCallback((item: Product): string => item.id, []);

  return {
    categories,
    hasProducts: filteredProducts.length > 0,
    filteredProducts,
    activeCategory,
    emptyStateMessage,
    isCategoryLoading,
    isCategoryProductsLoading,
    isProductsLoading,
    isProductsRefreshing,
    shouldShowCategoryRetry,
    shouldShowCategoryProductsRetry,
    shouldShowProductRetry,
    shouldShowRefreshError,
    handleCategoryPress,
    handleRefreshProducts,
    handleRetryCategories,
    handleRetryCategoryProducts,
    handleRetryProducts,
    renderProductItem,
    keyExtractor
  };
};

export default useHome;
