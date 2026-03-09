# Implementation Plan: Product Listing Home Screen

**Branch**: `002-product-listing-home` | **Date**: 2026-03-06 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/002-product-listing-home/spec.md`

## Summary

Build a production-quality Home screen for the AiSpec React Native app. The screen shows:

1. A minimal branded header ("Discover Products")
2. A horizontally scrollable row of pastel-styled category filter chips (from `CATEGORIES` static dummy data — each with `name` + `slug`)
3. A full-flex two-column product grid (`FlatList numColumns={2}`) filtered by the active chip, powered by `PRODUCTS` static dummy data (each item: `id`, `title`, `rating`, `price`, `category` slug, `imageUrl`)
4. Each product card renders: image (remote picsum URL, 4:3 aspect), title (max 2 lines, ellipsis), price, star rating
5. Empty-state row when the active category has no products
6. All pastel palette values defined as named keys in `Colors.ts`; all strings in `Strings.ts` + `en.json`; all sub-components as separate 4-file units; all static data in `HomeData.ts`

## Technical Context

**Language/Version**: TypeScript 5.8 (strict mode)  
**Primary Dependencies**: React Native 0.81.4, Expo SDK 54, React Navigation v6  
**Storage**: N/A (static dummy data only, no persistence)  
**Testing**: Jest (existing config)  
**Target Platform**: iOS + Android (React Native cross-platform)  
**Project Type**: Mobile app — feature module  
**Performance Goals**: 60 fps scroll, <300ms category filter switch (local state, no async)  
**Constraints**: No hardcoded hex/dimensions/strings; `useCallback`/`React.memo` on all list items; theme-aware styling throughout  
**Scale/Scope**: 1 screen, 3 sub-components, 1 hook, 1 static data file; ~12–16 dummy products across 4–6 categories

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                                         | Status  | Notes                                                                                                                           |
| ---- | ------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| I    | Feature module layout + 4-file sub-components     | ✅ PASS | `app/modules/home/` extended; 3 sub-components each with 4 files                                                                |
| II   | Theme-first styling — no hardcoded hex/dimensions | ✅ PASS | Pastel colors added as named keys in `Colors.ts`; all dimensions via `scale()`                                                  |
| III  | Reuse existing components                         | ✅ PASS | Custom `Text` component used inside cards; no duplication of existing `Button`, `Spinner`                                       |
| IV   | Strict TypeScript, no `any`                       | ✅ PASS | All props, data shapes, and hook returns fully typed                                                                            |
| V    | Centralised strings via `Strings.ts` + `en.json`  | ✅ PASS | All UI-visible text routed through `Strings.Home.*`                                                                             |
| VI   | Redux for cross-component state                   | ✅ PASS | Active category filter is screen-local state (`useState`) — no cross-screen sharing needed; Redux not required for this feature |
| VII  | Typed navigation via ROUTES enum + NavigatorUtils | ✅ PASS | Product tap is no-op (out of scope); Home registered as existing ROUTES.Home                                                    |
| VIII | `React.memo` + `useCallback` + `useMemo` on lists | ✅ PASS | `ProductCard` and `CategoryChip` wrapped in `React.memo`; `renderItem`, `keyExtractor`, filtered list all memoised              |
| IX   | Assets via `app/assets` barrel                    | ✅ PASS | No new bundled assets; remote picsum URLs used for images                                                                       |
| X    | Static data in dedicated file, `as const`         | ✅ PASS | `HomeData.ts` at feature level; no inline arrays in components                                                                  |

**Post-design re-check**: All principles still pass after Phase 1 design. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/002-product-listing-home/
├── plan.md              ← this file
├── research.md          ← Phase 0
├── data-model.md        ← Phase 1
├── quickstart.md        ← Phase 1
├── contracts/
│   └── HomeScreenContract.md
└── tasks.md             ← Phase 2 (speckit.tasks)
```

### Source Code

```text
app/
├── theme/
│   └── Colors.ts                          MODIFY — add pastel color keys
├── constants/
│   ├── Strings.ts                         MODIFY — extend Home namespace
│   └── index.ts                           (no change needed)
├── translations/
│   └── en.json                            MODIFY — add Home strings
└── modules/
    └── home/
        ├── HomeScreen.tsx                 REPLACE — full product listing screen
        ├── HomeStyles.ts                  REPLACE — screen-level styles
        ├── HomeTypes.ts                   CREATE  — screen-level types
        ├── useHome.ts                     CREATE  — active category filter state + filtered list
        ├── HomeData.ts                    CREATE  — CATEGORIES and PRODUCTS static dummy data (as const)
        ├── index.ts                       MODIFY  — ensure barrel up-to-date
        └── sub-components/
            ├── index.ts                   CREATE  — barrel
            ├── home-header/
            │   ├── HomeHeader.tsx         CREATE  — branded greeting header
            │   ├── HomeHeaderStyles.ts    CREATE
            │   ├── HomeHeaderTypes.ts     CREATE
            │   └── index.ts              CREATE
            ├── category-chip/
            │   ├── CategoryChip.tsx       CREATE  — single chip (React.memo)
            │   ├── CategoryChipStyles.ts  CREATE
            │   ├── CategoryChipTypes.ts   CREATE
            │   └── index.ts              CREATE
            └── product-card/
                ├── ProductCard.tsx        CREATE  — single grid card (React.memo)
                ├── ProductCardStyles.ts   CREATE
                ├── ProductCardTypes.ts    CREATE
                └── index.ts             CREATE
```

**Structure Decision**: React Native mobile app — Option 3 (mobile-only) collapsed to feature-module-only because no API layer is needed. All new source lives under `app/modules/home/` per Constitution Principle I. Three sub-components are created at feature level; none are promoted to `app/components/` because they are home-screen-specific and would not be reused elsewhere.

## Complexity Tracking

> No constitution violations — table omitted per instructions.
