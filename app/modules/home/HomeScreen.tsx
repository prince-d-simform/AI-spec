import React, { useCallback, type FC } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { Text } from '../../components';
import { Strings } from '../../constants';
import { useTheme } from '../../hooks';
import styleSheet from './HomeStyles';
import { CategoryChip } from './sub-components/category-chip';
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
    handleCategoryPress,
    renderProductItem,
    keyExtractor
  } = useHome();

  const renderChip = useCallback(
    (category: Category) => (
      <CategoryChip
        category={category}
        isActive={activeCategory === category.slug}
        key={category.id}
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

  return (
    <View style={styles.screen}>
      <HomeHeader />

      <View>
        <ScrollView
          horizontal
          contentContainerStyle={styles.chipRow}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map(renderChip)}
        </ScrollView>
      </View>
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
