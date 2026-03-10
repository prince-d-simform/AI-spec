import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale, type ThemeMode } from '../../theme';

/**
 * Screen-level styles for HomeScreen.
 * All dimensions via scale(), all colors via Colors[theme] (no hardcoded values).
 */
const styles = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    categoryRowContainer: {
      minHeight: scale(44)
    },
    categoryStatusContainer: {
      alignItems: 'flex-start',
      gap: scale(8),
      paddingBottom: scale(12),
      paddingHorizontal: scale(10)
    },
    categoryStatusText: {
      color: Colors[theme]?.gray,
      fontSize: scale(13)
    },
    /** Horizontal chip row — padding for scroll content */
    chipRow: {
      paddingBottom: scale(12),
      paddingHorizontal: scale(10),
      paddingTop: scale(4)
    },
    /** columnWrapperStyle for the 2-column FlatList */
    columnWrapper: {
      justifyContent: 'space-between'
    },
    /** Empty-state container — centred vertically */
    emptyContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingTop: scale(60)
    },
    /** Empty-state message text */
    emptyText: {
      color: Colors[theme]?.gray,
      fontSize: scale(15),
      textAlign: 'center'
    },
    feedbackContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: scale(24),
      rowGap: scale(12)
    },
    feedbackText: {
      color: Colors[theme]?.gray,
      fontSize: scale(15),
      textAlign: 'center'
    },
    /** FlatList contentContainerStyle */
    grid: {
      paddingBottom: scale(24),
      paddingHorizontal: scale(8)
    },
    gridEmptyContent: {
      flexGrow: 1
    },
    productStatusContainer: {
      paddingBottom: scale(12),
      paddingHorizontal: scale(10)
    },
    productStatusText: {
      color: Colors[theme]?.gray,
      fontSize: scale(13)
    },
    retryButton: {
      paddingHorizontal: scale(12),
      width: 'auto'
    },
    /** Root SafeAreaView */
    screen: {
      backgroundColor: Colors[theme]?.screenBackground,
      flex: 1
    }
  });

export default styles;
