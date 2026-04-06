# Phase 1 And Phase 2 Verification Scope

This document records the automated verification boundary for the numbers lesson through the current Phase 2 scope.

## Covered behavior

The current test suite verifies the numbers lesson through the public browser-facing and lesson-model interfaces.

- `src/lesson.test.ts`
  - random target selection from the `0-9` lesson pool
  - target persistence after a wrong answer
  - correct-answer readiness and next-target progression
  - highlighted-key cue staying on the active target while a wrong key is marked incorrect
  - target key carrying both the teaching cue and the success state after a correct answer
  - hidden cue behavior before the first attempt in `after-mistake` mode
  - delayed cue reveal after an incorrect answer
  - cue reset on the next prompt in `after-mistake` mode
- `src/session.test.ts`
  - parent-visible language choices
  - parent-visible cue-mode choices
- `src/App.test.tsx`
  - initial lesson shell rendering
  - single active highlighted target in the keyboard field
  - spoken prompt on lesson start
  - spoken praise after a correct answer
  - spoken retry feedback after a wrong answer
  - visible last-key and status-text updates
  - parent drawer language switching
  - parent drawer cue-mode controls
  - lesson-state persistence while the parent drawer opens and closes
  - language switching changing prompt speech without resetting the current round
  - delayed progression to the next prompt after a correct answer
  - spoken next-target prompt after a successful advance
  - physical keyboard parity with on-screen input
  - ignored non-digit and repeated physical keyboard events
  - ignored lesson input while the parent drawer is open
  - hidden cue before the first attempt in `after-mistake` mode
  - cue reveal after a wrong answer in `after-mistake` mode
  - cue reset when the next prompt begins in `after-mistake` mode
- `tests/e2e/phase1-numbers.spec.ts`
  - initial browser render with one highlighted target
  - wrong-answer retry flow in a real browser
  - correct-answer progression and next-prompt speech in a real browser
  - language switching without lesson reset in a real browser
  - physical keyboard parity in a real browser
  - delayed-hint cue reveal in a real browser
- `tests/smoke.test.ts`
  - basic jsdom harness sanity check

## Why this is sufficient for later phases

The current verification boundary is intentionally organized around reusable seams:

- `src/lesson.ts` is the place where prompt selection, cue behavior, and answer evaluation can grow into letters and words.
- `src/App.test.tsx` already verifies the user-visible loop for prompt, answer, feedback, drawer interaction, and language switching.
- `tests/e2e/phase1-numbers.spec.ts` verifies the same critical loop in a real browser with speech and keyboard stubs.
- The current tests avoid implementation-specific assertions about component internals, which keeps them reusable when later lesson types are added.

## Expected additions in Phase 3 and later

When letters, words, or richer cue behavior land, extend the suite with:

- language-specific prompt pools and evaluation rules
- word-progress state and next-letter validation
- keyboard parity for non-digit inputs
- accessibility checks for focus return after drawer changes and keyboard-only play
