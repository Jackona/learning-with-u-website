'use client'

import { useState } from 'react'
import { speak } from '@/lib/speech'
import { useUserStore } from '@/store/userStore'
import { Star } from 'lucide-react'

const colours = [
  { name: 'Red', hex: '#ef4444', emoji: '🍎', hint: 'Like an apple or a fire engine' },
  { name: 'Blue', hex: '#3b82f6', emoji: '🌊', hint: 'Like the sea or the sky' },
  { name: 'Yellow', hex: '#eab308', emoji: '🌻', hint: 'Like the sun or a banana' },
  { name: 'Green', hex: '#22c55e', emoji: '🍃', hint: 'Like grass or leaves' },
  { name: 'Orange', hex: '#f97316', emoji: '🍊', hint: 'Like an orange fruit' },
  { name: 'Purple', hex: '#a855f7', emoji: '🍇', hint: 'Like grapes or lavender' },
  { name: 'Pink', hex: '#ec4899', emoji: '🌸', hint: 'Like flamingos or cherry blossom' },
  { name: 'Brown', hex: '#92400e', emoji: '🍫', hint: 'Like chocolate or wood' },
  { name: 'Black', hex: '#171717', emoji: '🌑', hint: 'Like the night sky' },
  { name: 'White', hex: '#f8fafc', emoji: '☁️', hint: 'Like clouds or snow' },
  { name: 'Grey', hex: '#6b7280', emoji: '🐘', hint: 'Like an elephant' },
  { name: 'Gold', hex: '#ca8a04', emoji: '⭐', hint: 'Like a shiny star or trophy' },
]

type Phase = 'learn' | 'spell' | 'done'

