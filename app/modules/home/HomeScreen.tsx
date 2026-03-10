import React, { useCallback, type FC } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { CustomButton, Spinner, Text } from '../../components';
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
    emptyStateMessage,
    hasProducts,
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
    handleRetryCategoryProducts,
    handleRetryCategories,
    handleRetryProducts,
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
        <Text style={styles.emptyText}>
          {emptyStateMessage === 'ALL_EMPTY' ? Strings.Home.emptyStateAll : Strings.Home.emptyState}
        </Text>
      </View>
    ),
    [emptyStateMessage, styles.emptyContainer, styles.emptyText]
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

  const renderProductsLoadingState = useCallback(() => {
    if (activeCategory !== 'all' || !isProductsLoading || hasProducts) {
      return null;
    }

    return (
      <View style={styles.feedbackContainer}>
        <Spinner />
        <Text style={styles.feedbackText}>{Strings.Home.productLoading}</Text>
      </View>
    );
  }, [
    activeCategory,
    hasProducts,
    isProductsLoading,
    styles.feedbackContainer,
    styles.feedbackText
  ]);

  const renderCategoryProductsLoadingState = useCallback(() => {
    if (activeCategory === 'all' || !isCategoryProductsLoading) {
      return null;
    }

    return (
      <View style={styles.feedbackContainer}>
        <Spinner />
        <Text style={styles.feedbackText}>{Strings.Home.categoryProductsLoading}</Text>
      </View>
    );
  }, [activeCategory, isCategoryProductsLoading, styles.feedbackContainer, styles.feedbackText]);

  const renderProductRetryState = useCallback(() => {
    if (activeCategory !== 'all' || !shouldShowProductRetry) {
      return null;
    }

    return (
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackText}>{Strings.Home.productLoadError}</Text>
        <CustomButton
          enableDebounce={false}
          style={styles.retryButton}
          title={Strings.Home.retryProducts}
          variant="outline"
          onPress={handleRetryProducts}
        />
      </View>
    );
  }, [
    activeCategory,
    handleRetryProducts,
    shouldShowProductRetry,
    styles.feedbackContainer,
    styles.feedbackText,
    styles.retryButton
  ]);

  const renderCategoryProductRetryState = useCallback(() => {
    if (activeCategory === 'all' || !shouldShowCategoryProductsRetry) {
      return null;
    }

    return (
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackText}>{Strings.Home.categoryProductsLoadError}</Text>
        <CustomButton
          enableDebounce={false}
          style={styles.retryButton}
          title={Strings.Home.retryCategoryProducts}
          variant="outline"
          onPress={handleRetryCategoryProducts}
        />
      </View>
    );
  }, [
    activeCategory,
    handleRetryCategoryProducts,
    shouldShowCategoryProductsRetry,
    styles.feedbackContainer,
    styles.feedbackText,
    styles.retryButton
  ]);

  const renderProductStatus = useCallback(() => {
    if (!shouldShowRefreshError) {
      return null;
    }

    return (
      <View style={styles.productStatusContainer}>
        <Text style={styles.productStatusText}>{Strings.Home.productRefreshError}</Text>
      </View>
    );
  }, [shouldShowRefreshError, styles.productStatusContainer, styles.productStatusText]);

  const productFeedback =
    renderCategoryProductsLoadingState() ||
    renderCategoryProductRetryState() ||
    renderProductsLoadingState() ||
    renderProductRetryState();

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
      {renderProductStatus()}
      {productFeedback || (
        <FlatList<Product>
          removeClippedSubviews
          columnWrapperStyle={filteredProducts.length > 0 ? styles.columnWrapper : undefined}
          contentContainerStyle={[
            styles.grid,
            filteredProducts.length === 0 ? styles.gridEmptyContent : undefined
          ]}
          data={filteredProducts}
          ListEmptyComponent={renderEmptyState}
          numColumns={2}
          windowSize={5}
          keyExtractor={keyExtractor}
          refreshing={activeCategory === 'all' ? isProductsRefreshing : false}
          renderItem={renderProductItem}
          onRefresh={activeCategory === 'all' ? handleRefreshProducts : undefined}
        />
      )}
    </View>
  );
};

export default HomeScreen;
