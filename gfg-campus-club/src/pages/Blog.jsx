import { useState } from "react"

const styles = {
  page: { padding: "40px 48px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "760px", margin: "0 auto", color: "#1a1a1a" },
  title: { fontSize: "2rem", fontWeight: "800", marginBottom: "8px" },
  subtitle: { color: "#666", marginBottom: "36px", fontSize: "1rem" },
  sectionTitle: { fontSize: "1.25rem", fontWeight: "700", borderLeft: "4px solid #2f8d46", paddingLeft: "12px", marginBottom: "20px" },
  formBox: { background: "#f9fafb", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "24px", marginBottom: "48px" },
  input: { width: "100%", padding: "12px 14px", margin: "8px 0", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.97rem", boxSizing: "border-box", outline: "none", fontFamily: "inherit" },
  textarea: { width: "100%", padding: "12px 14px", margin: "8px 0", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.97rem", height: "130px", resize: "vertical", boxSizing: "border-box", outline: "none", fontFamily: "inherit" },
  btn: { background: "#2f8d46", color: "white", border: "none", padding: "11px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "0.97rem", fontWeight: "600" },
  postCard: { border: "1px solid #e4e4e4", padding: "22px 24px", borderRadius: "12px", marginBottom: "20px", background: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" },
  postTitle: { fontWeight: "700", fontSize: "1.1rem", marginBottom: "6px", color: "#1a1a1a" },
  postMeta: { color: "#888", fontSize: "0.83rem", marginBottom: "12px" },
  postContent: { color: "#444", fontSize: "0.97rem", lineHeight: "1.7", whiteSpace: "pre-wrap" },
  emptyState: { textAlign: "center", padding: "40px 20px", color: "#888", fontSize: "1rem" },
  charCount: { textAlign: "right", fontSize: "0.8rem", color: "#999", margin: "-4px 0 8px" }
}

const MAX_CONTENT = 1000

function Blog() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [posts, setPosts] = useState([])
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle || !trimmedContent) {
      setError("Both title and content are required.")
      return
    }

    setError("")
    setPosts([
      {
        id: Date.now(),
        title: trimmedTitle,
        content: trimmedContent,
        time: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
      },
      ...posts
    ])
    setTitle("")
    setContent("")
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Campus Blog</h1>
      <p style={styles.subtitle}>
        Share coding experiences, learning tips, and updates about programming and technology.
      </p>

      {/* FORM */}
      <h2 style={styles.sectionTitle}>Write a Post</h2>
      <div style={styles.formBox}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            maxLength={120}
          />
          <textarea
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT))}
            style={styles.textarea}
          />
          <div style={styles.charCount}>{content.length} / {MAX_CONTENT}</div>

          {error && <p style={{ color: "#d32f2f", fontSize: "0.9rem", margin: "0 0 12px" }}>{error}</p>}

          <button type="submit" style={styles.btn}>Publish Post</button>
        </form>
      </div>

      {/* POSTS */}
      <h2 style={styles.sectionTitle}>Recent Posts ({posts.length})</h2>

      {posts.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>✍️</div>
          <p>No posts yet. Be the first to write one!</p>
        </div>
      ) : (
        posts.map((post) => (
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