export default function ColoursPage() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('learn')
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [letterTiles, setLetterTiles] = useState<string[]>([])
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [mastered, setMastered] = useState<string[]>([])
  const addSticker = useUserStore(s => s.addSticker)

  const colour = colours[currentIdx]

  const startSpelling = () => {
    const shuffled = colour.name.toUpperCase().split('').sort(() => Math.random() - 0.5)
    const extras = 'BCDFGHJKLM'.split('').sort(() => Math.random() - 0.5).slice(0, 2)
    setLetterTiles([...shuffled, ...extras].sort(() => Math.random() - 0.5))
    setSelectedLetters([])
    setResult(null)
    setPhase('spell')
  }

  const addLetter = (letter: string, i: number) => {
    setSelectedLetters(prev => [...prev, letter])
    setLetterTiles(prev => prev.filter((_, idx) => idx !== i))
    speak(letter)
  }

  const removeLast = () => {
    const last = selectedLetters[selectedLetters.length - 1]
    setSelectedLetters(prev => prev.slice(0, -1))
    setLetterTiles(prev => [...prev, last])
  }

  const checkSpelling = () => {
    if (selectedLetters.join('') === colour.name.toUpperCase()) {
      setResult('correct')
      setMastered(prev => [...prev, colour.name])
      addSticker()
      speak(`Amazing! You spelled ${colour.name}!`)
      setTimeout(() => {
        if (currentIdx + 1 < colours.length) {
          setCurrentIdx(i => i + 1)
          setPhase('learn')
        } else {
          setPhase('done')
        }
        setResult(null)
      }, 2000)
    } else {
      setResult('wrong')
      speak('Not quite! Try again.')
      setTimeout(() => setResult(null), 1500)
    }
  }

  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center pb-20">
        <div className="text-8xl mb-4">🌈</div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">You know all the colours!</h2>
        <p className="text-slate-500 mb-6">You mastered {mastered.length} colours!</p>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {mastered.map(m => {
            const c = colours.find(c => c.name === m)!
            return <span key={m} className="px-4 py-2 rounded-full text-white font-bold text-sm" style={{ backgroundColor: c.hex }}>{m}</span>
          })}
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 rounded-2xl px-6 py-3 mb-6 border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-500" size={24} />
          <span className="font-bold text-yellow-700">+{mastered.length} Stickers earned!</span>
        </div>
        <button onClick={() => { setCurrentIdx(0); setPhase('learn'); setMastered([]) }}
          className="bg-[#00A2E8] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#0077B6] transition-colors">
          Start Again 🔄
        </button>
      </div>
    )
  }

  return (
    <div className="pb-20 lg:pb-8 max-w-lg mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">🌈 Colours</h1>
          <p className="text-slate-500 text-sm">Learn and spell the colours!</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-500">{currentIdx + 1} / {colours.length}</p>
          <div className="flex gap-1 mt-1">
            {colours.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < mastered.length ? 'bg-green-400' : i === currentIdx ? 'bg-[#00A2E8]' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Colour display */}
      <div
        className="rounded-3xl w-full h-48 flex flex-col items-center justify-center mb-6 shadow-xl cursor-pointer transition-all hover:scale-[1.02]"
        style={{ backgroundColor: colour.hex }}
        onClick={() => speak(colour.name)}
      >
        <span className="text-6xl mb-2">{colour.emoji}</span>
        <p className="text-white font-extrabold text-3xl drop-shadow-lg">{colour.name}</p>
        <p className="text-white/80 text-sm mt-1">🔊 Tap to hear</p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-slate-100 p-4 mb-6 text-center">
        <p className="text-slate-500 text-sm">{colour.hint}</p>
      </div>

      {phase === 'learn' && (
        <div className="flex flex-col gap-3">
          <button onClick={() => speak(colour.name)} className="w-full bg-[#00A2E8] text-white rounded-2xl py-4 font-bold text-lg hover:bg-[#0077B6] transition-colors">
            🔊 Hear &ldquo;{colour.name}&rdquo;
          </button>
          <button onClick={startSpelling} className="w-full bg-[#FFED00] text-[#0077B6] rounded-2xl py-4 font-bold text-lg hover:bg-yellow-300 transition-colors">
            Spell it! 🔤
          </button>
        </div>
      )}

      {phase === 'spell' && (
        <div>
          <p className="font-bold text-slate-700 mb-3 text-center">Spell <span style={{ color: colour.hex }}>{colour.name}</span>:</p>

          {/* Answer box */}
          <div className="min-h-[60px] bg-slate-50 border-2 border-slate-200 rounded-2xl flex gap-2 items-center justify-center px-4 mb-4 flex-wrap">
            {selectedLetters.length === 0 && <span className="text-slate-400 text-sm">Tap letters below...</span>}
            {selectedLetters.map((l, i) => (
              <span key={i} className="w-10 h-10 rounded-xl font-extrabold text-xl flex items-center justify-center text-white" style={{ backgroundColor: colour.hex }}>{l}</span>
            ))}
          </div>

          {/* Letter tiles */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {letterTiles.map((l, i) => (
              <button key={i} onClick={() => addLetter(l, i)}
                className="w-12 h-12 bg-slate-100 hover:scale-110 transition-all rounded-2xl font-extrabold text-lg"
                style={{ ['--hover-bg' as string]: colour.hex }}>
                {l}
              </button>
            ))}
          </div>

          {result === 'wrong' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-center text-red-600 font-semibold text-sm mb-3">Not quite! 💪</div>
          )}
          {result === 'correct' && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3 text-center text-green-600 font-semibold text-sm mb-3">🎉 Brilliant!</div>
          )}

          <div className="flex gap-3">
            <button onClick={removeLast} disabled={selectedLetters.length === 0}
              className="bg-slate-200 text-slate-700 rounded-2xl px-4 py-3 font-bold hover:bg-slate-300 transition-colors disabled:opacity-40">⌫</button>
            <button onClick={checkSpelling} disabled={selectedLetters.length === 0}
              className="flex-1 text-white rounded-2xl py-3 font-bold transition-colors disabled:opacity-50"
              style={{ backgroundColor: colour.hex }}>
              Check ✓
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
