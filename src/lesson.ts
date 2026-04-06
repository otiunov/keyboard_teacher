export type NumberLessonPhase = 'prompt' | 'correct' | 'incorrect'

export interface NumberLessonState {
  target: string
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
  return {
    target: pickDigit(random),
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

  return {
    target: pickDigit(random),
    lastKey: null,
    feedback: 'Tap the glowing key',
    pendingAdvance: false,
    phase: 'prompt',
  }
}
