type KeyState = 'idle' | 'highlighted-target'

const numberRows = [
  ['1', '2', '3', '4', '5'],
  ['6', '7', '8', '9', '0'],
]

function App() {
  const currentTarget = '3'

  return (
    <main className="stage">
      <button className="parent-chip" type="button" aria-label="Open parent settings">
        <span className="parent-chip__icon" aria-hidden="true">
          sliders
        </span>
        <span className="parent-chip__label">Parent</span>
      </button>

      <section className="lesson-shell" aria-label="Numbers lesson">
        <header className="prompt-beacon">
          <p className="prompt-beacon__eyebrow">Find this number</p>
          <div className="prompt-beacon__target" aria-live="polite">
            {currentTarget}
          </div>
          <p className="prompt-beacon__meta">English · Numbers</p>
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
