import { useState, useMemo } from "react"

// ── SVG Icons ────────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const LockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const UnlockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
  </svg>
)
const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

// ── Data ─────────────────────────────────────────────────────────────────────
const SEED_EVENTS = [
  {
    id: 1, title: "DSA Bootcamp", date: "2026-03-25", time: "10:00 AM",
    venue: "Green Building, 4th Floor",
    category: "Workshop", seats: 60, registered: 38,
    description: "Master Data Structures & Algorithms with intensive hands-on sessions covering arrays, trees, graphs, and dynamic programming.",
    status: "upcoming", tags: ["DSA", "Coding"]
  },
  {
    id: 2, title: "Weekly Coding Contest", date: "2026-03-30", time: "2:00 PM",
    venue: "Green Building, 4th Floor",
    category: "Contest", seats: 40, registered: 25,
    description: "Compete with peers in a timed problem-solving contest. Top 3 winners receive GfG goodies.",
    status: "upcoming", tags: ["Contest", "Competitive"]
  },
  {
    id: 3, title: "Web Development Workshop", date: "2026-04-05", time: "11:00 AM",
    venue: "Woziank Auditorium",
    category: "Workshop", seats: 50, registered: 12,
    description: "Learn HTML, CSS, JavaScript and React from scratch. Build a real project by end of session.",
    status: "upcoming", tags: ["Web", "React"]
  },
  {
    id: 4, title: "Python Workshop", date: "2026-03-10", time: "10:00 AM",
    venue: "Green Building, 4th Floor",
    category: "Workshop", seats: 40, registered: 40,
    description: "Introductory Python programming session covering basics, loops, functions, and file handling.",
    status: "past", tags: ["Python"]
  },
  {
    id: 5, title: "Hackathon 2025", date: "2026-02-15", time: "9:00 AM",
    venue: "Green Building, 4th Floor — Woziak Auditorium",
    category: "Hackathon", seats: 100, registered: 100,
    description: "24-hour coding marathon with cash prizes. Teams of 3-4 built innovative solutions.",
    status: "past", tags: ["Hackathon", "Teams"]
  },
]

const ANNOUNCEMENTS = [
  { id: 1, title: "DSA Bootcamp Registration Open", body: "Slots are filling fast — only 22 seats remaining for the DSA Bootcamp on 25 March. Register immediately.", time: "2 hours ago", type: "urgent" },
  { id: 2, title: "Hackathon 2025 Results Announced", body: "Congratulations to Team CodeStorm for winning Hackathon 2025. Full results are available on the community page.", time: "1 day ago", type: "info" },
  { id: 3, title: "New Event Added: Web Dev Workshop", body: "A Web Development Workshop has been scheduled for 5 April. Early registrations are now open.", time: "2 days ago", type: "new" },
]

