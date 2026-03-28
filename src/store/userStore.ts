import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  stickerCount: number
  streak: number
  lastActiveDate: string | null
  highContrast: boolean
  fontSize: 'normal' | 'large' | 'xlarge'
  speechRate: number
  speechPitch: number
  speechVolume: number
  addSticker: () => void
  setHighContrast: (v: boolean) => void
  setFontSize: (v: 'normal' | 'large' | 'xlarge') => void
  setSpeechRate: (v: number) => void
  setSpeechPitch: (v: number) => void
  setSpeechVolume: (v: number) => void
  checkStreak: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      stickerCount: 0,
      streak: 0,
      lastActiveDate: null,
      highContrast: false,
      fontSize: 'normal',
      speechRate: 0.9,
      speechPitch: 1.0,
      speechVolume: 1.0,

      addSticker: () => set(s => ({ stickerCount: s.stickerCount + 1 })),

      setHighContrast: (v) => set({ highContrast: v }),
      setFontSize: (v) => set({ fontSize: v }),
      setSpeechRate: (v) => set({ speechRate: v }),
      setSpeechPitch: (v) => set({ speechPitch: v }),
      setSpeechVolume: (v) => set({ speechVolume: v }),

      checkStreak: () => {
        const today = new Date().toDateString()
        const last = get().lastActiveDate
        if (last === today) return
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        set(s => ({
          streak: last === yesterday ? s.streak + 1 : 1,
          lastActiveDate: today,
        }))
      },
    }),
    { name: 'lwu-user-store' }
  )
)
