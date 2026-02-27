import { StyleSheet } from 'react-native';
import { Colors, scale, type ThemeMode } from '../../theme';
import { Fonts } from '../../assets';

/**
 * Font weight styles.
 */
export const fontWeightStyles = StyleSheet.create({
  bold: {
    fontFamily: Fonts.bold
  },
  medium: {
    fontFamily: Fonts.medium
  },
  regular: {
    fontFamily: Fonts.regular
  },
  semiBold: {
    fontFamily: Fonts.semiBold
  }
});

/**
 * Font size styles with responsive scaling.
 */
export const fontSizeStyles = StyleSheet.create({
  displayLG: {
    fontSize: scale(48, true),
    lineHeight: scale(60, true)
  },
  displayMD: {
    fontSize: scale(36, true),
    lineHeight: scale(44, true)
  },
  displaySM: {
    fontSize: scale(30, true),
    lineHeight: scale(38, true)
  },
  displayXS: {
    fontSize: scale(24, true),
    lineHeight: scale(32, true)
  },
  textLG: {
    fontSize: scale(18, true),
    lineHeight: scale(28, true)
  },
  textMD: {
    fontSize: scale(16, true),
    lineHeight: scale(24, true)
  },
  textSM: {
    fontSize: scale(14, true),
    lineHeight: scale(20, true)
  },
  textXL: {
    fontSize: scale(20, true),
    lineHeight: scale(30, true)
  },
  textXS: {
    fontSize: scale(12, true),
    lineHeight: scale(18, true)
  }
});


/**
 * Text variant styles based on the theme.
 * @param theme - The current theme mode (light or dark).
 * @returns A StyleSheet object containing styles for different text variants.
 */
export const textVariantsStyles = (theme: ThemeMode) =>
  StyleSheet.create({
    body: {
      ...fontSizeStyles.textMD,
      ...fontWeightStyles.regular,
      color: Colors[theme]?.black
    },
    caption: {
      ...fontSizeStyles.textSM,
      ...fontWeightStyles.regular,
      color: Colors[theme]?.black
    },
    captionMedium: {
      ...fontSizeStyles.textSM,
      ...fontWeightStyles.medium,
      color: Colors[theme]?.black
    },
    error: {
      ...fontSizeStyles.textSM,
      ...fontWeightStyles.regular,
      color: Colors[theme]?.error
    },
    header: {
      ...fontSizeStyles.displaySM,
      ...fontWeightStyles.medium,
      color: Colors[theme]?.black
    },
    success: {
      ...fontSizeStyles.textSM,
      ...fontWeightStyles.regular,
      color: Colors[theme]?.green
    },
    title: {
      ...fontSizeStyles.textLG,
      ...fontWeightStyles.semiBold,
      color: Colors[theme]?.black
    }
  });
