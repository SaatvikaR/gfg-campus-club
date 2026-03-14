import { useState, useRef, useEffect } from "react"

// ─── PASTE YOUR GEMINI API KEY HERE ──────────────────────────────────────────
const GEMINI_API_KEY = "AIzaSyA-yL2QzA4A9gYM1yQTUUwjlFdH7pQY2pE"
// Get it free at: https://aistudio.google.com/app/apikey
// ─────────────────────────────────────────────────────────────────────────────

// ✅ FIXED: Updated to gemini-2.0-flash + key passed as header (fixes CORS)
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

async function askGemini(systemPrompt, userMessage, history = []) {
  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Understood! I will follow these instructions." }] },
    ...history.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    })),
    { role: "user", parts: [{ text: userMessage }] }
  ]

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    })
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message || "Gemini API error")
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received."
}

// ─── SYSTEM PROMPTS ───────────────────────────────────────────────────────────
const DSA_SYSTEM = `You are a friendly and expert DSA (Data Structures & Algorithms) tutor for college students at GeeksforGeeks Campus Club, RIT.
Your job is to:
- Explain DSA concepts clearly with simple analogies
- Walk through algorithm logic step by step
- Provide time & space complexity analysis
- Give short code snippets (C++/Python/Java) when helpful
- Encourage students when they're stuck
- Keep answers concise but complete — use bullet points and code blocks where helpful
- If a question is not DSA-related, politely redirect to DSA topics`

const INTERVIEW_SYSTEM = `You are a professional technical interview coach for software engineering roles, helping college students at GeeksforGeeks Campus Club, RIT prepare for placements.
Your job is to:
- Ask one interview question at a time based on the topic/difficulty the student chooses
- After the student answers, give detailed feedback: what's good, what's missing, what the ideal answer looks like
- Cover DSA, CS fundamentals (OS, DBMS, CN), system design basics, and behavioral/HR questions
- Be encouraging but honest — give a score out of 10 for each answer
- When asked for a question, format it clearly as: "Question: ..."
- Keep feedback structured: Strengths → Gaps → Ideal Answer → Score`

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  page: {
    padding: "40px 48px",
    fontFamily: "'Segoe UI', sans-serif",
    maxWidth: "1100px",
    margin: "0 auto",
    color: "#1a1a1a"
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "800",
    marginBottom: "6px"
  },
  pageSubtitle: {
    color: "#666",
    fontSize: "1rem",
    marginBottom: "36px"
  },
  tabRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px"
  },
  tab: {
    padding: "11px 24px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.95rem",
    color: "#555",
    transition: "all 0.15s"
  },
  tabActive: {
    padding: "11px 24px",
    borderRadius: "10px",
    border: "1px solid #2f8d46",
    background: "#2f8d46",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.95rem",
    color: "white",
    transition: "all 0.15s"
  },
  chatWrapper: {
    border: "1px solid #e0e0e0",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)"
  },
  chatHeader: {
    background: "linear-gradient(135deg, #2f8d46, #22703a)",
    padding: "18px 24px",
    display: "flex",
    alignItems: "center",
    gap: "14px"
  },
  chatHeaderIcon: {
    width: "42px",
    height: "42px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    flexShrink: 0
  },
  chatHeaderTitle: {
    color: "white",
    fontWeight: "700",
    fontSize: "1.05rem",
    marginBottom: "2px"
  },
  chatHeaderSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: "0.82rem"
  },
  clearBtn: {
    marginLeft: "auto",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "7px",
    color: "white",
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "600"
  },
  messagesBox: {
    height: "420px",
    overflowY: "auto",
    padding: "24px",
    background: "#fafafa",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  msgUser: {
    alignSelf: "flex-end",
    background: "#2f8d46",
    color: "white",
    padding: "12px 16px",
    borderRadius: "14px 14px 3px 14px",
    maxWidth: "72%",
    fontSize: "0.93rem",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  },
  msgBot: {
    alignSelf: "flex-start",
    background: "white",
    color: "#1a1a1a",
    padding: "12px 16px",
    borderRadius: "14px 14px 14px 3px",
    maxWidth: "82%",
    fontSize: "0.93rem",
    lineHeight: "1.7",
    border: "1px solid #e8e8e8",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  },
  msgError: {
    alignSelf: "center",
    background: "#fef2f2",
    color: "#dc2626",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    border: "1px solid #fecaca"
  },
  typing: {
    alignSelf: "flex-start",
    background: "white",
    border: "1px solid #e8e8e8",
    padding: "12px 18px",
    borderRadius: "14px 14px 14px 3px",
    display: "flex",
    gap: "5px",
    alignItems: "center"
  },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#2f8d46"
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    padding: "16px 20px",
    background: "white",
    borderTop: "1px solid #eee"
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
    resize: "none",
    lineHeight: "1.5"
  },
  sendBtn: {
    background: "#2f8d46",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "0 20px",
    cursor: "pointer",
    fontSize: "1.1rem",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  sendBtnDisabled: {
    background: "#ccc",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "0 20px",
    cursor: "not-allowed",
    fontSize: "1.1rem",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  quickChips: {
    padding: "0 20px 16px",
    background: "white",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  chip: {
    padding: "6px 14px",
    background: "#f0faf3",
    border: "1px solid #c8e6c9",
    borderRadius: "999px",
    fontSize: "0.8rem",
    color: "#2f8d46",
    fontWeight: "600",
    cursor: "pointer"
  },
  welcomeCard: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#888"
  },
  welcomeIcon: {
    fontSize: "3rem",
    marginBottom: "12px"
  },
  welcomeText: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#444",
    marginBottom: "6px"
  },
  welcomeSub: {
    fontSize: "0.85rem",
    color: "#999"
  },
  diffRow: {
    padding: "14px 20px",
    background: "#f9fafb",
    borderBottom: "1px solid #eee",
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap"
  },
  diffLabel: {
    fontSize: "0.82rem",
    fontWeight: "600",
    color: "#666",
    marginRight: "4px"
  },
  diffChip: (active) => ({
    padding: "5px 12px",
    borderRadius: "999px",
    border: active ? "1px solid #2f8d46" : "1px solid #ddd",
    background: active ? "#2f8d46" : "white",
    color: active ? "white" : "#555",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer"
  })
}

