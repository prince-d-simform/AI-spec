# Feature Specification: Text Variant Component

**Feature Branch**: `003-text-variant-component`  
**Created**: 2026-03-03  
**Status**: Draft  
**Input**: User description: "create a custom component for Text, which is variant based component, it will take a variant as a props and pick the styling based on the variant from the stylesheet."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Display Heading Text (Priority: P1)

A developer needs to display a prominent heading on a screen. They use the Text component with a heading variant, which automatically applies the correct font size, weight, and color without any manual style definitions.

**Why this priority**: Headings are the most common variant needed across screens and represent the core value of the component — eliminating repetitive style definitions everywhere a title appears.

**Independent Test**: Can be fully tested by rendering the component with a `heading` variant and verifying that the displayed text is visually distinct (larger, bolder) from body text without any extra style props.

**Acceptance Scenarios**:

1. **Given** a screen requires a page title, **When** the Text component is used with the `heading` variant, **Then** the text appears with heading-appropriate size, weight, and color.
2. **Given** the app is in dark mode, **When** a heading variant Text is rendered, **Then** the text color automatically adjusts to the dark mode palette.
3. **Given** no variant is specified, **When** the Text component is rendered, **Then** it falls back to a default body style without errors.

---

### User Story 2 - Display Body and Supporting Text (Priority: P2)

A developer needs to display paragraph content, form labels, and supplementary descriptions. They select the appropriate variant (`body`, `label`, `caption`) to convey visual hierarchy without writing custom styles per screen.

**Why this priority**: Body and supporting text variants cover the majority of in-app text use cases and enforce typographic consistency across all screens.

**Independent Test**: Can be fully tested by rendering the component with `body`, `label`, and `caption` variants and confirming each produces a visually distinct style appropriate to its role.

**Acceptance Scenarios**:

1. **Given** a screen displays a description paragraph, **When** the Text component is used with the `body` variant, **Then** the text renders at a comfortable reading size with normal weight.
2. **Given** a form field needs an input label, **When** the Text component uses the `label` variant, **Then** the text appears in a smaller, slightly emphasized style.
3. **Given** a card needs supplementary information, **When** the Text component uses the `caption` variant, **Then** the text renders in a smaller, muted style.

---

### User Story 3 - Theme-Aware Variant Styling (Priority: P3)

A developer switches the app between light and dark themes. All Text component variants automatically reflect the correct text colors for the active theme without any per-instance overrides.

**Why this priority**: Theme awareness ensures the component is self-contained and eliminates manual color maintenance when the app theme changes.

**Independent Test**: Can be fully tested by toggling the app theme and verifying that all variant text colors update automatically, with no code changes required at the call site.

**Acceptance Scenarios**:

1. **Given** the app theme is light, **When** any Text variant is rendered, **Then** text colors match the light theme palette.
2. **Given** the app theme switches to dark, **When** any Text variant is rendered, **Then** text colors update to match the dark theme palette.
3. **Given** a custom color override is passed alongside a variant, **When** the Text component renders, **Then** the override takes precedence over the variant default color.

---

### Edge Cases

- When an unrecognized or misspelled variant is provided the component renders using the `body` style and emits a `console.warn` in development builds only.
- Long strings wrap or truncate according to whatever `numberOfLines` and `ellipsizeMode` values the caller passes via forwarded props; the component imposes no default overflow behavior.
- When text content is empty or undefined the component renders nothing — no visible output and no layout space is reserved.
- When both a variant and explicit style overrides are supplied simultaneously, the override styles are merged on top of the variant styles; in the event of a conflict the override wins (per FR-007).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The component MUST accept a `variant` property that determines its visual styling.
- **FR-002**: The component MUST define a fixed set of named variants (e.g., `heading`, `title`, `body`, `label`, `caption`) each with distinct typographic properties (size, weight, line height).
- **FR-003**: The component MUST apply the `body` variant style as the default when no variant is explicitly provided.
- **FR-004**: Each variant styling MUST be sourced from a centralized stylesheet so that all instances remain visually consistent.
- **FR-005**: The component MUST apply theme-aware text colors based on the currently active app theme (light/dark).
- **FR-006**: The component MUST accept and forward all remaining native text props (e.g., `numberOfLines`, `allowFontScaling`, `onPress`, `accessibilityLabel`) to the underlying text element unchanged, so callers retain full control over native behavior.
- **FR-007**: The component MUST allow optional style overrides that augment or replace the variant default styles without breaking the component.
- **FR-008**: The component MUST fall back gracefully to the `body` variant style when an unrecognized variant is supplied, rather than crashing or rendering nothing. In development builds the component MUST emit a `console.warn` identifying the unrecognized variant; no warning is emitted in production builds.
- **FR-009**: The component MUST be reusable across all screens and modules without requiring per-screen customization.
- **FR-010**: The component MUST render nothing (no visible output, no layout space) when the text content is empty, an empty string, or undefined.
- **FR-011**: The component MUST NOT impose any default value for text overflow, line clamping, or font scaling; all such behaviors are exclusively controlled by the caller through forwarded native text props.

### Key Entities

- **Variant**: A named identifier (e.g., `heading`, `body`, `caption`) that maps to a predefined set of visual text properties including size, weight, and line height.
- **Stylesheet Entry**: The style definition associated with each variant, stored centrally and consumed by the component at render time.
- **Theme Context**: The active visual theme (light or dark) that determines the color value applied to each variant.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Developers can render correctly styled text by specifying only the `variant` prop with no additional style props required for standard use cases.
- **SC-002**: All defined variants produce visually distinct text appearances, verifiable side-by-side on a single screen.
- **SC-003**: The component renders without errors or visual regressions when the app theme is toggled between light and dark mode.
- **SC-004**: Providing an unrecognized variant results in graceful fallback to the default style with no crashes, confirmed by test coverage.
- **SC-005**: All screens that use raw text elements can adopt the new component with no increase in per-instance style code.

## Clarifications

### Session 2026-03-03

- Q: Which variant should be the default when none is specified (FR-003) and the fallback for unknown variants (FR-008)? → A: `body`
- Q: Should the component warn developers when an unrecognized variant is passed? → A: Emit a development-only warning (`console.warn`); silent in production
- Q: What should the component render when text content is empty or undefined? → A: Render nothing (no visible output, no layout space)
- Q: How should system font-size scaling and other native text props be handled? → A: The component destructures and forwards all remaining props (e.g., `allowFontScaling`, `numberOfLines`, `onPress`) to the underlying text element, giving callers full control
- Q: What is the default overflow/wrapping behavior for long strings? → A: No default enforced; caller controls entirely via forwarded props (e.g., `numberOfLines`, `ellipsizeMode`)

## Assumptions

- The application already supports a light/dark theme context accessible to all components.
- Variants will cover at minimum: `heading`, `title`, `body`, `label`, `caption`. Additional variants may be added in future iterations.
- Style overrides passed directly to the component are additive (merged on top of variant styles) unless they explicitly conflict, in which case the override wins.
- The component does not enforce any default value for system font-size scaling; callers control this via the `allowFontScaling` prop forwarded through the rest-props mechanism.
