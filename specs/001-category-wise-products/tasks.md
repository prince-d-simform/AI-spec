# Tasks: Category-Wise Product Loading

**Input**: Design documents from `/specs/001-category-wise-products/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/CategoryProductsContract.md, quickstart.md

**Tests**: No dedicated test tasks included. The specification and plan call for lint/type checks plus manual Home-screen verification rather than a TDD-first workflow.

**Organization**: Tasks are grouped by user story to enable independent implementation and verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no direct file dependency)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Every task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the shared endpoint and type surface for category-wise product loading

- [x] T001 Add the `/products/category/{slug}` endpoint constant and `getCategoryProducts` toolkit action in app/constants/APIConst.ts and app/constants/ToolkitAction.ts
- [x] T002 [P] Extend shared product transport exports for category-products wrapper reuse in app/types/ProductListResponse.ts and app/types/index.ts
- [x] T003 [P] Add centralized Home copy for category-specific loading, empty, retry, and failure feedback in app/translations/en.json and app/constants/Strings.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the existing `products` Redux domain so all user stories can build on the same latest-only selected-category state

**⚠️ CRITICAL**: No user story work should begin until this phase is complete

- [x] T004 Extend the `products` slice state for `productsByCategory`, selected slug, latest-request tracking, and category response metadata in app/redux/products/ProductsInitial.ts
- [x] T005 [P] Add typed selectors for `productsByCategory`, selected category slug, category loading, and category error state in app/redux/products/ProductsSelector.ts
- [x] T006 Implement the base `/products/category/{slug}` thunk, path-based request wiring, normalization reuse, and latest-request-only reducers in app/redux/products/ProductsSlice.ts
- [x] T007 [P] Align the `products` Redux barrel exports for the new category-products state and actions in app/redux/products/index.ts

**Checkpoint**: The shared `products` Redux domain is ready for Home-screen category integration

---

## Phase 3: User Story 1 - Load Selected Category Products (Priority: P1) 🎯 MVP

**Goal**: Load selected-category products from `/products/category/{slug}` whenever the shopper taps a non-`All` chip

**Independent Test**: Open the Home screen, tap a non-`All` category chip, and confirm the visible grid switches to the selected category with category-specific loading feedback during the request

### Implementation for User Story 1

- [x] T008 [US1] Dispatch a fresh category-products request on every non-`All` chip tap and switch visible products between `allProducts` and `productsByCategory` in app/modules/home/useHome.tsx
- [x] T009 [P] [US1] Render category-specific loading feedback and selected-category product results in app/modules/home/HomeScreen.tsx
- [x] T010 [P] [US1] Align Home feature typing and product-card consumption for selected-category server results in app/modules/home/HomeTypes.ts and app/modules/home/sub-components/product-card/ProductCard.tsx

**Checkpoint**: User Story 1 should now load and display selected-category products independently

---

## Phase 4: User Story 2 - Keep Category Results in One Shared Source (Priority: P1)

**Goal**: Keep exactly one latest-only `productsByCategory` dataset in Redux while ensuring the most recent chip selection is the only category result that can win

**Independent Test**: Tap several category chips in sequence, including repeated taps on the same chip, and confirm the Home screen always ends on the latest selected category result set from the single shared source

### Implementation for User Story 2

- [x] T011 [US2] Track and abort stale in-flight category requests while preserving the final active chip in app/modules/home/useHome.tsx
- [x] T012 [US2] Enforce latest-request-only success and replacement behavior for `productsByCategory` in app/redux/products/ProductsSlice.ts
- [x] T013 [US2] Update Home category-chip interaction and visible-list rendering so `All` exits category-specific browsing cleanly in app/modules/home/HomeScreen.tsx

**Checkpoint**: User Story 2 should now keep only the latest selected category result set in the shared source

---

## Phase 5: User Story 3 - Handle Empty and Failed Category Loads Clearly (Priority: P2)

**Goal**: Surface category-specific empty, error, and retry behavior while clearing category results on failure and preserving correct `All` behavior

**Independent Test**: Simulate an empty selected-category response and a failed category request, then verify the screen shows the correct empty/error feedback, clears category results on failure, and retries the currently selected category successfully

### Implementation for User Story 3

- [x] T014 [US3] Add selected-category failure clearing, retry state, and empty-result handling in app/redux/products/ProductsSlice.ts
- [x] T015 [P] [US3] Implement selected-category retry behavior and error-state derivations in app/modules/home/useHome.tsx
- [x] T016 [P] [US3] Surface category-specific empty, retry, and failure UI states in app/modules/home/HomeScreen.tsx and app/modules/home/HomeStyles.ts

**Checkpoint**: User Story 3 should now recover clearly from empty and failed category loads

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, documentation, and validation across all user stories

- [x] T017 [P] Update implementation and verification guidance for category-wise loading in specs/001-category-wise-products/quickstart.md and specs/001-category-wise-products/contracts/CategoryProductsContract.md
- [x] T018 [P] Align the final documented state model with implementation decisions in specs/001-category-wise-products/data-model.md
- [x] T019 Run lint/type cleanup across app/constants/APIConst.ts, app/constants/ToolkitAction.ts, app/constants/Strings.ts, app/types/ProductListResponse.ts, app/types/index.ts, app/redux/products/ProductsInitial.ts, app/redux/products/ProductsSelector.ts, app/redux/products/ProductsSlice.ts, app/redux/products/index.ts, app/modules/home/HomeTypes.ts, app/modules/home/useHome.tsx, app/modules/home/HomeScreen.tsx, app/modules/home/HomeStyles.ts, app/modules/home/sub-components/product-card/ProductCard.tsx, and app/translations/en.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** — No dependencies; can start immediately
- **Phase 2: Foundational** — Depends on Phase 1; blocks all user stories
- **Phase 3: User Story 1** — Depends on Phase 2; delivers the MVP
- **Phase 4: User Story 2** — Depends on Phase 2 and builds on the category request flow established in US1
- **Phase 5: User Story 3** — Depends on Phase 2 and the selected-category lifecycle established in US1
- **Phase 6: Polish** — Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion; no dependency on other user stories
- **User Story 2 (P1)**: Starts after Foundational completion, but is safest after US1 establishes selected-category loading
- **User Story 3 (P2)**: Starts after Foundational completion, but is safest after US1 establishes selected-category request handling

### Within Each User Story

- Redux contract before Home integration
- Hook orchestration before final screen-state rendering
- Request lifecycle before failure/empty refinements
- Manual verification before moving to the next story

### Suggested Story Completion Order

1. **US1** → establish selected-category server loading
2. **US2** → enforce latest-only shared category results
3. **US3** → add clear empty/failure/retry behavior

---

## Parallel Opportunities

- **Setup**: `T002` and `T003` can run in parallel after `T001`
- **Foundational**: `T005` and `T007` can run in parallel after `T004`, while `T006` remains the core blocking slice implementation
- **US1**: `T009` and `T010` can run in parallel after `T008`
- **US3**: `T015` and `T016` can run in parallel after `T014`
- **Polish**: `T017` and `T018` can run in parallel before `T019`

---

## Parallel Example: User Story 1

```text
After T008 completes:
- T009 [US1] Render category-specific loading feedback and selected-category product results in app/modules/home/HomeScreen.tsx
- T010 [US1] Align Home feature typing and product-card consumption for selected-category server results in app/modules/home/HomeTypes.ts and app/modules/home/sub-components/product-card/ProductCard.tsx
```

## Parallel Example: User Story 2

```text
No safe same-phase parallel tasks identified for US2.
T011-T013 all update the same latest-only category-selection flow across the hook, slice, and screen and should be completed sequentially.
```

## Parallel Example: User Story 3

```text
After T014 completes:
- T015 [US3] Implement selected-category retry behavior and error-state derivations in app/modules/home/useHome.tsx
- T016 [US3] Surface category-specific empty, retry, and failure UI states in app/modules/home/HomeScreen.tsx and app/modules/home/HomeStyles.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the Home screen loads selected-category products from `/products/category/{slug}`
5. Demo or review the MVP before continuing

### Incremental Delivery

1. Deliver **US1** for selected-category server loading
2. Add **US2** for latest-only shared category-result ownership
3. Add **US3** for empty, retry, and failure behavior
4. Finish with Phase 6 cleanup and validation

### Parallel Team Strategy

With multiple developers:

1. One developer completes Phase 1 and Phase 2 shared Redux/type groundwork
2. After the selected-category contract is stable:
   - Developer A: Home hook updates in app/modules/home/useHome.tsx
   - Developer B: Home screen rendering in app/modules/home/HomeScreen.tsx and app/modules/home/HomeStyles.ts
   - Developer C: Shared type and documentation alignment in app/modules/home/HomeTypes.ts, app/modules/home/sub-components/product-card/ProductCard.tsx, and specs/001-category-wise-products/

---

## Notes

- `[P]` tasks target different files with low coordination needs
- No dedicated automated test tasks were generated because the spec did not explicitly request them
- Each user story remains independently verifiable through the manual scenarios already captured in quickstart.md
- Prefer small commits per task or per checkpoint
- Validate lint/types after each logical group of implementation tasks
