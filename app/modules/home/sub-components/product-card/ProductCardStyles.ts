import { StyleSheet } from 'react-native';
import { Colors, scale } from '../../../../theme';
import type { ThemeMode } from '../../../../theme';

/**
 * Styles for ProductCard — elevated two-column grid card.
 * All dimensions via scale(), all colors via Colors[theme].
 */
const styles = (theme: ThemeMode) =>
  StyleSheet.create({
    /** Card container */
    card: {
      backgroundColor: Colors[theme]?.cardBackground,
      borderRadius: scale(12),
      // Android elevation
      elevation: 4,
      flex: 1,
      margin: scale(6),
      overflow: 'hidden',
      // iOS shadow
      shadowColor: Colors[theme]?.cardShadow,
      shadowOffset: { width: 0, height: scale(2) },
      shadowOpacity: 1,
      shadowRadius: scale(8)
    },
    /** Product image — 2:3 portrait aspect ratio */
    image: {
      aspectRatio: 2 / 3,
      width: '100%'
    },
    /** Placeholder rendered when image fails to load */
    imagePlaceholder: {
      aspectRatio: 2 / 3,
      backgroundColor: Colors[theme]?.imagePlaceholder,
      width: '100%'
    },
    /** Content area below the image */
    info: {
      padding: scale(10)
    },
    /** Price label — bold, primary color */
    price: {
      color: Colors[theme]?.primary,
      fontSize: scale(14),
      fontWeight: '700',
      marginTop: scale(4)
    },
    /** Row containing star icon + rating value */
    ratingRow: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: scale(4)
    },
    /** Numeric rating text */
    ratingText: {
      color: Colors[theme]?.gray,
      fontSize: scale(12),
      fontWeight: '500',
      marginLeft: scale(4)
    },
    /** Star icon (★ Unicode) */
    starIcon: {
      color: Colors[theme]?.ratingGold,
      fontSize: scale(12)
    },
    /** Product title — two-line max with ellipsis */
    title: {
      color: Colors[theme]?.black,
      fontSize: scale(13),
      fontWeight: '500',
      lineHeight: scale(18)
    }
  });

export default styles;
