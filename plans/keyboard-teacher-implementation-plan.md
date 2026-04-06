# Plan: Bilingual Keyboard Teacher

> Source PRD: `plans/keyboard-teacher-prd.md`

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**: Single-route SPA for v1.
- **Runtime**: Browser-only application with no backend requirement.
- **Speech boundary**: Use browser speech synthesis for prompts and feedback in English and Polish.
- **Input model**: Support both oversized on-screen keys and physical keyboard input through one shared evaluation path.
- **Lesson progression**: Parent selects the active lesson mode; the app does not auto-advance based on mastery.
- **Key models**: `SessionSettings`, `LessonContentProvider`, `PromptEngine`, `SpeechAdapter`, `InputEvaluator`.
- **Content model**: Numbers, letters, and words are client-side lesson sets keyed by language and lesson type.
- **State**: Session state is in-memory only for v1; no persistence, accounts, or analytics.

---

## Phase 1: First Playable Number Lesson

**User stories**: Parent can choose language and start a lesson. Child can hear a spoken number prompt, see the keyboard, press the matching key, and get immediate feedback.

### What to build

Create the initial single-page app shell and the first end-to-end lesson loop for number recognition. This phase includes the first pass of the frontend design needed to make the experience playable: session controls, oversized on-screen keyboard, visible pressed-key area, spoken prompts, key highlighting, and correct/incorrect feedback. The slice must be demoable with random number prompts in one selected language at a time.

### Acceptance criteria

- [ ] A parent can open the app and select `English` or `Polish` before starting practice.
- [ ] The app can run a numbers lesson using random prompts from digits `0-9`.
- [ ] The current target is spoken aloud using browser speech synthesis.
- [ ] The child can answer by clicking the on-screen keyboard.
- [ ] Correct answers trigger positive feedback and advance to the next prompt.
- [ ] Wrong answers trigger encouragement and keep the same target active.
- [ ] The UI displays the most recent key the child pressed.
- [ ] The current target key can be visibly highlighted in the initial teaching mode.

---

## Phase 2: Dual Input and Cue Control

**User stories**: Child can use both the physical keyboard and the on-screen keyboard. Parent can choose whether the visual cue is shown immediately or only after a mistake.

### What to build

Extend the lesson loop so both input methods behave identically and the parent can switch between guided teaching mode and delayed-hint mode. This slice should preserve the same number lesson behavior while making the interaction model flexible enough for later stages.

### Acceptance criteria

- [ ] Physical keyboard input and on-screen clicks are normalized through the same answer-checking flow.
- [ ] A parent can select whether the target key is highlighted immediately or only after an incorrect answer.
- [ ] In delayed-hint mode, the app does not reveal the highlight before the first attempt.
- [ ] In after-mistake mode, an incorrect answer triggers encouragement and then reveals or repeats the hint.
- [ ] Feedback behavior remains consistent regardless of input method.

---

## Phase 3: Language-Specific Letter Lessons

**User stories**: Child can practice letter recognition in English or Polish using the same experience as number practice.

### What to build

Add letter-mode lesson content for both supported languages while keeping the same core session flow, prompt behavior, and feedback loop. The app should switch cleanly between number and letter practice through the parent controls without introducing a separate interface.

### Acceptance criteria

- [ ] A parent can select `Letters` as the active lesson type.
- [ ] English letter lessons use `A-Z`.
- [ ] Polish letter lessons use the intended language-specific alphabet.
- [ ] Spoken prompts, visual cues, and feedback work for letters as they do for numbers.
- [ ] Letter evaluation handles expected case-insensitive input correctly where applicable.

---

## Phase 4: Guided Word Practice

**User stories**: Child can hear a simple word and enter it one letter at a time with visible progress.

### What to build

Introduce word-mode practice using a short curated list of age-appropriate words for each language. The app should speak a target word, guide the child through entering the next expected letter, show progress in the input area, and celebrate completion before moving to the next word.

### Acceptance criteria

- [ ] A parent can select `Words` as the active lesson type.
- [ ] The app uses a curated, language-specific list of short practice words.
- [ ] The child is evaluated against the next expected letter rather than the whole word at once.
- [ ] The UI shows progressive completion of the current word.
- [ ] Completing a word triggers success feedback and advances to a new word.
- [ ] Incorrect letters do not advance progress and keep the current word active.

---

## Phase 5: Hardening and Browser Validation

**User stories**: Parent can rely on the app to behave predictably on common laptop and tablet browsers.

### What to build

Stabilize the product through focused test coverage and browser/device validation. This phase should verify the content model, prompt engine, input normalization, and lesson behavior end to end, and confirm that speech and interaction remain usable on the target device types.

### Acceptance criteria

- [ ] Automated tests cover lesson content selection for numbers, letters, and words.
- [ ] Automated tests cover prompt progression and wrong-answer retry behavior.
- [ ] Automated tests cover input normalization across click and physical key paths.
- [ ] Automated tests cover cue-mode behavior differences.
- [ ] Manual verification confirms usable speech output and interaction on laptop and tablet browsers.
- [ ] Known limitations around browser speech availability are documented if they cannot be eliminated.
