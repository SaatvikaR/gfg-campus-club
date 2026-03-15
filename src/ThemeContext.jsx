import { createContext, useContext, useState, useEffect } from "react"

export const LIGHT = {
  bg:       "#ffffff",
  bgPage:   "#ffffff",
  card:     "#ffffff",
  cardAlt:  "#f9fafb",
  border:   "#e0e0e0",
  text:     "#1a1a1a",
  textSub:  "#333333",
  muted:    "#666666",
  mutedLt:  "#888888",
  accent:   "#2f8d46",
  accentLt: "#2f8d46",
  inputBg:  "#ffffff",
  heroBg:   "linear-gradient(135deg, #f0faf3 0%, #e8f5e9 100%)",
  heroBorder: "transparent",
  tagBg:    "#f3f4f6",
  tagText:  "#555555",
  navBg:    "#2f8d46",
  navText:  "#ffffff",
  navActive:"rgba(255,255,255,0.15)",
  navMuted: "#ffffff",
  footerBg: "linear-gradient(135deg, #1a3d26, #14522e)",
}

export const DARK = {
  bg:       "#0f172a",
  bgPage:   "#0f172a",
  card:     "#1e293b",
  cardAlt:  "#172032",
  border:   "#2d3f55",
  text:     "#e2e8f0",
  textSub:  "#cbd5e1",
  muted:    "#94a3b8",
  mutedLt:  "#64748b",
  accent:   "#2f8d46",
  accentLt: "#4ade80",
  inputBg:  "#172032",
  heroBg:   "linear-gradient(135deg, #0d1f35, #112240)",
  heroborder:"#2d3f55",
  tagBg:    "#263348",
  tagText:  "#94a3b8",
  navBg:    "#1e293b",
  navText:  "#e2e8f0",
  navActive:"rgba(74,222,128,0.1)",
  navMuted: "#94a3b8",
  footerBg: "#0d1f35",
}

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("gfg-theme") === "dark" } catch { return false }
  })

  useEffect(() => {
    try { localStorage.setItem("gfg-theme", isDark ? "dark" : "light") } catch {}
    document.body.style.background = isDark ? DARK.bg : LIGHT.bg
  }, [isDark])

  const theme  = isDark ? DARK : LIGHT
  const toggle = () => setIsDark(p => !p)

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}