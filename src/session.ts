export type Language = 'en' | 'pl'

type SessionCopy = {
  eyebrow: string
  meta: string
}

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polish' },
]

const sessionCopy: Record<Language, SessionCopy> = {
  en: {
    eyebrow: 'Find this number',
    meta: 'English · Numbers',
  },
  pl: {
    eyebrow: 'Znajdź tę liczbę',
    meta: 'Polish · Numbers',
  },
}

export function getLanguageOptions() {
  return languageOptions
}

export function getSessionCopy(language: Language) {
  return sessionCopy[language]
}
