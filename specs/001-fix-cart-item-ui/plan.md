# Implementation Plan: Cart Item UI Refinement

**Branch**: `[001-fix-cart-item-ui]` | **Date**: 2026-03-12 | **Spec**: [specs/001-fix-cart-item-ui/spec.md](specs/001-fix-cart-item-ui/spec.md)
**Input**: Feature specification from `/specs/001-fix-cart-item-ui/spec.md`

## Summary

Refine the cart row to match the attached wireframe-style structure: a fixed two-row card with image in the upper-left, name plus discounted-total stack in the upper-right, quantity controls in the lower-left, and unit/line/discount pricing in the lower-right. The plan preserves existing cart business logic, keeps typed navigation to the existing `Details` route, removes visible product ID, and maintains predictable list performance through stable layout constraints.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54  
**Primary Dependencies**: React Navigation 6, Redux Toolkit 2.5, react-redux 9.2, Expo Vector Icons 15, i18next 23  
**Storage**: Existing MMKV-backed redux-persist cart snapshot; no new storage required  
**Testing**: `yarn lint`, `yarn types`, Jest via `jest-expo`, plus manual quickstart verification  
**Target Platform**: iOS and Android mobile app  
**Project Type**: React Native mobile app with feature modules and centralized Redux state  
**Performance Goals**: Preserve smooth cart-list scrolling, keep row rendering memoized, keep `FlatList` virtualization predictable, and keep row-tap response effectively immediate  
**Constraints**: Must follow theme-first styling, centralized strings, typed navigation through `NavigatorUtils`, current cart mutation rules, the attached four-zone wireframe hierarchy, and readable fallback states for long titles, missing images, and mixed pricing  
**Scale/Scope**: One existing feature screen and row sub-component set under `app/modules/cart`, plus supporting string and planning documents

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Principle I — Clean Code & Feature-Module Architecture**: PASS. The work stays inside the existing cart module and row sub-component structure, with shared copy updates only.
- **Principle II — Theme-First Styling**: PASS. The attached wireframe will be implemented with themed styles, `Colors[theme]`, and `scale()` rather than hardcoded values.
- **Principle III — Reusable-Component Priority**: PASS. Existing shared `Text`, `CustomHeader`, `Spinner`, and button patterns remain sufficient.
- **Principle IV — Strict TypeScript**: PASS. Row view-models, navigation handlers, and interaction contracts remain fully typed.
- **Principle V — Centralised String Management & Internationalisation**: PASS. Any new accessibility or shopper-facing copy remains centralized in `translations/en.json` and `app/constants/Strings.ts`.
- **Principle VI — Redux Toolkit — Typed, Slice-Based State Management**: PASS. The feature is presentation-focused and does not alter cart state ownership or introduce new side-effect paths.
- **Principle VII — Typed Navigation — ROUTES Enum & NavigatorUtils**: PASS. Product-row taps continue to use `navigateWithPush(ROUTES.Details, { id })`.
- **Principle VIII — Performance-First**: PASS. The plan preserves `React.memo`, `useCallback`, `useMemo`, and fixed-height list optimization patterns.
- **Principle IX — Asset Management**: PASS. Existing thumbnail and placeholder assets are reused; no new asset workflow is needed.
- **Principle X — Static Data**: PASS. No new inline configuration or static data collections are required.

**Initial gate result**: PASS.

**Post-Phase 1 design re-check**: PASS. The research, data model, contract, and quickstart artifacts keep the feature within the current cart module, preserve typed route usage, avoid cart-business-rule changes, and explicitly align the UI to the attached four-zone wireframe.

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-cart-item-ui/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── CartItemUiContract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── constants/
│   └── Strings.ts
├── modules/
│   └── cart/
│       ├── CartData.ts
│       ├── CartScreen.tsx
│       ├── CartStyles.ts
│       ├── CartTypes.ts
│       ├── index.ts
│       ├── sub-components/
│       │   └── cart-item-row/
│       │       ├── CartItemRow.tsx
│       │       ├── CartItemRowStyles.ts
│       │       ├── CartItemRowTypes.ts
│       │       └── index.ts
│       └── useCart.ts
└── translations/
    └── en.json
```

**Structure Decision**: Keep the existing single React Native project structure and refine only the current cart module, row contracts, and supporting strings so the implemented layout matches the attached wireframe without restructuring navigation or Redux layers.

## Complexity Tracking

No constitutional violations or complexity exceptions are expected for this feature.
