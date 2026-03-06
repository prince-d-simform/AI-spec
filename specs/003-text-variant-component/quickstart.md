# Quickstart: Text Variant Component

**Branch**: `003-text-variant-component`

---

## Installation

The `Text` component is part of the shared component library and requires no
additional packages. It is exported from `app/components`.

```ts
import { Text } from 'app/components';
// or direct path:
import { Text } from 'app/components/text';
```

---

## Basic Usage

```tsx
import React from 'react';
import { View } from 'react-native';
import { Text } from 'app/components';

const MyScreen = () => (
  <View>
    {/* Page heading */}
    <Text variant="headingBold32">Welcome Back</Text>

    {/* Body paragraph */}
    <Text variant="body">Your account has been set up successfully.</Text>

    {/* Supporting caption */}
    <Text variant="caption">Last updated: today</Text>
  </View>
);
```

---

## Available Variants

### Semantic Aliases (shorthand)

| Variant   | Use case                                     |
| --------- | -------------------------------------------- |
| `heading` | Page-level hero heading (40px Bold)          |
| `title`   | Section or card title (16px SemiBold)        |
| `body`    | Primary body text (16px Light) — **default** |
| `label`   | Form field labels (14px Medium)              |
| `caption` | Secondary / supplementary text (12px Light)  |

### IBM Plex Sans — Heading Group

| Variant                                   | Size    | Weight       |
| ----------------------------------------- | ------- | ------------ |
| `headingBold14` … `headingBold40`         | 14–40px | Bold 700     |
| `headingSemiBold14` … `headingSemiBold40` | 14–40px | SemiBold 600 |
| `headingMedium14`, `headingMedium16`      | 14–16px | Medium 500   |
| `headingRegular14`, `headingRegular16`    | 14–16px | Regular 400  |

### Sweetext — Body Group

| Variant                             | Size    | Weight       |
| ----------------------------------- | ------- | ------------ |
| `bodySemiBold12` … `bodySemiBold16` | 12–16px | DemiBold 600 |
| `bodyMedium12` … `bodyMedium16`     | 12–16px | Medium 500   |
| `bodyRegular12` … `bodyRegular16`   | 12–16px | Light 300    |

### Sweetext — Paragraph Group

| Variant                                            | Size    | Weight       |
| -------------------------------------------------- | ------- | ------------ |
| `paragraphBodyMedium12`, `paragraphBodyMedium14`   | 12–14px | DemiBold 600 |
| `paragraphBodyRegular12`, `paragraphBodyRegular14` | 12–14px | Medium 500   |

---

## Default Variant

When no `variant` is passed, the component applies the `body` style:

```tsx
<Text>This uses the body variant automatically.</Text>
```

---

## Style Overrides

Pass a `style` prop to augment or replace individual properties. Overrides win
over the variant's defaults:

```tsx
<Text variant="label" style={{ color: '#FF0000' }}>
  Danger label
</Text>
```

---

## Native Prop Forwarding

All React Native `TextProps` (except `style`, which is re-typed) are forwarded
directly to the underlying `<Text>` element:

```tsx
<Text
  variant="body"
  numberOfLines={3}
  ellipsizeMode="tail"
  onPress={() => handlePress()}
  accessibilityLabel="Article summary"
>
  Long article content that might overflow...
</Text>
```

---

## Empty Content

When `children` is `undefined`, `null`, or an empty string, the component
renders **nothing** — no node, no layout space:

```tsx
<Text variant="body">{maybeUndefined}</Text>;
{
  /* If maybeUndefined is undefined/null/"" → renders null */
}
```

---

## Theme Awareness

Colors flip automatically when the app theme changes. No extra code is needed:

```tsx
// Light mode → black text
// Dark mode  → white text
<Text variant="headingBold24">Hello</Text>
```

To override the theme color, pass an explicit `style`:

```tsx
import { Colors } from 'app/theme';
// Caller manages their own theme variable
<Text variant="body" style={{ color: Colors[theme]?.primary }}>
  Branded text
</Text>;
```

---

## TypeScript Integration

```tsx
import type { TextVariant } from 'app/components/text';

// Typed variant variable
const variant: TextVariant = 'headingSemiBold24';

// Typed component prop
interface HeaderProps {
  titleVariant?: TextVariant;
}
```

---

## Build & Verify

```bash
# Type-check
yarn types

# Lint
yarn lint

# Run tests
yarn test
```
