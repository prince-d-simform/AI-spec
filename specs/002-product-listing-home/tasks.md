# Tasks: Product Listing Home Screen

**Input**: Design documents from `/specs/002-product-listing-home/`  
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/HomeScreenContract.md ✅ · quickstart.md ✅  
**Tests**: Not requested — no test tasks generated.  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to — Setup/Foundational phases carry no story label
- All paths are relative to the workspace root

---

## Phase 1: Setup (Global Shared Modifications)

**Purpose**: Extend theme tokens and string system — required by every downstream task

- [x] T001 [P] Add 14 pastel + semantic UI color tokens (`pastelRose`, `pastelMint`, `pastelLavender`, `pastelPeach`, `pastelSky`, `pastelLemon`, `cardBackground`, `cardShadow`, `chipInactive`, `chipInactiveText`, `ratingGold`, `imagePlaceholder`, `screenBackground`, `headerSubtitle`) to `themeColors`, `light`, and `dark` objects in `app/theme/Colors.ts`
- [x] T002 [P] Add 10 Home-namespace string keys (`discoverProducts`, `findSomething`, `categoryAll`, `categoryElectronics`, `categoryFashion`, `categoryHome`, `categoryBeauty`, `categorySports`, `emptyState`, `pricePrefix`) to `app/translations/en.json` under `"home"` and expose as a frozen `Home` object in `app/constants/Strings.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type definitions and static data that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create `app/modules/home/HomeTypes.ts` — define and export `Category`, `Product`, and `ActiveCategoryFilter` types exactly as specified in `data-model.md`
- [x] T004 Create `app/modules/home/HomeData.ts` — define `CATEGORIES` (6 entries, first slug `'all'`) and `PRODUCTS` (14 entries across 5 categories) as `readonly … as const` arrays using types from T003 and `Strings.Home.*` name values from T002; use Picsum seed URLs (`https://picsum.photos/seed/${id}/400/600`)

**Checkpoint**: Types and static data ready — all user story phases can now begin

---

## Phase 3: User Story 1 — Browse Products by Category (Priority: P1) 🎯 MVP

**Goal**: Render a horizontally scrollable category chip row; tapping a chip immediately filters the product grid to matching items; "All" chip restores full list; active chip is visually highlighted.

**Independent Test**: Launch the Home screen → tap any category chip → verify only matching products appear in the grid; tap "All" → verify full list restores; swipe chip row left/right → grid is unaffected.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create `app/modules/home/sub-components/category-chip/CategoryChipTypes.ts` — export `CategoryChipProps` interface (`category: Category`, `isActive: boolean`, `onPress: (slug: string) => void`)
- [x] T006 [P] [US1] Create `app/modules/home/sub-components/category-chip/CategoryChipStyles.ts` — define theme-aware pill-button styles using `Colors[theme]?.chipInactive`, `chipInactiveText`, and `scale()` for padding/borderRadius; no hardcoded hex or raw dimensions
- [x] T007 [US1] Create `app/modules/home/sub-components/category-chip/CategoryChip.tsx` — implement `React.memo` pill button; active state uses `Colors[theme]?.primary` background and `Colors[theme]?.white` label (weight 700); inactive uses `chipInactive`/`chipInactiveText`; calls `onPress(category.slug)` on press
- [x] T008 [US1] Create `app/modules/home/sub-components/category-chip/index.ts` — barrel-export `CategoryChip` and `CategoryChipProps`
- [x] T009 [US1] Create `app/modules/home/useHome.ts` — implement hook returning `UseHomeReturn` per `contracts/HomeScreenContract.md`; hold `activeCategory` via `useState<string>('all')`; derive `filteredProducts` with `useMemo`; wrap `handleCategoryPress`, `renderProductItem`, and `keyExtractor` in `useCallback`; expose `categories` (CATEGORIES constant)

**Checkpoint**: `CategoryChip` renders with correct active/inactive states and `useHome` filter logic is complete — US1 fully functional when composed into a screen

---

## Phase 4: User Story 2 — Browse All Products in Two-Column Grid (Priority: P1)

