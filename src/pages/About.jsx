import { useState, useEffect } from "react"
import { useTheme } from "../ThemeContext"

function useIsMobile(){const[v,setV]=useState(window.innerWidth<600);useEffect(()=>{const fn=()=>setV(window.innerWidth<600);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn)},[]);return v}

const MISSION=["Promote coding culture on campus","Help students master Data Structures and Algorithms","Prepare students for technical interviews"]
const OBJECTIVES=["Conduct coding workshops","Organize coding contests and hackathons","Provide learning resources"]
const COORDINATORS=[{role:"Faculty Coordinator",icon:"👩‍🏫"},{role:"Student Lead",icon:"🧑‍💻"},{role:"Technical Lead",icon:"⚙️"},{role:"Event Coordinator",icon:"📅"}]

function About(){
  const{theme,isDark}=useTheme();const isMobile=useIsMobile()
  const S={
    page:{padding:isMobile?"20px 16px":"48px 64px",fontFamily:"'Segoe UI',sans-serif",maxWidth:"1100px",margin:"0 auto",color:theme.text},
    hero:{background:theme.heroBg,border:isDark?`1px solid ${theme.border}`:"none",borderRadius:"14px",padding:isMobile?"28px 20px":"48px 56px",marginBottom:"36px"},
    title:{fontSize:isMobile?"1.6rem":"2.4rem",fontWeight:"800",color:theme.text,margin:"0 0 12px 0"},
    subtitle:{color:theme.muted,fontSize:isMobile?"0.95rem":"1.1rem",lineHeight:"1.8",margin:0},
    twoCol:{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:"24px",marginBottom:"36px"},
    secTitle:{fontSize:isMobile?"1.1rem":"1.35rem",fontWeight:"700",borderLeft:"4px solid #2f8d46",paddingLeft:"14px",marginBottom:"16px",color:theme.text},
    list:{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"10px"},
    listItem:{display:"flex",alignItems:"center",gap:"12px",background:theme.card,padding:"12px 16px",borderRadius:"10px",border:`1px solid ${theme.border}`,fontSize:"0.95rem",color:theme.text},
    dot:{width:"9px",height:"9px",borderRadius:"50%",background:"#2f8d46",flexShrink:0},
    coordGrid:{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:"14px"},
    coordCard:{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:"12px",padding:isMobile?"14px 16px":"20px 24px",boxShadow:isDark?"0 2px 12px rgba(0,0,0,0.3)":"0 2px 8px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:"12px"},
  }
  return(
    <div style={S.page}>
      <div style={S.hero}><h1 style={S.title}>About GeeksforGeeks Campus Club — RIT</h1><p style={S.subtitle}>Welcome to the GeeksforGeeks Campus Club at Rajalakshmi Institute of Technology. We are a student-driven community built around a shared passion for technology, competitive programming, and career growth. Whether you're a beginner or an experienced developer, this club is your space to learn, compete, and collaborate.</p></div>
      <div style={S.twoCol}>
        <section><h2 style={S.secTitle}>Mission</h2><ul style={S.list}>{MISSION.map(item=><li key={item} style={S.listItem}><span style={S.dot}/>{item}</li>)}</ul></section>
        <section><h2 style={S.secTitle}>Objectives</h2><ul style={S.list}>{OBJECTIVES.map(item=><li key={item} style={S.listItem}><span style={S.dot}/>{item}</li>)}</ul></section>
      </div>
      <section><h2 style={S.secTitle}>Club Coordinators</h2>
        <div style={S.coordGrid}>{COORDINATORS.map(c=><div key={c.role} style={S.coordCard}><span style={{fontSize:isMobile?"1.5rem":"1.8rem"}}>{c.icon}</span><span style={{fontWeight:"600",color:theme.text,fontSize:isMobile?"0.85rem":"1rem",lineHeight:"1.3"}}>{c.role}</span></div>)}</div>
      </section>
    </div>
  )
}
export default About
