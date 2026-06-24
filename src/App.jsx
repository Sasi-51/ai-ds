import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   MTIET AI & DS DEPARTMENT PORTAL  v2.0
   Theme: Emerald‑Violet Gradient · Glassmorphism · Neon Accents
   Advanced Features: AI Chatbot · QR Attendance · Resume Builder
   Digital ID Card · Placement Tracker · Feedback System + more
════════════════════════════════════════════════════════════════ */

// ── THEME TOKENS ──────────────────────────────────────────────
const T = {
  bg:       "#04080F",
  bg2:      "#080E1A",
  card:     "rgba(10,20,45,0.82)",
  panel:    "rgba(6,12,28,0.96)",
  em:       "#10B981",   // emerald primary
  emD:      "#059669",
  emL:      "#34D399",
  vi:       "#8B5CF6",   // violet accent
  viD:      "#7C3AED",
  viL:      "#A78BFA",
  rose:     "#F43F5E",
  amber:    "#F59E0B",
  sky:      "#0EA5E9",
  text:     "#F0FDF4",
  muted:    "#94A3B8",
  border:   "rgba(16,185,129,0.12)",
  borderV:  "rgba(139,92,246,0.25)",
  glass:    "rgba(16,185,129,0.04)",
};

const glow = (c, r=18) => `0 0 ${r}px ${c}50, 0 0 ${r*2}px ${c}20`;

const cardS = {
  background: T.card,
  border: `1px solid ${T.border}`,
  borderRadius: 16,
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
};

// ── PARTICLE CANVAS ───────────────────────────────────────────
function ParticleCanvas({ density = 55 }) {
  const ref = useRef(null);
  const anim = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const W = c.width, H = c.height;
    const pts = Array.from({ length: density }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.45, vy: (Math.random()-.5)*.45,
      r: Math.random()*1.8+.8, p: Math.random()*Math.PI*2,
    }));
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.p+=.018;
        if(p.x<0||p.x>W) p.vx*=-1;
        if(p.y<0||p.y>H) p.vy*=-1;
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<130){
          const a=(1-d/130)*.35;
          const g=ctx.createLinearGradient(pts[i].x,pts[i].y,pts[j].x,pts[j].y);
          g.addColorStop(0,`rgba(16,185,129,${a})`);
          g.addColorStop(.5,`rgba(139,92,246,${a*1.4})`);
          g.addColorStop(1,`rgba(14,165,233,${a})`);
          ctx.strokeStyle=g; ctx.lineWidth=.7;
          ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke();
        }
      }
      pts.forEach(p => {
        const pulse=Math.sin(p.p)*.5+.5;
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
        g.addColorStop(0,`rgba(16,185,129,${.9*pulse+.1})`);
        g.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=`rgba(255,255,255,${.6*pulse+.3})`;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      anim.current=requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(anim.current);
  }, [density]);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.65 }} />;
}

// ── ANIMATED COUNTER ──────────────────────────────────────────
function Count({ end, suffix="" }) {
  const [v,setV]=useState(0); const r=useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(!e.isIntersecting) return;
      let t=performance.now();
      const run=now=>{
        const p=Math.min((now-t)/2000,1), ease=1-Math.pow(1-p,4);
        setV(Math.floor(ease*end));
        if(p<1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run); obs.disconnect();
    },{threshold:.5});
    if(r.current) obs.observe(r.current);
    return ()=>obs.disconnect();
  },[end]);
  return <span ref={r}>{v.toLocaleString()}{suffix}</span>;
}

// ── CORE UI COMPONENTS ─────────────────────────────────────────
function GCard({ children, style={}, gC, onClick }) {
  const [hov,setHov]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ ...cardS, transition:"all .28s", cursor:onClick?"pointer":"default",
        transform:hov&&onClick?"translateY(-3px)":"none",
        boxShadow:hov?`0 18px 36px rgba(0,0,0,.4), 0 0 28px ${(gC||T.em)}22`:"0 4px 18px rgba(0,0,0,.3)",
        borderColor:hov?T.borderV:T.border, ...style }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, v="em", sz="md", style:s={}, dis }) {
  const [hov,setHov]=useState(false);
  const base={ border:"none", cursor:dis?"not-allowed":"pointer", fontFamily:"inherit",
    fontWeight:700, transition:"all .2s", borderRadius:10,
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    gap:7, opacity:dis?.5:1 };
  const sz2={ sm:{padding:"6px 14px",fontSize:12}, md:{padding:"10px 22px",fontSize:14}, lg:{padding:"14px 30px",fontSize:16} };
  const vars={
    em:{ background:hov?T.emD:T.em, color:"#fff", boxShadow:hov?glow(T.em,14):"none" },
    vi:{ background:hov?T.viD:T.vi, color:"#fff", boxShadow:hov?glow(T.vi,14):"none" },
    rose:{ background:hov?"#E11D48":T.rose, color:"#fff" },
    amber:{ background:hov?"#D97706":T.amber, color:"#fff", boxShadow:hov?glow(T.amber,12):"none" },
    sky:{ background:hov?"#0284C7":T.sky, color:"#fff" },
    ghost:{ background:hov?T.glass:"transparent", color:T.text, border:`1px solid ${hov?T.borderV:T.border}` },
    outline:{ background:"transparent", color:T.em, border:`1.5px solid ${T.em}`, boxShadow:hov?glow(T.em,10):"none" },
    outV:{ background:"transparent", color:T.vi, border:`1.5px solid ${T.vi}`, boxShadow:hov?glow(T.vi,10):"none" },
  };
  return (
    <button onClick={!dis?onClick:undefined} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ ...base, ...sz2[sz], ...vars[v], ...s }}>{children}</button>
  );
}

function Inp({ label, type="text", value, onChange, placeholder, icon, req, rows }) {
  const [foc,setFoc]=useState(false);
  const shared={ width:"100%", background:"rgba(255,255,255,0.04)",
    border:`1px solid ${foc?T.em:T.border}`, borderRadius:10, color:T.text,
    fontSize:14, outline:"none", fontFamily:"inherit",
    boxShadow:foc?`0 0 0 3px ${T.em}18`:"none", transition:"all .2s",
    boxSizing:"border-box" };
  return (
    <div style={{ marginBottom:15 }}>
      {label&&<label style={{ display:"block", marginBottom:5, fontSize:12, color:T.muted, fontWeight:600 }}>
        {label}{req&&<span style={{ color:T.rose }}> *</span>}
      </label>}
      <div style={{ position:"relative" }}>
        {icon&&<span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:15 }}>{icon}</span>}
        {rows
          ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
              onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} rows={rows}
              style={{ ...shared, padding:"10px 13px", resize:"vertical" }} />
          : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
              onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
              style={{ ...shared, padding:icon?"10px 13px 10px 36px":"10px 13px" }} />
        }
      </div>
    </div>
  );
}

function Sel({ label, value, onChange, options, req }) {
  return (
    <div style={{ marginBottom:15 }}>
      {label&&<label style={{ display:"block", marginBottom:5, fontSize:12, color:T.muted, fontWeight:600 }}>
        {label}{req&&<span style={{ color:T.rose }}> *</span>}
      </label>}
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:"100%", padding:"10px 13px", background:"rgba(10,20,45,0.9)",
          border:`1px solid ${T.border}`, borderRadius:10, color:T.text,
          fontSize:14, outline:"none", fontFamily:"inherit", cursor:"pointer", boxSizing:"border-box" }}>
        <option value="">Select...</option>
        {options.map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
      </select>
    </div>
  );
}

function Badge({ ch, color=T.em, size=11 }) {
  return <span style={{ display:"inline-block", padding:"3px 9px", borderRadius:20, fontSize:size,
    fontWeight:700, background:`${color}1A`, color, border:`1px solid ${color}35` }}>{ch}</span>;
}

