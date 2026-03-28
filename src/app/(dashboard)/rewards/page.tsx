'use client'

import { useUserStore } from '@/store/userStore'
import { Flame, Star } from 'lucide-react'

const badges = [
  { id: 'first-login', emoji: '👋', title: 'First Login', desc: 'Joined Learning With U', threshold: 0, type: 'milestone' },
  { id: 'streak-3', emoji: '🔥', title: '3-Day Streak', desc: 'Learned 3 days in a row', threshold: 3, type: 'streak' },
  { id: 'streak-7', emoji: '🌟', title: '7-Day Streak', desc: 'A whole week of learning!', threshold: 7, type: 'streak' },
  { id: 'sticker-5', emoji: '🌈', title: 'Sticker Collector', desc: 'Earned 5 stickers', threshold: 5, type: 'sticker' },
  { id: 'sticker-10', emoji: '🏅', title: 'Super Learner', desc: 'Earned 10 stickers', threshold: 10, type: 'sticker' },
  { id: 'sticker-30', emoji: '🏆', title: 'Monthly Champion', desc: 'Earned 30 stickers', threshold: 30, type: 'sticker' },
  { id: 'sticker-50', emoji: '👑', title: 'Learning Legend', desc: 'Earned 50 stickers', threshold: 50, type: 'sticker' },
  { id: 'maths-star', emoji: '🔢', title: 'Maths Star', desc: 'Completed a maths challenge', threshold: 1, type: 'sticker' },
  { id: 'english-star', emoji: '📖', title: 'Word Wizard', desc: 'Spelled the word of the day', threshold: 2, type: 'sticker' },
  { id: 'art-star', emoji: '🎨', title: 'Mini Artist', desc: 'Created artwork on the canvas', threshold: 3, type: 'sticker' },
  { id: 'quiz-star', emoji: '❓', title: 'Quiz Hero', desc: 'Completed a weekly quiz', threshold: 4, type: 'sticker' },
  { id: 'reader', emoji: '📚', title: 'Bookworm', desc: 'Finished reading a book', threshold: 6, type: 'sticker' },
]

const stickerEmojis = ['⭐', '🌟', '✨', '💛', '🌈', '🦋', '🌸', '🎉', '🏆', '💪', '🌻', '🐄']

export default function RewardsPage() {
  const { stickerCount, streak } = useUserStore()
  const monthlyProgress = Math.min((stickerCount / 30) * 100, 100)

  return (
    <div className="pb-20 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">⭐ Rewards</h1>
        <p className="text-slate-500 text-sm">Your stickers, badges and achievements — you earned these!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#FFED00] to-yellow-400 rounded-3xl p-5 text-center">
          <Star size={32} className="text-[#0077B6] mx-auto mb-2" fill="currentColor" />
          <p className="text-4xl font-extrabold text-[#0077B6]">{stickerCount}</p>
          <p className="text-[#005f8e] font-semibold text-sm">Total Stickers</p>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-5 text-center text-white">
          <Flame size={32} className="mx-auto mb-2" />
          <p className="text-4xl font-extrabold">{streak}</p>
          <p className="text-orange-100 font-semibold text-sm">Day Streak 🔥</p>
        </div>
      </div>

      {/* Monthly challenge */}
      <div className="bg-gradient-to-r from-[#0077B6] to-[#00A2E8] rounded-3xl p-6 text-white mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-xl">Monthly Challenge</h2>
            <p className="text-blue-100 text-sm">Collect 30 stickers to win a prize!</p>
          </div>
          <span className="text-4xl">🏆</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 bg-white/20 rounded-full h-5">
            <div className="h-5 bg-[#FFED00] rounded-full transition-all duration-700 flex items-center justify-end pr-2"
              style={{ width: `${monthlyProgress}%` }}>
              {stickerCount > 0 && <span className="text-[#0077B6] text-xs font-bold">{stickerCount}</span>}
            </div>
          </div>
          <span className="font-bold text-sm">30</span>
        </div>
        <p className="text-blue-100 text-sm">{Math.max(0, 30 - stickerCount)} more stickers to go!</p>
      </div>

      {/* Sticker collection */}
      <section className="mb-8">
        <h2 className="text-lg font-extrabold text-slate-900 mb-4">Your Sticker Book 📒</h2>
        <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-2">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i}
              className={`aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all
                ${i < stickerCount
                  ? 'bg-[#FFED00] shadow-md scale-100 hover:scale-110'
                  : 'bg-slate-100 opacity-40'
                }`}>
              {i < stickerCount ? stickerEmojis[i % stickerEmojis.length] : '⬜'}
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-sm mt-3 text-center">
          {stickerCount === 0 ? 'Complete activities to earn your first sticker!' : `${stickerCount} sticker${stickerCount !== 1 ? 's' : ''} collected!`}
        </p>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-lg font-extrabold text-slate-900 mb-4">Badges 🏅</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map(badge => {
            const earned = badge.type === 'sticker' ? stickerCount >= badge.threshold
              : badge.type === 'streak' ? streak >= badge.threshold
              : true
            return (
              <div key={badge.id}
                className={`rounded-3xl p-4 text-center border-2 transition-all
                  ${earned ? 'bg-white border-[#FFED00] shadow-md' : 'bg-slate-50 border-transparent opacity-60'}`}>
                <div className={`text-4xl mb-2 ${!earned ? 'grayscale' : ''}`}>{badge.emoji}</div>
                <p className={`font-bold text-sm ${earned ? 'text-slate-900' : 'text-slate-400'}`}>{badge.title}</p>
                <p className="text-slate-400 text-xs mt-1">{badge.desc}</p>
                {earned && <span className="inline-block mt-2 bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">Earned! ✓</span>}
                {!earned && <span className="inline-block mt-2 bg-slate-100 text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">Locked 🔒</span>}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
