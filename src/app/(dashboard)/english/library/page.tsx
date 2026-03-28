'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, BookOpen } from 'lucide-react'

const books = [
  { id: 1, title: 'My Red Ball', difficulty: 'easy', ageRange: 'Ages 1-5', emoji: '🔴', desc: 'A simple story about a child and their favourite red ball.' },
  { id: 2, title: 'Big and Small', difficulty: 'easy', ageRange: 'Ages 1-5', emoji: '🐘', desc: 'Exploring opposites using everyday objects like elephants and ants.' },
  { id: 3, title: 'Hello Sun!', difficulty: 'easy', ageRange: 'Ages 1-5', emoji: '☀️', desc: 'A cheerful morning routine book with simple sentences.' },
  { id: 4, title: 'The Hungry Cat', difficulty: 'easy', ageRange: 'Ages 1-5', emoji: '🐱', desc: 'A cat looks for food around the house, introducing food words.' },
  { id: 5, title: 'One Two Three Animals', difficulty: 'easy', ageRange: 'Ages 1-5', emoji: '🐾', desc: 'Children count animals from one to ten.' },
  { id: 6, title: 'Where is Teddy?', difficulty: 'easy', ageRange: 'Ages 2-5', emoji: '🧸', desc: 'A child searches for their teddy, supporting positional language.' },
  { id: 7, title: 'Red, Blue, Yellow', difficulty: 'easy', ageRange: 'Ages 1-4', emoji: '🎨', desc: 'An introduction to primary colours through familiar objects.' },
  { id: 8, title: 'My Family', difficulty: 'easy', ageRange: 'Ages 2-5', emoji: '👨‍👩‍👧', desc: 'A simple book showing different family members.' },
  { id: 9, title: 'I Feel Happy', difficulty: 'easy', ageRange: 'Ages 2-5', emoji: '😊', desc: 'A basic emotions book using big face expressions.' },
  { id: 10, title: 'The Little Dog', difficulty: 'easy', ageRange: 'Ages 1-4', emoji: '🐕', desc: 'A tiny dog goes on a walk and meets friendly animals.' },
  { id: 11, title: 'The Brave Little Bee', difficulty: 'medium', ageRange: 'Ages 4-7', emoji: '🐝', desc: 'A bee overcomes her fears to help the hive.' },
  { id: 12, title: 'Max and the Muddy Puddle', difficulty: 'medium', ageRange: 'Ages 4-7', emoji: '💧', desc: 'Max makes a mess but learns to clean it up with kindness.' },
  { id: 13, title: 'The Dragon Who Was Afraid', difficulty: 'medium', ageRange: 'Ages 5-8', emoji: '🐉', desc: 'A dragon learns that being scared is okay.' },
  { id: 14, title: 'Lily Learns to Share', difficulty: 'medium', ageRange: 'Ages 4-6', emoji: '🤝', desc: 'Lily discovers the joy of sharing her toys with friends.' },
  { id: 15, title: 'The Mystery of the Missing Sock', difficulty: 'hard', ageRange: 'Ages 6-9', emoji: '🧦', desc: 'A funny detective story about a sock that goes missing.' },
  { id: 16, title: 'Adventures in Space', difficulty: 'hard', ageRange: 'Ages 7-10', emoji: '🚀', desc: 'A young astronaut travels to different planets.' },
]

const difficultyConfig = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-700', badge: 'bg-green-500' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700', badge: 'bg-amber-500' },
  hard: { label: 'Hard', color: 'bg-red-100 text-red-700', badge: 'bg-red-500' },
}

export default function LibraryPage() {
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [search, setSearch] = useState('')

  const filtered = books.filter(b => {
    const matchesDiff = filter === 'all' || b.difficulty === filter
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase())
    return matchesDiff && matchesSearch
  })

  return (
    <div className="pb-20 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">📚 Library</h1>
        <p className="text-slate-500 text-sm">400 unique books — tap any book to read it with audio support.</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books..."
          className="w-full border-2 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#00A2E8] transition-colors" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'easy', 'medium', 'hard'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all capitalize
              ${filter === f ? 'bg-[#00A2E8] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f === 'easy' ? '🟢' : f === 'medium' ? '🟡' : f === 'hard' ? '🔴' : '📚'} {f === 'all' ? 'All books' : f}
          </button>
        ))}
      </div>

      {/* Books grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(book => {
          const cfg = difficultyConfig[book.difficulty as keyof typeof difficultyConfig]
          return (
            <Link key={book.id} href={`/english/library/${book.id}`}
              className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="bg-gradient-to-br from-[#00A2E8]/20 to-blue-100 p-6 flex items-center justify-center text-6xl aspect-square">
                {book.emoji}
              </div>
              <div className="p-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-2 group-hover:text-[#00A2E8] transition-colors leading-tight">
                  {book.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1">{book.ageRange}</p>
                <div className="flex items-center gap-1 mt-2 text-[#00A2E8] text-xs font-semibold">
                  <BookOpen size={12} /> Read now
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">📭</div>
          <p className="font-semibold">No books found</p>
        </div>
      )}
    </div>
  )
}
