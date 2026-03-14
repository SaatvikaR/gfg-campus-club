import { useState, useMemo } from "react"

const INITIAL_STUDENTS = [
  { id: 1, name: "Rahul",   score: 320, events: 8, streak: 12, badges: ["🏆","🔥","⭐"] },
  { id: 2, name: "Priya",   score: 290, events: 6, streak: 9,  badges: ["🥈","⭐"] },
  { id: 3, name: "Arjun",   score: 250, events: 5, streak: 7,  badges: ["🥉","🔥"] },
  { id: 4, name: "Sneha",   score: 210, events: 4, streak: 5,  badges: ["⭐"] },
  { id: 5, name: "Vikram",  score: 180, events: 3, streak: 3,  badges: [] },
]

const ACHIEVEMENTS = [
  { id: "century",     icon: "💯", label: "Century Club",    desc: "Score 100+ points",       threshold: (s) => s.score >= 100 },
  { id: "trailblazer", icon: "🔥", label: "Trailblazer",     desc: "7-day problem streak",     threshold: (s) => s.streak >= 7 },
  { id: "eventstar",   icon: "⭐", label: "Event Star",       desc: "Attend 5+ events",         threshold: (s) => s.events >= 5 },
  { id: "elite",       icon: "🏆", label: "Elite Coder",     desc: "Score 300+ points",        threshold: (s) => s.score >= 300 },
  { id: "consistent",  icon: "📅", label: "Consistent",      desc: "10-day streak",            threshold: (s) => s.streak >= 10 },
  { id: "social",      icon: "🤝", label: "Community Hero",  desc: "Attend 8+ events",         threshold: (s) => s.events >= 8 },
]

const MEDALS = ["🥇", "🥈", "🥉"]

