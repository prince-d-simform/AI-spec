import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale, type ThemeMode } from '../../theme';

/**
 * Profile screen styles.
 * @param {ThemeMode} theme - Active theme mode.
 * @returns {StyleSheet} Themed style sheet.
 */
const styleSheet = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    body: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: scale(24)
    },
    card: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.cardBackground,
      borderRadius: scale(24),
      elevation: scale(2),
      paddingHorizontal: scale(24),
      paddingVertical: scale(32),
      rowGap: scale(12),
      shadowColor: Colors[theme]?.cardShadow,
      shadowOffset: { width: 0, height: scale(2) },
      shadowOpacity: 1,
      shadowRadius: scale(8),
      width: '100%'
    },
    iconWrap: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.pastelSky,
      borderRadius: scale(999),
      height: scale(88),
      justifyContent: 'center',
      width: scale(88)
    },
    message: {
      color: Colors[theme]?.gray,
      fontSize: scale(14),
      lineHeight: scale(22),
      textAlign: 'center'
    },
    screen: {
      backgroundColor: Colors[theme]?.screenBackground,
      flex: 1
    },
    title: {
      color: Colors[theme]?.black,
      fontSize: scale(22),
      fontWeight: '700',
      textAlign: 'center'
    }
  });

export default styleSheet;
