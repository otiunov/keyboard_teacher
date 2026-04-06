import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the phase 1 lesson shell', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: /open parent settings/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/numbers lesson/i)).toBeInTheDocument()
    expect(screen.getByText('Find this number')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(screen.getByText(/tap the glowing key/i)).toBeInTheDocument()
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
})
