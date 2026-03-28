'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { MessageSquare, Calculator, BookOpen, Palette, HelpCircle, Star, CheckCircle, ChevronDown, ChevronUp, Play } from 'lucide-react'

const features = [
  { icon: MessageSquare, title: 'AAC Symbols', description: 'Tap symbols to communicate. Hundreds of categorised symbols with UK English speech output.', color: 'bg-purple-100 text-purple-600', href: '/aac/symbols' },
  { icon: Calculator, title: 'Maths', description: 'Times tables, division, addition & subtraction. Interactive daily sheets with traffic light difficulty.', color: 'bg-green-100 text-green-600', href: '/maths/timetables' },
  { icon: BookOpen, title: 'English', description: 'Spelling, sentence building, word of the day, jigsaw puzzles, and a 400-book library.', color: 'bg-yellow-100 text-yellow-600', href: '/english/spelling' },
  { icon: Palette, title: 'Art', description: 'Draw with your finger or stylus. Save, share, and print your masterpieces.', color: 'bg-pink-100 text-pink-600', href: '/art/canvas' },
  { icon: HelpCircle, title: 'Weekly Quiz', description: '52 weeks of quizzes covering all subjects. Perfect for tracking progress throughout the year.', color: 'bg-orange-100 text-orange-600', href: '/quiz' },
  { icon: Star, title: 'Rewards', description: 'Earn stickers, build streaks, and unlock monthly prizes. Learning has never been so rewarding.', color: 'bg-blue-100 text-blue-600', href: '/rewards' },
]

const audiences = [
  { emoji: '🧒', title: 'Children with SEN', desc: 'Designed for SLCN, ASD, SpLD, SEMH and more — with tools that adapt to every child.' },
  { emoji: '👧', title: 'All Children', desc: 'Engaging activities that benefit every learner, not just those with additional needs.' },
  { emoji: '👩‍🏫', title: 'Teachers', desc: 'Track class progress, assign daily activities, and get printable reports.' },
  { emoji: '👨‍👩‍👧', title: 'Parents', desc: "Support your child's learning at home with fun, structured activities." },
]

const steps = [
  { step: '1', title: 'Sign Up Free', desc: 'Create an account with Google or your email address in seconds.', emoji: '✨' },
  { step: '2', title: 'Choose an Activity', desc: 'Pick from AAC, Maths, English, Art, or a Quiz — all designed for SEN learners.', emoji: '🎯' },
  { step: '3', title: 'Learn & Earn', desc: 'Complete activities, earn sticker rewards, and build daily learning streaks.', emoji: '🏆' },
]

const faqs = [
  { q: 'Is Learning With U free?', a: 'Yes! Learning With U is free for individual children and parents. Schools can contact us for a managed plan with teacher dashboards.' },
  { q: 'Which SEN types does it support?', a: 'We support SLCN, ASD, SpLD (dyslexia/dyspraxia), MLD, SLD, SEMH, VI, HI, and physical disabilities. Content can be calibrated to each child\'s needs.' },
  { q: 'Does it work on tablets and phones?', a: 'Yes. Fully responsive with large touch targets — perfect for iPads and tablets used in classrooms.' },
  { q: 'Is it GDPR compliant?', a: 'Yes. We are fully GDPR and UK COPPA compliant. We never share personal data. All data is stored securely on UK/EU servers.' },
  { q: 'Can I use it offline?', a: 'Daily activities are cached for offline use, so children can continue learning even with a poor connection.' },
]

const demoSymbols = [
  { label: 'I want', emoji: '🙋', speech: 'I want' },
  { label: 'Help me', emoji: '🆘', speech: 'Help me please' },
  { label: 'Thank you', emoji: '🙏', speech: 'Thank you' },
  { label: 'Yes', emoji: '✅', speech: 'Yes' },
  { label: 'No', emoji: '❌', speech: 'No' },
  { label: 'More', emoji: '➕', speech: 'More please' },
  { label: 'Stop', emoji: '✋', speech: 'Stop' },
  { label: 'Happy', emoji: '😊', speech: 'I am happy' },
]

