# Phase 1 Verification Scope

This document records the automated verification boundary for the first playable numbers lesson.

## Covered behavior

The current test suite verifies the Phase 1 lesson through the public browser-facing and lesson-model interfaces.

- `src/lesson.test.ts`
  - random target selection from the `0-9` lesson pool
  - target persistence after a wrong answer
  - correct-answer readiness and next-target progression
  - highlighted-key cue staying on the active target while a wrong key is marked incorrect
  - target key carrying both the teaching cue and the success state after a correct answer
- `src/App.test.tsx`
  - initial lesson shell rendering
  - single active highlighted target in the keyboard field
  - spoken prompt on lesson start
  - spoken praise after a correct answer
  - spoken retry feedback after a wrong answer
  - visible last-key and status-text updates
  - parent drawer language switching
  - parent drawer structure and Phase 1 hint-mode placeholder
  - lesson-state persistence while the parent drawer opens and closes
  - language switching changing prompt speech without resetting the current round
  - delayed progression to the next prompt after a correct answer
  - spoken next-target prompt after a successful advance
- `tests/smoke.test.ts`
  - basic jsdom harness sanity check

## Why this is sufficient for Phase 2

Phase 2 extends the same app shape rather than replacing it, so the existing verification boundary is intentionally organized around reusable seams:

- `src/lesson.ts` is the place where prompt selection, cue behavior, and answer evaluation can grow to support delayed hints and physical keyboard parity.
- `src/App.test.tsx` already verifies the user-visible loop for prompt, answer, feedback, drawer interaction, and language switching.
- The current tests avoid implementation-specific assertions about component internals, which keeps them reusable when cue modes or input sources are added.

## Expected additions in Phase 2

When cue-mode switching and physical keyboard input land, extend the suite with:

- immediate-highlight versus after-mistake cue behavior
- physical keyboard events matching on-screen key behavior
- repeated wrong-answer behavior before and after cue reveal
- accessibility checks for focus return after drawer changes and keyboard-only play
