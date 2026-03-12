import Ionicons from '@expo/vector-icons/Ionicons';
import React, { type FC, useCallback } from 'react';
import { FlatList, View, type ListRenderItemInfo } from 'react-native';
import { CustomButton, CustomHeader, Spinner, Text } from '../../components';
import { Strings } from '../../constants';
import { useTheme } from '../../hooks';
import { Colors, scale } from '../../theme';
import styleSheet from './CartStyles';
import CartItemRow from './sub-components/cart-item-row';
import CartSummary from './sub-components/cart-summary';
import useCart from './useCart';
import type { CartItemRowViewModel } from './CartTypes';

/**
 * Cart tab landing screen.
 * @returns {React.ReactElement} The rendered Cart tab screen.
 */
const CartScreen: FC = (): React.ReactElement => {
  const { styles, theme } = useTheme(styleSheet);
  const {
    cartItems,
    summaryRows,
    checkoutAction,
    totalProducts,
    totalQuantity,
    isCartLoading,
    hasItems,
    emptyStateContent,
    recoveryContent,
    cartErrorMessage,
    getItemLayout,
    handleRetry,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleCheckout
  } = useCart();

  const renderCenteredState = useCallback(
    (iconName: keyof typeof Ionicons.glyphMap, title: string, message: string) => (
      <View style={styles.body}>
        <View style={styles.stateCard}>
          <View style={styles.iconWrap}>
            <Ionicons color={Colors[theme]?.primary} name={iconName} size={scale(40)} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    ),
    [styles.body, styles.iconWrap, styles.message, styles.stateCard, styles.title, theme]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CartItemRowViewModel>) => (
      <CartItemRow
        item={item}
        onDecrement={handleDecrementCartItem}
        onIncrement={handleIncrementCartItem}
      />
    ),
    [handleDecrementCartItem, handleIncrementCartItem]
  );

  const keyExtractor = useCallback((item: CartItemRowViewModel) => item.productId, []);

  const renderListHeader = useCallback(
    () =>
      cartErrorMessage ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorTitle}>{Strings.Cart.errorTitle}</Text>
          <Text style={styles.errorMessage}>{cartErrorMessage}</Text>
        </View>
      ) : null,
    [cartErrorMessage, styles.errorBanner, styles.errorMessage, styles.errorTitle]
  );

  return (
    <View style={styles.screen}>
      <CustomHeader title={Strings.Cart.screenTitle} />
      {!hasItems && isCartLoading ? (
        <View style={styles.body}>
          <Spinner />
          <Text style={styles.loadingText}>{Strings.Details.loadingMessage}</Text>
        </View>
      ) : null}

      {!hasItems && !isCartLoading && cartErrorMessage
        ? renderCenteredState(
            'alert-circle-outline',
            recoveryContent.title,
            recoveryContent.message
          )
        : null}

      {!hasItems && !isCartLoading && !cartErrorMessage
        ? renderCenteredState(
            emptyStateContent.iconName,
            emptyStateContent.title,
            emptyStateContent.message
          )
        : null}

      {!hasItems && !isCartLoading && cartErrorMessage ? (
        <View style={styles.recoveryActionWrap}>
          <CustomButton title={recoveryContent.actionLabel} onPress={handleRetry} />
        </View>
      ) : null}

      {hasItems ? (
        <FlatList
          removeClippedSubviews
          contentContainerStyle={styles.listContent}
          data={cartItems}
          getItemLayout={getItemLayout}
          initialNumToRender={6}
          keyExtractor={keyExtractor}
          ListFooterComponent={
            <CartSummary
              checkoutAction={checkoutAction}
              rows={summaryRows}
              totalProducts={totalProducts}
              totalQuantity={totalQuantity}
              onCheckout={handleCheckout}
            />
          }
          ListHeaderComponent={renderListHeader}
          maxToRenderPerBatch={8}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          updateCellsBatchingPeriod={100}
          windowSize={8}
        />
      ) : null}
    </View>
  );
};

export default CartScreen;
CartScreen.displayName = 'CartScreen';
