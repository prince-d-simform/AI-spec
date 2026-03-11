import { StyleSheet } from 'react-native';
import { Colors, scale } from '../../../../theme';
import type { ThemeMode } from '../../../../theme';

export const HOME_HEADER_BASE_PADDING_TOP = scale(16);

/**
 * Styles for the HomeHeader — branded greeting row.
 * All dimensions via scale(), all colors via Colors[theme].
 */
const styles = (theme: ThemeMode) =>
  StyleSheet.create({
    /** Outer container — provides screen-edge padding */
    container: {
      paddingBottom: scale(12),
      paddingHorizontal: scale(16)
    },
    /** Subtitle — smaller, muted color */
    subtitle: {
      color: Colors[theme]?.headerSubtitle,
      fontSize: scale(13),
      fontWeight: '400',
      marginTop: scale(4)
    },
    /** Primary heading — bold, prominent */
    title: {
      color: Colors[theme]?.black,
      fontSize: scale(24),
      fontWeight: '700'
    }
  });

export default styles;