function Progress({ value, color=T.em, label, height=6 }) {
  return (
    <div>
      {label&&<div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:12, color:T.muted }}>
        <span>{label}</span><span style={{ color }}>{value}%</span>
      </div>}
      <div style={{ height, background:"rgba(255,255,255,0.06)", borderRadius:height, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${value}%`, background:`linear-gradient(90deg,${color},${color}88)`,
          borderRadius:height, transition:"width 1.2s ease" }} />
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color, change }) {
  return (
    <GCard style={{ padding:20 }} gC={color}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <p style={{ margin:0, fontSize:11, color:T.muted, marginBottom:7 }}>{label}</p>
          <p style={{ margin:0, fontSize:26, fontWeight:900, color, lineHeight:1 }}>{value}</p>
          {change!=null&&<p style={{ margin:"5px 0 0", fontSize:11, color:change>0?T.em:T.rose }}>
            {change>0?"↑":"↓"} {Math.abs(change)}% this month</p>}
        </div>
        <div style={{ fontSize:28, background:`${color}12`, padding:10, borderRadius:12 }}>{icon}</div>
      </div>
    </GCard>
  );
}

function Tag({ ch }) {
  return <span style={{ padding:"2px 9px", borderRadius:6, fontSize:11, fontWeight:700,
    background:`${T.vi}18`, color:T.viL, border:`1px solid ${T.vi}30` }}>{ch}</span>;
}

function SectionTitle({ title, sub }) {
  return (
    <div style={{ textAlign:"center", marginBottom:44 }}>
      <h2 style={{ margin:"0 0 10px", fontSize:"clamp(22px,3.5vw,34px)", fontWeight:900,
        background:`linear-gradient(135deg,${T.text},${T.emL})`,
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{title}</h2>
      <div style={{ width:56, height:3, background:`linear-gradient(90deg,${T.em},${T.vi})`,
        borderRadius:2, margin:"0 auto 12px" }} />
      {sub&&<p style={{ color:T.muted, fontSize:14, margin:0 }}>{sub}</p>}
    </div>
  );
}

// ── BELL ──────────────────────────────────────────────────────
function Bell({ count, onClick }) {
  const [h,setH]=useState(false);
  return (
    <div style={{ position:"relative", cursor:"pointer" }} onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
      <div style={{ fontSize:19, padding:"7px 10px", background:h?T.glass:"transparent",
        borderRadius:9, transition:"all .2s" }}>🔔</div>
      {count>0&&<div style={{ position:"absolute", top:4, right:4, minWidth:15, height:15,
        background:T.rose, borderRadius:8, fontSize:9, fontWeight:800, color:"#fff",
        display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px" }}>{count}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const STUDENTS = [
  { id:"24HR1A3001", name:"Bindu",   batch:"2024-28", sec:"A", cgpa:8.7, att:88, status:"active",  email:"ananya@mtiet.edu",  phone:"9876543210", skills:["Python","ML","React"] },
  { id:"24HR1A3052", name:"Sruthi ", batch:"2024-28", sec:"A", cgpa:7.9, att:76, status:"active",  email:"karthik@mtiet.edu", phone:"9123456780", skills:["Java","DL","SQL"] },
  { id:"24HR1A3051", name:"Sasidhar ",     batch:"2024-28", sec:"A", cgpa:9.2, att:95, status:"active",  email:"priya@mtiet.edu",   phone:"9988112233", skills:["ML","NLP","Python"] },
  { id:"24HR1A3039", name:"Manoj ",    batch:"2024-28", sec:"A", cgpa:6.8, att:64, status:"warning", email:"rahul@mtiet.edu",   phone:"9456781230", skills:["Python","CV"] },
  { id:"24HR1A30A1", name:"Sonia Patel",    batch:"2024-28", sec:"A", cgpa:8.1, att:82, status:"active",  email:"sonia@mtiet.edu",   phone:"9321456780", skills:["Data Analytics","R"] },
];
const FACULTY = [
  { id:"F001", name:"Dr. K.Lokesh", desig:"Professor & HOD",    sub:"Java",  exp:18, email:"hod.aids@mtiet.edu", pub:42, rating:4.9 },
  { id:"F002", name:"Dr. K.Ranjith",       desig:"Associate Professor", sub:"Deep Learning",     exp:12, email:"ranjith@mtiet.edu", pub:28, rating:4.7 },
  { id:"F003", name:"Ms. K.Seerisha",        desig:"Assistant Professor", sub:"SQL",    exp:6,  email:"seerisha@mtiet.edu",  pub:12, rating:4.6 },
  { id:"F004", name:"Mr. Mahesh",          desig:"Assistant Professor", sub:"Python Programming", exp:4, email:"mahesh@mtiet.edu",    pub:6,  rating:4.5 },
];
const RESULTS = [
  { sub:"Machine Learning",  code:"20A51T5101", cr:4, marks:87, grade:"A",  pts:9 },
  { sub:"Deep Learning",     code:"20A51T5102", cr:4, marks:91, grade:"O",  pts:10 },
  { sub:"SQL",    code:"20A51T5103", cr:3, marks:76, grade:"B+", pts:8 },
  { sub:"NLP",               code:"20A51T5104", cr:3, marks:82, grade:"A",  pts:9 },
  { sub:"Java",   code:"20A51T5105", cr:3, marks:68, grade:"B",  pts:7 },
];
const ATTEND = [
  { sub:"Machine Learning",  total:60, pres:54, pct:90 },
  { sub:"Deep Learning",     total:55, pres:50, pct:91 },
  { sub:"SQL",    total:48, pres:38, pct:79 },
  { sub:"NLP",               total:42, pres:30, pct:71 },
  { sub:"Java",   total:36, pres:22, pct:61 },
];
const EVENTS = [
  { id:1, title:"National AI Hackathon 2024", date:"2024-03-15", type:"Hackathon",       reg:84,  status:"upcoming",   prize:"₹50,000" },
  { id:2, title:"Expert Talk: LLMs & Agents",  date:"2024-02-28", type:"Seminar",         reg:120, status:"completed",  prize:null },
  { id:3, title:"Industrial Visit — Infosys",  date:"2024-03-20", type:"Industrial Visit", reg:45,  status:"upcoming",   prize:null },
  { id:4, title:"PyTorch & TensorFlow Workshop",date:"2024-03-05", type:"Workshop",        reg:67,  status:"completed",  prize:null },
];
const NOTIFS = [
  { id:1, type:"result",     msg:"Semester 5 results published", time:"2 hrs ago", read:false },
  { id:2, type:"attendance", msg:"Attendance updated — Machine Learning", time:"5 hrs ago", read:false },
  { id:3, type:"event",      msg:"AI Hackathon registration open!", time:"1 day ago", read:true },
  { id:4, type:"admission",  msg:"New admission application #APP004 received", time:"2 days ago", read:true },
];
const ALUMNI = [
  { id:1, name:"Aditya Kumar",  batch:"2018-22", co:"Google",     role:"ML Engineer",     loc:"Hyderabad", pkg:"₹28 LPA", av:"🧑‍💻" },
  { id:2, name:"Deepika Rao",   batch:"2019-23", co:"Microsoft",  role:"Data Scientist",  loc:"Bangalore", pkg:"₹24 LPA", av:"👩‍💼" },
  { id:3, name:"Suresh Babu",   batch:"2017-21", co:"Amazon",     role:"AI Researcher",   loc:"Pune",      pkg:"₹32 LPA", av:"👨‍🔬" },
  { id:4, name:"Meera Iyer",    batch:"2018-22", co:"Startup CEO", role:"CEO, AIoT Ventures", loc:"Chennai", pkg:"Founder", av:"👩‍💻" },
];
const PLACEMENTS = [
  { student:"Ananya Reddy",   company:"Google",     role:"SWE Intern",       ctc:"₹8 LPA",  status:"selected",  date:"2024-01-15" },
  { student:"Priya Nair",     company:"Microsoft",  role:"Data Science Intern", ctc:"₹7 LPA", status:"selected", date:"2024-01-20" },
  { student:"Karthik Sharma", company:"TCS",        role:"Jr. Developer",    ctc:"₹4.5 LPA", status:"selected", date:"2024-02-01" },
  { student:"Sonia Patel",    company:"Infosys",    role:"Systems Engineer", ctc:"₹4 LPA",  status:"selected",  date:"2024-02-10" },
  { student:"Rahul Verma",    company:"Wipro",      role:"Jr. Developer",    ctc:"₹3.5 LPA", status:"pending",  date:"—" },
];
const INTERNSHIPS = [
  { student:"Ananya Reddy",   company:"Google Research", domain:"ML Ops",      duration:"3 months", status:"ongoing",    stipend:"₹35K/mo" },
  { student:"Priya Nair",     company:"ISRO",            domain:"AI Vision",   duration:"6 months", status:"ongoing",    stipend:"₹20K/mo" },
  { student:"Karthik Sharma", company:"Accenture",       domain:"Data Eng",    duration:"2 months", status:"completed",  stipend:"₹18K/mo" },
];
const FEEDBACK = [
  { id:1, sub:"Machine Learning",  rat:4.8, comment:"Excellent explanations with real-world examples.", student:"Ananya R.", date:"2024-03" },
  { id:2, sub:"Deep Learning",     rat:4.5, comment:"Great depth in CNN modules, more hands-on needed.", student:"Karthik S.", date:"2024-03" },
  { id:3, sub:"Data Analytics",    rat:4.2, comment:"Labs are very practical and industry-relevant.", student:"Priya N.", date:"2024-03" },
];
const COMPLAINTS = [
  { id:"CMP001", title:"Projector not working in Lab 3", by:"22A91A6601", dept:"Maintenance", status:"resolved",  date:"2024-02-10" },
  { id:"CMP002", title:"Wi-Fi connectivity issues in dept block", by:"22A91A6603", dept:"IT", status:"pending", date:"2024-03-01" },
  { id:"CMP003", title:"AC not cooling in Seminar Hall", by:"22A91A6602", dept:"Maintenance", status:"in-progress", date:"2024-03-05" },
];

const CHATBOT_RESPONSES = {
  admission:    "📝 Admissions for B.Tech AI & DS 2024 are open! Fill the form at mtiet.edu/apply. Eligibility: 60%+ in 12th with MPC. Seats: 120.",
  fee:          "💰 Annual fee: ₹85,000 (tuition). Hostel: ₹45,000. Scholarships available for merit & EBC students.",
  placement:    "💼 Placement rate: 94%. Top recruiters: Google, Microsoft, TCS, Infosys, Wipro. Highest package: ₹32 LPA.",
  faculty:      "👩‍🏫 We have 24 faculty members — 8 PhDs and 16 M.Tech degree holders with industry experience.",
  hostel:       "🏠 Separate hostel for boys & girls with AC/non-AC rooms. 24/7 security, gym, library.",
  default:      "👋 Hi! I'm MTIET AI Assistant. Ask me about admissions, fees, placements, hostel, courses, faculty, or events!",
};

// ══════════════════════════════════════════════════════════════
// PUBLIC WEBSITE
// ══════════════════════════════════════════════════════════════
const NAV = ["Home","About College","About Dept","Faculty","Activities","Events","Admissions","Alumni","Contact"];

function PubNav({ active, setActive, setView }) {
  const [sc,setSc]=useState(false);
  useEffect(()=>{ const h=()=>setSc(window.scrollY>50); window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h); },[]);
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000,
      background:sc?"rgba(4,8,15,0.96)":"transparent",
      backdropFilter:sc?"blur(24px)":"none",
      borderBottom:sc?`1px solid ${T.border}`:"none",
      transition:"all .4s", padding:"0 4vw" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
        <div onClick={()=>setActive("Home")} style={{ cursor:"pointer" }}>
          <div style={{ fontSize:12, fontWeight:900, color:T.em, letterSpacing:1.5 }}>MTIET</div>
          <div style={{ fontSize:9, color:T.muted, marginTop:1, letterSpacing:.5 }}>AI & Data Science</div>
        </div>
        <div style={{ display:"flex", gap:2, alignItems:"center", flexWrap:"wrap", justifyContent:"center" }}>
          {NAV.map(l=>(
            <button key={l} onClick={()=>setActive(l)} style={{ background:"none", border:"none", cursor:"pointer",
              color:active===l?T.em:T.muted, fontSize:12, fontWeight:600, padding:"5px 9px", borderRadius:7,
              fontFamily:"inherit", transition:"color .2s",
              borderBottom:active===l?`2px solid ${T.em}`:"2px solid transparent" }}>{l}</button>
          ))}
          <Btn onClick={()=>setView("login")} v="em" sz="sm" style={{ marginLeft:8 }}>Login Portal</Btn>
        </div>
      </div>
    </nav>
  );
}

function Hero({ setView, setActive }) {
  const [typed,setTyped]=useState("");
  const words = ["Department of", "Artificial Intelligence & Data Science"];
  const [wi,setWi]=useState(0);
  useEffect(()=>{
    let i=0, dir=1;
    const word=words[wi];
    const iv=setInterval(()=>{
      if(dir===1){ setTyped(word.slice(0,i++)); if(i>word.length){ dir=-1; clearInterval(iv); setTimeout(()=>setWi(p=>(p+1)%words.length),1200); } }
    },60);
    return()=>clearInterval(iv);
  },[wi]);
  return (
    <div style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,#04080F 0%,#080E1A 40%,#060D1E 100%)` }} />
      <div style={{ position:"absolute", inset:0,
        backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
        backgroundSize:"55px 55px", opacity:.45 }} />
      <ParticleCanvas />
      {/* glow orbs */}
      {[{top:"18%",left:"8%",c:T.em,w:280},{bottom:"20%",right:"8%",c:T.vi,w:240},{top:"55%",left:"48%",c:T.sky,w:180}].map((o,i)=>(
        <div key={i} style={{ position:"absolute", width:o.w, height:o.w, borderRadius:"50%",
          background:`radial-gradient(circle,${o.c}22,transparent 70%)`, filter:"blur(45px)", ...o }} />
      ))}
      <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 20px", maxWidth:960 }}>
        {/* pill */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 16px", borderRadius:30,
          background:`${T.em}12`, border:`1px solid ${T.em}35`, marginBottom:22 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:T.em, boxShadow:glow(T.em,7), display:"inline-block" }} />
          <span style={{ fontSize:11, color:T.em, fontWeight:700 }}></span>
        </div>
        <h1 style={{ margin:"0 0 6px", fontSize:"clamp(22px,4.5vw,48px)", fontWeight:900, color:T.text, lineHeight:1.1 }}>
          Mother Theresa Institute of
        </h1>
        <h1 style={{ margin:"0 0 14px", fontSize:"clamp(20px,4vw,44px)", fontWeight:900, lineHeight:1.1,
          background:`linear-gradient(135deg,${T.em},${T.vi},${T.sky})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Engineering & Technology
        </h1>
        <div style={{ height:34, display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:10 }}>
          <span style={{ fontSize:"clamp(13px,2.5vw,20px)", color:T.emL, fontWeight:700 }}>{typed}</span>
          <span style={{ borderRight:`2.5px solid ${T.em}`, height:20, animation:"blink 1s infinite" }} />
        </div>
        <p style={{ fontSize:13, color:T.muted, marginBottom:32, maxWidth:580, margin:"0 auto 32px", lineHeight:1.7 }}>
          Shaping the next generation of AI innovators and Data Science leaders through cutting-edge research and industry collaboration.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:48 }}>
          <Btn onClick={()=>setView("admission")} v="em" sz="lg">Apply Now — 2026</Btn>
          <Btn onClick={()=>setActive("About Dept")} v="ghost" sz="lg">Explore Department</Btn>
          <Btn onClick={()=>setView("login")} v="outV" sz="lg">Student Portal →</Btn>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, maxWidth:680, margin:"0 auto" }}>
          {[{l:"Students",e:480,s:"+",c:T.em},{l:"Faculty",e:24,s:"",c:T.vi},{l:"Placement %",e:94,s:"%",c:T.sky},{l:"Years of Excellence",e:15,s:"",c:T.amber}].map(s=>(
            <GCard key={s.l} style={{ padding:"14px 10px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color:s.c }}><Count end={s.e} suffix={s.s} /></div>
              <div style={{ fontSize:10, color:T.muted, marginTop:4 }}>{s.l}</div>
            </GCard>
          ))}
        </div>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

function AboutCollege() {
  return (
    <div style={{ padding:"80px 5vw", background:T.bg }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionTitle title="About the College" sub="A legacy of excellence in technical education since 2008" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginBottom:36 }}>
          <GCard style={{ padding:28 }}>
            <h3 style={{ color:T.em, marginTop:0 }}>Our Heritage</h3>
            <p style={{ color:T.muted, lineHeight:1.8, fontSize:13 }}>Founded in 2008, Mother Theresa Institute of Engineering and Technology stands on 20 acres in Palamaner, Chittoor District, Andhra Pradesh. With NAAC 'A' Grade accreditation and affiliation to JNTUK, MTIET has grown into one of the premier engineering institutions in South India, known for quality education, research, and 94% placement record.</p>
          </GCard>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[{i:"🎯",t:"Vision",d:"To be a globally recognised institution producing innovative engineers and ethical technology leaders."},{i:"🚀",t:"Mission",d:"Provide quality education through state-of-the-art infrastructure, experienced faculty, and strong industry-academia collaboration."}].map(x=>(
              <GCard key={x.t} style={{ padding:22, display:"flex", gap:14 }}>
                <span style={{ fontSize:26 }}>{x.i}</span>
                <div><h4 style={{ color:T.text, margin:"0 0 6px" }}>{x.t}</h4><p style={{ color:T.muted, fontSize:13, margin:0, lineHeight:1.7 }}>{x.d}</p></div>
              </GCard>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {[{i:"🏛️",l:"Campus Area",v:"20 Acres"},{i:"📚",l:"Programs",v:"12+"},{i:"🏆",l:"NAAC Grade",v:"'A'"},{i:"💼",l:"Companies",v:"50+"}].map(s=>(
            <GCard key={s.l} style={{ padding:22, textAlign:"center" }}>
              <div style={{ fontSize:30, marginBottom:8 }}>{s.i}</div>
              <div style={{ fontSize:18, fontWeight:900, color:T.em }}>{s.v}</div>
              <div style={{ fontSize:12, color:T.muted }}>{s.l}</div>
            </GCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutDept() {
  return (
    <div style={{ padding:"80px 5vw", background:T.bg2 }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionTitle title="AI & DS Department" sub="Building the future through Artificial Intelligence & Data Science" />
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:32, marginBottom:32 }}>
          <GCard style={{ padding:30 }}>
            <h3 style={{ color:T.em, marginTop:0 }}>Department Overview</h3>
            <p style={{ color:T.muted, lineHeight:1.8, fontSize:13 }}>Established in 2020, the Department of AI & DS at MTIET is designed to nurture graduates who harness the power of AI to solve real-world problems. Our curriculum integrates Machine Learning, Deep Learning, NLP, Computer Vision, Big Data Analytics, and Cloud Computing.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:18 }}>
              {["Machine Learning Labs","Deep Learning Studio","Data Analytics Lab","AI Research Centre","NVIDIA GPU Cluster","IoT Innovation Hub"].map(l=>(
                <div key={l} style={{ display:"flex", gap:7, color:T.muted, fontSize:12, alignItems:"center" }}>
                  <span style={{ color:T.em, fontSize:16 }}>✓</span>{l}
                </div>
              ))}
            </div>
          </GCard>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[{l:"B.Tech AI & DS",v:"120 Seats/yr"},{l:"Faculty",v:"24 Members"},{l:"Research Papers",v:"80+"},{l:"Patents Filed",v:"8"}].map(s=>(
              <GCard key={s.l} style={{ padding:18, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:T.muted, fontSize:13 }}>{s.l}</span>
                <span style={{ color:T.em, fontWeight:800 }}>{s.v}</span>
              </GCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FacultySection() {
  return (
    <div style={{ padding:"80px 5vw", background:T.bg }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionTitle title="Our Faculty" sub="Expert educators shaping tomorrow's AI leaders" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:20 }}>
          {FACULTY.map(f=>(
            <GCard key={f.id} style={{ padding:24, textAlign:"center" }}>
              <div style={{ width:68, height:68, borderRadius:"50%",
                background:`linear-gradient(135deg,${T.em},${T.vi})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 14px", fontSize:22, fontWeight:900, color:"#fff",
                boxShadow:glow(T.em,16) }}>
                {f.name.split(" ").map(w=>w[0]).slice(0,2).join("")}
              </div>
              <h4 style={{ color:T.text, margin:"0 0 3px", fontSize:14 }}>{f.name}</h4>
              <div style={{ color:T.em, fontSize:11, marginBottom:3 }}>{f.desig}</div>
              <div style={{ color:T.muted, fontSize:11, marginBottom:12 }}>{f.sub}</div>
              <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
                <Badge ch={`${f.exp}yrs Exp`} color={T.vi} />
                <Badge ch={`${f.pub} Papers`} color={T.em} />
              </div>
              <div style={{ marginTop:10, fontSize:12, color:T.amber }}>⭐ {f.rating}</div>
            </GCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function Activities() {
  const acts=[
    {i:"🏆",t:"Hackathons",n:"12/yr",d:"National and inter-college AI coding challenges"},
    {i:"🎤",t:"Seminars",n:"24/yr",d:"Industry expert talks and academic presentations"},
    {i:"🏭",t:"Industrial Visits",n:"8/yr",d:"Exposure to top tech companies and research labs"},
    {i:"🛠️",t:"Workshops",n:"18/yr",d:"Hands-on technical skill development sessions"},
    {i:"💼",t:"Placements",n:"94%",d:"Top-tier campus recruitment from Fortune 500 companies"},
    {i:"🎭",t:"Cultural Events",n:"Annual Fest",d:"IGNITE — Techno-cultural celebration every March"},
  ];
  return (
    <div style={{ padding:"80px 5vw", background:T.bg2 }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionTitle title="Activities" sub="Beyond the classroom — holistic student development" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:20 }}>
          {acts.map(a=>(
            <GCard key={a.t} style={{ padding:26 }}>
              <div style={{ fontSize:32, marginBottom:14 }}>{a.i}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <h4 style={{ color:T.text, margin:0 }}>{a.t}</h4>
                <Badge ch={a.n} color={T.em} />
              </div>
              <p style={{ color:T.muted, fontSize:12, margin:0, lineHeight:1.6 }}>{a.d}</p>
            </GCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventsPage() {
  const [filter,setFilter]=useState("All");
  const types=["All","Hackathon","Seminar","Workshop","Industrial Visit"];
  const filtered=EVENTS.filter(e=>filter==="All"||e.type===filter);
  return (
    <div style={{ padding:"80px 5vw", background:T.bg }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionTitle title="Events" sub="Upcoming and recent department events" />
        <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
          {types.map(t=><Btn key={t} onClick={()=>setFilter(t)} v={filter===t?"em":"ghost"} sz="sm">{t}</Btn>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
          {filtered.map(ev=>(
            <GCard key={ev.id} style={{ overflow:"hidden" }}>
              <div style={{ height:6, background:ev.status==="upcoming"?`linear-gradient(90deg,${T.em},${T.vi})`:`linear-gradient(90deg,${T.muted},${T.vi})` }} />
              <div style={{ padding:22 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <Badge ch={ev.status==="upcoming"?"Upcoming":"Completed"} color={ev.status==="upcoming"?T.em:T.vi} />
                  <Badge ch={ev.type} color={T.sky} />
                </div>
                <h4 style={{ color:T.text, margin:"0 0 7px", fontSize:14 }}>{ev.title}</h4>
                <div style={{ fontSize:12, color:T.muted, marginBottom:12 }}>📅 {ev.date} · 👥 {ev.reg} registered</div>
                {ev.prize&&<div style={{ fontSize:12, color:T.amber, marginBottom:12 }}>🏆 Prize Pool: {ev.prize}</div>}
                {ev.status==="upcoming"&&<Btn v="em" sz="sm" style={{ width:"100%" }}>Register Now</Btn>}
              </div>
            </GCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlumniPage() {
  const [filter,setFilter]=useState("All");
  return (
    <div style={{ padding:"80px 5vw", background:T.bg2 }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionTitle title="Our Alumni" sub="MTIET graduates making an impact worldwide" />
        <div style={{ display:"flex", gap:8, marginBottom:28 }}>
          {["All","2017-21","2018-22","2019-23"].map(f=><Btn key={f} onClick={()=>setFilter(f)} v={filter===f?"em":"ghost"} sz="sm">{f}</Btn>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:20 }}>
          {ALUMNI.filter(a=>filter==="All"||a.batch===filter).map(a=>(
            <GCard key={a.id} style={{ padding:24, textAlign:"center" }}>
              <div style={{ fontSize:44, marginBottom:10 }}>{a.av}</div>
              <h4 style={{ color:T.text, margin:"0 0 3px" }}>{a.name}</h4>
              <div style={{ color:T.em, fontSize:12, marginBottom:3 }}>{a.role}</div>
              <div style={{ color:T.muted, fontSize:12, marginBottom:10 }}>{a.co} · {a.loc}</div>
              <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                <Badge ch={a.batch} color={T.vi} />
                <Badge ch={a.pkg} color={T.amber} />
              </div>
            </GCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [form,setForm]=useState({name:"",email:"",sub:"",msg:""});
  const [sent,setSent]=useState(false);
  return (
    <div style={{ padding:"80px 5vw", background:T.bg }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <SectionTitle title="Contact Us" sub="Reach the AI & DS Department" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:32 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[{i:"📍",l:"Address",v:"NH-18 Palamaner Road, Santhipuram, Chittoor, AP — 517408"},{i:"📞",l:"Phone",v:"+91 8572 255555"},{i:"📧",l:"Email",v:"hod.aids@mtiet.edu.in"},{i:"🌐",l:"Website",v:"www.mtiet.edu.in"}].map(c=>(
              <GCard key={c.l} style={{ padding:18, display:"flex", gap:12 }}>
                <span style={{ fontSize:22 }}>{c.i}</span>
                <div><div style={{ fontSize:10, color:T.muted, marginBottom:2 }}>{c.l}</div><div style={{ fontSize:13, color:T.text }}>{c.v}</div></div>
              </GCard>
            ))}
          </div>
          <GCard style={{ padding:26 }}>
            {sent ? (
              <div style={{ textAlign:"center", padding:32 }}>
                <div style={{ fontSize:44, marginBottom:12 }}>✅</div>
                <h3 style={{ color:T.em }}>Message Sent!</h3>
                <p style={{ color:T.muted }}>We'll reply within 24 hours.</p>
                <Btn onClick={()=>setSent(false)} v="ghost">Send Another</Btn>
              </div>
            ) : (
              <>
                <h3 style={{ color:T.text, marginTop:0 }}>Send a Message</h3>
                <Inp label="Your Name" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Full name" />
                <Inp label="Email" type="email" value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="your@email.com" />
                <Inp label="Subject" value={form.sub} onChange={v=>setForm({...form,sub:v})} placeholder="Subject" />
                <Inp label="Message" value={form.msg} onChange={v=>setForm({...form,msg:v})} placeholder="Your message..." rows={4} />
                <Btn onClick={()=>setSent(true)} v="em" style={{ width:"100%" }}>Send Message</Btn>
              </>
            )}
          </GCard>
        </div>
      </div>
    </div>
  );
}

function PubFooter({ setView }) {
  return (
    <footer style={{ background:"rgba(4,8,15,.98)", borderTop:`1px solid ${T.border}`, padding:"44px 5vw 20px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:36, marginBottom:36 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:900, color:T.em, marginBottom:7 }}>MTIET AI & DS</div>
            <p style={{ color:T.muted, fontSize:12, lineHeight:1.7, marginTop:0 }}>Nurturing AI & Data Science talent for a smarter tomorrow.</p>
          </div>
          {[{h:"Quick Links",ls:["About College","About Dept","Faculty","Events","Admissions"]},{h:"Student Portal",ls:["Student Login","Results","Attendance","Study Materials","Hall Tickets"]},{h:"Contact",ls:["hod.aids@mtiet.edu.in","+91 8572 255555","Palamaner, AP 517408"]}].map(col=>(
            <div key={col.h}>
              <h4 style={{ color:T.text, margin:"0 0 12px", fontSize:13 }}>{col.h}</h4>
              {col.ls.map(l=><div key={l} style={{ color:T.muted, fontSize:12, marginBottom:5 }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:18, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontSize:11, color:T.muted }}>© 2024 MTIET AI & DS · All rights reserved</span>
          <Btn onClick={()=>setView("login")} v="outline" sz="sm">Access Portal →</Btn>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════
// AI CHATBOT
// ══════════════════════════════════════════════════════════════
function Chatbot({ onClose }) {
  const [msgs,setMsgs]=useState([{role:"bot",text:CHATBOT_RESPONSES.default}]);
  const [input,setInput]=useState("");
  const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  const send=()=>{
    if(!input.trim()) return;
    const q=input.toLowerCase();
    const r=q.includes("admission")||q.includes("apply")?CHATBOT_RESPONSES.admission
            :q.includes("fee")||q.includes("cost")?CHATBOT_RESPONSES.fee
            :q.includes("place")||q.includes("job")||q.includes("recruit")?CHATBOT_RESPONSES.placement
            :q.includes("faculty")||q.includes("professor")?CHATBOT_RESPONSES.faculty
            :q.includes("hostel")||q.includes("accommodation")?CHATBOT_RESPONSES.hostel
            :CHATBOT_RESPONSES.default;
    setMsgs(m=>[...m,{role:"user",text:input},{role:"bot",text:r}]);
    setInput("");
  };
  return (
    <div style={{ position:"fixed", bottom:80, right:20, width:320, zIndex:2000,
      ...cardS, border:`1px solid ${T.borderV}`, boxShadow:glow(T.vi,20), overflow:"hidden" }}>
      <div style={{ background:`linear-gradient(135deg,${T.em}22,${T.vi}22)`, padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:20 }}>🤖</span>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.text }}>MTIET AI Assistant</div>
            <div style={{ fontSize:10, color:T.em }}>● Online</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:18 }}>✕</button>
      </div>
      <div style={{ height:260, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:10 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"82%", padding:"9px 13px", borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
              background:m.role==="user"?`linear-gradient(135deg,${T.em},${T.vi})`:`rgba(255,255,255,0.06)`,
              fontSize:12, color:T.text, lineHeight:1.6 }}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding:10, borderTop:`1px solid ${T.border}`, display:"flex", gap:8 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask me anything..." style={{ flex:1, padding:"8px 12px", background:"rgba(255,255,255,0.05)",
            border:`1px solid ${T.border}`, borderRadius:9, color:T.text, fontSize:12, outline:"none", fontFamily:"inherit" }} />
        <Btn onClick={send} v="em" sz="sm">→</Btn>
      </div>
      <div style={{ padding:"6px 14px 10px", display:"flex", gap:6, flexWrap:"wrap" }}>
        {["Admission","Fees","Placement","Hostel"].map(q=>(
          <button key={q} onClick={()=>{setInput(q);}} style={{ fontSize:10, padding:"3px 8px", borderRadius:10,
            background:`${T.em}12`, color:T.em, border:`1px solid ${T.em}25`, cursor:"pointer", fontFamily:"inherit" }}>{q}</button>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════
function Login({ setView, setPortal, setUser }) {
  const [tab,setTab]=useState("student");
  const [creds,setCreds]=useState({id:"",pw:""});
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const DEMO={ student:{id:"22A91A6601",pw:"student123",name:"Ananya Reddy",role:"student"},
                faculty:{id:"F001",pw:"faculty123",name:"Dr. P. Lalitha Kumari",role:"faculty"},
                hod:{id:"HOD001",pw:"hod123",name:"Dr. P. Lalitha Kumari",role:"hod"},
                admin:{id:"ADMIN001",pw:"admin123",name:"System Administrator",role:"admin"} };
  const portals=[{k:"student",i:"🎓",l:"Student",c:T.em},{k:"faculty",i:"👨‍🏫",l:"Faculty",c:T.sky},{k:"hod",i:"🏛️",l:"HOD",c:T.vi},{k:"admin",i:"⚙️",l:"Admin",c:T.amber}];
  const login=()=>{
    setErr(""); setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      const d=DEMO[tab];
      if(creds.id===d.id&&creds.pw===d.pw){
        setUser({name:d.name,role:d.role,id:creds.id}); setPortal(tab); setView("portal");
      } else setErr(`Invalid. Demo → ID: ${d.id}  Password: ${d.pw}`);
    },700);
  };
  const pc=portals.find(p=>p.k===tab);
  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" }}>
      <ParticleCanvas />
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 35% 50%,${T.em}14,transparent 60%),radial-gradient(circle at 65% 50%,${T.vi}14,transparent 60%)` }} />
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:440 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:900, color:T.em, letterSpacing:1 }}>MTIET · AI & DS</div>
          <h2 style={{ color:T.text, margin:"6px 0 3px", fontSize:22 }}>Welcome Back</h2>
          <p style={{ color:T.muted, fontSize:12, margin:0 }}>Sign in to your portal</p>
        </div>
        <GCard style={{ padding:26 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7, marginBottom:22 }}>
            {portals.map(p=>(
              <button key={p.k} onClick={()=>{setTab(p.k);setCreds({id:"",pw:""});setErr("");}} style={{
                padding:"9px 4px", borderRadius:9, border:`1px solid ${tab===p.k?p.c:T.border}`,
                background:tab===p.k?`${p.c}1A`:"transparent", cursor:"pointer", fontFamily:"inherit", transition:"all .2s",
                display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <span style={{ fontSize:17 }}>{p.i}</span>
                <span style={{ fontSize:9, color:tab===p.k?p.c:T.muted, fontWeight:700 }}>{p.l}</span>
              </button>
            ))}
          </div>
          <div style={{ textAlign:"center", marginBottom:18, fontSize:12, color:pc.c, fontWeight:700 }}>{pc.i} {pc.l} Portal</div>
          <Inp label="ID / Roll Number" value={creds.id} onChange={v=>setCreds({...creds,id:v})} placeholder={DEMO[tab].id} icon="👤" />
          <Inp label="Password" type="password" value={creds.pw} onChange={v=>setCreds({...creds,pw:v})} placeholder="Enter password" icon="🔒" />
          {err&&<div style={{ background:`${T.rose}14`, border:`1px solid ${T.rose}35`, borderRadius:8, padding:"9px 13px", marginBottom:14, fontSize:11, color:T.rose }}>{err}</div>}
          <Btn onClick={login} v="em" style={{ width:"100%", marginBottom:10 }} dis={loading}>{loading?"Signing in...":"Sign In"}</Btn>
          <div style={{ borderTop:`1px solid ${T.border}`, marginTop:16, paddingTop:14, display:"flex", gap:8 }}>
            <Btn onClick={()=>setView("admission")} v="ghost" sz="sm" style={{ flex:1 }}>New Admission</Btn>
            <Btn onClick={()=>setView("public")} v="ghost" sz="sm" style={{ flex:1 }}>← Back</Btn>
          </div>
        </GCard>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ADMISSION FLOW
// ══════════════════════════════════════════════════════════════
function Admission({ setView }) {
  const [step,setStep]=useState(1);
  const [fd,setFd]=useState({ name:"",mob:"",email:"",dob:"",gender:"",cat:"",aadhar:"",inter:"",tenth:"",jee:"",street:"",city:"",state:"",pin:"",pname:"",pphone:"",pocc:"",course:"B.Tech AI & DS" });
  const [done,setDone]=useState(false);
  const u=(k,v)=>setFd(p=>({...p,[k]:v}));
  if(done) return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <GCard style={{ padding:44, textAlign:"center", maxWidth:480 }}>
        <div style={{ fontSize:60, marginBottom:16 }}>🎉</div>
        <h2 style={{ color:T.em, margin:"0 0 10px" }}>Application Submitted!</h2>
        <p style={{ color:T.muted }}>Your Application ID: <strong style={{ color:T.em }}>MTIET-2024-{Math.floor(Math.random()*9000+1000)}</strong></p>
        <p style={{ color:T.muted, fontSize:13, lineHeight:1.7 }}>Confirmation sent to <strong style={{ color:T.text }}>{fd.email}</strong>. Faculty will review and respond within 3-5 working days.</p>
        <div style={{ background:`${T.amber}12`, border:`1px solid ${T.amber}30`, borderRadius:10, padding:14, margin:"18px 0", textAlign:"left" }}>
          <div style={{ fontSize:12, color:T.amber, fontWeight:700, marginBottom:7 }}>📋 Next Steps</div>
          {["Check email for application confirmation","Keep originals ready for verification","Report on assigned date with documents","Contact admissions@mtiet.edu.in for queries"].map(s=>(
            <div key={s} style={{ fontSize:11, color:T.muted, marginBottom:4 }}>• {s}</div>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn onClick={()=>setView("public")} v="ghost" style={{ flex:1 }}>Back to Home</Btn>
          <Btn onClick={()=>setView("login")} v="em" style={{ flex:1 }}>Track Application</Btn>
        </div>
      </GCard>
    </div>
  );
  return (
    <div style={{ minHeight:"100vh", background:T.bg, padding:"80px 5vw 40px" }}>
      <div style={{ maxWidth:700, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <Btn onClick={()=>setView("public")} v="ghost" sz="sm" style={{ marginBottom:18 }}>← Back</Btn>
          <h2 style={{ color:T.text, margin:"0 0 6px" }}>Admission Application 2024</h2>
          <p style={{ color:T.muted, fontSize:12 }}>B.Tech Artificial Intelligence & Data Science</p>
        </div>
        {/* Steps */}
        <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
          {[1,2,3].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", flex:i<2?1:"auto" }}>
              <div style={{ width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                background:step>=s?T.em:T.border, color:step>=s?"#fff":T.muted,
                fontWeight:800, fontSize:13, flexShrink:0, boxShadow:step===s?glow(T.em,10):"none", transition:"all .3s" }}>{s}</div>
              {i<2&&<div style={{ flex:1, height:2, background:step>s?T.em:T.border, transition:"background .3s", margin:"0 6px" }} />}
            </div>
          ))}
        </div>
        <GCard style={{ padding:30 }}>
          {step===1&&(
            <>
              <h3 style={{ color:T.em, marginTop:0 }}>Step 1 — Personal Information</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div style={{ gridColumn:"1/-1" }}><Inp label="Full Name" value={fd.name} onChange={v=>u("name",v)} placeholder="As per SSC" req /></div>
                <Inp label="Mobile" value={fd.mob} onChange={v=>u("mob",v)} placeholder="+91 XXXXXXXXXX" req />
                <Inp label="Email" type="email" value={fd.email} onChange={v=>u("email",v)} placeholder="your@email.com" req />
                <Inp label="Date of Birth" type="date" value={fd.dob} onChange={v=>u("dob",v)} req />
                <Sel label="Gender" value={fd.gender} onChange={v=>u("gender",v)} options={["Male","Female","Other"]} req />
                <Sel label="Category" value={fd.cat} onChange={v=>u("cat",v)} options={["OC","BC-A","BC-B","BC-C","BC-D","BC-E","SC","ST"]} req />
                <div style={{ gridColumn:"1/-1" }}><Inp label="Aadhaar Number" value={fd.aadhar} onChange={v=>u("aadhar",v)} placeholder="XXXX XXXX XXXX" req /></div>
                <Inp label="Parent Name" value={fd.pname} onChange={v=>u("pname",v)} placeholder="Father/Mother" />
                <Inp label="Parent Phone" value={fd.pphone} onChange={v=>u("pphone",v)} placeholder="+91 XXXXXXXXXX" />
              </div>
              <Btn onClick={()=>setStep(2)} v="em" style={{ width:"100%", marginTop:8 }}>Continue →</Btn>
            </>
          )}
          {step===2&&(
            <>
              <h3 style={{ color:T.em, marginTop:0 }}>Step 2 — Academic Details</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <Inp label="Intermediate Marks (%)" value={fd.inter} onChange={v=>u("inter",v)} placeholder="e.g. 87.5" req />
                <Inp label="SSC / 10th Marks (%)" value={fd.tenth} onChange={v=>u("tenth",v)} placeholder="e.g. 91.0" req />
                <Inp label="JEE Main Rank (optional)" value={fd.jee} onChange={v=>u("jee",v)} placeholder="e.g. 45000" />
                <Sel label="Course Preference" value={fd.course} onChange={v=>u("course",v)} options={["B.Tech AI & DS","B.Tech CSE","B.Tech ECE","B.Tech EEE"]} req />
                <div style={{ gridColumn:"1/-1" }}><Inp label="Street Address" value={fd.street} onChange={v=>u("street",v)} placeholder="Door No, Street" /></div>
                <Inp label="City" value={fd.city} onChange={v=>u("city",v)} placeholder="City/Village" />
                <Inp label="State" value={fd.state} onChange={v=>u("state",v)} placeholder="State" />
              </div>
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <Btn onClick={()=>setStep(1)} v="ghost" style={{ flex:1 }}>← Back</Btn>
                <Btn onClick={()=>setStep(3)} v="em" style={{ flex:2 }}>Continue →</Btn>
              </div>
            </>
          )}
          {step===3&&(
            <>
              <h3 style={{ color:T.em, marginTop:0 }}>Step 3 — Upload Documents</h3>
              <p style={{ color:T.muted, fontSize:12, marginBottom:18 }}>Upload clear scanned copies. PDF/JPG/PNG, max 2MB each.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:22 }}>
                {["SSC Memo (10th)","Intermediate Memo","Transfer Certificate","Aadhaar Card","Passport Photo"].map(d=>(
                  <div key={d} style={{ border:`2px dashed ${T.border}`, borderRadius:10, padding:18, textAlign:"center", cursor:"pointer", transition:"all .2s" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=T.em}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                    <div style={{ fontSize:22, marginBottom:6 }}>📎</div>
                    <div style={{ fontSize:11, color:T.muted }}>{d}</div>
                    <div style={{ fontSize:10, color:T.em, marginTop:3 }}>Click to upload</div>
                  </div>
                ))}
              </div>
              <div style={{ background:`${T.sky}12`, border:`1px solid ${T.sky}30`, borderRadius:10, padding:14, marginBottom:18 }}>
                <div style={{ fontSize:12, color:T.sky, fontWeight:700, marginBottom:7 }}>📋 Summary</div>
                {[["Name",fd.name||"—"],["Email",fd.email||"—"],["Course",fd.course],["Inter",fd.inter?fd.inter+"%":"—"]].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.muted, marginBottom:3 }}>
                    <span>{k}:</span><span style={{ color:T.text }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <Btn onClick={()=>setStep(2)} v="ghost" style={{ flex:1 }}>← Back</Btn>
                <Btn onClick={()=>setDone(true)} v="em" style={{ flex:2 }}>Submit Application ✓</Btn>
              </div>
            </>
          )}
        </GCard>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PORTAL SHELL
// ══════════════════════════════════════════════════════════════
function Shell({ user, portal, setView, title, navItems, nav, setNav, children }) {
  const [notifOpen,setNotifOpen]=useState(false);
  const colors={ student:T.em, faculty:T.sky, hod:T.vi, admin:T.amber };
  const cc=colors[portal];
  const unread=NOTIFS.filter(n=>!n.read).length;
  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:T.bg }}>
      {/* Sidebar */}
      <div style={{ width:215, background:T.panel, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"18px 14px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontSize:10, color:cc, fontWeight:900, letterSpacing:1.2, marginBottom:3 }}>MTIET PORTAL</div>
          <div style={{ fontSize:11, color:T.muted }}>{portal.toUpperCase()}</div>
        </div>
        <nav style={{ flex:1, padding:"10px 7px", overflowY:"auto" }}>
          {navItems.map(item=>(
            <button key={item.id} onClick={()=>setNav(item.id)} style={{
              width:"100%", padding:"8px 11px", borderRadius:8, border:"none",
              background:nav===item.id?`${cc}18`:"transparent",
              color:nav===item.id?cc:T.muted, cursor:"pointer", fontFamily:"inherit",
              fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:9, marginBottom:2,
              borderLeft:nav===item.id?`3px solid ${cc}`:"3px solid transparent",
              transition:"all .2s", textAlign:"left" }}>
              <span style={{ fontSize:15 }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:"11px 14px", borderTop:`1px solid ${T.border}` }}>
          <div style={{ fontSize:11, color:T.muted, marginBottom:3 }}>{user.name}</div>
          <div style={{ fontSize:10, color:T.muted, marginBottom:9 }}>{user.id}</div>
          <Btn onClick={()=>setView("login")} v="ghost" sz="sm" style={{ width:"100%" }}>Sign Out</Btn>
        </div>
      </div>
      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ height:54, background:T.panel, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 22px", flexShrink:0 }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:T.text }}>{title}</h2>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ position:"relative" }}>
              <Bell count={unread} onClick={()=>setNotifOpen(!notifOpen)} />
              {notifOpen&&(
                <div style={{ position:"absolute", top:42, right:0, width:290, ...cardS, padding:14, zIndex:100, boxShadow:`0 20px 40px rgba(0,0,0,.5),${glow(T.vi,12)}` }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:11 }}>Notifications</div>
                  {NOTIFS.map(n=>(
                    <div key={n.id} style={{ padding:"9px 0", borderBottom:`1px solid ${T.border}`, display:"flex", gap:9, alignItems:"flex-start" }}>
                      <div style={{ fontSize:16 }}>{n.type==="result"?"📊":n.type==="attendance"?"📋":n.type==="event"?"🎉":"✅"}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:11, color:n.read?T.muted:T.text }}>{n.msg}</div>
                        <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{n.time}</div>
                      </div>
                      {!n.read&&<div style={{ width:6, height:6, borderRadius:"50%", background:cc, flexShrink:0, marginTop:4 }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${cc},${T.vi})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#fff" }}>
              {user.name.split(" ").map(w=>w[0]).slice(0,2).join("")}
            </div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:22 }}>{children}</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ADVANCED FEATURES
// ══════════════════════════════════════════════════════════════

// 1. QR Attendance
function QRAttendance() {
  const [scanned,setScanned]=useState(false);
  const [subject,setSubject]=useState("Machine Learning");
  const qrCode = `▄▄▄▄▄ ▄  ▄ ▄▄▄▄▄\n█ ▄▄█ ▄▀█ █ ▄▄ █\n█ ▀▀▄ █▄█ █ ▀▀ █\n▀▀▀▀▀ ▀  ▀ ▀▀▀▀▀`;
  return (
    <GCard style={{ padding:28 }}>
      <h4 style={{ color:T.text, marginTop:0 }}>QR Code Attendance System</h4>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        <div>
          <Sel label="Select Subject" value={subject} onChange={setSubject} options={["Machine Learning","Deep Learning","NLP","Data Analytics","Computer Vision"]} />
          <div style={{ background:"#fff", borderRadius:12, padding:20, textAlign:"center", marginBottom:16 }}>
            <pre style={{ fontSize:14, lineHeight:1.5, color:"#000", margin:0, fontFamily:"monospace", letterSpacing:2 }}>
{`█▀▀▀▀▀█ ▄█▄▄▄ █▀▀▀▀▀█
█ ███ █  ▀▄█▀  █ ███ █
█ ▀▀▀ █ ▄▀▄▄  █ ▀▀▀ █
▀▀▀▀▀▀▀ ▀ █ ▀ ▀▀▀▀▀▀▀
▄▄█▄█▄▀ ▀▄▀ ▄ ▄▄█▄▄▄
█▀▀▀▀▀█ ▀██▀  ▀ ▄▀▀▄
█ ███ █  ▄▀▄▀▄ ▄▀▀▄▄
█ ▀▀▀ █ █▄▄▀ █▄▀▄▀▄▀
▀▀▀▀▀▀▀ ▀   ▀ ▀▀  ▀`}
            </pre>
            <div style={{ fontSize:11, color:"#333", marginTop:8, fontFamily:"monospace" }}>MTIET/{subject.slice(0,2).toUpperCase()}/2024</div>
          </div>
          <div style={{ fontSize:12, color:T.muted, textAlign:"center", marginBottom:12 }}>Students scan this QR to mark attendance</div>
          <Btn v="em" style={{ width:"100%" }} onClick={()=>setScanned(true)}>Generate New QR</Btn>
        </div>
        <div>
          <h4 style={{ color:T.muted, margin:"0 0 14px", fontSize:13 }}>Today's Scan Log</h4>
          {scanned&&<div style={{ background:`${T.em}14`, border:`1px solid ${T.em}30`, borderRadius:8, padding:10, marginBottom:12, fontSize:12, color:T.em }}>✅ QR refreshed — New session started</div>}
          {STUDENTS.slice(0,4).map((s,i)=>(
            <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
              <div>
                <div style={{ fontSize:12, color:T.text }}>{s.name}</div>
                <div style={{ fontSize:10, color:T.muted }}>{s.id}</div>
              </div>
              <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                <span style={{ fontSize:10, color:T.muted }}>{9+i}:{["05","22","31","48"][i]} AM</span>
                <Badge ch="Present" color={T.em} size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GCard>
  );
}

// 2. Digital ID Card
function DigitalID({ me }) {
  const s=me||STUDENTS[0];
  return (
    <div>
      <h4 style={{ color:T.text, marginBottom:20 }}>Digital Student ID Card</h4>
      <div style={{ maxWidth:380, margin:"0 auto" }}>
        <div style={{ borderRadius:18, overflow:"hidden", boxShadow:`0 24px 48px rgba(0,0,0,.5),${glow(T.em,24)}`, border:`1.5px solid ${T.borderV}` }}>
          {/* Card header */}
          <div style={{ background:`linear-gradient(135deg,${T.em},${T.vi})`, padding:"18px 22px", textAlign:"center", position:"relative" }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.8)", fontWeight:700, letterSpacing:2 }}>MOTHER THERESA INSTITUTE OF ENGINEERING & TECHNOLOGY</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.7)" }}>AI & Data Science Department</div>
          </div>
          {/* Card body */}
          <div style={{ background:"linear-gradient(135deg,#080E1A,#0A1828)", padding:"22px 24px" }}>
            <div style={{ display:"flex", gap:18, alignItems:"center", marginBottom:18 }}>
              <div style={{ width:72, height:72, borderRadius:12, background:`linear-gradient(135deg,${T.em},${T.vi})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:"#fff", flexShrink:0, boxShadow:glow(T.em,14) }}>
                {s.name.split(" ").map(w=>w[0]).slice(0,2).join("")}
              </div>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:T.text }}>{s.name}</div>
                <div style={{ fontSize:11, color:T.em, marginBottom:2 }}>B.Tech AI & Data Science</div>
                <Badge ch={s.batch} color={T.vi} size={10} />
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              {[["Roll Number",s.id],["Section",`Section ${s.sec}`],["CGPA",s.cgpa],["Status",s.status.toUpperCase()]].map(([k,v])=>(
                <div key={k} style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"9px 12px" }}>
                  <div style={{ fontSize:9, color:T.muted, marginBottom:2 }}>{k}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"#fff", borderRadius:8, padding:"10px", textAlign:"center", marginBottom:12 }}>
              <div style={{ fontFamily:"monospace", fontSize:11, color:"#000", letterSpacing:4 }}>||| |||| || ||| |||| ||||</div>
              <div style={{ fontSize:9, color:"#555", marginTop:3 }}>{s.id}</div>
            </div>
            <div style={{ textAlign:"center", fontSize:9, color:T.muted }}>Valid: AY 2023-24 · Issued by MTIET</div>
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:16 }}>
          <Btn v="em" sz="sm">Download ID Card</Btn>
        </div>
      </div>
    </div>
  );
}

// 3. Resume Builder
function ResumeBuilder({ user }) {
  const [resume,setResume]=useState({ objective:"Aspiring AI/ML Engineer seeking opportunities to apply deep learning and data science skills in solving real-world problems.", skills:["Python","TensorFlow","PyTorch","SQL","React","Machine Learning","Computer Vision","NLP"], projects:[{name:"Crop Disease Detection",desc:"CNN model with 94% accuracy using ResNet50.",tech:"Python, PyTorch, FastAPI"},{name:"Customer Churn Predictor",desc:"Gradient Boosting model with 91% AUC.",tech:"Python, Scikit-learn, Pandas"}], certifications:["Google ML Crash Course","AWS Cloud Practitioner","Coursera Deep Learning Specialization"] });
  const [preview,setPreview]=useState(false);
  const me=STUDENTS[0];
  return (
    <GCard style={{ padding:26 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h4 style={{ color:T.text, margin:0 }}>Resume Builder</h4>
        <Btn onClick={()=>setPreview(!preview)} v={preview?"ghost":"em"} sz="sm">{preview?"← Edit":"Preview Resume"}</Btn>
      </div>
      {preview ? (
        <div style={{ background:"#fff", borderRadius:12, padding:"32px 28px", color:"#000", fontSize:13, lineHeight:1.6 }}>
          <div style={{ borderBottom:"2px solid #10B981", paddingBottom:14, marginBottom:14 }}>
            <h2 style={{ margin:0, fontSize:22, color:"#064E3B" }}>{me.name}</h2>
            <div style={{ fontSize:12, color:"#555" }}>B.Tech AI & DS · MTIET · {me.email} · {me.phone}</div>
            <div style={{ fontSize:12, color:"#555" }}>Roll: {me.id} · CGPA: {me.cgpa}</div>
          </div>
          <div style={{ marginBottom:12 }}>
            <h4 style={{ color:"#064E3B", margin:"0 0 5px" }}>Objective</h4>
            <p style={{ margin:0, fontSize:12 }}>{resume.objective}</p>
          </div>
          <div style={{ marginBottom:12 }}>
            <h4 style={{ color:"#064E3B", margin:"0 0 5px" }}>Technical Skills</h4>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{resume.skills.map(s=><span key={s} style={{ padding:"2px 8px", borderRadius:4, background:"#D1FAE5", color:"#065F46", fontSize:11 }}>{s}</span>)}</div>
          </div>
          <div style={{ marginBottom:12 }}>
            <h4 style={{ color:"#064E3B", margin:"0 0 8px" }}>Projects</h4>
            {resume.projects.map(p=>(
              <div key={p.name} style={{ marginBottom:8 }}>
                <div style={{ fontWeight:700 }}>{p.name}</div>
                <div style={{ fontSize:12, color:"#444" }}>{p.desc}</div>
                <div style={{ fontSize:11, color:"#777" }}>Tech: {p.tech}</div>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ color:"#064E3B", margin:"0 0 5px" }}>Certifications</h4>
            {resume.certifications.map(c=><div key={c} style={{ fontSize:12 }}>• {c}</div>)}
          </div>
        </div>
      ) : (
        <div>
          <Inp label="Career Objective" value={resume.objective} onChange={v=>setResume({...resume,objective:v})} rows={3} />
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, color:T.muted, fontWeight:600, display:"block", marginBottom:6 }}>Skills (comma separated)</label>
            <Inp value={resume.skills.join(", ")} onChange={v=>setResume({...resume,skills:v.split(",")})} placeholder="Python, ML, React..." />
          </div>
          {resume.projects.map((p,i)=>(
            <GCard key={i} style={{ padding:16, marginBottom:12 }}>
              <div style={{ fontSize:12, color:T.em, marginBottom:8 }}>Project {i+1}</div>
              <Inp label="Project Name" value={p.name} onChange={v=>setResume(r=>{const ps=[...r.projects];ps[i]={...ps[i],name:v};return{...r,projects:ps};})} />
              <Inp label="Description" value={p.desc} onChange={v=>setResume(r=>{const ps=[...r.projects];ps[i]={...ps[i],desc:v};return{...r,projects:ps};})} />
              <Inp label="Technologies" value={p.tech} onChange={v=>setResume(r=>{const ps=[...r.projects];ps[i]={...ps[i],tech:v};return{...r,projects:ps};})} />
            </GCard>
          ))}
          <Btn v="ghost" sz="sm" onClick={()=>setResume(r=>({...r,projects:[...r.projects,{name:"",desc:"",tech:""}]}))}>+ Add Project</Btn>
        </div>
      )}
    </GCard>
  );
}

// 4. Placement Tracker
function PlacementTracker() {
  const placed=PLACEMENTS.filter(p=>p.status==="selected").length;
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
        <Stat icon="💼" label="Total Placed" value={placed} color={T.em} />
        <Stat icon="⏳" label="In Process" value={PLACEMENTS.filter(p=>p.status==="pending").length} color={T.amber} />
        <Stat icon="💰" label="Highest CTC" value="₹32 LPA" color={T.vi} />
        <Stat icon="📊" label="Placement %" value="94%" color={T.sky} />
      </div>
      <GCard style={{ padding:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
          <h4 style={{ color:T.text, margin:0 }}>Placement Records 2024</h4>
          <Btn v="ghost" sz="sm">Export CSV</Btn>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["Student","Company","Role","CTC","Status","Date"].map(h=>(
            <th key={h} style={{ padding:"9px 12px", textAlign:"left", fontSize:11, color:T.muted, borderBottom:`1px solid ${T.border}` }}>{h}</th>
          ))}</tr></thead>
          <tbody>{PLACEMENTS.map((p,i)=>(
            <tr key={i} style={{ background:i%2===0?T.glass:"transparent" }}>
              <td style={{ padding:"11px 12px", fontSize:12, color:T.text }}>{p.student}</td>
              <td style={{ padding:"11px 12px", fontSize:12, color:T.em, fontWeight:700 }}>{p.company}</td>
              <td style={{ padding:"11px 12px", fontSize:12, color:T.muted }}>{p.role}</td>
              <td style={{ padding:"11px 12px", fontSize:12, color:T.vi, fontWeight:700 }}>{p.ctc}</td>
              <td style={{ padding:"11px 12px" }}><Badge ch={p.status} color={p.status==="selected"?T.em:T.amber} /></td>
              <td style={{ padding:"11px 12px", fontSize:11, color:T.muted }}>{p.date}</td>
            </tr>
          ))}</tbody>
        </table>
      </GCard>
    </div>
  );
}

// 5. Internship Tracker
function InternshipTracker() {
  return (
    <GCard style={{ padding:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
        <h4 style={{ color:T.text, margin:0 }}>Internship Tracking</h4>
        <Btn v="em" sz="sm">+ Add Internship</Btn>
      </div>
      {INTERNSHIPS.map((it,i)=>(
        <div key={i} style={{ padding:18, borderRadius:12, background:T.glass, border:`1px solid ${T.border}`, marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:4 }}>{it.student}</div>
              <div style={{ display:"flex", gap:12, fontSize:12, color:T.muted, flexWrap:"wrap" }}>
                <span>🏢 {it.company}</span><span>🔬 {it.domain}</span><span>⏱ {it.duration}</span><span>💰 {it.stipend}</span>
              </div>
            </div>
            <Badge ch={it.status} color={it.status==="ongoing"?T.em:T.vi} />
          </div>
          {it.status==="ongoing"&&(
            <div style={{ marginTop:12 }}>
              <Progress value={60} color={T.em} label="Completion" />
            </div>
          )}
        </div>
      ))}
    </GCard>
  );
}

// 6. Student Feedback
function FeedbackSystem() {
  const [sub,setSub]=useState("Machine Learning");
  const [rat,setRat]=useState(0);
  const [comment,setComment]=useState("");
  const [done,setDone]=useState(false);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        <GCard style={{ padding:24 }}>
          <h4 style={{ color:T.text, marginTop:0 }}>Submit Feedback</h4>
          {done ? (
            <div style={{ textAlign:"center", padding:24 }}>
              <div style={{ fontSize:40, marginBottom:10 }}>⭐</div>
              <div style={{ color:T.em, fontWeight:700 }}>Thank you for your feedback!</div>
              <Btn onClick={()=>{ setDone(false); setRat(0); setComment(""); }} v="ghost" sz="sm" style={{ marginTop:12 }}>Submit Another</Btn>
            </div>
          ) : (
            <>
              <Sel label="Subject" value={sub} onChange={setSub} options={["Machine Learning","Deep Learning","NLP","Data Analytics","Computer Vision"]} />
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, color:T.muted, fontWeight:600, display:"block", marginBottom:8 }}>Rating</label>
                <div style={{ display:"flex", gap:6 }}>
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} onClick={()=>setRat(n)} style={{ fontSize:26, background:"none", border:"none", cursor:"pointer", color:n<=rat?T.amber:"#333", transition:"all .1s" }}>★</button>
                  ))}
                </div>
              </div>
              <Inp label="Your Comments" value={comment} onChange={setComment} placeholder="Share your experience..." rows={3} />
              <Btn onClick={()=>setDone(true)} v="em" style={{ width:"100%" }} dis={rat===0}>Submit Feedback</Btn>
            </>
          )}
        </GCard>
        <GCard style={{ padding:24 }}>
          <h4 style={{ color:T.text, marginTop:0 }}>Recent Feedback</h4>
          {FEEDBACK.map(f=>(
            <div key={f.id} style={{ padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:700, color:T.em }}>{f.sub}</span>
                <div style={{ display:"flex", gap:1 }}>
                  {[1,2,3,4,5].map(n=><span key={n} style={{ fontSize:12, color:n<=Math.round(f.rat)?T.amber:"#333" }}>★</span>)}
                  <span style={{ fontSize:11, color:T.muted, marginLeft:4 }}>{f.rat}</span>
                </div>
              </div>
              <p style={{ fontSize:11, color:T.muted, margin:"0 0 3px", fontStyle:"italic" }}>"{f.comment}"</p>
              <div style={{ fontSize:10, color:T.muted }}>— {f.student} · {f.date}</div>
            </div>
          ))}
        </GCard>
      </div>
    </div>
  );
}

// 7. Complaint Management
function Complaints() {
  const [form,setForm]=useState({title:"",dept:"",desc:""});
  const [list,setList]=useState(COMPLAINTS);
  const [submitted,setSubmitted]=useState(false);
  const statusColors={ resolved:T.em, pending:T.amber, "in-progress":T.sky };
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        <GCard style={{ padding:24 }}>
          <h4 style={{ color:T.text, marginTop:0 }}>File a Complaint</h4>
          {submitted ? (
            <div style={{ textAlign:"center", padding:24 }}>
              <div style={{ fontSize:40, marginBottom:10 }}>📋</div>
              <div style={{ color:T.em, fontWeight:700 }}>Complaint Registered!</div>
              <div style={{ color:T.muted, fontSize:12, marginTop:6 }}>You'll receive updates via email.</div>
              <Btn onClick={()=>setSubmitted(false)} v="ghost" sz="sm" style={{ marginTop:12 }}>File Another</Btn>
            </div>
          ) : (
            <>
              <Inp label="Issue Title" value={form.title} onChange={v=>setForm({...form,title:v})} placeholder="Brief description of issue" />
              <Sel label="Department" value={form.dept} onChange={v=>setForm({...form,dept:v})} options={["Maintenance","IT","Library","Hostel","Academic","Transportation"]} />
              <Inp label="Detailed Description" value={form.desc} onChange={v=>setForm({...form,desc:v})} placeholder="Provide full details..." rows={3} />
              <Btn onClick={()=>{ setSubmitted(true); setList(l=>[{ id:`CMP00${l.length+1}`, title:form.title||"New complaint", by:"22A91A6601", dept:form.dept||"Maintenance", status:"pending", date:new Date().toISOString().slice(0,10) },...l]); }} v="rose" style={{ width:"100%" }}>Submit Complaint</Btn>
            </>
          )}
        </GCard>
        <GCard style={{ padding:24 }}>
          <h4 style={{ color:T.text, marginTop:0 }}>My Complaints</h4>
          {list.map(c=>(
            <div key={c.id} style={{ padding:"11px 0", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{c.title}</div>
                  <div style={{ fontSize:10, color:T.muted }}>#{c.id} · {c.dept} · {c.date}</div>
                </div>
                <Badge ch={c.status} color={statusColors[c.status]||T.muted} size={10} />
              </div>
            </div>
          ))}
        </GCard>
      </div>
    </div>
  );
}

// 8. Performance Analytics (visual bars)
function PerformanceAnalytics() {
  const semData=[{sem:"I",cgpa:7.8},{sem:"II",cgpa:8.1},{sem:"III",cgpa:8.4},{sem:"IV",cgpa:8.6},{sem:"V",cgpa:8.7}];
  const max=10;
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        <GCard style={{ padding:24 }}>
          <h4 style={{ color:T.text, marginTop:0 }}>CGPA Progression</h4>
          <div style={{ display:"flex", gap:10, alignItems:"flex-end", height:160, marginBottom:8 }}>
            {semData.map(s=>(
              <div key={s.sem} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{ fontSize:11, color:T.em, fontWeight:700 }}>{s.cgpa}</div>
                <div style={{ width:"100%", background:`linear-gradient(0deg,${T.em},${T.vi})`, borderRadius:"6px 6px 0 0",
                  height:`${(s.cgpa/max)*130}px`, transition:"height .8s", position:"relative" }}>
                  <div style={{ position:"absolute", inset:0, background:`linear-gradient(0deg,${T.em}88,${T.vi}44)`, borderRadius:"6px 6px 0 0" }} />
                </div>
                <div style={{ fontSize:11, color:T.muted }}>Sem {s.sem}</div>
              </div>
            ))}
          </div>
        </GCard>
        <GCard style={{ padding:24 }}>
          <h4 style={{ color:T.text, marginTop:0 }}>Subject Performance</h4>
          {RESULTS.map(r=>(
            <div key={r.sub} style={{ marginBottom:14 }}>
              <Progress value={r.marks} color={r.marks>=80?T.em:r.marks>=70?T.sky:T.amber} label={`${r.sub} — ${r.grade}`} height={8} />
            </div>
          ))}
        </GCard>
      </div>
      <GCard style={{ padding:24 }}>
        <h4 style={{ color:T.text, marginTop:0 }}>Rank & Percentile</h4>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {[{l:"Class Rank",v:"7/120",c:T.em},{l:"Department Rank",v:"7/480",c:T.vi},{l:"SGPA Percentile",v:"94th",c:T.sky},{l:"Attendance Rank",v:"Top 20%",c:T.amber}].map(s=>(
            <GCard key={s.l} style={{ padding:18, textAlign:"center", border:`1px solid ${s.c}30` }}>
              <div style={{ fontSize:20, fontWeight:900, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{s.l}</div>
            </GCard>
          ))}
        </div>
      </GCard>
    </div>
  );
}

// 9. Certificate Generation
function CertificateGen() {
  const [type,setType]=useState("Course Completion");
  const [gen,setGen]=useState(false);
  const certs=["Course Completion","Bonafide","Character Certificate","Attendance Certificate","Internship Completion","Event Participation"];
  return (
    <GCard style={{ padding:28 }}>
      <h4 style={{ color:T.text, marginTop:0 }}>Certificate Generation</h4>
      <Sel label="Certificate Type" value={type} onChange={setType} options={certs} />
      {gen ? (
        <div style={{ border:`2px solid ${T.em}`, borderRadius:14, padding:"32px 28px", textAlign:"center", background:"linear-gradient(135deg,rgba(16,185,129,0.06),rgba(139,92,246,0.06))", marginBottom:18 }}>
          <div style={{ fontSize:11, color:T.em, letterSpacing:3, marginBottom:8, fontWeight:700 }}>MOTHER THERESA INSTITUTE OF ENGINEERING & TECHNOLOGY</div>
          <div style={{ fontSize:9, color:T.muted, marginBottom:18 }}>Department of Artificial Intelligence & Data Science</div>
          <div style={{ width:50, height:1, background:T.em, margin:"0 auto 18px" }} />
          <div style={{ fontSize:20, fontWeight:900, color:T.text, marginBottom:8 }}>CERTIFICATE OF {type.toUpperCase()}</div>
          <div style={{ fontSize:13, color:T.muted, lineHeight:1.8, marginBottom:18 }}>
            This is to certify that <strong style={{ color:T.text }}>Ananya Reddy</strong> (Roll No: 22A91A6601),<br />
            a student of B.Tech Artificial Intelligence & Data Science,<br />
            has successfully completed the requirements for <strong style={{ color:T.em }}>{type}</strong>.
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:28, padding:"0 20px" }}>
            <div style={{ textAlign:"center" }}><div style={{ width:80, height:1, background:T.muted, marginBottom:4 }} /><div style={{ fontSize:10, color:T.muted }}>HOD Signature</div></div>
            <div style={{ textAlign:"center" }}><div style={{ fontSize:9, color:T.em }}>Digital Seal</div><div style={{ fontSize:22 }}>🏛️</div></div>
            <div style={{ textAlign:"center" }}><div style={{ width:80, height:1, background:T.muted, marginBottom:4 }} /><div style={{ fontSize:10, color:T.muted }}>Principal Signature</div></div>
          </div>
        </div>
      ) : (
        <div style={{ border:`2px dashed ${T.border}`, borderRadius:12, padding:40, textAlign:"center", marginBottom:18 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>📜</div>
          <div style={{ color:T.muted, fontSize:13 }}>Certificate preview will appear here</div>
        </div>
      )}
      <div style={{ display:"flex", gap:12 }}>
        <Btn onClick={()=>setGen(true)} v="em" style={{ flex:1 }}>Generate Certificate</Btn>
        {gen&&<Btn v="vi" style={{ flex:1 }}>Download PDF</Btn>}
      </div>
    </GCard>
  );
}

// 10. Bulk Email
function BulkEmail() {
  const [form,setForm]=useState({to:"All Students",subject:"",body:""});
  const [sent,setSent]=useState(false);
  return (
    <GCard style={{ padding:26 }}>
      <h4 style={{ color:T.text, marginTop:0 }}>Bulk Email System</h4>
      {sent ? (
        <div style={{ textAlign:"center", padding:36 }}>
          <div style={{ fontSize:44, marginBottom:12 }}>📧</div>
          <div style={{ color:T.em, fontWeight:700, fontSize:16 }}>Emails Dispatched!</div>
          <div style={{ color:T.muted, fontSize:13, marginTop:8 }}>Sent to: <strong style={{ color:T.text }}>{form.to}</strong></div>
          <div style={{ color:T.muted, fontSize:12, marginTop:4 }}>Estimated delivery: 2-5 minutes (via Nodemailer SMTP)</div>
          <Btn onClick={()=>{ setSent(false); setForm({to:"All Students",subject:"",body:""}); }} v="ghost" style={{ marginTop:18 }}>Send Another</Btn>
        </div>
      ) : (
        <>
          <Sel label="Send To" value={form.to} onChange={v=>setForm({...form,to:v})} options={["All Students","Section A","Section B","Final Year","III Year","All Faculty","HOD","All — Department"]} />
          <Inp label="Subject" value={form.subject} onChange={v=>setForm({...form,subject:v})} placeholder="Email subject..." />
          <Inp label="Email Body" value={form.body} onChange={v=>setForm({...form,body:v})} placeholder="Type your email message here..." rows={5} />
          <div style={{ background:`${T.sky}10`, border:`1px solid ${T.sky}25`, borderRadius:8, padding:12, marginBottom:14, fontSize:12, color:T.sky }}>
            📬 Powered by Nodemailer · SMTP Server: smtp.mtiet.edu.in · From: noreply@mtiet.edu.in
          </div>
          <Btn onClick={()=>setSent(true)} v="em" style={{ width:"100%" }} dis={!form.subject||!form.body}>Send Bulk Email 📧</Btn>
        </>
      )}
    </GCard>
  );
}

// ══════════════════════════════════════════════════════════════
// PORTAL COMPONENTS
// ══════════════════════════════════════════════════════════════
function AttendanceView() {
  const total=ATTEND.reduce((s,a)=>s+a.total,0);
  const pres=ATTEND.reduce((s,a)=>s+a.pres,0);
  const overall=Math.round(pres/total*100);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:20 }}>
        <Stat icon="📚" label="Total Classes" value={total} color={T.sky} />
        <Stat icon="✅" label="Attended" value={pres} color={T.em} />
        <Stat icon="📊" label="Overall %" value={`${overall}%`} color={overall>=75?T.em:T.rose} />
      </div>
      {overall<75&&<div style={{ background:`${T.rose}12`, border:`1px solid ${T.rose}35`, borderRadius:9, padding:12, marginBottom:18, fontSize:12, color:T.rose }}>⚠️ Attendance below 75%. Risk of exam detainment.</div>}
      <GCard style={{ padding:22 }}>
        {ATTEND.map((a,i)=>(
          <div key={a.sub} style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
              <span style={{ color:T.text }}>{a.sub}</span>
              <span style={{ color:T.muted }}>{a.pres}/{a.total} · <span style={{ color:a.pct>=75?T.em:T.rose, fontWeight:700 }}>{a.pct}%</span></span>
            </div>
            <Progress value={a.pct} color={a.pct>=75?T.em:T.rose} height={8} />
          </div>
        ))}
      </GCard>
    </div>
  );
}

function ResultsView() {
  const cr=RESULTS.reduce((s,r)=>s+r.cr,0);
  const wt=RESULTS.reduce((s,r)=>s+r.cr*r.pts,0);
  const sgpa=(wt/cr).toFixed(2);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }}>
        <Stat icon="🎯" label="SGPA" value={sgpa} color={T.em} />
        <Stat icon="📈" label="CGPA" value="8.7" color={T.vi} />
        <Stat icon="📚" label="Credits" value={cr} color={T.sky} />
        <Stat icon="🏆" label="Rank" value="7" color={T.amber} />
      </div>
      <GCard style={{ padding:22, overflowX:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
          <h4 style={{ color:T.text, margin:0 }}>Semester V Results</h4>
          <div style={{ display:"flex", gap:8 }}><Badge ch="PASS" color={T.em} /><Btn v="outline" sz="sm">Download PDF</Btn></div>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["Code","Subject","Credits","Marks","Grade","Points"].map(h=>(
            <th key={h} style={{ padding:"9px 11px", textAlign:"left", fontSize:11, color:T.muted, borderBottom:`1px solid ${T.border}` }}>{h}</th>
          ))}</tr></thead>
          <tbody>{RESULTS.map((r,i)=>(
            <tr key={r.code} style={{ background:i%2===0?T.glass:"transparent" }}>
              <td style={{ padding:"11px", fontSize:11, color:T.muted, fontFamily:"monospace" }}>{r.code}</td>
              <td style={{ padding:"11px", fontSize:13, color:T.text }}>{r.sub}</td>
              <td style={{ padding:"11px", fontSize:12, color:T.muted, textAlign:"center" }}>{r.cr}</td>
              <td style={{ padding:"11px", fontSize:13, fontWeight:800, color:T.text, textAlign:"center" }}>{r.marks}</td>
              <td style={{ padding:"11px" }}><Badge ch={r.grade} color={r.grade==="O"?T.em:r.grade.startsWith("A")?T.vi:T.sky} /></td>
              <td style={{ padding:"11px", fontSize:13, color:T.em, fontWeight:800, textAlign:"center" }}>{r.pts}</td>
            </tr>
          ))}</tbody>
          <tfoot><tr>
            <td colSpan={2} style={{ padding:"13px 11px", fontWeight:800, color:T.text, borderTop:`1px solid ${T.border}` }}>Total</td>
            <td style={{ padding:"13px 11px", textAlign:"center", fontWeight:800, color:T.text, borderTop:`1px solid ${T.border}` }}>{cr}</td>
            <td colSpan={2} style={{ borderTop:`1px solid ${T.border}` }} />
            <td style={{ padding:"13px 11px", borderTop:`1px solid ${T.border}` }}><span style={{ fontSize:14, fontWeight:900, color:T.em }}>SGPA: {sgpa}</span></td>
          </tr></tfoot>
        </table>
      </GCard>
    </div>
  );
}

function StudentsTable() {
  const [search,setSearch]=useState("");
  const list=STUDENTS.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.id.includes(search));
  return (
    <GCard style={{ padding:22 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
        <Inp value={search} onChange={setSearch} placeholder="Search students..." icon="🔍" style={{ marginBottom:0 }} />
        <Btn v="em" sz="sm" style={{ marginLeft:10 }}>+ Add Student</Btn>
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead><tr>{["Roll No","Name","Batch","Sec","CGPA","Attendance","Skills","Status","Actions"].map(h=>(
          <th key={h} style={{ padding:"9px 10px", textAlign:"left", fontSize:11, color:T.muted, borderBottom:`1px solid ${T.border}` }}>{h}</th>
        ))}</tr></thead>
        <tbody>{list.map((s,i)=>(
          <tr key={s.id} style={{ background:i%2===0?T.glass:"transparent" }}>
            <td style={{ padding:"10px", fontSize:11, color:T.muted, fontFamily:"monospace" }}>{s.id}</td>
            <td style={{ padding:"10px", fontSize:12, color:T.text, fontWeight:600 }}>{s.name}</td>
            <td style={{ padding:"10px", fontSize:11, color:T.muted }}>{s.batch}</td>
            <td style={{ padding:"10px", fontSize:11, color:T.muted, textAlign:"center" }}>{s.sec}</td>
            <td style={{ padding:"10px", fontSize:13, color:T.em, fontWeight:800, textAlign:"center" }}>{s.cgpa}</td>
            <td style={{ padding:"10px", textAlign:"center" }}><span style={{ fontSize:12, color:s.att>=75?T.em:T.rose, fontWeight:700 }}>{s.att}%</span></td>
            <td style={{ padding:"10px" }}><div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>{s.skills.slice(0,2).map(sk=><Tag key={sk} ch={sk} />)}</div></td>
            <td style={{ padding:"10px" }}><Badge ch={s.status} color={s.status==="warning"?T.rose:T.em} /></td>
            <td style={{ padding:"10px" }}><div style={{ display:"flex", gap:5 }}><Btn v="ghost" sz="sm">View</Btn><Btn v="rose" sz="sm">Remove</Btn></div></td>
          </tr>
        ))}</tbody>
      </table>
    </GCard>
  );
}

function AdmissionQueue() {
  const [apps,setApps]=useState([
    {id:"APP001",name:"Rohan Kumar",mob:"9876543210",email:"rohan@g.com",inter:"89%",status:"pending"},
    {id:"APP002",name:"Sweta Singh",mob:"9123456789",email:"sweta@g.com",inter:"91%",status:"pending"},
    {id:"APP003",name:"Manoj Rao",  mob:"9988776655",email:"manoj@g.com",inter:"76%",status:"approved"},
  ]);
  const upd=(id,st)=>setApps(a=>a.map(x=>x.id===id?{...x,status:st}:x));
  return (
    <GCard style={{ padding:24 }}>
      <h4 style={{ color:T.text, marginTop:0 }}>Admission Applications</h4>
      {apps.map((a,i)=>(
        <div key={a.id} style={{ padding:18, borderRadius:10, background:i%2===0?T.glass:"transparent", marginBottom:10, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:4 }}>{a.name}</div>
              <div style={{ display:"flex", gap:14, fontSize:11, color:T.muted }}>
                <span>📱 {a.mob}</span><span>📧 {a.email}</span><span>📊 {a.inter}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:7, alignItems:"center" }}>
              <Badge ch={a.status} color={a.status==="pending"?T.amber:a.status==="approved"?T.em:T.rose} />
              {a.status==="pending"&&<><Btn onClick={()=>upd(a.id,"approved")} v="em" sz="sm">Approve</Btn><Btn onClick={()=>upd(a.id,"rejected")} v="rose" sz="sm">Reject</Btn></>}
            </div>
          </div>
          {a.status==="approved"&&<div style={{ marginTop:9, padding:"8px 12px", background:`${T.em}10`, borderRadius:7, fontSize:11, color:T.em }}>✉️ Approval email sent. Reporting: March 25, 2024 at 9:00 AM</div>}
        </div>
      ))}
    </GCard>
  );
}

function AttendanceUpload() {
  const [subj,setSubj]=useState("Machine Learning");
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [att,setAtt]=useState(STUDENTS.reduce((a,s)=>({...a,[s.id]:true}),{}));
  const [saved,setSaved]=useState(false);
  return (
    <GCard style={{ padding:26 }}>
      <h4 style={{ color:T.text, marginTop:0 }}>Mark Attendance</h4>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:22 }}>
        <Inp label="Date" type="date" value={date} onChange={setDate} />
        <Sel label="Subject" value={subj} onChange={setSubj} options={["Machine Learning","Deep Learning","NLP","Data Analytics","Computer Vision"]} />
      </div>
      {saved ? (
        <div style={{ textAlign:"center", padding:28, background:`${T.em}08`, borderRadius:10 }}>
          <div style={{ fontSize:36, marginBottom:8 }}>✅</div>
          <div style={{ color:T.em, fontWeight:700 }}>Attendance saved! Students notified.</div>
          <Btn onClick={()=>setSaved(false)} v="ghost" sz="sm" style={{ marginTop:12 }}>Mark Another</Btn>
        </div>
      ) : (
        <>
          <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:18 }}>
            <thead><tr>{["Roll No","Name","Present","Absent"].map(h=>(
              <th key={h} style={{ padding:"9px 11px", textAlign:"left", fontSize:11, color:T.muted, borderBottom:`1px solid ${T.border}` }}>{h}</th>
            ))}</tr></thead>
            <tbody>{STUDENTS.map((s,i)=>(
              <tr key={s.id} style={{ background:i%2===0?T.glass:"transparent" }}>
                <td style={{ padding:"10px 11px", fontSize:11, color:T.muted }}>{s.id}</td>
                <td style={{ padding:"10px 11px", fontSize:12, color:T.text }}>{s.name}</td>
                {["Present","Absent"].map(opt=>(
                  <td key={opt} style={{ padding:"10px 11px" }}>
                    <button onClick={()=>setAtt(p=>({...p,[s.id]:opt==="Present"}))} style={{
                      padding:"4px 12px", borderRadius:18, border:"1px solid",
                      borderColor:(opt==="Present"&&att[s.id])||(opt==="Absent"&&!att[s.id])?(opt==="Present"?T.em:T.rose):T.border,
                      background:(opt==="Present"&&att[s.id])?`${T.em}1A`:(opt==="Absent"&&!att[s.id])?`${T.rose}1A`:"transparent",
                      color:(opt==="Present"&&att[s.id])?T.em:(opt==="Absent"&&!att[s.id])?T.rose:T.muted,
                      cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"inherit" }}>{opt}</button>
                  </td>
                ))}
              </tr>
            ))}</tbody>
          </table>
          <Btn onClick={()=>setSaved(true)} v="em" style={{ width:"100%" }}>Save Attendance ✓</Btn>
        </>
      )}
    </GCard>
  );
}

function HODAnalytics() {
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }}>
        <Stat icon="🎓" label="Total Students" value="480" color={T.em} change={12} />
        <Stat icon="👨‍🏫" label="Faculty" value="24" color={T.vi} />
        <Stat icon="📊" label="Avg CGPA" value="7.8" color={T.sky} change={3} />
        <Stat icon="💼" label="Placements" value="94%" color={T.amber} change={5} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <GCard style={{ padding:22 }}>
          <h4 style={{ color:T.text, margin:"0 0 16px" }}>Batch Attendance</h4>
          {[{b:"2022-26",v:84},{b:"2023-27",v:81},{b:"2021-25",v:78}].map(r=>(
            <div key={r.b} style={{ marginBottom:14 }}>
              <Progress value={r.v} color={r.v>=75?T.em:T.rose} label={`Batch ${r.b}`} height={8} />
            </div>
          ))}
        </GCard>
        <GCard style={{ padding:22 }}>
          <h4 style={{ color:T.text, margin:"0 0 16px" }}>Placement by Company</h4>
          {[{c:"TCS",n:18,col:T.sky},{c:"Infosys",n:14,col:T.em},{c:"Wipro",n:12,col:T.vi},{c:"Google/MS",n:6,col:T.amber}].map(r=>(
            <div key={r.c} style={{ marginBottom:12 }}>
              <Progress value={Math.round(r.n/50*100)} color={r.col} label={`${r.c} — ${r.n} students`} height={7} />
            </div>
          ))}
        </GCard>
      </div>
    </div>
  );
}

