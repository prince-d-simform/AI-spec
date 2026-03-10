import Ionicons from '@expo/vector-icons/Ionicons';
import React, { type FC, useMemo } from 'react';
import { View } from 'react-native';
import { CustomHeader, Text } from '../../components';
import { Strings } from '../../constants';
import { useTheme } from '../../hooks';
import { Colors, scale } from '../../theme';
import styleSheet from './CartStyles';
import type { CartLandingContent } from './CartTypes';

/**
 * Cart tab landing screen.
 * @returns {React.ReactElement} The rendered Cart tab screen.
 */
const CartScreen: FC = (): React.ReactElement => {
  const { styles, theme } = useTheme(styleSheet);

  const landingContent = useMemo<CartLandingContent>(
    () => ({
      iconName: 'cart-outline',
      message: Strings.Cart.emptyMessage,
      title: Strings.Cart.emptyTitle
    }),
    []
  );

  return (
    <View style={styles.screen}>
      <CustomHeader title={Strings.Cart.screenTitle} />
      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons
              color={Colors[theme]?.primary}
              name={landingContent.iconName}
              size={scale(40)}
            />
          </View>
          <Text style={styles.title}>{landingContent.title}</Text>
          <Text style={styles.message}>{landingContent.message}</Text>
        </View>
      </View>
    </View>
  );
};

export default CartScreen;
CartScreen.displayName = 'CartScreen';
