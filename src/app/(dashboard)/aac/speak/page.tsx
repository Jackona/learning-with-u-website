'use client'

import { useState, useEffect, useRef } from 'react'
import { speak, stopSpeech } from '@/lib/speech'
import { Volume2, VolumeX, Play, Square, Trash2 } from 'lucide-react'

const quickPhrases = [
  { label: "I need help", emoji: '🆘' },
  { label: "I am finished", emoji: '✅' },
  { label: "Can I go to the toilet?", emoji: '🚽' },
  { label: "I don't understand", emoji: '🤔' },
  { label: "I am hungry", emoji: '🍽️' },
  { label: "I am tired", emoji: '😴' },
  { label: "I feel sick", emoji: '🤢' },
  { label: "It's too loud", emoji: '🔊' },
  { label: "I need a break", emoji: '⏸️' },
  { label: "Thank you", emoji: '🙏' },
]

export default function TextToSpeechPage() {
  const [text, setText] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [volume, setVolume] = useState(1.0)
  const [rate, setRate] = useState(0.9)
  const [pitch, setPitch] = useState(1.0)
  const [recentPhrases, setRecentPhrases] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('lwu-recent-phrases')
    if (saved) setRecentPhrases(JSON.parse(saved))
  }, [])

  const handleSpeak = () => {
    if (!text.trim()) return
    setSpeaking(true)
    speak(text, { volume, rate, pitch })
    // Save to recent
    const updated = [text, ...recentPhrases.filter(p => p !== text)].slice(0, 10)
    setRecentPhrases(updated)
    localStorage.setItem('lwu-recent-phrases', JSON.stringify(updated))
    setTimeout(() => setSpeaking(false), text.length * 80)
  }

  const handleStop = () => {
    stopSpeech()
    setSpeaking(false)
  }

  const usePhrase = (phrase: string) => {
    setText(phrase)
    textareaRef.current?.focus()
  }

  return (
    <div className="pb-20 lg:pb-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">🔊 Text to Speech</h1>
        <p className="text-slate-500 text-sm">Type anything below and tap Speak to hear it in UK English.</p>
      </div>

      {/* Main textarea */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden mb-6 shadow-sm focus-within:border-[#00A2E8] transition-colors">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type what you want to say here..."
          rows={5}
          className="w-full p-6 text-xl text-slate-800 resize-none focus:outline-none leading-relaxed"
        />
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
          <span className="text-xs text-slate-400">{text.length} characters</span>
          {text && (
            <button onClick={() => setText('')} className="text-slate-400 hover:text-red-500 transition-colors" aria-label="Clear text">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Speak / Stop buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={speaking ? handleStop : handleSpeak}
          disabled={!text.trim()}
          className={`flex-1 flex items-center justify-center gap-3 rounded-2xl py-4 font-extrabold text-xl transition-all disabled:opacity-50
            ${speaking
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-[#00A2E8] hover:bg-[#0077B6] text-white hover:scale-105 shadow-lg'
            }`}
        >
          {speaking ? <><Square size={24} /> Stop</> : <><Play size={24} /> Speak</>}
          {speaking && <span className="text-sm animate-pulse ml-1">🔊</span>}
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 p-6 mb-8 shadow-sm">
        <h2 className="font-bold text-slate-800 mb-5">Voice Settings</h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 w-28 text-sm font-semibold text-slate-600">
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              Volume
            </div>
            <input type="range" min={0} max={1} step={0.1} value={volume} onChange={e => setVolume(Number(e.target.value))}
              className="flex-1 accent-[#00A2E8]" />
            <span className="text-sm text-slate-500 w-10 text-right">{Math.round(volume * 100)}%</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-28 text-sm font-semibold text-slate-600">🐢 Speed</div>
            <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))}
              className="flex-1 accent-[#00A2E8]" />
            <span className="text-sm text-slate-500 w-10 text-right">{rate}x</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-28 text-sm font-semibold text-slate-600">🎵 Pitch</div>
            <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={e => setPitch(Number(e.target.value))}
              className="flex-1 accent-[#00A2E8]" />
            <span className="text-sm text-slate-500 w-10 text-right">{pitch}</span>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => { setRate(0.9); setPitch(1.0); setVolume(1.0) }}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-full font-semibold transition-colors">
              Reset defaults
            </button>
          </div>
        </div>
      </div>

      {/* Quick phrases */}
      <div className="mb-8">
        <h2 className="font-bold text-slate-800 mb-3">Quick Phrases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickPhrases.map(p => (
            <button key={p.label} onClick={() => usePhrase(p.label)}
              className="flex items-center gap-3 bg-white border-2 border-slate-100 hover:border-[#00A2E8] rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:text-[#0077B6] transition-all text-left">
              <span>{p.emoji}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent phrases */}
      {recentPhrases.length > 0 && (
        <div>
          <h2 className="font-bold text-slate-800 mb-3">Recent</h2>
          <div className="flex flex-col gap-2">
            {recentPhrases.map((p, i) => (
              <button key={i} onClick={() => usePhrase(p)}
                className="text-left bg-slate-50 hover:bg-blue-50 border-2 border-transparent hover:border-[#00A2E8] rounded-2xl px-4 py-3 text-sm text-slate-600 transition-all">
                &ldquo;{p}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
