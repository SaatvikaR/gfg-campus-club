import { useState, useRef, useEffect } from "react"
import { useTheme } from "../ThemeContext"

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])
  return isMobile
}

async function askGemini(systemPrompt, userMessage, history = []) {
  const contents = [
    { role: "user",  parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Understood! I will follow these instructions." }] },
    ...history.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    { role: "user",  parts: [{ text: userMessage }] }
  ]
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY },
    body: JSON.stringify({ contents, generationConfig: { temperature: 0.7, maxOutputTokens: 1024 } })
  })
  if (!res.ok) { const err = await res.json(); throw new Error(err?.error?.message || "Gemini API error") }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received."
}

const DSA_SYSTEM = `You are a friendly and expert DSA tutor for college students at GeeksforGeeks Campus Club, RIT.
Your job is to explain DSA concepts clearly with simple analogies, walk through algorithm logic step by step,
provide time & space complexity analysis, give short code snippets (C++/Python/Java) when helpful,
and encourage students when they're stuck. Keep answers concise but complete — use bullet points and code blocks where helpful.
If a question is not DSA-related, politely redirect to DSA topics.`

const INTERVIEW_SYSTEM = `You are a professional technical interview coach for software engineering roles,
helping college students at GeeksforGeeks Campus Club, RIT prepare for placements.
Ask one interview question at a time based on the topic/difficulty the student chooses.
After the student answers, give detailed feedback: what's good, what's missing, what the ideal answer looks like.
Be encouraging but honest — give a score out of 10 for each answer.
Format questions clearly as: "Question: ..."
Keep feedback structured: Strengths → Gaps → Ideal Answer → Score`

const RECOMMENDER_SYSTEM = `You are a coding problem recommender for GeeksforGeeks Campus Club, RIT.

STRICT RULES — follow exactly, no exceptions:
- Do NOT write any introduction, greeting, or explanation text
- Do NOT say "Hello", "Sure", "Here are", or anything before the list
- ONLY output exactly 8 problems in the format below, nothing else
- Start your response directly with "1."

REQUIRED FORMAT (copy exactly):
1. **Problem Name** | Topic | Difficulty
   Why: one sentence reason
   Link: https://www.geeksforgeeks.org/actual-problem-slug/

2. **Problem Name** | Topic | Difficulty
   Why: one sentence reason
   Link: https://www.geeksforgeeks.org/actual-problem-slug/

(continue for all 8 problems)

Rules:
- Difficulty must be exactly one of: Easy, Medium, Hard
- Use only real GeeksforGeeks problem URLs you are confident about
- No extra text before or after the list`

const DSA_QUICK = ["Explain Binary Search", "What is Dynamic Programming?", "Difference between Stack and Queue", "Explain BFS vs DFS", "What is time complexity?", "Explain Merge Sort"]
const TOPICS       = ["DSA", "Operating Systems", "DBMS", "Computer Networks", "System Design", "HR/Behavioral"]
const DIFFICULTIES = ["Easy", "Medium", "Hard"]

const INTEREST_TOPICS = ["Arrays", "Strings", "Linked List", "Trees", "Graphs", "Dynamic Programming", "Recursion", "Sorting", "Binary Search", "Stacks & Queues", "Hashing", "Greedy", "Backtracking", "Bit Manipulation"]
const SKILL_LEVELS    = ["Beginner", "Intermediate", "Advanced"]
const GOALS           = ["Placement Prep", "Competitive Programming", "Concept Building", "Interview Cracking"]

