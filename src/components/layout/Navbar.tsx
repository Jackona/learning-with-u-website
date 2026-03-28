'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Star } from 'lucide-react'
import { useUserStore } from '@/store/userStore'

const navLinks = [
  { href: '/dashboard', label: 'Home' },
  { href: '/aac/symbols', label: 'AAC' },
  { href: '/maths/timetables', label: 'Maths' },
  { href: '/english/spelling', label: 'English' },
  { href: '/art/canvas', label: 'Art' },
  { href: '/quiz', label: 'Quiz' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const stickerCount = useUserStore(s => s.stickerCount)

  return (
    <nav className="bg-[#0077B6] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-[#FFED00]">
          <span className="text-2xl">🐄</span>
          <span>Learning With U</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#00A2E8] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link href="/rewards" className="flex items-center gap-1 bg-[#FFED00] text-[#0077B6] px-3 py-1 rounded-full font-bold text-sm">
            <Star size={14} fill="currentColor" />
            {stickerCount}
          </Link>
          <Link href="/profile" className="w-9 h-9 rounded-full bg-[#00A2E8] flex items-center justify-center font-bold text-sm">
            👤
          </Link>
          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#005f8e] px-4 pb-4 flex flex-col gap-2">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 px-4 rounded-xl text-white font-semibold hover:bg-[#00A2E8] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
