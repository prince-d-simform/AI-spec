# Tasks: All Products Catalog Loading

**Input**: Design documents from `/specs/001-all-products-api/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ProductsCatalogContract.md, quickstart.md

**Tests**: No dedicated test tasks included. The specification and plan call for lint/type checks plus manual Home-screen verification rather than a TDD-first workflow.

**Organization**: Tasks are grouped by user story to enable independent implementation and verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no direct file dependency)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Every task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the shared contract surface for the `/products` integration

- [x] T001 Create the `/products` transport and nested payload types in app/types/ProductListResponse.ts
- [x] T002 [P] Add the `/products` endpoint and `getAllProducts` toolkit action in app/constants/APIConst.ts and app/constants/ToolkitAction.ts
- [x] T003 [P] Add centralized Home copy for product loading, retry, and refresh feedback in app/translations/en.json and app/constants/Strings.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the existing `products` Redux domain so all user stories can build on the same canonical catalog state

**⚠️ CRITICAL**: No user story work should begin until this phase is complete

- [x] T004 Extend the shared export surface for the new catalog contract in app/types/index.ts and app/redux/products/index.ts
- [x] T005 Extend the `products` slice state for canonical `allProducts`, product loading, refresh, error, and response metadata in app/redux/products/ProductsInitial.ts
- [x] T006 [P] Add typed selectors for canonical catalog, product loading, refresh, and product error state in app/redux/products/ProductsSelector.ts
- [x] T007 Implement the base `/products` thunk, response normalization helpers, and canonical catalog reducers in app/redux/products/ProductsSlice.ts

**Checkpoint**: The shared `products` Redux domain is ready for Home-screen integration

---

## Phase 3: User Story 1 - Load Complete Catalog from All (Priority: P1) 🎯 MVP

**Goal**: Load the complete remote catalog from `/products` when the Home screen opens with the `All` chip selected

**Independent Test**: Open the Home screen and confirm the default `All` view loads the full remote catalog, shows product-loading feedback while fetching, and shows the empty state if the loaded catalog is empty

### Implementation for User Story 1

- [x] T008 [US1] Replace static `PRODUCTS` sourcing with Redux-backed initial catalog fetch logic in app/modules/home/useHome.tsx
- [x] T009 [P] [US1] Render initial product loading, default `All` catalog, and empty-state behavior in app/modules/home/HomeScreen.tsx
- [x] T010 [P] [US1] Remove `PRODUCTS` as the active Home grid data source while preserving chip shimmer constants in app/modules/home/HomeData.ts

**Checkpoint**: User Story 1 should now load and display the complete `All` catalog independently

---

## Phase 4: User Story 2 - Filter Without Replacing All Results (Priority: P1)

**Goal**: Keep one canonical `allProducts` dataset in Redux while category chips only change the visible subset locally

**Independent Test**: Load the Home screen, switch across multiple category chips, then return to `All` and verify that the full catalog content set is restored unchanged

### Implementation for User Story 2

- [x] T011 [US2] Derive category-filtered products from canonical `allProducts` and reset invalid chip selections in app/modules/home/useHome.tsx
- [x] T012 [US2] Preserve canonical `allProducts` across chip changes and category reloads in app/redux/products/ProductsSlice.ts
- [x] T013 [US2] Update Home chip and status rendering for category filtering with `All`-only fallback support in app/modules/home/HomeScreen.tsx

**Checkpoint**: User Story 2 should now filter locally without mutating the stored `All` dataset

---

## Phase 5: User Story 3 - Recover Gracefully from Catalog Load Failures (Priority: P2)

**Goal**: Handle initial load failures, refresh failures, pull-to-refresh, and category-failure fallback without breaking catalog browsing

**Independent Test**: Simulate initial `/products` failure, refresh failure after a prior success, and category failure with successful product load; verify retry, pull-to-refresh, preserved catalog data, and `All`-only fallback behavior

### Implementation for User Story 3

- [x] T014 [US3] Add initial-failure versus refresh-failure reducer handling for `/products` requests in app/redux/products/ProductsSlice.ts
- [x] T015 [P] [US3] Implement retry and pull-to-refresh handlers with revisit reuse guards in app/modules/home/useHome.tsx
- [x] T016 [P] [US3] Surface retry CTA, pull-to-refresh state, refresh-failure feedback, and category-failure fallback in app/modules/home/HomeScreen.tsx

**Checkpoint**: User Story 3 should now recover gracefully while preserving the last successful catalog when available

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, cleanup, and validation across all user stories

- [x] T017 [P] Align Home/product types and card consumption with the remote catalog flow in app/modules/home/HomeTypes.ts and app/modules/home/sub-components/product-card/ProductCard.tsx
- [x] T018 Update implementation verification notes and scenario coverage in specs/001-all-products-api/quickstart.md
- [x] T019 Run lint/type cleanup across app/constants/APIConst.ts, app/constants/ToolkitAction.ts, app/constants/Strings.ts, app/types/ProductListResponse.ts, app/types/index.ts, app/redux/products/ProductsInitial.ts, app/redux/products/ProductsSelector.ts, app/redux/products/ProductsSlice.ts, app/redux/products/index.ts, app/modules/home/HomeData.ts, app/modules/home/HomeScreen.tsx, app/modules/home/HomeTypes.ts, app/modules/home/useHome.tsx, and app/translations/en.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** — No dependencies; can start immediately
- **Phase 2: Foundational** — Depends on Phase 1; blocks all user stories
- **Phase 3: User Story 1** — Depends on Phase 2; delivers the MVP
- **Phase 4: User Story 2** — Depends on Phase 2 and builds on the canonical catalog from US1
- **Phase 5: User Story 3** — Depends on Phase 2 and the product request flow established in US1
- **Phase 6: Polish** — Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion; no dependency on other user stories
- **User Story 2 (P1)**: Starts after Foundational completion, but is safest after US1 establishes canonical all-products loading
- **User Story 3 (P2)**: Starts after Foundational completion, but is safest after US1 establishes the `/products` request lifecycle

### Within Each User Story

- Shared Redux contract before Home integration
- Slice behavior before hook orchestration
- Hook orchestration before screen rendering
- Manual verification before moving to the next story

### Suggested Story Completion Order

1. **US1** → establish canonical all-products loading
2. **US2** → add local chip filtering over the stored dataset
3. **US3** → add recovery, retry, and pull-to-refresh behavior

---

## Parallel Opportunities

- **Setup**: `T002` and `T003` can run in parallel after `T001`
- **Foundational**: `T006` can run in parallel with `T005` after `T004`
- **US1**: `T009` and `T010` can run in parallel after `T008`
- **Polish**: `T017` can run in parallel with `T018`

---

## Parallel Example: User Story 1

```text
After T008 completes:
- T009 [US1] Render initial product loading, default `All` catalog, and empty-state behavior in app/modules/home/HomeScreen.tsx
- T010 [US1] Remove `PRODUCTS` as the active Home grid data source while preserving chip shimmer constants in app/modules/home/HomeData.ts
```

## Parallel Example: User Story 2

```text
No safe same-phase parallel tasks identified for US2.
T011-T013 update interdependent canonical-filter behavior across the hook, slice, and screen and should be completed sequentially.
```

## Parallel Example: User Story 3

```text
After T014 completes:
- T015 [US3] Implement retry and pull-to-refresh handlers with revisit reuse guards in app/modules/home/useHome.tsx
- T016 [US3] Surface retry CTA, pull-to-refresh state, refresh-failure feedback, and category-failure fallback in app/modules/home/HomeScreen.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the Home screen loads the full `/products` catalog under `All`
5. Demo or review the MVP before continuing

### Incremental Delivery

1. Deliver **US1** for initial remote catalog loading
2. Add **US2** for local category filtering over the stored dataset
3. Add **US3** for retry, pull-to-refresh, and graceful fallback behavior
4. Finish with Phase 6 cleanup and verification

### Parallel Team Strategy

With multiple developers:

1. One developer completes Phase 1 and Phase 2 shared Redux/type groundwork
2. After US1 contract shape is stable:
   - Developer A: Home hook updates in app/modules/home/useHome.tsx
   - Developer B: Home screen rendering in app/modules/home/HomeScreen.tsx
   - Developer C: Cleanup and shared type/card alignment in app/modules/home/HomeData.ts and app/modules/home/HomeTypes.ts

---

## Notes

- `[P]` tasks target different files with low coordination needs
- No dedicated automated test tasks were generated because the spec did not explicitly request them
- Each user story remains independently verifiable through the manual scenarios already captured in quickstart.md
- Prefer small commits per task or per checkpoint
- Validate lint/types after each logical group of implementation tasks
