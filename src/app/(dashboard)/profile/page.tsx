'use client'

import { useUserStore } from '@/store/userStore'
import { Star, Flame, Sun, Moon } from 'lucide-react'

const avatars = ['🐄', '🐸', '🦁', '🐼', '🦊', '🐧', '🦉', '🐙']

export default function ProfilePage() {
  const { stickerCount, streak, highContrast, fontSize, setHighContrast, setFontSize, speechRate, speechPitch, speechVolume, setSpeechRate, setSpeechPitch, setSpeechVolume } = useUserStore()

  return (
    <div className="pb-20 lg:pb-8 max-w-2xl">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">👤 My Profile</h1>

      {/* Avatar & stats */}
      <div className="bg-gradient-to-br from-[#00A2E8] to-[#0077B6] rounded-3xl p-6 text-white mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl bg-white/20 rounded-2xl w-20 h-20 flex items-center justify-center">🐄</div>
          <div>
            <h2 className="text-xl font-extrabold">My Account</h2>
            <p className="text-blue-100 text-sm">Learning With U</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 rounded-2xl p-3 text-center">
            <Star size={20} className="mx-auto mb-1 text-[#FFED00]" fill="currentColor" />
            <p className="font-extrabold text-xl">{stickerCount}</p>
            <p className="text-blue-100 text-xs">Stickers</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-3 text-center">
            <Flame size={20} className="mx-auto mb-1 text-orange-300" />
            <p className="font-extrabold text-xl">{streak}</p>
            <p className="text-blue-100 text-xs">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Avatar picker */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 p-5 mb-4">
        <h3 className="font-bold text-slate-800 mb-3">Choose your avatar</h3>
        <div className="flex flex-wrap gap-3">
          {avatars.map(a => (
            <button key={a} className="w-14 h-14 text-3xl bg-slate-100 hover:bg-[#FFED00] rounded-2xl transition-all hover:scale-110 flex items-center justify-center">
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility settings */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 p-5 mb-4">
        <h3 className="font-bold text-slate-800 mb-4">♿ Accessibility</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700">High Contrast</p>
              <p className="text-slate-400 text-xs">Increases text and border contrast</p>
            </div>
            <button onClick={() => setHighContrast(!highContrast)}
              className={`w-14 h-7 rounded-full transition-colors relative ${highContrast ? 'bg-[#00A2E8]' : 'bg-slate-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${highContrast ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div>
            <p className="font-semibold text-slate-700 mb-2">Text Size</p>
            <div className="flex gap-2">
              {(['normal', 'large', 'xlarge'] as const).map(size => (
                <button key={size} onClick={() => setFontSize(size)}
                  className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors
                    ${fontSize === size ? 'bg-[#00A2E8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {size === 'normal' ? 'A' : size === 'large' ? 'AA' : 'AAA'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Voice settings */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 p-5 mb-4">
        <h3 className="font-bold text-slate-800 mb-4">🔊 Voice Settings</h3>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <p className="font-semibold text-slate-700 text-sm">Volume</p>
              <span className="text-slate-400 text-sm">{Math.round(speechVolume * 100)}%</span>
            </div>
            <input type="range" min={0} max={1} step={0.1} value={speechVolume} onChange={e => setSpeechVolume(Number(e.target.value))}
              className="w-full accent-[#00A2E8]" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="font-semibold text-slate-700 text-sm">🐢 Speed</p>
              <span className="text-slate-400 text-sm">{speechRate}x</span>
            </div>
            <input type="range" min={0.5} max={2} step={0.1} value={speechRate} onChange={e => setSpeechRate(Number(e.target.value))}
              className="w-full accent-[#00A2E8]" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="font-semibold text-slate-700 text-sm">🎵 Pitch</p>
              <span className="text-slate-400 text-sm">{speechPitch}</span>
            </div>
            <input type="range" min={0.5} max={2} step={0.1} value={speechPitch} onChange={e => setSpeechPitch(Number(e.target.value))}
              className="w-full accent-[#00A2E8]" />
          </div>
        </div>
      </div>

      {/* Sign out */}
      <button className="w-full border-2 border-red-200 text-red-500 bg-red-50 rounded-2xl py-3 font-bold hover:bg-red-100 transition-colors">
        Sign Out
      </button>
    </div>
  )
}
