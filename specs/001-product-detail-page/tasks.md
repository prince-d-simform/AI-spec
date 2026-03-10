# Tasks: Product Detail Page

**Input**: Design documents from `/specs/001-product-detail-page/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ProductDetailContract.md, quickstart.md

**Tests**: No dedicated test tasks included. The specification and plan call for lint/type checks plus manual Home-to-Details verification rather than a TDD-first workflow.

**Organization**: Tasks are grouped by user story to enable independent implementation and verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no direct file dependency)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Every task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the shared endpoint, route, strings, and transport surface for Product Detail loading

- [x] T001 Add the `/products/{id}` endpoint constant, `getProductDetail` toolkit action, and typed Details route params in app/constants/APIConst.ts, app/constants/ToolkitAction.ts, and app/navigation/AppNavigation.tsx
- [x] T002 [P] Add centralized Product Detail loading, failure, unavailable, retry, back, and section-label copy in app/translations/en.json and app/constants/Strings.ts
- [x] T003 [P] Extend shared remote product-detail transport exports in app/types/ProductListResponse.ts and app/types/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the existing `products` Redux domain so all Product Detail stories build on the same active-detail lifecycle

**⚠️ CRITICAL**: No user story work should begin until this phase is complete

- [x] T004 Extend the `products` slice state for active product detail, unavailable state, request tracking, and detail timestamps in app/redux/products/ProductsInitial.ts
- [x] T005 [P] Add typed selectors for selected product detail, loading, error, unavailable, selected id, and last-updated state in app/redux/products/ProductsSelector.ts
- [x] T006 Implement the `/products/{id}` thunk, path-based request wiring, product-detail normalization, clear-detail reducer, and latest-request-only reducers in app/redux/products/ProductsSlice.ts
- [x] T007 [P] Align the `products` Redux barrel exports for the new product-detail actions and selectors in app/redux/products/index.ts

**Checkpoint**: The shared `products` Redux domain is ready for Product Detail navigation and rendering

---

## Phase 3: User Story 1 - Open Product Detail From Product List (Priority: P1) 🎯 MVP

**Goal**: Let the shopper open Product Detail from a product card and see an immediate loading-screen transition tied to the selected product

**Independent Test**: Open Home, tap any product card, and confirm the app navigates immediately to Product Detail with a dedicated loading state for the selected product

### Implementation for User Story 1

- [x] T008 [US1] Add stable product-press navigation to Product Detail using the selected product id in app/modules/home/useHome.tsx
- [x] T009 [P] [US1] Make product cards actionable for Product Detail entry in app/modules/home/sub-components/product-card/ProductCard.tsx and app/modules/home/sub-components/product-card/ProductCardTypes.ts
- [x] T010 [US1] Add route-id-based Product Detail loading orchestration in app/modules/details/DetailsTypes.ts, app/modules/details/useDetails.ts, and app/modules/details/DetailsScreen.tsx
- [x] T011 [P] [US1] Replace the placeholder Details screen styling with an initial themed loading-shell layout in app/modules/details/DetailsStyles.ts and app/modules/details/DetailsScreen.tsx

**Checkpoint**: User Story 1 should now open Product Detail from Home and show the correct initial loading experience independently

---

## Phase 4: User Story 2 - View Complete Product Information (Priority: P1)

**Goal**: Show a cool, user-friendly marketplace-style Product Detail page with all major endpoint fields when available

**Independent Test**: Open Product Detail for a successful product response and confirm the screen shows rich detail sections, organized layout, and major endpoint fields without relying on the list-card summary

### Implementation for User Story 2

- [x] T012 [US2] Define normalized Product Detail view contracts and derived section-visibility logic in app/modules/details/DetailsTypes.ts and app/modules/details/useDetails.ts
- [x] T013 [P] [US2] Build a themed marketplace-style Product Detail layout for hero media, pricing, overview, specifications, fulfillment, reviews, and metadata in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts
- [x] T014 [US2] Surface all major endpoint fields, optional section rendering, and review presentation from active Redux detail state in app/modules/details/useDetails.ts and app/modules/details/DetailsScreen.tsx

**Checkpoint**: User Story 2 should now render a rich, complete Product Detail experience independently

---

## Phase 5: User Story 3 - Handle Loading and Unavailable Product Details (Priority: P2)

**Goal**: Provide clear loading, generic failure, and unavailable states with retry/back recovery for the active product

**Independent Test**: Open Product Detail under delayed, failed, and unavailable responses and confirm the screen shows the correct loading, retry, unavailable, and recovery behavior for the selected product

### Implementation for User Story 3

- [x] T015 [US3] Implement generic failure versus unavailable detail-state transitions for the active product in app/redux/products/ProductsSlice.ts and app/modules/details/useDetails.ts
- [x] T016 [P] [US3] Render dedicated loading, generic failure, and unavailable feedback states with retry/back actions in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts
- [x] T017 [P] [US3] Add route-id change handling, abort cleanup, and stale-detail protection in app/modules/details/useDetails.ts

**Checkpoint**: User Story 3 should now recover clearly from delayed, failed, and unavailable Product Detail loads

---

## Phase 6: User Story 4 - Return Smoothly to Browsing (Priority: P3)

**Goal**: Let the shopper leave Product Detail and return to the prior browsing flow without confusion

**Independent Test**: Open Product Detail from Home, then use the back action from success, failure, and unavailable states and confirm the shopper returns cleanly to browsing

### Implementation for User Story 4

- [x] T018 [US4] Wire explicit Product Detail back actions and prior-browsing return behavior in app/modules/details/useDetails.ts and app/modules/details/DetailsScreen.tsx
- [x] T019 [P] [US4] Preserve typed Details registration and screen entry/exit stack behavior in app/navigation/AppNavigation.tsx and app/modules/home/useHome.tsx

**Checkpoint**: User Story 4 should now return the shopper cleanly from Product Detail to browsing

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, documentation, and validation across all Product Detail stories

- [x] T020 [P] Align Product Detail implementation guidance with final behavior in specs/001-product-detail-page/quickstart.md, specs/001-product-detail-page/data-model.md, and specs/001-product-detail-page/contracts/ProductDetailContract.md
- [x] T021 Run lint/type cleanup across app/constants/APIConst.ts, app/constants/ToolkitAction.ts, app/constants/Strings.ts, app/translations/en.json, app/types/ProductListResponse.ts, app/types/index.ts, app/navigation/AppNavigation.tsx, app/redux/products/ProductsInitial.ts, app/redux/products/ProductsSelector.ts, app/redux/products/ProductsSlice.ts, app/redux/products/index.ts, app/modules/home/useHome.tsx, app/modules/home/sub-components/product-card/ProductCard.tsx, app/modules/home/sub-components/product-card/ProductCardTypes.ts, app/modules/details/DetailsScreen.tsx, app/modules/details/DetailsStyles.ts, app/modules/details/DetailsTypes.ts, and app/modules/details/useDetails.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** — No dependencies; can start immediately
- **Phase 2: Foundational** — Depends on Phase 1; blocks all user stories
- **Phase 3: User Story 1** — Depends on Phase 2; delivers the MVP
- **Phase 4: User Story 2** — Depends on Phase 2 and builds on the Product Detail entry flow established in US1
- **Phase 5: User Story 3** — Depends on Phase 2 and is safest after US1 establishes Product Detail loading
- **Phase 6: User Story 4** — Depends on Phase 2 and is safest after US1 establishes Product Detail entry
- **Phase 7: Polish** — Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion; no dependency on other user stories
- **User Story 2 (P1)**: Starts after Foundational completion, but is safest after US1 establishes route entry and detail loading
- **User Story 3 (P2)**: Starts after Foundational completion, but is safest after US1 establishes detail lifecycle wiring
- **User Story 4 (P3)**: Starts after Foundational completion, but is safest after US1 establishes detail entry and screen ownership

### Within Each User Story

- Shared contracts before screen wiring
- Redux lifecycle before screen-state derivations
- Hook orchestration before final screen rendering
- Loading and success behavior before failure/unavailable refinements
- Manual verification before moving to the next story

### Suggested Story Completion Order

1. **US1** → establish Product Detail entry and loading shell
2. **US2** → render the complete rich Product Detail layout
3. **US3** → add clear loading/failure/unavailable recovery states
4. **US4** → finalize smooth return-to-browsing behavior

---

## Parallel Opportunities

- **Setup**: `T002` and `T003` can run in parallel after `T001`
- **Foundational**: `T005` and `T007` can run in parallel after `T004`, while `T006` remains the core blocking Redux implementation
- **US1**: `T009` and `T011` can run in parallel after `T008` starts the Home-to-Details navigation flow
- **US2**: `T013` can run in parallel with the hook/type work in `T012`, then `T014` integrates the complete field rendering
- **US3**: `T016` and `T017` can run in parallel after `T015`
- **US4**: `T019` can run in parallel with `T018`
- **Polish**: `T020` can run before `T021`

---

## Parallel Example: User Story 1

```text
After T008 establishes the Home product-press flow:
- T009 [US1] Make product cards actionable for Product Detail entry in app/modules/home/sub-components/product-card/ProductCard.tsx and app/modules/home/sub-components/product-card/ProductCardTypes.ts
- T011 [US1] Replace the placeholder Details screen styling with an initial themed loading-shell layout in app/modules/details/DetailsStyles.ts and app/modules/details/DetailsScreen.tsx
```

## Parallel Example: User Story 2

```text
After T012 defines the detail view contracts:
- T013 [US2] Build a themed marketplace-style Product Detail layout in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts
- T014 [US2] Surface all major endpoint fields and optional section rendering in app/modules/details/useDetails.ts and app/modules/details/DetailsScreen.tsx
```

## Parallel Example: User Story 3

```text
After T015 implements detail-state transitions:
- T016 [US3] Render dedicated loading, generic failure, and unavailable feedback states in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts
- T017 [US3] Add route-id change handling, abort cleanup, and stale-detail protection in app/modules/details/useDetails.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the Home-to-Details navigation flow and loading state independently
5. Demo or review the MVP before continuing

### Incremental Delivery

1. Deliver **US1** for Product Detail entry and loading-state behavior
2. Add **US2** for rich product information rendering
3. Add **US3** for loading, failure, unavailable, and retry behavior
4. Add **US4** for smooth return-to-browsing behavior
5. Finish with Phase 7 cleanup and validation

### Parallel Team Strategy

With multiple developers:

1. One developer completes Phase 1 and Phase 2 shared Redux/navigation/type groundwork
2. After the Product Detail contract is stable:
   - Developer A: Home entry flow in app/modules/home/useHome.tsx and app/modules/home/sub-components/product-card/
   - Developer B: Details module UI in app/modules/details/DetailsScreen.tsx, app/modules/details/DetailsStyles.ts, and app/modules/details/DetailsTypes.ts
   - Developer C: Redux detail lifecycle and documentation alignment in app/redux/products/ and specs/001-product-detail-page/

---

## Notes

- `[P]` tasks target different files with low coordination needs
- No dedicated automated test tasks were generated because the spec did not explicitly request them
- Each user story remains independently verifiable through the manual scenarios already captured in quickstart.md
- Prefer small commits per task or per checkpoint
- Validate lint/types after each logical group of implementation tasks