// ─── DSA CHATBOT ──────────────────────────────────────────────────────────────
const DSA_QUICK = [
  "Explain Binary Search", "What is Dynamic Programming?",
  "Difference between Stack and Queue", "Explain BFS vs DFS",
  "What is time complexity?", "Explain Merge Sort"
]

function DSAChatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const send = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput("")

    const newMessages = [...messages, { role: "user", content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const reply = await askGemini(DSA_SYSTEM, userMsg, messages)
      setMessages([...newMessages, { role: "assistant", content: reply }])
    } catch (e) {
      setMessages([...newMessages, { role: "error", content: `⚠️ ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div style={S.chatWrapper}>
      <div style={S.chatHeader}>
        <div style={S.chatHeaderIcon}>🤖</div>
        <div>
          <div style={S.chatHeaderTitle}>DSA Doubt Solver</div>
          <div style={S.chatHeaderSub}>Ask anything about Data Structures & Algorithms</div>
        </div>
        {messages.length > 0 && (
          <button style={S.clearBtn} onClick={() => setMessages([])}>Clear Chat</button>
        )}
      </div>

      <div style={S.messagesBox}>
        {messages.length === 0 ? (
          <div style={S.welcomeCard}>
            <div style={S.welcomeIcon}>💡</div>
            <div style={S.welcomeText}>Your personal DSA tutor is ready!</div>
            <div style={S.welcomeSub}>Ask any doubt — arrays, trees, DP, graphs, complexity... anything!</div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={m.role === "user" ? S.msgUser : m.role === "error" ? S.msgError : S.msgBot}>
              {m.content}
            </div>
          ))
        )}
        {loading && (
          <div style={S.typing}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                ...S.dot,
                animation: "bounce 1.2s infinite",
                animationDelay: `${i * 0.2}s`
              }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={S.quickChips}>
        {DSA_QUICK.map(q => (
          <span key={q} style={S.chip} onClick={() => send(q)}>{q}</span>
        ))}
      </div>

      <div style={S.inputRow}>
        <textarea
          style={S.input}
          placeholder="Ask your DSA doubt here... (Shift+Enter for new line)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={2}
        />
        <button
          style={loading || !input.trim() ? S.sendBtnDisabled : S.sendBtn}
          onClick={() => send()}
          disabled={loading || !input.trim()}
        >
          ➤
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}

// ─── INTERVIEW PRACTICE BOT ───────────────────────────────────────────────────
const TOPICS = ["DSA", "Operating Systems", "DBMS", "Computer Networks", "System Design", "HR/Behavioral"]
const DIFFICULTIES = ["Easy", "Medium", "Hard"]

const INTERVIEW_QUICK = (topic, difficulty) => [
  `Give me a ${difficulty} ${topic} question`,
  `Ask me about ${topic} concepts`,
  `What are common ${topic} interview questions?`,
  `Quiz me on ${topic}`
]

function InterviewBot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState("DSA")
  const [difficulty, setDifficulty] = useState("Medium")
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const send = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput("")

    const contextMsg = `[Topic: ${topic} | Difficulty: ${difficulty}] ${userMsg}`
    const newMessages = [...messages, { role: "user", content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const historyForApi = messages.map(m => ({ role: m.role, content: m.content }))
      const reply = await askGemini(INTERVIEW_SYSTEM, contextMsg, historyForApi)
      setMessages([...newMessages, { role: "assistant", content: reply }])
    } catch (e) {
      setMessages([...newMessages, { role: "error", content: `⚠️ ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const startSession = () => {
    send(`Start a ${difficulty} ${topic} interview. Ask me the first question.`)
  }

  return (
    <div style={S.chatWrapper}>
      <div style={S.chatHeader}>
        <div style={S.chatHeaderIcon}>🎯</div>
        <div>
          <div style={S.chatHeaderTitle}>Interview Practice Bot</div>
          <div style={S.chatHeaderSub}>Mock interview with AI feedback & scoring</div>
        </div>
        {messages.length > 0 && (
          <button style={S.clearBtn} onClick={() => setMessages([])}>New Session</button>
        )}
      </div>

      <div style={S.diffRow}>
        <span style={S.diffLabel}>Topic:</span>
        {TOPICS.map(t => (
          <button key={t} style={S.diffChip(topic === t)} onClick={() => setTopic(t)}>{t}</button>
        ))}
        <span style={{ ...S.diffLabel, marginLeft: "12px" }}>Difficulty:</span>
        {DIFFICULTIES.map(d => (
          <button key={d} style={S.diffChip(difficulty === d)} onClick={() => setDifficulty(d)}>{d}</button>
        ))}
      </div>

      <div style={S.messagesBox}>
        {messages.length === 0 ? (
          <div style={S.welcomeCard}>
            <div style={S.welcomeIcon}>🎯</div>
            <div style={S.welcomeText}>Ready for your mock interview?</div>
            <div style={S.welcomeSub}>Select a topic & difficulty, then click "Start Interview Session"!</div>
            <button
              onClick={startSession}
              style={{
                marginTop: "16px",
                background: "#2f8d46",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 24px",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              🚀 Start Interview Session
            </button>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={m.role === "user" ? S.msgUser : m.role === "error" ? S.msgError : S.msgBot}>
              {m.content}
            </div>
          ))
        )}
        {loading && (
          <div style={S.typing}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                ...S.dot,
                animation: "bounce 1.2s infinite",
                animationDelay: `${i * 0.2}s`
              }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length > 0 && (
        <div style={S.quickChips}>
          {INTERVIEW_QUICK(topic, difficulty).map(q => (
            <span key={q} style={S.chip} onClick={() => send(q)}>{q}</span>
          ))}
        </div>
      )}

      <div style={S.inputRow}>
        <textarea
          style={S.input}
          placeholder="Type your answer here... (Shift+Enter for new line, Enter to send)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={2}
        />
        <button
          style={loading || !input.trim() ? S.sendBtnDisabled : S.sendBtn}
          onClick={() => send()}
          disabled={loading || !input.trim()}
        >
          ➤
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function AIHub() {
  const [activeTab, setActiveTab] = useState("dsa")

  return (
    <div style={S.page}>
      <h1 style={S.pageTitle}>🤖 AI Hub</h1>
      <p style={S.pageSubtitle}>
        Powered by Google Gemini — your AI-powered DSA tutor and interview coach.
      </p>

      <div style={S.tabRow}>
        <button style={activeTab === "dsa" ? S.tabActive : S.tab} onClick={() => setActiveTab("dsa")}>
          🤖 DSA Doubt Solver
        </button>
        <button style={activeTab === "interview" ? S.tabActive : S.tab} onClick={() => setActiveTab("interview")}>
          🎯 Interview Practice
        </button>
      </div>

      {activeTab === "dsa" ? <DSAChatbot /> : <InterviewBot />}
    </div>
  )
}

export default AIHub