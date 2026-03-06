# Implementation Plan: Text Variant Component

**Branch**: `003-text-variant-component` | **Date**: 2026-03-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-text-variant-component/spec.md`

## Summary

A reusable, variant-based `Text` component for React Native that maps named
typography variants to centralized StyleSheet entries derived from the PRZM Figma
design system. The component is theme-aware (light/dark), forwards all native
`TextProps`, enforces a `body` default, and renders `null` for empty content.
All 33 variants (28 Figma tokens + 5 semantic aliases) are implemented.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.8 — strict mode; React Native 0.81.4 + Expo SDK 54  
**Primary Dependencies**: `react-native` (Text, StyleSheet), `useTheme` hook, `scale()` from Metrics, `Colors`/`ApplicationStyles` from theme barrel  
**Storage**: N/A — pure UI component, no persistence  
**Testing**: Jest (`yarn test`); component-level render tests  
**Target Platform**: iOS 15+ and Android (React Native universal)  
**Project Type**: Reusable UI component (`app/components/text/`)  
**Performance Goals**: 60 fps rendering; wrapped in `React.memo` to prevent unnecessary re-renders  
**Constraints**: No hardcoded hex values; all dimensions via `scale()`; `ApplicationStyles(theme)` spread first; 4-file architecture mandatory  
**Scale/Scope**: App-wide; consumed by every screen and feature module

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | 4-file architecture under `app/components/` | ✅ PASS | `Text.tsx`, `TextStyles.ts`, `TextTypes.ts`, `index.ts` created |
| II | Theme-First Styling — `ApplicationStyles` spread first, `Colors[theme]`, `scale()` | ✅ PASS | `...ApplicationStyles(theme)` spread at top of `StyleSheet.create`; colors via `Colors[theme]?.black`; sizes via `scale()` |
| III | Reusable-component with JSDoc, `displayName`, full types, 4-file arch | ✅ PASS | JSDoc on component and all exports; `Text.displayName = 'Text'`; full `TextProps` interface |
| IV | Strict TypeScript — no `any`, no `@ts-ignore` | ✅ PASS | Cast via `Record<TextVariant, TextStyle>` instead of `any`; all types explicit |
| V | Centralised strings | ✅ N/A | Component renders `children` prop; no inline string literals |
| VI | Redux | ✅ N/A | Pure UI component; no state management needed |
| VII | Navigation | ✅ N/A | No routing logic |
| VIII | React.memo / useCallback / useMemo | ✅ PASS | Wrapped with `memo(TextComponent)` |
| IX | Asset management | ✅ N/A | No assets used |
| X | No inline static data | ✅ PASS | All variant definitions in `TextStyles.ts`; `DEFAULT_VARIANT` is a module-level const |

**POST-DESIGN RE-CHECK**: All 10 gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-text-variant-component/
├── plan.md              ✅ This file
├── research.md          ✅ Phase 0 output
├── data-model.md        ✅ Phase 1 output
├── quickstart.md        ✅ Phase 1 output
├── contracts/
│   └── TextProps.md     ✅ Phase 1 UI contract
└── tasks.md             ⏳ Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
app/components/text/             # NEW — shared reusable component
├── Text.tsx                     # Component logic + React.memo wrapper
├── TextStyles.ts                # 33-variant StyleSheet (PRZM Figma tokens)
├── TextTypes.ts                 # TextVariant union + TextProps interface
└── index.ts                     # Barrel export

app/components/index.ts          # UPDATED — added `export * from './text'`
```

**Structure Decision**: Single-project Option 1 variant — feature is an isolated
shared component; no screen module or backend changes required.

## Complexity Tracking

> No constitutional violations found. No justification needed.