**Goal**: Display all products in a two-column `FlatList` grid covering the full remaining screen below the chip row; each `ProductCard` shows image (4:3, with broken-image fallback), title (2 lines max, ellipsis), price, and star rating; grid scrolls smoothly while chip row stays sticky.

**Independent Test**: Open the Home screen without tapping any chip → verify 14 product cards render in 2 equal-width columns; scroll through all rows; each card shows image, title, price, and star rating; image load failure shows a placeholder block.

### Implementation for User Story 2

- [x] T010 [P] [US2] Create `app/modules/home/sub-components/home-header/HomeHeaderTypes.ts` — export `HomeHeaderProps` (empty interface; no props required)
- [x] T011 [P] [US2] Create `app/modules/home/sub-components/home-header/HomeHeaderStyles.ts` — define styles for title (H1 bold) and subtitle (`headerSubtitle` color, smaller weight) using `scale()` and theme colors
- [x] T012 [US2] Create `app/modules/home/sub-components/home-header/HomeHeader.tsx` — render `Strings.Home.discoverProducts` as bold title and `Strings.Home.findSomething` as subtitle using the existing `Text` component from `app/components`; no props
- [x] T013 [P] [US2] Create `app/modules/home/sub-components/home-header/index.ts` — barrel-export `HomeHeader`
- [x] T014 [P] [US2] Create `app/modules/home/sub-components/product-card/ProductCardTypes.ts` — export `ProductCardProps` interface (`product: Product`)
- [x] T015 [P] [US2] Create `app/modules/home/sub-components/product-card/ProductCardStyles.ts` — define card container styles: `cardBackground`, `borderRadius: scale(12)`, shadow (`cardShadow`, elevation 4 Android); image `aspectRatio: 2/3`; title `numberOfLines` prose style; price bold primary color; rating row with `ratingGold` star
- [x] T016 [US2] Create `app/modules/home/sub-components/product-card/ProductCard.tsx` — implement `React.memo` card; `Image` with `aspectRatio: 2/3` and `resizeMode: 'cover'`; `useState` internal `imageError` flag; render `imagePlaceholder` `View` on `onError`; title with `numberOfLines={2}` and `ellipsizeMode='tail'`; price from `Strings.Home.pricePrefix + product.price.toFixed(2)`; star icon + numeric rating; no hardcoded values
- [x] T017 [US2] Create `app/modules/home/sub-components/product-card/index.ts` — barrel-export `ProductCard` and `ProductCardProps`
- [x] T018 [P] [US2] Replace `app/modules/home/HomeStyles.ts` — define `SafeAreaView` root (`flex: 1`, `screenBackground`), chip row `ScrollView` padding, `FlatList` `contentContainerStyle` (padding, `columnWrapperStyle` gap), and empty-state text styles using `scale()` and theme colors throughout
- [x] T019 [US2] Replace `app/modules/home/HomeScreen.tsx` — compose layout: `SafeAreaView` → `HomeHeader` → horizontal `ScrollView` (chip row, `showsHorizontalScrollIndicator={false}`) → `FlatList` (`numColumns={2}`, delegates all logic to `useHome()`, `ListEmptyComponent` renders `Strings.Home.emptyState`, `removeClippedSubviews`, `getItemLayout` optional, `windowSize={5}`)

**Checkpoint**: Home screen fully functional — all 14 products render in 2-column grid, chip filter works end-to-end, image fallback renders on error

---

## Phase 5: User Story 3 — Visual Polish & Production-Ready Appearance (Priority: P2)

**Goal**: Ensure every visual quality criterion from spec.md US3 acceptance scenarios is met: card elevation/shadow, chip pill shape and contrast, image aspect ratio consistency, typography hierarchy, and uniform spacing.

**Independent Test**: Visual inspection against spec.md US3 acceptance scenarios — card shadows visible on both iOS and Android, chip row pills clearly differentiate active vs inactive, images have identical aspect ratios across all cards, font weights create clear hierarchy (title H1 > subtitle > card title > card price > rating), all margins consistent.

### Implementation for User Story 3

