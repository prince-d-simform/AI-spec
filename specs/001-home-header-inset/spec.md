# Feature Specification: Home Header Top Insets

**Feature Branch**: `001-home-header-inset`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "manage the Top insets for the home screen's header because it is behind the notch."

## Clarifications

### Session 2026-03-11

- Q: Which part of the Home layout should receive the top safe-area inset? → A: Apply the safe-area top inset only to the Home header section.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - See Header Clearly on Notched Devices (Priority: P1)

As a shopper, I want the Home screen header to appear below the device notch and status area so I can see and use the header content immediately.

**Why this priority**: If the header is hidden behind the notch, key Home content feels broken on first load and the primary browsing experience is degraded.

**Independent Test**: Open the Home screen on a device with a notch or dynamic top safe area and verify that the full header is visible and not clipped by the system area.

**Acceptance Scenarios**:

1. **Given** the shopper opens Home on a device with a top notch or cutout, **When** the screen renders, **Then** the header content is fully visible below the protected top area.
2. **Given** the shopper opens Home on a device without a notch, **When** the screen renders, **Then** the header still appears correctly positioned without excessive empty space above it.
3. **Given** the shopper opens Home on any supported device, **When** the top inset is applied, **Then** only the header section shifts for the safe area and the category row plus product list do not gain unnecessary extra top spacing.

---

### User Story 2 - Keep Home Content Comfortable to Browse (Priority: P2)

As a shopper, I want the corrected header spacing to keep the product-browsing layout balanced so the screen feels intentional rather than pushed too far down.

**Why this priority**: Fixing the notch overlap should not create a new layout problem by wasting visible space or disrupting the browsing flow.

**Independent Test**: Open Home after the inset adjustment and confirm the header, category row, and product list remain visually balanced and usable together.

**Acceptance Scenarios**:

1. **Given** the shopper views the Home screen after the top inset is applied, **When** they scan the page, **Then** the header spacing feels intentional and the category row and product list remain accessible without awkward gaps.
2. **Given** the shopper scrolls the Home screen content, **When** the header area has been inset correctly, **Then** the rest of the Home layout remains stable and readable.

---

### User Story 3 - Support Different Device Shapes Reliably (Priority: P3)

As a shopper, I want the Home header to adapt to different device top areas so the app looks correct across supported phones.

**Why this priority**: The issue is most visible on notched devices, but the fix must remain reliable across the broader device range instead of solving only one specific screen shape.

**Independent Test**: Review the Home screen on multiple supported device shapes and confirm the header remains visible and properly aligned near the top on each one.

**Acceptance Scenarios**:

1. **Given** the shopper uses different supported phone models, **When** Home is opened, **Then** the header respects the visible top safe area on each device.
2. **Given** the shopper reopens Home after app relaunch or navigation back to Home, **When** the screen appears, **Then** the header placement remains consistent.

### Edge Cases

- What happens on devices with a large top inset, such as a deep notch or dynamic status area?
- What happens on devices with little or no top inset so the header does not gain unnecessary blank space?
- What happens when the shopper returns to Home from another screen and the header must reappear in the correct position?
- What happens when the visible top safe area changes because of system UI differences across supported devices?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST position the Home screen header below the protected top device area so header content is not hidden behind the notch or status area.
- **FR-002**: The system MUST keep the full Home header visible on first render.
- **FR-003**: The system MUST preserve the Home header’s usability after the top inset is applied.
- **FR-004**: The system MUST avoid introducing unnecessary blank space above the Home header on devices with small or no top inset.
- **FR-005**: The system MUST keep the category row and product-list browsing experience usable after the header position is corrected.
- **FR-006**: The system MUST apply the top safe-area inset to the Home header section only, not to the full Home screen content.
- **FR-007**: The system MUST apply the header placement consistently whenever the shopper returns to Home.
- **FR-008**: The system MUST support the existing range of supported mobile device top-area shapes without clipping the Home header.
- **FR-009**: The system MUST preserve the current Home content and navigation behavior while correcting the header’s top placement.

### Key Entities _(include if feature involves data)_

- **Home Header Area**: The top visual section of the Home screen that contains the header content shown before the main browsing content.
- **Top Safe Area**: The protected top display area reserved for device hardware cutouts and system UI that the Home header must respect.
- **Home Layout Flow**: The vertical arrangement of header, category row, and product list that must remain balanced after the inset correction.

## Assumptions

- The scope is limited to the Home screen header placement issue and does not include redesigning the Home header content.
- The current Home browsing flow, product listing behavior, and product-detail navigation should remain unchanged.
- The correct experience is for the Home header to visually align below the usable top area rather than overlap it.
- The fix should work across supported phones without requiring separate user settings.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In manual verification on supported notched devices, 100% of the Home header content is visible on first render.
- **SC-002**: In manual verification across supported phone shapes, the Home header shows no notch overlap in 100% of tested cases.
- **SC-003**: In acceptance review, the Home layout remains visually balanced after the inset correction on at least 90% of tested devices.
- **SC-004**: In regression verification, shoppers can still access Home browsing content and return to Product Detail flows with no header-placement breakage.
