# Quickstart: All Products Catalog Loading

**Feature**: `001-all-products-api`  
**Date**: 2026-03-09

---

## Overview

This feature replaces the Home screen’s static `All` product grid source with live data from `/products` while preserving chip-based local filtering and the existing `products` Redux domain.

- Endpoint: `/products`
- Invocation: first Home load in the current session
- Redux domain: existing `app/redux/products/`
- Filtering model: local derivation from canonical `allProducts`
- Manual refresh: pull-to-refresh on the product list
- Failure strategy: preserve last successful catalog on refresh failure

---

## Files to Touch

| Action | File                                     | What changes                                                                                                                      |
| ------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| MODIFY | `app/constants/APIConst.ts`              | Add the path-only `/products` endpoint constant                                                                                   |
| MODIFY | `app/constants/ToolkitAction.ts`         | Add the all-products thunk action name                                                                                            |
| MODIFY | `app/types/index.ts`                     | Re-export the new products response type                                                                                          |
| CREATE | `app/types/ProductListResponse.ts`       | Define the `/products` wrapper response and nested transport types                                                                |
| MODIFY | `app/redux/products/ProductsInitial.ts`  | Extend existing state with canonical all-products data and product request status                                                 |
| MODIFY | `app/redux/products/ProductsSelector.ts` | Add selectors for all-products list, loading, refreshing, and error state                                                         |
| MODIFY | `app/redux/products/ProductsSlice.ts`    | Add `/products` thunk, normalize remote records, and preserve prior catalog on refresh failure                                    |
| MODIFY | `app/redux/products/index.ts`            | Keep barrel exports aligned if new selectors/actions/types change                                                                 |
| MODIFY | `app/modules/home/useHome.tsx`           | Replace static `PRODUCTS` consumption with Redux-backed `allProducts`, initial-load dispatch, retry, and pull-to-refresh handlers |
| MODIFY | `app/modules/home/HomeScreen.tsx`        | Wire product loading, product failure, and pull-to-refresh into the grid                                                          |
| MODIFY | `app/modules/home/HomeData.ts`           | Remove `PRODUCTS` as the production source for Home grid data; keep only feature-local static values still needed                 |
| MODIFY | `app/constants/Strings.ts`               | Expose centralized copy for product loading, retry, and refresh failure feedback                                                  |
| MODIFY | `app/translations/en.json`               | Add Home strings for product-loading and product-error states                                                                     |

---

## Implementation Order

### Step 1 — Extend the shared contract surface

1. Add `/products` to `APIConst.ts`.
2. Add the matching thunk action name to `ToolkitAction.ts`.
3. Create `ProductListResponse.ts` with the full remote wrapper and nested transport types.
4. Export the new types from `app/types/index.ts`.

### Step 2 — Expand the existing `products` slice

1. Keep the existing category branch intact.
2. Add `allProducts`, product loading flags, product error state, and response metadata to `ProductsInitial.ts`.
3. Add a `getAllProductsRequest` thunk in `ProductsSlice.ts` using `createAsyncThunkWithCancelToken()` and `unauthorizedAPI`, requesting the complete catalog payload from `/products` during initial Home loading.
4. Normalize the remote payload into the existing Home `Product` shape before storing it.
5. Preserve the previously successful `allProducts` dataset when a refresh fails.
6. Keep the slice non-persisted.

### Step 3 — Rewire the Home module to Redux-backed products

1. In `useHome.tsx`, consume `allProducts` and product request state from selectors.
2. Trigger the initial all-products request when the Home screen loads and the canonical catalog has not yet been loaded.
3. Continue keeping `activeCategory` local to the Home hook.
4. Derive `filteredProducts` with `useMemo` from `allProducts` and the selected chip.
5. Reset the active chip to `all` if the selected category no longer exists after a category refresh.

### Step 4 — Add refresh and failure UX

1. Support pull-to-refresh in `HomeScreen.tsx` for explicit catalog refresh.
2. Show blocking retry UI when the first all-products load fails.
3. Keep the previous grid visible when pull-to-refresh fails after a prior success.
4. Preserve `All`-only browsing when category chips fail but `allProducts` is available.

### Step 5 — Keep strings and cleanup compliant

1. Move all new user-facing copy into `translations/en.json` and `Strings.ts`.
2. Remove the static product list from active Home usage.
3. Keep callbacks memoized and preserve existing `FlatList` performance settings.
4. Ensure any new loading or error UI remains theme-driven and uses existing shared components where possible.

---

## Verification

### Quality gates

```bash
yarn lint
yarn types
```

### Manual checks

1. Open the Home screen and confirm the `All` chip loads products from `/products` on the first screen load and stores the complete response as the canonical `allProducts` dataset.
2. Confirm the initial Home load shows product-loading feedback before the first successful catalog response.
3. Confirm the grid displays the live remote catalog rather than the previous static `PRODUCTS` list.
4. Switch between category chips and confirm only the visible subset changes.
5. Return to `All` and confirm the full catalog is restored unchanged.
6. Revisit the Home screen without refresh and confirm the stored in-memory catalog is reused.
7. Pull to refresh and confirm a successful refresh updates the visible `All` dataset.
8. Simulate a refresh failure after prior success and confirm the previous catalog remains browseable.
9. Simulate an initial all-products failure and confirm retry UI appears.
10. Simulate category failure while products succeed and confirm `All`-only browsing still works.
11. Reopen the Home screen after a successful load and confirm no automatic product reload occurs until retry or pull-to-refresh is triggered.

---

## Constraints Reminder

- Do not create a new Redux slice or domain for all-products data.
- Do not fetch products directly inside components.
- Do not auto-refresh the catalog solely because the user revisits the Home screen.
- Do not mutate the canonical `allProducts` dataset when switching chips.
- Do not add inline user-facing strings.
- Do not persist the `products` slice for this feature.
