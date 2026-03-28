'use client'

import { useState } from 'react'
import { speak } from '@/lib/speech'
import { Search, Heart } from 'lucide-react'

const categories = [
  {
    id: 'requests',
    label: '🙋 Requests',
    color: 'bg-purple-500',
    symbols: [
      { id: 'i-want', label: 'I want', emoji: '🙋', speech: 'I want' },
      { id: 'i-need', label: 'I need', emoji: '⭐', speech: 'I need' },
      { id: 'help-me', label: 'Help me', emoji: '🆘', speech: 'Help me please' },
      { id: 'more', label: 'More', emoji: '➕', speech: 'More please' },
      { id: 'stop', label: 'Stop', emoji: '✋', speech: 'Stop' },
      { id: 'finished', label: 'Finished', emoji: '✅', speech: 'I am finished' },
      { id: 'yes', label: 'Yes', emoji: '👍', speech: 'Yes' },
      { id: 'no', label: 'No', emoji: '👎', speech: 'No' },
      { id: 'please', label: 'Please', emoji: '🙏', speech: 'Please' },
      { id: 'thank-you', label: 'Thank you', emoji: '💛', speech: 'Thank you' },
    ],
  },
  {
    id: 'emotions',
    label: '😊 Emotions',
    color: 'bg-yellow-500',
    symbols: [
      { id: 'happy', label: 'Happy', emoji: '😊', speech: 'I am happy' },
      { id: 'sad', label: 'Sad', emoji: '😢', speech: 'I am sad' },
      { id: 'angry', label: 'Angry', emoji: '😠', speech: 'I am angry' },
      { id: 'scared', label: 'Scared', emoji: '😨', speech: 'I am scared' },
      { id: 'tired', label: 'Tired', emoji: '😴', speech: 'I am tired' },
      { id: 'excited', label: 'Excited', emoji: '🤩', speech: 'I am excited' },
      { id: 'confused', label: 'Confused', emoji: '😕', speech: 'I am confused' },
      { id: 'ok', label: 'OK', emoji: '😐', speech: 'I am okay' },
      { id: 'hurt', label: 'Hurt', emoji: '🤕', speech: 'I am hurt' },
      { id: 'hungry', label: 'Hungry', emoji: '🍽️', speech: 'I am hungry' },
      { id: 'thirsty', label: 'Thirsty', emoji: '🥤', speech: 'I am thirsty' },
      { id: 'cold', label: 'Cold', emoji: '🥶', speech: 'I am cold' },
      { id: 'hot', label: 'Hot', emoji: '🥵', speech: 'I am hot' },
    ],
  },
  {
    id: 'shopping',
    label: '🛒 Shopping',
    color: 'bg-green-500',
    symbols: [
      { id: 'shop', label: 'Shop', emoji: '🏪', speech: 'Shop' },
      { id: 'buy', label: 'Buy this', emoji: '🛒', speech: 'I want to buy this' },
      { id: 'how-much', label: 'How much?', emoji: '💷', speech: 'How much does this cost?' },
      { id: 'pay', label: 'Pay', emoji: '💳', speech: 'I would like to pay' },
      { id: 'receipt', label: 'Receipt', emoji: '🧾', speech: 'Can I have a receipt please' },
      { id: 'bag', label: 'Bag', emoji: '🛍️', speech: 'Can I have a bag please' },
      { id: 'queue', label: 'Queue', emoji: '🚶', speech: 'I need to queue' },
      { id: 'change', label: 'Change', emoji: '🪙', speech: 'Here is my change' },
      { id: 'too-expensive', label: 'Too expensive', emoji: '💸', speech: 'That is too expensive' },
      { id: 'thank-you-shop', label: 'Thank you', emoji: '🙏', speech: 'Thank you very much' },
    ],
  },
  {
    id: 'getting-around',
    label: '🗺️ Getting Around',
    color: 'bg-blue-500',
    symbols: [
      { id: 'bus', label: 'Bus', emoji: '🚌', speech: 'I want to take the bus' },
      { id: 'train', label: 'Train', emoji: '🚆', speech: 'I want to take the train' },
      { id: 'walk', label: 'Walk', emoji: '🚶', speech: 'I want to walk' },
      { id: 'stop', label: 'Bus stop', emoji: '🚏', speech: 'Bus stop' },
      { id: 'ticket', label: 'Ticket', emoji: '🎫', speech: 'I need a ticket' },
      { id: 'where', label: 'Where is...?', emoji: '📍', speech: 'Where is' },
      { id: 'left', label: 'Turn left', emoji: '⬅️', speech: 'Turn left' },
      { id: 'right', label: 'Turn right', emoji: '➡️', speech: 'Turn right' },
      { id: 'straight', label: 'Go straight', emoji: '⬆️', speech: 'Go straight ahead' },
      { id: 'here', label: 'I am here', emoji: '📌', speech: 'I am here' },
      { id: 'help-lost', label: 'I am lost', emoji: '😟', speech: 'I am lost, please help me' },
      { id: 'home', label: 'Home', emoji: '🏠', speech: 'I want to go home' },
    ],
  },
  {
    id: 'school',
    label: '🏫 School',
    color: 'bg-orange-500',
    symbols: [
      { id: 'toilet', label: 'Toilet', emoji: '🚽', speech: 'Can I go to the toilet please' },
      { id: 'drink', label: 'Water', emoji: '💧', speech: 'Can I have some water please' },
      { id: 'break', label: 'Break', emoji: '⏸️', speech: 'I need a break' },
      { id: 'dont-understand', label: "Don't understand", emoji: '🤔', speech: "I don't understand" },
      { id: 'listen', label: 'Listen', emoji: '👂', speech: 'Please listen' },
      { id: 'sit', label: 'Sit down', emoji: '🪑', speech: 'Please sit down' },
      { id: 'stand', label: 'Stand up', emoji: '⬆️', speech: 'Please stand up' },
      { id: 'quiet', label: 'Quiet', emoji: '🤫', speech: 'Please be quiet' },
      { id: 'line-up', label: 'Line up', emoji: '🚶', speech: 'Please line up' },
      { id: 'well-done', label: 'Well done!', emoji: '🌟', speech: 'Well done!' },
    ],
  },
  {
    id: 'feelings-body',
    label: '🩺 Feelings & Body',
    color: 'bg-red-500',
    symbols: [
      { id: 'headache', label: 'Headache', emoji: '🤯', speech: 'I have a headache' },
      { id: 'tummy-ache', label: 'Tummy ache', emoji: '🤢', speech: 'I have a tummy ache' },
      { id: 'need-sit', label: 'Need to sit', emoji: '🪑', speech: 'I need to sit down' },
      { id: 'too-loud', label: 'Too loud', emoji: '🔊', speech: 'It is too loud' },
      { id: 'too-bright', label: 'Too bright', emoji: '🌟', speech: 'It is too bright' },
      { id: 'dizzy', label: 'Dizzy', emoji: '💫', speech: 'I feel dizzy' },
      { id: 'medicine', label: 'Medicine', emoji: '💊', speech: 'I need my medicine' },
      { id: 'calm-down', label: 'Calm down', emoji: '😮‍💨', speech: 'I need to calm down' },
    ],
  },
]

