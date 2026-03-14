import { useState, useEffect } from "react"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])
  return isMobile
}

const MAX_CONTENT = 1000

function Blog() {
  const [title, setTitle]   = useState("")
  const [content, setContent] = useState("")
  const [posts, setPosts]   = useState([])
  const [error, setError]   = useState("")
  const isMobile = useIsMobile()

  const styles = {
    page:       { padding: isMobile ? "20px 16px" : "40px 48px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "760px", margin: "0 auto", color: "#1a1a1a" },
    title:      { fontSize: isMobile ? "1.6rem" : "2rem", fontWeight: "800", marginBottom: "6px" },
    subtitle:   { color: "#666", marginBottom: "28px", fontSize: isMobile ? "0.93rem" : "1rem" },
    sectionTitle: { fontSize: isMobile ? "1.05rem" : "1.25rem", fontWeight: "700", borderLeft: "4px solid #2f8d46", paddingLeft: "12px", marginBottom: "16px" },
    formBox:    { background: "#f9fafb", border: "1px solid #e8e8e8", borderRadius: "12px", padding: isMobile ? "18px 16px" : "24px", marginBottom: "40px" },
    input:      { width: "100%", padding: "11px 13px", margin: "7px 0", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.95rem", boxSizing: "border-box", outline: "none", fontFamily: "inherit" },
    textarea:   { width: "100%", padding: "11px 13px", margin: "7px 0", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.95rem", height: "120px", resize: "vertical", boxSizing: "border-box", outline: "none", fontFamily: "inherit" },
    btn:        { background: "#2f8d46", color: "white", border: "none", padding: "11px 22px", borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem", fontWeight: "600", width: isMobile ? "100%" : "auto" },
    postCard:   { border: "1px solid #e4e4e4", padding: isMobile ? "16px" : "22px 24px", borderRadius: "12px", marginBottom: "16px", background: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" },
    postTitle:  { fontWeight: "700", fontSize: isMobile ? "1rem" : "1.1rem", marginBottom: "5px", color: "#1a1a1a" },
    postMeta:   { color: "#888", fontSize: "0.82rem", marginBottom: "10px" },
    postContent:{ color: "#444", fontSize: "0.95rem", lineHeight: "1.7", whiteSpace: "pre-wrap" },
    emptyState: { textAlign: "center", padding: "36px 16px", color: "#888", fontSize: "0.97rem" },
    charCount:  { textAlign: "right", fontSize: "0.79rem", color: "#999", margin: "-4px 0 8px" }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedTitle   = title.trim()
    const trimmedContent = content.trim()
    if (!trimmedTitle || !trimmedContent) { setError("Both title and content are required."); return }
    setError("")
    setPosts([{ id: Date.now(), title: trimmedTitle, content: trimmedContent,
      time: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) }, ...posts])
    setTitle(""); setContent("")
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Campus Blog</h1>
      <p style={styles.subtitle}>Share coding experiences, learning tips, and updates about programming and technology.</p>

      <h2 style={styles.sectionTitle}>Write a Post</h2>
      <div style={styles.formBox}>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Blog Title" value={title}
            onChange={e => setTitle(e.target.value)} style={styles.input} maxLength={120} />
          <textarea placeholder="Write your blog content here..." value={content}
            onChange={e => setContent(e.target.value.slice(0, MAX_CONTENT))} style={styles.textarea} />
          <div style={styles.charCount}>{content.length} / {MAX_CONTENT}</div>
          {error && <p style={{ color: "#d32f2f", fontSize: "0.88rem", margin: "0 0 10px" }}>{error}</p>}
          <button type="submit" style={styles.btn}>Publish Post</button>
        </form>
      </div>

      <h2 style={styles.sectionTitle}>Recent Posts ({posts.length})</h2>

      {posts.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>✍️</div>
          <p>No posts yet. Be the first to write one!</p>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id} style={styles.postCard}>
            <div style={styles.postTitle}>{post.title}</div>
            <div style={styles.postMeta}>Posted on {post.time}</div>
            <div style={styles.postContent}>{post.content}</div>
          </div>
        ))
      )}
    </div>
  )
}

export default Blog