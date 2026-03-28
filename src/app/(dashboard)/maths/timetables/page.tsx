'use client'

import { useState, useEffect } from 'react'
import { speak } from '@/lib/speech'
import { useUserStore } from '@/store/userStore'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

type Difficulty = 'easy' | 'medium' | 'hard'

const difficultyConfig = {
  easy: { label: '🟢 Easy', range: [1, 5], color: 'bg-green-500', textColor: 'text-green-700', bg: 'bg-green-50' },
  medium: { label: '🟡 Medium', range: [6, 9], color: 'bg-amber-500', textColor: 'text-amber-700', bg: 'bg-amber-50' },
  hard: { label: '🔴 Hard', range: [10, 12], color: 'bg-red-500', textColor: 'text-red-700', bg: 'bg-red-50' },
}

function generateDailyQuestions(table: number, count = 10) {
  const questions = []
  const multipliers = Array.from({ length: 12 }, (_, i) => i + 1)
  const shuffled = multipliers.sort(() => Math.random() - 0.5).slice(0, count)
  for (const b of shuffled) {
    questions.push({ a: table, b, answer: table * b })
  }
  return questions
}

export default function TimetablesPage() {
  const [mode, setMode] = useState<'select' | 'view' | 'practice'>('select')
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [questions, setQuestions] = useState<{ a: number; b: number; answer: number }[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [options, setOptions] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const addSticker = useUserStore(s => s.addSticker)

  const startPractice = (table: number) => {
    const qs = generateDailyQuestions(table)
    setQuestions(qs)
    setCurrentQ(0)
    setScore(0)
    setFinished(false)
    setSelected(null)
    makeOptions(qs[0].answer, table)
    setMode('practice')
  }

  const makeOptions = (answer: number, table: number) => {
    const wrong = new Set<number>()
    while (wrong.size < 3) {
      const w = Math.max(1, answer + (Math.floor(Math.random() * 11) - 5) * table)
      if (w !== answer) wrong.add(w)
    }
    const opts = [...Array.from(wrong), answer].sort(() => Math.random() - 0.5)
    setOptions(opts)
  }

  const handleAnswer = (ans: number) => {
    if (selected !== null) return
    setSelected(ans)
    const q = questions[currentQ]
    const correct = ans === q.answer
    speak(correct ? `Correct! ${q.a} times ${q.b} equals ${q.answer}` : `Not quite. ${q.a} times ${q.b} equals ${q.answer}`)
    if (correct) setScore(s => s + 1)
    setTimeout(() => {
      if (currentQ + 1 >= questions.length) {
        setFinished(true)
        addSticker()
      } else {
        const next = currentQ + 1
        setCurrentQ(next)
        setSelected(null)
        makeOptions(questions[next].answer, questions[next].a)
      }
    }, 1800)
  }

  const speakTable = (a: number, b: number) => speak(`${a} times ${b} equals ${a * b}`)

  if (mode === 'select' || difficulty === null) {
    return (
      <div className="pb-20 lg:pb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">✖️ Times Tables</h1>
        <p className="text-slate-500 text-sm mb-8">Choose your difficulty level to get started.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {(Object.entries(difficultyConfig) as [Difficulty, typeof difficultyConfig.easy][]).map(([key, cfg]) => (
            <button key={key} onClick={() => { setDifficulty(key); setMode('view') }}
              className={`${cfg.bg} border-2 ${difficulty === key ? 'border-current' : 'border-transparent'} rounded-3xl p-6 text-center hover:scale-105 transition-all`}>
              <div className="text-4xl mb-3">{key === 'easy' ? '🌱' : key === 'medium' ? '⚡' : '🔥'}</div>
              <div className={`font-extrabold text-xl ${cfg.textColor}`}>{cfg.label}</div>
              <div className="text-slate-500 text-sm mt-1">Tables {cfg.range[0]}–{cfg.range[1]}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const cfg = difficultyConfig[difficulty]
  const tables = Array.from({ length: cfg.range[1] - cfg.range[0] + 1 }, (_, i) => i + cfg.range[0])

  if (mode === 'view') {
    return (
      <div className="pb-20 lg:pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { setMode('select'); setDifficulty(null) }} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900">✖️ {cfg.label} Times Tables</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map(t => (
            <div key={t} className={`${cfg.bg} rounded-3xl p-4 border-2 border-transparent`}>
              <div className={`font-extrabold text-lg ${cfg.textColor} mb-3 flex items-center justify-between`}>
                <span>{t} times table</span>
                <button onClick={() => startPractice(t)} className={`${cfg.color} text-white text-xs px-3 py-1 rounded-full font-bold hover:opacity-90 transition-opacity`}>
                  Practice
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(b => (
                  <button key={b} onClick={() => speakTable(t, b)}
                    className="text-left text-sm font-medium text-slate-700 hover:text-[#00A2E8] hover:bg-white/80 rounded-lg px-2 py-1 transition-all flex items-center gap-2">
                    <span className="text-slate-400 text-xs w-4">{b}.</span>
                    <span className="font-bold">{t}</span>
                    <span className="text-slate-500">× {b} =</span>
                    <span className="text-[#0077B6] font-extrabold">{t * b}</span>
                    <span className="text-xs">🔊</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Practice mode
  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center pb-20">
        <div className="text-8xl mb-4">🎉</div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Well done!</h2>
        <p className="text-slate-500 mb-4">You scored <span className="font-extrabold text-[#00A2E8]">{score}/{questions.length}</span></p>
        <div className="flex items-center gap-2 bg-yellow-50 rounded-2xl px-6 py-3 mb-8 border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-500" size={24} /> <span className="font-bold text-yellow-700">+1 Sticker earned!</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => startPractice(selectedTable!)} className="bg-[#00A2E8] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#0077B6] transition-colors">
            Try Again
          </button>
          <button onClick={() => { setMode('view'); setFinished(false) }} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-colors">
            Back to Tables
          </button>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]
  return (
    <div className="pb-20 lg:pb-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setMode('view')} className="p-2 rounded-full hover:bg-slate-100">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 bg-slate-200 rounded-full h-3">
          <div className="h-3 bg-[#00A2E8] rounded-full transition-all" style={{ width: `${(currentQ / questions.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-slate-500">{currentQ + 1}/{questions.length}</span>
      </div>

      <div className={`${cfg.bg} rounded-3xl p-8 text-center mb-8 border-2 border-transparent`}>
        <p className="text-slate-500 mb-2 font-semibold">What is...</p>
        <button onClick={() => speak(`${q.a} times ${q.b}`)} className="text-5xl font-extrabold text-slate-900 hover:text-[#00A2E8] transition-colors">
          {q.a} × {q.b} = <span className="text-[#00A2E8]">?</span>
        </button>
        <p className="text-slate-400 text-sm mt-3">🔊 Tap the question to hear it</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map(opt => {
          let btnClass = 'bg-white border-2 border-slate-200 text-slate-800 hover:border-[#00A2E8] hover:bg-blue-50'
          if (selected !== null) {
            if (opt === q.answer) btnClass = 'bg-green-500 border-green-500 text-white'
            else if (opt === selected && opt !== q.answer) btnClass = 'bg-red-400 border-red-400 text-white'
            else btnClass = 'bg-white border-2 border-slate-200 text-slate-400 opacity-50'
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)}
              className={`${btnClass} rounded-2xl py-5 text-3xl font-extrabold transition-all`}>
              {opt}
            </button>
          )
        })}
      </div>
      <p className="text-center text-xs text-slate-400 mt-4">Score: {score}/{currentQ}</p>
    </div>
  )
}
