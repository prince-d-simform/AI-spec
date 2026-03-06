import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale } from '../../theme';
import type { ThemeMode } from '../../theme/Colors';

/**
 * Typography stylesheet derived from the PRZM Figma design system.
 *
 * Key naming convention: camelCase of the Figma token name after the `/`.
 * Two font families are used:
 *   - "IBM Plex Sans"  (Heading group) → IBMPlexSans-{Weight}
 *   - "Sweetext"       (Body group)    → Sweetext-{Weight}
 *
 * Semantic aliases (`heading`, `title`, `body`, `label`, `caption`) are
 * provided at the bottom of the sheet for convenience.
 *
 * Keys are ordered alphabetically to satisfy the StyleSheet sort rule.
 *
 * @param {ThemeMode} theme - Active theme used to resolve text color.
 */
export const textStyles = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    // ─────────────────────────────────────────────────────────────────
    // SEMANTIC ALIASES — convenience shortcuts used by higher-level
    // components (e.g. CustomButton) and as the component's default.
    // ─────────────────────────────────────────────────────────────────

    /** Default body prose → Regular/Body Regular 16 */
    body: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-Light',
      fontSize: scale(16),
      fontWeight: '300',
      lineHeight: scale(22)
    },

    // ─────────────────────────────────────────────────────────────────
    // MEDIUM BODY  ·  Sweetext Medium · weight 500
    // ─────────────────────────────────────────────────────────────────

    /** Medium/Body Medium 12 */
    bodyMedium12: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-Medium',
      fontSize: scale(12),
      fontWeight: '500',
      lineHeight: scale(16)
    },
    /** Medium/Body Medium 14 */
    bodyMedium14: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-Medium',
      fontSize: scale(14),
      fontWeight: '500',
      lineHeight: scale(20)
    },
    /** Medium/Body Medium 16 */
    bodyMedium16: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-Medium',
      fontSize: scale(16),
      fontWeight: '500',
      lineHeight: scale(22)
    },

    // ─────────────────────────────────────────────────────────────────
    // REGULAR BODY  ·  Sweetext Light · weight 300
    // ─────────────────────────────────────────────────────────────────

    /** Regular/Body Regular 12 */
    bodyRegular12: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-Light',
      fontSize: scale(12),
      fontWeight: '300',
      lineHeight: scale(16)
    },
    /** Regular/Body Regular 14 */
    bodyRegular14: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-Light',
      fontSize: scale(14),
      fontWeight: '300',
      lineHeight: scale(20)
    },
    /** Regular/Body Regular 16 */
    bodyRegular16: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-Light',
      fontSize: scale(16),
      fontWeight: '300',
      lineHeight: scale(22)
    },

    // ─────────────────────────────────────────────────────────────────
    // SEMIBOLD BODY  ·  Sweetext DemiBold · weight 600
    // ─────────────────────────────────────────────────────────────────

    /** SemiBold/Body SemiBold 12 */
    bodySemiBold12: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-DemiBold',
      fontSize: scale(12),
      fontWeight: '600',
      lineHeight: scale(16)
    },
    /** SemiBold/Body SemiBold 14 */
    bodySemiBold14: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-DemiBold',
      fontSize: scale(14),
      fontWeight: '600',
      lineHeight: scale(20)
    },
    /** SemiBold/Body SemiBold 16 */
    bodySemiBold16: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-DemiBold',
      fontSize: scale(16),
      fontWeight: '600',
      lineHeight: scale(22)
    },

    /** Small supplementary text (semantic alias) → Regular/Body Regular 12 */
    caption: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-Light',
      fontSize: scale(12),
      fontWeight: '300',
      lineHeight: scale(16)
    },

    // ─────────────────────────────────────────────────────────────────
    // BOLD HEADING  ·  IBM Plex Sans Bold · weight 700
    // ─────────────────────────────────────────────────────────────────

    /** Large display heading (semantic alias) → Bold/Heading Bold 40 */
    heading: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Bold',
      fontSize: scale(40),
      fontWeight: '700',
      lineHeight: scale(48)
    },
    /** Bold/Heading Bold 14 */
    headingBold14: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Bold',
      fontSize: scale(14),
      fontWeight: '700',
      lineHeight: scale(18)
    },
    /** Bold/Heading Bold 16 */
    headingBold16: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Bold',
      fontSize: scale(16),
      fontWeight: '700',
      lineHeight: scale(22)
    },
    /** Bold/Heading Bold 20 */
    headingBold20: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Bold',
      fontSize: scale(20),
      fontWeight: '700',
      lineHeight: scale(28)
    },
    /** Bold/Heading Bold 24 */
    headingBold24: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Bold',
      fontSize: scale(24),
      fontWeight: '700',
      lineHeight: scale(32)
    },
    /** Bold/Heading Bold 32 */
    headingBold32: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Bold',
      fontSize: scale(32),
      fontWeight: '700',
      lineHeight: scale(40)
    },
    /** Bold/Heading Bold 40 */
    headingBold40: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Bold',
      fontSize: scale(40),
      fontWeight: '700',
      lineHeight: scale(48)
    },

    // ─────────────────────────────────────────────────────────────────
    // MEDIUM HEADING  ·  IBM Plex Sans Medium · weight 500
    // ─────────────────────────────────────────────────────────────────

    /** Medium/Heading Medium 14 */
    headingMedium14: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Medium',
      fontSize: scale(14),
      fontWeight: '500',
      lineHeight: scale(18)
    },
    /** Medium/Heading Medium 16 */
    headingMedium16: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Medium',
      fontSize: scale(16),
      fontWeight: '500',
      lineHeight: scale(22)
    },

    // ─────────────────────────────────────────────────────────────────
    // REGULAR HEADING  ·  IBM Plex Sans Regular · weight 400
    // ─────────────────────────────────────────────────────────────────

    /** Regular/Heading Regular 14 */
    headingRegular14: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Regular',
      fontSize: scale(14),
      fontWeight: '400',
      lineHeight: scale(18)
    },
    /** Regular/Heading Regular 16 */
    headingRegular16: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Regular',
      fontSize: scale(16),
      fontWeight: '400',
      lineHeight: scale(22)
    },

    // ─────────────────────────────────────────────────────────────────
    // SEMIBOLD HEADING  ·  IBM Plex Sans SemiBold · weight 600
    // ─────────────────────────────────────────────────────────────────

    /** SemiBold/Heading SemiBold 14 */
    headingSemiBold14: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-SemiBold',
      fontSize: scale(14),
      fontWeight: '600',
      lineHeight: scale(18)
    },
    /** SemiBold/Heading SemiBold 16 */
    headingSemiBold16: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-SemiBold',
      fontSize: scale(16),
      fontWeight: '600',
      lineHeight: scale(22)
    },
    /** SemiBold/Heading SemiBold 24 */
    headingSemiBold24: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-SemiBold',
      fontSize: scale(24),
      fontWeight: '600',
      lineHeight: scale(32)
    },
    /** SemiBold/Heading SemiBold 32 */
    headingSemiBold32: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-SemiBold',
      fontSize: scale(32),
      fontWeight: '600',
      lineHeight: scale(40)
    },
    /** SemiBold/Heading Semibold 40 */
    headingSemiBold40: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-SemiBold',
      fontSize: scale(40),
      fontWeight: '600',
      lineHeight: scale(48)
    },

    /** Form / input label (semantic alias) → Medium/Heading Medium 14 */
    label: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-Medium',
      fontSize: scale(14),
      fontWeight: '500',
      lineHeight: scale(18)
    },

    // ─────────────────────────────────────────────────────────────────
    // PARAGRAPH  ·  Sweetext DemiBold (Medium) / Sweetext Medium (Regular)
    // Note: Paragraph lineHeights differ from Body group:
    //   size 14 → lineHeight 22  (vs 18 in Body)
    //   size 12 → lineHeight 20  (vs 16 in Body)
    // ─────────────────────────────────────────────────────────────────

    /** Paragraph/Body Medium 12 */
    paragraphBodyMedium12: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-DemiBold',
      fontSize: scale(12),
      fontWeight: '600',
      lineHeight: scale(20)
    },
    /** Paragraph/Body Medium 14 */
    paragraphBodyMedium14: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-DemiBold',
      fontSize: scale(14),
      fontWeight: '600',
      lineHeight: scale(22)
    },
    /** Paragraph/Body Regular 12 */
    paragraphBodyRegular12: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-Medium',
      fontSize: scale(12),
      fontWeight: '500',
      lineHeight: scale(20)
    },
    /** Paragraph/Body Regular 14 */
    paragraphBodyRegular14: {
      color: Colors[theme]?.black,
      fontFamily: 'Sweetext-Medium',
      fontSize: scale(14),
      fontWeight: '500',
      lineHeight: scale(22)
    },

    /** Screen / section title (semantic alias) → SemiBold/Heading SemiBold 16 */
    title: {
      color: Colors[theme]?.black,
      fontFamily: 'IBMPlexSans-SemiBold',
      fontSize: scale(16),
      fontWeight: '600',
      lineHeight: scale(22)
    }
  });
