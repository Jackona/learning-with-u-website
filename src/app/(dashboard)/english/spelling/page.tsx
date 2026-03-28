'use client'

import { useState, useEffect } from 'react'
import { speak } from '@/lib/speech'
import { useUserStore } from '@/store/userStore'
import { Star, BookOpen, Volume2 } from 'lucide-react'

const wordBank = [
  { word: 'apple', definition: 'A round, sweet fruit that grows on trees. It can be red, green or yellow.', example: 'I ate a red apple for lunch.', emoji: '🍎' },
  { word: 'happy', definition: 'Feeling good and joyful inside. A nice feeling!', example: 'She was happy when she got a sticker.', emoji: '😊' },
  { word: 'friend', definition: 'Someone you like to play and spend time with.', example: 'My best friend is called Sam.', emoji: '👫' },
  { word: 'school', definition: 'A place where children go to learn new things.', example: 'I go to school every day.', emoji: '🏫' },
  { word: 'garden', definition: 'An outdoor space where flowers and vegetables grow.', example: 'We planted flowers in the garden.', emoji: '🌻' },
  { word: 'yellow', definition: 'A bright, sunny colour — like the sun or a banana!', example: 'The sunflower is yellow.', emoji: '💛' },
  { word: 'butter', definition: 'A soft, yellow food made from cream. You put it on bread.', example: 'I spread butter on my toast.', emoji: '🧈' },
  { word: 'night', definition: 'The time when it is dark outside and most people sleep.', example: 'We look at stars at night.', emoji: '🌙' },
  { word: 'table', definition: 'A flat surface with legs that you eat or work at.', example: 'We sat at the dinner table.', emoji: '🪑' },
  { word: 'water', definition: 'A clear liquid that we drink to stay healthy.', example: 'I drink water when I am thirsty.', emoji: '💧' },
  { word: 'colour', definition: 'What something looks like — like red, blue or green.', example: 'My favourite colour is blue.', emoji: '🎨' },
  { word: 'family', definition: 'The people you live with and who love you.', example: 'My family went to the park.', emoji: '👨‍👩‍👧' },
  { word: 'animal', definition: 'A living creature that is not a plant — like a dog or cat.', example: 'A dog is my favourite animal.', emoji: '🐾' },
  { word: 'flower', definition: 'A beautiful part of a plant that often has nice colours.', example: 'She picked a yellow flower.', emoji: '🌸' },
  { word: 'jungle', definition: 'A thick, wild forest with lots of trees and animals.', example: 'Tigers live in the jungle.', emoji: '🌴' },
]

function getTodaysWord() {
  const day = new Date().getDay()
  return wordBank[day % wordBank.length]
}

