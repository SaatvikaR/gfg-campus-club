import { useState, useMemo, useEffect } from "react"
import { useTheme } from "../ThemeContext"

function useIsMobile(){const[v,setV]=useState(window.innerWidth<600);useEffect(()=>{const fn=()=>setV(window.innerWidth<600);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn)},[]);return v}

const RESOURCES={
  "Data Structures & Algorithms":[{title:"DSA Tutorials",desc:"Complete DSA topics from beginner to advanced.",link:"https://www.geeksforgeeks.org/data-structures/"},{title:"Practice Problems",desc:"Improve problem-solving with coding exercises.",link:"https://practice.geeksforgeeks.org/"},{title:"Advanced DSA",desc:"Learn Trees, Graphs, DP, and more.",link:"https://www.geeksforgeeks.org/fundamentals-of-algorithms/"},{title:"Competitive Programming",desc:"Master coding contests and algorithms.",link:"https://www.geeksforgeeks.org/competitive-programming-a-complete-guide/"},{title:"Recursion & Backtracking",desc:"Master recursion and backtracking techniques.",link:"https://www.geeksforgeeks.org/recursion/"},{title:"Sorting & Searching",desc:"Explore all sorting and searching methods.",link:"https://www.geeksforgeeks.org/sorting-algorithms/"}],
  "Programming Languages":[{title:"Python",desc:"Beginner friendly Python tutorials.",link:"https://www.geeksforgeeks.org/python-programming-language/"},{title:"Java",desc:"Learn Java programming concepts.",link:"https://www.geeksforgeeks.org/java/"},{title:"C++",desc:"Master C++ from basics to advanced.",link:"https://www.geeksforgeeks.org/c-plus-plus/"},{title:"JavaScript",desc:"Learn JS for web and app development.",link:"https://www.geeksforgeeks.org/javascript/"},{title:"Programming Paradigms",desc:"OOP, Functional Programming, and more.",link:"https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/"},{title:"C Programming",desc:"Master the basics of C programming.",link:"https://www.geeksforgeeks.org/c-programming-language/"}],
  "Web & App Development":[{title:"Web Development Basics",desc:"HTML, CSS, JavaScript fundamentals.",link:"https://www.geeksforgeeks.org/web-development/"},{title:"React JS",desc:"Build modern websites using React.",link:"https://www.geeksforgeeks.org/reactjs/"},{title:"Node.js & Backend",desc:"Server-side development with Node.js.",link:"https://www.geeksforgeeks.org/nodejs-tutorial/"},{title:"Flutter",desc:"Build mobile apps with Flutter.",link:"https://www.geeksforgeeks.org/flutter-tutorial/"},{title:"MongoDB & Databases",desc:"Database fundamentals for web apps.",link:"https://www.geeksforgeeks.org/mongodb/"},{title:"Angular Framework",desc:"Build dynamic web apps using Angular.",link:"https://www.geeksforgeeks.org/angular/"}],
  "CS Fundamentals":[{title:"Operating Systems",desc:"Learn OS concepts and algorithms.",link:"https://www.geeksforgeeks.org/operating-systems/"},{title:"DBMS",desc:"DBMS concepts, SQL, relational databases.",link:"https://www.geeksforgeeks.org/dbms/"},{title:"Computer Networks",desc:"Learn networking fundamentals.",link:"https://www.geeksforgeeks.org/computer-network-tutorials/"},{title:"AI & Machine Learning",desc:"AI/ML tutorials and examples.",link:"https://www.geeksforgeeks.org/machine-learning/"},{title:"Compiler Design",desc:"Learn compiler concepts and design.",link:"https://www.geeksforgeeks.org/compiler-design-tutorials/"},{title:"Theory of Computation",desc:"Automata, languages, and computation.",link:"https://www.geeksforgeeks.org/theory-of-computation/"}],
  "Interview Preparation":[{title:"Interview Guide",desc:"Prepare for coding interviews.",link:"https://www.geeksforgeeks.org/interview-preparation-for-software-developer/"},{title:"System Design",desc:"Learn system design for interviews.",link:"https://www.geeksforgeeks.org/system-design-interview-questions/"},{title:"Aptitude & HR",desc:"Prepare for logical and HR rounds.",link:"https://www.geeksforgeeks.org/aptitude-preparation-for-interviews/"},{title:"Mock Interviews",desc:"Simulate interviews effectively.",link:"https://www.geeksforgeeks.org/mock-interviews/"},{title:"Coding Patterns",desc:"Learn common coding patterns.",link:"https://www.geeksforgeeks.org/coding-interview-patterns/"},{title:"Top 50 Questions",desc:"Most frequently asked questions.",link:"https://www.geeksforgeeks.org/top-50-interview-questions/"}]
}

