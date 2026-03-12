# Research: Add-Only Cart Flow

**Date**: 2026-03-12  
**Feature**: [spec.md](./spec.md)

---

## Decision 1: Use `cartAdd` as the only cart confirmation endpoint

**Decision**: Remove `cartUpdate` endpoint usage and related update/remove action planning. Every cart confirmation request will use the existing add endpoint semantics and submit the full desired cart item list with target quantities.

**Rationale**:

- The feature specification explicitly removes unsupported direct cart updates.
- The latest user instruction requires removing `cartUpdate` API and actions and always calling `cartAdd` with the items and quantities that should exist in the confirmed cart.
- Using one endpoint keeps the request lifecycle simpler and avoids documenting unsupported behavior.

**Alternatives considered**:

- Keep `PUT /carts/{cartId}` and hide update UI — rejected because the requested feature explicitly removes update behavior.
- Use `cartAdd` only for the first item and leave later behavior undefined — rejected because the cart still needs a consistent confirmation rule when another product is added later.

---

## Decision 2: Submit the full desired cart contents on every add confirmation

**Decision**: When a shopper adds a new product and a confirmed cart already exists, the app will build the request payload from the last confirmed snapshot plus the new product and send that full product list to `cartAdd`.

**Rationale**:

- The app must preserve previously confirmed items while adding a new product.
- Sending the full desired product list avoids dependence on unsupported incremental update semantics.
- The current cart snapshot already contains the item identities and confirmed quantities needed to compose the next request.

**Alternatives considered**:

- Send only the newly added product — rejected because it would not guarantee preservation of existing confirmed cart contents.
- Allow duplicate lines for repeated products — rejected because the specification requires one confirmed cart line per product.

---

## Decision 3: Make Product Detail and Cart screen review-only after confirmation

**Decision**: Replace quantity-edit controls with read-only confirmed-cart states. Product Detail will show `Add to Cart` or a non-editable added-state summary. The Cart tab will show confirmed items and totals without increment, decrement, or remove controls.

**Rationale**:

- Direct cart editing is explicitly out of scope for the current API capability.
- Read-only confirmed states keep the UI honest and aligned with backend support.
- This simplifies failure handling because only add confirmations can mutate the cart.

**Alternatives considered**:

- Keep quantity controls and emulate updates locally — rejected because it would present unsupported behavior and risk divergence from the confirmed API state.
- Remove the cart screen entirely — rejected because the specification still requires a dedicated review surface.

---

## Decision 4: Preserve the confirmed cart snapshot as the single source of truth

**Decision**: Continue persisting only the latest confirmed normalized cart snapshot plus hydration metadata in Redux/MMKV, and continue treating the latest successful API response as canonical.

**Rationale**:

- The existing store pattern already supports persisted cart fallback without relying on user identity.
- This matches the feature requirement to restore cart state after relaunch and to preserve the last confirmed snapshot on failure.
- It minimizes implementation churn by reusing the existing persistence transform pattern.

**Alternatives considered**:

- Persist request drafts or optimistic local mutations — rejected because the spec requires confirmed-cart behavior, not optimistic edits.
- Restore cart state by user id lookup — rejected because the spec explicitly forbids dependence on stored user identity.

---

## Decision 5: Reuse the existing Redux thunk and API client architecture

**Decision**: Keep all cart network behavior inside `app/redux/cart/CartSlice.ts` using the centralized API client and typed async thunk pattern from `app/configs/APIConfig.ts`.

**Rationale**:

- The constitution forbids direct screen-level API calls.
- Existing shared error handling, cancellation, path formatting, and thunk typing are already centralized.
- Reusing the current slice/selector structure minimizes architectural drift.

**Alternatives considered**:

- Call the API directly from `useDetails.ts` or `useCart.ts` — rejected because it violates the Redux and clean-architecture rules.
- Introduce a parallel cart service layer solely for this feature — rejected because the repo already standardizes thunk-based request ownership.

---

## Decision 6: Keep pricing rows explicit but mark unavailable values safely

**Decision**: The cart review screen will continue rendering subtotal, tax, shipping, and grand total rows, but unavailable values will be displayed as unavailable rather than fabricated.

**Rationale**:

- The specification requires explicit pricing review while avoiding misleading totals.
- Existing cart normalization already distinguishes confirmed values from unavailable ones.
- This preserves parity with the prior cart feature direction while remaining honest about backend data.

**Alternatives considered**:

- Hide unavailable pricing rows entirely — rejected because the spec calls for a consistent pricing summary.
- Compute estimated values locally — rejected because fake totals would misrepresent confirmed backend data.

---

## Resolved Clarifications

No unresolved technical clarifications remain for planning. The cart contract decision is resolved: remove `cartUpdate` usage and use add-only full-snapshot submissions through `cartAdd`.
