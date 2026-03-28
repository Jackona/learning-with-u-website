'use client'

import { useState, useEffect } from 'react'
import { speak } from '@/lib/speech'
import { useUserStore } from '@/store/userStore'
import { Star, Shuffle } from 'lucide-react'

const dailyPuzzles = [
  { type: 'word', word: 'RAIN', emoji: '🌧️', hint: 'Water falling from the sky' },
  { type: 'word', word: 'STAR', emoji: '⭐', hint: 'A bright light in the night sky' },
  { type: 'word', word: 'FROG', emoji: '🐸', hint: 'A green jumping animal' },
  { type: 'word', word: 'BOOK', emoji: '📚', hint: 'Something you read' },
  { type: 'word', word: 'CAKE', emoji: '🎂', hint: 'A sweet food for birthdays' },
  { type: 'word', word: 'FISH', emoji: '🐟', hint: 'An animal that lives in water' },
  { type: 'sentence', words: ['The', 'cat', 'sat', 'on', 'the', 'mat'], emoji: '🐱' },
  { type: 'sentence', words: ['I', 'love', 'to', 'read', 'books'], emoji: '📖' },
]

function getTodaysPuzzle() {
  const day = new Date().getDay()
  return dailyPuzzles[day % dailyPuzzles.length]
}

