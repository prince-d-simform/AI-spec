import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useTheme } from '../../../../hooks';
import { scale } from '../../../../theme';
import { CATEGORY_CHIP_SHIMMER_WIDTHS } from '../../HomeData';
import styleSheet from './CategoryChipShimmerStyles';
import type { CategoryChipShimmerProps } from './CategoryChipShimmerTypes';

/**
 * Animated shimmer placeholders for the category chip row.
 */
const CategoryChipShimmer = memo(
  ({ itemCount = CATEGORY_CHIP_SHIMMER_WIDTHS.length }: CategoryChipShimmerProps) => {
    const { styles } = useTheme(styleSheet);
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animation = Animated.loop(
        Animated.timing(animatedValue, {
          duration: 1100,
          easing: Easing.linear,
          toValue: 1,
          useNativeDriver: true
        })
      );

      animation.start();

      return () => {
        animation.stop();
      };
    }, [animatedValue]);

    const shimmerTranslateX = useMemo(
      () => ({
        transform: [
          {
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [scale(-48), scale(140)]
            })
          }
        ]
      }),
      [animatedValue]
    );

    return (
      <>
        {CATEGORY_CHIP_SHIMMER_WIDTHS.slice(0, itemCount).map((width, index) => (
          <View
            key={`category-chip-shimmer-${width}-${index}`}
            style={[styles.chip, { width: scale(width) }]}
          >
            <Animated.View style={[styles.shimmer, shimmerTranslateX]} />
          </View>
        ))}
      </>
    );
  }
);

CategoryChipShimmer.displayName = 'CategoryChipShimmer';

export default CategoryChipShimmer;
