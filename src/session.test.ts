import { describe, expect, it } from 'vitest'
import { getCueModeOptions, getLanguageOptions, getSessionCopy } from './session'

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

  it('exposes the phase 2 cue-mode choices', () => {
    expect(getCueModeOptions()).toEqual([
      { value: 'always', label: 'Always' },
      { value: 'after-mistake', label: 'After mistake' },
    ])
  })
})
