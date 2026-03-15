import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import { ThemeProvider, useTheme } from "./ThemeContext"

import Home      from "./pages/Home"
import About     from "./pages/About"
import Events    from "./pages/Events"
import Resources from "./pages/Resources"
import Community from "./pages/Community"
import Blog      from "./pages/Blog"
import Contact   from "./pages/Contact"
import AIHub     from "./pages/AIHub"

const NAV_LINKS = [
  { path: "/",          label: "Home"      },
  { path: "/about",     label: "About"     },
  { path: "/events",    label: "Events"    },
  { path: "/resources", label: "Resources" },
  { path: "/community", label: "Community" },
  { path: "/blog",      label: "Blog"      },
  { path: "/contact",   label: "Contact"   },
  { path: "/ai",        label: "AI Hub", highlight: true },
]

const SunIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
const MoonIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>

function Navbar() {
  const location               = useLocation()
  const { theme, isDark, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const activeColor = isDark ? "#4ade80" : "white"
  const linkColor   = isDark ? "#94a3b8" : "white"

  return (
    <nav style={{
      background: theme.navBg,
      borderBottom: isDark ? `1px solid ${theme.border}` : "none",
      position: "sticky", top: 0, zIndex: 500,
      boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.15)",
      transition: "background 0.3s"
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>

        <Link to="/" style={{ color: activeColor, textDecoration: "none", fontWeight: "800", fontSize: "1.05rem", letterSpacing: "-0.02em", flexShrink: 0 }}>
          GfG <span style={{ color: isDark ? "#e2e8f0" : "white", fontWeight: "400", opacity: 0.85 }}>Campus Club</span>
        </Link>

        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {NAV_LINKS.map(link => (
              <Link key={link.path} to={link.path} style={{
                color: location.pathname === link.path ? activeColor : linkColor,
                textDecoration: "none",
                fontWeight: location.pathname === link.path ? "700" : "500",
                fontSize: "0.88rem", padding: "6px 12px", borderRadius: "6px",
                background: link.highlight ? "rgba(255,255,255,0.2)" : location.pathname === link.path ? theme.navActive : "transparent",
                transition: "all 0.15s"
              }}>{link.label}</Link>
            ))}

            {/* Theme toggle pill */}
            <button onClick={toggle} style={{
              marginLeft: "8px", display: "flex", alignItems: "center", gap: "6px",
              background: isDark ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.2)",
              border: isDark ? "1px solid rgba(74,222,128,0.35)" : "1px solid rgba(255,255,255,0.35)",
              borderRadius: "20px", padding: "5px 12px", cursor: "pointer",
              color: activeColor, fontSize: "0.78rem", fontWeight: "700",
              transition: "all 0.2s", fontFamily: "inherit"
            }}>
              {isDark ? <><SunIcon />&nbsp;Light</> : <><MoonIcon />&nbsp;Dark</>}
            </button>
          </div>
        )}

        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={toggle} style={{
              background: isDark ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.2)",
              border: "none", borderRadius: "50%", width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: activeColor
            }}>
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", color: isDark ? "#e2e8f0" : "white", lineHeight: 0 }}>
              {menuOpen
                ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              }
            </button>
          </div>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={{ background: isDark ? "#172032" : "#237a39", padding: "10px 0 14px", borderTop: `1px solid ${isDark ? theme.border : "rgba(255,255,255,0.15)"}` }}>
          {NAV_LINKS.map(link => (
            <Link key={link.path} to={link.path} style={{
              display: "block", textDecoration: "none", padding: "11px 24px",
              color: location.pathname === link.path ? activeColor : linkColor,
              fontWeight: location.pathname === link.path ? "700" : "500", fontSize: "0.97rem",
              background: location.pathname === link.path ? theme.navActive : "transparent",
              borderLeft: location.pathname === link.path ? `3px solid ${activeColor}` : "3px solid transparent"
            }}>{link.label}</Link>
          ))}
        </div>
      )}
    </nav>
  )
}

function Footer() {
  const { theme, isDark } = useTheme()
  return (
    <footer style={{ background: theme.footerBg, borderTop: isDark ? `1px solid ${theme.border}` : "none", color: "white", marginTop: "auto", transition: "background 0.3s" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px 20px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
          <div>
            <div style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "10px" }}>
              GfG <span style={{ color: "#4ade80" }}>Campus Club</span> <span style={{ opacity: 0.7, fontWeight: "400" }}>— RIT</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.86rem", lineHeight: "1.8" }}>
              Rajalakshmi Institute of Technology<br />Kuthambakkam, Chennai — 600 124
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.08em" }}>Contact</div>
            <a href="mailto:geeksforgeeks@ritchennai.edu.in" style={{ color: "#4ade80", textDecoration: "none", fontSize: "0.88rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "7px" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              geeksforgeeks@ritchennai.edu.in
            </a>
          </div>
        </div>
        <div style={{ paddingTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", margin: 0 }}>© {new Date().getFullYear()} GfG Campus Club, RIT. All rights reserved.</p>
          <div style={{ background: "#2f8d46", color: "white", padding: "5px 14px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: "700" }}>GeeksforGeeks</div>
        </div>
      </div>
    </footer>
  )
}

function AppInner() {
  const { theme } = useTheme()
  return (
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column", background: theme.bg, transition: "background 0.3s" }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/"          element={<Home />}      />
          <Route path="/about"     element={<About />}     />
          <Route path="/events"    element={<Events />}    />
          <Route path="/resources" element={<Resources />} />
          <Route path="/community" element={<Community />} />
          <Route path="/blog"      element={<Blog />}      />
          <Route path="/contact"   element={<Contact />}   />
          <Route path="/ai"        element={<AIHub />}     />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </Router>
  )
}

export default App