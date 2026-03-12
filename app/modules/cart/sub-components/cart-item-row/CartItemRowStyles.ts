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
    container: {
      backgroundColor: Colors[theme]?.cardBackground,
      borderRadius: scale(20),
      elevation: scale(2),
      flexDirection: 'row',
      gap: scale(14),
      padding: scale(16),
      shadowColor: Colors[theme]?.cardShadow,
      shadowOffset: { width: 0, height: scale(2) },
      shadowOpacity: 1,
      shadowRadius: scale(8)
    },
    details: {
      flex: 1,
      gap: scale(10)
    },
    footerRow: {
      alignItems: 'flex-end',
      columnGap: scale(12),
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    metaChip: {
      backgroundColor: Colors[theme]?.chipInactive,
      borderRadius: scale(999),
      paddingHorizontal: scale(10),
      paddingVertical: scale(6)
    },
    metaChipText: {
      color: Colors[theme]?.gray,
      fontSize: scale(11),
      fontWeight: '600'
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: scale(8)
    },
    priceSummaryWrap: {
      flex: 1,
      gap: scale(4)
    },
    priceText: {
      color: Colors[theme]?.black,
      fontSize: scale(14),
      fontWeight: '600'
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
    quantityControlRow: {
      alignItems: 'center',
      columnGap: scale(8),
      flexDirection: 'row'
    },
    quantityValue: {
      color: Colors[theme]?.black,
      fontSize: scale(16),
      fontWeight: '700'
    },
    quantityValueLabel: {
      color: Colors[theme]?.gray,
      fontSize: scale(9),
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    quantityValueWrap: {
      alignItems: 'center',
      minWidth: scale(40),
      rowGap: scale(2)
    },
    summaryText: {
      color: Colors[theme]?.gray,
      fontSize: scale(13),
      lineHeight: scale(18)
    },
    thumbnail: {
      backgroundColor: Colors[theme]?.imagePlaceholder,
      borderRadius: scale(16),
      height: scale(96),
      width: scale(96)
    },
    thumbnailPlaceholder: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.imagePlaceholder,
      borderRadius: scale(16),
      height: scale(96),
      justifyContent: 'center',
      width: scale(96)
    },
    title: {
      color: Colors[theme]?.black,
      fontSize: scale(16),
      fontWeight: '700'
    }
  });

export default styleSheet;
