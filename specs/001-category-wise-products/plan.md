# Implementation Plan: Category-Wise Product Loading

**Branch**: `[001-category-wise-products]` | **Date**: 2026-03-10 | **Spec**: `/specs/001-category-wise-products/spec.md`
**Input**: Feature specification from `/specs/001-category-wise-products/spec.md`

## Summary

Extend the existing non-persisted `products` Redux slice so every non-`All` category chip tap issues a fresh `/products/category/{slug}` request built through the shared API path formatter, normalizes the returned products into the existing Home `Product` model, stores only the latest selected category result set in a single `productsByCategory` Redux variable, clears category-specific results on failure, and keeps `All` browsing owned separately by the existing full-catalog flow.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54  
**Primary Dependencies**: Redux Toolkit 2.5, react-redux 9.2, redux-persist 6, Apisauce 3.2, Axios 1.10, i18next 23, React Navigation 6  
**Storage**: MMKV-backed redux-persist is present for `auth`; `products` remains non-persisted remote UI state  
**Testing**: Jest via `jest-expo`, plus `yarn lint` and `yarn types`, with manual Home-screen verification for repeated taps, loading, empty, error, retry, and `All` fallback flows  
**Target Platform**: iOS and Android mobile app
**Project Type**: Mobile app  
**Performance Goals**: Meet spec targets of showing selected-category products within 3 seconds in normal connectivity sessions, ensuring the final visible list always matches the latest chip tap, and preserving smooth FlatList rendering during repeated category switching  
**Constraints**: Must build `/products/category/{slug}` using the shared API path-formatting pattern, must store category-specific results in a single `productsByCategory` variable, must trigger a fresh API call on every non-`All` chip tap, must clear category-specific results on selected-category failure, must prevent stale responses from overriding the latest selection, must keep strings centralized, and must preserve theme-driven UI  
**Scale/Scope**: Touches one feature spec, one Home feature module, one existing `products` Redux domain, shared constants/types/translations, and one external consumed category-products endpoint

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate Review

- **Feature-module architecture**: PASS — implementation remains inside `app/modules/home`, `app/redux/products`, `app/constants`, `app/types`, and translations; no new feature module or shared component domain is required.
- **Theme-first styling**: PASS — any category loading, empty, and failure states remain inside themed Home styles using `useTheme(styleSheet)`, `Colors`, and `scale()`.
- **Reusable-component priority**: PASS — existing shared components such as `Text`, `CustomButton`, and `Spinner` remain the primary UI primitives; no duplicate shared component architecture is introduced.
- **Strict TypeScript**: PASS — category endpoint payloads, normalized Home products, slice state, selectors, and hook return values remain fully typed with no `any`.
- **Centralized strings/i18n**: PASS — any new category-specific loading, empty, retry, and error copy will live in `translations/en.json` and `Strings.ts`.
- **Redux Toolkit discipline**: PASS — category-specific remote state remains in the existing `products` slice using `createAsyncThunkWithCancelToken`, typed selectors, and typed dispatch hooks; components do not make direct HTTP calls.
- **Performance-first lists**: PASS — the plan preserves memoized product cards, stable handlers, and a latest-request-only approach so repeated chip taps do not leave stale UI behind.
- **Static data discipline**: PASS — no new inline data structures are required; chip metadata remains centralized while remote category results stay in Redux.

### Post-Phase 1 Gate Review

- **Result**: PASS
- `research.md` resolves the latest-only category result ownership, failure clearing behavior, dynamic endpoint path construction, and request race strategy without violating the constitution.
- `data-model.md` keeps the category-specific state minimal by storing one latest selected-category result set plus request metadata rather than a cached map.
- `contracts/CategoryProductsContract.md` makes the external `/products/category/{slug}` interface explicit while keeping it aligned with the shared API client and path formatter.
- `quickstart.md` preserves module boundaries, centralized strings, Redux ownership, and theme-driven feedback behavior.

## Project Structure

### Documentation (this feature)

```text
specs/001-category-wise-products/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── CategoryProductsContract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── configs/
│   └── APIConfig.ts
├── constants/
│   ├── APIConst.ts
│   ├── Strings.ts
│   └── ToolkitAction.ts
├── modules/
│   └── home/
│       ├── HomeScreen.tsx
│       ├── HomeStyles.ts
│       ├── HomeTypes.ts
│       ├── useHome.tsx
│       └── sub-components/
│           └── product-card/
├── redux/
│   ├── Store.ts
│   └── products/
│       ├── ProductsInitial.ts
│       ├── ProductsSelector.ts
│       ├── ProductsSlice.ts
│       └── index.ts
├── translations/
│   └── en.json
└── types/
    ├── ProductListResponse.ts
    └── index.ts
```

**Structure Decision**: Use the existing single mobile-app structure. This feature extends the current Home feature module and the existing `products` Redux domain instead of creating a new slice, a cache-by-category structure, or a separate data layer.

## Complexity Tracking

No constitution violations or exceptional complexity were required for this plan.
