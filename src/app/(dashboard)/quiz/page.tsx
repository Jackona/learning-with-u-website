'use client'

import { useState } from 'react'
import { speak } from '@/lib/speech'
import { useUserStore } from '@/store/userStore'
import { Star, ChevronLeft, Volume2 } from 'lucide-react'

const weeklyQuiz = [
  // Maths
  { id: 1, section: '🔢 Maths', question: 'What is 6 × 7?', options: ['36', '42', '48', '54'], answer: '42', audio: 'Six times seven' },
  { id: 2, section: '🔢 Maths', question: 'What is 48 ÷ 6?', options: ['6', '7', '8', '9'], answer: '8', audio: 'Forty-eight divided by six' },
  { id: 3, section: '🔢 Maths', question: 'What is 25 + 37?', options: ['52', '61', '62', '72'], answer: '62', audio: 'Twenty-five plus thirty-seven' },
  { id: 4, section: '🔢 Maths', question: 'What is 100 − 34?', options: ['54', '56', '64', '66'], answer: '66', audio: 'One hundred minus thirty-four' },
  { id: 5, section: '🔢 Maths', question: 'What is 9 × 9?', options: ['72', '81', '90', '99'], answer: '81', audio: 'Nine times nine' },
  // English
  { id: 6, section: '📖 English', question: 'Which word is spelled correctly?', options: ['freind', 'frend', 'friend', 'frind'], answer: 'friend', audio: 'Which word is spelled correctly?' },
  { id: 7, section: '📖 English', question: 'What does "happy" mean?', options: ['Sad', 'Tired', 'Joyful', 'Angry'], answer: 'Joyful', audio: 'What does happy mean?' },
  { id: 8, section: '📖 English', question: 'Which sentence is correct?', options: ['the dog run fast.', 'The dog run fast.', 'The dog runs fast.', 'The dog runs fast'], answer: 'The dog runs fast.', audio: 'Which sentence is correct?' },
  { id: 9, section: '📖 English', question: 'What is the opposite of "big"?', options: ['Large', 'Huge', 'Small', 'Tall'], answer: 'Small', audio: 'What is the opposite of big?' },
  { id: 10, section: '📖 English', question: 'How many letters are in "school"?', options: ['4', '5', '6', '7'], answer: '6', audio: 'How many letters are in the word school?' },
  // AAC & Life Skills
  { id: 11, section: '💬 AAC', question: 'Which symbol means "I need help"?', options: ['🚽', '🆘', '✅', '😊'], answer: '🆘', audio: 'Which symbol means I need help?' },
  { id: 12, section: '🌈 Colours', question: 'What colour is an apple?', options: ['Blue', 'Yellow', 'Red', 'Green'], answer: 'Red', audio: 'What colour is an apple?' },
  { id: 13, section: '🌈 Colours', question: 'What colour is the sky on a sunny day?', options: ['Grey', 'Blue', 'White', 'Yellow'], answer: 'Blue', audio: 'What colour is the sky on a sunny day?' },
]