function ProblemRecommender({ isMobile }) {
  const { theme, isDark } = useTheme()
  const [selectedTopics,  setSelectedTopics]  = useState([])
  const [skillLevel,      setSkillLevel]      = useState("")
  const [goal,            setGoal]            = useState("")
  const [result,          setResult]          = useState("")
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState("")
  const [generated,       setGenerated]       = useState(false)

  const toggleTopic = (t) => setSelectedTopics(prev =>
    prev.includes(t) ? prev.filter(x => x !== t) : prev.length < 5 ? [...prev, t] : prev
  )

  const handleGenerate = async () => {
    if (selectedTopics.length === 0) { setError("Please select at least one topic."); return }
    if (!skillLevel)                 { setError("Please select your skill level."); return }
    if (!goal)                       { setError("Please select your goal."); return }
    setError(""); setLoading(true); setResult(""); setGenerated(false)

    const prompt = `Student profile:
- Skill Level: ${skillLevel}
- Interested Topics: ${selectedTopics.join(", ")}
- Goal: ${goal}

Please recommend 8 GeeksforGeeks problems perfectly suited for this student.`

    try {
      const reply = await askGemini(RECOMMENDER_SYSTEM, prompt)
      setResult(reply); setGenerated(true)
    } catch (e) {
      setError("Failed to get recommendations. Please try again.")
    } finally { setLoading(false) }
  }

  const handleReset = () => {
    setSelectedTopics([]); setSkillLevel(""); setGoal("")
    setResult(""); setGenerated(false); setError("")
  }

  // Parse result into structured cards
  const parseProblems = (text) => {
    const lines = text.split("\n").filter(l => l.trim())
    const problems = []
    let current = null
    for (const line of lines) {
      const match = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|\s*(.+)/)
      if (match) {
        if (current) problems.push(current)
        current = { name: match[1], topic: match[2].trim(), difficulty: match[3].trim(), why: "", link: "" }
      } else if (current && line.trim().startsWith("Why:")) {
        current.why = line.replace("Why:", "").trim()
      } else if (current && line.trim().startsWith("Link:")) {
        current.link = line.replace("Link:", "").trim()
      }
    }
    if (current) problems.push(current)
    return problems
  }

  const diffColor = (d) => {
    if (d === "Easy")   return { bg: isDark ? "rgba(34,197,94,0.15)" : "#dcfce7", text: "#16a34a" }
    if (d === "Hard")   return { bg: isDark ? "rgba(239,68,68,0.15)" : "#fee2e2", text: "#dc2626" }
    return                    { bg: isDark ? "rgba(234,179,8,0.15)"  : "#fef9c3", text: "#ca8a04" }
  }

  const chipStyle = (active) => ({
    padding: "6px 14px", borderRadius: "999px", cursor: "pointer",
    fontSize: isMobile ? "0.78rem" : "0.83rem", fontWeight: "600",
    border: active ? "1px solid #2f8d46" : `1px solid ${theme.border}`,
    background: active ? "#2f8d46" : theme.card,
    color: active ? "white" : theme.muted,
    transition: "all 0.15s"
  })

  const problems = generated ? parseProblems(result) : []

  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: "16px", overflow: "hidden", boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.07)" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2f8d46, #22703a)", padding: isMobile ? "14px 16px" : "18px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>🎯</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "white", fontWeight: "700", fontSize: isMobile ? "0.97rem" : "1.05rem" }}>Problem Recommender</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: isMobile ? "0.75rem" : "0.82rem" }}>Get personalised GFG problems based on your interests</div>
        </div>
        {generated && (
          <button onClick={handleReset} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "7px", color: "white", padding: "5px 12px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "600" }}>
            Reset
          </button>
        )}
      </div>

      <div style={{ padding: isMobile ? "18px 16px" : "24px 28px", background: theme.bg }}>

        {!generated ? (
          <>
            {/* Topics */}
            <div style={{ marginBottom: "22px" }}>
              <div style={{ fontWeight: "700", fontSize: "0.9rem", color: theme.text, marginBottom: "4px" }}>
                Select Topics <span style={{ color: theme.muted, fontWeight: "400", fontSize: "0.8rem" }}>(pick up to 5)</span>
              </div>
              <div style={{ fontSize: "0.78rem", color: theme.muted, marginBottom: "10px" }}>{selectedTopics.length}/5 selected</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {INTEREST_TOPICS.map(t => (
                  <button key={t} onClick={() => toggleTopic(t)} style={chipStyle(selectedTopics.includes(t))}>{t}</button>
                ))}
              </div>
            </div>

            {/* Skill level */}
            <div style={{ marginBottom: "22px" }}>
              <div style={{ fontWeight: "700", fontSize: "0.9rem", color: theme.text, marginBottom: "10px" }}>Skill Level</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {SKILL_LEVELS.map(s => (
                  <button key={s} onClick={() => setSkillLevel(s)} style={chipStyle(skillLevel === s)}>{s}</button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontWeight: "700", fontSize: "0.9rem", color: theme.text, marginBottom: "10px" }}>Your Goal</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {GOALS.map(g => (
                  <button key={g} onClick={() => setGoal(g)} style={chipStyle(goal === g)}>{g}</button>
                ))}
              </div>
            </div>

            {error && <div style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "14px", fontWeight: "600" }}>⚠️ {error}</div>}

            {/* Generate button */}
            <button onClick={handleGenerate} disabled={loading} style={{
              width: "100%", background: loading ? theme.border : "#2f8d46", color: "white",
              border: "none", borderRadius: "10px", padding: "13px",
              fontSize: "1rem", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "background 0.2s"
            }}>
              {loading ? (
                <>
                  <div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Finding best problems for you…
                </>
              ) : "✨ Get My Problem Recommendations"}
            </button>
          </>
        ) : (
          <>
            {/* Summary bar */}
            <div style={{ background: isDark ? "rgba(47,141,70,0.15)" : "#f0fdf4", border: "1px solid #2f8d46", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#2f8d46" }}>Your Profile:</span>
              <span style={{ ...chipStyle(true), padding: "3px 10px", fontSize: "0.78rem" }}>{skillLevel}</span>
              <span style={{ ...chipStyle(true), padding: "3px 10px", fontSize: "0.78rem" }}>{goal}</span>
              {selectedTopics.map(t => <span key={t} style={{ ...chipStyle(true), padding: "3px 10px", fontSize: "0.78rem" }}>{t}</span>)}
            </div>

            {/* Problem cards */}
            {problems.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "14px" }}>
                {problems.map((p, i) => {
                  const dc = diffColor(p.difficulty)
                  return (
                    <div key={i} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "16px", boxShadow: isDark ? "0 2px 10px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
                        <div style={{ fontWeight: "700", fontSize: "0.95rem", color: theme.text, lineHeight: "1.4" }}>
                          <span style={{ color: theme.muted, fontSize: "0.8rem", marginRight: "6px" }}>#{i + 1}</span>
                          {p.name}
                        </div>
                        <span style={{ background: dc.bg, color: dc.text, padding: "2px 8px", borderRadius: "999px", fontSize: "0.72rem", fontWeight: "700", flexShrink: 0 }}>{p.difficulty}</span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#2f8d46", fontWeight: "600", marginBottom: "6px" }}>📂 {p.topic}</div>
                      {p.why && <div style={{ fontSize: "0.82rem", color: theme.muted, lineHeight: "1.5", marginBottom: "10px" }}>💡 {p.why}</div>}
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#2f8d46", color: "white", padding: "6px 14px", borderRadius: "7px", fontSize: "0.82rem", fontWeight: "600", textDecoration: "none" }}>
                          Solve on GFG →
                        </a>
                      ) : (
                        <a href={`https://www.geeksforgeeks.org/tag/${p.topic.toLowerCase().replace(/ /g, "-")}/`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#2f8d46", color: "white", padding: "6px 14px", borderRadius: "7px", fontSize: "0.82rem", fontWeight: "600", textDecoration: "none" }}>
                          Browse on GFG →
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              // Fallback: show raw text if parsing fails
              <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "20px", whiteSpace: "pre-wrap", fontSize: "0.9rem", lineHeight: "1.8", color: theme.text }}>
                {result}
              </div>
            )}

            <button onClick={handleReset} style={{ marginTop: "20px", width: "100%", background: "none", border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "11px", fontSize: "0.93rem", fontWeight: "600", cursor: "pointer", color: theme.muted, fontFamily: "inherit" }}>
              🔄 Get New Recommendations
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function ChatBot({ icon, title, subtitle, systemPrompt, quickChips, extraHeader, welcomeIcon, welcomeText, welcomeSub, welcomeAction, isMobile }) {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState("")
  const [loading, setLoading]   = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, loading])

  const send = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput("")
    const newMessages = [...messages, { role: "user", content: userMsg }]
    setMessages(newMessages); setLoading(true)
    try {
      const reply = await askGemini(systemPrompt, userMsg, messages)
      setMessages([...newMessages, { role: "assistant", content: reply }])
    } catch (e) {
      setMessages([...newMessages, { role: "error", content: `⚠️ ${e.message}` }])
    } finally { setLoading(false) }
  }

  const handleKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div style={{ border: "1px solid #e0e0e0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2f8d46, #22703a)", padding: isMobile ? "14px 16px" : "18px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "white", fontWeight: "700", fontSize: isMobile ? "0.97rem" : "1.05rem" }}>{title}</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: isMobile ? "0.75rem" : "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subtitle}</div>
        </div>
        {messages.length > 0 && (
          <button style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "7px", color: "white", padding: "5px 12px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "600", flexShrink: 0 }}
            onClick={() => setMessages([])}>Clear</button>
        )}
      </div>

      {/* Extra header (topic/difficulty for Interview bot) */}
      {extraHeader}

      {/* Messages */}
      <div style={{ height: isMobile ? "320px" : "420px", overflowY: "auto", padding: isMobile ? "16px" : "24px", background: "#172032", display: "flex", flexDirection: "column", gap: "14px" }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: isMobile ? "28px 12px" : "40px 20px", color: "#64748b" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{welcomeIcon}</div>
            <div style={{ fontSize: "0.97rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "5px" }}>{welcomeText}</div>
            <div style={{ fontSize: "0.83rem", color: "#475569", marginBottom: welcomeAction ? "14px" : 0 }}>{welcomeSub}</div>
            {welcomeAction}
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={m.role === "user" ? {
              alignSelf: "flex-end", background: "#2f8d46", color: "white", padding: "10px 14px",
              borderRadius: "14px 14px 3px 14px", maxWidth: isMobile ? "88%" : "72%", fontSize: "0.91rem", lineHeight: "1.6", whiteSpace: "pre-wrap", wordBreak: "break-word"
            } : m.role === "error" ? {
              alignSelf: "center", background: "#fef2f2", color: "#dc2626", padding: "9px 14px", borderRadius: "8px", fontSize: "0.83rem", border: "1px solid #fecaca"
            } : {
              alignSelf: "flex-start", background: "#1e293b", color: "#e2e8f0", padding: "10px 14px",
              borderRadius: "14px 14px 14px 3px", maxWidth: isMobile ? "92%" : "82%", fontSize: "0.91rem", lineHeight: "1.7",
              border: "1px solid #2d3f55", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", whiteSpace: "pre-wrap", wordBreak: "break-word"
            }}>
              {m.content}
            </div>
          ))
        )}
        {loading && (
          <div style={{ alignSelf: "flex-start", background: "#1e293b", border: "1px solid #2d3f55", padding: "10px 16px", borderRadius: "14px 14px 14px 3px", display: "flex", gap: "5px", alignItems: "center" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#2f8d46", animation: "bounce 1.2s infinite", animationDelay: `${i*0.2}s` }} />)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      {quickChips && (
        <div style={{ padding: isMobile ? "0 12px 12px" : "0 20px 14px", background: "#1e293b", display: "flex", gap: "7px", flexWrap: "wrap" }}>
          {quickChips.map(q => (
            <span key={q} style={{ padding: "5px 12px", background: "rgba(47,141,70,0.1)", border: "1px solid #c8e6c9", borderRadius: "999px", fontSize: isMobile ? "0.75rem" : "0.8rem", color: "#2f8d46", fontWeight: "600", cursor: "pointer" }}
              onClick={() => send(q)}>{q}</span>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{ display: "flex", gap: "8px", padding: isMobile ? "12px" : "16px 20px", background: "#1e293b", borderTop: "1px solid #2d3f55" }}>
        <textarea style={{ flex: 1, padding: "10px 13px", border: "1px solid #2d3f55", borderRadius: "10px", fontSize: isMobile ? "0.88rem" : "0.95rem", fontFamily: "inherit", outline: "none", resize: "none", lineHeight: "1.5" }}
          placeholder="Type here... (Shift+Enter for new line)" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={handleKey} rows={2} />
        <button style={{ background: loading || !input.trim() ? "#ccc" : "#2f8d46", color: "white", border: "none", borderRadius: "10px", padding: "0 16px", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: "1.1rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => send()} disabled={loading || !input.trim()}>➤</button>
      </div>
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </div>
  )
}

function InterviewBotWrapper({ isMobile }) {
  const [topic,      setTopic]      = useState("DSA")
  const [difficulty, setDifficulty] = useState("Medium")
  const [key,        setKey]        = useState(0) // reset chat on topic/diff change

  const diffChip = active => ({
    padding: "5px 11px", borderRadius: "999px",
    border: active ? "1px solid #2f8d46" : "1px solid #ddd",
    background: active ? "#2f8d46" : "white",
    color: active ? "white" : "#555",
    fontSize: isMobile ? "0.75rem" : "0.8rem", fontWeight: "600", cursor: "pointer"
  })

  const extraHeader = (
    <div style={{ padding: isMobile ? "10px 12px" : "12px 20px", background: "#172032", borderBottom: "1px solid #eee", display: "flex", gap: "7px", alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontSize: isMobile ? "0.78rem" : "0.82rem", fontWeight: "600", color: "#94a3b8", marginRight: "2px" }}>Topic:</span>
      {TOPICS.map(t => <button key={t} style={diffChip(topic === t)} onClick={() => setTopic(t)}>{t}</button>)}
      <span style={{ fontSize: isMobile ? "0.78rem" : "0.82rem", fontWeight: "600", color: "#94a3b8", marginLeft: "8px", marginRight: "2px" }}>Diff:</span>
      {DIFFICULTIES.map(d => <button key={d} style={diffChip(difficulty === d)} onClick={() => setDifficulty(d)}>{d}</button>)}
    </div>
  )

  return (
    <ChatBot
      key={key}
      icon="🎯"
      title="Interview Practice Bot"
      subtitle="Mock interview with AI feedback & scoring"
      systemPrompt={INTERVIEW_SYSTEM}
      isMobile={isMobile}
      extraHeader={extraHeader}
      quickChips={[`Give me a ${difficulty} ${topic} question`, `Ask me about ${topic} concepts`, `What are common ${topic} interview questions?`]}
      welcomeIcon="🎯"
      welcomeText="Ready for your mock interview?"
      welcomeSub={`Topic: ${topic} | Difficulty: ${difficulty}`}
      welcomeAction={
        <button style={{ background: "#2f8d46", color: "white", border: "none", borderRadius: "8px", padding: "9px 22px", fontSize: "0.93rem", fontWeight: "600", cursor: "pointer" }}>
          🚀 Start Interview Session
        </button>
      }
    />
  )
}

function AIHub() {
  const { theme, isDark } = useTheme()
  const [activeTab, setActiveTab] = useState("dsa")
  const isMobile = useIsMobile()

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "40px 48px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1100px", margin: "0 auto", color: theme.text }}>
      <h1 style={{ fontSize: isMobile ? "1.6rem" : "2rem", fontWeight: "800", marginBottom: "6px", color: theme.text }}>🤖 AI Hub</h1>
      <p style={{ color: theme.muted, fontSize: isMobile ? "0.93rem" : "1rem", marginBottom: "28px" }}>
        Powered by Google Gemini — DSA tutor, interview coach & personalised problem recommender.
      </p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
        {[
          { id: "dsa",         label: "🤖 DSA Doubt Solver"    },
          { id: "interview",   label: "🎯 Interview Practice"   },
          { id: "recommender", label: "✨ Problem Recommender"  },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: isMobile ? "8px 12px" : "11px 22px", borderRadius: "10px",
            border: activeTab === id ? "1px solid #2f8d46" : `1px solid ${theme.border}`,
            background: activeTab === id ? "#2f8d46" : theme.card,
            cursor: "pointer", fontWeight: "600",
            fontSize: isMobile ? "0.8rem" : "0.93rem",
            color: activeTab === id ? "white" : theme.muted,
            transition: "all 0.15s", fontFamily: "inherit"
          }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "dsa" && (
        <ChatBot
          icon="🤖"
          title="DSA Doubt Solver"
          subtitle="Ask anything about Data Structures & Algorithms"
          systemPrompt={DSA_SYSTEM}
          quickChips={DSA_QUICK}
          isMobile={isMobile}
          welcomeIcon="💡"
          welcomeText="Your personal DSA tutor is ready!"
          welcomeSub="Ask any doubt — arrays, trees, DP, graphs, complexity... anything!"
        />
      )}
      {activeTab === "interview"   && <InterviewBotWrapper isMobile={isMobile} />}
      {activeTab === "recommender" && <ProblemRecommender  isMobile={isMobile} />}
    </div>
  )
}

export default AIHub