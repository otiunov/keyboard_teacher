# keyboard_teacher

Single-page web app for teaching a young child to recognize keyboard symbols through spoken prompts, oversized keys, and immediate feedback.

## Current status

Implemented through Phase 2:

- Phase 1: first playable numbers lesson
- Phase 2: physical keyboard parity and cue-mode switching

Current lesson behavior:

- numbers lesson only
- English and Polish session language switching
- on-screen and physical keyboard input
- cue modes:
  - `Always`
  - `After mistake`
- spoken prompts and spoken feedback
- immediate visible feedback for correct and incorrect answers

Planned next:

- Phase 3: language-specific letter lessons
- Phase 4: guided word practice

## Stack

- React 19
- TypeScript
- Vite
- Vitest + Testing Library
- Playwright

## Local commands

```bash
npm install
npm run dev
npm run lint
npm run test
npm run test:e2e
npm run build
```

## Verification

Current automated coverage includes:

- lesson-model tests in [`src/lesson.test.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/lesson.test.ts)
- app-level interaction tests in [`src/App.test.tsx`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/App.test.tsx)
- browser E2E coverage in [`tests/e2e/phase1-numbers.spec.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/tests/e2e/phase1-numbers.spec.ts)

Verification scope details are documented in [`docs/phase1-verification-scope.md`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/docs/phase1-verification-scope.md).

## Project documents

- PRD: [`plans/keyboard-teacher-prd.md`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/plans/keyboard-teacher-prd.md)
- implementation plan: [`plans/keyboard-teacher-implementation-plan.md`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/plans/keyboard-teacher-implementation-plan.md)
- Phase 1 UI spec: [`plans/phase1-ui-spec.md`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/plans/phase1-ui-spec.md)

## Repository shape

- app UI: [`src/App.tsx`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/App.tsx)
- lesson model: [`src/lesson.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/lesson.ts)
- session options: [`src/session.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/session.ts)
- speech adapter: [`src/speech.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/speech.ts)
- browser tests: [`tests/e2e/phase1-numbers.spec.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/tests/e2e/phase1-numbers.spec.ts)