function AdminDash() {
  return (
    <div>
      <div style={{ background:`linear-gradient(135deg,${T.amber}20,${T.vi}10)`, borderRadius:16, padding:22, marginBottom:22, border:`1px solid ${T.amber}30`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:T.text }}>System Administration</div>
          <div style={{ fontSize:12, color:T.muted }}>Full control · MTIET AI & DS Portal</div>
        </div>
        <Badge ch="⚡ Super Admin" color={T.amber} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
        <Stat icon="👥" label="Total Users" value="530" color={T.amber} change={8} />
        <Stat icon="📝" label="New Admissions" value="12" color={T.em} />
        <Stat icon="⚠️" label="Alerts" value="3" color={T.rose} />
        <Stat icon="💾" label="DB Health" value="99.9%" color={T.sky} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        <GCard style={{ padding:22 }}>
          <h4 style={{ color:T.text, margin:"0 0 16px" }}>System Usage</h4>
          {[{l:"Students",v:480,max:500,c:T.em},{l:"Faculty",v:24,max:30,c:T.vi},{l:"Storage (GB)",v:68,max:100,c:T.sky},{l:"API Calls/day",v:4200,max:10000,c:T.amber}].map(s=>(
            <div key={s.l} style={{ marginBottom:14 }}>
              <Progress value={Math.round(s.v/s.max*100)} color={s.c} label={`${s.l}: ${s.v.toLocaleString()} / ${s.max.toLocaleString()}`} height={7} />
            </div>
          ))}
        </GCard>
        <GCard style={{ padding:22 }}>
          <h4 style={{ color:T.text, margin:"0 0 14px" }}>Recent Activity</h4>
          {[{i:"✅",m:"Student added: 22A91A6606",t:"5 min"},{i:"📧",m:"Bulk email: 480 students",t:"1 hr"},{i:"📝",m:"Admission approved: APP003",t:"2 hr"},{i:"💾",m:"DB backup completed",t:"6 hr"}].map((a,i)=>(
            <div key={i} style={{ display:"flex", gap:9, padding:"7px 0", borderBottom:`1px solid ${T.border}`, fontSize:11 }}>
              <span>{a.i}</span><div><div style={{ color:T.text }}>{a.m}</div><div style={{ color:T.muted, fontSize:10 }}>{a.t} ago</div></div>
            </div>
          ))}
        </GCard>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PORTALS
// ══════════════════════════════════════════════════════════════
function StudentPortal({ user, setView }) {
  const [nav,setNav]=useState("dashboard");
  const items=[
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"attendance",icon:"📋",label:"Attendance"},
    {id:"results",icon:"📊",label:"Results"},
    {id:"analytics",icon:"📈",label:"My Analytics"},
    {id:"events",icon:"🎉",label:"Events"},
    {id:"timetable",icon:"📅",label:"Timetable"},
    {id:"materials",icon:"📚",label:"Study Materials"},
    {id:"idcard",icon:"🪪",label:"Digital ID Card"},
    {id:"resume",icon:"📄",label:"Resume Builder"},
    {id:"placement",icon:"💼",label:"Placement Tracker"},
    {id:"internship",icon:"🏢",label:"Internship Tracker"},
    {id:"feedback",icon:"⭐",label:"Give Feedback"},
    {id:"complaints",icon:"📢",label:"Complaints"},
    {id:"certificates",icon:"📜",label:"Certificates"},
    {id:"profile",icon:"👤",label:"Profile"},
  ];
  const me=STUDENTS[0];
  const avgAtt=Math.round(ATTEND.reduce((s,a)=>s+a.pct,0)/ATTEND.length);
  const titles={dashboard:"Student Dashboard",attendance:"Attendance",results:"Results",analytics:"Performance Analytics",events:"Events",timetable:"Timetable",materials:"Study Materials",idcard:"Digital ID Card",resume:"Resume Builder",placement:"Placement Tracker",internship:"Internship Tracker",feedback:"Student Feedback",complaints:"Complaints",certificates:"Certificates",profile:"My Profile"};
  return (
    <Shell user={user} portal="student" setView={setView} title={titles[nav]||nav} navItems={items} nav={nav} setNav={setNav}>
      {nav==="dashboard"&&(
        <div>
          <div style={{ background:`linear-gradient(135deg,${T.em}20,${T.vi}10)`, borderRadius:14, padding:22, marginBottom:20, border:`1px solid ${T.em}30` }}>
            <div style={{ fontSize:11, color:T.em }}>Good morning,</div>
            <div style={{ fontSize:20, fontWeight:800, color:T.text }}>{me.name} 👋</div>
            <div style={{ fontSize:12, color:T.muted }}>{me.id} · B.Tech AI & DS · {me.batch} · Section {me.sec}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
            <Stat icon="📊" label="CGPA" value={me.cgpa} color={T.em} />
            <Stat icon="📋" label="Avg Attendance" value={`${avgAtt}%`} color={avgAtt>=75?T.em:T.rose} />
            <Stat icon="🎉" label="Events Joined" value="6" color={T.vi} />
            <Stat icon="🏆" label="Semester" value="V" color={T.amber} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
            <GCard style={{ padding:20 }}>
              <h4 style={{ color:T.text, margin:"0 0 14px", fontSize:14 }}>Attendance Overview</h4>
              {ATTEND.slice(0,4).map(a=>(
                <div key={a.sub} style={{ marginBottom:12 }}>
                  <Progress value={a.pct} color={a.pct>=75?T.em:T.rose} label={a.sub} height={7} />
                </div>
              ))}
            </GCard>
            <GCard style={{ padding:20 }}>
              <h4 style={{ color:T.text, margin:"0 0 14px", fontSize:14 }}>Quick Access</h4>
              {[{id:"idcard",i:"🪪",l:"View ID Card"},{id:"resume",i:"📄",l:"Build Resume"},{id:"certificates",i:"📜",l:"Get Certificate"},{id:"placement",i:"💼",l:"Placement Status"}].map(q=>(
                <button key={q.id} onClick={()=>setNav(q.id)} style={{ width:"100%", padding:"9px 13px", borderRadius:8, background:T.glass, border:`1px solid ${T.border}`, color:T.text, fontSize:12, cursor:"pointer", marginBottom:7, textAlign:"left", fontFamily:"inherit", display:"flex", gap:9, alignItems:"center", transition:"all .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=T.em}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                  <span>{q.i}</span>{q.l}
                </button>
              ))}
            </GCard>
          </div>
        </div>
      )}
      {nav==="attendance"&&<AttendanceView />}
      {nav==="results"&&<ResultsView />}
      {nav==="analytics"&&<PerformanceAnalytics />}
      {nav==="events"&&<EventsPage />}
      {nav==="idcard"&&<DigitalID me={me} />}
      {nav==="resume"&&<ResumeBuilder user={user} />}
      {nav==="placement"&&<PlacementTracker />}
      {nav==="internship"&&<InternshipTracker />}
      {nav==="feedback"&&<FeedbackSystem />}
      {nav==="complaints"&&<Complaints />}
      {nav==="certificates"&&<CertificateGen />}
      {nav==="timetable"&&(
        <GCard style={{ padding:22, overflowX:"auto" }}>
          <h4 style={{ color:T.text, margin:"0 0 18px" }}>Semester V Timetable</h4>
          {["Mon","Tue","Wed","Thu","Fri"].map((d,di)=>(
            <div key={d} style={{ display:"grid", gridTemplateColumns:"60px repeat(6,1fr)", gap:6, marginBottom:8 }}>
              <div style={{ fontSize:11, color:T.muted, display:"flex", alignItems:"center", fontWeight:700 }}>{d}</div>
              {[["ML","9:00"],["DL","10:00"],["NLP","11:00"],["Break","12:00"],["Data Anal.","1:00"],["CV","2:00"]].map(([sub,t])=>(
                <div key={t} style={{ padding:"8px 6px", borderRadius:7, textAlign:"center",
                  background:sub==="Break"?"rgba(255,255,255,0.03)":`${T.em}14`,
                  border:`1px solid ${sub==="Break"?T.border:T.borderV}` }}>
                  <div style={{ fontSize:9, color:sub==="Break"?T.muted:T.em, fontWeight:700 }}>{sub}</div>
                  <div style={{ fontSize:8, color:T.muted }}>{t}</div>
                </div>
              ))}
            </div>
          ))}
        </GCard>
      )}
      {nav==="materials"&&(
        <GCard style={{ padding:22 }}>
          <h4 style={{ color:T.text, margin:"0 0 18px" }}>Study Materials</h4>
          {[{sub:"Machine Learning",t:"PDF",n:"Unit 1 — Supervised Learning",sz:"2.4 MB"},{sub:"Deep Learning",t:"PPT",n:"Neural Networks Architecture",sz:"5.1 MB"},{sub:"NLP",t:"PDF",n:"Transformer & Attention Mechanism",sz:"3.8 MB"},{sub:"Data Analytics",t:"Lab Manual",n:"Pandas & Visualisation Lab",sz:"1.9 MB"},{sub:"Computer Vision",t:"Notes",n:"CNN Feature Extraction",sz:"4.2 MB"}].map((m,i)=>(
            <div key={i} style={{ display:"flex", gap:14, padding:"13px 0", borderBottom:`1px solid ${T.border}`, alignItems:"center" }}>
              <div style={{ fontSize:22 }}>{m.t==="PDF"?"📄":m.t==="PPT"?"📊":"📝"}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:T.text }}>{m.n}</div>
                <div style={{ fontSize:11, color:T.muted }}>{m.sub} · {m.t} · {m.sz}</div>
              </div>
              <Btn v="outline" sz="sm">Download</Btn>
            </div>
          ))}
        </GCard>
      )}
      {nav==="profile"&&(
        <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:22 }}>
          <GCard style={{ padding:26, textAlign:"center" }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:`linear-gradient(135deg,${T.em},${T.vi})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:24, fontWeight:900, color:"#fff", boxShadow:glow(T.em,20) }}>
              {me.name.split(" ").map(w=>w[0]).slice(0,2).join("")}
            </div>
            <h3 style={{ color:T.text, margin:"0 0 3px" }}>{me.name}</h3>
            <div style={{ color:T.em, fontSize:12 }}>{me.id}</div>
            <div style={{ color:T.muted, fontSize:12, marginBottom:14 }}>B.Tech AI & DS · {me.batch}</div>
            <Badge ch="Active" color={T.em} />
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", marginTop:12 }}>
              {me.skills.map(s=><Tag key={s} ch={s} />)}
            </div>
          </GCard>
          <GCard style={{ padding:26 }}>
            <h4 style={{ color:T.text, margin:"0 0 18px" }}>Academic Profile</h4>
            {[["Roll Number",me.id],["Email",me.email],["Phone",me.phone],["Program","B.Tech AI & Data Science"],["Batch",me.batch],["Section",`Section ${me.sec}`],["CGPA",me.cgpa],["Attendance",`${me.att}%`]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
                <span style={{ width:150, fontSize:12, color:T.muted, flexShrink:0 }}>{k}</span>
                <span style={{ fontSize:13, color:T.text, fontWeight:600 }}>{v}</span>
              </div>
            ))}
          </GCard>
        </div>
      )}
    </Shell>
  );
}

function FacultyPortal({ user, setView }) {
  const [nav,setNav]=useState("dashboard");
  const items=[
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"students",icon:"🎓",label:"My Students"},
    {id:"attendance",icon:"📋",label:"Mark Attendance"},
    {id:"qr",icon:"📲",label:"QR Attendance"},
    {id:"results",icon:"📊",label:"Upload Results"},
    {id:"admissions",icon:"📝",label:"Admission Queue"},
    {id:"events",icon:"🎉",label:"Post Event"},
    {id:"bulk",icon:"📧",label:"Bulk Email"},
    {id:"feedback",icon:"⭐",label:"Student Feedback"},
  ];
  const t={dashboard:"Faculty Dashboard",students:"Students",attendance:"Mark Attendance",qr:"QR Attendance",results:"Upload Results",admissions:"Admission Queue",events:"Post Event",bulk:"Bulk Email",feedback:"Student Feedback"};
  return (
    <Shell user={user} portal="faculty" setView={setView} title={t[nav]||nav} navItems={items} nav={nav} setNav={setNav}>
      {nav==="dashboard"&&(
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
            <Stat icon="🎓" label="My Students" value="120" color={T.sky} change={5} />
            <Stat icon="📊" label="Avg Attendance" value="81%" color={T.em} />
            <Stat icon="📝" label="Pending Tasks" value="4" color={T.amber} />
            <Stat icon="📅" label="Classes Today" value="5" color={T.vi} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:18 }}>
            <GCard style={{ padding:20 }}>
              <h4 style={{ color:T.text, margin:"0 0 14px" }}>Recent Students</h4>
              {STUDENTS.slice(0,4).map(s=>(
                <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div><div style={{ fontSize:12, color:T.text }}>{s.name}</div><div style={{ fontSize:10, color:T.muted }}>{s.id}</div></div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:13, fontWeight:800, color:T.em }}>{s.cgpa}</span>
                    <span style={{ fontSize:12, color:s.att>=75?T.em:T.rose, fontWeight:700 }}>{s.att}%</span>
                    <Badge ch={s.status} color={s.status==="warning"?T.rose:T.em} size={10} />
                  </div>
                </div>
              ))}
            </GCard>
            <GCard style={{ padding:20 }}>
              <h4 style={{ color:T.text, margin:"0 0 14px" }}>Quick Actions</h4>
              {[{id:"attendance",l:"Mark Attendance"},{id:"qr",l:"QR Attendance"},{id:"admissions",l:"Review Admissions"},{id:"bulk",l:"Send Bulk Email"}].map(a=>(
                <button key={a.id} onClick={()=>setNav(a.id)} style={{ width:"100%", padding:"9px 12px", borderRadius:7, background:T.glass, border:`1px solid ${T.border}`, color:T.text, fontSize:12, cursor:"pointer", marginBottom:7, textAlign:"left", fontFamily:"inherit", transition:"all .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=T.sky}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>→ {a.l}</button>
              ))}
            </GCard>
          </div>
        </div>
      )}
      {nav==="students"&&<StudentsTable />}
      {nav==="attendance"&&<AttendanceUpload />}
      {nav==="qr"&&<QRAttendance />}
      {nav==="admissions"&&<AdmissionQueue />}
      {nav==="results"&&(
        <GCard style={{ padding:26 }}>
          <h4 style={{ color:T.text, marginTop:0 }}>Upload Results</h4>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }}>
            <Sel label="Batch" value="" onChange={()=>{}} options={["2022-26","2023-27"]} />
            <Sel label="Section" value="" onChange={()=>{}} options={["A","B"]} />
            <Sel label="Semester" value="" onChange={()=>{}} options={["I","II","III","IV","V","VI","VII","VIII"]} />
          </div>
          <div style={{ border:`2px dashed ${T.border}`, borderRadius:12, padding:36, textAlign:"center", cursor:"pointer", marginBottom:18 }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=T.em}
            onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
            <div style={{ fontSize:36, marginBottom:10 }}>📊</div>
            <div style={{ color:T.text, fontWeight:700, marginBottom:4 }}>Upload Results Excel</div>
            <div style={{ color:T.muted, fontSize:12 }}>Drag & drop or click · .xlsx / .csv</div>
          </div>
          <Btn v="em" style={{ width:"100%" }}>Submit Results</Btn>
        </GCard>
      )}
      {nav==="events"&&(
        <GCard style={{ padding:26 }}>
          <h4 style={{ color:T.text, marginTop:0 }}>Post an Event</h4>
          <Inp label="Event Title" value="" onChange={()=>{}} placeholder="e.g. AI Workshop 2024" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Sel label="Type" value="" onChange={()=>{}} options={["Hackathon","Seminar","Workshop","Industrial Visit","Guest Lecture"]} />
            <Inp label="Date" type="date" value="" onChange={()=>{}} />
          </div>
          <Inp label="Description" value="" onChange={()=>{}} rows={3} />
          <Btn v="em" style={{ width:"100%" }}>Post Event</Btn>
        </GCard>
      )}
      {nav==="bulk"&&<BulkEmail />}
      {nav==="feedback"&&<FeedbackSystem />}
    </Shell>
  );
}

function HODPortal({ user, setView }) {
  const [nav,setNav]=useState("dashboard");
  const items=[
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"analytics",icon:"📈",label:"Analytics"},
    {id:"students",icon:"🎓",label:"Students"},
    {id:"faculty",icon:"👨‍🏫",label:"Faculty"},
    {id:"admissions",icon:"📝",label:"Admissions"},
    {id:"placements",icon:"💼",label:"Placements"},
    {id:"events",icon:"🎉",label:"Event Approval"},
    {id:"bulk",icon:"📧",label:"Send Notice"},
    {id:"feedback",icon:"⭐",label:"Feedback Reports"},
    {id:"complaints",icon:"📢",label:"Complaints"},
    {id:"reports",icon:"📋",label:"Reports"},
  ];
  const t={dashboard:"HOD Dashboard",analytics:"Department Analytics",students:"Student Management",faculty:"Faculty Management",admissions:"Admission Requests",placements:"Placement Tracking",events:"Event Approvals",bulk:"Send Notice",feedback:"Feedback Reports",complaints:"Complaint Management",reports:"Generate Reports"};
  return (
    <Shell user={user} portal="hod" setView={setView} title={t[nav]||nav} navItems={items} nav={nav} setNav={setNav}>
      {nav==="dashboard"&&<HODAnalytics />}
      {nav==="analytics"&&<HODAnalytics />}
      {nav==="students"&&<StudentsTable />}
      {nav==="faculty"&&(
        <GCard style={{ padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
            <h4 style={{ color:T.text, margin:0 }}>Faculty Management</h4>
            <Btn v="vi" sz="sm">+ Add Faculty</Btn>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["ID","Name","Designation","Subject","Exp","Publications","Rating","Actions"].map(h=>(
              <th key={h} style={{ padding:"9px 10px", textAlign:"left", fontSize:11, color:T.muted, borderBottom:`1px solid ${T.border}` }}>{h}</th>
            ))}</tr></thead>
            <tbody>{FACULTY.map((f,i)=>(
              <tr key={f.id} style={{ background:i%2===0?T.glass:"transparent" }}>
                <td style={{ padding:"10px", fontSize:11, color:T.muted }}>{f.id}</td>
                <td style={{ padding:"10px", fontSize:12, color:T.text, fontWeight:600 }}>{f.name}</td>
                <td style={{ padding:"10px" }}><Badge ch={f.desig} color={T.vi} size={10} /></td>
                <td style={{ padding:"10px", fontSize:12, color:T.muted }}>{f.sub}</td>
                <td style={{ padding:"10px", fontSize:12, color:T.em, fontWeight:700 }}>{f.exp}y</td>
                <td style={{ padding:"10px", fontSize:12, color:T.sky, textAlign:"center" }}>{f.pub}</td>
                <td style={{ padding:"10px", fontSize:12, color:T.amber }}>⭐ {f.rating}</td>
                <td style={{ padding:"10px" }}><div style={{ display:"flex", gap:5 }}><Btn v="ghost" sz="sm">Edit</Btn><Btn v="rose" sz="sm">Remove</Btn></div></td>
              </tr>
            ))}</tbody>
          </table>
        </GCard>
      )}
      {nav==="admissions"&&<AdmissionQueue />}
      {nav==="placements"&&<PlacementTracker />}
      {nav==="events"&&(
        <GCard style={{ padding:22 }}>
          <h4 style={{ color:T.text, margin:"0 0 16px" }}>Pending Event Approvals</h4>
          {[{title:"AI Hackathon 2024",by:"Dr. M. Srinivas",date:"2024-04-10",type:"Hackathon"},{title:"Gen AI Expert Talk",by:"Ms. T. Haritha",date:"2024-03-28",type:"Seminar"}].map((e,i)=>(
            <div key={i} style={{ padding:18, borderRadius:10, background:T.glass, border:`1px solid ${T.border}`, marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{e.title}</div>
                <div style={{ fontSize:11, color:T.muted }}>👨‍🏫 {e.by} · 📅 {e.date}</div>
              </div>
              <div style={{ display:"flex", gap:8 }}><Btn v="em" sz="sm">Approve</Btn><Btn v="rose" sz="sm">Reject</Btn></div>
            </div>
          ))}
        </GCard>
      )}
      {nav==="bulk"&&<BulkEmail />}
      {nav==="feedback"&&<FeedbackSystem />}
      {nav==="complaints"&&<Complaints />}
      {nav==="reports"&&(
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {[{i:"📊",t:"Student Performance",d:"CGPA, SGPA, ranks"},{i:"📋",t:"Attendance Report",d:"Subject & student wise"},{i:"💼",t:"Placement Report",d:"Company-wise data"},{i:"👨‍🏫",t:"Faculty Workload",d:"Teaching hours & publications"},{i:"🎉",t:"Events & Activities",d:"Annual summary"},{i:"📝",t:"Admission Report",d:"Applications & enrolments"}].map(r=>(
            <GCard key={r.t} style={{ padding:20, display:"flex", gap:14, alignItems:"center", cursor:"pointer" }}
              onClick={()=>{}} >
              <span style={{ fontSize:28 }}>{r.i}</span>
              <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:T.text }}>{r.t}</div><div style={{ fontSize:11, color:T.muted }}>{r.d}</div></div>
              <Btn v="outline" sz="sm">Export PDF</Btn>
            </GCard>
          ))}
        </div>
      )}
    </Shell>
  );
}

function AdminPortal({ user, setView }) {
  const [nav,setNav]=useState("dashboard");
  const items=[
    {id:"dashboard",icon:"⚡",label:"Dashboard"},
    {id:"students",icon:"🎓",label:"Students"},
    {id:"faculty",icon:"👨‍🏫",label:"Faculty"},
    {id:"admissions",icon:"📝",label:"Admissions"},
    {id:"alumni",icon:"🌐",label:"Alumni"},
    {id:"placements",icon:"💼",label:"Placements"},
    {id:"bulk",icon:"📧",label:"Bulk Email"},
    {id:"complaints",icon:"📢",label:"Complaints"},
    {id:"audit",icon:"🔍",label:"Audit Logs"},
    {id:"settings",icon:"⚙️",label:"System Settings"},
  ];
  const t={dashboard:"Admin Dashboard",students:"Students",faculty:"Faculty",admissions:"Admissions",alumni:"Alumni",placements:"Placements",bulk:"Bulk Email",complaints:"Complaints",audit:"Audit Logs",settings:"System Settings"};
  return (
    <Shell user={user} portal="admin" setView={setView} title={t[nav]||nav} navItems={items} nav={nav} setNav={setNav}>
      {nav==="dashboard"&&<AdminDash />}
      {nav==="students"&&<StudentsTable />}
      {nav==="admissions"&&<AdmissionQueue />}
      {nav==="placements"&&<PlacementTracker />}
      {nav==="bulk"&&<BulkEmail />}
      {nav==="complaints"&&<Complaints />}
      {nav==="alumni"&&(
        <GCard style={{ padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
            <h4 style={{ color:T.text, margin:0 }}>Alumni Registry</h4>
            <div style={{ display:"flex", gap:8 }}><Btn v="ghost" sz="sm">Export CSV</Btn><Btn v="amber" sz="sm">+ Add Alumni</Btn></div>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["Name","Batch","Company","Role","Location","Package","Actions"].map(h=>(
              <th key={h} style={{ padding:"9px 11px", textAlign:"left", fontSize:11, color:T.muted, borderBottom:`1px solid ${T.border}` }}>{h}</th>
            ))}</tr></thead>
            <tbody>{ALUMNI.map((a,i)=>(
              <tr key={a.id} style={{ background:i%2===0?T.glass:"transparent" }}>
                <td style={{ padding:"11px", fontSize:13, color:T.text }}>{a.name}</td>
                <td style={{ padding:"11px" }}><Badge ch={a.batch} color={T.vi} /></td>
                <td style={{ padding:"11px", fontSize:12, color:T.em, fontWeight:700 }}>{a.co}</td>
                <td style={{ padding:"11px", fontSize:12, color:T.muted }}>{a.role}</td>
                <td style={{ padding:"11px", fontSize:12, color:T.muted }}>{a.loc}</td>
                <td style={{ padding:"11px", fontSize:12, color:T.amber, fontWeight:700 }}>{a.pkg}</td>
                <td style={{ padding:"11px" }}><div style={{ display:"flex", gap:5 }}><Btn v="ghost" sz="sm">Edit</Btn><Btn v="rose" sz="sm">Remove</Btn></div></td>
              </tr>
            ))}</tbody>
          </table>
        </GCard>
      )}
      {nav==="faculty"&&(
        <GCard style={{ padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
            <h4 style={{ color:T.text, margin:0 }}>Faculty Management</h4>
            <Btn v="amber" sz="sm">+ Add Faculty</Btn>
          </div>
          {FACULTY.map((f,i)=>(
            <div key={f.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${T.em},${T.vi})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:"#fff" }}>{f.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
                <div><div style={{ fontSize:13, fontWeight:700, color:T.text }}>{f.name}</div><div style={{ fontSize:11, color:T.muted }}>{f.desig} · {f.sub}</div></div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <Badge ch={`${f.exp}y exp`} color={T.vi} size={10} />
                <Btn v="ghost" sz="sm">Edit</Btn><Btn v="rose" sz="sm">Remove</Btn>
              </div>
            </div>
          ))}
        </GCard>
      )}
      {nav==="audit"&&(
        <GCard style={{ padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
            <h4 style={{ color:T.text, margin:0 }}>System Audit Logs</h4>
            <Btn v="ghost" sz="sm">Export Logs</Btn>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["User","Action","IP","Timestamp"].map(h=>(
              <th key={h} style={{ padding:"9px 11px", textAlign:"left", fontSize:11, color:T.muted, borderBottom:`1px solid ${T.border}` }}>{h}</th>
            ))}</tr></thead>
            <tbody>{[
              {u:"Admin",a:"Added student: 22A91A6606",ip:"192.168.1.10",t:"2024-03-15 09:32:15"},
              {u:"F002",  a:"Uploaded attendance: ML-A",ip:"192.168.1.15",t:"2024-03-15 10:05:42"},
              {u:"HOD001",a:"Approved event: Hackathon 2024",ip:"192.168.1.12",t:"2024-03-15 11:20:08"},
              {u:"Admin",a:"Sent bulk email to 480 students",ip:"192.168.1.10",t:"2024-03-15 14:45:32"},
            ].map((l,i)=>(
              <tr key={i} style={{ background:i%2===0?T.glass:"transparent" }}>
                <td style={{ padding:"11px" }}><Badge ch={l.u} color={T.amber} /></td>
                <td style={{ padding:"11px", fontSize:12, color:T.text }}>{l.a}</td>
                <td style={{ padding:"11px", fontSize:11, color:T.muted, fontFamily:"monospace" }}>{l.ip}</td>
                <td style={{ padding:"11px", fontSize:11, color:T.muted, fontFamily:"monospace" }}>{l.t}</td>
              </tr>
            ))}</tbody>
          </table>
        </GCard>
      )}
      {nav==="settings"&&(
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
          {[{i:"🔑",t:"Authentication",ls:["JWT Secret Rotation","Session Timeout","Password Policy","2FA Config"]},{i:"📧",t:"Email / SMTP",ls:["Nodemailer SMTP Config","Email Templates","Bulk Limits","Bounce Handling"]},{i:"💾",t:"Database",ls:["MongoDB Atlas Config","Backup Schedule","Storage Monitor","Pool Size"]},{i:"🛡️",t:"Security",ls:["Rate Limiting","CORS Policy","CSP Headers","IP Whitelist"]},{i:"📁",t:"File Storage",ls:["Cloudinary Keys","Upload Limits","Allowed Types","CDN Config"]},{i:"🔔",t:"Notifications",ls:["Socket.io Config","Push Notifications","SMS (Twilio)","Email Alerts"]}].map(s=>(
            <GCard key={s.t} style={{ padding:22 }}>
              <h4 style={{ color:T.text, margin:"0 0 14px", display:"flex", gap:8 }}><span>{s.i}</span>{s.t}</h4>
              {s.ls.map(l=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:12, color:T.muted }}>{l}</span><Btn v="ghost" sz="sm">Configure</Btn>
                </div>
              ))}
            </GCard>
          ))}
        </div>
      )}
    </Shell>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [view,setView]=useState("public");
  const [section,setSection]=useState("Home");
  const [portal,setPortal]=useState(null);
  const [user,setUser]=useState(null);
  const [chatOpen,setChatOpen]=useState(false);

  useEffect(()=>{ if(section==="Admissions") setView("admission"); },[section]);

  const pubPages={
    "About College":<AboutCollege />,
    "About Dept":<AboutDept />,
    "Faculty":<FacultySection />,
    "Activities":<Activities />,
    "Events":<EventsPage />,
    "Alumni":<AlumniPage />,
    "Contact":<ContactPage />,
  };

  if(view==="login") return <Login setView={setView} setPortal={setPortal} setUser={setUser} />;
  if(view==="admission") return <Admission setView={setView} />;
  if(view==="portal"){
    if(portal==="student") return <StudentPortal user={user} setView={setView} />;
    if(portal==="faculty") return <FacultyPortal user={user} setView={setView} />;
    if(portal==="hod")     return <HODPortal     user={user} setView={setView} />;
    if(portal==="admin")   return <AdminPortal   user={user} setView={setView} />;
  }

  return (
    <div style={{ background:T.bg, color:T.text, fontFamily:"'Inter',-apple-system,sans-serif", minHeight:"100vh" }}>
      <PubNav active={section} setActive={setSection} setView={setView} />
      <div style={{ paddingTop:section!=="Home"?64:0 }}>
        {section==="Home" ? (
          <>
            <Hero setView={setView} setActive={setSection} />
            <AboutDept />
            {/* Advanced Features Showcase */}
            <div style={{ padding:"72px 5vw", background:T.bg }}>
              <div style={{ maxWidth:1200, margin:"0 auto" }}>
                <SectionTitle title="Advanced Portal Features" sub="18 enterprise-grade modules powering the department" />
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
                  {[
                    {i:"🤖",t:"AI Chatbot",d:"24/7 college query assistant"},
                    {i:"💼",t:"Placement Tracker",d:"Real-time placement records"},
                    {i:"📄",t:"Resume Builder",d:"AI-assisted resume creation"},
                    {i:"📈",t:"Performance Analytics",d:"CGPA trends & rank tracking"},
                    {i:"👨‍🏫",t:"Faculty Analytics",d:"Publications & workload insights"},
                    {i:"📲",t:"QR Attendance",d:"Scan-to-mark attendance system"},
                    {i:"🪪",t:"Digital ID Card",d:"Downloadable student ID"},
                    {i:"📧",t:"Bulk Email System",d:"SMTP-powered mass mailer"},
                    {i:"🎉",t:"Event Registration",d:"Online event sign-up with tracking"},
                    {i:"📜",t:"Certificate Generator",d:"Auto-generate official certificates"},
                    {i:"⭐",t:"Student Feedback",d:"Subject-wise faculty rating system"},
                    {i:"📢",t:"Complaint Management",d:"Online grievance redressal"},
                    {i:"🏢",t:"Internship Tracking",d:"Company, duration, stipend logs"},
                    {i:"🌐",t:"Alumni Networking",d:"Batch-wise alumni directory"},
                    {i:"🔍",t:"Audit Logs",d:"Full system activity trail"},
                    {i:"🏭",t:"Department Analytics",d:"HOD-level departmental insights"},
                    {i:"💰",t:"Alumni Donations",d:"Crowdfunding for dept projects"},
                    {i:"🛡️",t:"Document Verification",d:"Aadhaar & certificate verifier"},
                  ].map(f=>(
                    <GCard key={f.t} style={{ padding:18 }} onClick={()=>setView("login")}>
                      <div style={{ fontSize:26, marginBottom:10 }}>{f.i}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:4 }}>{f.t}</div>
                      <div style={{ fontSize:11, color:T.muted, lineHeight:1.5 }}>{f.d}</div>
                    </GCard>
                  ))}
                </div>
              </div>
            </div>
            <EventsPage />
            {/* CTA Banner */}
            <div style={{ padding:"64px 5vw", background:`linear-gradient(135deg,${T.em}14,${T.vi}10)`, borderTop:`1px solid ${T.borderV}` }}>
              <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
                <h2 style={{ fontSize:"clamp(20px,3.5vw,32px)", fontWeight:900, color:T.text, margin:"0 0 10px" }}>Ready to join the AI revolution?</h2>
                <p style={{ color:T.muted, fontSize:14, margin:"0 0 26px" }}>Apply for B.Tech AI & Data Science 2024. Limited seats available.</p>
                <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
                  <Btn onClick={()=>setView("admission")} v="em" sz="lg">Apply Now — 2024</Btn>
                  <Btn onClick={()=>setView("login")} v="outV" sz="lg">Student Portal</Btn>
                </div>
              </div>
            </div>
            <AlumniPage />
          </>
        ) : (
          pubPages[section] || (
            <div style={{ padding:"80px 5vw", textAlign:"center" }}>
              <div style={{ fontSize:44 }}>🚧</div>
              <h3 style={{ color:T.text }}>{section}</h3>
              <p style={{ color:T.muted }}>Content loading...</p>
            </div>
          )
        )}
      </div>
      <PubFooter setView={setView} />

      {/* Floating AI Chatbot */}
      {chatOpen&&<Chatbot onClose={()=>setChatOpen(false)} />}
      <button onClick={()=>setChatOpen(!chatOpen)} style={{
        position:"fixed", bottom:20, right:20, width:54, height:54, borderRadius:"50%",
        background:`linear-gradient(135deg,${T.em},${T.vi})`,
        border:"none", cursor:"pointer", fontSize:24, color:"#fff",
        boxShadow:glow(T.em,20), display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all .3s", zIndex:1999, transform:chatOpen?"rotate(180deg)":"none"
      }}>{chatOpen?"✕":"🤖"}</button>
    </div>
  );
}
