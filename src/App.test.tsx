import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

class MockSpeechSynthesisUtterance {
  lang = ''
  text = ''

  constructor(text: string) {
    this.text = text
  }
}

describe('App', () => {
  const originalSpeechSynthesis = window.speechSynthesis
  const originalSpeechSynthesisUtterance = window.SpeechSynthesisUtterance
  const speak = vi.fn()
  const cancel = vi.fn()
  const random = vi.spyOn(Math, 'random')

  beforeEach(() => {
    vi.useRealTimers()
    speak.mockReset()
    cancel.mockReset()
    random.mockReset()
    random.mockReturnValue(0.3)

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        speak,
        cancel,
      },
    })

    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  afterAll(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: originalSpeechSynthesis,
    })

    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: originalSpeechSynthesisUtterance,
    })
  })

  it('renders the phase 1 lesson shell', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: /open parent settings/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/numbers lesson/i)).toBeInTheDocument()
    expect(screen.getByText('Find this number')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(screen.getByText(/tap the glowing key/i)).toBeInTheDocument()
  })

  it('highlights only the active target key while the prompt is waiting', () => {
    render(<App />)

    const highlightedKeys = screen
      .getAllByRole('button')
      .filter((button) => button.classList.contains('key-button--highlighted-target'))

    expect(highlightedKeys).toHaveLength(1)
    expect(screen.getByRole('button', { name: '3' })).toHaveClass('key-button--highlighted-target')
  })

  it('speaks the current target when the lesson screen loads', () => {
    render(<App />)

    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak).toHaveBeenCalledWith(
      expect.objectContaining({
        text: '3',
        lang: 'en-US',
      }),
    )
  })

  it('speaks praise after the child clicks the correct key', async () => {
    const user = userEvent.setup()

    render(<App />)
    speak.mockClear()
    cancel.mockClear()

    await user.click(screen.getByRole('button', { name: '3' }))

    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Good job',
        lang: 'en-US',
      }),
    )
    expect(screen.getByText(/last key:/i).parentElement).toHaveTextContent('Last key: 3')
    expect(screen.getByText('Good job')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toHaveClass('key-button--correct')
  })

  it('speaks retry encouragement after the child clicks the wrong key', async () => {
    const user = userEvent.setup()

    render(<App />)
    speak.mockClear()
    cancel.mockClear()

    await user.click(screen.getByRole('button', { name: '1' }))

    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Try again',
        lang: 'en-US',
      }),
    )
    expect(screen.getByText((_, element) => element?.textContent === 'Last key: 1')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toHaveClass('key-button--highlighted-target')
    expect(screen.getByRole('button', { name: '1' })).toHaveClass('key-button--incorrect')
  })

  it('handles physical number key presses through the same lesson flow', () => {
    render(<App />)
    speak.mockClear()
    cancel.mockClear()

    fireEvent.keyDown(window, { key: '1' })

    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Try again',
        lang: 'en-US',
      }),
    )
    expect(screen.getByText((_, element) => element?.textContent === 'Last key: 1')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toHaveClass('key-button--highlighted-target')
    expect(screen.getByRole('button', { name: '1' })).toHaveClass('key-button--incorrect')
  })

  it('ignores non-number physical keyboard input', () => {
    render(<App />)
    speak.mockClear()
    cancel.mockClear()

    fireEvent.keyDown(window, { key: 'a' })

    expect(speak).not.toHaveBeenCalled()
    expect(screen.getByText((_, element) => element?.textContent === 'Last key: -')).toBeInTheDocument()
    expect(screen.getByText('Tap the glowing key')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toHaveClass('key-button--highlighted-target')
  })

  it('ignores physical keyboard lesson input while the parent drawer is open', async () => {
    const user = userEvent.setup()

    render(<App />)
    speak.mockClear()
    cancel.mockClear()

    await user.click(screen.getByRole('button', { name: /open parent settings/i }))
    fireEvent.keyDown(window, { key: '1' })

    expect(speak).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog', { name: /parent settings/i })).toBeInTheDocument()
    expect(screen.getByText((_, element) => element?.textContent === 'Last key: -')).toBeInTheDocument()
    expect(screen.getByText('Tap the glowing key')).toBeInTheDocument()
  })

  it('ignores repeated physical keyboard events', () => {
    render(<App />)
    speak.mockClear()
    cancel.mockClear()

    fireEvent.keyDown(window, { key: '1', repeat: true })

    expect(speak).not.toHaveBeenCalled()
    expect(screen.getByText((_, element) => element?.textContent === 'Last key: -')).toBeInTheDocument()
    expect(screen.getByText('Tap the glowing key')).toBeInTheDocument()
  })

  it('opens the parent drawer and switches the session language', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /open parent settings/i }))

    expect(screen.getByRole('dialog', { name: /parent settings/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /english/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /polish/i })).toHaveAttribute('aria-pressed', 'false')

    await user.click(screen.getByRole('button', { name: /polish/i }))

    expect(screen.getByText('Polish · Numbers')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /polish/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /english/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /close parent settings/i })).toBeInTheDocument()
  })

  it('shows lesson and hint-mode sections in the parent drawer', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /open parent settings/i }))

    expect(screen.getByRole('main', { name: /lesson stage/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /prompt beacon/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /keyboard field/i })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: /feedback strip/i })).toBeInTheDocument()
    expect(screen.getByText('Language')).toBeInTheDocument()
    expect(screen.getByText('Lesson')).toBeInTheDocument()
    expect(screen.getByText('Numbers')).toBeInTheDocument()
    expect(screen.getByText(/hint mode/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /always/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /after mistake/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('updates cue mode from the parent drawer without resetting the lesson state', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: /open parent settings/i }))
    await user.click(screen.getByRole('button', { name: /after mistake/i }))

    expect(screen.getByRole('button', { name: /after mistake/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /always/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByLabelText(/numbers lesson/i)).toHaveAttribute('data-cue-mode', 'after-mistake')
    expect(screen.getByText((_, element) => element?.textContent === 'Last key: 1')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
  })

  it('keeps the current lesson state when the parent drawer opens and closes', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: /open parent settings/i }))

    expect(screen.getByRole('dialog', { name: /parent settings/i })).toBeInTheDocument()
    expect(screen.getByText((_, element) => element?.textContent === 'Last key: 1')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toHaveClass('key-button--highlighted-target')

    await user.click(screen.getByRole('button', { name: /close parent settings/i }))

    expect(screen.queryByRole('dialog', { name: /parent settings/i })).not.toBeInTheDocument()
    expect(screen.getByText((_, element) => element?.textContent === 'Last key: 1')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toHaveClass('key-button--highlighted-target')
  })

  it('speaks the prompt using the selected session language', async () => {
    const user = userEvent.setup()

    render(<App />)
    speak.mockClear()
    cancel.mockClear()

    await user.click(screen.getByRole('button', { name: /open parent settings/i }))
    await user.click(screen.getByRole('button', { name: /polish/i }))

    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak).toHaveBeenCalledWith(
      expect.objectContaining({
        text: '3',
        lang: 'pl-PL',
      }),
    )
  })

  it('keeps the current target and feedback when the language changes mid-round', async () => {
    const user = userEvent.setup()

    render(<App />)
    speak.mockClear()
    cancel.mockClear()

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: /open parent settings/i }))
    await user.click(screen.getByRole('button', { name: /polish/i }))

    expect(screen.getByText((_, element) => element?.textContent === 'Last key: 1')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toHaveClass('key-button--highlighted-target')
    expect(screen.getByRole('button', { name: '1' })).toHaveClass('key-button--incorrect')
    expect(speak).toHaveBeenCalledTimes(2)
    expect(speak).toHaveBeenLastCalledWith(
      expect.objectContaining({
        text: '3',
        lang: 'pl-PL',
      }),
    )
  })

  it('advances to a new prompt after a short delay when the answer is correct', async () => {
    random.mockReturnValueOnce(0.3).mockReturnValueOnce(0.8)
    vi.useFakeTimers()

    render(<App />)
    speak.mockClear()
    cancel.mockClear()

    fireEvent.click(screen.getByRole('button', { name: '3' }))

    expect(screen.getByText((_, element) => element?.textContent?.replace(/\s+/g, ' ').trim() === 'Last key: 3')).toBeInTheDocument()
    expect(screen.getByText('Good job')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toHaveClass('key-button--highlighted-target')

    await act(async () => {
      vi.advanceTimersByTime(700)
    })

    expect(screen.getByRole('button', { name: '8' })).toHaveClass('key-button--highlighted-target')
    expect(screen.getByRole('button', { name: '3' })).toHaveClass('key-button--idle')
    expect(screen.getByText((_, element) => element?.textContent === 'Last key: -')).toBeInTheDocument()
    expect(screen.getByText('Tap the glowing key')).toBeInTheDocument()
  })

  it('speaks the next target when the lesson advances after a correct answer', async () => {
    random.mockReturnValueOnce(0.3).mockReturnValueOnce(0.8)
    vi.useFakeTimers()

    render(<App />)
    speak.mockClear()
    cancel.mockClear()

    fireEvent.click(screen.getByRole('button', { name: '3' }))

    expect(speak).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        text: 'Good job',
        lang: 'en-US',
      }),
    )

    await act(async () => {
      vi.advanceTimersByTime(700)
    })

    expect(speak).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        text: '8',
        lang: 'en-US',
      }),
    )
  })
})
