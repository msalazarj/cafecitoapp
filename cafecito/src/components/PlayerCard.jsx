import { useState } from "react";
import { palette, levelLabel, timeAgo, firstName } from "../constants";

export default function PlayerCard({ user, selected, onClick, payCount=0, lastTs=null, animDelay=0 }) {
  const [hov, setHov] = useState(false);
  const p = palette(user.slot);
  const isInteractive = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        animationDelay:`${animDelay}ms`,
        animation:"cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        cursor: isInteractive ? "pointer" : "default",
        position:"relative", width:"100%", aspectRatio:"5/7", borderRadius:18,
        transform: selected
          ? "translateY(-10px) rotate(-1deg) scale(1.04)"
          : hov && isInteractive ? "translateY(-4px) scale(1.02)" : "none",
        transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s",
        boxShadow: selected
          ? `0 16px 40px rgba(0,0,0,0.5), 0 0 0 2px ${p.hue}`
          : hov && isInteractive ? "0 10px 30px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.4)",
        userSelect:"none", WebkitTapHighlightColor:"transparent",
      }}
    >
      <div style={{
        borderRadius:18, overflow:"hidden", height:"100%",
        background:"#080E1F", border:`1px solid ${selected ? p.hue+"77" : "#1E293B"}`,
      }}>
        {/* Zona foto 60% */}
        <div style={{ height:"60%", position:"relative", background:p.grad, overflow:"hidden" }}>
          {/* Textura cuadrícula */}
          <div style={{
            position:"absolute", inset:0,
            backgroundImage:`
              repeating-linear-gradient(0deg,transparent,transparent 18px,${p.hue}12 18px,${p.hue}12 19px),
              repeating-linear-gradient(90deg,transparent,transparent 18px,${p.hue}12 18px,${p.hue}12 19px)`,
          }}/>

          {/* Número */}
          <div style={{
            position:"absolute", top:9, left:11,
            fontFamily:"'Bebas Neue', sans-serif", fontSize:10,
            letterSpacing:"0.18em", color:p.light+"88",
          }}>#{String(user.slot+1).padStart(2,"0")}</div>

          {/* Badge nivel */}
          <div style={{
            position:"absolute", top:9, right:10,
            background:"#00000055", border:`1px solid ${p.hue}55`,
            borderRadius:6, padding:"2px 6px",
            fontFamily:"'Bebas Neue', sans-serif", fontSize:8,
            letterSpacing:"0.16em", color:p.light, backdropFilter:"blur(4px)",
          }}>{levelLabel(payCount)}</div>

          {/* Foto */}
          <div style={{
            position:"absolute", inset:0,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name}
                style={{
                  width:"72%", aspectRatio:"1", borderRadius:"50%", objectFit:"cover",
                  border: selected ? `2.5px solid ${p.hue}` : `2px solid ${p.hue}44`,
                  transition:"border 0.3s",
                }}
              />
            ) : (
              <div style={{
                width:"70%", aspectRatio:"1", borderRadius:"50%",
                background:"#0F172A", border:`2px solid ${p.hue}44`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Bebas Neue', sans-serif",
                fontSize:"clamp(24px,8vw,40px)", color:p.light,
              }}>{user.name.charAt(0).toUpperCase()}</div>
            )}
          </div>

          {/* Fade */}
          <div style={{
            position:"absolute", bottom:0, left:0, right:0, height:"40%",
            background:"linear-gradient(to bottom,transparent,#080E1F)",
          }}/>
        </div>

        {/* Zona stats 40% */}
        <div style={{
          height:"40%", padding:"9px 11px 10px", background:"#080E1F",
          display:"flex", flexDirection:"column", justifyContent:"space-between",
        }}>
          <div>
            <div style={{
              fontFamily:"'Bebas Neue', sans-serif",
              fontSize:"clamp(14px,4vw,19px)",
              letterSpacing:"0.08em", color:p.light, lineHeight:1,
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
            }}>{firstName(user.name).toUpperCase()}</div>
            <div style={{
              fontFamily:"'DM Sans', sans-serif", fontSize:8,
              letterSpacing:"0.16em", color:p.hue+"aa", textTransform:"uppercase", marginTop:1,
            }}>CAFÉ SQUAD · 2025</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginTop:4 }}>
            {[
              { val:String(payCount),               label:"PAGOS"  },
              { val:lastTs ? timeAgo(lastTs) : "—", label:"ÚLTIMO" },
            ].map(({val,label}) => (
              <div key={label} style={{
                background:`${p.hue}14`, border:`1px solid ${p.hue}2A`,
                borderRadius:7, padding:"5px 7px",
              }}>
                <div style={{
                  fontFamily:"'Bebas Neue', sans-serif",
                  fontSize:"clamp(15px,4vw,19px)", color:p.light, lineHeight:1,
                }}>{val}</div>
                <div style={{
                  fontFamily:"'DM Sans', sans-serif", fontSize:7,
                  letterSpacing:"0.14em", color:p.hue, textTransform:"uppercase",
                }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ height:3, borderRadius:100, background:"#1E293B", overflow:"hidden", marginTop:5 }}>
            <div style={{
              height:"100%", width:`${Math.min(100, payCount*14)}%`,
              background:`linear-gradient(90deg,${p.hue},${p.hue}99)`,
              borderRadius:100, transition:"width 0.9s ease",
            }}/>
          </div>
        </div>
      </div>

      {selected && (
        <div style={{
          position:"absolute", top:-8, right:-8,
          width:26, height:26, borderRadius:"50%",
          background:p.hue,
          display:"flex", alignItems:"center", justifyContent:"center",
          animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5L5 9.5L11 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}
