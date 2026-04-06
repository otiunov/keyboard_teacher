import {
  advanceNumberLesson,
  createNumberLessonState,
  getNumberKeyPresentation,
  submitNumberAnswer,
} from './lesson'

describe('number lesson state', () => {
  it('starts from a random digit in the lesson range', () => {
    const lesson = createNumberLessonState(() => 0.8)

    expect(lesson.target).toBe('8')
    expect(lesson.highlightedKey).toBe('8')
    expect(lesson.lastKey).toBeNull()
    expect(lesson.feedback).toBe('Tap the glowing key')
    expect(lesson.pendingAdvance).toBe(false)
    expect(lesson.phase).toBe('prompt')
  })

  it('keeps the target active after a wrong answer', () => {
    const lesson = createNumberLessonState(() => 0.3)
    const next = submitNumberAnswer(lesson, '1')

    expect(next.target).toBe('3')
    expect(next.highlightedKey).toBe('3')
    expect(next.lastKey).toBe('1')
    expect(next.feedback).toBe('Try again')
    expect(next.pendingAdvance).toBe(false)
    expect(next.phase).toBe('incorrect')
  })

  it('marks a correct answer ready to advance and then advances to a new target', () => {
    const lesson = createNumberLessonState(() => 0.3)
    const answered = submitNumberAnswer(lesson, '3')
    const advanced = advanceNumberLesson(answered, () => 0.8)

    expect(answered.target).toBe('3')
    expect(answered.highlightedKey).toBe('3')
    expect(answered.lastKey).toBe('3')
    expect(answered.feedback).toBe('Good job')
    expect(answered.pendingAdvance).toBe(true)
    expect(answered.phase).toBe('correct')

    expect(advanced.target).toBe('8')
    expect(advanced.highlightedKey).toBe('8')
    expect(advanced.lastKey).toBeNull()
    expect(advanced.feedback).toBe('Tap the glowing key')
    expect(advanced.pendingAdvance).toBe(false)
    expect(advanced.phase).toBe('prompt')
  })

  it('keeps the teaching cue on the target while marking a wrong key as incorrect', () => {
    const lesson = createNumberLessonState(() => 0.3)
    const next = submitNumberAnswer(lesson, '1')

    expect(getNumberKeyPresentation(next, '3')).toEqual({
      isHighlighted: true,
      feedbackState: 'idle',
    })
    expect(getNumberKeyPresentation(next, '1')).toEqual({
      isHighlighted: false,
      feedbackState: 'incorrect',
    })
  })

  it('lets the target key be both highlighted and correct after a right answer', () => {
    const lesson = createNumberLessonState(() => 0.3)
    const next = submitNumberAnswer(lesson, '3')

    expect(getNumberKeyPresentation(next, '3')).toEqual({
      isHighlighted: true,
      feedbackState: 'correct',
    })
  })
})
