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
    avatarImage: {
      height: '100%',
      width: '100%'
    },
    avatarWrap: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.imagePlaceholder,
      borderRadius: scale(12),
      height: scale(84),
      justifyContent: 'center',
      overflow: 'hidden',
      width: scale(84)
    },
    divider: {
      backgroundColor: Colors[theme]?.chipInactive,
      height: scale(1),
      marginVertical: scale(12)
    },
    errorText: {
      color: Colors[theme]?.error
    },
    formCard: {
      backgroundColor: Colors[theme]?.cardBackground,
      borderRadius: scale(16),
      padding: scale(16),
      rowGap: scale(12),
      shadowColor: Colors[theme]?.cardShadow,
      shadowOffset: { width: 0, height: scale(4) },
      shadowOpacity: 1,
      shadowRadius: scale(10)
    },
    hero: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.cardBackground,
      borderRadius: scale(20),
      columnGap: scale(16),
      flexDirection: 'row',
      padding: scale(16),
      shadowColor: Colors[theme]?.cardShadow,
      shadowOffset: { width: 0, height: scale(4) },
      shadowOpacity: 1,
      shadowRadius: scale(10)
    },
    heroActions: {
      rowGap: scale(8),
      width: '100%'
    },
    heroText: {
      flex: 1,
      rowGap: scale(4)
    },
    hint: {
      color: Colors[theme]?.gray
    },
    infoGrid: {
      rowGap: scale(12)
    },
    inlineRow: {
      alignItems: 'center',
      columnGap: scale(8),
      flexDirection: 'row'
    },
    input: {
      backgroundColor: Colors[theme]?.white,
      borderColor: Colors[theme]?.chipInactive,
      borderRadius: scale(12),
      borderWidth: scale(1),
      color: Colors[theme]?.black,
      paddingHorizontal: scale(12),
      paddingVertical: scale(10)
    },
    label: {
      color: Colors[theme]?.gray,
      marginBottom: scale(6)
    },
    screen: {
      backgroundColor: Colors[theme]?.screenBackground,
      flex: 1
    },
    scrollContent: {
      paddingBottom: scale(40),
      rowGap: scale(16)
    },
    section: {
      paddingHorizontal: scale(20)
    },
    textArea: {
      minHeight: scale(100),
      textAlignVertical: 'top'
    }
  });

export default styleSheet;
