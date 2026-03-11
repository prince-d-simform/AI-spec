# Research: Home Header Top Insets

**Phase 0 — All technical choices resolved**  
**Date**: 2026-03-11

---

## Decision 1: Apply the top safe-area inset only inside `HomeHeader`

**Decision**: Add the top inset to the Home header section itself instead of wrapping the full Home screen or shifting the entire Home content stack.

**Rationale**: The clarified requirement explicitly chose header-only inset handling. This keeps the category row and product grid from being pushed farther down while still moving the hidden header content below the notch.

**Alternatives considered**:

- Apply the inset to the entire `HomeScreen` container — rejected because it would add unnecessary top spacing to the category row and product list.
- Apply the inset to both header and category row — rejected because the clarification specified the header section only.
- Add a fixed top margin without safe-area awareness — rejected because the spacing would be unreliable across different device shapes.

---

## Decision 2: Reuse the existing `useStatusBarHeight()` safe-area hook

**Decision**: Use the existing `useStatusBarHeight()` hook from `app/hooks/useHeader.ts` as the source of the top safe-area value for the Home header.

**Rationale**: The repo already exposes a typed safe-area helper backed by `react-native-safe-area-context`. Reusing that hook keeps the implementation aligned with the existing shared utility layer and avoids duplicating safe-area reads inside the Home module.

**Alternatives considered**:

- Call `useSafeAreaInsets()` directly inside the Home header — rejected because the project already has a shared abstraction for top safe-area height.
- Hardcode platform-specific notch spacing — rejected because the constitution forbids raw layout guesses and the result would be device-fragile.
- Use the full shared `CustomHeader` for Home — rejected because the Home header is already a lightweight branded section and only needs safe-area spacing correction.

---

## Decision 3: Keep the fix local to the Home header subcomponent and styles

**Decision**: Implement the correction in `app/modules/home/sub-components/home-header/` and only make minimal Home-screen changes if required for layout stability.

**Rationale**: The issue is specific to the Home header’s placement. Localizing the fix reduces regression risk and preserves the rest of the Home browsing layout, which the spec says must remain unchanged.

**Alternatives considered**:

- Refactor the full Home screen layout hierarchy — rejected because the problem does not require a larger structural rewrite.
- Add a global safe-area wrapper to all screens — rejected because the reported issue is specific to the Home header.
- Move header spacing into shared application styles — rejected because the requirement is feature-specific, not a universal screen rule.

---

## Decision 4: Preserve existing Home content and navigation behavior with no new state or strings

**Decision**: Treat this feature as a layout-only correction with no new Redux state, navigation changes, or user-facing copy.

**Rationale**: The specification is about safe-area placement only. The Home screen’s category filtering, product-list behavior, and Home → Product Detail flow should remain untouched.

**Alternatives considered**:

- Add new strings for error or safe-area messaging — rejected because the fix is not user-facing copy work.
- Introduce new route params or configuration state — rejected because there is no new interaction model.
- Add a user setting for header spacing — rejected because the spec calls for automatic safe-area handling.

---

## Decision 5: Validate primarily through manual device-shape verification plus lint/type gates

**Decision**: Use `yarn lint`, `yarn types`, and manual Home-screen verification on devices or simulators with different top insets.

**Rationale**: The issue is visual and hardware-shape dependent. Manual verification is the most direct way to confirm the header is no longer clipped while keeping the layout balanced.

**Alternatives considered**:

- Add automated snapshot coverage only — rejected because snapshots do not reliably capture notch overlap behavior across devices.
- Rely on static code review alone — rejected because the bug is a runtime visual placement issue.
- Add E2E tests for this one layout change — rejected for the initial fix because the feature scope is small and the spec did not request test automation.