export default function QuizPage() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState<typeof weeklyQuiz>([])
  const addSticker = useUserStore(s => s.addSticker)

  const q = weeklyQuiz[currentQ]

  const handleAnswer = (answer: string) => {
    if (selected !== null) return
    setSelected(answer)
    const correct = answer === q.answer
    speak(correct ? `Correct! ${q.answer}` : `Not quite! The answer is ${q.answer}`)
    if (correct) setScore(s => s + 1)
    else setWrongAnswers(prev => [...prev, q])
    setTimeout(() => {
      if (currentQ + 1 >= weeklyQuiz.length) {
        setFinished(true)
        addSticker()
      } else {
        setCurrentQ(n => n + 1)
        setSelected(null)
      }
    }, 1800)
  }

  const reset = () => {
    setStarted(false)
    setCurrentQ(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setWrongAnswers([])
  }

  if (!started) {
    return (
      <div className="pb-20 lg:pb-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">❓ Weekly Quiz</h1>
        <p className="text-slate-500 text-sm mb-8">Test everything you&apos;ve learned this week!</p>

        <div className="bg-gradient-to-br from-[#00A2E8]/10 to-blue-50 rounded-3xl p-8 text-center border-2 border-blue-100 mb-6">
          <div className="text-7xl mb-4">🏆</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">This Week&apos;s Quiz</h2>
          <p className="text-slate-500 mb-6">{weeklyQuiz.length} questions across Maths, English, AAC & Colours</p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {['🔢 Maths', '📖 English', '💬 AAC', '🌈 Colours'].map(s => (
              <span key={s} className="bg-white border-2 border-slate-200 px-4 py-2 rounded-full text-sm font-semibold">{s}</span>
            ))}
          </div>
          <button onClick={() => setStarted(true)}
            className="bg-[#00A2E8] text-white px-10 py-4 rounded-full font-extrabold text-xl hover:bg-[#0077B6] transition-all hover:scale-105 shadow-xl">
            Start Quiz! 🚀
          </button>
        </div>
      </div>
    )
  }

  if (finished) {
    const percentage = Math.round((score / weeklyQuiz.length) * 100)
    const emoji = percentage >= 80 ? '🌟' : percentage >= 60 ? '🎉' : '💪'
    const message = percentage >= 80 ? 'Outstanding!' : percentage >= 60 ? 'Well done!' : 'Keep practising!'

    return (
      <div className="pb-20 lg:pb-8 max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">{emoji}</div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{message}</h2>
          <p className="text-xl text-slate-600">You scored <span className="text-[#00A2E8] font-extrabold">{score}/{weeklyQuiz.length}</span></p>
          <div className="w-full bg-slate-200 rounded-full h-4 mt-4 mb-2">
            <div className="h-4 bg-[#00A2E8] rounded-full transition-all" style={{ width: `${percentage}%` }} />
          </div>
          <p className="text-slate-400 text-sm">{percentage}%</p>
        </div>

        <div className="flex items-center justify-center gap-2 bg-yellow-50 rounded-2xl px-6 py-4 mb-8 border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-500" size={24} />
          <span className="font-bold text-yellow-700">+1 Sticker earned!</span>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-slate-700 mb-3">Review your answers:</h3>
            <div className="flex flex-col gap-3">
              {wrongAnswers.map(q => (
                <div key={q.id} className="bg-red-50 border-2 border-red-100 rounded-2xl p-4">
                  <p className="font-semibold text-slate-800 text-sm mb-1">{q.question}</p>
                  <p className="text-green-600 text-sm font-bold">✓ Answer: {q.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={reset} className="w-full bg-[#00A2E8] text-white rounded-2xl py-4 font-bold text-lg hover:bg-[#0077B6] transition-colors">
          Try Again 🔄
        </button>
      </div>
    )
  }

  return (
    <div className="pb-20 lg:pb-8 max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={reset} className="p-2 rounded-full hover:bg-slate-100"><ChevronLeft size={24} /></button>
        <div className="flex-1 bg-slate-200 rounded-full h-3">
          <div className="h-3 bg-[#00A2E8] rounded-full transition-all" style={{ width: `${(currentQ / weeklyQuiz.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-slate-500">{currentQ + 1}/{weeklyQuiz.length}</span>
      </div>

      {/* Section badge */}
      <span className="inline-block bg-slate-100 text-slate-600 font-bold px-4 py-1 rounded-full text-sm mb-4">
        {q.section}
      </span>

      {/* Question */}
      <div className="bg-gradient-to-br from-[#00A2E8]/10 to-blue-50 rounded-3xl p-6 mb-6 border-2 border-blue-100">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{q.question}</h2>
          <button onClick={() => speak(q.audio)} className="flex-shrink-0 p-2 bg-[#00A2E8] rounded-xl text-white hover:bg-[#0077B6] transition-colors">
            <Volume2 size={18} />
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map(opt => {
          let cls = 'bg-white border-2 border-slate-200 text-slate-800 hover:border-[#00A2E8] hover:bg-blue-50'
          if (selected !== null) {
            if (opt === q.answer) cls = 'bg-green-500 border-green-500 text-white'
            else if (opt === selected && opt !== q.answer) cls = 'bg-red-400 border-red-400 text-white'
            else cls = 'bg-white border-2 border-slate-100 text-slate-400 opacity-50'
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)}
              className={`${cls} rounded-2xl py-4 px-4 font-bold text-base transition-all text-center`}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
