import React, { memo, useCallback, useState } from 'react';
import { Image, View } from 'react-native';
import { Text } from '../../../../components';
import { Strings } from '../../../../constants';
import { useTheme } from '../../../../hooks';
import styleSheet from './ProductCardStyles';
import type { ProductCardProps } from './ProductCardTypes';

/**
 * A single product card for the two-column grid.
 *
 * Layout (top → bottom):
 *   Image (2:3 aspect, cover) | placeholder on error
 *   Title (2 lines max, ellipsis)
 *   Price ($XX.XX, primary bold)
 *   ★ Rating (gold star + numeric value)
 *
 * Wrapped in React.memo — only re-renders when product prop changes.
 */
const ProductCard = memo(({ product }: ProductCardProps): React.ReactElement => {
  const { styles } = useTheme(styleSheet);
  const [imageError, setImageError] = useState(false);
  const shouldShowImagePlaceholder = imageError || !product.imageUrl.trim();

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <View style={styles.card}>
      {shouldShowImagePlaceholder ? (
        <View style={styles.imagePlaceholder} />
      ) : (
        <Image
          resizeMode="cover"
          source={{ uri: product.imageUrl }}
          style={styles.image}
          onError={handleImageError}
        />
      )}

      <View style={styles.info}>
        <Text ellipsizeMode="tail" numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>

        <Text style={styles.price}>
          {Strings.Home.pricePrefix}
          {product.price.toFixed(2)}
        </Text>

        <View style={styles.ratingRow}>
          <Text style={styles.starIcon}>{'★'}</Text>
          <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
