import { useState, useEffect } from "react"

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CONTACT_INFO = [
  { label: "Email", value: "geeksforgeeks@ritchennai.edu.in", link: "mailto:geeksforgeeks@ritchennai.edu.in" },
]

const COMMUNITY_LINKS = [
  { label: "WhatsApp Community", desc: "Join our main group for updates and announcements", link: "https://chat.whatsapp.com/HZjaf6LCpEPCvgiJkdQxi8?mode=hqctswa", iconKey: "whatsapp" },
  { label: "LinkedIn", desc: "Follow us for professional updates and opportunities", link: "https://www.linkedin.com/", iconKey: "linkedin" },
  { label: "GitHub", desc: "Explore our open source projects and contributions", link: "https://github.com/", iconKey: "github" },
  { label: "Instagram", desc: "Event highlights, club life and behind the scenes", link: "https://www.instagram.com/", iconKey: "instagram" },
]

const QUERY_CATEGORIES = [
  "Event Registration",
  "Technical Support",
  "Membership / Joining",
  "Learning Resources",
  "Leaderboard / Score",
  "Other",
]

const FAQS = [
  { q: "How do I join the GfG Campus Club?", a: "Click Join Community on the Home page or use the WhatsApp link to join our community group. Membership is open to all RIT students." },
  { q: "How are leaderboard scores calculated?", a: "Scores are based on the number of problems solved on the GeeksforGeeks platform, combined with event participation and coding streaks." },
  { q: "How can I register for events?", a: "Visit the Events page and click the Register button on any upcoming event. Registration details are also posted in the WhatsApp community." },
  { q: "Who can I contact for technical issues?", a: "Submit a query using the form with the category Technical Support and our team will respond within 24 hours." },
]

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2f8d46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#25D366"/>
    <path d="M22.5 9.5A9.1 9.1 0 0 0 16 7a9 9 0 0 0-7.8 13.5L7 25l4.6-1.2A9 9 0 0 0 25 16a9 9 0 0 0-2.5-6.5zM16 23.7a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.7.7.7-2.7-.2-.3A7.5 7.5 0 1 1 16 23.7zm4.1-5.6c-.2-.1-1.3-.6-1.5-.7s-.3-.1-.5.1-.5.7-.6.8-.2.2-.4 0a6 6 0 0 1-1.8-1.1 6.7 6.7 0 0 1-1.2-1.6c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2 4.7 4.7 0 0 0 1 2.5 10.8 10.8 0 0 0 4.1 3.6c.6.2 1 .4 1.3.5a3.2 3.2 0 0 0 1.5.1 2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.2-.3-.3-.5-.4z" fill="white"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#0A66C2"/>
    <path d="M10 13h3v10h-3V13zm1.5-4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 13h2.9v1.4h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.6 2 3.6 4.7V23h-3v-4.9c0-1.2 0-2.7-1.6-2.7s-1.9 1.3-1.9 2.6V23H15V13z" fill="white"/>
  </svg>
)

const GitHubIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#24292e"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M16 7a9 9 0 0 0-2.8 17.5c.4.1.6-.2.6-.4v-1.4c-2.5.5-3-1.2-3-1.2a2.4 2.4 0 0 0-1-1.3c-.8-.5.1-.5.1-.5a1.9 1.9 0 0 1 1.4.9 1.9 1.9 0 0 0 2.6.8 1.9 1.9 0 0 1 .6-1.2c-2-.2-4.1-1-4.1-4.5a3.5 3.5 0 0 1 .9-2.4 3.2 3.2 0 0 1 .1-2.4s.8-.2 2.5.9a8.7 8.7 0 0 1 4.6 0c1.7-1.1 2.5-.9 2.5-.9a3.2 3.2 0 0 1 .1 2.4 3.5 3.5 0 0 1 .9 2.4c0 3.5-2.1 4.3-4.1 4.5a2.1 2.1 0 0 1 .6 1.7v2.5c0 .2.2.5.6.4A9 9 0 0 0 16 7z" fill="white"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433"/>
        <stop offset="25%" stopColor="#e6683c"/>
        <stop offset="50%" stopColor="#dc2743"/>
        <stop offset="75%" stopColor="#cc2366"/>
        <stop offset="100%" stopColor="#bc1888"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#ig)"/>
    <rect x="9" y="9" width="14" height="14" rx="4" stroke="white" strokeWidth="1.5" fill="none"/>
    <circle cx="16" cy="16" r="3.5" stroke="white" strokeWidth="1.5" fill="none"/>
    <circle cx="21" cy="11" r="1" fill="white"/>
  </svg>
)

