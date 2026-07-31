import { useEffect, useState } from 'react'
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

const isSameDay = (firstDate, secondDate) => firstDate.toDateString() === secondDate.toDateString()

function Clock({ now }) {
  const seconds = now.getSeconds()
  const minutes = now.getMinutes()
  const hours = now.getHours() % 12
  const hourRotation = hours * 30 + minutes * 0.5
  const minuteRotation = minutes * 6 + seconds * 0.1
  const secondRotation = seconds * 6

  return (
    // Live analog clock, driven by the device's local time.
    <div className="relative h-28 w-28 rounded-full border border-dashed border-[#8394a4]">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((degree) => (
        <span key={degree} className="absolute left-1/2 top-1/2 h-1.5 w-px origin-bottom bg-[#5d6f7e]" style={{ transform: `translate(-50%, -100%) rotate(${degree}deg)` }} />
      ))}
      <span className="absolute left-1/2 top-1/2 h-[37px] w-[2px] origin-bottom bg-[#18263d]" style={{ transform: `translate(-50%, -100%) rotate(${hourRotation}deg)` }} />
      <span className="absolute left-1/2 top-1/2 h-[48px] w-px origin-bottom bg-[#18263d]" style={{ transform: `translate(-50%, -100%) rotate(${minuteRotation}deg)` }} />
      <span className="absolute left-1/2 top-1/2 h-[42px] w-px origin-bottom bg-rose-400" style={{ transform: `translate(-50%, -100%) rotate(${secondRotation}deg)` }} />
      <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1c2940]" />
    </div>
  )
}

function Calendar({ visibleMonth, selectedDate, onChangeMonth, onSelectDate }) {
  const firstDayOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
  const firstGridDate = new Date(firstDayOfMonth)
  firstGridDate.setDate(firstGridDate.getDate() - ((firstDayOfMonth.getDay() + 6) % 7))
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDate)
    date.setDate(firstGridDate.getDate() + index)
    return date
  })
  const monthTitle = visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return <>
    {/* Calendar heading and working month controls. */}
    <div className="mt-7 flex items-center justify-between px-0.5"><span className="text-sm text-slate-500">{monthTitle}</span><div className="flex gap-4 text-lg"><button onClick={() => onChangeMonth(-1)} aria-label="Previous month">‹</button><button onClick={() => onChangeMonth(1)} aria-label="Next month">›</button></div></div>
    {/* Selectable calendar dates, starting each week on Monday. */}
    <div className="mt-4 rounded-[22px] bg-[#f5f9fc]/80 p-5 shadow-[0_14px_30px_rgba(75,100,120,0.1)]">
      <div className="grid grid-cols-7 text-center text-xs text-slate-500">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day} className="py-2">{day}</span>)}</div>
      <div className="grid grid-cols-7 text-center text-sm">{days.map((day) => {
        const selected = isSameDay(day, selectedDate)
        const isCurrentMonth = day.getMonth() === visibleMonth.getMonth()
        return <button key={day.toISOString()} onClick={() => onSelectDate(day)} aria-label={day.toDateString()} className={`mx-auto my-1 flex h-7 w-7 items-center justify-center rounded-md ${selected ? 'bg-[#17233a] text-white shadow-md' : !isCurrentMonth ? 'text-slate-400' : 'text-slate-600 hover:bg-[#e4eef5]'}`}>{day.getDate()}</button>
      })}</div>
    </div>
  </>
}

