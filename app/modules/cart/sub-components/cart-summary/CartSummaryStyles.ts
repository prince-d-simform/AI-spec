import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale, type ThemeMode } from '../../../../theme';

/**
 * StyleSheet factory for the cart summary card.
 *
 * @param {ThemeMode} theme - Active theme mode.
 * @returns {ReturnType<typeof StyleSheet.create>} Cart summary styles.
 */
const styleSheet = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    container: {
      backgroundColor: Colors[theme]?.cardBackground,
      borderRadius: scale(20),
      elevation: scale(2),
      padding: scale(16),
      rowGap: scale(14),
      shadowColor: Colors[theme]?.cardShadow,
      shadowOffset: { width: 0, height: scale(2) },
      shadowOpacity: 1,
      shadowRadius: scale(8)
    },
    divider: {
      backgroundColor: Colors[theme]?.chipInactive,
      height: scale(1),
      width: '100%'
    },
    grandTotalLabel: {
      color: Colors[theme]?.black,
      fontSize: scale(15)
    },
    grandTotalRow: {
      marginTop: scale(4)
    },
    grandTotalValue: {
      color: Colors[theme]?.primary,
      fontSize: scale(16)
    },
    overviewChip: {
      backgroundColor: Colors[theme]?.chipInactive,
      borderRadius: scale(999),
      paddingHorizontal: scale(12),
      paddingVertical: scale(8)
    },
    overviewRow: {
      columnGap: scale(12),
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    overviewText: {
      color: Colors[theme]?.gray,
      fontSize: scale(12),
      fontWeight: '600'
    },
    summaryLabel: {
      color: Colors[theme]?.gray,
      fontSize: scale(14),
      fontWeight: '600'
    },
    summaryRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    summaryValue: {
      color: Colors[theme]?.black,
      fontSize: scale(14),
      fontWeight: '700'
    },
    title: {
      color: Colors[theme]?.black,
      fontSize: scale(18),
      fontWeight: '700'
    },
    unavailableValue: {
      color: Colors[theme]?.gray
    }
  });

export default styleSheet;
