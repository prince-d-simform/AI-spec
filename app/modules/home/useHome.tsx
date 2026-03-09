import React, { useCallback, useMemo, useState } from 'react';
import { CATEGORIES, PRODUCTS } from './HomeData';
import { ProductCard } from './sub-components/product-card';
import type { ActiveCategoryFilter, Category, Product } from './HomeTypes';

/**
 * Return type for the useHome hook.
 */
export interface UseHomeReturn {
  /** Full CATEGORIES list (including 'All' chip) */
  categories: readonly Category[];
  /** Products filtered by activeCategory — memoised */
  filteredProducts: readonly Product[];
  /** Currently selected category slug, default 'all' */
  activeCategory: ActiveCategoryFilter;
  /** Stable callback — sets the active category slug */
  handleCategoryPress: (slug: string) => void;
  /** Stable renderItem function for FlatList */
  renderProductItem: ({ item }: { item: Product }) => React.ReactElement;
  /** Stable keyExtractor function for FlatList */
  keyExtractor: (item: Product) => string;
}

/**
 * Screen-level hook for HomeScreen.
 *
 * Holds the active category filter state and derives all data/callbacks
 * needed by the screen. No Redux — state is purely local UI state.
 */
const useHome = (): UseHomeReturn => {
  const [activeCategory, setActiveCategory] = useState<ActiveCategoryFilter>('all');

  const filteredProducts = useMemo<readonly Product[]>(
    () =>
      activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const handleCategoryPress = useCallback((slug: string): void => {
    setActiveCategory(slug);
  }, []);

  const renderProductItem = useCallback(
    ({ item }: { item: Product }): React.ReactElement => <ProductCard product={item} />,
    []
  );

  const keyExtractor = useCallback((item: Product): string => item.id, []);

  return {
    categories: CATEGORIES,
    filteredProducts,
    activeCategory,
    handleCategoryPress,
    renderProductItem,
    keyExtractor
  };
};

export default useHome;
