# Data Model: Home Header Top Insets

**Date**: 2026-03-11  
**Source**: [spec.md](./spec.md) + [research.md](./research.md)

---

## Entities

### HomeHeaderSafeArea

Derived layout value representing the protected top area that the Home header must respect.

```typescript
interface HomeHeaderSafeArea {
  topInset: number;
}
```

**Validation rules**:

- `topInset` must be derived from the current device safe area, not hardcoded.
- `topInset` may be `0` on devices with little or no protected top area.
- `topInset` must remain non-negative.

---

### HomeHeaderLayout

Screen-level layout contract for the visible Home header block.

```typescript
interface HomeHeaderLayout {
  basePaddingTop: number;
  effectivePaddingTop: number;
  titleVisible: boolean;
  subtitleVisible: boolean;
}
```

**Validation rules**:

- `effectivePaddingTop` must include the header’s base top spacing plus the safe-area top inset.
- `effectivePaddingTop` must affect the Home header section only.
- `titleVisible` and `subtitleVisible` must remain true on first render in supported scenarios.

---

### HomeLayoutFlow

Relationship between the Home header, category row, and product list after safe-area handling.

```typescript
interface HomeLayoutFlow {
  headerAdjustedForInset: boolean;
  categoryRowShiftedByInset: boolean;
  productListShiftedByInset: boolean;
}
```

**Validation rules**:

- `headerAdjustedForInset` must be true after the fix.
- `categoryRowShiftedByInset` must remain false for the clarification-selected behavior.
- `productListShiftedByInset` must remain false for the clarification-selected behavior.

---

### HomeHeaderPlacementState

Observable rendering outcome for the Home header on a given device shape.

```typescript
interface HomeHeaderPlacementState {
  isClippedByTopArea: boolean;
  hasExcessTopGap: boolean;
  isConsistentOnReturnToHome: boolean;
}
```

**Validation rules**:

- `isClippedByTopArea` must be false after the fix.
- `hasExcessTopGap` should remain false on small-inset and no-inset devices.
- `isConsistentOnReturnToHome` must remain true after navigating away from and back to Home.

---

## Relationships

- `HomeHeaderSafeArea.topInset` contributes to `HomeHeaderLayout.effectivePaddingTop`.
- `HomeHeaderLayout` affects only the header section inside the Home screen.
- `HomeLayoutFlow` confirms the selected clarification behavior: header-only inset handling.
- `HomeHeaderPlacementState` is the runtime result verified through manual testing on different device shapes.
