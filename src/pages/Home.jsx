import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"

const EMAILJS_SERVICE_ID  = "service_8nt7tjg"
const EMAILJS_TEMPLATE_ID = "template_lymx6pf"
const EMAILJS_PUBLIC_KEY  = "PVeprAvVczvcO8VbS"

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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])
  return isMobile
}

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
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

function loadEmailJS() {
  return new Promise((resolve) => {
    if (window.emailjs) return resolve(window.emailjs)
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
    script.onload = () => { window.emailjs.init(EMAILJS_PUBLIC_KEY); resolve(window.emailjs) }
    document.head.appendChild(script)
  })
}

function AlarmModal({ event, onClose }) {
  const [email, setEmail]   = useState("")
  const [status, setStatus] = useState("idle")
  const [errMsg, setErrMsg] = useState("")

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

  async function handleSend() {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrMsg("Please enter a valid email address.")
      return
    }
    setErrMsg(""); setStatus("sending")
    try {
      const ejs = await loadEmailJS()
      await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        student_email: email, event_name: event.title,
        event_date: formattedDate, event_time: event.time, event_venue: event.venue,
      })
      setStatus("success")
    } catch (err) {
      setErrMsg("Failed to send email. Please try again."); setStatus("idle")
    }
  }

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "16px"
    }}>
      <div style={{
        background: "white", borderRadius: "16px", padding: "28px",
        maxWidth: "440px", width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)", position: "relative",
        animation: "modalPop 0.22s ease"
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: "4px", lineHeight: 0 }}>
          <CloseIcon />
        </button>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem", color: "#1a1a1a", marginBottom: "8px" }}>You're registered!</div>
            <div style={{ color: "#555", fontSize: "0.93rem", lineHeight: "1.6" }}>
              A reminder email has been sent to <strong>{email}</strong> for <strong>{event.title}</strong>.
            </div>
            <button onClick={onClose} style={{ ...mStyles.btn, marginTop: "20px" }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <div style={{ background: "#e8f5e9", borderRadius: "10px", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", color: "#2f8d46", flexShrink: 0 }}>
                <BellIcon />
              </div>
              <div>
                <div style={{ fontWeight: "800", fontSize: "1rem", color: "#1a1a1a" }}>Set Reminder</div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>Get an email reminder for this event</div>
              </div>
            </div>
            <div style={{ background: "#f9fafb", border: "1px solid #e8f5e9", borderRadius: "10px", padding: "12px 14px", marginBottom: "18px" }}>
              <div style={{ fontWeight: "700", fontSize: "0.93rem", color: "#1a1a1a", marginBottom: "7px" }}>{event.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {[{ icon: <CalendarIcon />, text: formattedDate }, { icon: <ClockIcon />, text: event.time }, { icon: <LocationIcon />, text: event.venue }].map(({ icon, text }, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#555" }}>{icon} {text}</span>
                ))}
              </div>
            </div>
            <label style={{ display: "block", fontSize: "0.83rem", fontWeight: "600", color: "#333", marginBottom: "6px" }}>Your Email Address</label>
            <input type="email" placeholder="student@example.com" value={email}
              onChange={e => { setEmail(e.target.value); setErrMsg("") }}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              style={{ width: "100%", padding: "10px 12px", border: errMsg ? "1.5px solid #ef4444" : "1.5px solid #ddd", borderRadius: "8px", fontSize: "0.93rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            />
            {errMsg && <div style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "5px" }}>{errMsg}</div>}
            <button onClick={handleSend} disabled={status === "sending"}
              style={{ ...mStyles.btn, marginTop: "14px", opacity: status === "sending" ? 0.7 : 1, cursor: status === "sending" ? "not-allowed" : "pointer" }}>
              {status === "sending" ? "Sending…" : "Notify Me 🔔"}
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes modalPop { from { opacity:0; transform:scale(0.92) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  )
}

const mStyles = {
  btn: { width: "100%", background: "#2f8d46", color: "white", border: "none", borderRadius: "8px", padding: "11px", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }
}

function useCountdown(targetDate, targetTime) {
  const getTimeLeft = () => {
    const target = new Date(`${targetDate}T${convertTo24h(targetTime)}`)
    const diff = target - new Date()
    if (diff <= 0) return null
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    }
  }
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  useEffect(() => { const t = setInterval(() => setTimeLeft(getTimeLeft()), 1000); return () => clearInterval(t) }, [])
  return timeLeft
}

function convertTo24h(timeStr) {
  const [time, modifier] = timeStr.split(" ")
  let [hours, minutes] = time.split(":")
  if (modifier === "PM" && hours !== "12") hours = String(parseInt(hours, 10) + 12)
  if (modifier === "AM" && hours === "12") hours = "00"
  return `${hours.padStart(2, "0")}:${(minutes || "00").padStart(2, "0")}:00`
}

function EventAlert({ event }) {
  const timeLeft = useCountdown(event.date, event.time)
  const [showModal, setShowModal] = useState(false)
  const isMobile = useIsMobile()
  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

  return (
    <>
      <div style={{
        background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
        border: "1px solid #86efac", borderLeft: "5px solid #2f8d46",
        borderRadius: "12px", padding: isMobile ? "14px 16px" : "18px 24px",
        marginBottom: "28px",
        display: "flex", flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between", gap: "14px"
      }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <button onClick={() => setShowModal(true)} title="Set a reminder"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#2f8d46", marginTop: "2px", padding: 0, lineHeight: 0, transition: "transform 0.15s", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.25)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            <BellIcon />
          </button>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#2f8d46", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Upcoming Event</div>
            <div style={{ fontWeight: "800", fontSize: isMobile ? "0.97rem" : "1.05rem", color: "#1a1a1a", marginBottom: "6px" }}>{event.title}</div>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "4px" : "16px", flexWrap: "wrap" }}>
              {[{ icon: <CalendarIcon />, text: formattedDate }, { icon: <ClockIcon />, text: event.time }, { icon: <LocationIcon />, text: event.venue }].map(({ icon, text }, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.83rem", color: "#555" }}>{icon} {text}</span>
              ))}
            </div>
            <div style={{ marginTop: "6px", fontSize: "0.73rem", color: "#2f8d46", fontWeight: "600" }}>🔔 Click the bell to get a reminder email</div>
          </div>
        </div>

        {timeLeft ? (
          <div style={{ display: "flex", gap: "6px", flexShrink: 0, alignSelf: isMobile ? "center" : "auto" }}>
            {[{ val: timeLeft.days, label: "Days" }, { val: timeLeft.hours, label: "Hrs" }, { val: timeLeft.minutes, label: "Mins" }, { val: timeLeft.seconds, label: "Secs" }].map(({ val, label }) => (
              <div key={label} style={{ textAlign: "center", background: "white", border: "1px solid #bbf7d0", borderRadius: "8px", padding: isMobile ? "6px 8px" : "8px 12px", minWidth: isMobile ? "44px" : "52px" }}>
                <div style={{ fontSize: isMobile ? "1.1rem" : "1.3rem", fontWeight: "800", color: "#2f8d46", fontVariantNumeric: "tabular-nums" }}>{String(val).padStart(2, "0")}</div>
                <div style={{ fontSize: "0.62rem", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: "0.83rem", color: "#888", fontStyle: "italic" }}>Event in progress or completed</div>
        )}
      </div>
      {showModal && <AlarmModal event={event} onClose={() => setShowModal(false)} />}
    </>
  )
}

function DailyChallengeWidget({ quote, challenge }) {
  const [revealed, setRevealed] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div style={{ marginBottom: "36px" }}>
      {!revealed ? (
        <div onClick={() => setRevealed(true)} style={{ display: "flex", alignItems: "center", gap: "16px", background: "white", border: "1px solid #e0e0e0", borderLeft: "5px solid #2f8d46", borderRadius: "12px", padding: isMobile ? "16px 18px" : "22px 28px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ flexShrink: 0, background: "#e8f5e9", borderRadius: "50%", width: "46px", height: "46px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2f8d46" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
              <path d="M9 18h6"/><path d="M10 22h4"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#2f8d46", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Daily Challenge</div>
            <div style={{ fontSize: isMobile ? "0.93rem" : "1rem", fontWeight: "600", color: "#1a1a1a" }}>Click to reveal today's coding challenge</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      ) : (
        <div style={{ background: "white", border: "1px solid #e0e0e0", borderLeft: "5px solid #2f8d46", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: isMobile ? "16px 18px" : "22px 28px", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Quote of the Day</div>
            <div style={{ fontSize: isMobile ? "0.97rem" : "1.05rem", fontStyle: "italic", color: "#333", lineHeight: "1.7" }}>"{quote}"</div>
          </div>
          <div style={{ padding: isMobile ? "14px 18px" : "20px 28px", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Today's Coding Challenge</div>
              <div style={{ fontWeight: "700", fontSize: "0.97rem", color: "#1a1a1a" }}>{challenge.title}</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setRevealed(false)} style={{ background: "none", border: "1px solid #ddd", borderRadius: "6px", padding: "7px 12px", cursor: "pointer", fontSize: "0.82rem", color: "#888", fontFamily: "inherit" }}>Hide</button>
              <a href={challenge.link} target="_blank" rel="noreferrer" style={{ background: "#2f8d46", color: "white", padding: "7px 16px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.88rem", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>Solve Now</a>
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
  const isMobile  = useIsMobile()

  const styles = {
    page:         { padding: isMobile ? "20px 16px" : "40px 48px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1100px", margin: "0 auto", color: "#1a1a1a" },
    hero:         { textAlign: "center", padding: isMobile ? "32px 16px 28px" : "60px 20px 40px", background: "linear-gradient(135deg, #f0faf3 0%, #e8f5e9 100%)", borderRadius: "14px", marginBottom: "28px" },
    heroTitle:    { fontSize: isMobile ? "1.6rem" : "2.4rem", fontWeight: "800", color: "#1a1a1a", marginBottom: "10px" },
    heroSubtitle: { fontSize: isMobile ? "0.95rem" : "1.1rem", color: "#555", maxWidth: "560px", margin: "0 auto 22px", lineHeight: "1.6" },
    btn:          { background: "#2f8d46", color: "white", padding: isMobile ? "11px 22px" : "13px 28px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: isMobile ? "0.93rem" : "16px", fontWeight: "600", textDecoration: "none", display: "inline-block" },
    sectionHeader:{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" },
    sectionTitle: { fontSize: isMobile ? "1.1rem" : "1.4rem", fontWeight: "700", color: "#1a1a1a", borderLeft: "4px solid #2f8d46", paddingLeft: "12px", margin: 0 },
    viewAllLink:  { color: "#2f8d46", fontWeight: "700", textDecoration: "none", fontSize: "0.9rem" },
    cardGrid:     { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "36px" },
    card:         { border: "1px solid #e0e0e0", padding: "18px", borderRadius: "12px", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "8px" },
    cardTitle:    { fontWeight: "700", fontSize: "0.97rem", color: "#1a1a1a" },
    cardDesc:     { color: "#666", fontSize: "0.88rem", lineHeight: "1.5", flex: 1 },
    linkBtn:      { color: "#2f8d46", fontWeight: "700", textDecoration: "none", fontSize: "0.88rem" },
    registerBtn:  { background: "#2f8d46", color: "white", border: "none", borderRadius: "6px", padding: "8px 14px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", textDecoration: "none", display: "inline-block", alignSelf: "flex-start" },
  }

  return (
    <div style={styles.page}>
      <EventAlert event={UPCOMING_EVENTS[0]} />

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to GfG Campus Club — RIT</h1>
        <p style={styles.heroSubtitle}>Join our coding community to master Data Structures, participate in hackathons, and level up your skills.</p>
        <a href="https://chat.whatsapp.com/HZjaf6LCpEPCvgiJkdQxi8?mode=hqctswa" target="_blank" rel="noreferrer" style={styles.btn}>Join the Community</a>
      </div>

      <DailyChallengeWidget quote={quote} challenge={challenge} />

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Upcoming Events</h2>
        <Link to="/events" style={styles.viewAllLink}>View All →</Link>
      </div>
      <div style={styles.cardGrid}>
        {UPCOMING_EVENTS.map(ev => (
          <div key={ev.title} style={styles.card}>
            <div style={styles.cardTitle}>{ev.title}</div>
            <div style={{ color: "#2f8d46", fontSize: "0.86rem", fontWeight: "600" }}>
              {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {ev.time}
            </div>
            <Link to="/events" style={styles.registerBtn}>Register</Link>
          </div>
        ))}
      </div>

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Learning Resources</h2>
        <Link to="/resources" style={styles.viewAllLink}>Explore More →</Link>
      </div>
      <div style={styles.cardGrid}>
        {LEARNING_RESOURCES.map(res => (
          <div key={res.title} style={styles.card}>
            <div style={styles.cardTitle}>{res.title}</div>
            <div style={styles.cardDesc}>{res.desc}</div>
            <a href={res.link} target="_blank" rel="noreferrer" style={styles.linkBtn}>Explore →</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home