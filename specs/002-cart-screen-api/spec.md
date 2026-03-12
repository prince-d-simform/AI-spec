# Feature Specification: Cart Screen and Item Controls

**Feature Branch**: `[002-cart-screen-api]`  
**Created**: 2026-03-12  
**Status**: Draft  
**Input**: User description: "Implement a cart screen, add an Add to Cart button at the bottom of the product detail page, switch it to quantity controls after adding, and integrate cart creation through the API."

## Clarifications

### Session 2026-03-12

- Q: Should the cart screen allow users to change quantities and remove items directly? → A: The cart screen allows increment, decrement, and remove actions for each item.
- Q: Must shoppers be signed in before using cart actions? → A: Sign-in is not required; cart API requests may use a dummy user id.
- Q: How should cart state persist across app relaunches? → A: Persist cart information locally and do not rely on user id for restoration.
- Q: When local cart data and API cart data differ, which should win? → A: Use the API response as the source of truth after a successful sync; use local cart data only as a fallback.
- Q: Which pricing totals should the cart show? → A: Show subtotal, tax, shipping, and grand total.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add an item from product details (Priority: P1)

As a shopper viewing a product, I want to add the product to my cart from the product detail page so I can start building my order without leaving the page.

**Why this priority**: This is the entry point for cart usage and the minimum flow required to create a usable shopping cart.

**Independent Test**: Can be fully tested by opening a product detail page, adding the product once, and confirming that the item is added to an active cart and the primary control changes state.

**Acceptance Scenarios**:

1. **Given** a shopper is viewing a product that is not yet in the cart, **When** the shopper selects Add to Cart, **Then** the system creates or reuses an active cart, adds the product with quantity 1, and replaces the Add to Cart action with quantity controls.
2. **Given** a shopper has already added the product to the cart, **When** the shopper returns to the same product detail page, **Then** the page shows the current quantity controls instead of the Add to Cart action.
3. **Given** a shopper previously added products and relaunches the app, **When** the shopper opens a product detail page or the cart screen, **Then** the UI restores the last persisted cart state without requiring a user id lookup.
4. **Given** locally persisted cart data differs from the latest successful cart API response, **When** the system receives a successful cart response, **Then** the UI and local persistence update to match the API response.

---

### User Story 2 - Adjust quantity from the product detail page (Priority: P2)

As a shopper, I want to increase, decrease, or remove the product directly from the product detail page so I can manage my cart quickly without extra navigation.

**Why this priority**: Once an item is added, quantity management is the most common next action and directly affects cart accuracy.

**Independent Test**: Can be fully tested by starting with a product already in the cart, increasing and decreasing the quantity, and confirming the displayed quantity and cart contents stay accurate.

**Acceptance Scenarios**:

1. **Given** a product is already in the cart with quantity 1 or more, **When** the shopper selects the plus control, **Then** the system increases the quantity by 1 and updates the displayed quantity.
2. **Given** a product is in the cart with quantity greater than 1, **When** the shopper selects the minus control, **Then** the system decreases the quantity by 1 and updates the displayed quantity.
3. **Given** a product is in the cart with quantity 1, **When** the shopper selects the delete or minus control, **Then** the system removes the product from the cart and restores the Add to Cart action.

---

### User Story 3 - Manage cart contents on a dedicated cart screen (Priority: P3)

As a shopper, I want to open a cart screen and manage the items I selected so I can confirm and adjust my cart in one place.

**Why this priority**: A cart screen gives users confidence that their selected items and quantities are correct and lets them make quick corrections, but it depends on item creation and quantity management already working.

**Independent Test**: Can be fully tested by adding one or more items, opening the cart screen, and confirming that the item list, quantities, totals, and item controls match the last confirmed cart state.

**Acceptance Scenarios**:

1. **Given** the shopper has one or more items in the cart, **When** the shopper opens the cart screen, **Then** the screen shows each cart item with its product summary, quantity, quantity controls, remove action, and a pricing summary with subtotal, tax, shipping, and grand total.
2. **Given** the shopper has no items in the cart, **When** the shopper opens the cart screen, **Then** the screen shows an empty-cart state with guidance to continue shopping.
3. **Given** the shopper is viewing the cart screen, **When** the shopper increases, decreases, or removes an item, **Then** the cart screen updates the affected item and pricing summary using the latest confirmed cart state.

### Edge Cases