function Resources(){
  const{theme,isDark}=useTheme();const isMobile=useIsMobile();const[search,setSearch]=useState("")
  const filtered=useMemo(()=>{const q=search.toLowerCase().trim();if(!q)return RESOURCES;const r={};for(const[cat,items]of Object.entries(RESOURCES)){const m=items.filter(i=>i.title.toLowerCase().includes(q)||i.desc.toLowerCase().includes(q));if(m.length)r[cat]=m}return r},[search])
  const S={
    page:{padding:isMobile?"20px 16px":"40px 48px",fontFamily:"'Segoe UI',sans-serif",maxWidth:"1400px",margin:"0 auto",color:theme.text},
    pageTitle:{fontSize:isMobile?"1.6rem":"2rem",fontWeight:"800",marginBottom:"6px",color:theme.text},
    subtitle:{color:theme.muted,fontSize:isMobile?"0.93rem":"1rem",marginBottom:"20px"},
    searchBox:{width:"100%",maxWidth:isMobile?"100%":"420px",padding:"11px 14px",border:`1px solid ${theme.border}`,borderRadius:"8px",fontSize:"0.95rem",marginBottom:"32px",boxSizing:"border-box",fontFamily:"inherit",background:theme.inputBg,color:theme.text},
    secTitle:{fontSize:isMobile?"1.05rem":"1.2rem",fontWeight:"700",borderLeft:"4px solid #2f8d46",paddingLeft:"12px",marginBottom:"16px",color:theme.text},
    cardGrid:{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill,minmax(220px,1fr))",gap:"14px",marginBottom:"36px"},
    card:{border:`1px solid ${theme.border}`,padding:"16px",borderRadius:"10px",background:theme.card,boxShadow:isDark?"0 2px 12px rgba(0,0,0,0.3)":"0 2px 6px rgba(0,0,0,0.05)",display:"flex",flexDirection:"column",gap:"6px"},
  }
  return(
    <div style={S.page}>
      <h1 style={S.pageTitle}>Learning Resources</h1>
      <p style={S.subtitle}>Explore coding, development, and interview resources from GeeksforGeeks.</p>
      <input type="text" placeholder="🔍  Search resources..." value={search} onChange={e=>setSearch(e.target.value)} style={S.searchBox}/>
      {Object.values(filtered).flat().length===0?(
        <p style={{color:theme.muted,padding:"20px 0"}}>No resources match "{search}".</p>
      ):Object.entries(filtered).map(([category,items])=>(
        <section key={category} style={{marginBottom:"36px"}}>
          <h2 style={S.secTitle}>{category}</h2>
          <div style={S.cardGrid}>
            {items.map(item=>(
              <div key={item.title} style={S.card}>
                <div style={{fontWeight:"700",fontSize:isMobile?"0.88rem":"0.95rem",color:theme.text}}>{item.title}</div>
                <p style={{color:theme.muted,fontSize:isMobile?"0.8rem":"0.87rem",lineHeight:"1.5",flex:1,margin:0}}>{item.desc}</p>
                <a href={item.link} target="_blank" rel="noreferrer" style={{color:theme.accentLt,fontWeight:"700",fontSize:"0.85rem",textDecoration:"none",marginTop:"4px"}}>Explore →</a>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
export default Resources