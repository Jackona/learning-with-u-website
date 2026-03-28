'use client'

export interface SpeechOptions {
  rate?: number   // 0.5 – 2.0
  pitch?: number  // 0.5 – 2.0
  volume?: number // 0.0 – 1.0
  lang?: string
}

export function speak(text: string, options: SpeechOptions = {}): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = options.rate ?? 0.9
  utterance.pitch = options.pitch ?? 1.0
  utterance.volume = options.volume ?? 1.0
  utterance.lang = options.lang ?? 'en-GB'

  // Prefer a UK English voice if available
  const voices = window.speechSynthesis.getVoices()
  const ukVoice = voices.find(v => v.lang === 'en-GB') ?? voices.find(v => v.lang.startsWith('en'))
  if (ukVoice) utterance.voice = ukVoice

  window.speechSynthesis.speak(utterance)
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

export function getUKVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'))
}
