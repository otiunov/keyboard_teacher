export type NumberLessonPhase = 'prompt' | 'correct' | 'incorrect'
export type NumberKeyFeedbackState = 'idle' | 'correct' | 'incorrect'

export interface NumberKeyPresentation {
  isHighlighted: boolean
  feedbackState: NumberKeyFeedbackState
}

export interface NumberLessonState {
  target: string
  highlightedKey: string
  lastKey: string | null
  feedback: string
  pendingAdvance: boolean
  phase: NumberLessonPhase
}

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

function pickDigit(random: () => number) {
  const index = Math.floor(random() * digits.length)

  return digits[index]
}

export function createNumberLessonState(random: () => number = Math.random): NumberLessonState {
  const target = pickDigit(random)

  return {
    target,
    highlightedKey: target,
    lastKey: null,
    feedback: 'Tap the glowing key',
    pendingAdvance: false,
    phase: 'prompt',
  }
}

export function submitNumberAnswer(
  state: NumberLessonState,
  key: string,
): NumberLessonState {
  if (key === state.target) {
    return {
      ...state,
      lastKey: key,
      feedback: 'Good job',
      pendingAdvance: true,
      phase: 'correct',
    }
  }

  return {
    ...state,
    lastKey: key,
    feedback: 'Try again',
    pendingAdvance: false,
    phase: 'incorrect',
  }
}

export function advanceNumberLesson(
  state: NumberLessonState,
  random: () => number = Math.random,
): NumberLessonState {
  if (!state.pendingAdvance) {
    return state
  }

  const target = pickDigit(random)

  return {
    target,
    highlightedKey: target,
    lastKey: null,
    feedback: 'Tap the glowing key',
    pendingAdvance: false,
    phase: 'prompt',
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
