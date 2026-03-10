import React, { useCallback, type FC } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { CustomButton, Text } from '../../components';
import { Strings } from '../../constants';
import { useTheme } from '../../hooks';
import styleSheet from './HomeStyles';
import { CategoryChip } from './sub-components/category-chip';
import { CategoryChipShimmer } from './sub-components/category-chip-shimmer';
import { HomeHeader } from './sub-components/home-header';
import useHome from './useHome';
import type { Category, Product } from './HomeTypes';

/**
 * Home screen — Product Listing.
 *
 * Layout:
 *   SafeAreaView (screenBackground)
 *   └── HomeHeader                    (branded greeting)
 *   └── ScrollView horizontal         (category chip row — sticky)
 *   └── FlatList numColumns={2}       (product grid or empty state)
 *
 * All state and logic delegated to useHome().
 */
const HomeScreen: FC = (): React.ReactElement => {
  const { styles } = useTheme(styleSheet);
  const {
    categories,
    filteredProducts,
    activeCategory,
    isCategoryLoading,
    shouldShowCategoryRetry,
    handleCategoryPress,
    handleRetryCategories,
    renderProductItem,
    keyExtractor
  } = useHome();

  const renderChip = useCallback(
    (category: Category) => (
      <CategoryChip
        category={category}
        isActive={activeCategory === category.slug}
        key={category.slug}
        onPress={handleCategoryPress}
      />
    ),
    [activeCategory, handleCategoryPress]
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{Strings.Home.emptyState}</Text>
      </View>
    ),
    [styles.emptyContainer, styles.emptyText]
  );

  const renderCategoryStatus = useCallback(() => {
    if (!shouldShowCategoryRetry) {
      return null;
    }

    return (
      <View style={styles.categoryStatusContainer}>
        <Text style={styles.categoryStatusText}>{Strings.Home.categoryLoadError}</Text>
        <CustomButton
          enableDebounce={false}
          style={styles.retryButton}
          title={Strings.Home.retryCategories}
          variant="outline"
          onPress={handleRetryCategories}
        />
      </View>
    );
  }, [
    handleRetryCategories,
    shouldShowCategoryRetry,
    styles.categoryStatusContainer,
    styles.categoryStatusText,
    styles.retryButton
  ]);

  return (
    <View style={styles.screen}>
      <HomeHeader />

      <View style={styles.categoryRowContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.chipRow}
          showsHorizontalScrollIndicator={false}
        >
          {isCategoryLoading ? <CategoryChipShimmer /> : categories.map(renderChip)}
        </ScrollView>
      </View>
      {renderCategoryStatus()}
      <FlatList<Product>
        removeClippedSubviews
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.grid}
        data={filteredProducts as Product[]}
        ListEmptyComponent={renderEmptyState}
        numColumns={2}
        windowSize={5}
        keyExtractor={keyExtractor}
        renderItem={renderProductItem}
      />
    </View>
  );
};

export default HomeScreen;
