'use client'

import { useState } from 'react'
import { speak } from '@/lib/speech'
import { useUserStore } from '@/store/userStore'
import { Star, ChevronLeft } from 'lucide-react'

type Difficulty = 'easy' | 'medium' | 'hard'

const diffConfig = {
  easy: { label: '🟢 Easy', range: [1, 5], color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
  medium: { label: '🟡 Medium', range: [6, 9], color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  hard: { label: '🔴 Hard', range: [10, 12], color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
}

function generateDivisionQuestions(divisor: number, count = 10) {
  const multipliers = Array.from({ length: 12 }, (_, i) => i + 1).sort(() => Math.random() - 0.5).slice(0, count)
  return multipliers.map(b => ({ dividend: divisor * b, divisor, answer: b }))
}

export default function DivisionPage() {
  const [mode, setMode] = useState<'select' | 'practice'>('select')
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [questions, setQuestions] = useState<{ dividend: number; divisor: number; answer: number }[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [options, setOptions] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const addSticker = useUserStore(s => s.addSticker)

  const startPractice = (divisor: number) => {
    const qs = generateDivisionQuestions(divisor)
    setQuestions(qs)
    setCurrentQ(0)
    setScore(0)
    setFinished(false)
    setSelected(null)
    makeOptions(qs[0].answer)
    setMode('practice')
  }

  const makeOptions = (answer: number) => {
    const wrong = new Set<number>()
    while (wrong.size < 3) {
      const w = Math.max(1, answer + Math.floor(Math.random() * 7) - 3)
      if (w !== answer) wrong.add(w)
    }
    setOptions([...Array.from(wrong), answer].sort(() => Math.random() - 0.5))
  }

  const handleAnswer = (ans: number) => {
    if (selected !== null) return
    setSelected(ans)
    const q = questions[currentQ]
    const correct = ans === q.answer
    speak(correct ? `Correct! ${q.dividend} divided by ${q.divisor} equals ${q.answer}` : `Not quite. ${q.dividend} divided by ${q.divisor} equals ${q.answer}`)
    if (correct) setScore(s => s + 1)
    setTimeout(() => {
      if (currentQ + 1 >= questions.length) { setFinished(true); addSticker() }
      else {
        const next = currentQ + 1
        setCurrentQ(next)
        setSelected(null)
        makeOptions(questions[next].answer)
      }
    }, 1800)
  }

  if (mode === 'select' || difficulty === null) {
    return (
      <div className="pb-20 lg:pb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">➗ Division</h1>
        <p className="text-slate-500 text-sm mb-8">Choose your difficulty level to start practising division.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {(Object.entries(diffConfig) as [Difficulty, typeof diffConfig.easy][]).map(([key, cfg]) => (
            <button key={key} onClick={() => setDifficulty(key)}
              className={`${cfg.bg} rounded-3xl p-6 text-center hover:scale-105 transition-all`}>
              <div className="text-4xl mb-3">{key === 'easy' ? '🌱' : key === 'medium' ? '⚡' : '🔥'}</div>
              <div className={`font-extrabold text-xl ${cfg.text}`}>{cfg.label}</div>
              <div className="text-slate-500 text-sm mt-1">Divisors {cfg.range[0]}–{cfg.range[1]}</div>
            </button>
          ))}
        </div>

        {difficulty && (
          <>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Choose a divisor to practise:</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: diffConfig[difficulty].range[1] - diffConfig[difficulty].range[0] + 1 }, (_, i) => i + diffConfig[difficulty].range[0]).map(d => (
                <button key={d} onClick={() => startPractice(d)}
                  className={`${diffConfig[difficulty].bg} ${diffConfig[difficulty].text} rounded-2xl p-4 font-extrabold text-2xl hover:scale-105 transition-all border-2 border-transparent hover:border-current`}>
                  ÷{d}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center pb-20">
        <div className="text-8xl mb-4">🎉</div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Fantastic!</h2>
        <p className="text-slate-500 mb-4">Score: <span className="font-extrabold text-[#00A2E8]">{score}/{questions.length}</span></p>
        <div className="flex items-center gap-2 bg-yellow-50 rounded-2xl px-6 py-3 mb-8 border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-500" size={24} /> <span className="font-bold text-yellow-700">+1 Sticker earned!</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => startPractice(questions[0].divisor)} className="bg-[#00A2E8] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#0077B6]">Try Again</button>
          <button onClick={() => { setMode('select'); setFinished(false) }} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-bold">Back</button>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]
  const cfg = diffConfig[difficulty]
  return (
    <div className="pb-20 lg:pb-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setMode('select')} className="p-2 rounded-full hover:bg-slate-100"><ChevronLeft size={24} /></button>
        <div className="flex-1 bg-slate-200 rounded-full h-3">
          <div className="h-3 bg-[#00A2E8] rounded-full transition-all" style={{ width: `${(currentQ / questions.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-slate-500">{currentQ + 1}/{questions.length}</span>
      </div>

      <div className={`${cfg.bg} rounded-3xl p-8 text-center mb-8`}>
        <p className="text-slate-500 mb-2 font-semibold">What is...</p>
        <button onClick={() => speak(`${q.dividend} divided by ${q.divisor}`)}
          className="text-5xl font-extrabold text-slate-900 hover:text-[#00A2E8] transition-colors">
          {q.dividend} ÷ {q.divisor} = <span className="text-[#00A2E8]">?</span>
        </button>
        <p className="text-slate-400 text-sm mt-3">🔊 Tap the question to hear it</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map(opt => {
          let cls = 'bg-white border-2 border-slate-200 text-slate-800 hover:border-[#00A2E8] hover:bg-blue-50'
          if (selected !== null) {
            if (opt === q.answer) cls = 'bg-green-500 border-green-500 text-white'
            else if (opt === selected) cls = 'bg-red-400 border-red-400 text-white'
            else cls = 'bg-white border-2 border-slate-100 text-slate-400 opacity-50'
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)} className={`${cls} rounded-2xl py-5 text-3xl font-extrabold transition-all`}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