function App() {
  const [activeFilter, setActiveFilter] = useState('Unplanned')
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState(['HI-1', 'HI-1'])
  const [now, setNow] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const addTask = (event) => {
    event.preventDefault()
    if (!task.trim()) return
    setTasks((current) => [...current, task.trim()])
    setTask('')
  }

  const filters = [
    { name: 'Unplanned', icon: '♨', count: tasks.length },
    { name: 'Planned', icon: '✓' },
    { name: 'All', icon: '▱' },
  ]
  const timeLabel = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const dateLabel = now.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'long' })
  const changeMonth = (offset) => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1))
  const selectDate = (date) => {
    setSelectedDate(date)
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1))
  }

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
          <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[290px_minmax(450px,1fr)] xl:gap-8">
            {/* Left column: planner filters, clock, and monthly calendar. */}
            <section>
              <h1 className="mb-5 text-[18px] font-semibold">Planner</h1>
              <div className="space-y-1">
                {filters.map((filter) => (
                  <button key={filter.name} onClick={() => setActiveFilter(filter.name)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${activeFilter === filter.name ? 'bg-[#eff6fb] shadow-[0_8px_20px_rgba(68,95,114,0.08)]' : 'hover:bg-white/40'}`}>
                    <Icon className="text-lg">{filter.icon}</Icon>
                    <span className="flex-1">{filter.name}</span>
                    {filter.count !== undefined && <span className="rounded bg-[#d8e6ee] px-1.5 py-0.5 text-xs font-semibold">{filter.count}</span>}
                    {filter.name === 'Unplanned' && <span className="text-lg">›</span>}
                  </button>
                ))}
              </div>

              {/* Current time card. */}
              <div className="mt-7 rounded-[22px] bg-[#f4f8fb]/85 p-6 shadow-[0_14px_30px_rgba(75,100,120,0.12)]">
                <div className="flex items-center justify-center gap-8">
                  <Clock now={now} />
                  <div><div className="text-xl font-semibold">{timeLabel}</div><div className="mt-1 text-sm text-slate-500">{dateLabel}</div></div>
                </div>
              </div>

              <Calendar visibleMonth={visibleMonth} selectedDate={selectedDate} onChangeMonth={changeMonth} onSelectDate={selectDate} />
            </section>

            {/* Right column: task composer and categorized todo groups. */}
            <section className="min-w-0 rounded-[26px] bg-[#d6e5ed]/75 p-6 sm:p-7">
              <h2 className="text-[18px] font-semibold">Todo’s</h2>
              <div className="mt-7 flex items-center gap-2 border-b border-[#bdcfd9] pb-5 text-sm"><Icon>☷</Icon><span className="font-medium">ToDo Unplanned</span></div>
              <form onSubmit={addTask} className="mt-3 flex items-center gap-2 rounded-lg border border-[#cad9e2] bg-[#e7f0f5] px-3 py-3 text-sm shadow-sm">
                <span className="text-2xl font-light">＋</span><input value={task} onChange={(event) => setTask(event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-500" placeholder="Add todo, press ↵ ENTER to save" /><button type="submit" className="hidden rounded bg-[#17233a] px-2 py-1 text-xs text-white sm:block">Add</button>
              </form>
              <TaskGroup title="Unplanned" count={tasks.length} tasks={tasks} onRemove={(index) => setTasks((current) => current.filter((_, itemIndex) => itemIndex !== index))} />
              <TaskGroup title="Todo’s" count={0} />
              <TaskGroup title="Scheduled" count={0} />
              <TaskGroup title="Done" count={0} />
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}

function TaskGroup({ title, count, tasks = [], onRemove }) {
  const [open, setOpen] = useState(true)
  return <div className="border-b border-[#c6d5de] py-5 last:border-0">
    <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 text-sm"><span className="text-lg transition" style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>⌃</span><span>{title}</span><span className="rounded bg-[#dce8ef] px-1.5 py-0.5 text-xs text-slate-600">{count}</span></button>
    {open && tasks.length > 0 && <div className="mt-4 space-y-3">{tasks.map((item, index) => <div key={`${item}-${index}`} className="flex items-center gap-3 rounded-md border border-[#cddbe3] bg-[#eaf3f8] px-3 py-2 text-sm shadow-[0_5px_12px_rgba(72,98,114,0.08)]"><span className="cursor-grab text-slate-500">⠿</span><button onClick={() => onRemove(index)} className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-500 text-[10px] text-slate-600">✓</button><span className="rounded bg-white/70 px-2 py-1">{item}</span><span className="text-slate-600">HI-1</span></div>)}</div>}
  </div>
}

export default App