function DemoSymbol({ label, emoji, speech }: { label: string; emoji: string; speech: string }) {
  const [speaking, setSpeaking] = useState(false)
  const handleClick = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(speech)
    u.lang = 'en-GB'
    u.rate = 0.9
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }
  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer select-none
        ${speaking ? 'border-[#00A2E8] bg-[#00A2E8] text-white scale-95' : 'border-slate-200 bg-white hover:border-[#00A2E8] hover:bg-blue-50'}`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-xs font-semibold">{label}</span>
      {speaking && <span className="text-xs animate-pulse">🔊</span>}
    </button>
  )
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#0077B6] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="Learning With U"
              width={120}
              height={60}
              className="h-12 w-auto rounded-xl object-contain"
              priority
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#features" className="hover:text-[#FFED00] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#FFED00] transition-colors">How it works</a>
            <a href="#demo" className="hover:text-[#FFED00] transition-colors">Try it</a>
            <a href="#faq" className="hover:text-[#FFED00] transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold hover:text-[#FFED00] transition-colors">Log in</Link>
            <Link href="/register" className="bg-[#FFED00] text-[#0077B6] px-4 py-2 rounded-full font-bold text-sm hover:bg-yellow-300 transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#00A2E8] via-[#0077B6] to-[#005f8e] text-white py-20 px-4 overflow-hidden relative">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFED00]/10 rounded-full blur-3xl" />
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                🇬🇧 Made for UK Schools
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Making Learning
                <span className="text-[#FFED00] block">Fun for Every Child</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-xl">
                A fully accessible educational platform designed for children with Special Educational Needs.
                AAC symbols, interactive maths, English, art, and more — all in one place.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/register" className="bg-[#FFED00] text-[#0077B6] px-8 py-4 rounded-full font-extrabold text-lg hover:bg-yellow-300 transition-all hover:scale-105 shadow-xl">
                  Start Learning Free ✨
                </Link>
                <a href="#demo" className="flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#0077B6] transition-all">
                  <Play size={20} /> Try AAC Demo
                </a>
              </div>
              <div className="flex flex-wrap gap-4 mt-8 text-sm text-blue-100 justify-center lg:justify-start">
                {['✅ Free to use', '✅ GDPR compliant', '✅ Works on all devices', '✅ UK English'].map(t => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="text-[160px] leading-none animate-bounce">🐄</div>
              <div className="bg-[#FFED00] text-[#0077B6] rounded-2xl px-6 py-3 font-bold text-lg mt-4 shadow-xl">
                SEN • Play • Learn • Grow
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="bg-slate-50 border-y border-slate-200 py-5 px-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm font-semibold">
            {['🏫 Used in UK schools', '♿ SEND-friendly design', '🔒 GDPR compliant', '👩‍🏫 Trusted by teachers', '📱 Works on all devices'].map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Everything in one place</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Six powerful learning areas, all designed with SEN children in mind.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(f => {
                const Icon = f.icon
                return (
                  <Link key={f.title} href={f.href} className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-[#00A2E8] transition-colors">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-gradient-to-br from-[#00A2E8]/5 to-[#0077B6]/10 py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">How it works</h2>
              <p className="text-lg text-slate-500">Up and learning in under a minute</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map(s => (
                <div key={s.step} className="text-center">
                  <div className="text-5xl mb-4">{s.emoji}</div>
                  <div className="w-10 h-10 bg-[#00A2E8] text-white rounded-full flex items-center justify-center font-extrabold text-lg mx-auto mb-4 shadow-lg">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AAC Demo */}
        <section id="demo" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-purple-100 text-purple-600 font-bold px-4 py-1 rounded-full text-sm mb-4">Live Demo — no sign up needed</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Try our AAC Symbols</h2>
              <p className="text-lg text-slate-500">Tap any symbol below and hear it spoken aloud in UK English.</p>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {demoSymbols.map(s => <DemoSymbol key={s.label} {...s} />)}
            </div>
            <div className="text-center mt-8">
              <Link href="/register" className="inline-block bg-[#00A2E8] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#0077B6] transition-colors">
                Unlock all 500+ symbols →
              </Link>
            </div>
          </div>
        </section>

        {/* Who is it for */}
        <section className="bg-slate-50 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Who is it for?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {audiences.map(a => (
                <div key={a.title} className="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-100">
                  <div className="text-5xl mb-4">{a.emoji}</div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{a.title}</h3>
                  <p className="text-slate-500 text-sm">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rewards */}
        <section className="bg-gradient-to-r from-[#FFED00] to-yellow-400 py-16 px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="text-8xl">🏆</div>
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-[#0077B6] mb-3">Learning is rewarding</h2>
              <p className="text-[#005f8e] text-lg mb-6">Earn stickers every day. Collect 30 stickers each month to unlock a special prize. Build streaks, earn badges, grow your collection.</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {['🌟 Daily stickers', '🔥 Streaks', '🏅 Monthly prizes', '📖 Personal dictionary'].map(r => (
                  <span key={r} className="bg-white/70 text-[#0077B6] font-bold px-4 py-2 rounded-full text-sm">{r}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Frequently asked questions</h2>
            </div>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold text-slate-900 hover:bg-slate-50 transition-colors">
                    {faq.q}
                    {openFaq === i ? <ChevronUp size={20} className="text-[#00A2E8]" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </button>
                  {openFaq === i && <div className="px-6 pb-5 text-slate-500 leading-relaxed text-sm">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-[#0077B6] to-[#00A2E8] py-20 px-4 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl mb-6">🐄</div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to start learning?</h2>
            <p className="text-blue-100 text-lg mb-8">Join thousands of children and teachers across the UK. Free to use, no credit card required.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register" className="bg-[#FFED00] text-[#0077B6] px-10 py-4 rounded-full font-extrabold text-lg hover:bg-yellow-300 transition-all hover:scale-105 shadow-xl">
                Create Free Account
              </Link>
              <Link href="/login" className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#0077B6] transition-all">
                Log In
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-10 text-blue-100 text-sm">
              {['Free forever', 'No ads', 'GDPR compliant', 'UK English'].map(t => (
                <span key={t} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#FFED00]" /> {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 justify-between">
          <div>
            <Image
              src="/logo.jpg"
              alt="Learning With U"
              width={120}
              height={60}
              className="h-12 w-auto rounded-xl object-contain mb-3"
            />
            <p className="text-sm max-w-xs">Making Learning Fun for every child. SEN • Play • Learn • Grow</p>
          </div>
          <div className="flex flex-wrap gap-12">
            <div>
              <p className="font-semibold text-white mb-3">Product</p>
              {['Features', 'How it works', 'For Schools', 'Pricing'].map(l => (
                <a key={l} href="#" className="block text-sm hover:text-white transition-colors mb-1">{l}</a>
              ))}
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Support</p>
              {['Contact Us', 'Privacy Policy', 'Cookie Policy', 'Accessibility'].map(l => (
                <a key={l} href="#" className="block text-sm hover:text-white transition-colors mb-1">{l}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-xs">
          © {new Date().getFullYear()} Learning With U. All rights reserved. Made with ❤️ in the UK.
        </div>
      </footer>
    </div>
  )
}
