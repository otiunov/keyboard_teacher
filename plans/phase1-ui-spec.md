# Phase 1 UI Spec: First Playable Number Lesson

> Source documents: `plans/keyboard-teacher-prd.md`, `plans/keyboard-teacher-implementation-plan.md`

## Goal

Define a buildable frontend spec for Phase 1 of the keyboard teacher app using the chosen `Design 1` direction:

- one full-screen teaching surface
- one dominant prompt area
- one dominant keyboard area
- one small feedback area
- one hidden parent settings drawer opened by a small control

This spec covers only the first playable numbers lesson.

## Product scope for this UI

- Lesson type implemented in Phase 1: `Numbers`
- Language options exposed in Phase 1: `English`, `Polish`
- Input method implemented in Phase 1 UI: on-screen keyboard clicks
- Cue mode implemented in Phase 1 UI: immediate highlight
- Session model: endless prompts until parent stops or leaves

Phase 2 will add physical keyboard parity and cue-mode switching without changing the page shape.

## Screen structure

The app uses a single route and a single persistent screen. The page is divided into four visible regions and one hidden overlay.

### 1. Stage

The `Stage` is the full viewport container. It owns the background, spacing, and reading order.

Responsibilities:

- centers the lesson
- keeps the child focused on one obvious task
- contains all visible lesson UI
- dims when the parent drawer is open

Layout rules:

- desktop and tablet: vertically stacked layout centered in the viewport
- mobile portrait: same stack, tighter spacing, keyboard fills most of the lower screen
- max content width: approximately `1100px`
- side padding: minimum `16px` on small screens, `32px` on larger screens

### 2. Parent Chip

The `Parent Chip` is a small persistent button in the top-right corner of the stage.

Responsibilities:

- opens and closes the parent drawer
- stays discoverable for adults
- stays visually unimportant for the child

Behavior:

- label: `Parent`
- icon: simple gear or sliders icon
- tap target: at least `44x44px`
- opening the drawer does not reset lesson state

### 3. Prompt Beacon

The `Prompt Beacon` is the main focal card near the top-center of the lesson.

Responsibilities:

- displays the current target number
- visually anchors the spoken prompt
- shows current lesson language subtly

Content:

- oversized target glyph, for example `3`
- small lesson label, for example `Find this number`
- small language label, for example `English`

Behavior:

- when a new prompt starts, the beacon updates before or at the same time as speech playback
- the target glyph remains visible until the child answers correctly
- on a wrong answer, the same target remains on screen

Visual rules:

- target glyph should be the largest text on the page
- the card should be simple, high-contrast, and uncluttered
- use a short pulse or glow when the prompt is first spoken

### 4. Keyboard Field

The `Keyboard Field` is the main interactive surface under the beacon.

Responsibilities:

- presents oversized keys for digits `0-9`
- highlights the current correct key in teaching mode
- accepts click or tap input

Layout rules:

- use a stable keyboard-like arrangement rather than a random grid
- keys should be large enough for a 4-year-old on a tablet
- minimum key size: `72x72px`
- preferred key size on tablet/desktop: `88-112px`
- keep visible gaps between keys so accidental taps are reduced

Recommended Phase 1 key arrangement:

- top row: `1 2 3 4 5`
- bottom row: `6 7 8 9 0`

Key states:

- `idle`
- `highlighted-target`
- `pressed`
- `correct`
- `incorrect`

Behavior:

- only one key is highlighted as the current target in Phase 1
- pressing a key updates the response and feedback immediately
- correct keys briefly animate to a success state before the next prompt appears
- incorrect keys briefly animate to an error state, then return to idle while the target remains active

### 5. Feedback Strip

The `Feedback Strip` is a narrow region below the keyboard.

Responsibilities:

- echoes the child's most recent selection
- shows short encouragement or praise text
- keeps lesson state visible without adding clutter

Content:

- `Last key:` followed by the last pressed digit
- a one-line status message

Copy examples:

- neutral before input: `Tap the glowing key`
- correct: `Good job`
- incorrect: `Try again`

Behavior:

- if no key has been pressed yet, show `Last key: -`
- after each press, update immediately
- after a correct answer, the success message remains visible until the next prompt starts

## Parent drawer

The `Lesson Drawer` is a hidden settings panel opened from the `Parent Chip`.

Responsibilities:

- configure the current session
- provide setup without exposing controls permanently to the child

Placement:

- open as a right-side drawer on tablet/desktop
- open as a full-height bottom sheet on narrow mobile screens

Controls in Phase 1:

- `Language`
  - `English`
  - `Polish`
- `Lesson`
  - `Numbers`
