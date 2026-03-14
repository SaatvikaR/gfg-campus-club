const MISSION = [
  "Promote coding culture on campus",
  "Help students master Data Structures and Algorithms",
  "Prepare students for technical interviews"
]

const OBJECTIVES = [
  "Conduct coding workshops",
  "Organize coding contests and hackathons",
  "Provide learning resources"
]

const COORDINATORS = [
  { role: "Faculty Coordinator", icon: "👩‍🏫" },
  { role: "Student Lead", icon: "🧑‍💻" },
  { role: "Technical Lead", icon: "⚙️" },
  { role: "Event Coordinator", icon: "📅" }
]

const styles = {
  page: { padding: "48px 64px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1100px", margin: "0 auto", color: "#1a1a1a" },
  hero: { background: "linear-gradient(135deg, #f0faf3 0%, #e8f5e9 100%)", borderRadius: "16px", padding: "48px 56px", marginBottom: "48px" },
  title: { fontSize: "2.4rem", fontWeight: "800", color: "#1a1a1a", marginBottom: "14px", margin: "0 0 14px 0", textAlign: "left" },
  subtitle: { color: "#555", fontSize: "1.1rem", lineHeight: "1.8", maxWidth: "780px", margin: 0, textAlign: "left" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "44px" },
  section: { marginBottom: "0" },
  sectionTitle: { fontSize: "1.35rem", fontWeight: "700", borderLeft: "4px solid #2f8d46", paddingLeft: "14px", marginBottom: "20px", textAlign: "left" },
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" },
  listItem: { display: "flex", alignItems: "center", gap: "12px", background: "#f9fafb", padding: "14px 20px", borderRadius: "10px", border: "1px solid #eee", fontSize: "1rem", textAlign: "left" },
  dot: { width: "9px", height: "9px", borderRadius: "50%", background: "#2f8d46", flexShrink: 0 },
  coordSection: { marginBottom: "44px" },
  coordGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
  coordCard: { background: "white", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "14px" },
  coordIcon: { fontSize: "1.8rem" },
  coordRole: { fontWeight: "600", color: "#333", fontSize: "1rem" }
}

function About() {
  return (
    <div style={styles.page}>

      <div style={styles.hero}>
        <h1 style={styles.title}>About GeeksforGeeks Campus Club — RIT</h1>
        <p style={styles.subtitle}>
          Welcome to the GeeksforGeeks Campus Club at Rajalakshmi Institute of Technology.
          We are a student-driven community built around a shared passion for technology, competitive programming,
          and career growth. Whether you're a beginner taking your first steps in coding or an experienced developer
          preparing for placements, this club is your space to learn, compete, and collaborate with like-minded peers.
        </p>
      </div>

      {/* Mission & Objectives side by side */}
      <div style={styles.twoCol}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Mission</h2>
          <ul style={styles.list}>
            {MISSION.map((item) => (
              <li key={item} style={styles.listItem}>
                <span style={styles.dot} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Objectives</h2>
          <ul style={styles.list}>
            {OBJECTIVES.map((item) => (
              <li key={item} style={styles.listItem}>
                <span style={styles.dot} />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Coordinators full width, evenly spaced */}
      <section style={styles.coordSection}>
        <h2 style={styles.sectionTitle}>Club Coordinators</h2>
        <div style={styles.coordGrid}>
          {COORDINATORS.map((c) => (
            <div key={c.role} style={styles.coordCard}>
              <span style={styles.coordIcon}>{c.icon}</span>
              <span style={styles.coordRole}>{c.role}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default About