export default function SpellingPage() {
  const todaysWord = getTodaysWord()
  const [mode, setMode] = useState<'learn' | 'spell'>('learn')
  const [input, setInput] = useState('')
  const [letterTiles, setLetterTiles] = useState<string[]>([])
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const addSticker = useUserStore(s => s.addSticker)

  useEffect(() => {
    // Shuffle the letters of today's word for tile mode
    const shuffled = todaysWord.word.toUpperCase().split('').sort(() => Math.random() - 0.5)
    // Add some distractor letters
    const extras = 'BCDFGHJKLMNPQRSTVWXYZ'.split('').sort(() => Math.random() - 0.5).slice(0, 3)
    setLetterTiles([...shuffled, ...extras].sort(() => Math.random() - 0.5))
  }, [todaysWord.word])

  const speakWord = () => speak(todaysWord.word, { rate: 0.7 })
  const speakDefinition = () => speak(todaysWord.definition)
  const speakExample = () => speak(todaysWord.example)
  const speakLetter = (l: string) => speak(l)

  const addLetter = (letter: string) => {
    const newSelected = [...selectedLetters, letter]
    setSelectedLetters(newSelected)
    speakLetter(letter)
  }

  const removeLast = () => setSelectedLetters(prev => prev.slice(0, -1))

  const checkSpelling = () => {
    const attempt = selectedLetters.join('').toLowerCase()
    if (attempt === todaysWord.word) {
      setResult('correct')
      addSticker()
      speak(`Brilliant! You spelled ${todaysWord.word} correctly! ${todaysWord.definition}`)
    } else {
      setResult('wrong')
      speak(`Not quite. Try again! The word is ${todaysWord.word}`)
      setTimeout(() => setResult(null), 2000)
    }
  }

  return (
    <div className="pb-20 lg:pb-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">🔤 Spelling & Word of the Day</h1>
        <p className="text-slate-500 text-sm">A new word every day to learn, spell, and add to your dictionary!</p>
      </div>

      {/* Word of the day card */}
      <div className="bg-gradient-to-br from-[#FFED00]/30 to-yellow-100 rounded-3xl p-6 border-2 border-yellow-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-[#FFED00] text-[#0077B6] font-bold px-3 py-1 rounded-full text-sm">Word of the Day</span>
          <span className="text-4xl">{todaysWord.emoji}</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={speakWord} className="text-4xl font-extrabold text-slate-900 hover:text-[#00A2E8] transition-colors tracking-wide uppercase">
            {todaysWord.word}
          </button>
          <button onClick={speakWord} className="p-2 bg-[#00A2E8] rounded-full text-white hover:bg-[#0077B6] transition-colors" aria-label="Speak word">
            <Volume2 size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-white/70 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">What it means</p>
            <p className="text-slate-800 font-medium">{todaysWord.definition}</p>
            <button onClick={speakDefinition} className="text-[#00A2E8] text-xs font-bold mt-2 hover:underline">🔊 Hear the meaning</button>
          </div>
          <div className="bg-white/70 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">In a sentence</p>
            <p className="text-slate-800 font-medium italic">&ldquo;{todaysWord.example}&rdquo;</p>
            <button onClick={speakExample} className="text-[#00A2E8] text-xs font-bold mt-2 hover:underline">🔊 Hear the sentence</button>
          </div>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setMode('learn')} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-colors ${mode === 'learn' ? 'bg-[#00A2E8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          📖 Learn to spell it
        </button>
        <button onClick={() => setMode('spell')} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-colors ${mode === 'spell' ? 'bg-[#00A2E8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          🔤 Spell it yourself
        </button>
      </div>

      {mode === 'learn' && (
        <div className="bg-white rounded-3xl border-2 border-slate-100 p-6">
          <p className="font-bold text-slate-700 mb-4">Tap each letter to hear it:</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {todaysWord.word.toUpperCase().split('').map((letter, i) => (
              <button key={i} onClick={() => speakLetter(letter)}
                className="w-14 h-14 bg-[#00A2E8] text-white rounded-2xl font-extrabold text-2xl hover:bg-[#0077B6] hover:scale-110 transition-all shadow-md">
                {letter}
              </button>
            ))}
          </div>
          <button onClick={speakWord} className="w-full bg-[#FFED00] text-[#0077B6] rounded-2xl py-3 font-bold hover:bg-yellow-300 transition-colors">
            🔊 Hear the whole word
          </button>
          <button onClick={() => setMode('spell')} className="w-full mt-3 bg-slate-100 text-slate-700 rounded-2xl py-3 font-bold hover:bg-slate-200 transition-colors">
            Ready to spell it? →
          </button>
        </div>
      )}

      {mode === 'spell' && result !== 'correct' && (
        <div className="bg-white rounded-3xl border-2 border-slate-100 p-6">
          <p className="font-bold text-slate-700 mb-4">Tap the letters to spell the word:</p>

          {/* Answer box */}
          <div className="min-h-[60px] bg-slate-50 border-2 border-slate-200 rounded-2xl flex gap-2 items-center px-4 mb-4 flex-wrap">
            {selectedLetters.length === 0 && <span className="text-slate-400 text-sm">Tap letters below...</span>}
            {selectedLetters.map((l, i) => (
              <span key={i} className="w-10 h-10 bg-[#00A2E8] text-white rounded-xl font-extrabold text-xl flex items-center justify-center">{l}</span>
            ))}
          </div>

          {/* Letter tiles */}
          <div className="flex flex-wrap gap-2 mb-6">
            {letterTiles.map((letter, i) => (
              <button key={i} onClick={() => addLetter(letter)}
                className="w-12 h-12 bg-slate-100 hover:bg-[#00A2E8] hover:text-white rounded-2xl font-extrabold text-lg transition-all hover:scale-110">
                {letter}
              </button>
            ))}
          </div>

          {result === 'wrong' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3 text-red-600 font-semibold text-sm mb-4 text-center">
              Not quite! Try again 💪
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={removeLast} className="bg-slate-200 text-slate-700 rounded-2xl px-4 py-3 font-bold hover:bg-slate-300 transition-colors">
              ⌫ Remove
            </button>
            <button onClick={() => setSelectedLetters([])} className="bg-slate-200 text-slate-700 rounded-2xl px-4 py-3 font-bold hover:bg-slate-300 transition-colors">
              Clear
            </button>
            <button onClick={checkSpelling} disabled={selectedLetters.length === 0}
              className="flex-1 bg-[#00A2E8] text-white rounded-2xl py-3 font-bold hover:bg-[#0077B6] transition-colors disabled:opacity-50">
              Check ✓
            </button>
          </div>
        </div>
      )}

      {result === 'correct' && (
        <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-green-700 mb-2">Well done!</h2>
          <p className="text-green-600 mb-4">You spelled <strong>{todaysWord.word}</strong> correctly!</p>
          <div className="flex items-center justify-center gap-2 bg-yellow-50 rounded-2xl px-6 py-3 mb-6 border-2 border-yellow-200">
            <Star className="text-yellow-500 fill-yellow-500" size={20} />
            <span className="font-bold text-yellow-700">+1 Sticker earned! Added to your dictionary 📖</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <BookOpen size={18} />
            <span className="text-sm font-medium">&ldquo;{todaysWord.word}&rdquo; added to your personal dictionary</span>
          </div>
        </div>
      )}
    </div>
  )
}
