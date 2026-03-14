import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"

import Home from "./pages/Home"
import About from "./pages/About"
import Events from "./pages/Events"
import Resources from "./pages/Resources"
import Community from "./pages/Community"
import Blog from "./pages/Blog"
import Contact from "./pages/Contact"
import AIHub from "./pages/AIHub"


function App() {
  return (
    <Router>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "15px",
        background: "#2f8d46",
        color: "white",
        flexWrap: "wrap",
        gap: "8px"
      }}>
        <Link style={{ color: "white", textDecoration: "none" }} to="/">Home</Link>
        <Link style={{ color: "white", textDecoration: "none" }} to="/about">About</Link>
        <Link style={{ color: "white", textDecoration: "none" }} to="/events">Events</Link>
        <Link style={{ color: "white", textDecoration: "none" }} to="/resources">Resources</Link>
        <Link style={{ color: "white", textDecoration: "none" }} to="/community">Community</Link>
        <Link style={{ color: "white", textDecoration: "none" }} to="/blog">Blog</Link>
        <Link style={{ color: "white", textDecoration: "none" }} to="/contact">Contact</Link>
        <Link style={{ color:"white", textDecoration:"none", fontWeight:"700",
  background:"rgba(255,255,255,0.15)", padding:"5px 12px", borderRadius:"6px" }}
  to="/ai">AI Hub</Link>
        
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/"          element={<Home />}      />
        <Route path="/about"     element={<About />}     />
        <Route path="/events"    element={<Events />}    />
        <Route path="/resources" element={<Resources />} />
        <Route path="/community" element={<Community />} />
        <Route path="/blog"      element={<Blog />}      />
        <Route path="/contact"   element={<Contact />}   />
        <Route path="/ai" element={<AIHub />} />
        
      </Routes>

    </Router>
  )
}

export default App