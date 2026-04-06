import type { CueMode } from './session'

export type NumberLessonPhase = 'prompt' | 'correct' | 'incorrect'
export type NumberKeyFeedbackState = 'idle' | 'correct' | 'incorrect'

export interface NumberKeyPresentation {
  isHighlighted: boolean
  feedbackState: NumberKeyFeedbackState
}

export interface NumberLessonState {
  target: string
  highlightedKey: string | null
  lastKey: string | null
  feedback: string
  pendingAdvance: boolean
  phase: NumberLessonPhase
  cueMode: CueMode
}

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

function pickDigit(random: () => number) {
  const index = Math.floor(random() * digits.length)

  return digits[index]
}

function getHighlightedKey(target: string, cueMode: CueMode) {
  return cueMode === 'after-mistake' ? null : target
}

export function syncNumberLessonCueMode(
  state: NumberLessonState,
  cueMode: CueMode,
): NumberLessonState {
  if (cueMode === 'always') {
    return {
      ...state,
      cueMode,
      highlightedKey: state.target,
    }
  }

  if (state.phase === 'incorrect') {
    return {
      ...state,
      cueMode,
      highlightedKey: state.target,
    }
  }

  return {
    ...state,
    cueMode,
    highlightedKey: null,
  }
}

export function createNumberLessonState(
  random: () => number = Math.random,
  cueMode: CueMode = 'always',
): NumberLessonState {
  const target = pickDigit(random)

  return {
    target,
    highlightedKey: getHighlightedKey(target, cueMode),
    lastKey: null,
    feedback: 'Tap the glowing key',
    pendingAdvance: false,
    phase: 'prompt',
    cueMode,
  }
}

export function submitNumberAnswer(
  state: NumberLessonState,
  key: string,
  cueMode: CueMode = state.cueMode,
): NumberLessonState {
  if (key === state.target) {
    return {
      ...state,
      cueMode,
      lastKey: key,
      feedback: 'Good job',
      pendingAdvance: true,
      phase: 'correct',
    }
  }

  return {
    ...state,
    cueMode,
    highlightedKey: cueMode === 'after-mistake' ? state.target : state.highlightedKey,
    lastKey: key,
    feedback: 'Try again',
    pendingAdvance: false,
    phase: 'incorrect',
  }
}

export function advanceNumberLesson(
  state: NumberLessonState,
  random: () => number = Math.random,
  cueMode: CueMode = state.cueMode,
): NumberLessonState {
  if (!state.pendingAdvance) {
    return state
  }

  const target = pickDigit(random)

  return {
    target,
    highlightedKey: getHighlightedKey(target, cueMode),
    lastKey: null,
    feedback: 'Tap the glowing key',
    pendingAdvance: false,
    phase: 'prompt',
    cueMode,
  }
}

export function setNumberLessonCueMode(
  state: NumberLessonState,
  cueMode: CueMode,
): NumberLessonState {
  return {
    ...state,
    cueMode,
    highlightedKey:
      cueMode === 'always' || state.phase === 'incorrect' ? state.target : null,
  }
}

export function getNumberKeyPresentation(
  state: NumberLessonState,
  key: string,
): NumberKeyPresentation {
  if (state.lastKey === key && state.phase === 'correct') {
    return {
      isHighlighted: key === state.highlightedKey,
      feedbackState: 'correct',
    }
  }

  if (state.lastKey === key && state.phase === 'incorrect') {
    return {
      isHighlighted: key === state.highlightedKey,
      feedbackState: 'incorrect',
    }
  }

  return {
    isHighlighted: key === state.highlightedKey,
    feedbackState: 'idle',
  }
}
