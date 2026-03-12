# Tasks: Cart Item UI Refinement

**Input**: Design documents from `/specs/001-fix-cart-item-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No dedicated automated test tasks are included because the specification does not request TDD or new automated coverage. Validation is completed through `yarn lint`, `yarn types`, and the manual quickstart checks.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Context)

**Purpose**: Reconfirm the attached wireframe-driven four-zone cart-row requirements and the source files touched by the layout refinement.

- [x] T001 Review the revised wireframe requirements in specs/001-fix-cart-item-ui/spec.md, specs/001-fix-cart-item-ui/plan.md, specs/001-fix-cart-item-ui/research.md, specs/001-fix-cart-item-ui/data-model.md, specs/001-fix-cart-item-ui/contracts/CartItemUiContract.md, and specs/001-fix-cart-item-ui/quickstart.md
- [x] T002 Inventory the current four-zone cart-row implementation touchpoints in app/modules/cart/useCart.ts, app/modules/cart/CartScreen.tsx, app/modules/cart/CartStyles.ts, app/modules/cart/CartData.ts, app/modules/cart/CartTypes.ts, and app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Align shared copy, contracts, and row metrics with the wireframe before story-specific implementation begins.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [x] T003 [P] Add or update the wireframe-specific cart-row accessibility and shopper-facing copy in app/translations/en.json
- [x] T004 [P] Expose the matching wireframe-specific cart-row string accessors in app/constants/Strings.ts
- [x] T005 [P] Refine the shared row contracts for the four-zone hierarchy in app/modules/cart/CartTypes.ts and app/modules/cart/sub-components/cart-item-row/CartItemRowTypes.ts
- [x] T006 [P] Tune the predictable fixed-height row constant for the top-row and bottom-row block layout in app/modules/cart/CartData.ts

**Checkpoint**: Shared copy, types, and layout constants are aligned with the revised four-zone row contract.

---

## Phase 3: User Story 1 - Read product details clearly in the cart (Priority: P1) 🎯 MVP

**Goal**: Present the upper-left image and upper-right primary detail stack clearly while preserving tap-to-details navigation.

**Independent Test**: Open the cart with one or more products and confirm each row shows the image in the upper-left, the name plus discounted-total stack in the upper-right, remains readable for long titles, and opens the correct product details screen when tapped outside the quantity controls.

### Implementation for User Story 1

- [x] T007 [US1] Reshape the cart-row view model for the upper-left image and upper-right primary detail stack in app/modules/cart/useCart.ts
- [x] T008 [US1] Pass the revised cart-row press contract through the list renderer in app/modules/cart/CartScreen.tsx
- [x] T009 [US1] Render the top-row structure with image, title, discounted-total label, and primary value in app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx
- [x] T010 [US1] Implement the top-row hierarchy, title clamping, and tappable-row styles in app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts

**Checkpoint**: User Story 1 should be fully functional and testable on its own.

---

## Phase 4: User Story 2 - Understand item actions without visual clutter (Priority: P2)

**Goal**: Present the lower-left quantity-control block and lower-right pricing block as distinct, readable bottom-row panels.

**Independent Test**: Open the cart with editable quantities and confirm the bottom row shows grouped decrement/quantity/increment controls on the left and stacked unit price, line total, and discount details on the right, while quantity actions do not trigger navigation.

### Implementation for User Story 2

- [x] T011 [US2] Refine the row interaction mapping for the lower-left quantity block and lower-right pricing block in app/modules/cart/useCart.ts
- [x] T012 [US2] Render the bottom-row quantity-control and pricing panels in app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx
- [x] T013 [US2] Implement grouped lower-left control-block and lower-right pricing-block styles in app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts
- [x] T014 [US2] Adjust cart-screen spacing and row container spacing for the wireframe bottom-row composition in app/modules/cart/CartStyles.ts and app/modules/cart/CartScreen.tsx

**Checkpoint**: User Story 2 should be fully functional and testable on its own.

---

## Phase 5: User Story 3 - Keep the cart item layout consistent across content variations (Priority: P3)

**Goal**: Preserve the same four-zone structure across long titles, missing images, discounted items, and non-discounted items while keeping product ID hidden.

**Independent Test**: Review the cart with mixed products and confirm missing-image rows, long-title rows, and products without discounted totals still keep the upper-left/upper-right/lower-left/lower-right structure aligned and do not show product ID anywhere in the visible row.

### Implementation for User Story 3

- [x] T015 [US3] Normalize fallback primary-value and mixed-pricing display states for the top-right block in app/modules/cart/useCart.ts
- [x] T016 [US3] Remove product ID from the visible row and render stable mixed-state fallbacks in app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx
- [x] T017 [US3] Tune placeholder, fallback-price, and four-zone alignment styles in app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts and app/modules/cart/CartData.ts
- [x] T018 [US3] Apply any list-level consistency refinements needed for the wireframe-aligned four-zone layout in app/modules/cart/CartScreen.tsx and app/modules/cart/CartStyles.ts

**Checkpoint**: User Story 3 should be fully functional and testable on its own.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the final wireframe-aligned layout against the quickstart and quality gates.

- [ ] T019 [P] Reconcile the final manual verification notes in specs/001-fix-cart-item-ui/quickstart.md with the implemented four-zone cart-row behavior
- [ ] T020 Run `yarn lint`, `yarn types`, and the manual checks from specs/001-fix-cart-item-ui/quickstart.md against app/modules/cart/useCart.ts, app/modules/cart/CartScreen.tsx, app/modules/cart/CartStyles.ts, app/modules/cart/CartData.ts, app/modules/cart/CartTypes.ts, and app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories until shared contracts and copy are aligned.
- **User Story 1 (Phase 3)**: Depends on Foundational; establishes the top-row wireframe shell and row-tap navigation.
- **User Story 2 (Phase 4)**: Depends on User Story 1; builds the bottom-row control and pricing panels inside the new row shell.
- **User Story 3 (Phase 5)**: Depends on User Story 1 and should follow User Story 2 because the same row files must be finalized for fallback consistency.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational and is the MVP.
- **User Story 2 (P2)**: Builds on the revised row structure from US1.
- **User Story 3 (P3)**: Builds on the revised row structure from US1 and finalizes mixed-content consistency after US2.

### Within Each User Story

- Shared contracts and copy first
- Hook/view-model updates before screen wiring
- Component structure before final styles
- Story-level validation before moving to the next story

### Parallel Opportunities

- T003 and T004 can run in parallel because translation and string updates are separate files.
- T005 and T006 can run in parallel because types and row-height constants are independent touchpoints.
- Within US1, T007 and T010 can proceed in parallel before T009 is finalized.
- Within US2, T013 and T014 can run in parallel because row styles and screen spacing live in different files.
- Within US3, T015 and T017 can run in parallel once fallback display rules are agreed.
- In Polish, T019 can run in parallel with final implementation review before T020 completes validation.

---

## Parallel Example: User Story 1

```bash
# Parallel preparation for User Story 1
Task: "Reshape the cart-row view model for the upper-left image and upper-right primary detail stack in app/modules/cart/useCart.ts"
Task: "Implement the top-row hierarchy, title clamping, and tappable-row styles in app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts"
```

## Parallel Example: User Story 2

```bash
# Parallel preparation for User Story 2
Task: "Implement grouped lower-left control-block and lower-right pricing-block styles in app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts"
Task: "Adjust cart-screen spacing and row container spacing for the wireframe bottom-row composition in app/modules/cart/CartStyles.ts and app/modules/cart/CartScreen.tsx"
```

## Parallel Example: User Story 3

```bash
# Parallel preparation for User Story 3
Task: "Normalize fallback primary-value and mixed-pricing display states for the top-right block in app/modules/cart/useCart.ts"
Task: "Tune placeholder, fallback-price, and four-zone alignment styles in app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts and app/modules/cart/CartData.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the top-row hierarchy and row-to-details navigation.

### Incremental Delivery

1. Finish Setup + Foundational to lock the revised shared contracts.
2. Deliver User Story 1 as the MVP layout correction.
3. Add User Story 2 to complete the lower-left control block and lower-right pricing block.
4. Add User Story 3 to stabilize long-title, missing-image, and no-discount fallbacks while removing visible product ID.
5. Run the Phase 6 validation pass before handoff.

### Parallel Team Strategy

1. One developer updates strings and shared row contracts in Phase 2.
2. A second developer prepares cart-row style tuning and row-height adjustments after the shared contracts settle.
3. Once US1 is complete, one developer can handle bottom-row rendering while another tunes fallback-state consistency.

---

## Notes

- All tasks follow the required checklist format: checkbox, task ID, optional `[P]`, required story label for story phases, and exact file paths.
- No automated test files are added because the current feature scope and spec do not request them.
- Avoid overlapping edits to app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx and app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts when parallelizing work.
- Use the manual scenarios in specs/001-fix-cart-item-ui/quickstart.md as the release-readiness checklist.
