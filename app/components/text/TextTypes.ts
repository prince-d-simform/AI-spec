import type { textStyles } from './TextStyles';
import type { ReactNode } from 'react';
import type { TextProps as RNTextProps } from 'react-native';

/**
 * All available text variants derived directly from the Figma typography system.
 * Semantic aliases (`heading`, `title`, `body`, `label`, `caption`) are also
 * included for convenience and backward compatibility.
 */
export type TextVariant = keyof ReturnType<typeof textStyles>;

/**
 * Props for the custom Text component.
 *
 * @property {TextVariant} [variant] - Typography variant; defaults to `body`.
 * @property {ReactNode} [children] - Text content. Renders nothing when empty/undefined.
 * @property {RNTextProps['style']} [style] - Additional style overrides merged on top of the variant style.
 */
export interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: TextVariant;
  children?: ReactNode;
  style?: RNTextProps['style'];
}
