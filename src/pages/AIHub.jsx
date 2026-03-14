import { useState, useRef, useEffect } from "react"

const GEMINI_API_KEY = "AIzaSyA-yL2QzA4A9gYM1yQTUUwjlFdH7pQY2pE"
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

const DSA_QUICK = ["Explain Binary Search", "What is Dynamic Programming?", "Difference between Stack and Queue", "Explain BFS vs DFS", "What is time complexity?", "Explain Merge Sort"]
const TOPICS       = ["DSA", "Operating Systems", "DBMS", "Computer Networks", "System Design", "HR/Behavioral"]
const DIFFICULTIES = ["Easy", "Medium", "Hard"]

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
      <div style={{ height: isMobile ? "320px" : "420px", overflowY: "auto", padding: isMobile ? "16px" : "24px", background: "#fafafa", display: "flex", flexDirection: "column", gap: "14px" }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: isMobile ? "28px 12px" : "40px 20px", color: "#888" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{welcomeIcon}</div>
            <div style={{ fontSize: "0.97rem", fontWeight: "600", color: "#444", marginBottom: "5px" }}>{welcomeText}</div>
            <div style={{ fontSize: "0.83rem", color: "#999", marginBottom: welcomeAction ? "14px" : 0 }}>{welcomeSub}</div>
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
              alignSelf: "flex-start", background: "white", color: "#1a1a1a", padding: "10px 14px",
              borderRadius: "14px 14px 14px 3px", maxWidth: isMobile ? "92%" : "82%", fontSize: "0.91rem", lineHeight: "1.7",
              border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", whiteSpace: "pre-wrap", wordBreak: "break-word"
            }}>
              {m.content}
            </div>
          ))
        )}
        {loading && (
          <div style={{ alignSelf: "flex-start", background: "white", border: "1px solid #e8e8e8", padding: "10px 16px", borderRadius: "14px 14px 14px 3px", display: "flex", gap: "5px", alignItems: "center" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#2f8d46", animation: "bounce 1.2s infinite", animationDelay: `${i*0.2}s` }} />)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      {quickChips && (
        <div style={{ padding: isMobile ? "0 12px 12px" : "0 20px 14px", background: "white", display: "flex", gap: "7px", flexWrap: "wrap" }}>
          {quickChips.map(q => (
            <span key={q} style={{ padding: "5px 12px", background: "#f0faf3", border: "1px solid #c8e6c9", borderRadius: "999px", fontSize: isMobile ? "0.75rem" : "0.8rem", color: "#2f8d46", fontWeight: "600", cursor: "pointer" }}
              onClick={() => send(q)}>{q}</span>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{ display: "flex", gap: "8px", padding: isMobile ? "12px" : "16px 20px", background: "white", borderTop: "1px solid #eee" }}>
        <textarea style={{ flex: 1, padding: "10px 13px", border: "1px solid #ddd", borderRadius: "10px", fontSize: isMobile ? "0.88rem" : "0.95rem", fontFamily: "inherit", outline: "none", resize: "none", lineHeight: "1.5" }}
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
    <div style={{ padding: isMobile ? "10px 12px" : "12px 20px", background: "#f9fafb", borderBottom: "1px solid #eee", display: "flex", gap: "7px", alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontSize: isMobile ? "0.78rem" : "0.82rem", fontWeight: "600", color: "#666", marginRight: "2px" }}>Topic:</span>
      {TOPICS.map(t => <button key={t} style={diffChip(topic === t)} onClick={() => setTopic(t)}>{t}</button>)}
      <span style={{ fontSize: isMobile ? "0.78rem" : "0.82rem", fontWeight: "600", color: "#666", marginLeft: "8px", marginRight: "2px" }}>Diff:</span>
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
  const [activeTab, setActiveTab] = useState("dsa")
  const isMobile = useIsMobile()

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "40px 48px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1100px", margin: "0 auto", color: "#1a1a1a" }}>
      <h1 style={{ fontSize: isMobile ? "1.6rem" : "2rem", fontWeight: "800", marginBottom: "6px" }}>🤖 AI Hub</h1>
      <p style={{ color: "#666", fontSize: isMobile ? "0.93rem" : "1rem", marginBottom: "28px" }}>
        Powered by Google Gemini — your AI-powered DSA tutor and interview coach.
      </p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
        {[{ id: "dsa", label: "🤖 DSA Doubt Solver" }, { id: "interview", label: "🎯 Interview Practice" }].map(({ id, label }) => (
          <button key={id} style={{ padding: isMobile ? "9px 14px" : "11px 24px", borderRadius: "10px", border: activeTab === id ? "1px solid #2f8d46" : "1px solid #ddd", background: activeTab === id ? "#2f8d46" : "white", cursor: "pointer", fontWeight: "600", fontSize: isMobile ? "0.83rem" : "0.95rem", color: activeTab === id ? "white" : "#555" }}
            onClick={() => setActiveTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "dsa" ? (
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
      ) : (
        <InterviewBotWrapper isMobile={isMobile} />
      )}
    </div>
  )
}

export default AIHub