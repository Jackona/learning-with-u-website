'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { Flame, Star, BookOpen, Calculator, MessageSquare, Palette, HelpCircle, Trophy } from 'lucide-react'

const sections = [
  { href: '/aac/symbols', emoji: '💬', label: 'AAC Symbols', desc: 'Tap to speak', color: 'from-purple-400 to-purple-600', icon: MessageSquare },
  { href: '/aac/speak', emoji: '🔊', label: 'Text to Speech', desc: 'Type and speak', color: 'from-indigo-400 to-indigo-600', icon: MessageSquare },
  { href: '/maths/timetables', emoji: '✖️', label: 'Timetables', desc: '1 – 12 times tables', color: 'from-green-400 to-green-600', icon: Calculator },
  { href: '/maths/division', emoji: '➗', label: 'Division', desc: '1 – 12 divisions', color: 'from-teal-400 to-teal-600', icon: Calculator },
  { href: '/maths/addition-subtraction', emoji: '➕', label: 'Add & Subtract', desc: 'Daily challenges', color: 'from-emerald-400 to-emerald-600', icon: Calculator },
  { href: '/english/spelling', emoji: '🔤', label: 'Spelling', desc: 'Word of the day', color: 'from-yellow-400 to-orange-400', icon: BookOpen },
  { href: '/english/jigsaw', emoji: '🧩', label: 'Jigsaw', desc: 'Daily puzzles', color: 'from-amber-400 to-amber-600', icon: BookOpen },
  { href: '/english/library', emoji: '📚', label: 'Library', desc: '400 books', color: 'from-orange-400 to-red-400', icon: BookOpen },
  { href: '/art/canvas', emoji: '🎨', label: 'Art Canvas', desc: 'Draw & create', color: 'from-pink-400 to-rose-500', icon: Palette },
  { href: '/art/colours', emoji: '🌈', label: 'Colours', desc: 'Learn colours', color: 'from-rose-400 to-pink-500', icon: Palette },
  { href: '/quiz', emoji: '❓', label: 'Weekly Quiz', desc: 'Test yourself', color: 'from-blue-400 to-blue-600', icon: HelpCircle },
  { href: '/rewards', emoji: '⭐', label: 'Rewards', desc: 'Your stickers', color: 'from-[#FFED00] to-yellow-500', icon: Star },
]

const todayChallenges = [
  { emoji: '✖️', label: "Today's Maths Sheet", href: '/maths/timetables', done: false },
  { emoji: '🔤', label: 'Word of the Day', href: '/english/spelling', done: false },
  { emoji: '🧩', label: 'Daily Jigsaw', href: '/english/jigsaw', done: false },
]

export default function DashboardPage() {
  const { stickerCount, streak, checkStreak } = useUserStore()

  useEffect(() => {
    checkStreak()
  }, [checkStreak])

  return (
    <div className="pb-20 lg:pb-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#00A2E8] to-[#0077B6] rounded-3xl p-6 mb-8 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Good morning! 👋</h1>
          <p className="text-blue-100 text-sm">Ready to learn something new today?</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <Flame size={18} className="text-orange-300" />
              <span className="font-bold text-sm">{streak} day streak</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <Star size={18} className="text-[#FFED00]" fill="currentColor" />
              <span className="font-bold text-sm">{stickerCount} stickers</span>
            </div>
          </div>
        </div>
        <div className="text-7xl hidden sm:block">🐄</div>
      </div>

      {/* Today's challenges */}
      <section className="mb-8">
        <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Trophy size={22} className="text-[#FFED00]" /> Today&apos;s Challenges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {todayChallenges.map(c => (
            <Link
              key={c.label}
              href={c.href}
              className="bg-white border-2 border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:border-[#00A2E8] hover:shadow-md transition-all group"
            >
              <span className="text-3xl">{c.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm group-hover:text-[#0077B6]">{c.label}</p>
                <p className="text-xs text-slate-400">{c.done ? '✅ Complete!' : 'Tap to start'}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                ${c.done ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
                {c.done && '✓'}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Monthly sticker progress */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-[#FFED00]/20 to-yellow-100 rounded-3xl p-5 border border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-slate-800 flex items-center gap-2">
              <Star size={20} className="text-[#FFED00]" fill="currentColor" />
              Monthly Challenge
            </h2>
            <span className="text-sm font-bold text-[#0077B6]">{stickerCount}/30 stickers</span>
          </div>
          <div className="w-full bg-white/60 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-[#FFED00] to-yellow-400 transition-all duration-500"
              style={{ width: `${Math.min((stickerCount / 30) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Collect 30 stickers this month to unlock a special prize! 🏆</p>
        </div>
      </section>

      {/* All sections */}
      <section>
        <h2 className="text-xl font-extrabold text-slate-900 mb-4">All Activities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sections.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className={`bg-gradient-to-br ${s.color} text-white rounded-3xl p-5 flex flex-col items-center text-center gap-2 hover:scale-105 hover:shadow-lg transition-all`}
            >
              <span className="text-4xl">{s.emoji}</span>
              <span className="font-bold text-sm">{s.label}</span>
              <span className="text-xs opacity-80">{s.desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
