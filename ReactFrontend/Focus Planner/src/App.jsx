import { useState } from 'react'
import {
  RiBookletLine,
  RiBuilding4Line,
  RiCheckDoubleLine,
  RiDatabase2Line,
  RiLayoutGridLine,
  RiMessage3Line,
  RiNotification3Line,
  RiSunLine,
  RiUser3Line,
} from 'react-icons/ri'
import { Outlet } from 'react-router-dom'

const Icon = ({ children, className = '' }) => (
  <span className={`inline-flex h-5 w-5 items-center justify-center ${className}`}>{children}</span>
)

const navItems = [
  { icon: RiLayoutGridLine, label: 'Dashboard' },
  { icon: RiNotification3Line, label: 'Notifications' },
  { icon: RiBuilding4Line, label: 'Projects' },
  { icon: RiUser3Line, label: 'Profile' },
  { icon: RiMessage3Line, label: 'Messages', active: true },
  { icon: RiCheckDoubleLine, label: 'Tasks' },
  { icon: RiBookletLine, label: 'Notes' },
  { icon: RiSunLine, label: 'Appearance' },
  { icon: RiDatabase2Line, label: 'Storage' },
]

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    // Page background and centered application frame.
    <main className="h-screen w-screen bg-[#adc2cf] p-2 font-sans text-[#162235] sm:p-2 lg:p-2 flex items-center justify-center">
      {/* Full planner application shell. */}
      <section className="flex h-[97%] w-[98%] overflow-hidden rounded-md border border-white/60 bg-[#dfeaf1]/90 shadow-[0_22px_55px_rgba(37,63,80,0.24)]">
        {/* Mobile menu overlay. It is hidden on desktop because the sidebar is always visible there. */}
        {isMenuOpen && <div className="absolute inset-0 z-20 bg-[#152238]/30 md:hidden" onClick={() => setIsMenuOpen(false)}>
          <aside className="h-full w-[250px] bg-[#eaf3f8] p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between"><span className="font-semibold">Menu</span><button onClick={() => setIsMenuOpen(false)} aria-label="Close menu" className="rounded-lg px-3 py-1 text-xl hover:bg-[#d8e4ec]">×</button></div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const NavIcon = item.icon
                return <button key={item.label} onClick={() => setIsMenuOpen(false)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${item.active ? 'bg-[#d8e4ec] text-[#182941]' : 'hover:bg-[#d8e4ec]'}`}><NavIcon className="text-xl" />{item.label}</button>
              })}
            </nav>
          </aside>
        </div>}
        {/* Primary icon navigation. */}
        <aside className="hidden w-[78px] shrink-0 flex-col items-center border-r border-[#cddce5] bg-[#eaf3f8]/80 py-3 md:flex">
          <button className="mb-3 flex h-[50px] w-[50px] items-center justify-center rounded-xl bg-[#17233a] text-xl text-white shadow-lg" aria-label="Main menu">▣</button>
          <nav className="flex flex-1 flex-col items-center gap-2">
            {navItems.slice(1).map((item) => {
              const NavIcon = item.icon
              return (
                <button key={item.label} title={item.label} className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition ${item.active ? 'bg-[#d8e4ec] text-[#182941]' : 'text-[#263849] hover:bg-[#d8e4ec]'}`}>
                  <NavIcon />
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main content area, including the top bar and both dashboard columns. */}
        <div className="min-w-0 flex-1">
          {/* Workspace header showing the active floor. */}
          <header className="flex h-[74px] items-center gap-3 border-b border-[#cedce5] px-6 sm:px-8">
            <span className="text-sm text-slate-500">Floor</span>
            <span className="font-semibold">Main</span>
            <Icon className="text-lg">♧</Icon>
            <Icon className="text-lg">♧</Icon>
            <div className="ml-auto md:hidden"><button onClick={() => setIsMenuOpen(true)} className="rounded-lg bg-[#17233a] px-3 py-2 text-sm text-white">Menu</button></div>
          </header>

          {/* Planner and todo-list columns. */}

          <Outlet />

        </div>
      </section>
    </main>
  )

}


export default App
