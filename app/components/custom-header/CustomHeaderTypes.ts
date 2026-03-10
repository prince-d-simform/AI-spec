import React from 'react';
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

/**
 * A type for the props of the header component.
 * @property {React.ReactElement} customLeftView - Header left view.
 * @property {React.ReactElement} customRightView - Header right view.
 * @property {string} title - A title for the header component.
 * @property {TextStyle} titleStyle - A title style for the header component.
 * @property {boolean} isBottomLine - A bottom line is displayed or not.
 */
export interface CustomHeaderPropsType {
  customLeftView?: React.ReactElement | null;
  customRightView?: React.ReactElement | null;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  isBottomLine?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const defaultProps = {
  isBottomLine: true
};