export default function AACSymbolsPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [sentenceBar, setSentenceBar] = useState<Array<{ label: string; speech: string; emoji: string }>>([])
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [favourites, setFavourites] = useState<string[]>([])

  const currentCategory = categories.find(c => c.id === activeCategory)!

  const filteredSymbols = searchQuery
    ? categories.flatMap(c => c.symbols).filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentCategory.symbols

  const handleSymbolClick = (symbol: { id: string; label: string; emoji: string; speech: string }) => {
    setSpeakingId(symbol.id)
    speak(symbol.speech, { rate: 0.85 })
    setTimeout(() => setSpeakingId(null), 1500)
    setSentenceBar(prev => [...prev, symbol])
  }

  const speakSentence = () => {
    const sentence = sentenceBar.map(s => s.speech).join('. ')
    speak(sentence)
  }

  const toggleFavourite = (id: string) => {
    setFavourites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  return (
    <div className="pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">AAC Symbols</h1>
        <p className="text-slate-500 text-sm">Tap a symbol to speak it. Build sentences using the bar at the bottom.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search symbols..."
          className="w-full border-2 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#00A2E8] transition-colors"
        />
      </div>

      {/* Category tabs */}
      {!searchQuery && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all
                ${activeCategory === c.id ? `${c.color} text-white shadow-md` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Symbols grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8">
        {filteredSymbols.map(symbol => (
          <div key={symbol.id} className="relative">
            <button
              onClick={() => handleSymbolClick(symbol)}
              className={`w-full flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all select-none
                ${speakingId === symbol.id
                  ? 'border-[#00A2E8] bg-[#00A2E8] text-white scale-95 shadow-lg'
                  : 'border-slate-200 bg-white hover:border-[#00A2E8] hover:bg-blue-50 hover:scale-105'
                }`}
            >
              <span className="text-4xl">{symbol.emoji}</span>
              <span className="text-xs font-semibold text-center leading-tight">{symbol.label}</span>
              {speakingId === symbol.id && <span className="text-xs animate-pulse">🔊</span>}
            </button>
            <button
              onClick={() => toggleFavourite(symbol.id)}
              className="absolute top-1 right-1 p-1 rounded-full"
              aria-label="Favourite"
            >
              <Heart
                size={12}
                className={favourites.includes(symbol.id) ? 'text-red-500 fill-red-500' : 'text-slate-300'}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Sentence bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:bottom-4 lg:left-auto lg:right-4 lg:w-[calc(100%-256px-2rem)] bg-white border-t lg:border-2 border-slate-200 lg:rounded-3xl shadow-2xl p-4 z-40">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-h-[48px] bg-slate-50 rounded-2xl border-2 border-slate-200 px-3 py-2 flex flex-wrap gap-2 items-center">
            {sentenceBar.length === 0 && (
              <span className="text-slate-400 text-sm">Tap symbols to build a sentence...</span>
            )}
            {sentenceBar.map((s, i) => (
              <span
                key={i}
                className="bg-[#00A2E8] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
              >
                {s.emoji} {s.label}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            {sentenceBar.length > 0 && (
              <>
                <button
                  onClick={speakSentence}
                  className="bg-[#00A2E8] text-white rounded-2xl px-4 py-3 font-bold text-sm hover:bg-[#0077B6] transition-colors"
                >
                  🔊 Speak
                </button>
                <button
                  onClick={() => setSentenceBar(prev => prev.slice(0, -1))}
                  className="bg-slate-200 text-slate-700 rounded-2xl px-3 py-3 font-bold text-sm hover:bg-slate-300 transition-colors"
                >
                  ⌫
                </button>
                <button
                  onClick={() => setSentenceBar([])}
                  className="bg-red-100 text-red-500 rounded-2xl px-3 py-3 font-bold text-sm hover:bg-red-200 transition-colors"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
