import { useState } from "react";
import { useAuth }       from "./hooks/useAuth";
import { useSquad }      from "./hooks/useSquad";
import LoginScreen       from "./components/LoginScreen";
import TabHoy            from "./components/TabHoy";
import TabHistorial      from "./components/TabHistorial";
import CupIcon           from "./components/CupIcon";

export default function App() {
  const {
    authState, currentUser,
    loginLoading, loginError,
    handleLogin, handleLogout,
  } = useAuth();

  const squad = useSquad(authState === "in");
  const [tab, setTab] = useState("hoy");

  const onLogout = async () => { squad.reset(); await handleLogout(); };

  /* ── Loading inicial ── */
  if (authState === "loading") {
    return (
      <div style={{
        minHeight:"100dvh", background:"#030712",
        display:"flex", alignItems:"center", justifyContent:"center",
        flexDirection:"column", gap:14, color:"#334155",
      }}>
        <div className="spinner" style={{ borderColor:"#1E293B", borderTopColor:"#7C3AED" }}/>
        <span style={{ fontSize:12, letterSpacing:"0.1em" }}>INICIANDO…</span>
      </div>
    );
  }

  /* ── Login ── */
  if (authState === "out") {
    return <LoginScreen onLogin={handleLogin} loading={loginLoading} error={loginError}/>;
  }

  /* ── App principal ── */
  return (
    <div style={{
      minHeight:"100dvh", background:"#030712",
      display:"flex", flexDirection:"column",
      maxWidth:480, margin:"0 auto", position:"relative",
    }}>
      {/* Grid ambiental */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:`
          linear-gradient(#1E293B18 1px,transparent 1px),
          linear-gradient(90deg,#1E293B18 1px,transparent 1px)`,
        backgroundSize:"40px 40px",
      }}/>

      {/* Banner error Firebase */}
      {squad.fbError && (
        <div style={{
          padding:"9px 16px", background:"#7F1D1D",
          color:"#FCA5A5", fontSize:11, zIndex:100,
        }}>
          ⚠️ Error al conectar con Firebase. Verificá las credenciales.
        </div>
      )}

      {/* ── Header ── */}
      <div style={{
        padding: squad.fbError ? "52px 20px 14px" : "20px 20px 14px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"relative", zIndex:2, borderBottom:"1px solid #0F172A",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:36, height:36, borderRadius:11,
            background:"linear-gradient(135deg,#4C1D95,#7C3AED)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <CupIcon size={18} color="#EDE9FE"/>
          </div>
          <div>
            <div style={{
              fontFamily:"'Bebas Neue', sans-serif",
              fontSize:19, letterSpacing:"0.12em", color:"#F1F5F9", lineHeight:1,
            }}>KAFECITO</div>
            <div style={{ fontSize:9, letterSpacing:"0.2em", color:"#334155", textTransform:"uppercase" }}>
              ¿A quién le toca?
            </div>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Tabs */}
          <div style={{
            display:"flex", background:"#0F172A",
            border:"1px solid #1E293B", borderRadius:12, padding:3, gap:2,
          }}>
            {[["hoy","Hoy"],["historial","Stats"]].map(([t,label]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding:"5px 12px", borderRadius:9, border:"none",
                background: tab===t ? "linear-gradient(135deg,#4C1D95,#7C3AED)" : "transparent",
                color: tab===t ? "#EDE9FE" : "#475569",
                fontFamily:"'DM Sans', sans-serif", fontSize:11, fontWeight:600,
                letterSpacing:"0.08em", textTransform:"uppercase",
                cursor:"pointer", transition:"all 0.2s",
              }}>{label}</button>
            ))}
          </div>

          {/* Avatar → logout */}
          <button onClick={onLogout} title="Cerrar sesión" style={{
            background:"none", border:"none", cursor:"pointer", padding:0,
            borderRadius:"50%", overflow:"hidden", width:32, height:32, flexShrink:0,
          }}>
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="" style={{ width:32, height:32, objectFit:"cover" }}/>
            ) : (
              <div style={{
                width:32, height:32, borderRadius:"50%", background:"#1E293B",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#475569", fontSize:14,
              }}>{currentUser?.displayName?.charAt(0)||"?"}</div>
            )}
          </button>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 120px", position:"relative", zIndex:1 }}>
        {tab === "hoy" ? (
          <TabHoy
            friends={squad.friends}
            history={squad.history}
            selected={squad.selected}
            result={squad.result}
            revealing={squad.revealing}
            saving={squad.saving}
            payCount={squad.payCount}
            lastPaid={squad.lastPaid}
            toggleFriend={squad.toggleFriend}
            handleWhosPaying={squad.handleWhosPaying}
            handleConfirm={squad.handleConfirm}
            handleReset={squad.handleReset}
          />
        ) : (
          <TabHistorial
            friends={squad.friends}
            history={squad.history}
            payCount={squad.payCount}
          />
        )}
      </div>

      {/* Fade inferior */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:480, height:90,
        background:"linear-gradient(to top,#030712 50%,transparent)",
        pointerEvents:"none", zIndex:5,
      }}/>
    </div>
  );
}