const ICONS = { whatsapp: <WhatsAppIcon />, linkedin: <LinkedInIcon />, github: <GitHubIcon />, instagram: <InstagramIcon /> }

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  page: { padding: "48px 64px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1100px", margin: "0 auto", color: "#1a1a1a" },
  hero: { background: "linear-gradient(135deg, #f0faf3 0%, #e8f5e9 100%)", borderRadius: "16px", padding: "48px 56px", marginBottom: "48px" },
  heroTop: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" },
  heroText: { flex: 1 },
  title: { fontSize: "2.4rem", fontWeight: "800", color: "#1a1a1a", margin: "0 0 14px 0" },
  subtitle: { color: "#555", fontSize: "1.1rem", lineHeight: "1.8", maxWidth: "680px", margin: 0 },
  sectionTitle: { fontSize: "1.35rem", fontWeight: "700", borderLeft: "4px solid #2f8d46", paddingLeft: "14px", marginBottom: "20px" },
  section: { marginBottom: "48px" },

  infoCard: { background: "white", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "inline-flex", flexDirection: "column", minWidth: "320px" },
  infoLabel: { fontSize: "0.78rem", fontWeight: "700", color: "#2f8d46", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" },
  infoValue: { fontSize: "0.97rem", color: "#333", fontWeight: "500", lineHeight: "1.5" },

  communityGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" },
  communityCard: { background: "#f9fafb", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px", textDecoration: "none", color: "#1a1a1a", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
  communityIconWrap: { flexShrink: 0, width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" },
  communityLabel: { fontWeight: "700", fontSize: "0.97rem", marginBottom: "4px", color: "#1a1a1a" },
  communityDesc: { fontSize: "0.85rem", color: "#666", lineHeight: "1.5" },

  openQueryBtn: { background: "#2f8d46", color: "white", border: "none", borderRadius: "8px", padding: "12px 26px", fontSize: "0.97rem", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", alignSelf: "flex-start", marginTop: "4px" },

  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" },
  modal: { background: "white", borderRadius: "16px", padding: "36px 40px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", position: "relative" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" },
  modalTitle: { fontSize: "1.2rem", fontWeight: "800", margin: 0, borderLeft: "4px solid #2f8d46", paddingLeft: "14px" },
  closeBtn: { background: "none", border: "1px solid #ddd", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", color: "#555" },

  label: { display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" },
  input: { width: "100%", padding: "11px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: "16px", background: "white" },
  textarea: { width: "100%", padding: "11px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical", height: "110px", marginBottom: "16px", lineHeight: "1.5", background: "white" },
  select: { width: "100%", padding: "11px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: "16px", background: "white", cursor: "pointer" },
  submitBtn: { width: "100%", background: "#2f8d46", color: "white", border: "none", borderRadius: "8px", padding: "12px", fontSize: "0.97rem", fontWeight: "600", cursor: "pointer" },
  successBox: { background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: "8px", padding: "14px 18px", color: "#2f8d46", fontWeight: "600", fontSize: "0.93rem", marginTop: "16px", textAlign: "center" },

  faqItem: { border: "1px solid #e0e0e0", borderRadius: "10px", marginBottom: "10px", overflow: "hidden", background: "white" },
  faqQ: { padding: "16px 20px", cursor: "pointer", fontWeight: "600", fontSize: "0.97rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", userSelect: "none" },
  faqA: { padding: "14px 20px 16px", color: "#555", fontSize: "0.93rem", lineHeight: "1.7", borderTop: "1px solid #f0f0f0" },

  footer: { marginTop: "64px", background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", borderRadius: "16px", padding: "36px 44px", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" },
  footerTitle: { fontSize: "1.15rem", fontWeight: "800", marginBottom: "8px" },
  footerSub: { color: "#aaa", fontSize: "0.88rem", lineHeight: "1.8" },
  footerEmail: { color: "#2f8d46", textDecoration: "none", fontWeight: "600" },
  copyright: { textAlign: "center", marginTop: "16px", color: "#999", fontSize: "0.83rem" },
  dot: { width: "9px", height: "9px", borderRadius: "50%", background: "#2f8d46", flexShrink: 0 },
}

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={styles.faqItem}>
      <div style={styles.faqQ} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span style={{ color: "#2f8d46", fontSize: "1.1rem", flexShrink: 0, fontWeight: "400" }}>
          {open ? "−" : "+"}
        </span>
      </div>
      {open && (
        <div style={styles.faqA}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ ...styles.dot, marginTop: "8px" }} />
            <span>{a}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── QUERY MODAL ──────────────────────────────────────────────────────────────
function QueryModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", regNo: "", category: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setForm({ name: "", email: "", regNo: "", category: "", message: "" })
    setTimeout(() => { setSubmitted(false); onClose() }, 2500)
  }

  return (
    <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Submit a Query</h2>
          <button style={styles.closeBtn} onClick={onClose}>Close</button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} required />

            <label style={styles.label}>Email Address</label>
            <input style={styles.input} name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />

            <label style={styles.label}>Register Number</label>
            <input style={styles.input} name="regNo" placeholder="Enter your register number" value={form.regNo} onChange={handleChange} required />

            <label style={styles.label}>Category</label>
            <select style={styles.select} name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select a category</option>
              {QUERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <label style={styles.label}>Message</label>
            <textarea style={styles.textarea} name="message" placeholder="Describe your query in detail" value={form.message} onChange={handleChange} required />

            <button type="submit" style={styles.submitBtn}>Submit Query</button>
          </form>
        ) : (
          <div style={styles.successBox}>
            Query submitted successfully. We will respond to your email within 24 hours.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
function Contact() {
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setModalOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div style={styles.page}>

      {modalOpen && <QueryModal onClose={() => setModalOpen(false)} />}

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroTop}>
          <div style={styles.heroText}>
            <h1 style={styles.title}>Contact Us</h1>
            <p style={styles.subtitle}>
              Have a question, want to join, or need support? Reach out through any of the
              channels below — we are always happy to help fellow coders at RIT.
            </p>
          </div>
          <button style={styles.openQueryBtn} onClick={() => setModalOpen(true)}>
            Submit a Query
          </button>
        </div>
      </div>

      {/* CONTACT INFO */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Contact Information</h2>
        {CONTACT_INFO.map((item) => (
          <div key={item.label} style={styles.infoCard}>
            <div style={styles.infoLabel}>
              <MailIcon />
              {item.label}
            </div>
            <a href={item.link} style={{ ...styles.infoValue, color: "#2f8d46", textDecoration: "none" }}>
              {item.value}
            </a>
          </div>
        ))}
      </section>

      {/* COMMUNITY LINKS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Community Links</h2>
        <div style={styles.communityGrid}>
          {COMMUNITY_LINKS.map((link) => (
            <a key={link.label} href={link.link} target="_blank" rel="noreferrer" style={styles.communityCard}>
              <div style={styles.communityIconWrap}>
                {ICONS[link.iconKey]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.communityLabel}>{link.label}</div>
                <div style={styles.communityDesc}>{link.desc}</div>
              </div>
              <span style={{ color: "#aaa", flexShrink: 0 }}><ArrowIcon /></span>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
        {FAQS.map((f) => (
          <FAQItem key={f.q} q={f.q} a={f.a} />
        ))}
      </section>

      {/* FOOTER */}
      <div style={styles.footer}>
        <div>
          <div style={styles.footerTitle}>GfG Campus Club — RIT</div>
          <div style={styles.footerSub}>
            Rajalakshmi Institute of Technology, Kuthambakkam, Chennai<br />
            <a href="mailto:geeksforgeeks@ritchennai.edu.in" style={styles.footerEmail}>
              geeksforgeeks@ritchennai.edu.in
            </a>
          </div>
        </div>
        <div style={{ background: "#2f8d46", color: "white", padding: "10px 22px", borderRadius: "8px", fontWeight: "700", fontSize: "0.88rem", whiteSpace: "nowrap" }}>
          GeeksforGeeks Campus Club
        </div>
      </div>

      <p style={styles.copyright}>
        © {new Date().getFullYear()} GfG Campus Club, RIT. All rights reserved.
      </p>

    </div>
  )
}

export default Contact