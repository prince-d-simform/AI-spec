# Data Model: Text Variant Component

**Phase**: 1 — Design & Contracts  
**Branch**: `003-text-variant-component`

---

## Entities

### TextVariant (Union Type)

Derived at the type level as `keyof ReturnType<typeof textStyles>`, ensuring the
type and the StyleSheet always stay in sync — adding or removing a variant from
`TextStyles.ts` is automatically reflected in the union.

```typescript
type TextVariant =
  // Semantic aliases
  | 'body'
  | 'caption'
  | 'heading'
  | 'label'
  | 'title'
  // IBMPlexSans Bold
  | 'headingBold14'
  | 'headingBold16'
  | 'headingBold20'
  | 'headingBold24'
  | 'headingBold32'
  | 'headingBold40'
  // IBMPlexSans SemiBold
  | 'headingSemiBold14'
  | 'headingSemiBold16'
  | 'headingSemiBold24'
  | 'headingSemiBold32'
  | 'headingSemiBold40'
  // IBMPlexSans Medium
  | 'headingMedium14'
  | 'headingMedium16'
  // IBMPlexSans Regular
  | 'headingRegular14'
  | 'headingRegular16'
  // Sweetext DemiBold
  | 'bodySemiBold12'
  | 'bodySemiBold14'
  | 'bodySemiBold16'
  // Sweetext Medium
  | 'bodyMedium12'
  | 'bodyMedium14'
  | 'bodyMedium16'
  // Sweetext Light
  | 'bodyRegular12'
  | 'bodyRegular14'
  | 'bodyRegular16'
  // Paragraph — Sweetext DemiBold
  | 'paragraphBodyMedium12'
  | 'paragraphBodyMedium14'
  // Paragraph — Sweetext Medium
  | 'paragraphBodyRegular12'
  | 'paragraphBodyRegular14';
```

**Validation rules**: Enforced at compile-time via TypeScript; unknown strings are
caught at runtime in DEV with a `console.warn` and fall back to `'body'`.

---

### StyleSheet Entry (per variant)

Each variant maps to a React Native `TextStyle` object with the following fields:

| Field        | Source                 | Notes                                              |
| ------------ | ---------------------- | -------------------------------------------------- |
| `color`      | `Colors[theme]?.black` | Theme-aware; inverts automatically in dark mode    |
| `fontFamily` | Figma token            | `IBMPlexSans-{Weight}` or `Sweetext-{Weight}`      |
| `fontSize`   | `scale(n)`             | `n` taken from Figma token size; device-responsive |
| `fontWeight` | Figma token            | `'300'` / `'400'` / `'500'` / `'600'` / `'700'`    |
| `lineHeight` | `scale(n)`             | `n` taken from Figma token; device-responsive      |

**State transitions**: None — styles are stateless pure functions of `theme`.

---

### Variant Catalogue

| Variant key              | fontFamily           | fontSize | fontWeight | lineHeight |
| ------------------------ | -------------------- | -------- | ---------- | ---------- |
| `body` _(alias)_         | Sweetext-Light       | 16       | 300        | 22         |
| `bodyMedium12`           | Sweetext-Medium      | 12       | 500        | 16         |
| `bodyMedium14`           | Sweetext-Medium      | 14       | 500        | 20         |
| `bodyMedium16`           | Sweetext-Medium      | 16       | 500        | 22         |
| `bodyRegular12`          | Sweetext-Light       | 12       | 300        | 16         |
| `bodyRegular14`          | Sweetext-Light       | 14       | 300        | 20         |
| `bodyRegular16`          | Sweetext-Light       | 16       | 300        | 22         |
| `bodySemiBold12`         | Sweetext-DemiBold    | 12       | 600        | 16         |
| `bodySemiBold14`         | Sweetext-DemiBold    | 14       | 600        | 20         |
| `bodySemiBold16`         | Sweetext-DemiBold    | 16       | 600        | 22         |
| `caption` _(alias)_      | Sweetext-Light       | 12       | 300        | 16         |
| `heading` _(alias)_      | IBMPlexSans-Bold     | 40       | 700        | 48         |
| `headingBold14`          | IBMPlexSans-Bold     | 14       | 700        | 18         |
| `headingBold16`          | IBMPlexSans-Bold     | 16       | 700        | 22         |
| `headingBold20`          | IBMPlexSans-Bold     | 20       | 700        | 28         |
| `headingBold24`          | IBMPlexSans-Bold     | 24       | 700        | 32         |
| `headingBold32`          | IBMPlexSans-Bold     | 32       | 700        | 40         |
| `headingBold40`          | IBMPlexSans-Bold     | 40       | 700        | 48         |
| `headingMedium14`        | IBMPlexSans-Medium   | 14       | 500        | 18         |
| `headingMedium16`        | IBMPlexSans-Medium   | 16       | 500        | 22         |
| `headingRegular14`       | IBMPlexSans-Regular  | 14       | 400        | 18         |
| `headingRegular16`       | IBMPlexSans-Regular  | 16       | 400        | 22         |
| `headingSemiBold14`      | IBMPlexSans-SemiBold | 14       | 600        | 18         |
| `headingSemiBold16`      | IBMPlexSans-SemiBold | 16       | 600        | 22         |
| `headingSemiBold24`      | IBMPlexSans-SemiBold | 24       | 600        | 32         |
| `headingSemiBold32`      | IBMPlexSans-SemiBold | 32       | 600        | 40         |
| `headingSemiBold40`      | IBMPlexSans-SemiBold | 40       | 600        | 48         |
| `label` _(alias)_        | IBMPlexSans-Medium   | 14       | 500        | 18         |
| `paragraphBodyMedium12`  | Sweetext-DemiBold    | 12       | 600        | 20         |
| `paragraphBodyMedium14`  | Sweetext-DemiBold    | 14       | 600        | 22         |
| `paragraphBodyRegular12` | Sweetext-Medium      | 12       | 500        | 20         |
| `paragraphBodyRegular14` | Sweetext-Medium      | 14       | 500        | 22         |
| `title` _(alias)_        | IBMPlexSans-SemiBold | 16       | 600        | 22         |

---

### Theme Context

| Mode     | `Colors[theme]?.black` resolved value |
| -------- | ------------------------------------- |
| `light`  | `#000000`                             |
| `dark`   | `#FFFFFF`                             |
| `system` | Delegates to device preference        |

All variants share the same color field; callers may override with a `style` prop.