const S = {
  page:       { padding: "40px 48px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1100px", margin: "0 auto", color: "#1a1a1a" },
  title:      { fontSize: "2rem", fontWeight: "800", marginBottom: "6px", textAlign: "left" },
  subtitle:   { color: "#666", fontSize: "1rem", marginBottom: "36px", textAlign: "left" },
  secTitle:   { fontSize: "1.2rem", fontWeight: "700", borderLeft: "4px solid #2f8d46", paddingLeft: "12px", marginBottom: "20px", textAlign: "left" },
  statRow:    { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "36px" },
  statCard:   { background: "white", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" },
  statNum:    { fontSize: "2rem", fontWeight: "800", color: "#2f8d46" },
  statLabel:  { fontSize: "0.85rem", color: "#888", marginTop: "4px" },
  tabRow:     { display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" },
  tab:        { padding: "9px 20px", borderRadius: "8px", border: "1px solid #ddd", background: "white", cursor: "pointer", fontWeight: "600", fontSize: "0.88rem", color: "#555" },
  tabActive:  { padding: "9px 20px", borderRadius: "8px", border: "1px solid #2f8d46", background: "#2f8d46", cursor: "pointer", fontWeight: "600", fontSize: "0.88rem", color: "white" },
  table:      { width: "100%", borderCollapse: "collapse", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: "44px" },
  thead:      { background: "#2f8d46", color: "white" },
  th:         { padding: "13px 16px", textAlign: "left", fontWeight: "600", fontSize: "0.88rem" },
  td:         { padding: "12px 16px", borderBottom: "1px solid #f0f0f0", fontSize: "0.92rem", verticalAlign: "middle" },
  trEven:     { background: "#f7faf8" },
  barWrap:    { background: "#e8f5e9", borderRadius: "999px", height: "8px", width: "90px", overflow: "hidden", display: "inline-block", verticalAlign: "middle" },
  bar:        { height: "100%", background: "#2f8d46", borderRadius: "999px", display: "block" },
  achGrid:    { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "44px" },
  achCard:    { border: "1px solid #e0e0e0", borderRadius: "12px", padding: "22px", background: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" },
  achIcon:    { fontSize: "2rem", marginBottom: "8px" },
  achLabel:   { fontWeight: "700", fontSize: "0.97rem", marginBottom: "4px" },
  achDesc:    { color: "#888", fontSize: "0.85rem", marginBottom: "10px" },
  achEarned:  { fontSize: "0.82rem", color: "#2f8d46", fontWeight: "600" },
  achLocked:  { fontSize: "0.82rem", color: "#ccc", fontWeight: "600" },
  partCard:   { background: "white", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "18px 22px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", marginBottom: "12px" },
  partName:   { fontWeight: "700", fontSize: "0.97rem", marginBottom: "10px", textAlign: "left" },
  partRow:    { display: "flex", gap: "28px", flexWrap: "wrap", alignItems: "center" },
  partStat:   { fontSize: "0.85rem", color: "#555" },
  partVal:    { fontWeight: "700", color: "#2f8d46" },
  formBox:    { background: "#f9fafb", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "24px" },
  input:      { width: "100%", padding: "11px 14px", margin: "7px 0", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.95rem", boxSizing: "border-box", fontFamily: "inherit" },
  btn:        { background: "#2f8d46", color: "white", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem", fontWeight: "600", width: "100%", marginTop: "8px" },
  error:      { color: "#d32f2f", fontSize: "0.88rem", margin: "4px 0 8px", textAlign: "left" },
  successMsg: { background: "#e8f5e9", color: "#2f8d46", padding: "12px 16px", borderRadius: "8px", fontWeight: "600", marginTop: "12px", border: "1px solid #c8e6c9", fontSize: "0.9rem" },
}

const TAB_LABELS = {
  leaderboard:   "🏆 Leaderboard",
  achievements:  "🎖️ Achievements",
  participation: "📊 Participation",
  add:           "➕ Add Student",
}

function Community() {
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [tab, setTab]           = useState("leaderboard")
  const [form, setForm]         = useState({ name: "", score: "", events: "", streak: "" })
  const [error, setError]       = useState("")
  const [addedMsg, setAddedMsg] = useState("")

  const sorted   = useMemo(() => [...students].sort((a, b) => b.score - a.score), [students])
  const maxScore = sorted[0]?.score || 1

  const stats = [
    { num: students.length, label: "Members" },
    { num: students.reduce((s, x) => s + x.score, 0),  label: "Problems Solved" },
    { num: students.reduce((s, x) => s + x.events, 0), label: "Event Participations" },
    { num: `${Math.round(students.reduce((s, x) => s + x.streak, 0) / students.length)}d`, label: "Avg Streak" },
  ]

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = (e) => {
    e.preventDefault()
    const trimName     = form.name.trim()
    const parsedScore  = parseInt(form.score, 10)
    const parsedEvents = parseInt(form.events, 10)
    const parsedStreak = parseInt(form.streak, 10)
    if (!trimName)                               { setError("Enter a valid name."); return }
    if (isNaN(parsedScore)  || parsedScore < 0)  { setError("Enter a valid score."); return }
    if (isNaN(parsedEvents) || parsedEvents < 0) { setError("Enter valid events count."); return }
    if (isNaN(parsedStreak) || parsedStreak < 0) { setError("Enter valid streak days."); return }

    const earned = ACHIEVEMENTS
      .filter(a => a.threshold({ score: parsedScore, events: parsedEvents, streak: parsedStreak }))
      .map(a => a.icon)

    setError("")
    setStudents(prev => [...prev, { id: Date.now(), name: trimName, score: parsedScore, events: parsedEvents, streak: parsedStreak, badges: earned }])
    setAddedMsg(`✅ ${trimName} added to the leaderboard!`)
    setForm({ name: "", score: "", events: "", streak: "" })
    setTimeout(() => setAddedMsg(""), 3000)
  }

  return (
    <div style={S.page}>
      <h1 style={S.title}>Community Hub</h1>
      <p style={S.subtitle}>Track participation, celebrate achievements, and compete on the leaderboard.</p>

      {/* STATS */}
      <div style={S.statRow}>
        {stats.map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={S.statNum}>{s.num}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={S.tabRow}>
        {Object.keys(TAB_LABELS).map(t => (
          <button key={t} style={tab === t ? S.tabActive : S.tab} onClick={() => setTab(t)}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* LEADERBOARD */}
      {tab === "leaderboard" && (
        <>
          <h2 style={S.secTitle}>Rankings</h2>
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                {["Rank","Name","Score","Progress","Events","Streak","Badges"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => (
                <tr key={s.id} style={i % 2 === 1 ? S.trEven : {}}>
                  <td style={S.td}>{i < 3 ? MEDALS[i] : i + 1}</td>
                  <td style={{ ...S.td, fontWeight: "600" }}>{s.name}</td>
                  <td style={S.td}>{s.score}</td>
                  <td style={S.td}>
                    <div style={S.barWrap}>
                      <div style={{ ...S.bar, width: `${Math.round((s.score / maxScore) * 100)}%` }} />
                    </div>
                  </td>
                  <td style={S.td}>{s.events}</td>
                  <td style={S.td}>🔥 {s.streak}d</td>
                  <td style={S.td}>
                    {s.badges.length > 0
                      ? s.badges.map((b, j) => <span key={j} style={{ marginRight: "2px" }}>{b}</span>)
                      : <span style={{ color: "#ccc" }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ACHIEVEMENTS */}
      {tab === "achievements" && (
        <>
          <h2 style={S.secTitle}>Achievement Badges</h2>
          <div style={S.achGrid}>
            {ACHIEVEMENTS.map(ach => {
              const earners = students.filter(s => ach.threshold(s))
              return (
                <div key={ach.id} style={S.achCard}>
                  <div style={S.achIcon}>{ach.icon}</div>
                  <div style={S.achLabel}>{ach.label}</div>
                  <div style={S.achDesc}>{ach.desc}</div>
                  {earners.length > 0
                    ? <div style={S.achEarned}>Earned by: {earners.map(s => s.name).join(", ")}</div>
                    : <div style={S.achLocked}>Not yet earned</div>}
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* PARTICIPATION */}
      {tab === "participation" && (
        <>
          <h2 style={S.secTitle}>Student Participation</h2>
          {sorted.map(s => (
            <div key={s.id} style={S.partCard}>
              <div style={S.partName}>{s.name}</div>
              <div style={S.partRow}>
                <div style={S.partStat}>Score: <span style={S.partVal}>{s.score}</span></div>
                <div style={S.partStat}>Events: <span style={S.partVal}>{s.events}</span></div>
                <div style={S.partStat}>Streak: <span style={S.partVal}>{s.streak} days</span></div>
                <div style={S.partStat}>Badges: <span style={S.partVal}>{s.badges.length > 0 ? s.badges.join(" ") : "None"}</span></div>
                <div style={S.partStat}>
                  Progress:&nbsp;
                  <div style={{ ...S.barWrap, width: "120px" }}>
                    <div style={{ ...S.bar, width: `${Math.round((s.score / maxScore) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ADD STUDENT */}
      {tab === "add" && (
        <>
          <h2 style={S.secTitle}>Add a Student</h2>
          <div style={{ maxWidth: "520px" }}>
            <div style={S.formBox}>
              <form onSubmit={handleAdd}>
                {[
                  { name: "name",   placeholder: "Student Name",          type: "text"   },
                  { name: "score",  placeholder: "Score (problems solved)",type: "number" },
                  { name: "events", placeholder: "Events Attended",        type: "number" },
                  { name: "streak", placeholder: "Current Streak (days)",  type: "number" },
                ].map(f => (
                  <input key={f.name} type={f.type} name={f.name} placeholder={f.placeholder}
                    value={form[f.name]} onChange={handleChange} style={S.input} min={f.type === "number" ? "0" : undefined} />
                ))}
                {error && <p style={S.error}>{error}</p>}
                <button type="submit" style={S.btn}>Add to Leaderboard</button>
              </form>
              {addedMsg && <div style={S.successMsg}>{addedMsg}</div>}
            </div>
            <p style={{ color: "#888", fontSize: "0.85rem", marginTop: "10px", textAlign: "left" }}>
              Achievements are auto-assigned based on score, events attended, and streak.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Community