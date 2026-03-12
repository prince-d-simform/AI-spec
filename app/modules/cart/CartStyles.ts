import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale, type ThemeMode } from '../../theme';

/**
 * Cart screen styles.
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
      paddingHorizontal: scale(24),
      rowGap: scale(16)
    },
    errorBanner: {
      backgroundColor: Colors[theme]?.pastelPeach,
      borderRadius: scale(16),
      padding: scale(16),
      rowGap: scale(8)
    },
    errorMessage: {
      color: Colors[theme]?.primary,
      fontSize: scale(13),
      lineHeight: scale(20)
    },
    errorTitle: {
      color: Colors[theme]?.primary,
      fontSize: scale(15),
      fontWeight: '700'
    },
    iconWrap: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.pastelLemon,
      borderRadius: scale(999),
      height: scale(88),
      justifyContent: 'center',
      width: scale(88)
    },
    listContent: {
      paddingBottom: scale(28),
      paddingHorizontal: scale(16),
      paddingTop: scale(10),
      rowGap: scale(16)
    },
    loadingText: {
      color: Colors[theme]?.gray,
      fontSize: scale(14),
      textAlign: 'center'
    },
    message: {
      color: Colors[theme]?.gray,
      fontSize: scale(14),
      lineHeight: scale(22),
      textAlign: 'center'
    },
    recoveryActionWrap: {
      paddingBottom: scale(24),
      paddingHorizontal: scale(16)
    },
    screen: {
      backgroundColor: Colors[theme]?.screenBackground,
      flex: 1
    },
    stateCard: {
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
    title: {
      color: Colors[theme]?.black,
      fontSize: scale(22),
      fontWeight: '700',
      textAlign: 'center'
    }
  });

export default styleSheet;
