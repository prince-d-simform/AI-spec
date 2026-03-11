# UI Contract: Home Header Top Insets

**Type**: Internal UI Layout Contract  
**Date**: 2026-03-11  
**Feature**: `001-home-header-inset`

---

## Scope

This contract governs the top placement of the Home screen header relative to the device safe area.

In-scope UI:

- Home header section
- Relationship between header, category row, and product list

Out of scope:

- Home header content redesign
- Category filtering behavior
- Product list behavior
- Product Detail navigation flow

---

## Layout Contract

### Required behavior

1. The Home header must render below the protected top device area.
2. The Home header must be fully visible on first render.
3. The category row must not receive the notch-driven top inset.
4. The product list must not receive the notch-driven top inset.
5. The Home layout must remain visually balanced after the header spacing is corrected.

---

## Safe-Area Contract

### Source of truth

- The top inset must come from the device safe-area system.
- The implementation should reuse the repo’s existing top safe-area helper.

### Rules

1. The top inset value must not be hardcoded.
2. The top inset may be zero on some devices.
3. The Home header must combine its normal top spacing with the current top inset.
4. The fix must remain stable when returning to Home after navigating elsewhere.

---

## Visual Outcome Contract

### Notched / large-inset devices

- Header title and subtitle remain fully visible.
- No header content overlaps the notch or status area.

### Small-inset / no-inset devices

- No excessive empty gap is introduced above the header.
- The Home screen still feels visually aligned near the top.

---

## Integration Contract

1. The Home header remains a subcomponent of the Home module.
2. The fix should stay local to the Home header unless a minimal surrounding layout adjustment is proven necessary.
3. Home category browsing, product loading states, and Home → Product Detail navigation must remain unchanged.

---

## Validation Contract

The feature is complete when all of the following are true:

1. `yarn lint` passes.
2. `yarn types` passes.
3. Manual verification confirms no notch overlap on supported notched devices.
4. Manual verification confirms no awkward extra gap on supported non-notched devices.
