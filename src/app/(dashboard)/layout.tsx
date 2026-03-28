import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl w-full">
          {children}
        </main>
      </div>
      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50 px-2">
        {[
          { href: '/dashboard', emoji: '🏠', label: 'Home' },
          { href: '/aac/symbols', emoji: '💬', label: 'AAC' },
          { href: '/maths/timetables', emoji: '🔢', label: 'Maths' },
          { href: '/english/spelling', emoji: '📖', label: 'English' },
          { href: '/art/canvas', emoji: '🎨', label: 'Art' },
          { href: '/rewards', emoji: '⭐', label: 'Rewards' },
        ].map(item => (
          <a
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-[#00A2E8] transition-colors"
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}
