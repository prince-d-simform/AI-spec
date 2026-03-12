# Tasks: Cart Quantity Controls

**Input**: Design documents from `/specs/001-cart-quantity-controls/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated test tasks generated. The specification and plan require `yarn lint`, `yarn types`, and manual quickstart validation, but do not request a test-first or automated-test implementation workflow.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Every task includes exact file paths in the description

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align shared cart constants, copy, and transport contracts before refactoring the quantity-control flow.

- [x] T001 Restore quantity-control action names and shopper copy in app/constants/ToolkitAction.ts, app/constants/Strings.ts, and app/translations/en.json
- [x] T002 [P] Align the shared `cartAdd` endpoint contract and quantity-control transport exports in app/constants/APIConst.ts, app/types/CartResponse.ts, and app/types/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Refactor the cart Redux domain so every later story builds on full-snapshot quantity confirmations.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Refactor cart state contracts for quantity mutations, cart-wide locking, and display-pricing metadata in app/redux/cart/CartInitial.ts
- [x] T004 Implement full-snapshot `cartAdd` confirmation, delete omission, final-item removal handling, and cart-wide mutation locking in app/redux/cart/CartSlice.ts
- [x] T005 Update shared cart selectors and barrel exports for quantity controls, display pricing, and checkout CTA state in app/redux/cart/CartSelector.ts and app/redux/cart/index.ts
- [x] T006 [P] Preserve quantity-control cart hydration and persisted-snapshot behavior in app/redux/Store.ts and app/constants/MMKVKeys.ts

**Checkpoint**: Foundation ready — Product Detail, Cart editing, and relaunch consistency work can now proceed.

---

## Phase 3: User Story 1 - Adjust quantity from product details (Priority: P1) 🎯 MVP

**Goal**: Let shoppers add, increment, decrement, and delete cart quantity directly from Product Detail while reusing the confirmed `cartAdd` flow.

**Independent Test**: Open a Product Detail page for a confirmed cart item, use increment and decrement controls, and confirm the quantity updates correctly while the leading control switches between minus and delete at quantity `1`.

### Implementation for User Story 1

- [x] T007 [P] [US1] Restore Product Detail quantity-control contracts in app/modules/details/DetailsTypes.ts and app/modules/details/index.ts
- [x] T008 [US1] Implement Product Detail add, increment, decrement, and delete orchestration in app/modules/details/useDetails.ts using app/redux/cart/CartSelector.ts and app/redux/cart/CartSlice.ts
- [x] T009 [P] [US1] Render Product Detail add-to-cart and quantity controls with minus/delete switching in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts
- [x] T010 [US1] Surface Product Detail recovery messaging and revert-to-add transitions after confirmed deletion in app/modules/details/useDetails.ts and app/modules/details/DetailsScreen.tsx

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Adjust quantity from the cart screen (Priority: P2)

**Goal**: Let shoppers edit quantities from the Cart screen, see numeric summary fallbacks, and access a checkout CTA from the summary footer.

**Independent Test**: Add products to the cart, open the Cart screen, and confirm each row supports increment, decrement, and delete behavior while the summary shows numeric tax, shipping, grand total, and a checkout button.

### Implementation for User Story 2

- [x] T011 [P] [US2] Restore editable cart row, summary, and checkout CTA contracts in app/modules/cart/CartTypes.ts, app/modules/cart/CartData.ts, app/modules/cart/sub-components/cart-item-row/CartItemRowTypes.ts, and app/modules/cart/sub-components/cart-summary/CartSummaryTypes.ts
- [x] T012 [US2] Implement cart-screen orchestration for row mutations, numeric pricing fallbacks, and checkout CTA state in app/modules/cart/useCart.ts
- [x] T013 [P] [US2] Restore cart row quantity controls, delete/minus behavior, and loading states in app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx, app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts, and app/modules/cart/sub-components/cart-item-row/index.ts
- [x] T014 [P] [US2] Extend the cart summary footer to render numeric tax, shipping, and grand total values plus the checkout CTA in app/modules/cart/sub-components/cart-summary/CartSummary.tsx, app/modules/cart/sub-components/cart-summary/CartSummaryStyles.ts, and app/modules/cart/sub-components/cart-summary/index.ts
- [x] T015 [US2] Integrate editable rows and the summary-footer checkout CTA into app/modules/cart/CartScreen.tsx, app/modules/cart/CartStyles.ts, and app/modules/cart/index.ts
- [x] T016 [US2] Keep cart empty, loading, and recovery states aligned with editable quantity flow in app/modules/cart/useCart.ts and app/modules/cart/CartScreen.tsx

**Checkpoint**: User Stories 1 and 2 both work independently with confirmed quantity editing.

---

## Phase 5: User Story 3 - Keep quantity state consistent across screens (Priority: P3)

**Goal**: Keep Product Detail and Cart synchronized after each confirmed quantity change and after app relaunch.

**Independent Test**: Change quantity on Product Detail, verify the Cart screen matches, then change quantity on the Cart screen, relaunch the app, and confirm both screens still reflect the latest confirmed state.

### Implementation for User Story 3

- [x] T017 [P] [US3] Finalize shared quantity-control selectors for restored snapshots, per-product loading, and display-pricing consistency in app/redux/cart/CartSelector.ts and app/redux/cart/index.ts
- [x] T018 [US3] Preserve last-confirmed snapshot hydration, failure recovery, and final-item empty-cart transitions in app/redux/cart/CartSlice.ts and app/redux/Store.ts
- [x] T019 [US3] Sync restored quantity state and recovery messaging between app/modules/details/useDetails.ts and app/modules/cart/useCart.ts
- [x] T020 [US3] Align cross-screen UI transitions and barrel exports for restored quantity controls in app/modules/details/DetailsScreen.tsx, app/modules/cart/CartScreen.tsx, app/modules/details/index.ts, app/modules/cart/index.ts, and app/modules/index.ts

**Checkpoint**: All user stories are independently functional and remain consistent after relaunch.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, performance review, and manual validation across the full quantity-controls flow.

- [x] T021 [P] Remove stale add-only/read-only cart references from app/constants/APIConst.ts, app/constants/ToolkitAction.ts, app/modules/details/DetailsScreen.tsx, and app/modules/cart/CartScreen.tsx
- [x] T022 [P] Re-check memoization, disabled-state handling, and render performance in app/modules/details/useDetails.ts, app/modules/cart/useCart.ts, app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx, and app/modules/cart/sub-components/cart-summary/CartSummary.tsx
- [ ] T023 Run the manual validation flow in specs/001-cart-quantity-controls/quickstart.md and record final implementation notes in specs/001-cart-quantity-controls/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories
- **User Stories (Phases 3-5)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion — MVP, no dependency on later stories
- **User Story 2 (P2)**: Starts after Foundational completion and benefits from the shared quantity-control selectors and confirmation flow stabilized for User Story 1
- **User Story 3 (P3)**: Starts after Foundational completion and depends on Product Detail and Cart both consuming the confirmed quantity-control state introduced by User Stories 1 and 2

### Within Each User Story

- Shared contracts before hook or screen wiring
- Hook and selector orchestration before screen rendering
- Screen rendering before recovery and empty-state refinements
- Story completion before moving to dependent consistency refinements

### Parallel Opportunities

- T001 and T002 can run in parallel during Setup
- T004 and T006 can run in parallel during Foundational once T003 defines the shared cart state shape
- T007 and T009 can run in parallel for User Story 1 once the foundational cart selectors are stable
- T011, T013, and T014 can run in parallel for User Story 2
- T017 can run in parallel with early User Story 3 relaunch planning while T018 finalizes the persistence behavior
- T021 and T022 can run in parallel during Polish

---

## Parallel Example: User Story 1

```bash
# Launch Product Detail contract and UI work together:
Task: "Restore Product Detail quantity-control contracts in app/modules/details/DetailsTypes.ts and app/modules/details/index.ts"
Task: "Render Product Detail add-to-cart and quantity controls with minus/delete switching in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts"
```

## Parallel Example: User Story 2

```bash
# Launch cart row and summary building blocks together:
Task: "Restore editable cart row, summary, and checkout CTA contracts in app/modules/cart/CartTypes.ts, app/modules/cart/CartData.ts, app/modules/cart/sub-components/cart-item-row/CartItemRowTypes.ts, and app/modules/cart/sub-components/cart-summary/CartSummaryTypes.ts"
Task: "Restore cart row quantity controls, delete/minus behavior, and loading states in app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx, app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts, and app/modules/cart/sub-components/cart-item-row/index.ts"
Task: "Extend the cart summary footer to render numeric tax, shipping, and grand total values plus the checkout CTA in app/modules/cart/sub-components/cart-summary/CartSummary.tsx, app/modules/cart/sub-components/cart-summary/CartSummaryStyles.ts, and app/modules/cart/sub-components/cart-summary/index.ts"
```

## Parallel Example: User Story 3

```bash
# Launch selector and persistence refinements separately:
Task: "Finalize shared quantity-control selectors for restored snapshots, per-product loading, and display-pricing consistency in app/redux/cart/CartSelector.ts and app/redux/cart/index.ts"
Task: "Preserve last-confirmed snapshot hydration, failure recovery, and final-item empty-cart transitions in app/redux/cart/CartSlice.ts and app/redux/Store.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate Product Detail quantity-control behavior independently
5. Demo or ship the MVP increment

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 → validate Product Detail quantity controls
3. Add User Story 2 → validate Cart editing, numeric totals, and checkout CTA
4. Add User Story 3 → validate relaunch consistency and cross-screen recovery
5. Finish Polish phase and rerun quickstart validation

### Parallel Team Strategy

With multiple developers:

1. One developer handles Phase 1 + Phase 2 shared constants and cart-domain refactor
2. After Foundational completion:
   - Developer A: User Story 1 Product Detail quantity controls
   - Developer B: User Story 2 Cart screen editing and summary footer
   - Developer C: User Story 3 cross-screen restoration and recovery refinements
3. Merge on the shared cart selectors and confirmation contract, then complete Polish

---

## Notes

- [P] tasks touch different files and can proceed in parallel
- [US1], [US2], and [US3] labels map every story task back to the specification
- No automated test tasks were generated because the specification and plan did not request TDD or automated test-first delivery
- Every cart mutation must use the shared `POST /carts/add` confirmation contract documented in specs/001-cart-quantity-controls/contracts/CartQuantityControlsContract.md
- Preserve the latest confirmed cart snapshot on failures and keep pricing fallbacks display-only
- All tasks follow the required checklist format and include concrete file paths
