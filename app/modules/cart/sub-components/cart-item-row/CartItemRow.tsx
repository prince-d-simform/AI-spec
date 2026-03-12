import Ionicons from '@expo/vector-icons/Ionicons';
import React, { memo, useCallback } from 'react';
import { Image, Pressable, View } from 'react-native';
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
const CartItemRow = ({ item, onIncrement, onDecrement, testID }: CartItemRowProps) => {
  const { styles } = useTheme(styleSheet);

  const handleIncrement = useCallback((): void => {
    onIncrement(item.productId);
  }, [item.productId, onIncrement]);

  const handleDecrement = useCallback((): void => {
    onDecrement(item.productId);
  }, [item.productId, onDecrement]);

  return (
    <View style={styles.container} testID={testID}>
      {item.thumbnailUrl ? (
        <Image resizeMode="cover" source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <Text style={styles.summaryText}>{Strings.Details.imageUnavailable}</Text>
        </View>
      )}
      <View style={styles.details}>
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>
              {Strings.Cart.productIdLabel}: {item.productIdValue}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>
              {Strings.Cart.quantityLabel}: {item.quantity}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>
              {Strings.Cart.discountLabel}: {item.discountValue}
            </Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.priceSummaryWrap}>
            <Text style={styles.priceText}>
              {Strings.Cart.unitPriceLabel}: {item.unitPriceValue}
            </Text>
            <Text style={styles.summaryText}>
              {Strings.Cart.lineTotalLabel}: {item.lineTotalValue}
            </Text>
            {item.discountedTotalValue ? (
              <Text style={styles.summaryText}>
                {Strings.Cart.discountedLineTotalLabel}: {item.discountedTotalValue}
              </Text>
            ) : null}
          </View>

          <View style={styles.quantityControlRow}>
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
        </View>
      </View>
    </View>
  );
};

const MemoizedCartItemRow = memo(CartItemRow);
MemoizedCartItemRow.displayName = 'CartItemRow';

export default MemoizedCartItemRow;
