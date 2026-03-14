import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"

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

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <nav style={{
      background: "#2f8d46",
      position: "sticky", top: 0, zIndex: 500,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "56px"
      }}>
        {/* Logo */}
        <Link to="/" style={{
          color: "white", textDecoration: "none",
          fontWeight: "800", fontSize: "1.05rem", letterSpacing: "-0.02em",
          flexShrink: 0
        }}>
          GfG <span style={{ fontWeight: "400", opacity: 0.85 }}>Campus Club</span>
        </Link>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: location.pathname === link.path ? "700" : "500",
                  fontSize: "0.88rem",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  background: link.highlight
                    ? "rgba(255,255,255,0.2)"
                    : location.pathname === link.path
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                  transition: "background 0.15s"
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "6px", color: "white", lineHeight: 0
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{
          background: "#237a39",
          padding: "12px 0 16px",
          borderTop: "1px solid rgba(255,255,255,0.15)"
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: "block",
                color: "white",
                textDecoration: "none",
                padding: "11px 24px",
                fontWeight: location.pathname === link.path ? "700" : "500",
                fontSize: "0.97rem",
                background: location.pathname === link.path ? "rgba(255,255,255,0.1)" : "transparent",
                borderLeft: location.pathname === link.path ? "3px solid white" : "3px solid transparent"
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(135deg, #1a3d26, #14522e)",
      color: "white",
      marginTop: "auto"
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "32px 24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "0"
      }}>
        {/* Main footer row */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
          paddingBottom: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}>
          {/* Left — Club info */}
          <div>
            <div style={{
              fontSize: "1.05rem", fontWeight: "800",
              marginBottom: "10px", letterSpacing: "-0.01em"
            }}>
              GfG <span style={{ fontWeight: "400", opacity: 0.8 }}>Campus Club — RIT</span>
            </div>
            <div style={{ color: "#aaa", fontSize: "0.86rem", lineHeight: "1.8" }}>
              Rajalakshmi Institute of Technology<br />
              Kuthambakkam, Chennai — 600 124
            </div>
          </div>

          {/* Right — Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
            <div style={{
              fontSize: "0.72rem", fontWeight: "700",
              color: "#2f8d46", textTransform: "uppercase",
              letterSpacing: "0.08em"
            }}>
              Contact
            </div>
            <a
              href="mailto:geeksforgeeks@ritchennai.edu.in"
              style={{
                color: "#4ade80", textDecoration: "none",
                fontSize: "0.88rem", fontWeight: "600",
                display: "flex", alignItems: "center", gap: "7px"
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              geeksforgeeks@ritchennai.edu.in
            </a>
          </div>
        </div>

        {/* Copyright row */}
        <div style={{
          paddingTop: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px"
        }}>
          <p style={{
            color: "#666", fontSize: "0.8rem", margin: 0
          }}>
            © {new Date().getFullYear()} GfG Campus Club, RIT. All rights reserved.
          </p>
          <div style={{
            background: "#2f8d46", color: "white",
            padding: "5px 14px", borderRadius: "6px",
            fontSize: "0.78rem", fontWeight: "700"
          }}>
            GeeksforGeeks
          </div>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <Router>
      <Navbar />
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
      <Footer />
    </Router>
  )
}

export default App