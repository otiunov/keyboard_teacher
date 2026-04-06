# AGENTS

## Project summary

This repo contains a single-screen teaching app for early keyboard symbol recognition.

Current implemented scope:

- Phase 1 complete
- Phase 2 complete
- next target phase: Phase 3 letter lessons

The app should stay child-first:

- one persistent lesson screen
- minimal clutter
- parent controls inside the drawer
- lesson behavior driven by the model, not hard-coded UI branches

## Important files

- app shell and interaction wiring: [`src/App.tsx`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/App.tsx)
- lesson state and cue behavior: [`src/lesson.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/lesson.ts)
- session settings and option lists: [`src/session.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/session.ts)
- speech wrapper: [`src/speech.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/speech.ts)
- app tests: [`src/App.test.tsx`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/App.test.tsx)
- lesson tests: [`src/lesson.test.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/lesson.test.ts)
- browser E2E tests: [`tests/e2e/phase1-numbers.spec.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/tests/e2e/phase1-numbers.spec.ts)

## Working rules

- Prefer TDD for feature work: red, green, refactor.
- Keep one evaluation path for equivalent inputs.
  Example: physical keyboard and on-screen clicks should share the same lesson submission flow.
- Put lesson rules in [`src/lesson.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/src/lesson.ts) before adding UI conditionals.
- Keep the app as a single-route, single-screen experience unless the product direction changes explicitly.
- Preserve the approved child-first layout and drawer-based parent controls.

## Verification expectations

Before closing a feature, run:

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

If verification scope changes materially, update [`docs/phase1-verification-scope.md`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/docs/phase1-verification-scope.md).

## Current behavior assumptions

- lesson type: numbers only
- languages: English and Polish
- cue modes:
  - `always`
  - `after-mistake`
- physical number-key input is supported
- delayed-hint mode hides the cue until after a wrong answer

## Planned next work

- Phase 3: language-specific letter lessons
- Phase 4: guided word practice

Follow the implementation plan in [`plans/keyboard-teacher-implementation-plan.md`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/plans/keyboard-teacher-implementation-plan.md) unless a newer plan supersedes it.