export default function JigsawPage() {
  const puzzle = getTodaysPuzzle()
  const addSticker = useUserStore(s => s.addSticker)

  // Word puzzle state
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([])
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [sentenceOrder, setSentenceOrder] = useState<string[]>([])
  const [remaining, setRemaining] = useState<string[]>([])
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (puzzle.type === 'word') {
      setShuffledLetters((puzzle.word as string).split('').sort(() => Math.random() - 0.5))
      setSelectedLetters([])
    } else {
      const shuffled = [...(puzzle.words as string[])].sort(() => Math.random() - 0.5)
      setRemaining(shuffled)
      setSentenceOrder([])
    }
    setResult(null)
  }, [])

  const addLetter = (letter: string, index: number) => {
    const newSelected = [...selectedLetters, letter]
    const newShuffled = shuffledLetters.filter((_, i) => i !== index)
    setSelectedLetters(newSelected)
    setShuffledLetters(newShuffled)
    speak(letter)
  }

  const removeLetter = (index: number) => {
    const letter = selectedLetters[index]
    setSelectedLetters(prev => prev.filter((_, i) => i !== index))
    setShuffledLetters(prev => [...prev, letter])
  }

  const checkWord = () => {
    const attempt = selectedLetters.join('')
    if (attempt === (puzzle.word as string)) {
      setResult('correct')
      addSticker()
      speak(`Amazing! You spelled ${puzzle.word} correctly!`)
    } else {
      setResult('wrong')
      speak('Not quite! Try rearranging the letters.')
      setTimeout(() => setResult(null), 1500)
    }
  }

  const addWord = (word: string) => {
    setSentenceOrder(prev => [...prev, word])
    setRemaining(prev => prev.filter(w => w !== word))
    speak(word)
  }

  const removeWord = (index: number) => {
    const word = sentenceOrder[index]
    setSentenceOrder(prev => prev.filter((_, i) => i !== index))
    setRemaining(prev => [...prev, word])
  }

  const checkSentence = () => {
    const attempt = sentenceOrder.join(' ')
    const correct = (puzzle.words as string[]).join(' ')
    if (attempt === correct) {
      setResult('correct')
      addSticker()
      speak(`Brilliant! ${correct}`)
    } else {
      setResult('wrong')
      speak('Not quite! Try a different order.')
      setTimeout(() => setResult(null), 1500)
    }
  }

  const reshuffle = () => {
    if (puzzle.type === 'word') {
      setShuffledLetters((puzzle.word as string).split('').sort(() => Math.random() - 0.5))
      setSelectedLetters([])
    } else {
      setRemaining([...(puzzle.words as string[])].sort(() => Math.random() - 0.5))
      setSentenceOrder([])
    }
    setResult(null)
  }

  if (result === 'correct') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center pb-20">
        <div className="text-8xl mb-4">🎉</div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Brilliant!</h2>
        <p className="text-slate-500 mb-4">You completed today&apos;s jigsaw!</p>
        <div className="flex items-center gap-2 bg-yellow-50 rounded-2xl px-6 py-3 mb-8 border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-500" size={24} />
          <span className="font-bold text-yellow-700">+1 Sticker earned!</span>
        </div>
        <button onClick={reshuffle} className="bg-[#00A2E8] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#0077B6] transition-colors">
          Try Again 🔄
        </button>
      </div>
    )
  }

  return (
    <div className="pb-20 lg:pb-8 max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">🧩 Daily Jigsaw</h1>
          <p className="text-slate-500 text-sm">Put the {puzzle.type === 'word' ? 'letters' : 'words'} in the right order!</p>
        </div>
        <button onClick={reshuffle} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
          <Shuffle size={20} className="text-slate-500" />
        </button>
      </div>

      {/* Puzzle emoji & hint */}
      <div className="bg-gradient-to-br from-[#00A2E8]/10 to-blue-50 rounded-3xl p-6 text-center mb-6 border-2 border-blue-100">
        <div className="text-7xl mb-3">{puzzle.emoji}</div>
        {puzzle.type === 'word' && (
          <div>
            <button onClick={() => setShowHint(!showHint)} className="text-sm text-[#00A2E8] font-semibold hover:underline">
              {showHint ? '🙈 Hide hint' : '💡 Show hint'}
            </button>
            {showHint && <p className="text-slate-600 mt-2 font-medium">{(puzzle as { type: string; word: string; emoji: string; hint: string }).hint}</p>}
          </div>
        )}
      </div>

      {puzzle.type === 'word' ? (
        <>
          {/* Answer box */}
          <div className="min-h-[70px] bg-white border-2 border-slate-200 rounded-2xl flex gap-2 items-center justify-center px-4 mb-4 flex-wrap">
            {selectedLetters.length === 0 && <span className="text-slate-400">Tap letters to place them here</span>}
            {selectedLetters.map((l, i) => (
              <button key={i} onClick={() => removeLetter(i)}
                className="w-12 h-12 bg-[#00A2E8] text-white rounded-2xl font-extrabold text-xl hover:bg-[#0077B6] transition-all hover:scale-105">
                {l}
              </button>
            ))}
          </div>

          {/* Shuffled letters */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {shuffledLetters.map((l, i) => (
              <button key={i} onClick={() => addLetter(l, i)}
                className="w-12 h-12 bg-yellow-100 border-2 border-yellow-300 text-yellow-800 rounded-2xl font-extrabold text-xl hover:scale-110 transition-all hover:bg-[#FFED00]">
                {l}
              </button>
            ))}
          </div>

          {result === 'wrong' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-center text-red-600 font-semibold text-sm mb-4">
              Not quite! Try again 💪
            </div>
          )}

          <button onClick={checkWord} disabled={selectedLetters.length === 0}
            className="w-full bg-[#00A2E8] text-white rounded-2xl py-4 font-bold text-lg hover:bg-[#0077B6] transition-colors disabled:opacity-50">
            Check ✓
          </button>
        </>
      ) : (
        <>
          {/* Sentence builder */}
          <div className="min-h-[70px] bg-white border-2 border-slate-200 rounded-2xl flex gap-2 items-center px-4 mb-4 flex-wrap">
            {sentenceOrder.length === 0 && <span className="text-slate-400 text-sm">Tap words to build the sentence...</span>}
            {sentenceOrder.map((w, i) => (
              <button key={i} onClick={() => removeWord(i)}
                className="bg-[#00A2E8] text-white px-3 py-2 rounded-xl font-bold text-sm hover:bg-[#0077B6] transition-all">
                {w}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {remaining.map((w, i) => (
              <button key={i} onClick={() => addWord(w)}
                className="bg-yellow-100 border-2 border-yellow-300 text-yellow-800 px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 hover:bg-[#FFED00] transition-all">
                {w}
              </button>
            ))}
          </div>

          {result === 'wrong' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-center text-red-600 font-semibold text-sm mb-4">
              Not quite! Try a different order 💪
            </div>
          )}

          <button onClick={checkSentence} disabled={sentenceOrder.length === 0}
            className="w-full bg-[#00A2E8] text-white rounded-2xl py-4 font-bold text-lg hover:bg-[#0077B6] transition-colors disabled:opacity-50">
            Check Sentence ✓
          </button>
        </>
      )}
    </div>
  )
}
