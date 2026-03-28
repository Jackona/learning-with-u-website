'use client'

import { useState } from 'react'
import { speak } from '@/lib/speech'
import { useUserStore } from '@/store/userStore'
import { Star, ChevronLeft } from 'lucide-react'

type OpType = 'add' | 'subtract'
type Difficulty = 'easy' | 'medium' | 'hard'

const diffConfig = {
  easy: { label: '🟢 Easy', max: 20, bg: 'bg-green-50', text: 'text-green-700', color: 'bg-green-500' },
  medium: { label: '🟡 Medium', max: 100, bg: 'bg-amber-50', text: 'text-amber-700', color: 'bg-amber-500' },
  hard: { label: '🔴 Hard', max: 1000, bg: 'bg-red-50', text: 'text-red-700', color: 'bg-red-500' },
}

function generateQuestions(op: OpType, difficulty: Difficulty, count = 10) {
  const max = diffConfig[difficulty].max
  return Array.from({ length: count }, () => {
    const a = Math.floor(Math.random() * max) + 1
    const b = op === 'subtract'
      ? Math.floor(Math.random() * a) + 1
      : Math.floor(Math.random() * max) + 1
    return { a, b, op, answer: op === 'add' ? a + b : a - b }
  })
}

export default function AddSubtractPage() {
  const [mode, setMode] = useState<'select' | 'practice'>('select')
  const [op, setOp] = useState<OpType>('add')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [questions, setQuestions] = useState<{ a: number; b: number; op: string; answer: number }[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [options, setOptions] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const addSticker = useUserStore(s => s.addSticker)

  const startPractice = () => {
    const qs = generateQuestions(op, difficulty)
    setQuestions(qs)
    setCurrentQ(0)
    setScore(0)
    setFinished(false)
    setSelected(null)
    makeOptions(qs[0].answer, difficulty)
    setMode('practice')
  }

  const makeOptions = (answer: number, diff: Difficulty) => {
    const spread = diffConfig[diff].max / 10
    const wrong = new Set<number>()
    while (wrong.size < 3) {
      const w = Math.max(0, answer + Math.round((Math.random() - 0.5) * spread * 2))
      if (w !== answer) wrong.add(w)
    }
    setOptions([...Array.from(wrong), answer].sort(() => Math.random() - 0.5))
  }

  const handleAnswer = (ans: number) => {
    if (selected !== null) return
    setSelected(ans)
    const q = questions[currentQ]
    const correct = ans === q.answer
    const opWord = q.op === 'add' ? 'plus' : 'minus'
    speak(correct ? `Correct! ${q.a} ${opWord} ${q.b} equals ${q.answer}` : `Not quite. ${q.a} ${opWord} ${q.b} equals ${q.answer}`)
    if (correct) setScore(s => s + 1)
    setTimeout(() => {
      if (currentQ + 1 >= questions.length) { setFinished(true); addSticker() }
      else {
        const next = currentQ + 1
        setCurrentQ(next)
        setSelected(null)
        makeOptions(questions[next].answer, difficulty)
      }
    }, 1800)
  }

  if (mode === 'select') {
    return (
      <div className="pb-20 lg:pb-8 max-w-xl">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">➕ Add & Subtract</h1>
        <p className="text-slate-500 text-sm mb-8">Choose what you want to practise today.</p>

        <div className="mb-8">
          <h2 className="font-bold text-slate-700 mb-3">Operation</h2>
          <div className="grid grid-cols-2 gap-3">
            {([['add', '➕ Addition', 'bg-blue-50 border-blue-200'], ['subtract', '➖ Subtraction', 'bg-purple-50 border-purple-200']] as const).map(([val, label, cls]) => (
              <button key={val} onClick={() => setOp(val)}
                className={`${cls} border-2 rounded-2xl p-5 font-bold text-lg transition-all
                  ${op === val ? 'border-[#00A2E8] bg-[#00A2E8] text-white' : 'text-slate-700 hover:border-[#00A2E8]'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-bold text-slate-700 mb-3">Difficulty</h2>
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(diffConfig) as [Difficulty, typeof diffConfig.easy][]).map(([key, cfg]) => (
              <button key={key} onClick={() => setDifficulty(key)}
                className={`${cfg.bg} rounded-2xl p-4 text-center font-bold transition-all border-2
                  ${difficulty === key ? 'border-slate-400' : 'border-transparent hover:border-slate-200'}`}>
                <div className="text-2xl mb-1">{key === 'easy' ? '🌱' : key === 'medium' ? '⚡' : '🔥'}</div>
                <div className={cfg.text}>{cfg.label}</div>
                <div className="text-slate-400 text-xs">Up to {cfg.max}</div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={startPractice}
          className="w-full bg-[#00A2E8] text-white rounded-2xl py-4 font-extrabold text-lg hover:bg-[#0077B6] transition-colors shadow-lg">
          Start Practice! 🚀
        </button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center pb-20">
        <div className="text-8xl mb-4">🎉</div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Amazing work!</h2>
        <p className="text-slate-500 mb-4">Score: <span className="font-extrabold text-[#00A2E8]">{score}/{questions.length}</span></p>
        <div className="flex items-center gap-2 bg-yellow-50 rounded-2xl px-6 py-3 mb-8 border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-500" size={24} /> <span className="font-bold text-yellow-700">+1 Sticker earned!</span>
        </div>
        <div className="flex gap-3">
          <button onClick={startPractice} className="bg-[#00A2E8] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#0077B6]">Try Again</button>
          <button onClick={() => { setMode('select'); setFinished(false) }} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-bold">Back</button>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]
  const cfg = diffConfig[difficulty]
  const opSymbol = op === 'add' ? '+' : '−'

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
        <button onClick={() => speak(`${q.a} ${op === 'add' ? 'plus' : 'minus'} ${q.b}`)}
          className="text-5xl font-extrabold text-slate-900 hover:text-[#00A2E8] transition-colors">
          {q.a} {opSymbol} {q.b} = <span className="text-[#00A2E8]">?</span>
        </button>
        <p className="text-slate-400 text-sm mt-3">🔊 Tap to hear</p>
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
