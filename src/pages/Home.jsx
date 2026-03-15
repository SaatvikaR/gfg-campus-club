import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../ThemeContext"

const EMAILJS_SERVICE_ID  = "service_8nt7tjg"
const EMAILJS_TEMPLATE_ID = "template_lymx6pf"
const EMAILJS_PUBLIC_KEY  = "PVeprAvVczvcO8VbS"

const QUOTES = ["The best way to predict the future is to code it.","Great developers never stop learning.","Practice coding every day to improve.","Consistency is the key to mastering programming.","First, solve the problem. Then, write the code."]
const DAILY_CHALLENGES = [
  { title:"Two Sum",link:"https://practice.geeksforgeeks.org/problems/two-sum/0"},
  { title:"Reverse a Linked List",link:"https://practice.geeksforgeeks.org/problems/reverse-a-linked-list/1"},
  { title:"Find the Missing Number",link:"https://practice.geeksforgeeks.org/problems/missing-number-in-array/0"},
  { title:"Longest Substring Without Repeating Characters",link:"https://practice.geeksforgeeks.org/problems/longest-substring-without-repeating-characters/0"},
  { title:"Maximum Subarray Sum",link:"https://practice.geeksforgeeks.org/problems/kadanes-algorithm/0"}
]
const UPCOMING_EVENTS = [
  { title:"DSA Bootcamp",date:"2026-03-25",time:"10:00 AM",venue:"Green Building, 4th Floor — Woziak Auditorium"},
  { title:"Weekly Coding Contest",date:"2026-03-30",time:"2:00 PM",venue:"Green Building, 4th Floor — Woziak Auditorium"},
  { title:"Web Development Workshop",date:"2026-04-05",time:"11:00 AM",venue:"Green Building, 4th Floor — Woziak Auditorium"}
]
const LEARNING_RESOURCES = [
  { title:"Data Structures & Algorithms",desc:"Practice problems and master DSA concepts.",link:"https://www.geeksforgeeks.org/data-structures/"},
  { title:"Web Development",desc:"Learn HTML, CSS, JavaScript and modern frameworks.",link:"https://www.geeksforgeeks.org/web-development/"},
  { title:"Interview Preparation",desc:"Prepare for technical interviews and coding rounds.",link:"https://www.geeksforgeeks.org/interview-preparation-for-software-developer/"}
]

function useIsMobile(){const[v,setV]=useState(window.innerWidth<600);useEffect(()=>{const fn=()=>setV(window.innerWidth<600);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn)},[]);return v}

const CalIcon=()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const ClkIcon=()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const LocIcon=()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
const BellIcon=()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const XIcon=()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

