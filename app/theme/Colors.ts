/**
 * A collection of colors used in the theme.
 * @type {Object}
 */

// Define the keys for theme colors
type Keys =
  | 'primary'
  | 'secondary'
  | 'gray'
  | 'error'
  | 'pink'
  | 'orange'
  | 'lightBlue'
  | 'red'
  | 'darkBlue'
  | 'transparent'
  | 'green'
  // Pastel accent palette
  | 'pastelRose'
  | 'pastelMint'
  | 'pastelLavender'
  | 'pastelPeach'
  | 'pastelSky'
  | 'pastelLemon'
  // Semantic UI tokens — Home screen
  | 'cardBackground'
  | 'cardShadow'
  | 'chipInactive'
  | 'chipInactiveText'
  | 'ratingGold'
  | 'imagePlaceholder'
  | 'screenBackground'
  | 'headerSubtitle';

// Define common keys for colors
type CommonKeys = 'white' | 'black' | 'transparentBlack' | 'transparentWhite';

// Define theme colors with corresponding color values
const themeColors: Record<Keys, string> = {
  primary: '#141414',
  secondary: '#F1C336',
  gray: '#7B7B7B',
  error: '#E53E3E',
  pink: '#BA25EB',
  orange: '#F39C3C',
  lightBlue: '#3787FC',
  red: '#DD2C2C',
  darkBlue: '#374dfc',
  transparent: 'transparent',
  green: '#34A853',
  // Pastel accent palette (same value in light + dark)
  pastelRose: '#FFD6D6',
  pastelMint: '#C8F0DC',
  pastelLavender: '#DDD6FF',
  pastelPeach: '#FFE5CC',
  pastelSky: '#CCE8FF',
  pastelLemon: '#FFFACC',
  // Semantic UI tokens — light defaults (overridden in dark)
  cardBackground: '#FFFFFF',
  cardShadow: '#00000018',
  chipInactive: '#F2F2F2',
  chipInactiveText: '#7B7B7B',
  ratingGold: '#F4C430',
  imagePlaceholder: '#E8E8E8',
  screenBackground: '#F7F7F7',
  headerSubtitle: '#7B7B7B'
};

// Define common colors with corresponding color values
const commonColors: Record<CommonKeys, string> = {
  white: '#FFFFFF',
  black: '#000000',
  transparentBlack: '#00000000',
  transparentWhite: '#FFFFFF00'
};

// Define ThemeColors as a combination of theme colors and common colors
type ThemeColors = Record<Keys, string> & Record<CommonKeys, string>;

/**
 * A light theme object.
 * @returns {ThemeColors}
 */
const light: ThemeColors = {
  ...themeColors,
  black: commonColors.black,
  white: commonColors.white,
  transparentWhite: commonColors.transparentWhite,
  transparentBlack: commonColors.transparentBlack
};

/**
 * A dark theme object.
 * @returns {ThemeColors}
 */
const dark: ThemeColors = {
  ...themeColors,
  black: commonColors.white,
  white: commonColors.black,
  transparentWhite: commonColors.transparentBlack,
  transparentBlack: commonColors.transparentWhite,
  // Dark-mode overrides for semantic UI tokens
  cardBackground: '#1E1E1E',
  cardShadow: '#00000040',
  chipInactive: '#2A2A2A',
  imagePlaceholder: '#2D2D2D',
  screenBackground: '#121212'
};

export enum ThemeModeEnum {
  'light' = 'light',
  'dark' = 'dark',
  'system' = 'system'
}

export type ThemeMode = ThemeModeEnum.light | ThemeModeEnum.dark;

export default { light, dark };
