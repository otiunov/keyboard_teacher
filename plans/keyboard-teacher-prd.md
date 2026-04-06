# PRD: Bilingual Keyboard Teacher for Early Symbol Recognition

## Summary

Build a single-page web app for a 4-year-old to learn keyboard-based recognition of symbols through guided interaction. The first shipped slice teaches number recognition, with the product designed to extend cleanly into letter recognition and then guided word-building. A parent preselects `English` or `Polish`, chooses the lesson type, and the child responds by clicking large on-screen keys or using the physical keyboard. Each prompt is spoken aloud, the target key can be highlighted depending on parent preference, correct answers get praise, and wrong answers get encouragement plus a follow-up hint.

Success means:

- the child can hear a prompted symbol and identify the correct key
- the app works in both English and Polish
- the same interaction model supports numbers first, then letters, then simple words
- the experience is simple enough for a parent to start and supervise without setup friction

## Key Changes

- Define the product as a browser-only SPA with no backend requirement for v1.
- Use browser speech synthesis for spoken prompts and feedback in both supported languages.
- Support two input methods from day one:
  - oversized on-screen keyboard buttons for clicking/tapping
  - physical keyboard input for real-key reinforcement
- Structure lessons as parent-selected modes rather than automatic progression:
  - `Numbers`
  - `Letters`
  - `Words`
- Deliver curriculum in stages under one shared architecture:
  - Stage 1: digits `0-9`, random spoken prompts, highlightable target, immediate feedback
  - Stage 2: language-specific letter sets
  - English: `A-Z`
  - Polish: full Polish alphabet including language-specific letters
  - Stage 3: guided word entry with short curated words; the app speaks a simple word and guides the child to press its letters one by one
- Include a simple parent control surface with:
  - language preselection for the session
  - lesson type selection
  - visual-cue mode toggle
  - always show highlight immediately
  - reveal highlight only after mistakes
- Keep the input area read-only from the child's perspective in early stages:
  - display what was pressed
  - for word mode, display letter-by-letter progress toward the current target word
- Use random target selection within the active lesson set; do not implement adaptive repetition, mastery tracking, or automatic advancement in the first version.
- Keep session flow endless until the parent stops; no timed sessions or completion screen in v1.

### Public Interfaces / Types

- `SessionSettings`
  - `language: "en" | "pl"`
  - `lessonType: "numbers" | "letters" | "words"`
  - `cueMode: "always" | "after-mistake"`
  - `inputMode: "onscreen" | "physical" | "both"` with default `both`
- `LessonContentProvider`
  - returns the valid prompt pool for the current language and lesson type
  - for word mode, returns curated short child-friendly words by language
- `PromptEngine`
  - chooses the next target from the active pool
  - tracks the current expected symbol or current position within a target word
  - emits result states: `idle`, `prompting`, `correct`, `incorrect`, `completed-word`
- `SpeechAdapter`
  - `speakPrompt(target, settings)`
  - `speakPraise(settings)`
  - `speakRetry(target, settings)`
- `InputEvaluator`
  - normalizes click and keyboard input into the same symbol-comparison path
  - validates a single symbol in number/letter mode
  - validates the next expected letter in word mode

## Test Plan

- Unit-test `LessonContentProvider`:
  - correct number set
  - correct English letter set
  - correct Polish letter set
  - correct per-language word lists returned
- Unit-test `PromptEngine`:
  - random selection only from active lesson pool
  - word mode advances only on the next correct letter
  - wrong input keeps the current target active
- Unit-test `InputEvaluator`:
  - on-screen clicks and physical keys normalize to identical comparisons
  - case handling for letters is correct
  - Polish-specific letters are handled correctly
- Integration-test lesson behavior:
  - prompt is spoken when a round starts
  - highlight behavior respects cue mode
  - correct answer triggers praise and advances
  - wrong answer triggers encouragement and retry behavior
  - displayed input reflects what the child pressed
- Manual/browser verification:
  - English and Polish voices are selectable and understandable on target browsers/devices
  - large keys are usable on tablet and laptop
  - keyboard-only and pointer-only interaction both work
- Good tests should verify external behavior only:
  - selected lesson content
  - spoken/visual feedback triggers
  - correct/incorrect progression
  - displayed child-facing state
  - not internal implementation details or component-local mechanics

## Assumptions and Defaults

- The repository has no existing app scaffold, so this PRD assumes greenfield implementation.
- GitHub issue submission is deferred until the project is connected to a Git repository / GitHub repo.
- v1 does not include persistence, accounts, analytics, progress history, or adaptive difficulty.
- The parent, not the app, decides when to switch from numbers to letters to words.
- Word mode uses a curated list of very short, phonetic, age-appropriate words per language rather than free-form spelling.
- Audio uses browser speech synthesis instead of prerecorded or cloud-generated audio.
- The visual cue is parent-configurable because you chose a teaching mode / testing mode toggle.
- Non-goals for the first version:
  - mixed bilingual prompts in one session
  - automatic mastery scoring
  - timed games
  - parent-entered custom word lists
  - full reading curriculum beyond guided symbol and short-word recognition