- `Hint mode`
  - visible but disabled or labeled `Coming in Phase 2` if the implementation wants to preserve future shape
  - otherwise omit entirely in Phase 1
- `Close`

Behavior:

- changing language affects the next spoken prompt
- the drawer can be opened during play
- closing the drawer returns focus to the lesson surface
- the drawer must not cover the entire app on larger screens unless necessary

## Interaction flow

### Initial load

1. App loads into the stage.
2. Parent chip is visible.
3. Prompt beacon and keyboard field can render with a default session.
4. Default assumption:
   - language: `English`
   - lesson: `Numbers`
5. The first prompt is either auto-started on load or starts after the parent closes the drawer once.

Recommended default:

- auto-start the first prompt in `English` numbers mode
- let the parent change language from the drawer if needed

### Prompt cycle

1. Select a random target from `0-9`.
2. Update the prompt beacon with the target.
3. Speak the target.
4. Highlight the matching key in the keyboard field.
5. Wait for input.
6. On correct input:
   - show success state
   - speak praise
   - wait a short beat
   - advance to next prompt
7. On incorrect input:
   - show error state on the pressed key
   - update feedback strip to `Try again`
   - keep the same target active
   - optionally repeat the spoken prompt after a short delay

## Timing and motion

Motion should support learning, not decoration.

Timing guidance:

- prompt beacon pulse on new prompt: `200-300ms`
- key press feedback: `120-180ms`
- success hold before next prompt: `600-900ms`
- error hold before idle reset: `300-500ms`

Animation guidance:

- new prompt: soft pulse or glow on beacon and highlighted key
- correct answer: slight scale-up and warm color flash
- wrong answer: quick shake or color flash, no harsh movement
- drawer open/close: smooth slide, `200-250ms`

Avoid:

- confetti
- bouncing page-wide transitions
- multiple competing animations at once

## Visual direction

The chosen direction is minimal and child-first, not dashboard-like.

Design goals:

- warm, clear, playful
- high contrast for glyph recognition
- very few competing elements
- no dense text blocks

Visual guidance:

- use one dominant accent color for the active target/highlight
- use one success color and one error color
- keep the stage background soft and low-noise
- avoid sharp enterprise-style boxes and dense control bars

Typography guidance:

- use a friendly, highly legible display face for the target glyph if available
- use a clean supporting face for labels and feedback
- prioritize numeral legibility over stylistic novelty

## Accessibility and usability requirements

- all interactive targets must be large enough for touch
- color is not the only indicator of current target or correctness
- spoken prompt must have a visual equivalent in the prompt beacon
- the parent chip must be keyboard-focusable
- focus outlines must remain visible for adult setup flows
- the lesson must remain usable in both laptop and tablet sizes

## Responsive behavior

### Desktop and tablet landscape

- prompt beacon centered near the top
- keyboard field centered below with comfortable spacing
- feedback strip directly below keyboard
- parent drawer opens from the right

### Tablet portrait and mobile portrait

- keep the same vertical order
- reduce outer spacing before reducing key size
- keyboard should occupy most of the lower half of the screen
- parent drawer becomes a bottom sheet

## Phase 1 copy

Prompt beacon label:

- English: `Find this number`
- Polish: `Find this number` placeholder is acceptable in Phase 1 only if Polish UI strings are not yet implemented, but final Phase 1 target should localize visible labels too

Feedback:

- English success: `Good job`
- English retry: `Try again`
- Polish success: localized equivalent
- Polish retry: localized equivalent

Parent controls:

- `Parent`
- `Language`
- `Lesson`
- `Numbers`
- `English`
- `Polish`
- `Close`

## Component contract for implementation

The UI should be buildable from these top-level components:

- `Stage`
- `ParentChip`
- `LessonDrawer`
- `PromptBeacon`
- `KeyboardField`
- `KeyButton`
- `FeedbackStrip`

Expected UI inputs:

- `sessionSettings`
- `currentPrompt`
- `lastPressedKey`
- `feedbackState`
- `highlightedKey`
- `isDrawerOpen`

Expected UI events:

- `openDrawer`
- `closeDrawer`
- `changeLanguage`
- `pressKey`
- `startNextPrompt`

## Phase 1 acceptance checklist

- [ ] Parent can change between English and Polish from the drawer.
- [ ] Child sees one large target and one large keyboard without extra clutter.
- [ ] A random number prompt is spoken and displayed.
- [ ] The correct key is visually highlighted.
- [ ] Clicking the correct key advances the lesson.
- [ ] Clicking the wrong key keeps the same target active.
- [ ] The feedback strip shows the last pressed key and a short message.
- [ ] The layout works on laptop and tablet widths.
- [ ] The page shape does not need to change in Phase 2 when physical keyboard input is added.
