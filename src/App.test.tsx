import { render, screen } from '@testing-library/react'
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
})
