# Quickstart: Home Header Top Insets

**Feature**: `001-home-header-inset`  
**Date**: 2026-03-11

---

## Overview

This feature fixes the Home screen header so it no longer renders behind the notch or protected top device area.

- Scope: Home header layout only
- Safe-area rule: apply the top inset to the Home header section only
- Header content: unchanged
- Home browsing flow: unchanged
- Product-list and Product Detail behavior: unchanged
- Validation: lint, types, and manual device-shape verification

---

## Files to Touch

| Action          | File                                                              | What changes                                                                             |
| --------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| MODIFY          | `app/modules/home/sub-components/home-header/HomeHeader.tsx`      | Read the top safe-area height and apply it to the header section                         |
| MODIFY          | `app/modules/home/sub-components/home-header/HomeHeaderStyles.ts` | Add themed styles that combine base header spacing with the safe-area inset              |
| OPTIONAL MODIFY | `app/modules/home/HomeScreen.tsx`                                 | Only adjust surrounding layout if needed to preserve balance after the header-only inset |
| OPTIONAL MODIFY | `app/modules/home/HomeStyles.ts`                                  | Only adjust Home layout styles if needed after the header inset is applied               |
| REUSE           | `app/hooks/useHeader.ts`                                          | Use the existing safe-area helper rather than adding a new one                           |

---

## Implementation Order

### Step 1 — Inspect the current Home header layout

1. Confirm the header is rendered as the first section in `HomeScreen.tsx`.
2. Confirm the issue is local to the Home header rather than the whole screen container.

### Step 2 — Apply safe-area handling to the header only

1. Read the top inset through the existing shared safe-area hook.
2. Add the inset to the Home header section only.
3. Keep the category row and product list in their current vertical flow.

### Step 3 — Preserve visual balance

1. Ensure no excessive gap appears above the header on devices with small or no inset.
2. Confirm the Home header still feels visually balanced with the category row and product grid.

### Step 4 — Validate

1. Run `yarn lint`.
2. Run `yarn types`.
3. Verify the manual scenarios below on different device shapes when available.

---

## Verification

### Quality gates

```bash
yarn lint
yarn types
```

### Manual checks

1. Open Home on a device or simulator with a notch.
2. Confirm the Home header is fully visible and no longer hidden behind the top protected area.
3. Confirm only the Home header shifts downward for the safe area.
4. Confirm the category row and product list do not gain unnecessary extra top spacing.
5. Open Home on a device or simulator without a notch.
6. Confirm the header still looks correctly positioned with no awkward blank space above it.
7. Navigate away from Home and return.
8. Confirm the header placement remains consistent.
9. Confirm Home product browsing and Home → Product Detail navigation still behave normally.

---

## Constraints Reminder

- Apply the top safe-area inset to the Home header section only.
- Do not redesign the Home header content.
- Do not change Home browsing, filtering, or Product Detail navigation behavior.
- Do not introduce hardcoded top-spacing guesses.
- Reuse the existing safe-area helper patterns already present in the project.
