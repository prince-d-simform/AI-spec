# Tasks: Home Header Top Insets

**Input**: Design documents from `/specs/001-home-header-inset/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/HomeHeaderInsetContract.md, quickstart.md

**Tests**: No dedicated automated test tasks included. The feature docs request lint, type, and manual device-shape verification rather than a TDD-first workflow.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel when tasks touch different files and do not depend on unfinished work
- **[Story]**: User story label for story-phase tasks only (`[US1]`, `[US2]`, `[US3]`)
- Every task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the local Home-header layout surface for a safe-area-only correction

- [x] T001 Confirm the Home header continues to use the existing safe-area helper in app/hooks/useHeader.ts and app/hooks/index.ts
- [x] T002 [P] Review and align the Home header subcomponent contract in app/modules/home/sub-components/home-header/HomeHeaderTypes.ts and app/modules/home/sub-components/home-header/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the reusable layout inputs and styling approach before story-specific screen behavior is adjusted

**⚠️ CRITICAL**: No user story work should begin until this phase is complete

- [x] T003 Add typed top-inset-driven header layout handling in app/modules/home/sub-components/home-header/HomeHeader.tsx
- [x] T004 Add theme-based, scaled header spacing rules that combine base padding with the safe-area inset in app/modules/home/sub-components/home-header/HomeHeaderStyles.ts

**Checkpoint**: The Home header can now receive a safe-area top inset without changing Home content behavior

---

## Phase 3: User Story 1 - See Header Clearly on Notched Devices (Priority: P1) 🎯 MVP

**Goal**: Make the Home header fully visible below the notch or protected top area on first render

**Independent Test**: Open Home on a notched device or simulator and confirm the title/subtitle are fully visible below the protected top area

### Implementation for User Story 1

- [x] T005 [US1] Apply the safe-area top inset to the Home header section only in app/modules/home/sub-components/home-header/HomeHeader.tsx and app/modules/home/sub-components/home-header/HomeHeaderStyles.ts
- [x] T006 [US1] Verify the Home screen still renders the header as the first visual section without moving the full screen container in app/modules/home/HomeScreen.tsx

**Checkpoint**: User Story 1 should now resolve the notch overlap for the Home header

---

## Phase 4: User Story 2 - Keep Home Content Comfortable to Browse (Priority: P2)

**Goal**: Preserve a balanced Home layout after the header-only inset is applied

**Independent Test**: Open Home after the fix and confirm the header, category row, and product list remain visually balanced with no awkward gap above the browsing content

### Implementation for User Story 2

- [x] T007 [US2] Adjust surrounding Home layout only if needed to preserve header-to-category spacing in app/modules/home/HomeScreen.tsx and app/modules/home/HomeStyles.ts
- [x] T008 [P] [US2] Keep the category row and product grid positioning unchanged by notch-driven inset handling in app/modules/home/HomeStyles.ts and app/modules/home/sub-components/home-header/HomeHeaderStyles.ts

**Checkpoint**: User Story 2 should now keep the corrected header visually balanced with the rest of Home

---

## Phase 5: User Story 3 - Support Different Device Shapes Reliably (Priority: P3)

**Goal**: Ensure the Home header inset behavior remains consistent across supported device top-area shapes and when returning to Home

**Independent Test**: Review Home on multiple device shapes and after returning from another screen, and confirm the header placement remains consistent with no clipping or excessive top gap

### Implementation for User Story 3

- [x] T009 [US3] Ensure the Home header safe-area calculation remains stable on repeated renders and return-to-Home scenarios in app/modules/home/sub-components/home-header/HomeHeader.tsx
- [x] T010 [P] [US3] Harden the Home header style behavior for zero-inset and large-inset devices in app/modules/home/sub-components/home-header/HomeHeaderStyles.ts

**Checkpoint**: User Story 3 should now keep the Home header placement reliable across device shapes and revisit flows

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation alignment and validation for the Home header inset fix

- [x] T011 [P] Align feature documentation with the final implementation in specs/001-home-header-inset/quickstart.md, specs/001-home-header-inset/data-model.md, and specs/001-home-header-inset/contracts/HomeHeaderInsetContract.md
- [x] T012 Run lint/type cleanup across app/hooks/index.ts, app/hooks/useHeader.ts, app/modules/home/HomeScreen.tsx, app/modules/home/HomeStyles.ts, app/modules/home/sub-components/home-header/HomeHeader.tsx, app/modules/home/sub-components/home-header/HomeHeaderStyles.ts, app/modules/home/sub-components/home-header/HomeHeaderTypes.ts, and app/modules/home/sub-components/home-header/index.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** — No dependencies; can start immediately
- **Phase 2: Foundational** — Depends on Phase 1 and blocks all user stories
- **Phase 3: User Story 1** — Depends on Phase 2 and delivers the MVP fix
- **Phase 4: User Story 2** — Depends on Phase 2 and is safest after US1 applies the inset
- **Phase 5: User Story 3** — Depends on Phase 2 and is safest after US1 establishes the corrected header placement
- **Phase 6: Polish** — Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion and does not depend on other user stories
- **User Story 2 (P2)**: Starts after Foundational completion, but is safest after US1 confirms the header-only inset behavior
- **User Story 3 (P3)**: Starts after Foundational completion, but is safest after US1 establishes the corrected placement and US2 confirms layout balance

### Within Each User Story

- Header contract before style adjustment
- Header-only inset before surrounding Home-layout balancing
- Device-shape hardening after the main inset behavior is in place
- Documentation alignment and validation after implementation is complete

### Suggested Story Completion Order

1. **US1** → fix the Home header notch overlap
2. **US2** → preserve balanced Home browsing layout
3. **US3** → harden behavior across device shapes and return flows

---

## Parallel Opportunities

- **Setup**: `T002` can run alongside `T001`
- **US2**: `T008` can run in parallel with the optional surrounding-layout adjustment in `T007`
- **US3**: `T010` can run in parallel with `T009` after the main inset behavior is stable
- **Polish**: `T011` can run before `T012`

---

## Parallel Example: User Story 3

```text
After the core header-only inset is stable:
- T009 [US3] Ensure the Home header safe-area calculation remains stable on repeated renders and return-to-Home scenarios in app/modules/home/sub-components/home-header/HomeHeader.tsx
- T010 [US3] Harden the Home header style behavior for zero-inset and large-inset devices in app/modules/home/sub-components/home-header/HomeHeaderStyles.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate Home header visibility on a notched device or simulator
5. Demo or review the minimal fix before adjusting surrounding layout polish

### Incremental Delivery

1. Deliver **US1** for the notch-overlap fix
2. Add **US2** for balanced Home layout after the inset correction
3. Add **US3** for broader device-shape and revisit reliability
4. Finish with Phase 6 cleanup and validation

### Parallel Team Strategy

With multiple developers:

1. One developer completes Phase 1 and Phase 2 safe-area groundwork
2. After the header-only inset behavior is in place:
   - Developer A: Surrounding Home layout balance in app/modules/home/HomeScreen.tsx and app/modules/home/HomeStyles.ts
   - Developer B: Header device-shape hardening in app/modules/home/sub-components/home-header/
3. Complete documentation alignment and validation as the final shared step

---

## Notes

- `[P]` tasks target different files with low coordination needs
- No dedicated automated test tasks were generated because the spec did not explicitly request them
- Each user story remains independently verifiable through the manual scenarios captured in quickstart.md
- Prefer small commits per task or per checkpoint
- Validate lint/types after each logical group of implementation tasks