function loadEmailJS(){return new Promise(r=>{if(window.emailjs)return r(window.emailjs);const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";s.onload=()=>{window.emailjs.init(EMAILJS_PUBLIC_KEY);r(window.emailjs)};document.head.appendChild(s)})}

function AlarmModal({event,onClose}){
  const{theme,isDark}=useTheme()
  const[email,setEmail]=useState("")
  const[status,setStatus]=useState("idle")
  const[errMsg,setErrMsg]=useState("")
  const fd=new Date(event.date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})
  async function handleSend(){
    if(!email.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setErrMsg("Please enter a valid email address.");return}
    setErrMsg("");setStatus("sending")
    try{const ejs=await loadEmailJS();await ejs.send(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,{student_email:email,event_name:event.title,event_date:fd,event_time:event.time,event_venue:event.venue});setStatus("success")}
    catch{setErrMsg("Failed to send email. Please try again.");setStatus("idle")}
  }
  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"16px"}}>
      <div style={{background:theme.card,borderRadius:"16px",padding:"28px",maxWidth:"440px",width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.4)",position:"relative",border:`1px solid ${theme.border}`,animation:"modalPop 0.22s ease"}}>
        <button onClick={onClose} style={{position:"absolute",top:"14px",right:"14px",background:"none",border:"none",cursor:"pointer",color:theme.muted,padding:"4px",lineHeight:0}}><XIcon/></button>
        {status==="success"?(
          <div style={{textAlign:"center",padding:"12px 0"}}>
            <div style={{fontSize:"3rem",marginBottom:"12px"}}>🎉</div>
            <div style={{fontWeight:"800",fontSize:"1.1rem",color:theme.text,marginBottom:"8px"}}>You're registered!</div>
            <div style={{color:theme.muted,fontSize:"0.93rem",lineHeight:"1.6"}}>Reminder sent to <strong style={{color:theme.accentLt}}>{email}</strong> for <strong style={{color:theme.accentLt}}>{event.title}</strong>.</div>
            <button onClick={onClose} style={{width:"100%",background:theme.accent,color:"white",border:"none",borderRadius:"8px",padding:"11px",fontSize:"0.95rem",fontWeight:"700",cursor:"pointer",marginTop:"20px",fontFamily:"inherit"}}>Done</button>
          </div>
        ):(
          <>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
              <div style={{background:isDark?"rgba(47,141,70,0.2)":"#e8f5e9",borderRadius:"10px",width:"42px",height:"42px",display:"flex",alignItems:"center",justifyContent:"center",color:theme.accentLt,flexShrink:0}}><BellIcon/></div>
              <div><div style={{fontWeight:"800",fontSize:"1rem",color:theme.text}}>Set Reminder</div><div style={{fontSize:"0.8rem",color:theme.muted}}>Get an email reminder for this event</div></div>
            </div>
            <div style={{background:theme.cardAlt,border:`1px solid ${theme.border}`,borderRadius:"10px",padding:"12px 14px",marginBottom:"18px"}}>
              <div style={{fontWeight:"700",fontSize:"0.93rem",color:theme.text,marginBottom:"7px"}}>{event.title}</div>
              {[{icon:<CalIcon/>,text:fd},{icon:<ClkIcon/>,text:event.time},{icon:<LocIcon/>,text:event.venue}].map(({icon,text},i)=>(
                <span key={i} style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"0.82rem",color:theme.muted,marginBottom:"3px"}}>{icon}{text}</span>
              ))}
            </div>
            <label style={{display:"block",fontSize:"0.83rem",fontWeight:"600",color:theme.muted,marginBottom:"6px"}}>Your Email Address</label>
            <input type="email" placeholder="student@example.com" value={email} onChange={e=>{setEmail(e.target.value);setErrMsg("")}} onKeyDown={e=>e.key==="Enter"&&handleSend()}
              style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${errMsg?"#ef4444":theme.border}`,borderRadius:"8px",fontSize:"0.93rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box",background:theme.inputBg,color:theme.text}}/>
            {errMsg&&<div style={{color:"#f87171",fontSize:"0.78rem",marginTop:"5px"}}>{errMsg}</div>}
            <button onClick={handleSend} disabled={status==="sending"} style={{width:"100%",background:theme.accent,color:"white",border:"none",borderRadius:"8px",padding:"11px",fontSize:"0.95rem",fontWeight:"700",cursor:status==="sending"?"not-allowed":"pointer",marginTop:"14px",opacity:status==="sending"?0.7:1,fontFamily:"inherit"}}>
              {status==="sending"?"Sending…":"Notify Me 🔔"}
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes modalPop{from{opacity:0;transform:scale(0.92) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  )
}

function useCountdown(targetDate,targetTime){
  const getTimeLeft=()=>{
    const[time,mod]=targetTime.split(" ");let[h,m]=time.split(":");
    if(mod==="PM"&&h!=="12")h=String(parseInt(h)+12);if(mod==="AM"&&h==="12")h="00";
    const diff=new Date(`${targetDate}T${h.padStart(2,"0")}:${(m||"00").padStart(2,"0")}:00`)-new Date();
    if(diff<=0)return null;
    return{days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),minutes:Math.floor(diff%3600000/60000),seconds:Math.floor(diff%60000/1000)}
  }
  const[t,setT]=useState(getTimeLeft);useEffect(()=>{const id=setInterval(()=>setT(getTimeLeft()),1000);return()=>clearInterval(id)},[]);return t
}

function EventAlert({event}){
  const{theme,isDark}=useTheme()
  const timeLeft=useCountdown(event.date,event.time)
  const[showModal,setShowModal]=useState(false)
  const isMobile=useIsMobile()
  const fd=new Date(event.date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})
  const alertBg=isDark?"linear-gradient(135deg,#0d2818,#0f3320)":"linear-gradient(135deg,#f0fdf4,#dcfce7)"
  const alertBorder=isDark?"#1e4d2e":"#86efac"
  return(
    <>
      <div style={{background:alertBg,border:`1px solid ${alertBorder}`,borderLeft:"5px solid #2f8d46",borderRadius:"12px",padding:isMobile?"14px 16px":"18px 24px",marginBottom:"28px",display:"flex",flexDirection:isMobile?"column":"row",alignItems:isMobile?"flex-start":"center",justifyContent:"space-between",gap:"14px"}}>
        <div style={{display:"flex",gap:"14px",alignItems:"flex-start"}}>
          <button onClick={()=>setShowModal(true)} style={{background:"none",border:"none",cursor:"pointer",color:theme.accentLt,marginTop:"2px",padding:0,lineHeight:0,transition:"transform 0.15s",flexShrink:0}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.25)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><BellIcon/></button>
          <div>
            <div style={{fontSize:"0.7rem",fontWeight:"700",color:theme.accentLt,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px"}}>Upcoming Event</div>
            <div style={{fontWeight:"800",fontSize:isMobile?"0.97rem":"1.05rem",color:theme.text,marginBottom:"6px"}}>{event.title}</div>
            <div style={{display:"flex",flexDirection:isMobile?"column":"row",gap:isMobile?"4px":"16px",flexWrap:"wrap"}}>
              {[{icon:<CalIcon/>,text:fd},{icon:<ClkIcon/>,text:event.time},{icon:<LocIcon/>,text:event.venue}].map(({icon,text},i)=>(
                <span key={i} style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"0.83rem",color:theme.muted}}>{icon}{text}</span>
              ))}
            </div>
            <div style={{marginTop:"6px",fontSize:"0.73rem",color:theme.accentLt,fontWeight:"600"}}>🔔 Click the bell to get a reminder email</div>
          </div>
        </div>
        {timeLeft?(
          <div style={{display:"flex",gap:"6px",flexShrink:0,alignSelf:isMobile?"center":"auto"}}>
            {[{val:timeLeft.days,label:"Days"},{val:timeLeft.hours,label:"Hrs"},{val:timeLeft.minutes,label:"Mins"},{val:timeLeft.seconds,label:"Secs"}].map(({val,label})=>(
              <div key={label} style={{textAlign:"center",background:theme.card,border:`1px solid ${isDark?"#1e4d2e":"#bbf7d0"}`,borderRadius:"8px",padding:isMobile?"6px 8px":"8px 12px",minWidth:isMobile?"44px":"52px"}}>
                <div style={{fontSize:isMobile?"1.1rem":"1.3rem",fontWeight:"800",color:theme.accentLt,fontVariantNumeric:"tabular-nums"}}>{String(val).padStart(2,"0")}</div>
                <div style={{fontSize:"0.62rem",color:theme.muted,fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</div>
              </div>
            ))}
          </div>
        ):<div style={{fontSize:"0.83rem",color:theme.muted,fontStyle:"italic"}}>Event in progress or completed</div>}
      </div>
      {showModal&&<AlarmModal event={event} onClose={()=>setShowModal(false)}/>}
    </>
  )
}

function DailyChallengeWidget({quote,challenge}){
  const{theme,isDark}=useTheme()
  const[revealed,setRevealed]=useState(false)
  const isMobile=useIsMobile()
  return(
    <div style={{marginBottom:"36px"}}>
      {!revealed?(
        <div onClick={()=>setRevealed(true)} style={{display:"flex",alignItems:"center",gap:"16px",background:theme.card,border:`1px solid ${theme.border}`,borderLeft:"5px solid #2f8d46",borderRadius:"12px",padding:isMobile?"16px 18px":"22px 28px",cursor:"pointer",boxShadow:isDark?"0 2px 12px rgba(0,0,0,0.3)":"0 2px 8px rgba(0,0,0,0.05)"}}>
          <div style={{flexShrink:0,background:isDark?"rgba(47,141,70,0.15)":"#e8f5e9",borderRadius:"50%",width:"46px",height:"46px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.accentLt} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:"0.7rem",fontWeight:"700",color:theme.accentLt,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px"}}>Daily Challenge</div>
            <div style={{fontSize:isMobile?"0.93rem":"1rem",fontWeight:"600",color:theme.text}}>Click to reveal today's coding challenge</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      ):(
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderLeft:"5px solid #2f8d46",borderRadius:"12px",overflow:"hidden",boxShadow:isDark?"0 2px 12px rgba(0,0,0,0.3)":"0 2px 8px rgba(0,0,0,0.05)"}}>
          <div style={{padding:isMobile?"16px 18px":"22px 28px",borderBottom:`1px solid ${theme.border}`}}>
            <div style={{fontSize:"0.7rem",fontWeight:"700",color:theme.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"8px"}}>Quote of the Day</div>
            <div style={{fontSize:isMobile?"0.97rem":"1.05rem",fontStyle:"italic",color:theme.muted,lineHeight:"1.7"}}>"{quote}"</div>
          </div>
          <div style={{padding:isMobile?"14px 18px":"20px 28px",background:theme.cardAlt,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
            <div>
              <div style={{fontSize:"0.7rem",fontWeight:"700",color:theme.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"5px"}}>Today's Coding Challenge</div>
              <div style={{fontWeight:"700",fontSize:"0.97rem",color:theme.text}}>{challenge.title}</div>
            </div>
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={()=>setRevealed(false)} style={{background:"none",border:`1px solid ${theme.border}`,borderRadius:"6px",padding:"7px 12px",cursor:"pointer",fontSize:"0.82rem",color:theme.muted,fontFamily:"inherit"}}>Hide</button>
              <a href={challenge.link} target="_blank" rel="noreferrer" style={{background:theme.accent,color:"white",padding:"7px 16px",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"0.88rem",fontWeight:"600",textDecoration:"none",display:"inline-block"}}>Solve Now</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Home(){
  const{theme,isDark}=useTheme()
  const quote=useMemo(()=>QUOTES[Math.floor(Math.random()*QUOTES.length)],[])
  const challenge=useMemo(()=>DAILY_CHALLENGES[Math.floor(Math.random()*DAILY_CHALLENGES.length)],[])
  const isMobile=useIsMobile()
  const S={
    page:{padding:isMobile?"20px 16px":"40px 48px",fontFamily:"'Segoe UI',sans-serif",maxWidth:"1100px",margin:"0 auto",color:theme.text},
    hero:{textAlign:"center",padding:isMobile?"32px 16px 28px":"60px 20px 40px",background:theme.heroBg,border:isDark?`1px solid ${theme.border}`:"none",borderRadius:"14px",marginBottom:"28px"},
    heroTitle:{fontSize:isMobile?"1.6rem":"2.4rem",fontWeight:"800",color:theme.text,marginBottom:"10px"},
    heroSubtitle:{fontSize:isMobile?"0.95rem":"1.1rem",color:theme.muted,maxWidth:"560px",margin:"0 auto 22px",lineHeight:"1.6"},
    btn:{background:theme.accent,color:"white",padding:isMobile?"11px 22px":"13px 28px",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:isMobile?"0.93rem":"16px",fontWeight:"600",textDecoration:"none",display:"inline-block"},
    sectionHeader:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px",flexWrap:"wrap",gap:"8px"},
    sectionTitle:{fontSize:isMobile?"1.1rem":"1.4rem",fontWeight:"700",color:theme.text,borderLeft:"4px solid #2f8d46",paddingLeft:"12px",margin:0},
    viewAllLink:{color:theme.accentLt,fontWeight:"700",textDecoration:"none",fontSize:"0.9rem"},
    cardGrid:{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(220px,1fr))",gap:"16px",marginBottom:"36px"},
    card:{border:`1px solid ${theme.border}`,padding:"18px",borderRadius:"12px",background:theme.card,boxShadow:isDark?"0 2px 12px rgba(0,0,0,0.3)":"0 2px 8px rgba(0,0,0,0.06)",display:"flex",flexDirection:"column",gap:"8px"},
    cardTitle:{fontWeight:"700",fontSize:"0.97rem",color:theme.text},
    cardDesc:{color:theme.muted,fontSize:"0.88rem",lineHeight:"1.5",flex:1},
    linkBtn:{color:theme.accentLt,fontWeight:"700",textDecoration:"none",fontSize:"0.88rem"},
    registerBtn:{background:theme.accent,color:"white",border:"none",borderRadius:"6px",padding:"8px 14px",cursor:"pointer",fontSize:"0.85rem",fontWeight:"600",textDecoration:"none",display:"inline-block",alignSelf:"flex-start"},
  }
  return(
    <div style={S.page}>
      <EventAlert event={UPCOMING_EVENTS[0]}/>
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Welcome to GfG Campus Club — RIT</h1>
        <p style={S.heroSubtitle}>Join our coding community to master Data Structures, participate in hackathons, and level up your skills.</p>
        <a href="https://chat.whatsapp.com/HZjaf6LCpEPCvgiJkdQxi8?mode=hqctswa" target="_blank" rel="noreferrer" style={S.btn}>Join the Community</a>
      </div>
      <DailyChallengeWidget quote={quote} challenge={challenge}/>
      <div style={S.sectionHeader}><h2 style={S.sectionTitle}>Upcoming Events</h2><Link to="/events" style={S.viewAllLink}>View All →</Link></div>
      <div style={S.cardGrid}>
        {UPCOMING_EVENTS.map(ev=>(
          <div key={ev.title} style={S.card}>
            <div style={S.cardTitle}>{ev.title}</div>
            <div style={{color:theme.accentLt,fontSize:"0.86rem",fontWeight:"600"}}>{new Date(ev.date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})} · {ev.time}</div>
            <Link to="/events" style={S.registerBtn}>Register</Link>
          </div>
        ))}
      </div>
      <div style={S.sectionHeader}><h2 style={S.sectionTitle}>Learning Resources</h2><Link to="/resources" style={S.viewAllLink}>Explore More →</Link></div>
      <div style={S.cardGrid}>
        {LEARNING_RESOURCES.map(res=>(
          <div key={res.title} style={S.card}>
            <div style={S.cardTitle}>{res.title}</div>
            <div style={S.cardDesc}>{res.desc}</div>
            <a href={res.link} target="_blank" rel="noreferrer" style={S.linkBtn}>Explore →</a>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Home