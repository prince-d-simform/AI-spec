# Tasks: Text Variant Component

**Input**: Design documents from `/specs/003-text-variant-component/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/TextProps.md ✅, quickstart.md ✅

**Tests**: No test tasks included — no TDD requirement found in spec.md or user input.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in every description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the 4-file component directory structure under `app/components/text/`

- [x] T001 Create four empty stub files for the component: `app/components/text/Text.tsx`, `app/components/text/TextStyles.ts`, `app/components/text/TextTypes.ts`, `app/components/text/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type and style foundations that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete (TextTypes.ts derives `TextVariant` from `textStyles` return type, creating a hard dependency chain)

- [x] T002 Implement `textStyles(theme)` skeleton in `app/components/text/TextStyles.ts` — spread `ApplicationStyles(theme)` first, add `body` variant entry (Sweetext-Light 16/300/22) as the sole starter entry, export the function
- [x] T003 Implement `TextTypes.ts` in `app/components/text/TextTypes.ts` — derive `TextVariant` as `keyof ReturnType<typeof textStyles>` (import from `./TextStyles`), define `TextProps` interface extending `Omit<RNTextProps, 'style'>` with `variant?`, `children?`, and `style?` fields per contracts/TextProps.md

**Checkpoint**: Foundation ready — `TextVariant` type and `textStyles` function exist; user story phases can now begin in priority order

---

## Phase 3: User Story 1 — Display Heading Text (Priority: P1) 🎯 MVP

**Goal**: Developers can render correctly styled heading text by passing a heading variant; no manual style definitions required at the call site.

**Independent Test**: Render `<Text variant="heading">Welcome</Text>` alongside `<Text>body</Text>` and confirm visually distinct larger/bolder output; also verify `<Text variant="headingBold32">Title</Text>` renders without errors.

### Implementation for User Story 1

- [x] T004 [P] [US1] Add all IBMPlexSans heading entries to `app/components/text/TextStyles.ts`: `headingBold14/16/20/24/32/40` (IBMPlexSans-Bold 700), `headingSemiBold14/16/24/32/40` (IBMPlexSans-SemiBold 600), `headingMedium14/16` (IBMPlexSans-Medium 500), `headingRegular14/16` (IBMPlexSans-Regular 400), and the `heading` semantic alias (→ IBMPlexSans-Bold 40/700/48) — all sizes via `scale()`, color via `Colors[theme]?.black`
- [x] T005 [US1] Implement the `Text` component in `app/components/text/Text.tsx` — destructure `variant`, `children`, `style`, spread `...rest`; cast `styles` to `Record<TextVariant, TextStyle>`; default variant to `'body'`; return `null` when `children` is `undefined`, `null`, or `''`; forward `...rest` to `<RNText>`; wrap with `React.memo`; set `Text.displayName = 'Text'`
- [x] T006 [US1] Create barrel export in `app/components/text/index.ts` — re-export `Text`, `TextProps`, and `TextVariant` from their respective files
- [x] T007 [US1] Update `app/components/index.ts` — add `export * from './text'` so the component is accessible via the shared component barrel

**Checkpoint**: `<Text variant="heading">` and explicit `headingBold*`/`headingSemiBold*`/`headingMedium*`/`headingRegular*` variants all render correctly; component is importable from `app/components`

---

## Phase 4: User Story 2 — Display Body and Supporting Text (Priority: P2)

**Goal**: Developers can render paragraph content, form labels, and supplementary descriptions using `body`, `label`, `caption`, and all Sweetext/paragraph variants.

**Independent Test**: Render `<Text variant="body">`, `<Text variant="label">`, and `<Text variant="caption">` side-by-side and confirm each produces a visually distinct style appropriate to its role; also verify `<Text>` (no variant) renders identically to `<Text variant="body">`.

### Implementation for User Story 2

- [x] T008 [P] [US2] Add all Sweetext body and paragraph variant entries to `app/components/text/TextStyles.ts`: `bodySemiBold12/14/16` (Sweetext-DemiBold 600), `bodyMedium12/14/16` (Sweetext-Medium 500), `bodyRegular12/14/16` (Sweetext-Light 300), `paragraphBodyMedium12/14` (Sweetext-DemiBold 600), `paragraphBodyRegular12/14` (Sweetext-Medium 500), and semantic aliases `caption` (→ Sweetext-Light 12/300/16), `label` (→ IBMPlexSans-Medium 14/500/18), `title` (→ IBMPlexSans-SemiBold 16/600/22) — all sizes via `scale()`, color via `Colors[theme]?.black`

**Checkpoint**: All 33 variants are now defined; `TextVariant` union auto-expands to include the new keys; `<Text variant="body">`, `<Text variant="label">`, `<Text variant="caption">` all render with the correct Sweetext type treatment

---

## Phase 5: User Story 3 — Theme-Aware Variant Styling (Priority: P3)

**Goal**: All Text variants automatically apply the correct text color for the active light/dark theme without any per-instance overrides; explicit `style` overrides take precedence over variant defaults.

