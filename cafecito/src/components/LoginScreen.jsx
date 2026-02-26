import { PALETTES, MAX_FRIENDS } from "../constants";
import CupIcon    from "./CupIcon";
import GoogleLogo from "./GoogleLogo";

export default function LoginScreen({ onLogin, loading, error }) {
  return (
    <div style={{
      minHeight:"100dvh", background:"#030712",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"32px 24px", position:"relative",
    }}>
      {/* Grid ambiental */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none",
        backgroundImage:`
          linear-gradient(#1E293B18 1px,transparent 1px),
          linear-gradient(90deg,#1E293B18 1px,transparent 1px)`,
        backgroundSize:"40px 40px",
      }}/>

      <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:320, width:"100%" }}>
        {/* Logo */}
        <div style={{
          width:64, height:64, borderRadius:20,
          background:"linear-gradient(135deg,#4C1D95,#7C3AED)",
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 28px",
        }}>
          <CupIcon size={32} color="#EDE9FE"/>
        </div>

        <div style={{
          fontFamily:"'Bebas Neue', sans-serif",
          fontSize:38, letterSpacing:"0.08em",
          color:"#F1F5F9", lineHeight:1, marginBottom:8,
        }}>KAFECITO</div>

        <div style={{
          fontSize:13, color:"#475569",
          letterSpacing:"0.06em", marginBottom:48, lineHeight:1.6,
        }}>
          Iniciá sesión con Google<br/>para unirte al squad del café
        </div>

        {/* Preview cartas apiladas */}
        <div style={{ position:"relative", height:120, marginBottom:48 }}>
          {PALETTES.map((p,i) => (
            <div key={i} style={{
              position:"absolute", left:"50%",
              transform:`translateX(calc(-50% + ${(i-1)*22}px)) rotate(${(i-1)*6}deg)`,
              width:72, height:100, borderRadius:10,
              background:p.grad, border:`1px solid ${p.hue}44`,
              boxShadow:"0 4px 16px rgba(0,0,0,0.4)",
              zIndex: i===1 ? 3 : i===0 ? 1 : 2,
            }}>
              <div style={{
                position:"absolute", bottom:8, left:0, right:0, textAlign:"center",
                fontFamily:"'Bebas Neue', sans-serif", fontSize:10,
                letterSpacing:"0.15em", color:p.light+"88",
              }}>#{String(i+1).padStart(2,"0")}</div>
            </div>
          ))}
        </div>

        {/* Botón Google */}
        <button
          onClick={onLogin} disabled={loading}
          style={{
            width:"100%", padding:"15px 24px", borderRadius:14,
            border:"1px solid #1E293B", background:"#0F172A",
            color: loading ? "#334155" : "#F1F5F9",
            fontFamily:"'DM Sans', sans-serif", fontSize:15, fontWeight:600,
            cursor: loading ? "wait" : "pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:12,
            transition:"all 0.2s",
          }}
        >
          {loading ? (
            <><div className="spinner" style={{ borderColor:"#475569", borderTopColor:"transparent" }}/> Conectando…</>
          ) : (
            <><GoogleLogo size={20}/> Continuar con Google</>
          )}
        </button>

        {error === "FULL" && (
          <div style={{
            marginTop:16, padding:"12px 16px",
            background:"#7F1D1D22", border:"1px solid #7F1D1D55",
            borderRadius:12, fontSize:13, color:"#FCA5A5", lineHeight:1.5,
          }}>
            El squad ya tiene {MAX_FRIENDS} miembros registrados.<br/>
            Tu cuenta no está en la lista.
          </div>
        )}

        {error && error !== "FULL" && (
          <div style={{
            marginTop:16, padding:"12px 16px",
            background:"#7F1D1D22", border:"1px solid #7F1D1D55",
            borderRadius:12, fontSize:12, color:"#FCA5A5",
          }}>⚠️ {error}</div>
        )}

        <div style={{ marginTop:24, fontSize:11, color:"#1E293B", letterSpacing:"0.06em" }}>
          Solo los {MAX_FRIENDS} primeros en registrarse formarán el squad
        </div>
      </div>
    </div>
  );
}
