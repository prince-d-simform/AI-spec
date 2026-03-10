# Research: Category-Wise Product Loading

**Phase 0 — All technical choices resolved**  
**Date**: 2026-03-10

---

## Decision 1: Reuse the existing `products` Redux slice for selected-category product loading

**Decision**: Extend the existing `app/redux/products/` slice to own category-specific product loading instead of creating a new Redux domain.

**Rationale**: The current codebase already keeps category metadata and all-products data in the `products` slice. Reusing that slice preserves centralized async ownership, aligns with the constitution’s Redux Toolkit discipline, and keeps Home logic consuming one product-domain store.

**Alternatives considered**:

- Create a new `categoryProducts` slice — rejected because it duplicates product-domain ownership and adds unnecessary coordination with the existing `products` slice.
- Keep selected-category products only in `useHome.tsx` local state — rejected because remote async state should not be owned exclusively by a screen hook.
- Persist selected-category products — rejected because the `products` slice is intentionally non-persisted remote UI state.

---

## Decision 2: Store selected-category results in one replace-only `productsByCategory` variable

**Decision**: Add a single `productsByCategory` variable to Redux that always contains only the latest successfully loaded selected-category products, replacing any previous category result set.

**Rationale**: The user explicitly required one shared store variable for category-wise data, and clarification confirmed that it should hold only the latest selected category’s list. This keeps the state model simple and prevents stale cross-category data from being treated as a cache.

**Alternatives considered**:

- Store results in a map keyed by category slug — rejected because the clarified behavior is latest-only, not cache-by-category.
- Store one list plus hidden cached copies elsewhere — rejected because it undermines the simplicity of the single-variable requirement.
- Reuse `allProducts` for category data — rejected because `All` browsing and selected-category browsing have different fetch rules and failure semantics.

---

## Decision 3: Build `/products/category/{slug}` through the shared API path formatter

**Decision**: Define the endpoint as a path template in `APIConst.ts` and pass `paths: { slug }` into the thunk payload so the shared API layer resolves the final URL through `formatString()`.

**Rationale**: `APIConfig.ts` already supports dynamic path substitution through the `paths` argument and `formatString()`. Using that path-formatting pattern keeps endpoint construction centralized and matches the user’s request to use the API config approach.

**Alternatives considered**:

- Concatenate the URL string manually in the hook or slice — rejected because it bypasses the shared API abstraction.
- Pass a fully built URL from the component — rejected because components should not own endpoint construction.
- Add a separate helper only for category paths — rejected because the current API layer already supports placeholder replacement.

---

## Decision 4: Trigger a fresh category request on every non-`All` chip tap

**Decision**: Every non-`All` category chip tap dispatches a fresh category-products thunk, even if that category was already loaded earlier in the same session.

**Rationale**: Clarification explicitly resolved repeated taps in favor of a fresh API request each time. This keeps chip interaction predictable and avoids silently reusing stale category data.

**Alternatives considered**:

- Reuse previous results when the same category is tapped again — rejected because it conflicts with the clarified behavior.
- Cache by category and fetch only if missing — rejected because the feature is not intended to maintain per-category history.
- Debounce repeated taps into a single request — rejected because each deliberate chip tap should initiate the selected category load.

---

## Decision 5: Enforce latest-request-only behavior through aborts plus reducer gating

**Decision**: Abort the prior in-flight category request from the Home hook and also track the active request identity in Redux so only the latest selected-category request can update `productsByCategory`.

**Rationale**: The existing async thunk pattern already supports cancellation, but aborts alone are not the strongest guard against stale late-arriving responses. A latest-request-only reducer policy makes rapid chip switching deterministic and satisfies the spec rule that the final visible state must match the most recent chip selection.

**Alternatives considered**:

- Only abort the previous request — rejected because reducer-side request gating is safer for race conditions.
- Allow whichever request finishes last to win — rejected because it can misalign the UI with the selected chip.
- Introduce saga-style `takeLatest` orchestration — rejected because the codebase standardizes on Redux Toolkit thunks.

---

## Decision 6: Clear `productsByCategory` on selected-category failure and show explicit failure UI

**Decision**: When a selected-category request fails, clear the category-specific result set and show an error state for the currently selected category.

**Rationale**: Clarification explicitly rejected showing the previous category’s results during a failure for a newly selected category. Clearing the data avoids mislabeled stale content and keeps failure feedback unambiguous.

**Alternatives considered**:

- Keep showing the previous category’s products until the new request succeeds — rejected because it risks implying those products belong to the newly selected category.
- Automatically return to `All` on category failure — rejected because the failure should remain associated with the shopper’s current selected category.
- Hide the failure silently and keep the screen unchanged — rejected because the shopper needs a clear recovery path.

---

## Decision 7: Reuse the existing normalized Home `Product` contract for category responses

**Decision**: Normalize `/products/category/{slug}` responses into the existing Home `Product` model and render them through the existing product card flow.

**Rationale**: `ProductCard` already consumes the normalized Home product shape, and the all-products feature already established a normalization pattern from the DummyJSON product transport. Reusing the same model keeps category-specific and all-products rendering consistent.

**Alternatives considered**:

- Store raw remote records for category responses — rejected because the Home UI is already built around the normalized `Product` contract.
- Create a second category-only UI model — rejected because the visible Home card requirements do not differ.
- Duplicate product-card rendering logic for category mode — rejected because it adds maintenance cost without feature value.