- [x] T020 [P] [US3] Polish `app/modules/home/sub-components/product-card/ProductCard.tsx` and `ProductCardStyles.ts` — verify `elevation: 4` on Android and `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius` on iOS use `Colors[theme]?.cardShadow`; confirm `borderRadius: scale(12)` and consistent card margin via `columnWrapperStyle`; confirm image `aspectRatio: 2/3` is applied to the `Image` style (not the container) so all cards are uniform
- [x] T021 [P] [US3] Polish `app/modules/home/sub-components/category-chip/CategoryChip.tsx` and `CategoryChipStyles.ts` — confirm `borderRadius: scale(20)` (full pill), `paddingHorizontal: scale(16)`, `paddingVertical: scale(8)`; active chip font weight `'700'`; inactive chip has subtle border or background contrast clearly distinguishable from active state; verify `React.memo` shallow comparison works with `isActive` boolean
- [x] T022 [P] [US3] Polish `app/modules/home/sub-components/home-header/HomeHeader.tsx` and `HomeHeaderStyles.ts` — confirm title uses custom `Text` component with `fontWeight: '700'` and appropriate `scale()` font size; subtitle uses `Colors[theme]?.headerSubtitle` (gray); spacing between header and chip row proportionate (`marginBottom: scale(12)`)
- [x] T023 [US3] Polish `app/modules/home/HomeScreen.tsx` and `HomeStyles.ts` — verify chip row top/bottom padding creates breathing room between header and grid; verify `columnWrapperStyle` gap and `contentContainerStyle` padding produce uniform card spacing; confirm `ListEmptyComponent` empty-state text is centered and styled consistently with the rest of the screen; confirm `screenBackground` renders correctly in both light and dark themes

**Checkpoint**: Screen achieves production-quality appearance — all US3 acceptance scenarios pass visual review

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Barrel exports, format validation, and final quality gate run

- [x] T024 [P] Create `app/modules/home/sub-components/index.ts` — barrel-export `HomeHeader`, `CategoryChip`, and `ProductCard` with their prop types
- [x] T025 [P] Update `app/modules/home/index.ts` — ensure `HomeScreen`, `useHome`, `HomeTypes`, and sub-components barrel are all exported correctly
- [x] T026 Run full quality gate: `yarn lint && yarn types && yarn spelling` — resolve any TypeScript errors (`tsc --noEmit` must exit 0), lint warnings, or spelling failures before marking feature complete

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
  └── T001, T002 [can run in parallel]
        └── Phase 2 (Foundational) — BLOCKS all user stories
              ├── T003 [P] HomeTypes.ts
              └── T004 HomeData.ts (needs T003 + T002)
                    ├── Phase 3 (US1) — Category Chips + Filter Hook
                    │     ├── T005 [P] CategoryChipTypes.ts
                    │     ├── T006 [P] CategoryChipStyles.ts
                    │     ├── T007     CategoryChip.tsx
                    │     ├── T008     CategoryChip/index.ts
                    │     └── T009     useHome.ts
                    ├── Phase 4 (US2) — Product Grid + Screen
                    │     ├── T010 [P] HomeHeaderTypes.ts
                    │     ├── T011 [P] HomeHeaderStyles.ts
                    │     ├── T012     HomeHeader.tsx
                    │     ├── T013 [P] HomeHeader/index.ts
                    │     ├── T014 [P] ProductCardTypes.ts
                    │     ├── T015 [P] ProductCardStyles.ts
                    │     ├── T016     ProductCard.tsx
                    │     ├── T017     ProductCard/index.ts
                    │     ├── T018 [P] HomeStyles.ts
                    │     └── T019     HomeScreen.tsx (needs T009 + T012 + T016 + T018)
                    └── Phase 5 (US3) — Visual Polish (needs Phase 3 + Phase 4)
                          ├── T020 [P] ProductCard polish
                          ├── T021 [P] CategoryChip polish
                          ├── T022 [P] HomeHeader polish
                          └── T023     HomeScreen polish
                                └── Phase 6 (Polish) — Barrels + QA Gate
