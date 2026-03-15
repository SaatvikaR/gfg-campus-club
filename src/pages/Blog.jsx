import { useState, useEffect } from "react"
import { useTheme } from "../ThemeContext"

function useIsMobile(){const[v,setV]=useState(window.innerWidth<600);useEffect(()=>{const fn=()=>setV(window.innerWidth<600);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn)},[]);return v}

const MAX_CONTENT=1000

function Blog(){
  const{theme,isDark}=useTheme();const isMobile=useIsMobile()
  const[title,setTitle]=useState("");const[content,setContent]=useState("");const[posts,setPosts]=useState([]);const[error,setError]=useState("")
  const S={
    page:{padding:isMobile?"20px 16px":"40px 48px",fontFamily:"'Segoe UI',sans-serif",maxWidth:"760px",margin:"0 auto",color:theme.text},
    pageTitle:{fontSize:isMobile?"1.6rem":"2rem",fontWeight:"800",marginBottom:"6px",color:theme.text},
    subtitle:{color:theme.muted,marginBottom:"28px",fontSize:isMobile?"0.93rem":"1rem"},
    secTitle:{fontSize:isMobile?"1.05rem":"1.25rem",fontWeight:"700",borderLeft:"4px solid #2f8d46",paddingLeft:"12px",marginBottom:"16px",color:theme.text},
    formBox:{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:"12px",padding:isMobile?"18px 16px":"24px",marginBottom:"40px"},
    input:{width:"100%",padding:"11px 13px",margin:"7px 0",border:`1px solid ${theme.border}`,borderRadius:"8px",fontSize:"0.95rem",boxSizing:"border-box",outline:"none",fontFamily:"inherit",background:theme.inputBg,color:theme.text},
    textarea:{width:"100%",padding:"11px 13px",margin:"7px 0",border:`1px solid ${theme.border}`,borderRadius:"8px",fontSize:"0.95rem",height:"120px",resize:"vertical",boxSizing:"border-box",outline:"none",fontFamily:"inherit",background:theme.inputBg,color:theme.text},
    btn:{background:"#2f8d46",color:"white",border:"none",padding:"11px 22px",borderRadius:"8px",cursor:"pointer",fontSize:"0.95rem",fontWeight:"600",width:isMobile?"100%":"auto"},
    postCard:{border:`1px solid ${theme.border}`,padding:isMobile?"16px":"22px 24px",borderRadius:"12px",marginBottom:"16px",background:theme.card,boxShadow:isDark?"0 2px 12px rgba(0,0,0,0.3)":"0 2px 6px rgba(0,0,0,0.04)"},
  }
  const handleSubmit=e=>{
    e.preventDefault();const t=title.trim(),c=content.trim();
    if(!t||!c){setError("Both title and content are required.");return}
    setError("");setPosts([{id:Date.now(),title:t,content:c,time:new Date().toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})},...posts]);setTitle("");setContent("")
  }
  return(
    <div style={S.page}>
      <h1 style={S.pageTitle}>Campus Blog</h1>
      <p style={S.subtitle}>Share coding experiences, learning tips, and updates about programming and technology.</p>
      <h2 style={S.secTitle}>Write a Post</h2>
      <div style={S.formBox}>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Blog Title" value={title} onChange={e=>setTitle(e.target.value)} style={S.input} maxLength={120}/>
          <textarea placeholder="Write your blog content here..." value={content} onChange={e=>setContent(e.target.value.slice(0,MAX_CONTENT))} style={S.textarea}/>
          <div style={{textAlign:"right",fontSize:"0.79rem",color:theme.muted,margin:"-4px 0 8px"}}>{content.length}/{MAX_CONTENT}</div>
          {error&&<p style={{color:"#f87171",fontSize:"0.88rem",margin:"0 0 10px"}}>{error}</p>}
          <button type="submit" style={S.btn}>Publish Post</button>
        </form>
      </div>
      <h2 style={S.secTitle}>Recent Posts ({posts.length})</h2>
      {posts.length===0?(
        <div style={{textAlign:"center",padding:"36px 16px",color:theme.muted}}><div style={{fontSize:"2.5rem",marginBottom:"8px"}}>✍️</div><p>No posts yet. Be the first to write one!</p></div>
      ):posts.map(post=>(
        <div key={post.id} style={S.postCard}>
          <div style={{fontWeight:"700",fontSize:isMobile?"1rem":"1.1rem",marginBottom:"5px",color:theme.text}}>{post.title}</div>
          <div style={{color:theme.muted,fontSize:"0.82rem",marginBottom:"10px"}}>Posted on {post.time}</div>
          <div style={{color:theme.textSub,fontSize:"0.95rem",lineHeight:"1.7",whiteSpace:"pre-wrap"}}>{post.content}</div>
        </div>
      ))}
    </div>
  )
}
export default Blog