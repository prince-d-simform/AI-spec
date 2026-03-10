# Quickstart: Product Detail Page

**Feature**: `001-product-detail-page`  
**Date**: 2026-03-10

---

## Overview

This feature adds a new Product Detail page that opens when the shopper taps a product card and loads `/products/{id}` for the selected product.

- Endpoint: `/products/{id}`
- Navigation timing: immediate navigation on product tap
- Initial page state: dedicated loading state until full detail arrives
- Redux domain: existing `app/redux/products/`
- Detail state strategy: single active product-detail state in memory
- Retry strategy: retry the currently selected `id`
- Unavailable strategy: dedicated unavailable state with retry and back actions
- Detail content strategy: show every major endpoint field when available

---

## Files to Touch

| Action       | File                                                               | What changes                                                                                      |
| ------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| MODIFY       | `app/constants/APIConst.ts`                                        | Add `/products/{id}` path-template endpoint                                                       |
| MODIFY       | `app/constants/ToolkitAction.ts`                                   | Add the product-detail thunk action name                                                          |
| MODIFY       | `app/constants/Strings.ts`                                         | Expose centralized copy for detail loading, unavailable, retry, section labels, and failures      |
| MODIFY       | `app/translations/en.json`                                         | Add product-detail strings                                                                        |
| MODIFY       | `app/types/ProductListResponse.ts`                                 | Reuse or extend remote product transport typing for single-detail responses                       |
| MODIFY       | `app/types/index.ts`                                               | Re-export any shared detail transport additions                                                   |
| MODIFY       | `app/navigation/AppNavigation.tsx`                                 | Type `ROUTES.Details` with a product `id` param                                                   |
| MODIFY       | `app/redux/products/ProductsInitial.ts`                            | Add active product-detail state and request metadata                                              |
| MODIFY       | `app/redux/products/ProductsSelector.ts`                           | Add product-detail selectors                                                                      |
| MODIFY       | `app/redux/products/ProductsSlice.ts`                              | Add `/products/{id}` thunk, normalization, latest-request-only handling, and clear-detail reducer |
| MODIFY       | `app/modules/home/useHome.tsx`                                     | Wire product taps to Product Detail navigation                                                    |
| MODIFY       | `app/modules/home/sub-components/product-card/ProductCard.tsx`     | Make product cards actionable for detail navigation                                               |
| MODIFY       | `app/modules/home/sub-components/product-card/ProductCardTypes.ts` | Add typed detail-navigation press support                                                         |
| MODIFY       | `app/modules/details/DetailsScreen.tsx`                            | Replace the placeholder with the Product Detail screen                                            |
| ADD          | `app/modules/details/DetailsTypes.ts`                              | Add typed Product Detail view contracts                                                           |
| ADD          | `app/modules/details/useDetails.ts`                                | Add screen-level orchestration hook for detail loading and retry                                  |
| MODIFY       | `app/modules/details/DetailsStyles.ts`                             | Add marketplace-style themed layout styles                                                        |
| MODIFY       | `app/modules/details/index.ts`                                     | Re-export Product Detail screen types for shared imports                                          |
| OPTIONAL ADD | `app/modules/details/sub-components/`                              | Add feature-specific detail subcomponents only if section complexity justifies them               |

---

## Implementation Order

### Step 1 — Extend shared contracts and navigation

1. Add `productDetail: '/products/{id}'` to `APIConst.ts`.
2. Add `getProductDetail` to `ToolkitAction.ts`.
3. Update remote product transport types for the single-object detail response if needed.
4. Type `ROUTES.Details` with `{ id: string }` in the stack param list.

### Step 2 — Expand the `products` Redux domain

1. Add active product-detail state fields to `ProductsInitial.ts`.
2. Add selectors for selected detail, loading, error, unavailable, and request metadata.
3. Add `getProductDetailRequest` using `createAsyncThunkWithCancelToken()` and `unauthorizedAPI`.
4. Pass `paths: { id }` into the thunk so the shared API layer resolves `/products/{id}`.
5. Normalize the payload into a dedicated `ProductDetail` model.
6. Guard reducers with request identity so stale responses cannot overwrite the active detail screen.
7. Clear prior active detail data when a new product-detail request starts.

### Step 3 — Wire Home product taps to Details navigation

1. Add a stable product-press callback in `useHome.tsx`.
2. Route taps through `NavigatorUtils` rather than raw inline `navigation.navigate()` calls.
3. Update `ProductCard` props so each card can open Product Detail.
4. Preserve current Home loading/filter behavior while adding navigation.

### Step 4 — Build the Details module

1. Add `DetailsTypes.ts` and `useDetails.ts` to match the project module pattern.
2. Replace the placeholder `DetailsScreen.tsx` with a themed, scrollable Product Detail screen.
3. Show a dedicated loading state until full detail arrives.
4. Render a marketplace-style layout with hero imagery, thumbnail switching, summary, detail sections, reviews, and lower-priority metadata.
5. Hide optional sections when their data is absent.
6. Add generic failure and unavailable states with both retry and back actions.

### Step 5 — Validate and document

1. Keep all copy centralized in `Strings.ts` and `en.json`.
2. Ensure styles use the theme system and scaled values only.
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

1. Open Home and tap a product card.
2. Confirm the app navigates immediately to Product Detail.
3. Confirm the Product Detail page shows a loading state until `/products/{id}` returns.
4. Confirm the loaded page shows the selected product’s title, images, price, rating, description, and major additional fields from the endpoint.
5. Confirm tags, brand, shipping, warranty, return policy, stock, dimensions, reviews, and metadata appear only when present.
6. Confirm opening a second product results in the second product detail replacing the first, with no stale content leak.
7. Confirm a generic request failure shows retry and back actions.
8. Confirm an unavailable/not-found outcome shows the dedicated unavailable state with retry and back actions.
9. Confirm retry reloads the same selected product.
10. Confirm back returns the shopper to the prior browsing context.
11. Confirm repeated opens of the same product still issue a fresh request.

---

## Constraints Reminder

- Do not render the detail body from the tapped summary card while waiting for `/products/{id}`.
- Do not create a new top-level Redux slice for this feature.
- Do not bypass `APIConfig.ts` path substitution with manual URL concatenation.
- Do not add inline user-facing strings.
- Do not persist product-detail browsing state.
- Do not introduce hardcoded styling values outside the theme system.
