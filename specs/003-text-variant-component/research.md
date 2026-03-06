# Research: Text Variant Component

**Phase**: 0 — Outline & Research  
**Branch**: `003-text-variant-component`

---

## 1. Typography Token Extraction (Figma)

**Decision**: Map all Figma token names to camelCase StyleSheet keys using the portion after the final `/` separator.

**Rationale**: Token names in the PRZM Figma file follow the pattern `Group/Weight/Size` (e.g., `Heading/Bold/40`). Dropping the group prefix and camelCasing the remainder (`headingBold40`) produces concise, readable keys that remain traceable back to the Figma source. Semantic aliases (`heading`, `title`, `body`, `label`, `caption`) are added at the end of the StyleSheet (sorted alphabetically) to provide shorthand variants for common use cases.

**Alternatives considered**:

- Full token path as key (`headingBold40px`) — too verbose; Figma uses logical grouping, not CSS conventions
- Numeric suffix without `px` (`headingBold40`) — chosen; aligns with how other style properties are referred to in the codebase
- Separate files per weight group — rejected; a single StyleSheet keeps all type tokens in one auditable location

**Source nodes** (Figma — `UjA36S4xFGLa2aWx6nJjgk`):  
| Node | Group | Font | Variants extracted |
|------|-------|------|--------------------|
| `2006-51043` | Bold | IBMPlexSans-Bold 700 | `headingBold14/16/20/24/32/40` |
| `2008-51387` | SemiBold | IBMPlexSans-SemiBold 600 + Sweetext-DemiBold 600 | `headingSemiBold14/16/24/32/40`, `bodySemiBold12/14/16` |
| `2008-51580` | Medium | IBMPlexSans-Medium 500 + Sweetext-Medium 500 | `headingMedium14/16`, `bodyMedium12/14/16` |
| `2008-51450` | Regular | IBMPlexSans-Regular 400 + Sweetext-Light 300 | `headingRegular14/16`, `bodyRegular12/14/16` |
| `2008-51517` | Paragraph | Sweetext-DemiBold 600 + Sweetext-Medium 500 | `paragraphBodyMedium12/14`, `paragraphBodyRegular12/14` |

---

## 2. Default & Fallback Variant

**Decision**: `body` is both the default (no variant prop) and the fallback (unrecognized variant).

**Rationale**: `body` is the most universally applicable variant; using it as a fallback guarantees readable text in all cases. A dev-only `console.warn` is emitted for unrecognized variants so developers are alerted without crashing production.

**Alternatives considered**:

- No default → require variant always — rejected; too verbose for callers; most text is body-weight
- Throw error in dev → rejected; component should never crash, even on misuse

---

## 3. Empty Content Behavior

**Decision**: Return `null` (renders nothing, reserves no layout space) when `children` is `undefined`, `null`, or `''`.

**Rationale**: Matches the spec FR-010. Prevents empty `<Text>` nodes from occupying space in layouts, which would cause unexpected gaps.

**Alternatives considered**:

- Render empty `<Text>` — rejected; empty text nodes still reserve line-height space in some RN versions
- Only check for `undefined` — rejected; empty string `''` is equally meaningless visually

---

## 4. Native Prop Forwarding

**Decision**: Destructure `variant`, `children`, `style` and spread `...rest` onto `<RNText>`.

**Rationale**: Callers retain full control over all Native Text behaviours (`numberOfLines`, `allowFontScaling`, `ellipsizeMode`, `onPress`, `accessibilityLabel`, etc.) without the component needing explicit prop declarations for each. `TextProps extends Omit<RNTextProps, 'style'>` ensures the `style` prop is re-declared with the correct projected type.

**Alternatives considered**:

- Explicit whitelist of forwarded props — rejected; would break callers whenever RN adds new props or when accessibility props are needed

---

## 5. TypeScript Indexing Pattern

**Decision**: Cast `styles` to `Record<TextVariant, TextStyle>` before indexing; use `Object.hasOwn()` for the runtime guard.

**Rationale**: `StyleSheet.create({})` in React Native returns a type with specific literal keys and no index signature. TypeScript rejects `obj[stringVar]` on such types. Casting to `Record<TextVariant, TextStyle>` is the narrowest safe cast that preserves completeness without introducing `any`. `Object.hasOwn()` is the ESLint-preferred modern API over `Object.prototype.hasOwnProperty.call()`.

**Alternatives considered**:

- `(styles as any)[...]` — rejected; violates Principle IV (no `any`)
- Type assertion with `as TextStyle` on each access — rejected; less readable than a single cast

---

## 6. ApplicationStyles Spread

**Decision**: Spread `...ApplicationStyles(theme)` as the first entry in `StyleSheet.create`.

**Rationale**: Required by Constitution Principle II. `ApplicationStyles` provides shared layout primitives (`buttonContainer`, `buttonBorderStyle`, etc.) that higher-level consumers may rely on when they adopt this component. The spread does not conflict with any of the 33 typography variant keys.

---

## 7. React.memo

**Decision**: Wrap the inner component with `memo()` and set `displayName = 'Text'`.

**Rationale**: Required by Constitution Principle VIII. `Text` renders on every screen and is used inside list items in some modules. `memo` prevents re-renders when parent re-renders without changing `Text`'s props. `displayName` ensures meaningful component names appear in React DevTools.
