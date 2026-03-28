'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, MessageSquare, Calculator, BookOpen, Palette, HelpCircle, Star, User
} from 'lucide-react'

const sections: Array<
  | { href: string; icon: React.ElementType; label: string; color: string }
  | { label: string; color: string; children: { href: string; icon: React.ElementType; label: string }[] }
> = [
  { href: '/dashboard', icon: Home, label: 'Home', color: 'text-[#00A2E8]' },
  {
    label: 'AAC',
    color: 'text-purple-500',
    children: [
      { href: '/aac/symbols', icon: MessageSquare, label: 'Symbols' },
      { href: '/aac/speak', icon: MessageSquare, label: 'Speak' },
    ],
  },
  {
    label: 'Maths',
    color: 'text-green-500',
    children: [
      { href: '/maths/timetables', icon: Calculator, label: 'Timetables' },
      { href: '/maths/division', icon: Calculator, label: 'Division' },
      { href: '/maths/addition-subtraction', icon: Calculator, label: 'Add & Subtract' },
    ],
  },
  {
    label: 'English',
    color: 'text-yellow-500',
    children: [
      { href: '/english/spelling', icon: BookOpen, label: 'Spelling' },
      { href: '/english/jigsaw', icon: BookOpen, label: 'Jigsaw' },
      { href: '/english/library', icon: BookOpen, label: 'Library' },
    ],
  },
  {
    label: 'Art',
    color: 'text-pink-500',
    children: [
      { href: '/art/canvas', icon: Palette, label: 'Canvas' },
      { href: '/art/colours', icon: Palette, label: 'Colours' },
    ],
  },
  { href: '/quiz', icon: HelpCircle, label: 'Quiz', color: 'text-orange-500' },
  { href: '/rewards', icon: Star, label: 'Rewards', color: 'text-[#FFED00]' },
  { href: '/profile', icon: User, label: 'Profile', color: 'text-slate-500' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-slate-100 min-h-screen py-6 px-3 gap-1 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {sections.map((section) => {
        if ('href' in section) {
          const Icon = section.icon
          const active = pathname === section.href
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors
                ${active ? 'bg-[#00A2E8] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <Icon size={18} className={active ? 'text-white' : section.color} />
              {section.label}
            </Link>
          )
        }

        return (
          <div key={section.label} className="mt-3">
            <p className={`text-xs font-bold uppercase tracking-wider px-3 mb-1 ${section.color}`}>
              {section.label}
            </p>
            {section.children.map(child => {
              const Icon = child.icon
              const active = pathname === child.href
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors
                    ${active ? 'bg-[#00A2E8] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Icon size={16} className={active ? 'text-white' : 'text-slate-400'} />
                  {child.label}
                </Link>
              )
            })}
          </div>
        )
      })}
    </aside>
  )
}
