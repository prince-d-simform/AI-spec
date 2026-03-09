# Tasks: Product Category Data Integration

**Input**: Design documents from `/specs/001-category-api-integration/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ProductCategoriesContract.md, quickstart.md

**Tests**: No explicit TDD or automated test requirement was requested in the feature specification, so this task list focuses on implementation and validation tasks.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Every task includes exact file paths in the description

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the feature-scoped UI scaffold required by the Home category flow.

- [x] T001 Create the category shimmer component scaffold in app/modules/home/sub-components/category-chip-shimmer/CategoryChipShimmer.tsx, app/modules/home/sub-components/category-chip-shimmer/CategoryChipShimmerStyles.ts, app/modules/home/sub-components/category-chip-shimmer/CategoryChipShimmerTypes.ts, and app/modules/home/sub-components/category-chip-shimmer/index.ts
- [x] T002 [P] Add shimmer component export paths in app/modules/home/sub-components/index.ts and app/modules/home/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared API and Redux infrastructure that all user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Update centralized category API configuration in app/constants/AppEnvConst.ts, app/constants/APIConst.ts, and app/constants/ToolkitAction.ts
- [x] T004 [P] Align shared API client usage and transport exports in app/configs/APIConfig.ts, app/types/ProductCategoryResponse.ts, and app/types/index.ts
- [x] T005 [P] Define the shared products category state contract in app/redux/products/ProductsInitial.ts and app/redux/products/ProductsSelector.ts
- [x] T006 Register and re-export the products Redux domain in app/redux/Store.ts, app/redux/products/index.ts, and app/redux/index.ts

**Checkpoint**: Foundation ready — the Home module can now consume centralized category API state.

---

## Phase 3: User Story 1 - View all available product categories (Priority: P1) 🎯 MVP

**Goal**: Show current shopper-visible product categories from DummyJSON on the Home screen.

**Independent Test**: Open the Home screen with the category API available and verify that the category chips are populated from the remote response, duplicates are removed, blank names fall back to slug-derived labels, and loading shows shimmer placeholders instead of text.

### Implementation for User Story 1

- [x] T007 [P] [US1] Reduce the Home category UI model to `slug` and `name` in app/modules/home/HomeTypes.ts and remove the static category source while keeping `PRODUCTS` in app/modules/home/HomeData.ts
- [x] T008 [P] [US1] Implement themed shimmer placeholder styles and component rendering in app/modules/home/sub-components/category-chip-shimmer/CategoryChipShimmer.tsx, app/modules/home/sub-components/category-chip-shimmer/CategoryChipShimmerStyles.ts, app/modules/home/sub-components/category-chip-shimmer/CategoryChipShimmerTypes.ts, and app/modules/home/HomeStyles.ts
- [x] T009 [US1] Implement the category fetch thunk and deduplicated slug/name normalization in app/redux/products/ProductsSlice.ts
- [x] T010 [US1] Connect initial category loading and loading-state selectors in app/modules/home/useHome.tsx
- [x] T011 [US1] Render API-backed category chips and shimmer placeholders in app/modules/home/HomeScreen.tsx

**Checkpoint**: User Story 1 is complete when remote categories render on the Home screen without relying on the old static category list.

---

## Phase 4: User Story 2 - Return to the complete catalog view (Priority: P2)

**Goal**: Keep a shopper-friendly `All` option available so the complete product grid can always be restored.

**Independent Test**: Select any category, then select `All` and verify the full local product grid returns; also confirm that empty category responses and removed selections fall back to `All`.

### Implementation for User Story 2

- [x] T012 [US2] Define the synthetic `All` category fallback contract in app/redux/products/ProductsInitial.ts
- [x] T013 [US2] Prepend `All` to normalized category data and reset stale selections to `all` in app/redux/products/ProductsSlice.ts and app/modules/home/useHome.tsx
- [x] T014 [US2] Keep the `All` chip visible and restore full-grid filtering behavior in app/modules/home/HomeScreen.tsx and app/modules/home/useHome.tsx

**Checkpoint**: User Story 2 is complete when shoppers can always return to the full catalog through `All`, even after empty or stale category states.

---

## Phase 5: User Story 3 - Recover from unavailable category data (Priority: P3)

**Goal**: Keep the Home screen usable when category loading fails and provide a clear retry path.

**Independent Test**: Simulate a failed category request and verify that the Home screen stays visible, shows only `All`, displays category-specific feedback, and retries successfully.

### Implementation for User Story 3

- [x] T015 [P] [US3] Add category failure and retry copy in app/translations/en.json and app/constants/Strings.ts
- [x] T016 [US3] Return `All`-only failure and empty-result state in app/redux/products/ProductsSlice.ts and app/redux/products/ProductsSelector.ts
- [x] T017 [US3] Wire retry dispatch handling in app/modules/home/useHome.tsx
- [x] T018 [US3] Show category-specific error and retry UI without blocking the Home screen in app/modules/home/HomeScreen.tsx and app/modules/home/HomeStyles.ts

**Checkpoint**: User Story 3 is complete when category request failures no longer block the Home screen and the retry flow restores categories correctly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Clean up obsolete category artifacts and validate the feature end to end.

- [x] T019 [P] Remove obsolete static category and loading string entries from app/translations/en.json and app/constants/Strings.ts
- [x] T020 [P] Verify barrel exports for the new category loading flow in app/modules/home/sub-components/index.ts, app/modules/home/index.ts, and app/redux/products/index.ts
- [x] T021 Run the feature validation steps from specs/001-category-api-integration/quickstart.md against package.json and all touched app files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** — no dependencies; can start immediately
- **Phase 2: Foundational** — depends on Phase 1; blocks all user stories
- **Phase 3: US1** — depends on Phase 2; delivers the MVP
- **Phase 4: US2** — depends on US1 because the `All` behavior builds on the live category row
- **Phase 5: US3** — depends on US1 and US2 because failure fallback must preserve the `All` behavior
- **Phase 6: Polish** — depends on all desired user stories being complete

### User Story Dependency Graph

- **US1 (P1)** → **US2 (P2)** → **US3 (P3)**

### Within Each User Story

- Shared types and scaffolding before Redux normalization or screen wiring
- Redux data handling before hook orchestration
- Hook orchestration before screen rendering changes
- Story validation before moving to the next priority

### Parallel Opportunities

- **Setup**: T002 can run in parallel with T001 after the shimmer scaffold files are created
- **Foundational**: T004 and T005 can run in parallel after T003 defines the shared API contract
- **US1**: T007 and T008 can run in parallel
- **US3**: T015 can run in parallel with T016
- **Polish**: T019 and T020 can run in parallel

---

## Parallel Example: User Story 1

```text
Task: T007 [US1] Reduce the Home category UI model in app/modules/home/HomeTypes.ts and app/modules/home/HomeData.ts
Task: T008 [US1] Implement shimmer component files in app/modules/home/sub-components/category-chip-shimmer/* and app/modules/home/HomeStyles.ts
```

## Parallel Example: User Story 2

```text
Task: T012 [US2] Define the synthetic `All` category in app/redux/products/ProductsInitial.ts
Task: T013 [US2] Prepend `All` and reset stale selections in app/redux/products/ProductsSlice.ts and app/modules/home/useHome.tsx
```

## Parallel Example: User Story 3

```text
Task: T015 [US3] Add retry/error copy in app/translations/en.json and app/constants/Strings.ts
Task: T016 [US3] Return `All`-only failure state in app/redux/products/ProductsSlice.ts and app/redux/products/ProductsSelector.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm live categories render with shimmer loading and normalized labels
5. Demo or merge the MVP if only category visibility is required initially

### Incremental Delivery

1. Deliver US1 to replace static categories with API-driven categories
2. Add US2 to guarantee the `All` fallback and stale-selection reset behavior
3. Add US3 to make failure and retry behavior resilient
4. Finish with Phase 6 validation and cleanup

### Parallel Team Strategy

With multiple developers:

1. One developer handles shared API/constants updates in Phase 2
2. One developer prepares Redux state and selectors in Phase 2
3. After Foundation:
   - Developer A: US1 Home typing/loading UI
   - Developer B: US1 Redux normalization
   - Developer C: US3 copy and failure-state support after US2 is ready

---

## Notes

- [P] tasks touch different files and can be worked in parallel once dependencies are satisfied
- Each user story is independently testable from the Home screen
- The suggested MVP scope is **User Story 1**
- Validation should follow the scenarios documented in specs/001-category-api-integration/quickstart.md
