# UI Contract: TextProps

**Component**: `Text`  
**Export path**: `app/components/text`  
**Phase**: 1 — Design & Contracts  
**Branch**: `003-text-variant-component`

---

## Interface Definition

```typescript
import type { ReactNode } from 'react';
import type { TextProps as RNTextProps } from 'react-native';
import type { textStyles } from './TextStyles';

/** All named typography variants available in the design system. */
export type TextVariant = keyof ReturnType<typeof textStyles>;

/**
 * Props for the variant-based Text component.
 */
export interface TextProps extends Omit<RNTextProps, 'style'> {
  /**
   * Named typography variant. Determines font family, size, weight,
   * and line-height. Defaults to `'body'` when omitted.
   */
  variant?: TextVariant;

  /**
   * Text content to display. Renders nothing when `undefined`, `null`,
   * or an empty string.
   */
  children?: ReactNode;

  /**
   * Style override merged on top of the variant style. In case of
   * conflict the override wins (FR-007).
   */
  style?: RNTextProps['style'];

  // All other RNTextProps are forwarded unchanged via ...rest:
  // numberOfLines, allowFontScaling, ellipsizeMode, onPress,
  // accessibilityLabel, accessibilityRole, testID, etc.
}
```

---

## Behavior Contract

| Scenario               | Input                      | Output                                              |
| ---------------------- | -------------------------- | --------------------------------------------------- |
| Known variant          | `variant="headingBold40"`  | Renders with IBMPlexSans-Bold 40px/48               |
| Default variant        | `variant` omitted          | Renders with `body` styles (Sweetext-Light 16px/22) |
| Unknown variant (DEV)  | `variant="nonexistent"`    | Falls back to `body`; emits `console.warn`          |
| Unknown variant (PROD) | `variant="nonexistent"`    | Falls back to `body`; no warning                    |
| Empty content          | `children=""` or omitted   | Returns `null`; no layout space                     |
| Style override         | `style={{ color: 'red' }}` | Merges on top; override color wins                  |
| Native props           | `numberOfLines={1}`        | Forwarded to underlying `<Text>` unchanged          |
| Dark mode              | theme = `'dark'`           | Text color flips to `Colors.dark.black` (`#FFFFFF`) |

---

## Exported Symbols

| Symbol        | Kind                  | Description                             |
| ------------- | --------------------- | --------------------------------------- |
| `Text`        | `MemoExoticComponent` | The rendered component (default export) |
| `TextProps`   | `interface`           | Prop type for consumers                 |
| `TextVariant` | `type`                | Union of all valid variant strings      |

---

## Usage Examples

```tsx
// Minimal — relies on 'body' default
<Text>Hello world</Text>

// Explicit variant
<Text variant="headingBold32">Page Title</Text>

// Semantic alias
<Text variant="caption">Secondary info</Text>

// With native prop forwarding
<Text variant="body" numberOfLines={2} ellipsizeMode="tail">
  Long paragraph that may be clipped...
</Text>

// With style override
<Text variant="label" style={{ color: Colors[theme]?.primary }}>
  Input label
</Text>

// Accessing types
import { Text, type TextVariant } from 'app/components/text';
const v: TextVariant = 'headingSemiBold24';
```

---

## Breaking-Change Policy

Adding new variants to `TextStyles.ts` is non-breaking. Removing a variant key is a **breaking change** — all call sites using the removed variant must be migrated. Renaming a variant is equivalent to a removal + addition.