const CATEGORIES    = ["All", "Workshop", "Contest", "Hackathon"]
const EMPTY_FORM    = { name: "", regNumber: "", classSection: "", email: "" }
const EMPTY_EVENT   = { title: "", date: "", time: "", venue: "Green Building, 4th Floor — Woziak Auditorium", category: "Workshop", seats: "", description: "", tags: "" }
const COORD_PASS    = "gfgrit2026"

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page:         { padding: "40px 48px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1100px", margin: "0 auto", color: "#1a1a1a" },
  title:        { fontSize: "2rem", fontWeight: "800", marginBottom: "6px", textAlign: "left" },
  subtitle:     { color: "#666", fontSize: "1rem", marginBottom: "36px", textAlign: "left" },
  secTitle:     { fontSize: "1.2rem", fontWeight: "700", borderLeft: "4px solid #2f8d46", paddingLeft: "12px", marginBottom: "20px", textAlign: "left" },
  tabRow:       { display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" },
  tab:          { padding: "9px 20px", borderRadius: "8px", border: "1px solid #ddd", background: "white", cursor: "pointer", fontWeight: "600", fontSize: "0.88rem", color: "#555" },
  tabActive:    { padding: "9px 20px", borderRadius: "8px", border: "none", background: "#2f8d46", cursor: "pointer", fontWeight: "600", fontSize: "0.88rem", color: "white" },
  filterRow:    { display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" },
  filterBtn:    { padding: "7px 16px", borderRadius: "999px", border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", color: "#666" },
  filterActive: { padding: "7px 16px", borderRadius: "999px", border: "none", background: "#2f8d46", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", color: "white" },
  cardGrid:     { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginBottom: "48px" },
  card:         { border: "1px solid #e0e0e0", borderRadius: "14px", background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" },
  cardTop:      { padding: "20px 22px 0" },
  cardCat:      { display: "inline-block", background: "#e8f5e9", color: "#2f8d46", fontSize: "0.72rem", fontWeight: "700", padding: "3px 10px", borderRadius: "999px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" },
  cardTitle:    { fontWeight: "700", fontSize: "1.05rem", marginBottom: "10px", textAlign: "left" },
  cardMeta:     { display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" },
  cardMetaRow:  { display: "flex", alignItems: "center", gap: "7px", fontSize: "0.84rem", color: "#666" },
  cardDesc:     { color: "#666", fontSize: "0.88rem", lineHeight: "1.6", padding: "0 22px 14px", textAlign: "left" },
  cardFoot:     { padding: "14px 22px", borderTop: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" },
  seatsWrap:    { fontSize: "0.82rem", color: "#888", display: "flex", alignItems: "center", gap: "7px" },
  seatsBar:     { background: "#e8f5e9", borderRadius: "999px", height: "6px", width: "70px", overflow: "hidden" },
  seatsBarFill: { height: "100%", borderRadius: "999px" },
  btnReg:       { background: "#2f8d46", color: "white", border: "none", borderRadius: "7px", padding: "8px 20px", cursor: "pointer", fontSize: "0.88rem", fontWeight: "600" },
  btnEnded:     { background: "#f0f0f0", color: "#aaa", border: "none", borderRadius: "7px", padding: "8px 20px", cursor: "not-allowed", fontSize: "0.88rem", fontWeight: "600" },
  tagRow:       { display: "flex", gap: "6px", flexWrap: "wrap", padding: "0 22px 16px" },
  tag:          { background: "#f3f4f6", color: "#555", fontSize: "0.75rem", padding: "3px 9px", borderRadius: "6px", fontWeight: "500" },
  successBanner:{ background: "#e8f5e9", color: "#166534", padding: "14px 20px", borderRadius: "10px", fontWeight: "600", marginBottom: "24px", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: "10px" },
  overlay:      { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal:        { background: "white", padding: "32px", borderRadius: "14px", width: "460px", maxWidth: "94vw", position: "relative", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto" },
  modalTitle:   { fontWeight: "800", fontSize: "1.2rem", marginBottom: "4px", textAlign: "left" },
  modalSub:     { color: "#888", fontSize: "0.88rem", marginBottom: "20px", textAlign: "left" },
  closeBtn:     { position: "absolute", top: "14px", right: "14px", background: "#f0f0f0", color: "#333", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer", fontWeight: "700", fontSize: "1rem" },
  input:        { width: "100%", padding: "11px 14px", margin: "7px 0", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.95rem", boxSizing: "border-box", fontFamily: "inherit" },
  submitBtn:    { width: "100%", padding: "13px", background: "#2f8d46", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "1rem", marginTop: "10px" },
  regCard:      { border: "1px solid #e8e8e8", borderRadius: "10px", padding: "14px 18px", marginBottom: "10px", background: "white", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  regName:      { fontWeight: "700", fontSize: "0.95rem", textAlign: "left" },
  regMeta:      { color: "#888", fontSize: "0.82rem", textAlign: "left" },
  regBadge:     { background: "#e8f5e9", color: "#2f8d46", padding: "3px 10px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: "600" },
  annCard:      { display: "flex", gap: "14px", padding: "16px 20px", borderRadius: "10px", marginBottom: "12px", alignItems: "flex-start" },
  annBar:       { width: "3px", borderRadius: "999px", flexShrink: 0, alignSelf: "stretch" },
  annTitle:     { fontWeight: "700", fontSize: "0.97rem", marginBottom: "4px", textAlign: "left" },
  annBody:      { color: "#555", fontSize: "0.88rem", lineHeight: "1.6", textAlign: "left" },
  annTime:      { color: "#bbb", fontSize: "0.78rem", marginTop: "6px", textAlign: "left" },
  addFormBox:   { background: "#f9fafb", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "28px", maxWidth: "620px" },
  formGrid:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" },
  fullSpan:     { gridColumn: "1 / -1" },
  select:       { width: "100%", padding: "11px 14px", margin: "7px 0", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.95rem", boxSizing: "border-box", fontFamily: "inherit", background: "white" },
  addBtn:       { background: "#2f8d46", color: "white", border: "none", padding: "11px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem", fontWeight: "600", marginTop: "8px", display: "flex", alignItems: "center", gap: "7px" },
  addSuccess:   { background: "#e8f5e9", color: "#166534", padding: "12px 16px", borderRadius: "8px", fontWeight: "600", marginTop: "14px", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: "8px" },
  lockBox:      { background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "28px", maxWidth: "420px" },
}

const ANN_STYLES = {
  urgent: { bg: "#fff5f5", border: "1px solid #fecaca", bar: "#ef4444" },
  info:   { bg: "#f0fdf4", border: "1px solid #bbf7d0", bar: "#22c55e" },
  new:    { bg: "#eff6ff", border: "1px solid #bfdbfe", bar: "#3b82f6" },
}

// ── EventCard ─────────────────────────────────────────────────────────────────
function EventCard({ event, onRegister }) {
  const pct    = Math.round((event.registered / event.seats) * 100)
  const isPast = event.status === "past"
  const isFull = event.registered >= event.seats

  return (
    <div style={S.card}>
      <div style={S.cardTop}>
        <div style={S.cardCat}>{event.category}</div>
        <div style={S.cardTitle}>{event.title}</div>
        <div style={S.cardMeta}>
          <div style={S.cardMetaRow}>
            <span style={{ color: "#2f8d46" }}><CalendarIcon /></span>
            <span>{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} &middot; {event.time}</span>
          </div>
          <div style={S.cardMetaRow}>
            <span style={{ color: "#2f8d46" }}><LocationIcon /></span>
            <span>{event.venue}</span>
          </div>
        </div>
      </div>

      <p style={S.cardDesc}>{event.description}</p>

      <div style={S.tagRow}>
        {event.tags.map(t => <span key={t} style={S.tag}>{t}</span>)}
      </div>

      <div style={S.cardFoot}>
        <div style={S.seatsWrap}>
          <div style={S.seatsBar}>
            <div style={{ ...S.seatsBarFill, width: pct + "%", background: pct >= 90 ? "#ef4444" : "#2f8d46" }} />
          </div>
          {event.registered}/{event.seats} seats
        </div>
        {isPast
          ? <button disabled style={S.btnEnded}>Event Ended</button>
          : <button onClick={onRegister} disabled={isFull}
              style={{ ...S.btnReg, opacity: isFull ? 0.5 : 1, cursor: isFull ? "not-allowed" : "pointer" }}>
              {isFull ? "Fully Booked" : "Register"}
            </button>
        }
      </div>
    </div>
  )
}

// ── CoordinatorAddEvent ───────────────────────────────────────────────────────
function CoordinatorAddEvent({ setEvents }) {
  const [unlocked,   setUnlocked]   = useState(false)
  const [pwInput,    setPwInput]    = useState("")
  const [pwError,    setPwError]    = useState("")
  const [newEvent,   setNewEvent]   = useState(EMPTY_EVENT)
  const [addSuccess, setAddSuccess] = useState("")

  const handleUnlock = (e) => {
    e.preventDefault()
    if (pwInput === COORD_PASS) { setUnlocked(true); setPwError("") }
    else setPwError("Incorrect password. Access is restricted to coordinators only.")
  }

  const handleChange = (e) => setNewEvent({ ...newEvent, [e.target.name]: e.target.value })

  const handleAdd = (e) => {
    e.preventDefault()
    const ev = {
      id: Date.now(), title: newEvent.title, date: newEvent.date, time: newEvent.time,
      venue: newEvent.venue, category: newEvent.category, seats: parseInt(newEvent.seats, 10),
      registered: 0, description: newEvent.description, status: "upcoming",
      tags: newEvent.tags.split(",").map(t => t.trim()).filter(Boolean),
    }
    setEvents(prev => [...prev, ev])
    setAddSuccess("Event \"" + newEvent.title + "\" has been added successfully.")
    setNewEvent(EMPTY_EVENT)
    setTimeout(() => setAddSuccess(""), 4000)
  }

  if (!unlocked) return (
    <div>
      <h2 style={S.secTitle}>Coordinator Access</h2>
      <div style={S.lockBox}>
        <div style={{ marginBottom: "14px" }}><LockIcon /></div>
        <div style={{ fontWeight: "700", fontSize: "1rem", marginBottom: "6px" }}>Restricted Area</div>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "20px", lineHeight: "1.6" }}>
          Adding and managing events is restricted to club coordinators. Enter your coordinator password to proceed.
        </p>
        <form onSubmit={handleUnlock}>
          <input type="password" placeholder="Coordinator Password" value={pwInput}
            onChange={e => setPwInput(e.target.value)} required style={{ ...S.input, margin: "0 0 10px" }} />
          {pwError && <p style={{ color: "#d32f2f", fontSize: "0.88rem", margin: "0 0 10px", textAlign: "left" }}>{pwError}</p>}
          <button type="submit" style={{ ...S.addBtn, width: "100%", marginTop: "0", justifyContent: "center" }}>Unlock</button>
        </form>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <h2 style={{ ...S.secTitle, margin: 0 }}>Add New Event</h2>
        <span style={{ background: "#e8f5e9", color: "#2f8d46", padding: "3px 12px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "5px" }}>
          <UnlockIcon /> Coordinator
        </span>
        <button onClick={() => setUnlocked(false)}
          style={{ marginLeft: "auto", background: "none", border: "1px solid #ddd", borderRadius: "6px", padding: "5px 14px", cursor: "pointer", fontSize: "0.82rem", color: "#888" }}>
          Lock
        </button>
      </div>

      <div style={S.addFormBox}>
        <form onSubmit={handleAdd}>
          <div style={S.formGrid}>
            <div style={S.fullSpan}>
              <input name="title" type="text" placeholder="Event Title" value={newEvent.title} onChange={handleChange} required style={S.input} />
            </div>
            <input name="date" type="date" value={newEvent.date} onChange={handleChange} required style={S.input} />
            <input name="time" type="text" placeholder="Time (e.g. 10:00 AM)" value={newEvent.time} onChange={handleChange} required style={S.input} />
            <div style={S.fullSpan}>
              <input name="venue" type="text" placeholder="Venue" value={newEvent.venue} onChange={handleChange} required style={S.input} />
            </div>
            <select name="category" value={newEvent.category} onChange={handleChange} style={S.select}>
              {["Workshop", "Contest", "Hackathon", "Seminar", "Other"].map(c => <option key={c}>{c}</option>)}
            </select>
            <input name="seats" type="number" placeholder="Total Seats" value={newEvent.seats} onChange={handleChange} required min="1" style={S.input} />
            <div style={S.fullSpan}>
              <input name="tags" type="text" placeholder="Tags (comma-separated, e.g. DSA, Coding)" value={newEvent.tags} onChange={handleChange} style={S.input} />
            </div>
            <div style={S.fullSpan}>
              <textarea name="description" placeholder="Event Description" value={newEvent.description}
                onChange={handleChange} required style={{ ...S.input, height: "100px", resize: "vertical" }} />
            </div>
          </div>
          <button type="submit" style={S.addBtn}><PlusIcon /> Add Event</button>
        </form>
        {addSuccess && <div style={S.addSuccess}><CheckIcon /> {addSuccess}</div>}
      </div>
    </div>
  )
}

// ── Main Events ───────────────────────────────────────────────────────────────
function Events() {
  const [events,        setEvents]        = useState(SEED_EVENTS)
  const [tab,           setTab]           = useState("upcoming")
  const [catFilter,     setCatFilter]     = useState("All")
  const [showModal,     setShowModal]     = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [formData,      setFormData]      = useState(EMPTY_FORM)
  const [registrations, setRegistrations] = useState([])
  const [regSuccess,    setRegSuccess]    = useState("")

  const upcomingEvents = useMemo(() =>
    events.filter(e => e.status === "upcoming" && (catFilter === "All" || e.category === catFilter)),
    [events, catFilter])

  const pastEvents = useMemo(() =>
    events.filter(e => e.status === "past" && (catFilter === "All" || e.category === catFilter)),
    [events, catFilter])

  const openModal = (event) => { setSelectedEvent(event); setShowModal(true); setFormData(EMPTY_FORM) }
  const handleRegChange  = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleRegSubmit = (e) => {
    e.preventDefault()
    setRegistrations(prev => [...prev, { ...formData, id: Date.now(), event: selectedEvent.title,
      time: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) }])
    setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...ev, registered: ev.registered + 1 } : ev))
    setShowModal(false)
    setRegSuccess("Registration confirmed for \"" + selectedEvent.title + "\". You will receive a confirmation shortly.")
    setTimeout(() => setRegSuccess(""), 5000)
  }

  const TABS = [
    { id: "upcoming",      label: "Upcoming Events" },
    { id: "past",          label: "Past Events" },
    { id: "announcements", label: "Announcements" },
    { id: "registrations", label: "Registrations (" + registrations.length + ")" },
    { id: "manage",        label: "Add Event" },
  ]

  return (
    <div style={S.page}>
      <h1 style={S.title}>Events</h1>
      <p style={S.subtitle}>Manage, explore, and register for club events all in one place.</p>

      {regSuccess && (
        <div style={S.successBanner}>
          <CheckIcon /> {regSuccess}
        </div>
      )}

      <div style={S.tabRow}>
        {TABS.map(t => (
          <button key={t.id} style={tab === t.id ? S.tabActive : S.tab} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* UPCOMING */}
      {tab === "upcoming" && (
        <>
          <div style={S.filterRow}>
            <span style={{ fontSize: "0.85rem", color: "#888", marginRight: "4px" }}>Filter by:</span>
            {CATEGORIES.map(c => (
              <button key={c} style={catFilter === c ? S.filterActive : S.filterBtn} onClick={() => setCatFilter(c)}>{c}</button>
            ))}
          </div>
          <h2 style={S.secTitle}>Upcoming Events ({upcomingEvents.length})</h2>
          {upcomingEvents.length === 0
            ? <p style={{ color: "#aaa" }}>No upcoming events in this category.</p>
            : <div style={S.cardGrid}>
                {upcomingEvents.map(ev => <EventCard key={ev.id} event={ev} onRegister={() => openModal(ev)} />)}
              </div>}
        </>
      )}

      {/* PAST */}
      {tab === "past" && (
        <>
          <div style={S.filterRow}>
            <span style={{ fontSize: "0.85rem", color: "#888", marginRight: "4px" }}>Filter by:</span>
            {CATEGORIES.map(c => (
              <button key={c} style={catFilter === c ? S.filterActive : S.filterBtn} onClick={() => setCatFilter(c)}>{c}</button>
            ))}
          </div>
          <h2 style={S.secTitle}>Past Events ({pastEvents.length})</h2>
          {pastEvents.length === 0
            ? <p style={{ color: "#aaa" }}>No past events in this category.</p>
            : <div style={S.cardGrid}>
                {pastEvents.map(ev => <EventCard key={ev.id} event={ev} onRegister={() => {}} />)}
              </div>}
        </>
      )}

      {/* ANNOUNCEMENTS */}
      {tab === "announcements" && (
        <>
          <h2 style={S.secTitle}>Announcements</h2>
          {ANNOUNCEMENTS.map(a => {
            const st = ANN_STYLES[a.type]
            return (
              <div key={a.id} style={{ ...S.annCard, background: st.bg, border: st.border }}>
                <div style={{ ...S.annBar, background: st.bar }} />
                <div style={{ flex: 1 }}>
                  <div style={S.annTitle}>{a.title}</div>
                  <div style={S.annBody}>{a.body}</div>
                  <div style={S.annTime}>{a.time}</div>
                </div>
              </div>
            )
          })}
        </>
      )}

      {/* REGISTRATIONS */}
      {tab === "registrations" && (
        <>
          <h2 style={S.secTitle}>Registration Log</h2>
          {registrations.length === 0
            ? <p style={{ color: "#aaa" }}>No registrations yet. Register for an upcoming event to see the log here.</p>
            : registrations.map(r => (
                <div key={r.id} style={S.regCard}>
                  <div>
                    <div style={S.regName}>{r.name}</div>
                    <div style={S.regMeta}>{r.email} &middot; Reg No: {r.regNumber} &middot; {r.classSection}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <span style={S.regBadge}>{r.event}</span>
                    <span style={{ ...S.regMeta, fontSize: "0.75rem" }}>{r.time}</span>
                  </div>
                </div>
              ))
          }
        </>
      )}

      {/* ADD EVENT */}
      {tab === "manage" && <CoordinatorAddEvent setEvents={setEvents} />}

      {/* REGISTRATION MODAL */}
      {showModal && selectedEvent && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={S.modal}>
            <button onClick={() => setShowModal(false)} style={S.closeBtn}>x</button>
            <div style={S.modalTitle}>Register — {selectedEvent.title}</div>
            <div style={S.modalSub}>
              {new Date(selectedEvent.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} &middot; {selectedEvent.time} &nbsp;&nbsp; {selectedEvent.venue}
            </div>
            <form onSubmit={handleRegSubmit}>
              {[
                { name: "name",         placeholder: "Full Name",       type: "text"  },
                { name: "regNumber",    placeholder: "Register Number", type: "text"  },
                { name: "classSection", placeholder: "Class & Section", type: "text"  },
                { name: "email",        placeholder: "Email ID",        type: "email" },
              ].map(f => (
                <input key={f.name} type={f.type} name={f.name} placeholder={f.placeholder}
                  value={formData[f.name]} onChange={handleRegChange} required style={S.input} />
              ))}
              <button type="submit" style={S.submitBtn}>Confirm Registration</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Events