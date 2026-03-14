import { useState, useMemo, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])
  return isMobile
}

const SEED_STUDENTS = [
  { name: "Rahul",  score: 320, events: 8, streak: 12, badges: "🏆,🔥,⭐" },
  { name: "Priya",  score: 290, events: 6, streak: 9,  badges: "🥈,⭐"    },
  { name: "Arjun",  score: 250, events: 5, streak: 7,  badges: "🥉,🔥"    },
  { name: "Sneha",  score: 210, events: 4, streak: 5,  badges: "⭐"       },
  { name: "Vikram", score: 180, events: 3, streak: 3,  badges: ""         },
]

const ACHIEVEMENTS = [
  { id: "century",     icon: "💯", label: "Century Club",   desc: "Score 100+ points",  threshold: s => s.score  >= 100 },
  { id: "trailblazer", icon: "🔥", label: "Trailblazer",    desc: "7-day streak",        threshold: s => s.streak >= 7   },
  { id: "eventstar",   icon: "⭐", label: "Event Star",      desc: "Attend 5+ events",    threshold: s => s.events >= 5   },
  { id: "elite",       icon: "🏆", label: "Elite Coder",    desc: "Score 300+ points",   threshold: s => s.score  >= 300 },
  { id: "consistent",  icon: "📅", label: "Consistent",     desc: "10-day streak",       threshold: s => s.streak >= 10  },
  { id: "social",      icon: "🤝", label: "Community Hero", desc: "Attend 8+ events",    threshold: s => s.events >= 8   },
]

const MEDALS     = ["🥇", "🥈", "🥉"]
const COORD_PASS = "gfgrit2026"
let   seeded     = false

const TAB_LABELS = { leaderboard: "Leaderboard", achievements: "Achievements", participation: "Participation", coordinator: "Coordinator" }

function CoordinatorGate({ onUnlock, isMobile }) {
  const [pw, setPw]       = useState("")
  const [error, setError] = useState("")

  const handleUnlock = e => {
    e.preventDefault()
    if (pw === COORD_PASS) onUnlock()
    else setError("Incorrect password. Access restricted to coordinators.")
  }

  const inputStyle = { width: "100%", padding: "10px 13px", margin: "0 0 10px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.93rem", boxSizing: "border-box", fontFamily: "inherit" }

  return (
    <div>
      <h2 style={{ fontSize: isMobile ? "1.05rem" : "1.2rem", fontWeight: "700", borderLeft: "4px solid #2f8d46", paddingLeft: "12px", marginBottom: "18px" }}>Coordinator Access</h2>
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: isMobile ? "20px 16px" : "28px", maxWidth: "420px" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#92400e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Restricted</div>
        <div style={{ fontWeight: "700", fontSize: "1rem", marginBottom: "6px" }}>Coordinator Only</div>
        <p style={{ color: "#666", fontSize: "0.88rem", marginBottom: "18px", lineHeight: "1.6" }}>Adding and updating student scores is restricted to club coordinators.</p>
        <form onSubmit={handleUnlock}>
          <input type="password" placeholder="Coordinator Password" value={pw} onChange={e => setPw(e.target.value)} required style={inputStyle} />
          {error && <p style={{ color: "#d32f2f", fontSize: "0.86rem", margin: "0 0 10px" }}>{error}</p>}
          <button type="submit" style={{ width: "100%", background: "#2f8d46", color: "white", border: "none", padding: "11px", borderRadius: "8px", cursor: "pointer", fontSize: "0.93rem", fontWeight: "600", fontFamily: "inherit" }}>Unlock</button>
        </form>
      </div>
    </div>
  )
}

