import { palette, firstName, fmtDate, timeAgo } from "../constants";

function StatCards({ friends, payCount }) {
  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:`repeat(${friends.length},1fr)`,
      gap:10, marginBottom:22,
    }}>
      {friends.map(u => {
        const p = palette(u.slot);
        const count = payCount[u.uid]||0;
        return (
          <div key={u.uid} style={{
            background:"#0F172A",
            border:`1px solid ${count>0 ? p.hue+"55" : "#1E293B"}`,
            borderRadius:16, padding:"14px 10px", textAlign:"center",
          }}>
            {u.photoURL ? (
              <img src={u.photoURL} alt={u.name} style={{
                width:44, height:44, borderRadius:"50%", objectFit:"cover",
                margin:"0 auto 8px", border:`2px solid ${p.hue}44`, display:"block",
              }} onError={e => { e.target.style.display="none"; }}/>
            ) : (
              <div style={{
                width:44, height:44, borderRadius:"50%", background:p.grad,
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 8px",
                fontFamily:"'Bebas Neue', sans-serif", fontSize:16, color:p.light,
              }}>{u.name.charAt(0).toUpperCase()}</div>
            )}
            <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:34, color:p.light, lineHeight:1 }}>
              {count}
            </div>
            <div style={{
              fontFamily:"'DM Sans', sans-serif", fontSize:9, color:p.hue,
              letterSpacing:"0.14em", textTransform:"uppercase", marginTop:2,
            }}>{firstName(u.name)}</div>
          </div>
        );
      })}
    </div>
  );
}

function ProportionBars({ friends, payCount, total }) {
  if (total === 0) return null;
  return (
    <div style={{
      background:"#0F172A", border:"1px solid #1E293B",
      borderRadius:16, padding:"16px 18px", marginBottom:24,
    }}>
      <div style={{
        fontFamily:"'Bebas Neue', sans-serif", fontSize:11,
        letterSpacing:"0.18em", color:"#334155", marginBottom:14,
      }}>PROPORCIÓN DE PAGOS</div>
      {friends.map(u => {
        const p   = palette(u.slot);
        const pct = Math.round(((payCount[u.uid]||0)/total)*100);
        return (
          <div key={u.uid} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
            <div style={{ width:52, fontSize:12, fontWeight:600, color:p.light, flexShrink:0 }}>
              {firstName(u.name)}
            </div>
            <div style={{ flex:1, height:7, background:"#1E293B", borderRadius:100, overflow:"hidden" }}>
              <div style={{
                width:`${pct}%`, height:"100%",
                background:`linear-gradient(90deg,${p.hue},${p.hue}88)`,
                borderRadius:100, transition:"width 0.8s ease",
              }}/>
            </div>
            <div style={{
              width:30, fontFamily:"'Bebas Neue', sans-serif",
              fontSize:13, color:"#475569", textAlign:"right", flexShrink:0,
            }}>{pct}%</div>
          </div>
        );
      })}
    </div>
  );
}

function Timeline({ history, friends }) {
  if (history.length === 0) {
    return (
      <div style={{ textAlign:"center", padding:"60px 0", color:"#1E293B" }}>
        <div style={{ fontSize:52, marginBottom:12 }}>☕</div>
        <div style={{
          fontFamily:"'Bebas Neue', sans-serif", fontSize:22,
          letterSpacing:"0.08em", color:"#334155", marginBottom:6,
        }}>SIN REGISTROS AÚN</div>
        <div style={{ fontSize:12, color:"#1E293B" }}>
          Registrá el primer pago desde «Hoy»
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        fontFamily:"'Bebas Neue', sans-serif", fontSize:11,
        letterSpacing:"0.18em", color:"#334155", marginBottom:12,
      }}>ÚLTIMOS PAGOS</div>

      {[...history].reverse().map((entry, idx) => {
        const u = friends.find(f => f.uid === entry.payer);
        if (!u) return null;
        const p = palette(u.slot);
        const isLatest = idx === 0;
        const names = (entry.attendees||[])
          .map(uid => friends.find(f=>f.uid===uid)?.name?.split(" ")[0] || uid)
          .join(", ");

        return (
          <div key={entry.id||idx} style={{
            display:"flex", gap:12, paddingBottom:14,
            borderBottom: idx < history.length-1 ? "1px solid #0F172A" : "none",
            marginBottom:14,
          }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              {u.photoURL ? (
                <img src={u.photoURL} alt={u.name} style={{
                  width:42, height:42, borderRadius:13, objectFit:"cover", flexShrink:0,
                  border: isLatest ? `1.5px solid ${p.hue}77` : "1.5px solid transparent",
                }}/>
              ) : (
                <div style={{
                  width:42, height:42, borderRadius:13, background:p.grad,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  fontFamily:"'Bebas Neue', sans-serif", fontSize:14, color:p.light,
                  border: isLatest ? `1.5px solid ${p.hue}77` : "1.5px solid transparent",
                }}>{u.name.charAt(0).toUpperCase()}</div>
              )}
              {idx < history.length-1 && (
                <div style={{
                  width:1, flex:1, minHeight:10, marginTop:5,
                  background:`linear-gradient(to bottom,${p.hue}44,transparent)`,
                }}/>
              )}
            </div>

            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                <span style={{
                  fontFamily:"'Bebas Neue', sans-serif",
                  fontSize:18, letterSpacing:"0.06em", color:p.light,
                }}>{firstName(u.name).toUpperCase()}</span>
                {isLatest && (
                  <span style={{
                    fontSize:8, letterSpacing:"0.14em",
                    background:`${p.hue}22`, color:p.hue,
                    border:`1px solid ${p.hue}55`,
                    padding:"2px 7px", borderRadius:100, textTransform:"uppercase",
                  }}>ÚLTIMO</span>
                )}
              </div>
              <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>Con {names}</div>
              <div style={{ fontSize:10, color:"#1E293B", marginTop:3 }}>{fmtDate(entry.timestamp)}</div>
            </div>

            <div style={{
              fontFamily:"'Bebas Neue', sans-serif", fontSize:16,
              color:"#334155", flexShrink:0, letterSpacing:"0.05em", paddingTop:2,
            }}>{timeAgo(entry.timestamp)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function TabHistorial({ friends, history, payCount }) {
  if (history === null) {
    return (
      <div style={{ height:280, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, color:"#334155" }}>
        <div className="spinner" style={{ borderTopColor:"#7C3AED", borderColor:"#1E293B" }}/>
        <span style={{ fontSize:12, letterSpacing:"0.1em" }}>CARGANDO…</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        fontFamily:"'Bebas Neue', sans-serif",
        fontSize:32, letterSpacing:"0.05em", color:"#F1F5F9", marginBottom:20,
      }}>ESTADÍSTICAS</div>
      <StatCards friends={friends} payCount={payCount}/>
      <ProportionBars friends={friends} payCount={payCount} total={history.length}/>
      <Timeline history={history} friends={friends}/>
    </div>
  );
}
