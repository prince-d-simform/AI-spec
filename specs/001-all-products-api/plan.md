# Implementation Plan: All Products Catalog Loading

**Branch**: `[001-all-products-api]` | **Date**: 2026-03-09 | **Spec**: `/specs/001-all-products-api/spec.md`
**Input**: Feature specification from `/specs/001-all-products-api/spec.md`

## Summary

Extend the existing non-persisted `products` Redux slice so the Home screen fetches the complete catalog from `/products` on initial loading, normalizes the response wrapper into the existing Home `Product` card model, stores one canonical `allProducts` dataset in Redux, derives category-filtered views locally in `useHome.tsx`, and supports pull-to-refresh plus retry behavior without creating a new Redux domain or changing chip-switch semantics.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54  
**Primary Dependencies**: Redux Toolkit 2.5, react-redux 9.2, redux-persist 6, Apisauce 3.2, Axios 1.10, i18next 23, React Navigation 6  
**Storage**: MMKV-backed redux-persist is present for `auth`; the `products` slice remains non-persisted remote UI state  
**Testing**: Jest via `jest-expo`, plus `yarn lint` and `yarn types`, with manual Home-screen verification for initial load, chip filtering, retry, and pull-to-refresh  
**Target Platform**: iOS and Android mobile app  
**Project Type**: Mobile app  
**Performance Goals**: Meet spec targets of showing the complete `All` catalog within 3 seconds in normal connectivity sessions, updating chip-filtered results within 0.5 seconds, and preserving smooth FlatList rendering for the full remote catalog  
**Constraints**: Must use the existing `products` Redux slice, call `/products` when Home initially loads, keep the canonical all-products dataset unchanged during chip switching, avoid automatic reload on Home revisit after first success, use pull-to-refresh for manual refresh, keep all strings centralized, and keep styling theme-driven  
**Scale/Scope**: Touches one feature spec, one Home module, one existing `products` Redux domain, shared constants/types/translations, and one consumed external `/products` endpoint

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate Review

- **Feature-module architecture**: PASS — implementation stays within `app/modules/home`, `app/redux/products`, `app/constants`, `app/types`, and translations; no new feature module or shared component domain is required.
- **Theme-first styling**: PASS — any new product loading, retry, or refresh UI remains inside themed Home styles using `useTheme(styleSheet)`, `Colors`, and `scale()`.
- **Reusable-component priority**: PASS — existing shared components such as `Text` and `CustomButton` remain the primary reusable UI primitives; no duplicate shared component architecture is introduced.
- **Strict TypeScript**: PASS — the `/products` response wrapper, nested transport types, normalized Home `Product`, slice state, selectors, and hook return values remain fully typed with no `any`.
- **Centralized strings/i18n**: PASS — product-loading, retry, and refresh-failure copy will be added under `translations/en.json` and exposed through `Strings.Home`.
- **Redux Toolkit discipline**: PASS — all remote catalog state remains in the existing `products` slice using `createAsyncThunkWithCancelToken`, typed selectors, and typed dispatch hooks; components will not make direct HTTP calls.
- **Performance-first lists**: PASS — the plan preserves `useMemo`-based filtering, existing memoized product cards, stable callbacks, and FlatList virtualization while avoiding refetches on chip switches.
- **Static data discipline**: PASS — static `PRODUCTS` stops being the production data source for Home browsing, while any remaining feature-local constants stay centralized in `HomeData.ts`.

### Post-Phase 1 Gate Review

- **Result**: PASS
- `research.md` resolves the fetch lifecycle, response normalization, refresh behavior, and slice-ownership choices without violating the constitution.
- `data-model.md` keeps the transport contract fully typed while limiting Redux/UI state to the normalized product-card data and necessary metadata.
- `contracts/ProductsCatalogContract.md` makes the external `/products` interface explicit and keeps it aligned with the existing centralized API stack.
- `quickstart.md` preserves module boundaries, existing Redux ownership, centralized strings, and performance-safe filtering behavior.

## Project Structure

### Documentation (this feature)

```text
specs/001-all-products-api/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ProductsCatalogContract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── constants/
│   ├── APIConst.ts
│   ├── Strings.ts
│   └── ToolkitAction.ts
├── configs/
│   └── APIConfig.ts
├── modules/
│   └── home/
│       ├── HomeData.ts
│       ├── HomeScreen.tsx
│       ├── HomeTypes.ts
│       ├── useHome.tsx
│       └── sub-components/
│           ├── category-chip/
│           ├── category-chip-shimmer/
│           └── product-card/
├── redux/
│   ├── Store.ts
│   ├── index.ts
│   └── products/
│       ├── ProductsInitial.ts
│       ├── ProductsSelector.ts
│       ├── ProductsSlice.ts
│       └── index.ts
├── translations/
│   └── en.json
└── types/
    ├── ProductCategoryResponse.ts
    ├── ProductListResponse.ts
    └── index.ts
```

**Structure Decision**: Use the existing single mobile-app structure. This feature extends the current Home feature module and the existing `products` Redux domain instead of creating a new Redux slice, backend project, or separate data layer.

## Complexity Tracking

No constitution violations or exceptional complexity were required for this plan.