**Independent Test**: Toggle the app theme between light and dark mode and confirm all variant text colors flip automatically (black ↔ white) without any code change at the call site; also confirm `<Text variant="label" style={{ color: 'red' }}>` renders in red regardless of theme.

### Implementation for User Story 3

- [x] T009 [US3] Wire `useTheme` into `app/components/text/Text.tsx` — call `useTheme(textStyles)` to obtain theme-resolved styles, ensuring `Colors[theme]?.black` drives color for every variant; implement style override merge by passing `[resolvedVariantStyle, style]` array to `<RNText style={...}>` so caller's `style` prop wins on conflicts (FR-007)
- [x] T010 [P] [US3] Add `Object.hasOwn` runtime guard in `app/components/text/Text.tsx` — if the provided variant key is not a key of the styles object, fall back to `'body'` and emit `console.warn('Text: unrecognized variant "…"')` only when `__DEV__` is `true` (FR-008); no warning in production builds

**Checkpoint**: Theme toggle updates all variant colors automatically; `style` prop overrides win; unrecognized variant produces graceful fallback with a dev warning and no crash

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, display name, and final quickstart validation across all three user stories

- [x] T011 [P] Add JSDoc comments to the `Text` component, `TextVariant` type, and `TextProps` interface in `app/components/text/Text.tsx` and `app/components/text/TextTypes.ts` — include `@param`, `@returns`, and `@example` entries per component guidelines
- [x] T012 [P] Confirm `Text.displayName = 'Text'` is set in `app/components/text/Text.tsx` so React DevTools shows a meaningful name (Constitution Principle VIII / research.md §7)
- [ ] T013 Run quickstart.md validation — manually render the basic usage example, all semantic aliases, native prop forwarding example, empty-content scenario, and theme-override example to confirm all scenarios behave as documented

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories** (`textStyles` export must exist before `TextTypes.ts` can derive `TextVariant`)
- **User Stories (Phases 3–5)**: All depend on Phase 2 completion
  - Stories proceed sequentially by priority (P1 → P2 → P3) since styles accumulate in the same file
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 — no dependency on US2 or US3
- **US2 (P2)**: Starts after Phase 2 — depends on T005 (Text.tsx) being complete so new variants render immediately
- **US3 (P3)**: Starts after Phase 2 — T009 modifies Text.tsx (depends on T005 from US1); T010 also modifies Text.tsx

### Within Each User Story

- Models (styles) before component logic
- Component logic (Text.tsx) before barrel exports
- Barrel export before consumer update (`app/components/index.ts`)
- Story complete before moving to next priority

### Parallel Opportunities

- T004 (add heading styles) can run in parallel with T003 if both developers coordinate on the same file — or sequentially to avoid merge conflicts
- T008 (add body/paragraph styles) and T010 (dev warn guard) are each isolated enough to run in parallel with non-overlapping tasks
- All polish tasks T011 and T012 are independent and can run in parallel

---

## Parallel Example: User Story 1

```
# These two tasks touch different files and can run simultaneously after T003:
Task T004: Add heading variant entries → app/components/text/TextStyles.ts
Task T005: (waits for T004) Implement Text.tsx

# After T005 completes, these run in parallel:
Task T006: Create index.ts barrel
Task T007: Update app/components/index.ts
```

## Parallel Example: User Story 3

```
# T009 and T010 both edit Text.tsx — run sequentially to avoid conflicts:
Task T009: Wire useTheme + style merge → app/components/text/Text.tsx
Task T010: Add Object.hasOwn guard + console.warn → app/components/text/Text.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002 → T003)
3. Complete Phase 3: User Story 1 (T004 → T005 → T006 → T007)
4. **STOP and VALIDATE**: Import `Text` from `app/components`, render heading variant, confirm visual output
5. Ship if heading use cases are sufficient for current sprint

### Incremental Delivery

1. Setup + Foundational → skeleton ready
2. US1 complete → headings work, component importable → **Demo-able MVP**
3. US2 complete → full Sweetext body/paragraph palette available
4. US3 complete → theme-awareness + style overrides + dev guard fully operational
5. Polish → documentation and DevTools polish

### Sequential Strategy (Single Developer)

```
T001 → T002 → T003 → T004 → T005 → T006 → T007   (US1 done, MVP delivered)
                           → T008                   (US2 done)
                           → T009 → T010            (US3 done)
                           → T011 → T012 → T013     (Polish done)
```

---

## Notes

- [P] tasks operate on different files or have no incomplete-task dependencies
- [Story] labels map each task to its user story for traceability
- All sizes MUST use `scale()` from Metrics — no raw pixel values
- All color references MUST use `Colors[theme]?.black` — no hardcoded hex
- `ApplicationStyles(theme)` spread MUST appear first in `StyleSheet.create` (Constitution Principle II)
- `TextVariant` union is auto-derived — adding/removing a key in `textStyles` is automatically reflected in the type
- Each user story phase is independently completable and testable
- Commit after each phase checkpoint to preserve incremental delivery capability
