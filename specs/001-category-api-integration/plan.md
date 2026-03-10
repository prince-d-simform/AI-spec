# Implementation Plan: Product Category Data Integration

**Branch**: `[001-category-api-integration]` | **Date**: 2026-03-09 | **Spec**: `/specs/001-category-api-integration/spec.md`
**Input**: Feature specification from `/specs/001-category-api-integration/spec.md`

## Summary

Replace static home-screen categories with live category data from `https://dummyjson.com/products/categories` by reusing the existing centralized `AppEnvConst.apiUrl` reference, loading categories through a typed non-persisted `products` Redux slice, normalizing records to `{ slug, name }`, always prepending an `All` option, resetting invalid selections to `all`, and replacing the current loading text with themed shimmer chip placeholders while preserving retry behavior for failures.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54  
**Primary Dependencies**: Redux Toolkit 2.5, react-redux 9.2, redux-persist 6, Apisauce 3.2, Axios 1.10, i18next 23, React Navigation 6  
**Storage**: MMKV-backed redux-persist is present for `auth`; category state remains non-persisted remote UI state  
**Testing**: Jest via `jest-expo`, plus `yarn lint` and `yarn types`, with manual Home screen verification for loading/error/refresh states  
**Target Platform**: iOS and Android mobile app  
**Project Type**: Mobile app  
**Performance Goals**: Meet spec target of category visibility within 3 seconds in normal connectivity sessions, preserve smooth horizontal chip rendering, and avoid layout shift during loading by using shimmer placeholders  
**Constraints**: Must reuse the single central `AppEnvConst.apiUrl` reference with DummyJSON fallback, keep endpoint path-only in `APIConst.ts`, avoid category `id` usage, keep `All` always visible, keep the Home screen usable on empty/failure responses, keep all strings centralized, and keep styles theme-driven  
**Scale/Scope**: Touches one feature spec, one Home module, one `products` Redux slice, shared API config/constants, translations, and one external consumed endpoint

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate Review

- **Feature-module architecture**: PASS — changes are contained to `app/modules/home`, `app/redux/products`, `app/constants`, `app/configs`, and typed shared files; any new loading placeholder remains feature-scoped under Home sub-components.
- **Theme-first styling**: PASS — shimmer placeholders and status states will use `useTheme(styleSheet)`, `Colors`, and `scale()` rather than hardcoded values.
- **Reusable-component priority**: PASS — existing `Text` and `CustomButton` remain in use; only a Home-specific category-chip shimmer is added because no equivalent shared component exists.
- **Strict TypeScript**: PASS — consumed response, normalized category shape, slice state, selectors, and hook return values remain fully typed with no `any` introduced by the feature plan.
- **Centralized strings/i18n**: PASS — retry and error copy stay in `translations/en.json` and `Strings.ts`; loading text is removed in favor of shimmer placeholders.
- **Redux Toolkit discipline**: PASS — remote category state stays in a typed `products` slice using `createAsyncThunkWithCancelToken`, selectors, and typed hooks; no component-level direct HTTP calls.
- **Performance-first lists**: PASS — Home list memoization remains, category chips continue to use stable callbacks, and shimmer placeholders avoid layout thrash.
- **Static data discipline**: PASS — static category literals are removed from Home data; local `PRODUCTS` remains unchanged and auditable.

### Post-Phase 1 Gate Review

- **Result**: PASS
- `research.md` resolves all design choices without violating the constitution.
- `data-model.md` reduces the category contract to `slug` and `name`, avoiding unnecessary UI fields.
- `contracts/ProductCategoriesContract.md` keeps the external interface explicit while preserving centralized configuration.
- `quickstart.md` preserves module boundaries, string management, Redux patterns, and theme-driven loading UI.

## Project Structure

### Documentation (this feature)

```text
specs/001-category-api-integration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ProductCategoriesContract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── configs/
│   └── APIConfig.ts
├── constants/
│   ├── APIConst.ts
│   ├── AppEnvConst.ts
│   ├── Strings.ts
│   └── ToolkitAction.ts
├── modules/
│   └── home/
│       ├── HomeScreen.tsx
│       ├── HomeStyles.ts
│       ├── HomeTypes.ts
│       ├── useHome.tsx
│       └── sub-components/
│           ├── category-chip/
│           └── category-chip-shimmer/
├── redux/
│   ├── Store.ts
│   ├── index.ts
│   └── products/
│       ├── ProductsInitial.ts
│       ├── ProductsSelector.ts
│       ├── ProductsSlice.ts
│       └── index.ts
├── theme/
│   └── Colors.ts
├── translations/
│   └── en.json
└── types/
    ├── ProductCategoryResponse.ts
    └── index.ts
```

**Structure Decision**: Use the existing single mobile-app structure. The feature is implemented by extending current centralized constants/config files, the `products` Redux domain, and the Home feature module rather than creating a separate API/backend project.

## Complexity Tracking

No constitution violations or exceptional complexity were required for this plan.