- If a shopper taps Add to Cart multiple times in quick succession, the system should prevent duplicate line items for the same product and show the confirmed quantity only once.
- If cart creation or a cart update cannot be completed, the system should preserve the last confirmed cart state and show a clear recovery message.
- If a shopper removes the final remaining item, the cart should transition to an empty state and the product detail page should return to the Add to Cart action.
- If the shopper leaves and returns to the product detail page during the same shopping session, the cart control should reflect the latest confirmed quantity.
- If the shopper updates quantities on the cart screen, the product detail page for the same product should reflect the latest confirmed quantity when reopened.
- If the app is relaunched, the cart should restore from locally persisted cart information even when no user id is available for state restoration.
- If locally persisted cart data differs from a newly successful API response, the system should replace the local cart with the successful API result instead of merging conflicting quantities.
- If tax or shipping values are unavailable for the current cart response, the system should show a safe fallback state instead of displaying misleading totals.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST show a primary Add to Cart action at the bottom of the product detail page when the viewed product is not currently in the shopper's cart.
- **FR-002**: When the shopper adds a product for the first time, the system MUST create a new active cart if none exists, or reuse the shopper's existing active cart if one is already available.
- **FR-003**: When a product is successfully added, the system MUST add the product to the cart with an initial quantity of 1.
- **FR-004**: After a successful add, the system MUST replace the Add to Cart action with quantity controls that include decrement or delete, the current quantity, and increment.
- **FR-005**: The system MUST allow the shopper to increase the quantity of a cart item directly from the product detail page.
- **FR-006**: The system MUST allow the shopper to decrease the quantity of a cart item directly from the product detail page.
- **FR-007**: When the shopper decreases a cart item from quantity 1, the system MUST remove that item from the cart and restore the Add to Cart action for that product.
- **FR-008**: The system MUST maintain a single cart line for each product and adjust its quantity instead of creating duplicate entries for the same product.
- **FR-009**: The system MUST provide a dedicated cart screen that displays all current cart items, their quantities, quantity controls, remove actions, and a pricing summary that includes subtotal, tax, shipping, and grand total.
- **FR-010**: The cart screen MUST reflect the latest confirmed cart state whenever the shopper opens it.
- **FR-011**: If the cart has no items, the system MUST show an empty-cart state that clearly communicates that no items are currently selected.
- **FR-012**: If cart creation, add, update, or removal fails, the system MUST show a clear error message and keep the last confirmed cart state visible to the shopper.
- **FR-013**: The system MUST keep cart state consistent between the product detail page and the cart screen during the shopper's active shopping session.
- **FR-014**: The system MUST allow the shopper to increase, decrease, or remove cart items directly from the cart screen.
- **FR-015**: The system MUST allow shoppers to create and manage a cart without requiring sign-in.
- **FR-016**: The system MUST persist the latest confirmed cart information locally so the cart can be restored after app relaunch.
- **FR-017**: The system MUST restore cart state from locally persisted cart information without depending on a stored user id.
- **FR-018**: If the cart API requires a user identifier while sign-in is unavailable, the system MAY use an application-provided dummy user id for request submission.
- **FR-019**: After any successful cart API response, the system MUST treat the returned cart data as the source of truth for UI state and local persistence.
- **FR-020**: The system MUST use locally persisted cart information only when no newer successful cart API response is available.
- **FR-021**: The system MUST display subtotal, tax, shipping, and grand total values from the latest confirmed cart data on the cart screen.

### Key Entities _(include if feature involves data)_

- **Cart**: The shopper's active collection of selected products, including cart status, item list, item count, and pricing summary.
- **Cart Item**: A single selected product within the cart, including product identity, quantity, unit price, and line total.
- **Product Detail Cart Control**: The purchase action area on the product detail page that shows either Add to Cart or the current quantity controls based on the cart state.

## Assumptions

- The feature supports a single active cart per shopper at a time.
- Shoppers do not need to sign in to use the cart for this feature.
- Cart restoration is based on locally persisted cart information rather than a persisted user id.
- A dummy user id may still be supplied only when needed to satisfy cart API request parameters.
- A successful cart API response overrides conflicting locally persisted cart data.
- Checkout, shipping, tax calculation, and payment are outside the scope of this feature.
- Pricing shown in the cart uses the latest confirmed subtotal, tax, shipping, and grand total values available to the shopper at the time the cart is displayed.
- Quantity changes apply only to products that can be added to the cart; product eligibility rules are handled before a cart update is confirmed.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: At least 95% of shoppers can add a product from the product detail page and see the quantity controls update within 2 seconds of their action completing.
- **SC-002**: At least 95% of shoppers can increase, decrease, or remove a cart item from the product detail page on their first attempt without needing to retry.
- **SC-003**: At least 95% of shoppers who open the cart screen see cart contents that match their last confirmed item selections and quantities.
- **SC-003**: At least 95% of shoppers who reopen the app and open the cart screen see cart contents that match their last locally confirmed item selections and quantities.
- **SC-004**: Shoppers can review their cart contents and pricing summary in under 30 seconds after adding at least one item.
- **SC-004**: Shoppers can review their cart contents and pricing summary, including subtotal, tax, shipping, and grand total, in under 30 seconds after adding at least one item.
- **SC-005**: 100% of failed cart actions present a visible recovery message and do not display an unconfirmed quantity to the shopper.
- **SC-006**: At least 95% of successful cart syncs update both the visible cart state and locally persisted cart data to match the latest API response.
