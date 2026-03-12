import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale, type ThemeMode } from '../../../../theme';

/**
 * StyleSheet factory for one cart item row.
 *
 * @param {ThemeMode} theme - Active theme mode.
 * @returns {ReturnType<typeof StyleSheet.create>} Cart row styles.
 */
const styleSheet = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    bottomRow: {
      columnGap: scale(12),
      flexDirection: 'row'
    },
    container: {
      backgroundColor: Colors[theme]?.cardBackground,
      borderRadius: scale(20),
      elevation: scale(2),
      padding: scale(16),
      rowGap: scale(12),
      shadowColor: Colors[theme]?.cardShadow,
      shadowOffset: { width: 0, height: scale(2) },
      shadowOpacity: 1,
      shadowRadius: scale(8)
    },
    contentColumn: {
      rowGap: scale(12)
    },
    pricingPanel: {
      backgroundColor: Colors[theme]?.screenBackground,
      borderRadius: scale(16),
      flex: 1,
      justifyContent: 'center',
      minHeight: scale(104),
      paddingHorizontal: scale(12),
      paddingVertical: scale(10),
      rowGap: scale(6)
    },
    primaryDetailsPanel: {
      backgroundColor: Colors[theme]?.screenBackground,
      borderRadius: scale(16),
      flex: 1,
      justifyContent: 'center',
      minHeight: scale(112),
      paddingHorizontal: scale(12),
      paddingVertical: scale(10),
      rowGap: scale(4)
    },
    primaryPriceLabel: {
      color: Colors[theme]?.gray,
      fontSize: scale(13),
      fontWeight: '600'
    },
    primaryPriceValue: {
      color: Colors[theme]?.black,
      fontSize: scale(20),
      fontWeight: '700',
      lineHeight: scale(26)
    },
    quantityActionButton: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.secondary,
      borderRadius: scale(999),
      height: scale(34),
      justifyContent: 'center',
      width: scale(34)
    },
    quantityActionButtonDanger: {
      backgroundColor: Colors[theme]?.pastelPeach
    },
    quantityActionButtonDisabled: {
      opacity: 0.5
    },
    quantityActionIcon: {
      color: Colors[theme]?.primary
    },
    quantityActionIconDanger: {
      color: Colors[theme]?.error
    },
    quantityPanel: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.screenBackground,
      borderRadius: scale(16),
      columnGap: scale(10),
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      minHeight: scale(104),
      paddingHorizontal: scale(12),
      paddingVertical: scale(10)
    },
    quantityValue: {
      color: Colors[theme]?.black,
      fontSize: scale(18),
      fontWeight: '700'
    },
    quantityValueLabel: {
      color: Colors[theme]?.gray,
      fontSize: scale(11),
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    quantityValueWrap: {
      alignItems: 'center',
      minWidth: scale(40),
      rowGap: scale(2)
    },
    secondaryDetailText: {
      color: Colors[theme]?.gray,
      fontSize: scale(15),
      lineHeight: scale(22)
    },
    thumbnail: {
      backgroundColor: Colors[theme]?.imagePlaceholder,
      borderRadius: scale(16),
      height: scale(112),
      width: scale(112)
    },
    thumbnailPlaceholder: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.imagePlaceholder,
      borderRadius: scale(16),
      height: scale(112),
      justifyContent: 'center',
      paddingHorizontal: scale(8),
      width: scale(112)
    },
    thumbnailPlaceholderText: {
      color: Colors[theme]?.gray,
      fontSize: scale(11),
      lineHeight: scale(16),
      textAlign: 'center'
    },
    title: {
      color: Colors[theme]?.black,
      fontSize: scale(18),
      fontWeight: '700',
      lineHeight: scale(24)
    },
    topRow: {
      columnGap: scale(12),
      flexDirection: 'row'
    }
  });

export default styleSheet;
