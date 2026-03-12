import React, { memo } from 'react';
import { View } from 'react-native';
import { CustomButton, Text } from '../../../../components';
import { Strings } from '../../../../constants';
import { useTheme } from '../../../../hooks';
import styleSheet from './CartSummaryStyles';
import type { CartSummaryProps } from './CartSummaryTypes';

/**
 * Cart summary component.
 *
 * @param {CartSummaryProps} props - Summary props.
 * @returns {React.ReactElement} Summary card.
 */
const CartSummary = ({
  checkoutAction,
  onCheckout,
  rows,
  totalProducts,
  totalQuantity
}: CartSummaryProps) => {
  const { styles } = useTheme(styleSheet);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Strings.Cart.summaryTitle}</Text>

      <View style={styles.overviewRow}>
        <View style={styles.overviewChip}>
          <Text style={styles.overviewText}>
            {Strings.Cart.totalProductsLabel}: {totalProducts}
          </Text>
        </View>
        <View style={styles.overviewChip}>
          <Text style={styles.overviewText}>
            {Strings.Cart.totalQuantityLabel}: {totalQuantity}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {rows.map((row) => {
        const isGrandTotal = row.key === 'grandTotal';

        return (
          <View
            key={row.key}
            style={[styles.summaryRow, isGrandTotal ? styles.grandTotalRow : undefined]}
          >
            <Text style={[styles.summaryLabel, isGrandTotal ? styles.grandTotalLabel : undefined]}>
              {row.label}
            </Text>
            <Text style={[styles.summaryValue, isGrandTotal ? styles.grandTotalValue : undefined]}>
              {row.value}
            </Text>
          </View>
        );
      })}

      {checkoutAction.isVisible ? (
        <View style={styles.checkoutButtonWrap}>
          <CustomButton
            disabled={checkoutAction.isDisabled}
            title={checkoutAction.label}
            onPress={onCheckout}
          />
        </View>
      ) : null}
    </View>
  );
};

const MemoizedCartSummary = memo(CartSummary);
MemoizedCartSummary.displayName = 'CartSummary';

export default MemoizedCartSummary;
