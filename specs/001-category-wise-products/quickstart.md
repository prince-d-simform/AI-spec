# Quickstart: Category-Wise Product Loading

**Feature**: `001-category-wise-products`  
**Date**: 2026-03-10

---

## Overview

This feature adds live category-specific product loading to the Home screen by calling `/products/category/{slug}` whenever the shopper taps a non-`All` category chip.

- Endpoint: `/products/category/{slug}`
- Invocation: every non-`All` chip tap
- Redux domain: existing `app/redux/products/`
- Category data source: single latest-result variable `productsByCategory`
- `All` behavior: continues to use the separate full-catalog source
- Failure strategy: clear category results and show error state for the selected category
- Repeat taps: issue a fresh request every time

---

## Files to Touch

| Action | File                                     | What changes                                                                                                      |
| ------ | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| MODIFY | `app/constants/APIConst.ts`              | Add the path-template endpoint for category-wise products                                                         |
| MODIFY | `app/constants/ToolkitAction.ts`         | Add the category-products thunk action name                                                                       |
| MODIFY | `app/redux/products/ProductsInitial.ts`  | Add `productsByCategory` and category-specific request metadata                                                   |
| MODIFY | `app/redux/products/ProductsSelector.ts` | Add selectors for category-specific products, loading, error, and selected slug                                   |
| MODIFY | `app/redux/products/ProductsSlice.ts`    | Add the `/products/category/{slug}` thunk, latest-request-only handling, and reducers for `productsByCategory`    |
| MODIFY | `app/modules/home/useHome.tsx`           | Dispatch category-product requests on chip taps, abort stale requests, and switch visible products by active chip |
| MODIFY | `app/modules/home/HomeScreen.tsx`        | Show category-specific loading, empty, error, and retry states                                                    |
| MODIFY | `app/constants/Strings.ts`               | Expose centralized copy for category-specific loading and failure feedback if new copy is needed                  |
| MODIFY | `app/translations/en.json`               | Add category-specific strings if new copy is introduced                                                           |
| MODIFY | `app/types/index.ts`                     | Re-export any shared transport type additions if necessary                                                        |

---

## Implementation Order

### Step 1 — Extend the shared contract surface

1. Add the category-products path template to `APIConst.ts`.
2. Add the matching thunk action name to `ToolkitAction.ts`.
3. Reuse or extend the existing remote product response types for the category-products wrapper.

### Step 2 — Expand the existing `products` slice

1. Add `productsByCategory` and category-request metadata to `ProductsInitial.ts`.
2. Add selectors for the selected-category dataset and category request state.
3. Add `getCategoryProductsRequest` in `ProductsSlice.ts` using `createAsyncThunkWithCancelToken()` and `unauthorizedAPI`.
4. Pass `paths: { slug }` into the thunk so the API layer resolves `/products/category/{slug}`.
5. Normalize the response into the existing Home `Product` shape.
6. Track the active request identity so only the latest category request can update state.
7. Clear `productsByCategory` at the start of a new selected-category request and again on selected-category failure.

### Step 3 — Rewire the Home module for category-specific server loading

1. In `useHome.tsx`, keep `All` as a special case and dispatch a fresh category request for every non-`All` chip tap.
2. Abort the previous in-flight category request before starting a new one.
3. Derive visible products from `allProducts` when `activeCategory === 'all'`, otherwise from `productsByCategory`.
4. Keep retry behavior scoped to the currently selected category.

### Step 4 — Add selected-category UX states

1. Show category-specific loading feedback while a selected category request is in flight.
2. Show a category-specific empty state when the selected category returns no products.
3. Show a failure state with retry when the selected category request fails.
4. Ensure loading and failed selected-category requests do not keep showing the prior category’s products.

### Step 5 — Validate and document

1. Keep all user-facing strings centralized.
2. Preserve theme-driven styles and existing shared components.
3. Run lint and type validation.
4. Verify the manual scenarios below.

---

## Verification

### Quality gates

```bash
yarn lint
yarn types
```

### Manual checks

1. Open the Home screen and confirm the `All` chip continues to show the full-catalog source.
2. Tap a non-`All` category chip and confirm the app calls `/products/category/{slug}` for that chip.
3. Confirm the selected category shows loading feedback while the request is in flight.
4. Confirm a successful category response replaces `productsByCategory` and updates the visible grid.
5. Tap a different category and confirm the previous category results are replaced by the newly selected category results.
6. Tap the same non-`All` category again and confirm a fresh request is made.
7. Tap category chips rapidly and confirm the final visible state matches the most recent chip tap.
8. Simulate a selected-category failure and confirm category results are cleared and a retry UI appears.
9. Retry the failed selected category and confirm success restores the selected category’s products.
10. Simulate an empty selected-category response and confirm a category-specific empty state appears.
11. Return to `All` and confirm category-specific data no longer controls the visible list.

---

## Constraints Reminder

- Do not create a new Redux slice or cache-by-category data structure.
- Do not build endpoint paths manually in components.
- Do not reuse a previous category’s products as the visible state for a newly failed selected category.
- Do not skip the API call when the same non-`All` category is tapped again.
- Do not add inline user-facing strings.
- Do not persist category-specific product results for this feature.
