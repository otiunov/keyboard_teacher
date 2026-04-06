import { useState } from 'react'
import { getLanguageOptions, getSessionCopy, type Language } from './session'
type KeyState = 'idle' | 'highlighted-target'

const numberRows = [
  ['1', '2', '3', '4', '5'],
  ['6', '7', '8', '9', '0'],
]

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [isParentDrawerOpen, setIsParentDrawerOpen] = useState(false)
  const currentTarget = '3'

  const copy = getSessionCopy(language)

  return (
    <main className="stage">
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
          <header className="parent-drawer__header">
            <h2>Parent settings</h2>
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
        </section>
      ) : null}

      <section className="lesson-shell" aria-label="Numbers lesson">
        <header className="prompt-beacon">
          <p className="prompt-beacon__eyebrow">{copy.eyebrow}</p>
          <div className="prompt-beacon__target" aria-live="polite">
            {currentTarget}
          </div>
          <p className="prompt-beacon__meta">{copy.meta}</p>
        </header>

        <section className="keyboard-field" aria-label="Number keyboard">
          {numberRows.map((row, rowIndex) => (
            <div className="keyboard-row" key={rowIndex}>
              {row.map((value) => {
                const state: KeyState =
                  value === currentTarget ? 'highlighted-target' : 'idle'

                return (
                  <button
                    key={value}
                    className={`key-button key-button--${state}`}
                    type="button"
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          ))}
        </section>

        <section className="feedback-strip" aria-live="polite">
          <p>
            <span className="feedback-strip__label">Last key:</span> -
          </p>
          <p>Tap the glowing key</p>
        </section>
      </section>
    </main>
  )
}

export default App
