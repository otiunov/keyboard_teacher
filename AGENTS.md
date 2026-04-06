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

## GitHub issue workflow

Before starting a new phase or large feature, create GitHub issues first.

- Create one parent tracker issue for the phase.
- Create dependency-ordered child issues for implementation slices.
- Reference the parent PRD issue `#1` and the phase tracker in each child issue.

Use the established labels and milestone pattern:

- parent PRD issues: `prd`
- implementation issues: `enhancement`, `afk`, and the phase label
- phase labels currently in use:
  - `phase:1`
  - `phase:2`
- create a dedicated milestone for each phase and assign the child issues to it
- the parent phase tracker can carry only the phase label without the milestone

Keep issues vertically sliced:

- one issue should produce one meaningful, independently shippable behavior change
- verification-only work can be its own issue at the end of the phase

## Development workflow

Default development mode in this repo:

1. start from the next GitHub issue in dependency order
2. use TDD:
   - add or update the smallest failing test
   - implement the minimal change
   - refactor only after green
3. use subagents for bounded parallel help:
   - explorer subagents for codebase questions or risk checks
   - do not delegate the main critical-path implementation blindly
4. run full verification before closing the issue
5. make one commit per completed issue and push it
6. after the push succeeds, update the related GitHub issue status/comments so GitHub reflects the delivered state

Commit style used in this repo:

- one commit per finished task or issue slice
- commit message should describe the delivered behavior, not the internal refactor

After pushing:

- update the corresponding GitHub issue
- note the shipped commit id
- note the verification commands that were run
- keep issue status in sync with what is actually on `main`

## Testing expectations

Use both app-level and browser-level verification.

- Vitest is the default red-green loop for model and app behavior
- Playwright is required for end-to-end validation of shipped lesson flows
- when a feature changes user-visible interaction, update or add Playwright coverage in [`tests/e2e/phase1-numbers.spec.ts`](/Users/alext/Projects/CLAUDE_PROJECTS/keyboard_teacher/tests/e2e/phase1-numbers.spec.ts) or the relevant future E2E spec
- keep Vitest scoped to repo tests only; do not let dependency tests under `node_modules` leak into the suite

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
