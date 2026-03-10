import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { APIDispatch } from '../../configs';
import { ProductsActions, ProductsSelectors, useAppDispatch, useAppSelector } from '../../redux';
import { PRODUCTS } from './HomeData';
import { ProductCard } from './sub-components/product-card';
import type { Category, Product } from './HomeTypes';
import type { ProductCategoryResponse } from '../../types/ProductCategoryResponse';

/**
 * Return type for the useHome hook.
 */
export interface UseHomeReturn {
  /** Full CATEGORIES list (including 'All' chip) */
  categories: readonly Category[];
  /** Products filtered by activeCategory — memoised */
  filteredProducts: readonly Product[];
  /** Currently selected category slug, default 'all' */
  activeCategory: string;
  /** Remote category loading state. */
  isCategoryLoading: boolean;
  /** Whether retry/error UI should be shown for category loading. */
  shouldShowCategoryRetry: boolean;
  /** Stable callback — sets the active category slug */
  handleCategoryPress: (slug: string) => void;
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

  const categories = useAppSelector(ProductsSelectors.getCategories);
  const isCategoryLoading = useAppSelector(ProductsSelectors.getLoading);
  const categoryError = useAppSelector(ProductsSelectors.getError);

  const handleFetchCategories = useCallback((): void => {
    refCategoriesDispatch.current?.abort();
    refCategoriesDispatch.current = dispatch(
      ProductsActions.getProductCategoriesRequest({ shouldShowToast: false })
    );
  }, [dispatch]);

  useEffect(() => {
    handleFetchCategories();

    return () => {
      refCategoriesDispatch.current?.abort();
    };
  }, [handleFetchCategories]);

  useEffect(() => {
    const hasActiveCategory = categories.some((category) => category.slug === activeCategory);

    if (!hasActiveCategory) {
      setActiveCategory('all');
    }
  }, [activeCategory, categories]);

  const filteredProducts = useMemo<readonly Product[]>(
    () =>
      activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const handleCategoryPress = useCallback((slug: string): void => {
    setActiveCategory(slug);
  }, []);

  const handleRetryCategories = useCallback((): void => {
    handleFetchCategories();
  }, [handleFetchCategories]);

  const shouldShowCategoryRetry = useMemo<boolean>(
    () => !isCategoryLoading && !!categoryError,
    [categoryError, isCategoryLoading]
  );

  const renderProductItem = useCallback(
    ({ item }: { item: Product }): React.ReactElement => <ProductCard product={item} />,
    []
  );

  const keyExtractor = useCallback((item: Product): string => item.id, []);

  return {
    categories,
    filteredProducts,
    activeCategory,
    isCategoryLoading,
    shouldShowCategoryRetry,
    handleCategoryPress,
    handleRetryCategories,
    renderProductItem,
    keyExtractor
  };
};

export default useHome;
