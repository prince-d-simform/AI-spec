# Tasks: Cart Screen and Item Controls

**Input**: Design documents from `/specs/002-cart-screen-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No test tasks generated. The specification and user request did not explicitly require TDD or automated test-first delivery.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Every task includes exact file paths in the description

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add shared constants, strings, transport types, and feature config required by the cart implementation.

- [x] T001 Add cart API endpoints and thunk action constants in app/constants/APIConst.ts and app/constants/ToolkitAction.ts
- [x] T002 Add cart, detail-action, error, and pricing-summary copy in app/translations/en.json and app/constants/Strings.ts
- [x] T003 [P] Define cart transport contracts and exports in app/types/CartResponse.ts and app/types/index.ts
- [x] T004 [P] Centralize cart feature static config, including dummy API user id, in app/modules/cart/CartData.ts and app/constants/MMKVKeys.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared cart domain and persistence plumbing required before any story work can begin.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Create cart state contracts and quantity-based selectors in app/redux/cart/CartInitial.ts and app/redux/cart/CartSelector.ts
- [x] T006 Implement shared cart snapshot normalization, hydration reducers, and base error state in app/redux/cart/CartSlice.ts
- [x] T007 Register the cart reducer, exports, and persisted whitelist updates in app/redux/cart/index.ts, app/redux/index.ts, and app/redux/Store.ts
- [x] T008 Extend shared cart UI contracts for Product Detail and Cart screens in app/modules/details/DetailsTypes.ts and app/modules/cart/CartTypes.ts

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Add an item from product details (Priority: P1) 🎯 MVP

**Goal**: Let shoppers add a product from Product Detail, create or reuse the active cart, and switch the footer action to quantity controls.

**Independent Test**: Open a Product Detail page for a product not in the cart, tap Add to Cart, confirm the app creates or reuses the cart, persists the confirmed snapshot, and replaces the Add to Cart action with quantity controls.

### Implementation for User Story 1

- [x] T009 [P] [US1] Implement create-cart and first-add mutation thunks for POST /carts/add and reuse-aware add flows in app/redux/cart/CartSlice.ts and app/modules/cart/CartData.ts
- [x] T010 [P] [US1] Add the Product Detail bottom cart action layout and themed styles in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts
- [x] T011 [US1] Wire Product Detail add-to-cart behavior to cart selectors and create/add actions in app/modules/details/useDetails.ts and app/redux/cart/CartSelector.ts
- [x] T012 [US1] Restore Product Detail cart control state from the persisted confirmed snapshot after relaunch in app/modules/details/useDetails.ts and app/redux/cart/CartSlice.ts

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Adjust quantity from the product detail page (Priority: P2)

**Goal**: Let shoppers increase, decrease, or remove the active product directly from Product Detail while keeping the confirmed cart snapshot accurate.

**Independent Test**: Start with a product already in the cart, use plus and minus/delete on Product Detail, and confirm the quantity, removal behavior, and persisted cart snapshot stay accurate.

### Implementation for User Story 2

- [x] T013 [P] [US2] Implement additive and replacement cart update mutations for PUT /carts/{cartId} in app/redux/cart/CartSlice.ts
- [x] T014 [P] [US2] Add Product Detail quantity-control states for increment, decrement, delete, and loading feedback in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts
- [x] T015 [US2] Wire increment, decrement, and remove handlers to cart update actions in app/modules/details/useDetails.ts and app/redux/cart/CartSelector.ts
- [x] T016 [US2] Guard rapid taps and preserve the last confirmed Product Detail quantity on failed mutations in app/redux/cart/CartSlice.ts and app/modules/details/useDetails.ts

**Checkpoint**: User Stories 1 and 2 both work independently from Product Detail.

---

## Phase 5: User Story 3 - Manage cart contents on a dedicated cart screen (Priority: P3)

**Goal**: Replace the placeholder cart tab with a full cart screen that shows API-returned details, supports quantity changes, and shows pricing summary fallback rows.

**Independent Test**: Add one or more products, open the Cart tab, confirm the list and summary match the confirmed cart snapshot, then adjust or remove items directly from the cart screen.

### Implementation for User Story 3

- [x] T017 [P] [US3] Create the cart screen orchestration hook and populated/empty-state contracts in app/modules/cart/useCart.ts and app/modules/cart/CartTypes.ts
- [x] T018 [P] [US3] Build the cart item row sub-component in app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx, app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts, app/modules/cart/sub-components/cart-item-row/CartItemRowTypes.ts, and app/modules/cart/sub-components/cart-item-row/index.ts
- [x] T019 [P] [US3] Build the cart summary sub-component in app/modules/cart/sub-components/cart-summary/CartSummary.tsx, app/modules/cart/sub-components/cart-summary/CartSummaryStyles.ts, app/modules/cart/sub-components/cart-summary/CartSummaryTypes.ts, and app/modules/cart/sub-components/cart-summary/index.ts
- [x] T020 [US3] Replace the placeholder cart tab with populated, empty, and recovery layouts in app/modules/cart/CartScreen.tsx and app/modules/cart/CartStyles.ts
- [x] T021 [US3] Wire cart-screen increment, decrement, and remove actions to shared cart selectors and update mutations in app/modules/cart/useCart.ts and app/redux/cart/CartSlice.ts
- [x] T022 [US3] Render all API-returned cart details plus subtotal, tax, shipping, and grand-total fallback rows in app/modules/cart/CartScreen.tsx and app/modules/cart/sub-components/cart-summary/CartSummary.tsx

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, performance, and validation work across the cart feature.

- [x] T023 [P] Align cart module exports and imports in app/modules/cart/index.ts and app/modules/index.ts
- [x] T024 [P] Add memoization and render-guard refinements for cart rows and detail controls in app/modules/cart/useCart.ts, app/modules/cart/CartScreen.tsx, and app/modules/details/useDetails.ts
- [ ] T025 Run the manual validation flow from specs/002-cart-screen-api/quickstart.md and update any final implementation notes in specs/002-cart-screen-api/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories
- **User Stories (Phases 3-5)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion — MVP, no dependency on later stories
- **User Story 2 (P2)**: Starts after User Story 1 domain flows exist because it extends the same Product Detail cart controls and cart update mutations
- **User Story 3 (P3)**: Starts after Foundational completion and benefits from completed cart mutation flows from US1 and US2

### Within Each User Story

- Shared Redux/domain plumbing before screen integration
- Screen layout before handler wiring
- Handler wiring before validation and recovery refinements
- Story completion before moving to the next dependent story

### Parallel Opportunities

- T003 and T004 can run in parallel during Setup
- T005 and T008 can run in parallel during Foundational while T006 waits for their contracts
- T009 and T010 can run in parallel for User Story 1
- T013 and T014 can run in parallel for User Story 2
- T017, T018, and T019 can run in parallel for User Story 3
- T023 and T024 can run in parallel during Polish

---

## Parallel Example: User Story 1

```bash
# Launch Product Detail add-flow work together:
Task: "Implement create-cart and first-add mutation thunks for POST /carts/add and reuse-aware add flows in app/redux/cart/CartSlice.ts and app/modules/cart/CartData.ts"
Task: "Add the Product Detail bottom cart action layout and themed styles in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts"
```

## Parallel Example: User Story 2

```bash
# Launch update-domain and UI-state work together:
Task: "Implement additive and replacement cart update mutations for PUT /carts/{cartId} in app/redux/cart/CartSlice.ts"
Task: "Add Product Detail quantity-control states for increment, decrement, delete, and loading feedback in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts"
```

## Parallel Example: User Story 3

```bash
# Launch cart screen building blocks together:
Task: "Create the cart screen orchestration hook and populated/empty-state contracts in app/modules/cart/useCart.ts and app/modules/cart/CartTypes.ts"
Task: "Build the cart item row sub-component in app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx, app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts, app/modules/cart/sub-components/cart-item-row/CartItemRowTypes.ts, and app/modules/cart/sub-components/cart-item-row/index.ts"
Task: "Build the cart summary sub-component in app/modules/cart/sub-components/cart-summary/CartSummary.tsx, app/modules/cart/sub-components/cart-summary/CartSummaryStyles.ts, app/modules/cart/sub-components/cart-summary/CartSummaryTypes.ts, and app/modules/cart/sub-components/cart-summary/index.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the Product Detail add-to-cart flow independently
5. Demo or ship the MVP increment

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 → validate add-to-cart and relaunch restoration
3. Add User Story 2 → validate Product Detail quantity management
4. Add User Story 3 → validate full cart screen behavior and pricing fallback rows
5. Finish Polish phase and rerun quickstart validation

### Parallel Team Strategy

With multiple developers:

1. One developer handles Phase 1 + Phase 2 domain plumbing
2. After Foundational completion:
   - Developer A: User Story 1 Product Detail add flow
   - Developer B: User Story 2 Product Detail quantity flow
   - Developer C: User Story 3 Cart screen UI and summary components
3. Merge on shared cart selectors and mutation contracts, then complete Polish

---

## Notes

- [P] tasks touch different files and can proceed in parallel
- [US1], [US2], and [US3] labels map every story task back to the specification
- The feature does not include automated test tasks because tests were not explicitly requested in the spec or prompt
- Keep API response handling canonical: successful server cart data replaces the local fallback snapshot
- Preserve the last confirmed cart state on failures; do not show unconfirmed quantities as final state
- All tasks follow the required checklist format and include concrete file paths
