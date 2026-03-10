# Research: Product Detail Page

**Phase 0 — All technical choices resolved**  
**Date**: 2026-03-10

---

## Decision 1: Reuse the existing `products` Redux slice for product-detail state

**Decision**: Extend `app/redux/products/` with a dedicated active product-detail substate instead of creating a new `details` Redux slice or keeping the entire detail lifecycle inside screen-local state.

**Rationale**: Product detail belongs to the same product domain already managed by the `products` slice. Reusing the existing domain preserves centralized async ownership, keeps retry/unavailable/loading state consistent with Home, and matches the project constitution’s Redux Toolkit discipline.

**Alternatives considered**:

- Create a new `productDetail` slice — rejected because it duplicates product-domain ownership and adds unnecessary coordination overhead.
- Keep detail state only in `useDetails.ts` — rejected because remote async state, retry behavior, and stale-request protection are better owned in Redux.
- Persist product-detail state — rejected because the current product-browsing domain is intentionally non-persisted remote UI state.

---

## Decision 2: Use a single active detail state rather than a by-id cache for this feature

**Decision**: Store one active product-detail record in Redux, keyed by the currently viewed product identity and guarded by request metadata, instead of maintaining a session cache of multiple detail payloads.

**Rationale**: The clarified behavior says the Product Detail page should navigate immediately and show a loading-only view until full detail arrives. A single active-detail state keeps the implementation simple, aligns with one-screen-at-a-time browsing, and avoids introducing premature cache invalidation rules.

**Alternatives considered**:

- Cache details by `id` for the full session — rejected because the feature does not require cached reopen behavior and would add invalidation and stale-content rules.
- Render from the tapped summary while loading — rejected because clarification explicitly chose a dedicated loading state instead of partial summary content.
- Keep no Redux detail state at all — rejected because loading/failure/unavailable transitions still need centralized coordination.

---

## Decision 3: Fetch `/products/{id}` fresh on every Product Detail open

**Decision**: Every time a shopper opens a product, dispatch a fresh `/products/{id}` request.

**Rationale**: A fresh request keeps the detail page aligned with the latest backend data, fits the loading-only clarified behavior, and avoids hidden session-cache rules that the user did not request.

**Alternatives considered**:

- Reuse previously loaded detail responses — rejected because the feature does not require reopen caching and a stale cached detail could diverge from current backend state.
- Show cached content while refreshing in the background — rejected because it introduces a more complex stale-data contract than needed for the initial implementation.
- Debounce or suppress repeated same-product opens — rejected because each deliberate product open should load the selected product cleanly.

---

## Decision 4: Navigate immediately with only the product `id` as the route parameter

**Decision**: Open the Details route immediately after a product tap and pass only the selected product `id` in navigation params.

**Rationale**: Passing only the stable identity keeps navigation typed and minimal, prevents summary data from being treated as full detail content, and aligns with the clarified requirement to show a dedicated loading state until `/products/{id}` resolves.

**Alternatives considered**:

- Pass the full summary product object — rejected because it encourages rendering partial product data as if it were the full detail payload.
- Delay navigation until the request finishes — rejected because clarification explicitly chose immediate navigation.
- Pass both `id` and summary content — rejected because it complicates the page contract without adding required user value.

---

## Decision 5: Build the endpoint through the shared API path formatter

**Decision**: Define the endpoint as `/products/{id}` in `APIConst.ts` and dispatch the thunk with `paths: { id }` so `APIConfig.ts` resolves the final URL through `formatString()`.

**Rationale**: The repo already standardizes dynamic path replacement through the shared API layer. Reusing that pattern keeps endpoint construction centralized and consistent with the category-products work already present in the codebase.

**Alternatives considered**:

- Concatenate the URL manually inside the hook or screen — rejected because components should not own endpoint construction.
- Create a one-off helper for product-detail URL generation — rejected because the shared API layer already supports path templates.
- Hardcode the final URL string in the thunk call — rejected because it bypasses the existing abstraction.

---

## Decision 6: Normalize the remote payload into a dedicated `ProductDetail` model

**Decision**: Keep the list-card `Product` summary model unchanged and introduce a separate normalized `ProductDetail` model for the full `/products/{id}` payload.

**Rationale**: The Home `Product` type intentionally holds only list-browsing fields. The product-detail endpoint contains richer data such as dimensions, shipping, warranty, reviews, and metadata that should not be forced into the summary model.

**Alternatives considered**:

- Reuse the Home `Product` type for the detail page — rejected because it loses most of the endpoint value.
- Render the raw transport object directly — rejected because the UI benefits from a normalized, screen-friendly contract.
- Split the detail data into many separate untyped section objects — rejected because a single typed detail model is easier to reason about and test.

---

## Decision 7: Use a marketplace-style sectioned detail layout

**Decision**: Organize the Product Detail page as a scrollable, sectioned screen with hero media, summary, pricing/status, description, tags/brand, shipping/warranty/return information, specifications, reviews, and low-priority metadata.

**Rationale**: The user asked for a cool and user-friendly detail page, and the sample payload supports a marketplace-style layout. A sectioned layout makes the high-value details scannable while still exposing the full richness of the endpoint.

**Alternatives considered**:

- Render a flat ungrouped list of fields — rejected because it would feel technical and hard to scan.
- Show only a small subset of major fields — rejected because clarification explicitly requested all major endpoint fields where available.
- Create multiple nested routes for reviews and specs — rejected because the initial feature scope is a single Product Detail page.

---

## Decision 8: Treat unavailable/not-found separately from generic request failure

**Decision**: Model an unavailable/not-found outcome as its own UI state with both retry and back actions, distinct from a generic network or server failure.

**Rationale**: The specification explicitly requires a dedicated unavailable state and both retry/back actions. Separating this from generic failure keeps recovery messaging precise and avoids conflating backend lookup absence with transient transport errors.

**Alternatives considered**:

- Fold unavailable into generic error UI — rejected because the spec calls for a dedicated unavailable outcome.
- Auto-navigate back on unavailable — rejected because the user chose an unavailable state with user-controlled actions.
- Offer only back without retry — rejected because clarification explicitly selected both retry and back actions.
