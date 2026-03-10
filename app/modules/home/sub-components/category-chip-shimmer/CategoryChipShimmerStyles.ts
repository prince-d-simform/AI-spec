import { StyleSheet } from 'react-native';
import { Colors, scale, type ThemeMode } from '../../../../theme';

/**
 * Styles for category chip shimmer placeholders.
 */
const styles = (theme: ThemeMode) =>
  StyleSheet.create({
    chip: {
      backgroundColor: Colors[theme]?.imagePlaceholder,
      borderRadius: scale(20),
      height: scale(36),
      marginRight: scale(8),
      overflow: 'hidden'
    },
    shimmer: {
      backgroundColor: Colors[theme]?.white,
      height: '100%',
      opacity: 0.24,
      width: scale(40)
    }
  });

export default styles;