function CoordinatorPanel({ students, onAdd, onUpdate, onDelete, onLock, isMobile }) {
  const [form,     setForm]     = useState({ name: "", score: "", events: "", streak: "" })
  const [editId,   setEditId]   = useState(null)
  const [editData, setEditData] = useState({})
  const [error,    setError]    = useState("")
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState("")

  const inputStyle = { width: "100%", padding: "10px 13px", margin: "6px 0", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.93rem", boxSizing: "border-box", fontFamily: "inherit" }
  const editInput  = { padding: "5px 8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.85rem", width: "64px", fontFamily: "inherit" }

  const handleAdd = async e => {
    e.preventDefault()
    const trimName = form.name.trim(), ps = parseInt(form.score, 10), pe = parseInt(form.events, 10), pk = parseInt(form.streak, 10)
    if (!trimName)                  { setError("Enter a valid name."); return }
    if (isNaN(ps) || ps < 0)        { setError("Enter a valid score."); return }
    if (isNaN(pe) || pe < 0)        { setError("Enter valid events count."); return }
    if (isNaN(pk) || pk < 0)        { setError("Enter valid streak days."); return }
    setError(""); setSaving(true)
    const earned = ACHIEVEMENTS.filter(a => a.threshold({ score: ps, events: pe, streak: pk })).map(a => a.icon).join(",")
    await onAdd({ name: trimName, score: ps, events: pe, streak: pk, badges: earned })
    setSaving(false); setMsg(trimName + " added!"); setForm({ name: "", score: "", events: "", streak: "" })
    setTimeout(() => setMsg(""), 3000)
  }

  const handleSaveEdit = async id => {
    const earned = ACHIEVEMENTS.filter(a => a.threshold({ score: parseInt(editData.score), events: parseInt(editData.events), streak: parseInt(editData.streak) })).map(a => a.icon).join(",")
    await onUpdate(id, { ...editData, score: parseInt(editData.score), events: parseInt(editData.events), streak: parseInt(editData.streak), badges: earned })
    setEditId(null); setMsg("Score updated!"); setTimeout(() => setMsg(""), 3000)
  }

  const sorted = [...students].sort((a, b) => b.score - a.score)

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: isMobile ? "1.05rem" : "1.2rem", fontWeight: "700", borderLeft: "4px solid #2f8d46", paddingLeft: "12px", margin: 0 }}>Coordinator Panel</h2>
        <span style={{ background: "#e8f5e9", color: "#2f8d46", padding: "3px 12px", borderRadius: "999px", fontSize: "0.76rem", fontWeight: "700" }}>Unlocked</span>
        <button onClick={onLock} style={{ marginLeft: "auto", background: "none", border: "1px solid #ddd", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontSize: "0.82rem", color: "#888", fontFamily: "inherit" }}>Lock</button>
      </div>

      <h3 style={{ fontWeight: "700", fontSize: "0.97rem", marginBottom: "12px" }}>Add New Student</h3>
      <div style={{ background: "#f9fafb", border: "1px solid #e8e8e8", borderRadius: "12px", padding: isMobile ? "16px" : "24px", maxWidth: "520px", marginBottom: "32px" }}>
        <form onSubmit={handleAdd}>
          {[{ name: "name", placeholder: "Student Name", type: "text" }, { name: "score", placeholder: "Problems Solved (Score)", type: "number" }, { name: "events", placeholder: "Events Attended", type: "number" }, { name: "streak", placeholder: "Current Streak (days)", type: "number" }].map(f => (
            <input key={f.name} type={f.type} name={f.name} placeholder={f.placeholder} value={form[f.name]}
              onChange={e => setForm({ ...form, [e.target.name]: e.target.value })} style={inputStyle} min={f.type === "number" ? "0" : undefined} />
          ))}
          {error && <p style={{ color: "#d32f2f", fontSize: "0.86rem", margin: "4px 0 8px" }}>{error}</p>}
          <button type="submit" disabled={saving} style={{ width: "100%", background: "#2f8d46", color: "white", border: "none", padding: "11px", borderRadius: "8px", cursor: "pointer", fontSize: "0.93rem", fontWeight: "600", marginTop: "6px", opacity: saving ? 0.7 : 1, fontFamily: "inherit" }}>
            {saving ? "Saving..." : "Add Student"}
          </button>
        </form>
        {msg && <div style={{ background: "#e8f5e9", color: "#2f8d46", padding: "11px 14px", borderRadius: "8px", fontWeight: "600", marginTop: "10px", border: "1px solid #c8e6c9" }}>✅ {msg}</div>}
      </div>

      <h3 style={{ fontWeight: "700", fontSize: "0.97rem", marginBottom: "12px" }}>Update Existing Scores</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: "40px" }}>
          <thead style={{ background: "#2f8d46", color: "white" }}>
            <tr>{["Rank","Name","Score","Events","Streak","Actions"].map(h => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: "600", fontSize: "0.86rem" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 1 ? "#f7faf8" : "white" }}>
                <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem" }}>{i < 3 ? MEDALS[i] : i + 1}</td>
                <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem", fontWeight: "600" }}>{s.name}</td>
                {editId === s.id ? (
                  <>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0" }}><input type="number" value={editData.score}  onChange={e => setEditData({ ...editData, score:  e.target.value })} style={editInput} /></td>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0" }}><input type="number" value={editData.events} onChange={e => setEditData({ ...editData, events: e.target.value })} style={editInput} /></td>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0" }}><input type="number" value={editData.streak} onChange={e => setEditData({ ...editData, streak: e.target.value })} style={editInput} /></td>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0" }}>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button onClick={() => handleSaveEdit(s.id)} style={{ background: "#2f8d46", color: "white", border: "none", borderRadius: "6px", padding: "5px 11px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600", fontFamily: "inherit" }}>Save</button>
                        <button onClick={() => setEditId(null)} style={{ background: "#f9fafb", color: "#888", border: "1px solid #ddd", borderRadius: "6px", padding: "5px 11px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600", fontFamily: "inherit" }}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem" }}>{s.score}</td>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem" }}>{s.events}</td>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem" }}>{s.streak}d</td>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0" }}>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button onClick={() => { setEditId(s.id); setEditData({ score: s.score, events: s.events, streak: s.streak }) }} style={{ background: "#2f8d46", color: "white", border: "none", borderRadius: "6px", padding: "5px 11px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600", fontFamily: "inherit" }}>Edit</button>
                        <button onClick={() => onDelete(s.id)} style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "6px", padding: "5px 11px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600", fontFamily: "inherit" }}>Delete</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Community() {
  const [students,      setStudents]      = useState([])
  const [tab,           setTab]           = useState("leaderboard")
  const [loading,       setLoading]       = useState(true)
  const [coordUnlocked, setCoordUnlocked] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => { loadStudents() }, [])

  const loadStudents = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("students").select("*").order("score", { ascending: false })
    if (error) { setLoading(false); return }
    if (data.length === 0 && !seeded) {
      seeded = true
      const { data: inserted } = await supabase.from("students").insert(SEED_STUDENTS).select()
      if (inserted) setStudents(inserted.sort((a, b) => b.score - a.score))
    } else { setStudents(data) }
    setLoading(false)
  }

  const handleAdd    = async newStudent => { const { data } = await supabase.from("students").insert([newStudent]).select().single(); if (data) setStudents(prev => [...prev, data].sort((a, b) => b.score - a.score)) }
  const handleUpdate = async (id, updated) => { const { data } = await supabase.from("students").update(updated).eq("id", id).select().single(); if (data) setStudents(prev => prev.map(s => s.id === id ? data : s).sort((a, b) => b.score - a.score)) }
  const handleDelete = async id => { await supabase.from("students").delete().eq("id", id); setStudents(prev => prev.filter(s => s.id !== id)) }

  const sorted   = useMemo(() => [...students].sort((a, b) => b.score - a.score), [students])
  const maxScore = sorted[0]?.score || 1
  const stats    = [
    { num: students.length, label: "Members" },
    { num: students.reduce((s, x) => s + x.score, 0), label: "Problems Solved" },
    { num: students.reduce((s, x) => s + x.events, 0), label: "Event Participations" },
    { num: students.length > 0 ? Math.round(students.reduce((s, x) => s + x.streak, 0) / students.length) + "d" : "0d", label: "Avg Streak" },
  ]

  const S = {
    page:     { padding: isMobile ? "20px 16px" : "40px 48px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1100px", margin: "0 auto", color: "#1a1a1a" },
    title:    { fontSize: isMobile ? "1.6rem" : "2rem", fontWeight: "800", marginBottom: "6px" },
    subtitle: { color: "#666", fontSize: isMobile ? "0.93rem" : "1rem", marginBottom: "28px" },
    secTitle: { fontSize: isMobile ? "1.05rem" : "1.2rem", fontWeight: "700", borderLeft: "4px solid #2f8d46", paddingLeft: "12px", marginBottom: "18px" },
    statRow:  { display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" },
    tabRow:   { display: "flex", gap: "7px", marginBottom: "24px", flexWrap: "wrap" },
    tab:      { padding: isMobile ? "7px 12px" : "9px 18px", borderRadius: "8px", border: "1px solid #ddd", background: "white", cursor: "pointer", fontWeight: "600", fontSize: isMobile ? "0.8rem" : "0.88rem", color: "#555", fontFamily: "inherit" },
    tabActive:{ padding: isMobile ? "7px 12px" : "9px 18px", borderRadius: "8px", border: "none", background: "#2f8d46", cursor: "pointer", fontWeight: "600", fontSize: isMobile ? "0.8rem" : "0.88rem", color: "white", fontFamily: "inherit" },
    achGrid:  { display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: "14px", marginBottom: "40px" },
  }

  if (loading) return <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>Loading community data...</div>

  return (
    <div style={S.page}>
      <h1 style={S.title}>Community Hub</h1>
      <p style={S.subtitle}>Track participation, celebrate achievements, and compete on the leaderboard.</p>

      <div style={S.statRow}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "white", border: "1px solid #e8e8e8", borderRadius: "12px", padding: isMobile ? "16px" : "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" }}>
            <div style={{ fontSize: isMobile ? "1.6rem" : "2rem", fontWeight: "800", color: "#2f8d46" }}>{s.num}</div>
            <div style={{ fontSize: "0.82rem", color: "#888", marginTop: "3px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={S.tabRow}>
        {Object.keys(TAB_LABELS).map(t => (
          <button key={t} style={tab === t ? S.tabActive : S.tab} onClick={() => setTab(t)}>{TAB_LABELS[t]}</button>
        ))}
      </div>

      {tab === "leaderboard" && (
        <>
          <h2 style={S.secTitle}>Rankings</h2>
          <p style={{ color: "#888", fontSize: "0.83rem", marginBottom: "18px" }}>Scores are updated by coordinators based on GeeksforGeeks problem-solving activity.</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: "40px" }}>
              <thead style={{ background: "#2f8d46", color: "white" }}>
                <tr>{(isMobile ? ["Rank","Name","Score","Badges"] : ["Rank","Name","Score","Progress","Events","Streak","Badges"]).map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: "600", fontSize: "0.86rem" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => (
                  <tr key={s.id} style={{ background: i % 2 === 1 ? "#f7faf8" : "white" }}>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem" }}>{i < 3 ? MEDALS[i] : i + 1}</td>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem", fontWeight: "600" }}>{s.name}</td>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem" }}>{s.score}</td>
                    {!isMobile && <>
                      <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ background: "#e8f5e9", borderRadius: "999px", height: "8px", width: "90px", overflow: "hidden" }}>
                          <div style={{ height: "100%", background: "#2f8d46", borderRadius: "999px", width: Math.round((s.score / maxScore) * 100) + "%" }} />
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem" }}>{s.events}</td>
                      <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem" }}>{s.streak}d</td>
                    </>}
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem" }}>{s.badges || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "achievements" && (
        <>
          <h2 style={S.secTitle}>Achievement Badges</h2>
          <div style={S.achGrid}>
            {ACHIEVEMENTS.map(ach => {
              const earners = students.filter(s => ach.threshold(s))
              return (
                <div key={ach.id} style={{ border: "1px solid #e0e0e0", borderRadius: "12px", padding: isMobile ? "16px" : "22px", background: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: isMobile ? "1.6rem" : "2rem", marginBottom: "7px" }}>{ach.icon}</div>
                  <div style={{ fontWeight: "700", fontSize: isMobile ? "0.88rem" : "0.97rem", marginBottom: "4px" }}>{ach.label}</div>
                  <div style={{ color: "#888", fontSize: isMobile ? "0.78rem" : "0.85rem", marginBottom: "8px" }}>{ach.desc}</div>
                  {earners.length > 0
                    ? <div style={{ fontSize: "0.8rem", color: "#2f8d46", fontWeight: "600" }}>Earned by: {earners.map(s => s.name).join(", ")}</div>
                    : <div style={{ fontSize: "0.8rem", color: "#ccc", fontWeight: "600" }}>Not yet earned</div>}
                </div>
              )
            })}
          </div>
        </>
      )}

      {tab === "participation" && (
        <>
          <h2 style={S.secTitle}>Student Participation</h2>
          {sorted.map(s => (
            <div key={s.id} style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "12px", padding: isMobile ? "14px 16px" : "18px 22px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", marginBottom: "10px" }}>
              <div style={{ fontWeight: "700", fontSize: "0.95rem", marginBottom: "8px" }}>{s.name}</div>
              <div style={{ display: "flex", gap: isMobile ? "14px" : "28px", flexWrap: "wrap", alignItems: "center" }}>
                {[{ label: "Score", val: s.score }, { label: "Events", val: s.events }, { label: "Streak", val: s.streak + " days" }, { label: "Badges", val: s.badges || "None" }].map(({ label, val }) => (
                  <div key={label} style={{ fontSize: "0.83rem", color: "#555" }}>{label}: <span style={{ fontWeight: "700", color: "#2f8d46" }}>{val}</span></div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "coordinator" && (
        coordUnlocked
          ? <CoordinatorPanel students={students} onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} onLock={() => setCoordUnlocked(false)} isMobile={isMobile} />
          : <CoordinatorGate onUnlock={() => setCoordUnlocked(true)} isMobile={isMobile} />
      )}
    </div>
  )
}

export default Community