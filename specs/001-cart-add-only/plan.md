# Implementation Plan: Add-Only Cart Flow

**Branch**: `[001-cart-add-only]` | **Date**: 2026-03-12 | **Spec**: [specs/001-cart-add-only/spec.md](specs/001-cart-add-only/spec.md)
**Input**: Feature specification from `/specs/001-cart-add-only/spec.md`

## Summary

Retire unsupported cart update behavior and converge the cart domain on add-only confirmation. The app will remove `cartUpdate` endpoint usage and update/remove cart actions, submit the full desired cart item list through `cartAdd` on every successful cart confirmation, keep the latest successful add response as the canonical persisted snapshot, show a non-editable added state on Product Detail, and present the Cart tab as a review-only surface.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54  
**Primary Dependencies**: Redux Toolkit 2.5, redux-persist 6, react-native-mmkv 3.3, Apisauce 3.2, React Navigation 6, i18next 23  
**Storage**: MMKV-backed redux-persist for the confirmed cart snapshot and hydration metadata  
**Testing**: `yarn lint`, `yarn types`, Jest via `jest-expo`, plus manual quickstart validation  
**Target Platform**: iOS and Android mobile app  
**Project Type**: Mobile app with feature modules and centralized Redux state  
**Performance Goals**: Maintain responsive Product Detail and Cart rendering, preserve existing list memoization patterns, and keep confirmed added-state feedback within the spec target of 2 seconds after request completion  
**Constraints**: Must use theme-first styling and centralized strings, must keep typed Redux/API layers, must avoid direct screen-level API calls, must remove unsupported direct cart edits, must use `cartAdd` for every confirmation with the full desired product list, and must preserve the last confirmed snapshot on failures  
**Scale/Scope**: Single mobile app feature touching existing cart/detail modules, cart Redux domain, shared constants/types/translations, and one consumed cart API contract

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Principle I — Feature-module architecture**: PASS. Changes remain inside existing `app/modules/cart`, `app/modules/details`, `app/redux/cart`, and shared constants/types files; no structure violations are required.
- **Principle II — Theme-first styling**: PASS. Planned UI changes remain inside themed style files and reuse `useTheme(styleSheet)` and `scale()`.
- **Principle III — Reusable-component priority**: PASS. Existing shared components such as button, text, header, and loader remain the preferred building blocks; no new shared component is required.
- **Principle IV — Strict TypeScript**: PASS. The plan keeps typed request/response contracts, selector contracts, and feature hook return types.
- **Principle V — Centralized strings/i18n**: PASS. Any copy adjustments for add-only states and review-only cart messaging will flow through `translations/en.json` and `app/constants/Strings.ts`.
- **Principle VI — Typed Redux state management**: PASS. Cart confirmation stays thunk-driven in `app/redux/cart/CartSlice.ts`; no direct API calls from components are introduced.
- **Principle VII — Typed navigation**: PASS. No navigation model changes are required.
- **Principle VIII — Performance-first**: PASS. Existing `React.memo`, `useCallback`, `useMemo`, and `FlatList` optimization patterns remain intact for the review-only cart surface.
- **Principle IX — Asset management**: PASS. No new asset pipeline changes are needed.
- **Principle X — Static data centralization**: PASS. Dummy user id and review-state metadata remain centralized in feature/static data files.

**Initial gate result**: PASS.

**Post-Phase 1 design re-check**: PASS. Research, data model, contract, and quickstart documents keep the feature inside the existing mobile module architecture, preserve typed Redux/API flows, and explicitly remove unsupported update/remove behavior instead of introducing any constitutional exception.

## Project Structure

### Documentation (this feature)

```text
specs/001-cart-add-only/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── CartAddOnlyContract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── constants/
│   ├── APIConst.ts
│   ├── MMKVKeys.ts
│   ├── Strings.ts
│   └── ToolkitAction.ts
├── modules/
│   ├── cart/
│   │   ├── CartData.ts
│   │   ├── CartScreen.tsx
│   │   ├── CartStyles.ts
│   │   ├── CartTypes.ts
│   │   ├── index.ts
│   │   ├── sub-components/
│   │   │   ├── cart-item-row/
│   │   │   └── cart-summary/
│   │   └── useCart.ts
│   └── details/
│       ├── DetailsScreen.tsx
│       ├── DetailsStyles.ts
│       ├── DetailsTypes.ts
│       ├── index.ts
│       └── useDetails.ts
├── redux/
│   ├── Store.ts
│   ├── cart/
│   │   ├── CartInitial.ts
│   │   ├── CartSelector.ts
│   │   ├── CartSlice.ts
│   │   └── index.ts
│   └── index.ts
├── translations/
│   └── en.json
└── types/
    ├── CartResponse.ts
    └── index.ts
```

**Structure Decision**: Keep the existing React Native single-project layout and update only the already-established cart/detail feature modules, cart Redux slice, and shared constants/types/translations. No new top-level project or service layer is needed.

## Complexity Tracking

No constitutional violations or extra complexity exceptions are expected for this feature.
