# Implementation Plan: Cart Screen and Item Controls

**Branch**: `[002-cart-screen-api]` | **Date**: 2026-03-12 | **Spec**: `/specs/002-cart-screen-api/spec.md`
**Input**: Feature specification from `/specs/002-cart-screen-api/spec.md`

## Summary

Replace the placeholder cart tab with a real cart experience that lets shoppers add a product from Product Detail, switch the bottom action into quantity controls, persist the latest confirmed cart locally across relaunches, and keep the cart tab and Product Detail page synchronized through a dedicated Redux cart domain backed by DummyJSON cart APIs (`POST /carts/add`, `PUT /carts/{cartId}`) with the latest successful API response treated as the canonical cart snapshot.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54  
**Primary Dependencies**: Redux Toolkit 2.5, react-redux 9.2, redux-persist 6, react-native-mmkv 3.3, Apisauce 3.2, Axios 1.10, React Navigation 6, i18next 23, Expo Vector Icons 15  
**Storage**: MMKV-backed redux-persist already exists; extend persistence to include a minimal confirmed `cart` snapshot independent of user id  
**Testing**: Jest via `jest-expo`, `yarn lint`, `yarn types`, and manual add/update/remove/relaunch verification on iOS and Android  
**Target Platform**: iOS and Android mobile app  
**Project Type**: Mobile app  
**Performance Goals**: Meet the spec target of updating add-to-cart and quantity controls within 2 seconds for at least 95% of successful actions, preserve responsive scrolling and quantity interactions on the cart screen, and avoid duplicate line creation during rapid taps  
**Constraints**: Must use the shared `createAsyncThunkWithCancelToken()` API pattern, must keep API responses as the source of truth after successful sync, must persist cart state locally without relying on user id, must show all cart details returned by the API, must show safe fallback rows when tax/shipping are unavailable, and must follow centralized strings, themed styling, typed navigation, and Redux architecture rules  
**Scale/Scope**: Touches the existing `details` and `cart` modules, adds one new Redux domain under `app/redux/cart`, updates store persistence, expands shared constants/translations/types, and integrates one external cart API family with create and update endpoints

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate Review

- **Feature-module architecture**: PASS — cart UI work stays in `app/modules/cart`, Product Detail integration stays in `app/modules/details`, and shared state lives in a dedicated `app/redux/cart` domain instead of screen-local coupling.
- **Theme-first styling**: PASS — all planned cart and detail control UI will use `useTheme(styleSheet)`, `ApplicationStyles(theme)`, `Colors[theme]`, and `scale()`.
- **Reusable-component priority**: PASS — shared `CustomHeader`, `CustomButton`, `Text`, and `Spinner` remain the primary shared building blocks before any new shared component is considered.
- **Strict TypeScript**: PASS — cart API payloads, normalized snapshot state, view models, selectors, route-driven cart control state, and mutation args will be fully typed.
- **Centralized strings/i18n**: PASS — new cart empty/error/summary/control labels and detail action labels will be added through `translations/en.json` and `Strings.ts`.
- **Redux Toolkit discipline**: PASS — cart mutations will be implemented as Redux Toolkit thunks in a new `cart` slice; direct API calls in screen components are avoided.
- **Persistence rule**: PASS WITH JUSTIFICATION — the constitution notes `auth` as the baseline whitelist; adding `cart` to the persisted whitelist is required by FR-016 and FR-017, and persistence will store only the latest confirmed cart snapshot rather than transient request flags.
- **Typed navigation**: PASS — the cart feature reuses the existing tab route and typed Details route without introducing untyped navigation paths.
- **Performance-first rendering**: PASS — quantity controls and cart rows will use memoized selectors/callbacks, per-product mutation guards, and list optimization for cart rows.
- **Static data and assets discipline**: PASS — the dummy API user id will be centralized outside component bodies, and no new asset bypasses are required.

### Post-Phase 1 Gate Review

- **Result**: PASS
- `research.md` resolves the cart state ownership, persistence, API source-of-truth, update strategy, and pricing fallback decisions without leaving `NEEDS CLARIFICATION` items.
- `data-model.md` defines the cart request/response contracts, normalized cart snapshot, pricing summary, view-model state, and lifecycle transitions needed by Product Detail and the cart tab.
- `contracts/CartApiContract.md` documents the external `POST /carts/add` and `PUT /carts/{cartId}` interfaces, normalization rules, and fallback handling for response-field inconsistencies.
- `quickstart.md` keeps the implementation bounded to existing repo architecture: module hooks, themed styles, centralized strings, Redux Toolkit slices/selectors, and typed navigation.

## Project Structure

### Documentation (this feature)

```text
specs/002-cart-screen-api/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── CartApiContract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── configs/
│   └── APIConfig.ts
├── constants/
│   ├── APIConst.ts
│   ├── MMKVKeys.ts
│   ├── Strings.ts
│   └── ToolkitAction.ts
├── modules/
│   ├── cart/
│   │   ├── CartScreen.tsx
│   │   ├── CartStyles.ts
│   │   ├── CartTypes.ts
│   │   ├── CartData.ts
│   │   ├── useCart.ts
│   │   ├── index.ts
│   │   └── sub-components/
│   │       ├── cart-item-row/
│   │       └── cart-summary/
│   └── details/
│       ├── DetailsScreen.tsx
│       ├── DetailsStyles.ts
│       ├── DetailsTypes.ts
│       ├── useDetails.ts
│       └── index.ts
├── redux/
│   ├── Store.ts
│   ├── index.ts
│   ├── useRedux.ts
│   └── cart/
│       ├── CartInitial.ts
│       ├── CartSelector.ts
│       ├── CartSlice.ts
│       └── index.ts
├── services/
│   └── Storage.ts
├── translations/
│   └── en.json
├── types/
│   ├── CartResponse.ts
│   └── index.ts
└── utils/
    └── NavigatorUtils.ts
```

**Structure Decision**: Use the existing single mobile-app structure. This feature introduces a dedicated `cart` Redux domain, upgrades the existing `cart` feature module from a placeholder to a full screen with feature-specific sub-components, and extends the existing `details` module rather than creating new navigation shells or a parallel product domain.

## Complexity Tracking

No constitution violations or exceptional complexity were required for this plan.
