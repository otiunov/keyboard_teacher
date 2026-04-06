import type { Language } from './session'

type BrowserSpeech = Pick<SpeechSynthesis, 'cancel' | 'speak'>

function getSpeechLanguage(language: Language) {
  return language === 'pl' ? 'pl-PL' : 'en-US'
}

export function speakText(
  speechSynthesis: BrowserSpeech | undefined,
  utteranceCtor: typeof SpeechSynthesisUtterance | undefined,
  text: string,
  language: Language,
) {
  if (!speechSynthesis || !utteranceCtor) {
    return
  }

  const utterance = new utteranceCtor(text)
  utterance.lang = getSpeechLanguage(language)

  speechSynthesis.cancel()
  speechSynthesis.speak(utterance)
}
