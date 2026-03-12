import Ionicons from '@expo/vector-icons/Ionicons';
import React, { memo, useCallback } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Spinner, Text } from '../../../../components';
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
const CartItemRow = ({
  item,
  onIncrement,
  onDecrement,
  testID,
  controlHitSlop
}: CartItemRowProps) => {
  const { styles } = useTheme(styleSheet);

  const handleIncrement = useCallback(() => {
    onIncrement(item.productId);
  }, [item.productId, onIncrement]);

  const handleDecrement = useCallback(() => {
    onDecrement(item.productId, item.quantity);
  }, [item.productId, item.quantity, onDecrement]);

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
              {Strings.Cart.discountLabel}: {item.discountValue}
            </Text>
          </View>
        </View>

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

        <View style={styles.controlsRow}>
          <View style={styles.quantityControls}>
            <Pressable
              accessibilityLabel={
                item.quantity <= 1
                  ? Strings.Details.removeFromCartButton
                  : Strings.Details.decreaseQuantityButton
              }
              accessibilityRole="button"
              disabled={item.isMutating}
              hitSlop={controlHitSlop ?? scale(8)}
              style={[styles.controlButton, item.isMutating ? styles.disabledControl : undefined]}
              onPress={handleDecrement}
            >
              <Ionicons
                color={styles.priceText.color}
                name={item.quantity <= 1 ? 'trash-outline' : 'remove'}
                size={scale(18)}
              />
            </Pressable>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <Pressable
              accessibilityLabel={Strings.Details.increaseQuantityButton}
              accessibilityRole="button"
              disabled={item.isMutating}
              hitSlop={controlHitSlop ?? scale(8)}
              style={[styles.controlButton, item.isMutating ? styles.disabledControl : undefined]}
              onPress={handleIncrement}
            >
              {item.isMutating ? (
                <Spinner color={styles.priceText.color} size="small" />
              ) : (
                <Ionicons color={styles.priceText.color} name="add" size={scale(18)} />
              )}
            </Pressable>
          </View>
          <Text style={styles.summaryText}>
            {Strings.Cart.quantityLabel}: {item.quantity}
          </Text>
        </View>
      </View>
    </View>
  );
};

const MemoizedCartItemRow = memo(CartItemRow);
MemoizedCartItemRow.displayName = 'CartItemRow';

export default MemoizedCartItemRow;
