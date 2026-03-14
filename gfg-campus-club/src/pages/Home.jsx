import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"

const QUOTES = [
  "The best way to predict the future is to code it.",
  "Great developers never stop learning.",
  "Practice coding every day to improve.",
  "Consistency is the key to mastering programming.",
  "First, solve the problem. Then, write the code."
]

const DAILY_CHALLENGES = [
  { title: "Two Sum", link: "https://practice.geeksforgeeks.org/problems/two-sum/0" },
  { title: "Reverse a Linked List", link: "https://practice.geeksforgeeks.org/problems/reverse-a-linked-list/1" },
  { title: "Find the Missing Number", link: "https://practice.geeksforgeeks.org/problems/missing-number-in-array/0" },
  { title: "Longest Substring Without Repeating Characters", link: "https://practice.geeksforgeeks.org/problems/longest-substring-without-repeating-characters/0" },
  { title: "Maximum Subarray Sum", link: "https://practice.geeksforgeeks.org/problems/kadanes-algorithm/0" }
]

const UPCOMING_EVENTS = [
  { title: "DSA Bootcamp", date: "2026-03-25", time: "10:00 AM", venue: "Green Building, 4th Floor — Woziak Auditorium" },
  { title: "Weekly Coding Contest", date: "2026-03-30", time: "2:00 PM", venue: "Green Building, 4th Floor — Woziak Auditorium" },
  { title: "Web Development Workshop", date: "2026-04-05", time: "11:00 AM", venue: "Green Building, 4th Floor — Woziak Auditorium" }
]

const LEARNING_RESOURCES = [
  { title: "Data Structures & Algorithms", desc: "Practice problems and master DSA concepts.", link: "https://www.geeksforgeeks.org/data-structures/" },
  { title: "Web Development", desc: "Learn HTML, CSS, JavaScript and modern frameworks.", link: "https://www.geeksforgeeks.org/web-development/" },
  { title: "Interview Preparation", desc: "Prepare for technical interviews and coding rounds.", link: "https://www.geeksforgeeks.org/interview-preparation-for-software-developer/" }
]

// SVG Icons
const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const LocationIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

function useCountdown(targetDate, targetTime) {
  const getTimeLeft = () => {
    const target = new Date(`${targetDate}T${convertTo24h(targetTime)}`)
    const diff = target - new Date()
    if (diff <= 0) return null
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return { days, hours, minutes, seconds }
  }

  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])
  return timeLeft
}

function convertTo24h(timeStr) {
  const [time, modifier] = timeStr.split(" ")
  let [hours, minutes]   = time.split(":")
  if (modifier === "PM" && hours !== "12") hours = String(parseInt(hours, 10) + 12)
  if (modifier === "AM" && hours === "12") hours = "00"
  return `${hours.padStart(2, "0")}:${(minutes || "00").padStart(2, "0")}:00`
}

