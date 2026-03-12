# Implementation Plan: Cart Quantity Controls

**Branch**: `[001-cart-quantity-controls]` | **Date**: 2026-03-12 | **Spec**: [specs/001-cart-quantity-controls/spec.md](specs/001-cart-quantity-controls/spec.md)
**Input**: Feature specification from `/specs/001-cart-quantity-controls/spec.md`

## Summary

Restore editable cart quantity controls on Product Detail and Cart while keeping `POST /carts/add` as the only cart write path. Every add, increment, decrement, and delete action will rebuild and confirm the full desired cart snapshot, removal will omit the deleted product from the payload, Product Detail and Cart will share the same confirmed quantity state, the cart summary will display 0 for missing tax and shipping while deriving a shopper-facing grand total, and the existing cart summary footer will host a checkout button.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54  
**Primary Dependencies**: Redux Toolkit 2.5, redux-persist 6, react-native-mmkv 3.3, Apisauce 3.2, React Navigation 6, i18next 23  
**Storage**: MMKV-backed redux-persist for the confirmed cart snapshot and hydration metadata  
**Testing**: `yarn lint`, `yarn types`, Jest via `jest-expo`, plus manual quickstart validation  
**Target Platform**: iOS and Android mobile app  
**Project Type**: Mobile app with feature modules and centralized Redux state  
**Performance Goals**: Keep Product Detail and Cart interactions responsive, prevent overlapping conflicting cart writes, preserve existing list memoization patterns, and keep confirmed quantity updates visible within the spec target of 2 seconds after request completion  
**Constraints**: Must use theme-first styling and centralized strings, must keep typed Redux/API layers, must avoid direct screen-level API calls, must use `cartAdd` for add/increment/decrement/delete, must omit removed products from the request payload, must preserve the last confirmed snapshot on failures, must display 0 for missing tax/shipping without storing fabricated backend values as canonical API data, and must reuse existing shared button/header/text components  
**Scale/Scope**: Single mobile app feature touching existing cart/detail modules, cart Redux domain, shared constants/types/translations, and one consumed cart API contract

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Principle I — Feature-module architecture**: PASS. Changes stay within existing `app/modules/cart`, `app/modules/details`, `app/redux/cart`, and shared constants/types/translations files; no new top-level structure is needed.
- **Principle II — Theme-first styling**: PASS. Quantity controls, delete/minus affordances, and checkout CTA will be implemented through themed styles using `useTheme(styleSheet)` and `scale()`.
- **Principle III — Reusable-component priority**: PASS. Existing shared components such as `CustomButton`, `Text`, `CustomHeader`, and `Spinner` cover the planned UI needs; no new shared component is required.
- **Principle IV — Strict TypeScript**: PASS. The plan keeps typed cart mutation intents, normalized cart snapshot contracts, selector outputs, and hook return types.
- **Principle V — Centralized strings/i18n**: PASS. All new quantity-control, delete, pricing, and checkout copy will flow through `translations/en.json` and `app/constants/Strings.ts`.
- **Principle VI — Typed Redux state management**: PASS. All cart writes remain thunk-driven in `app/redux/cart/CartSlice.ts`; no direct API calls are introduced in screens or hooks.
- **Principle VII — Typed navigation**: PASS. No new navigation route is required for this planning scope; the checkout CTA can remain non-navigating or reuse future typed navigation work later.
- **Principle VIII — Performance-first**: PASS. Existing `React.memo`, `useCallback`, `useMemo`, `FlatList`, and row-level memoization patterns remain in place; research adds a cart-wide write guard to avoid race-driven re-renders and inconsistent snapshots.
- **Principle IX — Asset management**: PASS. Existing icon libraries and assets are sufficient; no new asset pipeline changes are needed.
- **Principle X — Static data centralization**: PASS. Existing cart constants and static request helpers remain centralized; no inline configuration lists are required.

**Initial gate result**: PASS.

**Post-Phase 1 design re-check**: PASS. Research, data model, contract, and quickstart documents keep the feature inside the existing mobile module architecture, preserve typed Redux/API flows, serialize full-snapshot cart confirmations to avoid race conditions, and limit pricing fallbacks to UI-derived display values rather than fabricated canonical API state.

## Project Structure

### Documentation (this feature)

```text
specs/001-cart-quantity-controls/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── CartQuantityControlsContract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── constants/
│   ├── APIConst.ts
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

**Structure Decision**: Keep the existing React Native single-project layout and update only the already-established cart/detail feature modules, cart Redux slice, and shared constants/types/translations. No new top-level project, service layer, or navigation stack is needed for planning this feature.

## Complexity Tracking

No constitutional violations or extra complexity exceptions are expected for this feature.
