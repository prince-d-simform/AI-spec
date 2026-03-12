import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale, type ThemeMode } from '../../theme';

/**
 * A StyleSheet object that contains all of the Product Detail screen styles.
 * @param {ThemeMode} theme - The theme to use for the styles.
 * @returns {StyleSheet} A StyleSheet object containing all of the home screen styles.
 */
const styleSheet = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    addedStateCard: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.pastelLemon,
      borderRadius: scale(18),
      columnGap: scale(14),
      flexDirection: 'row',
      paddingHorizontal: scale(16),
      paddingVertical: scale(14)
    },
    addedStateIcon: {
      color: Colors[theme]?.primary
    },
    addedStateIconWrap: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.secondary,
      borderRadius: scale(999),
      height: scale(40),
      justifyContent: 'center',
      width: scale(40)
    },
    addedStateMessage: {
      color: Colors[theme]?.gray,
      fontSize: scale(12),
      lineHeight: scale(18)
    },
    addedStateQuantityLabel: {
      color: Colors[theme]?.gray,
      fontSize: scale(10),
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    addedStateQuantityValue: {
      color: Colors[theme]?.black,
      fontSize: scale(18),
      fontWeight: '700'
    },
    addedStateQuantityWrap: {
      alignItems: 'center',
      rowGap: scale(2)
    },
    addedStateTextWrap: {
      flex: 1,
      rowGap: scale(4)
    },
    addedStateTitle: {
      color: Colors[theme]?.black,
      fontSize: scale(15),
      fontWeight: '700'
    },
    cartErrorText: {
      color: Colors[theme]?.error,
      fontSize: scale(12),
      lineHeight: scale(18),
      textAlign: 'center'
    },
    cartFooter: {
      backgroundColor: Colors[theme]?.cardBackground,
      borderTopColor: Colors[theme]?.chipInactive,
      borderTopWidth: scale(1),
      paddingBottom: scale(20),
      paddingHorizontal: scale(16),
      paddingTop: scale(12),
      rowGap: scale(10)
    },
    categoryPill: {
      backgroundColor: Colors[theme]?.chipInactive,
      borderRadius: scale(999),
      paddingHorizontal: scale(12),
      paddingVertical: scale(8)
    },
    categoryPillText: {
      color: Colors[theme]?.chipInactiveText,
      fontSize: scale(12),
      fontWeight: '600'
    },
    centeredState: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: scale(24)
    },
    dataPair: {
      backgroundColor: Colors[theme]?.chipInactive,
      borderRadius: scale(14),
      minWidth: scale(120),
      padding: scale(12)
    },
    dataPairLabel: {
      color: Colors[theme]?.gray,
      fontSize: scale(11),
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    dataPairRow: {
      columnGap: scale(12),
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: scale(10)
    },
    dataPairValue: {
      color: Colors[theme]?.black,
      fontSize: scale(14),
      fontWeight: '600',
      marginTop: scale(4)
    },
    detailLabel: {
      color: Colors[theme]?.gray,
      flex: 1,
      fontSize: scale(13),
      fontWeight: '600'
    },
    detailRow: {
      alignItems: 'flex-start',
      borderBottomColor: Colors[theme]?.chipInactive,
      borderBottomWidth: scale(1),
      columnGap: scale(12),
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: scale(10)
    },
    detailValue: {
      color: Colors[theme]?.black,
      flex: 1,
      fontSize: scale(14),
      fontWeight: '500',
      textAlign: 'right'
    },
    discountBadge: {
      backgroundColor: Colors[theme]?.secondary,
      borderRadius: scale(999),
      paddingHorizontal: scale(10),
      paddingVertical: scale(6)
    },
    discountText: {
      color: Colors[theme]?.primary,
      fontSize: scale(12),
      fontWeight: '700'
    },
    headerActionButton: {
      alignItems: 'center',
      height: scale(40),
      justifyContent: 'center',
      width: scale(40)
    },
    headerActionIcon: {
      color: Colors[theme]?.black
    },
    headerRightSpacer: {
      height: scale(40),
      width: scale(40)
    },
    heroCard: {
      backgroundColor: Colors[theme]?.cardBackground,
      borderRadius: scale(20),
      elevation: scale(3),
      overflow: 'hidden',
      shadowColor: Colors[theme]?.cardShadow,
      shadowOffset: { width: 0, height: scale(2) },
      shadowOpacity: 1,
      shadowRadius: scale(8)
    },
    heroImage: {
      aspectRatio: 1,
      backgroundColor: Colors[theme]?.imagePlaceholder,
      width: '100%'
    },
    imagePlaceholder: {
      alignItems: 'center',
      aspectRatio: 1,
      backgroundColor: Colors[theme]?.imagePlaceholder,
      justifyContent: 'center',
      paddingHorizontal: scale(16),
      width: '100%'
    },
    imagePlaceholderText: {
      color: Colors[theme]?.gray,
      fontSize: scale(14),
      textAlign: 'center'
    },
    priceRow: {
      alignItems: 'center',
      columnGap: scale(12),
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    priceText: {
      color: Colors[theme]?.primary,
      fontSize: scale(24),
      fontWeight: '700'
    },
    reviewCard: {
      backgroundColor: Colors[theme]?.chipInactive,
      borderRadius: scale(16),
      padding: scale(14),
      rowGap: scale(8)
    },
    reviewComment: {
      color: Colors[theme]?.black,
      fontSize: scale(14),
      lineHeight: scale(20)
    },
    reviewDate: {
      color: Colors[theme]?.gray,
      fontSize: scale(12)
    },
    reviewHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    reviewName: {
      color: Colors[theme]?.black,
      flex: 1,
      fontSize: scale(14),
      fontWeight: '700'
    },
    reviewRating: {
      color: Colors[theme]?.ratingGold,
      fontSize: scale(13),
      fontWeight: '700'
    },
    screenView: {
      backgroundColor: Colors[theme]?.screenBackground,
      flex: 1
    },
    scrollContent: {
      padding: scale(16),
      paddingBottom: scale(48),
      rowGap: scale(16)
    },
    sectionCard: {
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
    sectionText: {
      color: Colors[theme]?.gray,
      fontSize: scale(14),
      lineHeight: scale(22)
    },
    sectionTitle: {
      color: Colors[theme]?.black,
      fontSize: scale(18),
      fontWeight: '700'
    },
    stateActions: {
      marginTop: scale(20),
      rowGap: scale(12),
      width: '100%'
    },
    stateMessage: {
      color: Colors[theme]?.gray,
      fontSize: scale(14),
      lineHeight: scale(22),
      marginTop: scale(8),
      textAlign: 'center'
    },
    stateTitle: {
      color: Colors[theme]?.black,
      fontSize: scale(22),
      fontWeight: '700',
      marginTop: scale(16),
      textAlign: 'center'
    },
    summaryMetaRow: {
      columnGap: scale(8),
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    tagChip: {
      backgroundColor: Colors[theme]?.pastelLemon,
      borderRadius: scale(999),
      paddingHorizontal: scale(12),
      paddingVertical: scale(8)
    },
    tagChipText: {
      color: Colors[theme]?.primary,
      fontSize: scale(12),
      fontWeight: '600'
    },
    tagRow: {
      columnGap: scale(8),
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: scale(8)
    },
    thumbnailButton: {
      borderColor: Colors[theme]?.transparentBlack,
      borderRadius: scale(12),
      borderWidth: scale(1),
      overflow: 'hidden'
    },
    thumbnailButtonSelected: {
      borderColor: Colors[theme]?.secondary
    },
    thumbnailImage: {
      backgroundColor: Colors[theme]?.imagePlaceholder,
      height: scale(72),
      width: scale(72)
    },
    thumbnailRow: {
      columnGap: scale(10),
      padding: scale(12)
    },
    title: {
      color: Colors[theme]?.black,
      fontSize: scale(24),
      fontWeight: '700',
      lineHeight: scale(32)
    }
  });

export default styleSheet;