function EventAlert({ event }) {
  const timeLeft = useCountdown(event.date, event.time)
  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

  return (
    <div style={{
      background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
      border: "1px solid #86efac",
      borderLeft: "5px solid #2f8d46",
      borderRadius: "12px",
      padding: "18px 24px",
      marginBottom: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "16px"
    }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <div style={{ color: "#2f8d46", marginTop: "2px" }}><BellIcon /></div>
        <div>
          <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#2f8d46", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
            Upcoming Event
          </div>
          <div style={{ fontWeight: "800", fontSize: "1.05rem", color: "#1a1a1a", marginBottom: "6px" }}>{event.title}</div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", color: "#555" }}>
              <CalendarIcon /> {formattedDate}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", color: "#555" }}>
              <ClockIcon /> {event.time}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", color: "#555" }}>
              <LocationIcon /> {event.venue}
            </span>
          </div>
        </div>
      </div>

      {timeLeft ? (
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          {[{ val: timeLeft.days, label: "Days" }, { val: timeLeft.hours, label: "Hours" }, { val: timeLeft.minutes, label: "Mins" }, { val: timeLeft.seconds, label: "Secs" }].map(({ val, label }) => (
            <div key={label} style={{ textAlign: "center", background: "white", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", minWidth: "52px" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#2f8d46", fontVariantNumeric: "tabular-nums" }}>
                {String(val).padStart(2, "0")}
              </div>
              <div style={{ fontSize: "0.68rem", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: "0.85rem", color: "#888", fontStyle: "italic" }}>Event in progress or completed</div>
      )}
    </div>
  )
}

const styles = {
  page:         { padding: "40px 48px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1100px", margin: "0 auto", color: "#1a1a1a" },
  hero:         { textAlign: "center", padding: "60px 20px 40px", background: "linear-gradient(135deg, #f0faf3 0%, #e8f5e9 100%)", borderRadius: "16px", marginBottom: "40px" },
  heroTitle:    { fontSize: "2.4rem", fontWeight: "800", color: "#1a1a1a", marginBottom: "12px" },
  heroSubtitle: { fontSize: "1.1rem", color: "#555", maxWidth: "560px", margin: "0 auto 28px" },
  btn:          { background: "#2f8d46", color: "white", padding: "13px 28px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "600", textDecoration: "none", display: "inline-block" },
  sectionHeader:{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" },
  sectionTitle: { fontSize: "1.4rem", fontWeight: "700", color: "#1a1a1a", borderLeft: "4px solid #2f8d46", paddingLeft: "12px", margin: 0 },
  viewAllLink:  { color: "#2f8d46", fontWeight: "700", textDecoration: "none", fontSize: "0.95rem" },
  cardGrid:     { display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" },
  card:         { border: "1px solid #e0e0e0", padding: "20px", width: "230px", borderRadius: "12px", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "8px" },
  cardTitle:    { fontWeight: "700", fontSize: "1rem", color: "#1a1a1a" },
  cardDesc:     { color: "#666", fontSize: "0.9rem", lineHeight: "1.5", flex: 1 },
  linkBtn:      { color: "#2f8d46", fontWeight: "700", textDecoration: "none", fontSize: "0.9rem" },
  registerBtn:  { background: "#2f8d46", color: "white", border: "none", borderRadius: "6px", padding: "8px 14px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", marginTop: "4px", textDecoration: "none", display: "inline-block" },
}

function DailyChallengeWidget({ quote, challenge }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div style={{ marginBottom: "40px" }}>
      {!revealed ? (
        <div onClick={() => setRevealed(true)} style={{ display: "flex", alignItems: "center", gap: "20px", background: "white", border: "1px solid #e0e0e0", borderLeft: "5px solid #2f8d46", borderRadius: "12px", padding: "22px 28px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ flexShrink: 0, background: "#e8f5e9", borderRadius: "50%", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f8d46" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
              <path d="M9 18h6"/><path d="M10 22h4"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#2f8d46", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Daily Challenge</div>
            <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1a1a1a" }}>Click to reveal today's coding challenge</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      ) : (
        <div style={{ background: "white", border: "1px solid #e0e0e0", borderLeft: "5px solid #2f8d46", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "22px 28px", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Quote of the Day</div>
            <div style={{ fontSize: "1.1rem", fontStyle: "italic", color: "#333", lineHeight: "1.7" }}>"{quote}"</div>
          </div>
          <div style={{ padding: "20px 28px", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Today's Coding Challenge</div>
              <div style={{ fontWeight: "700", fontSize: "1rem", color: "#1a1a1a" }}>{challenge.title}</div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setRevealed(false)} style={{ background: "none", border: "1px solid #ddd", borderRadius: "6px", padding: "7px 14px", cursor: "pointer", fontSize: "0.82rem", color: "#888", fontFamily: "inherit" }}>
                Hide
              </button>
              <a href={challenge.link} target="_blank" rel="noreferrer" style={styles.btn}>
                Solve Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Home() {
  const quote     = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])
  const challenge = useMemo(() => DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)], [])

  return (
    <div style={styles.page}>

      {/* UPCOMING EVENT ALERT */}
      <EventAlert event={UPCOMING_EVENTS[0]} />

      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to GfG Campus Club — RIT</h1>
        <p style={styles.heroSubtitle}>Join our coding community to master Data Structures, participate in hackathons, and level up your skills.</p>
        <a href="https://chat.whatsapp.com/HZjaf6LCpEPCvgiJkdQxi8?mode=hqctswa" target="_blank" rel="noreferrer" style={styles.btn}>Join the Community</a>
      </div>

      {/* DAILY CHALLENGE WIDGET */}
      <DailyChallengeWidget quote={quote} challenge={challenge} />

      {/* UPCOMING EVENTS */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Upcoming Events</h2>
        <Link to="/events" style={styles.viewAllLink}>View All Events →</Link>
      </div>
      <div style={styles.cardGrid}>
        {UPCOMING_EVENTS.map(ev => (
          <div key={ev.title} style={styles.card}>
            <div style={styles.cardTitle}>{ev.title}</div>
            <div style={{ color: "#2f8d46", fontSize: "0.88rem", fontWeight: "600" }}>
              {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} &middot; {ev.time}
            </div>
            <Link to="/events" style={styles.registerBtn}>Register</Link>
          </div>
        ))}
      </div>

      {/* LEARNING RESOURCES */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Learning Resources</h2>
        <Link to="/resources" style={styles.viewAllLink}>Explore More Resources →</Link>
      </div>
      <div style={styles.cardGrid}>
        {LEARNING_RESOURCES.map(res => (
          <div key={res.title} style={styles.card}>
            <div style={styles.cardTitle}>{res.title}</div>
            <div style={styles.cardDesc}>{res.desc}</div>
            <a href={res.link} target="_blank" rel="noreferrer" style={styles.linkBtn}>Explore</a>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Home