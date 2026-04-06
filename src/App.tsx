import { useEffect, useRef, useState } from 'react'
import {
  advanceNumberLesson,
  createNumberLessonState,
  submitNumberAnswer,
} from './lesson'
import { getLanguageOptions, getSessionCopy, type Language } from './session'
import { speakText } from './speech'

type KeyState = 'idle' | 'highlighted-target'

const numberRows = [
  ['1', '2', '3', '4', '5'],
  ['6', '7', '8', '9', '0'],
]

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [isParentDrawerOpen, setIsParentDrawerOpen] = useState(false)
  const [lesson, setLesson] = useState(() => createNumberLessonState())
  const advanceTimerRef = useRef<number | null>(null)

  const copy = getSessionCopy(language)

  useEffect(() => {
    speakText(window.speechSynthesis, window.SpeechSynthesisUtterance, lesson.target, language)
  }, [lesson.target, language])

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current)
      }
    }
  }, [])

  function scheduleAdvance() {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current)
    }

    advanceTimerRef.current = window.setTimeout(() => {
      setLesson((current) => advanceNumberLesson(current))
    }, 700)
  }

  function handleKeyPress(value: string) {
    setLesson((current) => {
      const next = submitNumberAnswer(current, value)

      speakText(
        window.speechSynthesis,
        window.SpeechSynthesisUtterance,
        next.feedback,
        language,
      )

      if (next.pendingAdvance) {
        scheduleAdvance()
      }

      return next
    })
  }

  return (
    <main className="stage" aria-label="Lesson stage">
      <button
        className="parent-chip"
        type="button"
        aria-label="Open parent settings"
        aria-expanded={isParentDrawerOpen}
        aria-controls="parent-settings-drawer"
        onClick={() => setIsParentDrawerOpen((isOpen) => !isOpen)}
      >
        <span className="parent-chip__icon" aria-hidden="true">
          sliders
        </span>
        <span className="parent-chip__label">Parent</span>
      </button>

      {isParentDrawerOpen ? (
        <div
          className="lesson-backdrop"
          onClick={() => setIsParentDrawerOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {isParentDrawerOpen ? (
        <section
          id="parent-settings-drawer"
          className="parent-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Parent settings"
        >
          <div className="parent-drawer__surface">
            <header className="parent-drawer__header">
              <div>
                <p className="parent-drawer__eyebrow">Parent settings</p>
                <h2>Lesson setup</h2>
              </div>
              <button
                className="parent-drawer__close"
                type="button"
                aria-label="Close parent settings"
                onClick={() => setIsParentDrawerOpen(false)}
              >
                Close
              </button>
            </header>

            <fieldset className="parent-drawer__group">
              <legend>Language</legend>
              <div className="parent-drawer__choices">
                {getLanguageOptions().map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="parent-drawer__choice"
                    aria-pressed={language === option.value}
                    onClick={() => setLanguage(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="parent-drawer__group">
              <legend>Lesson</legend>
              <p className="parent-drawer__static-value">Numbers</p>
            </fieldset>

            <fieldset className="parent-drawer__group parent-drawer__group--hint">
              <legend>Hint mode</legend>
              <p className="parent-drawer__hint-placeholder" aria-disabled="true">
                Coming in Phase 2
              </p>
            </fieldset>
          </div>
        </section>
      ) : null}

      <section className="lesson-shell" aria-label="Numbers lesson">
        <section
          className="prompt-beacon"
          role="region"
          aria-labelledby="prompt-beacon-title"
          aria-describedby="prompt-beacon-meta"
        >
          <h2 className="sr-only" id="prompt-beacon-title">
            Prompt beacon
          </h2>
          <p className="prompt-beacon__eyebrow">
            {copy.eyebrow}
          </p>
          <div className="prompt-beacon__target" aria-live="polite">
            {lesson.target}
          </div>
          <p className="prompt-beacon__meta" id="prompt-beacon-meta">
            {copy.meta}
          </p>
        </section>

        <section
          className="keyboard-field"
          role="region"
          aria-labelledby="keyboard-field-title"
        >
          <h2 className="sr-only" id="keyboard-field-title">
            Keyboard field
          </h2>
          {numberRows.map((row, rowIndex) => (
            <div className="keyboard-row" key={rowIndex}>
              {row.map((value) => {
                const state: KeyState =
                  value === lesson.target ? 'highlighted-target' : 'idle'

                return (
                  <button
                    key={value}
                    className={`key-button key-button--${state}`}
                    type="button"
                    onClick={() => handleKeyPress(value)}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          ))}
        </section>

        <section
          className="feedback-strip"
          role="status"
          aria-labelledby="feedback-strip-title"
          aria-live="polite"
        >
          <h2 className="sr-only" id="feedback-strip-title">
            Feedback strip
          </h2>
          <p>
            <span className="feedback-strip__label">Last key:</span>{' '}
            {lesson.lastKey ?? '-'}
          </p>
          <p>{lesson.feedback}</p>
        </section>
      </section>
    </main>
  )
}

export default App
