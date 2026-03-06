import React, { memo } from 'react';
import { Text as RNText } from 'react-native';
import { useTheme } from '../../hooks';
import { textStyles } from './TextStyles';
import type { TextProps, TextVariant } from './TextTypes';
import type { TextStyle } from 'react-native';

/** Variant applied when no `variant` prop is provided (FR-003). */
const DEFAULT_VARIANT: TextVariant = 'body';

/**
 * Variant-based Text component.
 *
 * Usage:
 * ```tsx
 * <Text variant="headingBold40">Hello</Text>
 * <Text variant="body" numberOfLines={2}>Paragraph content</Text>
 * <Text variant="caption" style={{ color: 'red' }}>Override color</Text>
 * ```
 *
 * - Variant styles are sourced from `TextStyles` (FR-004).
 * - Colors are theme-aware and flip automatically on dark mode (FR-005).
 * - All remaining React Native `TextProps` are forwarded to the underlying
 *   `<Text>` element unchanged — `allowFontScaling`, `numberOfLines`,
 *   `ellipsizeMode`, `onPress`, etc. are all caller-controlled (FR-006, FR-011).
 * - An optional `style` prop is merged on top of the variant style; in case of
 *   conflict the override wins (FR-007).
 * - Unknown variants fall back to `body` with a DEV warning (FR-008).
 * - Renders `null` when `children` is empty, an empty string, or undefined (FR-010).
 *
 * @param {TextProps} props
 * @returns {React.ReactElement | null}
 */
const TextComponent = ({
  variant,
  children,
  style,
  ...rest
}: TextProps): React.ReactElement | null => {
  // Hook must be called unconditionally — before any early returns (Rules of Hooks).
  const { styles } = useTheme(textStyles);

  // FR-010: render nothing for empty/undefined content.
  if (children === undefined || children === null || children === '') {
    return null;
  }

  // FR-003: fall back to DEFAULT_VARIANT when no variant is provided.
  const resolvedVariant = variant ?? DEFAULT_VARIANT;

  // FR-008: runtime guard — variant type is enforced by TypeScript at compile
  // time, but a plain-JS caller could pass an arbitrary string.  Use hasOwnProperty
  // to detect the case and emit a DEV-only warning before falling back.
  const isKnownVariant = Object.hasOwn(styles, resolvedVariant);

  if (__DEV__ && variant !== undefined && !isKnownVariant) {
    console.warn(
      `[Text] Unknown variant "${String(variant)}" — falling back to "${DEFAULT_VARIANT}".`
    );
  }

  const allStyles = styles as Record<TextVariant, TextStyle>;
  const variantStyle = isKnownVariant ? allStyles[resolvedVariant] : allStyles[DEFAULT_VARIANT];

  return (
    <RNText style={[variantStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};

const Text = memo(TextComponent);
Text.displayName = 'Text';
export default Text;
