import Ionicons from '@expo/vector-icons/Ionicons';
import React, { memo, useCallback } from 'react';
import { Image, Pressable, View, type GestureResponderEvent } from 'react-native';
import { Text } from '../../../../components';
import { Strings } from '../../../../constants';
import { useTheme } from '../../../../hooks';
import { scale } from '../../../../theme';
import styleSheet from './CartItemRowStyles';
import type { CartItemRowProps } from './CartItemRowTypes';

/**
 * Cart item row component.
 *
 * @param {CartItemRowProps} props - Row props.
 * @returns {React.ReactElement} Cart row.
 */
const CartItemRow = ({ item, onIncrement, onDecrement, onPressItem, testID }: CartItemRowProps) => {
  const { styles } = useTheme(styleSheet);

  const handleIncrement = useCallback(
    (event: GestureResponderEvent): void => {
      event.stopPropagation();
      onIncrement(item.productId);
    },
    [item.productId, onIncrement]
  );

  const handleDecrement = useCallback(
    (event: GestureResponderEvent): void => {
      event.stopPropagation();
      onDecrement(item.productId);
    },
    [item.productId, onDecrement]
  );

  const handlePressItem = useCallback((): void => {
    if (!item.canNavigate) {
      return;
    }

    onPressItem(item.productId);
  }, [item.canNavigate, item.productId, onPressItem]);

  return (
    <Pressable
      accessibilityLabel={item.accessibilityLabel}
      accessibilityRole="button"
      disabled={!item.canNavigate}
      style={styles.container}
      testID={testID}
      onPress={handlePressItem}
    >
      <View style={styles.contentColumn}>
        <View style={styles.topRow}>
          {item.imageState === 'remote' && item.thumbnailUrl ? (
            <Image
              resizeMode="cover"
              source={{ uri: item.thumbnailUrl }}
              style={styles.thumbnail}
            />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Text numberOfLines={2} style={styles.thumbnailPlaceholderText}>
                {Strings.Details.imageUnavailable}
              </Text>
            </View>
          )}

          <View style={styles.primaryDetailsPanel}>
            <Text numberOfLines={2} style={styles.title}>
              {item.title}
            </Text>
            <Text style={styles.primaryPriceLabel}>{item.primaryPriceLabel}</Text>
            <Text style={styles.primaryPriceValue}>{item.primaryPriceValue}</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.quantityPanel}>
            <Pressable
              accessibilityLabel={
                item.decrementAction === 'delete'
                  ? Strings.Cart.deleteQuantityAccessibility
                  : Strings.Cart.decrementQuantityAccessibility
              }
              accessibilityRole="button"
              disabled={item.isDisabled}
              hitSlop={scale(8)}
              style={[
                styles.quantityActionButton,
                item.decrementAction === 'delete' ? styles.quantityActionButtonDanger : undefined,
                item.isDisabled ? styles.quantityActionButtonDisabled : undefined
              ]}
              onPress={handleDecrement}
            >
              <Ionicons
                color={
                  item.decrementAction === 'delete'
                    ? styles.quantityActionIconDanger.color
                    : styles.quantityActionIcon.color
                }
                name={item.decrementAction === 'delete' ? 'trash-outline' : 'remove'}
                size={scale(18)}
              />
            </Pressable>

            <View style={styles.quantityValueWrap}>
              <Text style={styles.quantityValue}>{item.quantity}</Text>
              <Text style={styles.quantityValueLabel}>{Strings.Cart.quantityLabel}</Text>
            </View>

            <Pressable
              accessibilityLabel={Strings.Cart.incrementQuantityAccessibility}
              accessibilityRole="button"
              disabled={item.isDisabled}
              hitSlop={scale(8)}
              style={[
                styles.quantityActionButton,
                item.isDisabled ? styles.quantityActionButtonDisabled : undefined
              ]}
              onPress={handleIncrement}
            >
              <Ionicons color={styles.quantityActionIcon.color} name="add" size={scale(18)} />
            </Pressable>
          </View>

          <View style={styles.pricingPanel}>
            <Text style={styles.secondaryDetailText}>
              {Strings.Cart.unitPriceLabel}: {item.unitPriceValue}
            </Text>
            <Text style={styles.secondaryDetailText}>
              {Strings.Cart.lineTotalLabel}: {item.lineTotalValue}
            </Text>
            <Text style={styles.secondaryDetailText}>
              {Strings.Cart.discountLabel}: {item.discountValue ?? Strings.Cart.unavailableValue}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const MemoizedCartItemRow = memo(CartItemRow);
MemoizedCartItemRow.displayName = 'CartItemRow';

export default MemoizedCartItemRow;
