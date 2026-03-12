# Feature Specification: Add-Only Cart Flow

**Feature Branch**: `[001-cart-add-only]`  
**Created**: 2026-03-12  
**Status**: Draft  
**Input**: User description: "Remove direct cart updates because the current cart capability supports add-only cart confirmation."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add a product from product details (Priority: P1)

As a shopper viewing a product, I want to add it to my cart from the product detail page so I can start building my cart without leaving the product.

**Why this priority**: This is the minimum cart behavior that delivers immediate value and matches the currently supported cart capability.

**Independent Test**: Open a product detail page for a product not already in the cart, add it once, and confirm the product becomes part of the confirmed cart while the page changes from an add action to an added-state summary.

**Acceptance Scenarios**:

1. **Given** a shopper is viewing a product that is not in the confirmed cart, **When** the shopper selects Add to Cart, **Then** the system confirms the product in the cart with quantity 1 and updates the product detail page to show that the product is already in the cart.
2. **Given** a shopper has already added the current product, **When** the shopper returns to that product detail page, **Then** the page shows the confirmed added state instead of another primary Add to Cart action.
3. **Given** a shopper already has confirmed items in the cart, **When** the shopper adds a different product from another product detail page, **Then** the newly confirmed cart includes the previous items and the newly added product.

---

### User Story 2 - Review cart contents on a dedicated cart screen (Priority: P2)

As a shopper, I want to open a cart screen and review all confirmed items in one place so I can verify what has been added before I continue shopping.

**Why this priority**: Once adding is possible, shoppers need a clear place to review confirmed cart contents and totals, even when direct cart editing is temporarily unsupported.

**Independent Test**: Add one or more products, open the cart screen, and confirm the screen shows the confirmed cart contents, quantities, and pricing summary without offering unsupported edit actions.

**Acceptance Scenarios**:

1. **Given** the shopper has one or more confirmed cart items, **When** the shopper opens the cart screen, **Then** the screen shows each item, its confirmed quantity, and the available pricing summary values.
2. **Given** the shopper has no confirmed cart items, **When** the shopper opens the cart screen, **Then** the screen shows an empty-cart state with guidance to continue shopping.
3. **Given** the shopper is reviewing the cart screen, **When** direct cart editing is not supported, **Then** the screen does not show quantity increment, decrement, or remove controls.

---

### User Story 3 - Restore the last confirmed cart state (Priority: P3)

As a shopper returning to the app, I want my last confirmed cart contents to reappear so I can continue from where I left off.

**Why this priority**: Restoring confirmed cart contents reduces friction and prevents shoppers from losing confidence in the cart experience.

**Independent Test**: Add products, relaunch the app, and confirm the product detail pages and cart screen reflect the last confirmed cart contents; then simulate a failed add attempt and confirm the last confirmed cart remains visible.

**Acceptance Scenarios**:

1. **Given** a shopper previously confirmed cart items, **When** the shopper relaunches the app and opens the cart screen or a previously added product, **Then** the UI reflects the last confirmed cart state.
2. **Given** a shopper attempts to add another product and that confirmation fails, **When** the failure is shown, **Then** the last confirmed cart state remains visible and unchanged.
3. **Given** newer confirmed cart data becomes available, **When** the system refreshes the shopper's cart state, **Then** the newer confirmed cart data replaces older locally stored cart data.

### Edge Cases

- If a shopper taps Add to Cart repeatedly before the first confirmation finishes, the system should avoid showing duplicate unconfirmed additions for the same action.
- If a shopper opens a product that is already part of the confirmed cart, the page should clearly indicate the confirmed state without presenting unsupported edit controls.
- If the cart contains pricing fields that are temporarily unavailable, the cart screen should clearly distinguish unavailable values from confirmed totals.
- If a cart confirmation fails after the shopper already has confirmed items, the existing confirmed cart should remain visible.
- If the shopper relaunches the app without network access, the most recent confirmed cart should still be restored from local storage.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST show a primary Add to Cart action at the bottom of the product detail page when the viewed product is not currently part of the confirmed cart.
- **FR-002**: When the shopper adds a product and no confirmed cart exists yet, the system MUST create a confirmed active cart that includes the selected product with quantity 1.
- **FR-003**: When the shopper adds a product while a confirmed cart already exists, the system MUST preserve previously confirmed cart items and include the newly added product in the next confirmed cart state.
- **FR-004**: After a product is successfully confirmed in the cart, the product detail page MUST replace the primary Add to Cart action with a non-editable added-state summary for that product.
- **FR-005**: The system MUST NOT present quantity increment, quantity decrement, or remove controls on the product detail page while direct cart editing is unsupported.
- **FR-006**: The system MUST maintain a single confirmed cart line per product and reflect the latest confirmed quantity for that product.
- **FR-007**: The system MUST provide a dedicated cart screen that displays the current confirmed cart items, their confirmed quantities, and the currently available pricing summary values.
- **FR-008**: The cart screen MUST NOT present direct quantity-edit or remove controls while direct cart editing is unsupported.
- **FR-009**: If the shopper has no confirmed cart items, the system MUST show an empty-cart state on the cart screen.
- **FR-010**: The system MUST allow shoppers to build and review a cart without requiring sign-in.
- **FR-011**: The system MUST persist the latest confirmed cart state locally so it can be restored after app relaunch.
- **FR-012**: The system MUST restore the latest confirmed cart state without depending on a stored user identity.
- **FR-013**: After each successful cart confirmation, the system MUST treat the returned confirmed cart data as the source of truth for visible cart state and local persistence.
- **FR-014**: If a cart confirmation fails, the system MUST show a clear recovery message and keep the last confirmed cart state visible to the shopper.
- **FR-015**: The system MUST ensure the product detail page and cart screen stay consistent with the same confirmed cart state during a shopping session.
- **FR-016**: The system MUST display confirmed pricing totals when available and clearly indicate when specific pricing values are unavailable.

### Key Entities _(include if feature involves data)_

- **Cart**: The shopper's current confirmed collection of selected products, including its item list, confirmed quantities, and pricing summary.
- **Cart Item**: A single confirmed product entry in the cart, including product identity, confirmed quantity, and line-level pricing.
- **Product Detail Cart State**: The purchase area on the product detail page that shows either an Add to Cart action or a non-editable added-state summary based on the confirmed cart.

## Assumptions

- The current platform supports confirming cart contents through add-only cart submissions and does not currently support direct cart editing after confirmation.
- The cart experience supports one active confirmed cart per shopper at a time.
- Shoppers do not need to sign in to add products or review the cart for this feature.
- Direct quantity editing, direct removal, checkout, tax calculation, shipping selection, and payment are outside the scope of this change.
- The most recent successful cart confirmation overrides conflicting older locally stored cart data.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: At least 95% of shoppers can add a product from the product detail page and see a confirmed added state within 2 seconds of the action completing.
- **SC-002**: At least 95% of shoppers who reopen a product already in the confirmed cart can recognize its added status without attempting a duplicate add.
- **SC-003**: At least 95% of shoppers can open the cart screen and review confirmed cart contents and totals in under 30 seconds.
- **SC-004**: At least 95% of shoppers who relaunch the app see their last confirmed cart contents restored correctly on first view.
- **SC-005**: 100% of unsupported cart edit actions are absent from both the product detail page and the cart screen.
- **SC-006**: 100% of failed cart confirmation attempts preserve the last confirmed cart state and present a visible recovery message.