```

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 — no dependency on US2 or US3
- **US2 (P1)**: Starts after Phase 2 — no dependency on US1 (can run in parallel with US1 if staffed); HomeScreen.tsx (T019) requires T009 from US1
- **US3 (P2)**: Starts after Phase 3 + Phase 4 are complete — refines existing components

### Within Each User Story

- Types/Styles files are independent of each other → marked `[P]`
- Component `.tsx` files depend on their Types + Styles → not marked `[P]`
- `index.ts` barrels depend on the component being created → placed last in story

---

## Parallel Execution Examples

### Phase 1 — Run together

```
T001  →  app/theme/Colors.ts
T002  →  app/constants/Strings.ts + app/translations/en.json
```

### Phase 2 — Sequential (T004 needs T003)

```
T003  →  app/modules/home/HomeTypes.ts
          ↓
T004  →  app/modules/home/HomeData.ts
```

### Phase 3 (US1) — Parallel start, then sequential

```
T005  →  CategoryChipTypes.ts   ┐
T006  →  CategoryChipStyles.ts  ┘ (parallel)
          ↓
T007  →  CategoryChip.tsx
T008  →  CategoryChip/index.ts
T009  →  useHome.ts
```

### Phase 4 (US2) — Two parallel tracks, merge in HomeScreen

```
Track A                           Track B
T010  HomeHeaderTypes.ts  [P]    T014  ProductCardTypes.ts   [P]
T011  HomeHeaderStyles.ts [P]    T015  ProductCardStyles.ts  [P]
T012  HomeHeader.tsx              T016  ProductCard.tsx
T013  HomeHeader/index.ts [P]    T017  ProductCard/index.ts
                                  T018  HomeStyles.ts         [P]
                         ↓ (both tracks done)
                         T019  HomeScreen.tsx
```

### Phase 5 (US3) — All polish tasks parallel

```
T020  ProductCard polish    ┐
T021  CategoryChip polish   ├ (parallel)
T022  HomeHeader polish     ┘
          ↓
T023  HomeScreen polish
```

### Phase 6 — Barrels parallel, then QA

```
T024  sub-components/index.ts  ┐ (parallel)
T025  home/index.ts            ┘
          ↓
T026  yarn lint && yarn types && yarn spelling
```

---

## Implementation Strategy

### MVP First (US1 + US2 — both P1)

1. Complete **Phase 1**: Colors + Strings tokens
2. Complete **Phase 2**: Types + Static Data (CRITICAL — blocks all stories)
3. Complete **Phase 3**: CategoryChip + useHome → chip row filters grid
4. Complete **Phase 4**: HomeHeader + ProductCard + HomeScreen → full working screen
5. **STOP AND VALIDATE**: Manual checks from quickstart.md Steps 1–6
6. Ship/demo MVP — screen is functionally complete

### Incremental Delivery

1. **Phase 1 + 2** → Foundation ready
2. **Phase 3** → Category chip row works with filter state (US1 ✅)
3. **Phase 4** → Full product grid renders (US1 + US2 ✅)
4. **Phase 5** → Visual polish reaches production quality (US3 ✅)
5. **Phase 6** → Clean codebase, all quality gates green

### Parallel Team Strategy

With two developers after Phase 2:

| Developer A                   | Developer B                             |
| ----------------------------- | --------------------------------------- |
| T005–T009 (US1: chips + hook) | T010–T018 (US2: header + card + styles) |
| Reviews T019 together         | Reviews T019 together                   |
| T021 (US3: chip polish)       | T020 (US3: card polish)                 |
| T022 (US3: header polish)     | T023 (US3: screen polish)               |

---

## Notes

- No test tasks generated (not requested in spec.md)
- `[P]` marks tasks operating on distinct files with no in-phase dependency — safe to parallelise
- `[US1]` / `[US2]` / `[US3]` labels map directly to user stories in `spec.md`
- T019 (`HomeScreen.tsx`) is the single integration point — requires T009 (useHome), T012 (HomeHeader), T016 (ProductCard), and T018 (HomeStyles) to be complete
- All color references must use `Colors[theme]?.keyName` — no hardcoded hex
- All dimensions must use `scale()` — no hardcoded pixel values
- All strings must use `Strings.Home.*` — no inline string literals
- `React.memo` required on `ProductCard` and `CategoryChip`; `useCallback` on `handleCategoryPress`, `renderProductItem`, `keyExtractor`; `useMemo` on `filteredProducts`
