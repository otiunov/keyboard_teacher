import { render, screen } from '@testing-library/react'
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

  beforeEach(() => {
    speak.mockReset()
    cancel.mockReset()

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
})
