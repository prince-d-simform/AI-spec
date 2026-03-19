import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale, type ThemeMode } from '../../../theme';

/**
 *
 * @param theme
 * @returns
 */
const styleSheet = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    container: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.cardBackground,
      borderRadius: scale(16),
      columnGap: scale(12),
      flexDirection: 'row',
      paddingHorizontal: scale(16),
      paddingVertical: scale(12)
    },
    iconWrap: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.pastelSky,
      borderRadius: scale(12),
      height: scale(40),
      justifyContent: 'center',
      width: scale(40)
    },
    label: {
      color: Colors[theme]?.gray,
      marginBottom: scale(2)
    },
    placeholder: {
      color: Colors[theme]?.gray,
      flexShrink: 1
    },
    value: {
      color: Colors[theme]?.black,
      flexShrink: 1
    },
    wrapper: { flex: 1 }
  });

export default styleSheet;
