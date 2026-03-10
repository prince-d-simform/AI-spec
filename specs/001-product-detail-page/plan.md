# Implementation Plan: Product Detail Page

**Branch**: `001-product-detail-page` | **Date**: 2026-03-10 | **Spec**: `/specs/001-product-detail-page/spec.md`
**Input**: Feature specification from `/specs/001-product-detail-page/spec.md`

## Summary

Extend the existing product-browsing experience so tapping a product immediately navigates to a new Product Detail page, then loads `/products/{id}` through the shared API path formatter, stores the active product detail in the existing non-persisted `products` Redux domain, and renders a marketplace-style detail layout with dedicated loading, error, unavailable, retry, and back states.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54  
**Primary Dependencies**: Redux Toolkit 2.5, react-redux 9.2, redux-persist 6, Apisauce 3.2, Axios 1.10, i18next 23, React Navigation 6  
**Storage**: MMKV-backed redux-persist is present for `auth`; product-detail UI state remains non-persisted Redux state in memory  
**Testing**: Jest via `jest-expo`, plus `yarn lint` and `yarn types`, with manual navigation and Product Detail verification on Home and Details flows  
**Target Platform**: iOS and Android mobile app
**Project Type**: Mobile app  
**Performance Goals**: Meet the spec goal of reaching the Product Detail page within 2 seconds for at least 95% of tested taps under normal connectivity, maintain responsive scrolling on a content-rich detail screen, and keep final visible content aligned with the most recently opened product  
**Constraints**: Must use `/products/{id}` via the shared API path-template pattern, must navigate immediately but show a dedicated loading state until full details arrive, must show every major field returned by the endpoint when available, must present unavailable products with retry and back actions, must use centralized strings, typed navigation, theme-driven styles, and existing shared components  
**Scale/Scope**: Touches one feature spec, the existing `details` module, the existing `products` Redux domain, shared constants/types/navigation/translations, and one external consumed product-detail endpoint

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate Review

- **Feature-module architecture**: PASS — the feature stays within `app/modules/details`, `app/modules/home`, `app/redux/products`, `app/constants`, `app/navigation`, `app/types`, and translations; no new feature module root is introduced.
- **Theme-first styling**: PASS — the detail page will use a themed styles file in the existing details module and shared theme primitives rather than hardcoded styling.
- **Reusable-component priority**: PASS — shared `Text`, `CustomButton`, `Spinner`, and existing navigation helpers will be reused before introducing any new shared UI.
- **Strict TypeScript**: PASS — route params, remote detail payloads, normalized detail state, selectors, and hook return types will be fully typed.
- **Centralized strings/i18n**: PASS — all new loading, unavailable, retry, review, and metadata labels will be routed through `translations/en.json` and `Strings.ts`.
- **Redux Toolkit discipline**: PASS — async detail loading will use `createAsyncThunkWithCancelToken` in the existing `products` slice rather than direct API calls in components.
- **Typed navigation**: PASS — the Details route param contract will be updated in the stack param list and navigation helpers will remain the route-entry mechanism.
- **Performance-first lists and rendering**: PASS — Home item interactions stay memoized, the detail screen will derive sections with `useMemo`, and the request lifecycle will prevent stale product detail results from overriding the active product.
- **Asset management and static data discipline**: PASS — remote images remain remote URLs, and any static section definitions or labels can be centralized instead of inlined repeatedly.

### Post-Phase 1 Gate Review

- **Result**: PASS
- `research.md` resolves the open architectural choices by keeping detail state in the existing `products` slice, using a single active detail substate, and fetching `/products/{id}` fresh on each screen open.
- `data-model.md` defines the route params, remote detail payload, normalized product-detail model, review entities, and detail-state lifecycle without violating existing module or typing rules.
- `contracts/ProductDetailContract.md` makes the external `/products/{id}` interface explicit while preserving the shared API path-substitution pattern already used by the repo.
- `quickstart.md` keeps navigation, strings, theming, and Redux ownership aligned with the constitution and existing app architecture.

## Project Structure

### Documentation (this feature)

```text
specs/001-product-detail-page/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ProductDetailContract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── configs/
│   └── APIConfig.ts
├── constants/
│   ├── APIConst.ts
│   ├── NavigationRoutes.ts
│   ├── Strings.ts
│   └── ToolkitAction.ts
├── modules/
│   ├── details/
│   │   ├── DetailsScreen.tsx
│   │   ├── DetailsStyles.ts
│   │   ├── DetailsTypes.ts
│   │   ├── useDetails.ts
│   │   ├── index.ts
│   │   └── sub-components/
│   │       └── ...
│   └── home/
│       ├── HomeScreen.tsx
│       ├── HomeTypes.ts
│       ├── useHome.tsx
│       └── sub-components/
│           └── product-card/
├── navigation/
│   └── AppNavigation.tsx
├── redux/
│   ├── Store.ts
│   └── products/
│       ├── ProductsInitial.ts
│       ├── ProductsSelector.ts
│       ├── ProductsSlice.ts
│       └── index.ts
├── translations/
│   └── en.json
├── types/
│   ├── ProductListResponse.ts
│   └── index.ts
└── utils/
    └── NavigatorUtils.ts
```

**Structure Decision**: Use the existing single mobile-app structure. This feature expands the current `details` feature module, wires Home product-card taps into typed stack navigation, and extends the existing `products` Redux domain instead of creating a new store slice or a second product-detail domain.

## Complexity Tracking

No constitution violations or exceptional complexity were required for this plan.
