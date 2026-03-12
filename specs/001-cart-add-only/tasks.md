# Tasks: Add-Only Cart Flow

**Input**: Design documents from `/specs/001-cart-add-only/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated test tasks generated. The specification and plan require `yarn lint`, `yarn types`, and manual quickstart validation, but do not request a test-first or automated-test implementation workflow.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Every task includes exact file paths in the description

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Remove unsupported update contracts and align shared add-only cart definitions before domain refactoring begins.

- [x] T001 Remove `cartUpdate` endpoint usage from app/constants/APIConst.ts and keep only the add-only cart endpoint contract
- [x] T002 Remove unsupported update/remove thunk names from app/constants/ToolkitAction.ts and align add-only cart action naming
- [x] T003 [P] Update add-only cart copy in app/translations/en.json and app/constants/Strings.ts for read-only added/cart-review states
- [x] T004 [P] Simplify cart transport exports in app/types/CartResponse.ts and app/types/index.ts for add-only request and response contracts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Refactor the cart Redux domain and shared state contracts so all later work builds on add-only confirmation semantics.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Refactor add-only cart state contracts in app/redux/cart/CartInitial.ts to remove update/remove failure modes and retain confirmed-snapshot persistence fields
- [x] T006 [P] Update shared add-only selectors in app/redux/cart/CartSelector.ts to expose read-only product-detail and cart-review state
- [x] T007 Implement full-snapshot add-only confirmation logic in app/redux/cart/CartSlice.ts by removing update/remove thunks and composing every request through `cartAdd`
- [x] T008 Register the refactored add-only cart exports in app/redux/cart/index.ts and app/redux/index.ts
- [x] T009 Preserve add-only cart persistence behavior in app/redux/Store.ts and app/constants/MMKVKeys.ts for the latest confirmed snapshot only

**Checkpoint**: Foundation ready — Product Detail, Cart review, and restoration work can proceed on the add-only cart domain.

---

## Phase 3: User Story 1 - Add a product from product details (Priority: P1) 🎯 MVP

**Goal**: Let shoppers add a product from Product Detail and see a confirmed added state without exposing unsupported edit controls.

**Independent Test**: Open a Product Detail page for a product not already in the confirmed cart, tap Add to Cart, and confirm the page changes to a non-editable added state that reflects the confirmed cart snapshot.

### Implementation for User Story 1

- [x] T010 [P] [US1] Replace Product Detail cart state contracts in app/modules/details/DetailsTypes.ts and app/modules/details/index.ts with add/added read-only state definitions
- [x] T011 [P] [US1] Refactor Product Detail cart orchestration in app/modules/details/useDetails.ts to dispatch only add-only cart confirmation and derive confirmed added-state data from app/redux/cart/CartSelector.ts
- [x] T012 [P] [US1] Update Product Detail UI in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts to remove quantity controls and render add/added summary states
- [x] T013 [US1] Guard duplicate add taps and surface last confirmed cart recovery messaging for Product Detail in app/modules/details/useDetails.ts and app/redux/cart/CartSlice.ts

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Review cart contents on a dedicated cart screen (Priority: P2)

**Goal**: Let shoppers review confirmed cart contents and totals on the Cart tab without unsupported edit or remove actions.

**Independent Test**: Add one or more products, open the Cart tab, and confirm the screen shows confirmed items, confirmed quantities, and pricing rows with no increment, decrement, or remove controls.

### Implementation for User Story 2

- [x] T014 [P] [US2] Replace editable cart screen contracts in app/modules/cart/CartTypes.ts and app/modules/cart/CartData.ts with review-only row, summary, and empty-state definitions
- [x] T015 [P] [US2] Refactor cart-screen orchestration in app/modules/cart/useCart.ts to provide review-only item rows, pricing rows, and recovery state without edit handlers
- [x] T016 [P] [US2] Convert the cart item row sub-component to read-only rendering in app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx, app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts, app/modules/cart/sub-components/cart-item-row/CartItemRowTypes.ts, and app/modules/cart/sub-components/cart-item-row/index.ts
- [x] T017 [P] [US2] Preserve explicit pricing summary rows with unavailable-state handling in app/modules/cart/sub-components/cart-summary/CartSummary.tsx, app/modules/cart/sub-components/cart-summary/CartSummaryStyles.ts, app/modules/cart/sub-components/cart-summary/CartSummaryTypes.ts, and app/modules/cart/sub-components/cart-summary/index.ts
- [x] T018 [US2] Update the cart review screen layout in app/modules/cart/CartScreen.tsx and app/modules/cart/CartStyles.ts to remove unsupported cart edit affordances and present read-only confirmed cart content
- [x] T019 [US2] Align module exports for the review-only cart surface in app/modules/cart/index.ts and app/modules/index.ts

**Checkpoint**: User Stories 1 and 2 both work independently on the add-only cart flow.

---

## Phase 5: User Story 3 - Restore the last confirmed cart state (Priority: P3)

**Goal**: Restore the last confirmed cart state after relaunch and preserve it whenever a later add confirmation fails.

**Independent Test**: Add products, relaunch the app, and confirm Product Detail and Cart both reflect the last confirmed cart snapshot; then force an add failure and confirm the last confirmed cart remains visible.

### Implementation for User Story 3

- [x] T020 [P] [US3] Finalize hydration and local-fallback state handling in app/redux/cart/CartSlice.ts and app/redux/Store.ts so only the latest confirmed cart snapshot is restored after relaunch
- [x] T021 [P] [US3] Surface hydrated confirmed-cart state consistently in app/modules/details/useDetails.ts and app/modules/cart/useCart.ts for cross-screen restoration behavior
- [x] T022 [US3] Preserve last-confirmed recovery messaging and failure-state presentation in app/modules/details/DetailsScreen.tsx, app/modules/cart/CartScreen.tsx, and app/constants/Strings.ts
- [x] T023 [US3] Ensure later successful add confirmations replace older local fallback state in app/redux/cart/CartSlice.ts and app/redux/cart/CartSelector.ts

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, cleanup, and manual validation across the full add-only cart flow.

- [x] T024 [P] Remove stale update/remove references from app/constants/APIConst.ts, app/constants/ToolkitAction.ts, app/types/CartResponse.ts, and app/redux/cart/index.ts
- [x] T025 [P] Re-check performance and memoization for the read-only cart flow in app/modules/cart/useCart.ts, app/modules/cart/CartScreen.tsx, app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx, and app/modules/details/useDetails.ts
- [ ] T026 Run the manual validation flow in specs/001-cart-add-only/quickstart.md and record any final implementation notes in specs/001-cart-add-only/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories
- **User Stories (Phases 3-5)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion — MVP, no dependency on later stories
- **User Story 2 (P2)**: Starts after Foundational completion and benefits from the add-only selectors and cart snapshot behavior finalized for US1
- **User Story 3 (P3)**: Starts after Foundational completion and depends on the shared add-only cart snapshot being surfaced in both Product Detail and Cart review flows

### Within Each User Story

- Shared contracts before screen and hook wiring
- Hook/state orchestration before screen rendering
- Screen rendering before recovery refinements
- Story completion before moving to dependent refinements

### Parallel Opportunities

- T003 and T004 can run in parallel during Setup
- T006 and T009 can run in parallel during Foundational while T007 refactors the main cart thunk logic
- T010, T011, and T012 can run in parallel for User Story 1 once the foundational cart selector contract is stable
- T014, T015, T016, and T017 can run in parallel for User Story 2
- T020 and T021 can run in parallel for User Story 3
- T024 and T025 can run in parallel during Polish

---

## Parallel Example: User Story 1

```bash
# Launch Product Detail contract, hook, and UI work together:
Task: "Replace Product Detail cart state contracts in app/modules/details/DetailsTypes.ts and app/modules/details/index.ts with add/added read-only state definitions"
Task: "Refactor Product Detail cart orchestration in app/modules/details/useDetails.ts to dispatch only add-only cart confirmation and derive confirmed added-state data from app/redux/cart/CartSelector.ts"
Task: "Update Product Detail UI in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts to remove quantity controls and render add/added summary states"
```

## Parallel Example: User Story 2

```bash
# Launch cart review screen building blocks together:
Task: "Replace editable cart screen contracts in app/modules/cart/CartTypes.ts and app/modules/cart/CartData.ts with review-only row, summary, and empty-state definitions"
Task: "Refactor cart-screen orchestration in app/modules/cart/useCart.ts to provide review-only item rows, pricing rows, and recovery state without edit handlers"
Task: "Convert the cart item row sub-component to read-only rendering in app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx, app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts, app/modules/cart/sub-components/cart-item-row/CartItemRowTypes.ts, and app/modules/cart/sub-components/cart-item-row/index.ts"
Task: "Preserve explicit pricing summary rows with unavailable-state handling in app/modules/cart/sub-components/cart-summary/CartSummary.tsx, app/modules/cart/sub-components/cart-summary/CartSummaryStyles.ts, app/modules/cart/sub-components/cart-summary/CartSummaryTypes.ts, and app/modules/cart/sub-components/cart-summary/index.ts"
```

## Parallel Example: User Story 3

```bash
# Launch restoration-domain and cross-screen hydration work together:
Task: "Finalize hydration and local-fallback state handling in app/redux/cart/CartSlice.ts and app/redux/Store.ts so only the latest confirmed cart snapshot is restored after relaunch"
Task: "Surface hydrated confirmed-cart state consistently in app/modules/details/useDetails.ts and app/modules/cart/useCart.ts for cross-screen restoration behavior"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate Product Detail add-only behavior independently
5. Demo or ship the MVP increment

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 → validate add-only Product Detail behavior
3. Add User Story 2 → validate review-only Cart screen behavior
4. Add User Story 3 → validate restoration and failure recovery
5. Finish Polish phase and rerun quickstart validation

### Parallel Team Strategy

With multiple developers:

1. One developer handles Phase 1 + Phase 2 shared constants and cart domain refactor
2. After Foundational completion:
   - Developer A: User Story 1 Product Detail add-only flow
   - Developer B: User Story 2 Cart review screen
   - Developer C: User Story 3 restoration and recovery refinements
3. Merge on the shared add-only cart selectors and snapshot contract, then complete Polish

---

## Notes

- [P] tasks touch different files and can proceed in parallel
- [US1], [US2], and [US3] labels map every story task back to the specification
- No automated test tasks were generated because the specification and plan did not request TDD or automated test-first delivery
- Every cart confirmation must use the add-only request contract documented in specs/001-cart-add-only/contracts/CartAddOnlyContract.md
- Preserve the latest confirmed cart snapshot on failures and never show unsupported edit affordances in the UI
- All tasks follow the required checklist format and include concrete file paths
