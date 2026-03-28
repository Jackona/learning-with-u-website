'use client'

import { useState, useEffect, useRef } from 'react'
import { speak, stopSpeech } from '@/lib/speech'
import { ChevronLeft, ChevronRight, Play, Square, BookOpen, Volume2 } from 'lucide-react'
import Link from 'next/link'

const booksData: Record<string, { title: string; emoji: string; pages: { text: string; emoji: string }[] }> = {
  '1': {
    title: 'My Red Ball',
    emoji: '🔴',
    pages: [
      { text: 'I have a red ball.', emoji: '🔴' },
      { text: 'My red ball is big.', emoji: '⚽' },
      { text: 'I throw my red ball.', emoji: '🙋' },
      { text: 'My red ball goes up!', emoji: '⬆️' },
      { text: 'My red ball comes down.', emoji: '⬇️' },
      { text: 'I love my red ball!', emoji: '❤️' },
    ],
  },
  '2': {
    title: 'Big and Small',
    emoji: '🐘',
    pages: [
      { text: 'An elephant is big.', emoji: '🐘' },
      { text: 'An ant is small.', emoji: '🐜' },
      { text: 'A bus is big.', emoji: '🚌' },
      { text: 'A mouse is small.', emoji: '🐭' },
      { text: 'A tree is big.', emoji: '🌳' },
      { text: 'A seed is small.', emoji: '🌱' },
      { text: 'Big and small — they are both special!', emoji: '🌟' },
    ],
  },
}

export default function BookReaderPage({ params }: { params: { bookId: string } }) {
  const book = booksData[params.bookId] ?? {
    title: 'Book ' + params.bookId,
    emoji: '📖',
    pages: [{ text: 'This book is coming soon!', emoji: '📖' }],
  }

  const [currentPage, setCurrentPage] = useState(0)
  const [readingMode, setReadingMode] = useState<'read-to-me' | 'read-along'>('read-along')
  const [isPlaying, setIsPlaying] = useState(false)
  const [fontSize, setFontSize] = useState('text-2xl')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const page = book.pages[currentPage]

  const speakPage = (text: string) => speak(text, { rate: 0.8 })

  const startReadToMe = () => {
    setIsPlaying(true)
    let pageIdx = currentPage

    const readNext = () => {
      if (pageIdx >= book.pages.length) {
        setIsPlaying(false)
        return
      }
      setCurrentPage(pageIdx)
      speakPage(book.pages[pageIdx].text)
      pageIdx++
      const delay = book.pages[pageIdx - 1].text.length * 80 + 1000
      intervalRef.current = setTimeout(readNext, delay)
    }
    readNext()
  }

  const stopReadToMe = () => {
    stopSpeech()
    if (intervalRef.current) clearTimeout(intervalRef.current)
    setIsPlaying(false)
  }

  useEffect(() => () => { if (intervalRef.current) clearTimeout(intervalRef.current) }, [])

  const nextPage = () => {
    if (currentPage < book.pages.length - 1) setCurrentPage(p => p + 1)
  }
  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(p => p - 1)
  }

  const speakWord = (word: string) => speak(word, { rate: 0.7 })

  return (
    <div className="pb-20 lg:pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/english/library" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div className="flex-1">
          <h1 className="font-extrabold text-slate-900 text-lg">{book.emoji} {book.title}</h1>
          <p className="text-slate-400 text-sm">Page {currentPage + 1} of {book.pages.length}</p>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => { setReadingMode('read-along'); stopReadToMe() }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-colors
            ${readingMode === 'read-along' ? 'bg-[#00A2E8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          <BookOpen size={16} /> Read Along
        </button>
        <button onClick={() => { setReadingMode('read-to-me'); stopReadToMe() }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-colors
            ${readingMode === 'read-to-me' ? 'bg-[#00A2E8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          <Volume2 size={16} /> Read to Me
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
        <div className="h-2 bg-[#00A2E8] rounded-full transition-all duration-500"
          style={{ width: `${((currentPage + 1) / book.pages.length) * 100}%` }} />
      </div>

      {/* Book page */}
      <div className="bg-gradient-to-br from-blue-50 to-[#00A2E8]/10 rounded-3xl p-8 mb-6 border-2 border-blue-100 min-h-[280px] flex flex-col items-center justify-center text-center">
        <div className="text-8xl mb-6">{page.emoji}</div>

        {readingMode === 'read-along' ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {page.text.split(' ').map((word, i) => (
              <button
                key={i}
                onClick={() => speakWord(word.replace(/[.,!?]/g, ''))}
                className={`${fontSize} font-bold text-slate-800 hover:text-[#00A2E8] hover:underline transition-colors px-1`}
              >
                {word}
              </button>
            ))}
          </div>
        ) : (
          <p className={`${fontSize} font-bold text-slate-800 leading-relaxed`}>{page.text}</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={prevPage} disabled={currentPage === 0}
          className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors disabled:opacity-40">
          <ChevronLeft size={24} />
        </button>

        {readingMode === 'read-to-me' ? (
          <button
            onClick={isPlaying ? stopReadToMe : startReadToMe}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg transition-colors
              ${isPlaying ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#00A2E8] text-white hover:bg-[#0077B6]'}`}>
            {isPlaying ? <><Square size={20} /> Stop</> : <><Play size={20} /> Read to me</>}
          </button>
        ) : (
          <button onClick={() => speakPage(page.text)}
            className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#FFED00] text-[#0077B6] rounded-2xl font-bold text-lg hover:bg-yellow-300 transition-colors">
            <Volume2 size={20} /> Hear this page
          </button>
        )}

        <button onClick={nextPage} disabled={currentPage === book.pages.length - 1}
          className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors disabled:opacity-40">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Font size */}
      <div className="flex items-center gap-2 justify-center">
        <span className="text-slate-400 text-sm font-medium">Text size:</span>
        {[['text-lg', 'A'], ['text-2xl', 'AA'], ['text-3xl', 'AAA']].map(([size, label]) => (
          <button key={size} onClick={() => setFontSize(size)}
            className={`px-3 py-1 rounded-full font-bold text-sm transition-colors
              ${fontSize === size ? 'bg-[#00A2E8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Completion */}
      {currentPage === book.pages.length - 1 && (
        <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-3xl p-6 text-center">
          <div className="text-5xl mb-2">🎉</div>
          <h3 className="font-extrabold text-green-700 text-xl mb-1">You finished the book!</h3>
          <p className="text-green-600 text-sm">Great reading! Head back to the library for more books.</p>
          <Link href="/english/library" className="inline-block mt-4 bg-[#00A2E8] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#0077B6] transition-colors">
            Back to Library 📚
          </Link>
        </div>
      )}
    </div>
  )
}
