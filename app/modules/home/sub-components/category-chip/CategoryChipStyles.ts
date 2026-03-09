import { StyleSheet } from 'react-native';
import { Colors, scale } from '../../../../theme';
import type { ThemeMode } from '../../../../theme';

/**
 * Styles for CategoryChip — pill-shaped filter button.
 * All dimensions via scale(), all colors via Colors[theme].
 */
const styles = (theme: ThemeMode) =>
  StyleSheet.create({
    /** Base pill container */
    chip: {
      alignItems: 'center',
      borderRadius: scale(20),
      justifyContent: 'center',
      marginRight: scale(8),
      paddingHorizontal: scale(16),
      paddingVertical: scale(8)
    },
    /** Active state — filled with primary color */
    chipActive: {
      backgroundColor: Colors[theme]?.primary
    },
    /** Inactive state — muted background */
    chipInactive: {
      backgroundColor: Colors[theme]?.chipInactive
    },
    /** Active chip label — white, bold */
    chipLabelActive: {
      color: Colors[theme]?.white,
      fontWeight: '700'
    },
    /** Inactive chip label — muted text */
    chipLabelInactive: {
      color: Colors[theme]?.chipInactiveText,
      fontWeight: '400'
    }
  });

export default styles;
