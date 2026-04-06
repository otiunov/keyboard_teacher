import { describe, expect, it } from 'vitest'
import { getLanguageOptions, getSessionCopy } from './session'

describe('session copy', () => {
  it('exposes the parent language choices and visible header labels', () => {
    expect(getLanguageOptions()).toEqual([
      { value: 'en', label: 'English' },
      { value: 'pl', label: 'Polish' },
    ])

    expect(getSessionCopy('en')).toEqual({
      eyebrow: 'Find this number',
      meta: 'English · Numbers',
    })

    expect(getSessionCopy('pl')).toEqual({
      eyebrow: 'Znajdź tę liczbę',
      meta: 'Polish · Numbers',
    })
  })
})
