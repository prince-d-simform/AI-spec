import React, { memo } from 'react';
import { Image, View } from 'react-native';
import { Text } from '../../../../components';
import { Strings } from '../../../../constants';
import { useTheme } from '../../../../hooks';
import styleSheet from './CartItemRowStyles';
import type { CartItemRowProps } from './CartItemRowTypes';

/**
 * Cart item row component.
 *
 * @param {CartItemRowProps} props - Row props.
 * @returns {React.ReactElement} Cart row.
 */
const CartItemRow = ({ item, testID }: CartItemRowProps) => {
  const { styles } = useTheme(styleSheet);

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
    </View>
  );
};

const MemoizedCartItemRow = memo(CartItemRow);
MemoizedCartItemRow.displayName = 'CartItemRow';

export default MemoizedCartItemRow;
