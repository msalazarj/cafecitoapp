import PlayerCard from "./PlayerCard";
import Chip       from "./Chip";
import CupIcon    from "./CupIcon";
import { palette, firstName } from "../constants";

function SelectionView({ friends, selected, payCount, lastPaid, toggleFriend, revealing, onWhosPaying }) {
  const hasEnough = selected.size >= 2;
  return (
    <div>
      <div style={{ marginBottom:22 }}>
        <div style={{
          fontFamily:"'Bebas Neue', sans-serif",
          fontSize:32, letterSpacing:"0.05em", lineHeight:1, color:"#F1F5F9",
        }}>¿Quién fue hoy?</div>
        <div style={{ fontSize:12, color:"#475569", marginTop:4 }}>
          Tocá las cartas para seleccionar (mín. 2)
        </div>
      </div>

      <div style={{
        display:"grid",
        gridTemplateColumns:`repeat(${friends.length},1fr)`,
        gap:12,
      }}>
        {friends.map((u,i) => (
          <PlayerCard key={u.uid} user={u}
            selected={selected.has(u.uid)}
            onClick={() => toggleFriend(u.uid)}
            payCount={payCount[u.uid]||0}
            lastTs={lastPaid[u.uid]}
            animDelay={i*80}
          />
        ))}
      </div>

      <div style={{
        marginTop:16, padding:"11px 14px",
        background:"#0F172A", border:"1px solid #1E293B",
        borderRadius:14,
        display:"flex", alignItems:"center", gap:8, flexWrap:"wrap",
      }}>
        <span style={{ fontSize:10, color:"#475569", letterSpacing:"0.12em", textTransform:"uppercase", flexShrink:0 }}>
          Asistieron:
        </span>
        {friends.filter(u => selected.has(u.uid)).map(u => <Chip key={u.uid} user={u}/>)}
      </div>

      <button
        disabled={!hasEnough || revealing}
        onClick={onWhosPaying}
        style={{
          marginTop:14, width:"100%",
          padding:"16px 24px", borderRadius:16, border:"none",
          background: hasEnough
            ? "linear-gradient(135deg,#4C1D95 0%,#7C3AED 60%,#6D28D9 100%)"
            : "#0F172A",
          color: hasEnough ? "#EDE9FE" : "#334155",
          fontFamily:"'Bebas Neue', sans-serif",
          fontSize:18, letterSpacing:"0.14em",
          cursor: hasEnough ? "pointer" : "not-allowed",
          display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          transition:"all 0.3s",
        }}
      >
        {revealing
          ? <><div className="spinner" style={{ borderColor:"#A78BFA", borderTopColor:"transparent" }}/>CALCULANDO…</>
          : <><CupIcon size={20} color="#EDE9FE"/>¿QUIÉN PAGA HOY?</>
        }
      </button>
    </div>
  );
}

function ResultView({ result, friends, payCount, lastPaid, onConfirm, onReset, saving }) {
  const payerUser = friends.find(u => u.uid === result.payer);
  if (!payerUser) return null;
  const p     = palette(payerUser.slot);
  const count = payCount[payerUser.uid] || 0;

  return (
    <div className="reveal">
      <div style={{
        background:`linear-gradient(155deg,${p.mid}88 0%,#080E1F 70%)`,
        border:`1px solid ${p.hue}55`, borderRadius:28,
        padding:"28px 22px 26px", textAlign:"center",
      }}>
        <div style={{
          fontFamily:"'DM Sans', sans-serif", fontSize:10,
          letterSpacing:"0.22em", textTransform:"uppercase",
          color:p.hue, marginBottom:18,
        }}>☕ La cuenta la paga…</div>

        <div className="floater" style={{ maxWidth:170, margin:"0 auto 18px" }}>
          <PlayerCard user={payerUser} selected payCount={count} lastTs={lastPaid[payerUser.uid]}/>
        </div>

        <div style={{
          fontFamily:"'Bebas Neue', sans-serif",
          fontSize:52, letterSpacing:"0.06em", color:p.light, lineHeight:1,
        }}>{firstName(payerUser.name).toUpperCase()}</div>

        <div style={{ fontSize:13, color:"#64748B", marginTop:4, marginBottom:22 }}>
          {count===0 ? "¡Primera vez que paga! 🎉" : `Pagó ${count} ${count===1?"vez":"veces"} antes`}
        </div>

        <div style={{ display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap", marginBottom:26 }}>
          {result.attendees.map(uid => {
            const u = friends.find(f => f.uid === uid);
            return u ? <Chip key={uid} user={u}/> : null;
          })}
        </div>

        {!result.saved ? (
          <button onClick={onConfirm} disabled={saving} style={{
            padding:"14px 32px", borderRadius:14,
            border:`1.5px solid ${p.hue}`,
            background:`linear-gradient(135deg,${p.mid},${p.hue})`,
            color:p.light,
            fontFamily:"'Bebas Neue', sans-serif",
            fontSize:17, letterSpacing:"0.12em",
            cursor: saving ? "wait" : "pointer",
            display:"inline-flex", alignItems:"center", gap:10, transition:"all 0.3s",
          }}>
            {saving
              ? <><div className="spinner" style={{ borderColor:p.light, borderTopColor:"transparent" }}/>GUARDANDO…</>
              : "✓ CONFIRMAR PAGO"}
          </button>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"10px 18px", borderRadius:12,
              background:`${p.hue}18`, border:`1px solid ${p.hue}44`,
              fontFamily:"'DM Sans', sans-serif", fontSize:13, fontWeight:500, color:p.light,
            }}>✓ ¡Registrado!</div>
            <button onClick={onReset} style={{
              background:"none", border:"none",
              color:"#475569", fontSize:13,
              cursor:"pointer", fontFamily:"'DM Sans', sans-serif",
              textDecoration:"underline",
            }}>Nueva ronda →</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TabHoy({
  friends, history, selected, result, revealing, saving,
  payCount, lastPaid, toggleFriend, handleWhosPaying, handleConfirm, handleReset,
}) {
  if (history === null) {
    return (
      <div style={{ height:280, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, color:"#334155" }}>
        <div className="spinner" style={{ borderTopColor:"#7C3AED", borderColor:"#1E293B" }}/>
        <span style={{ fontSize:12, letterSpacing:"0.1em" }}>CARGANDO…</span>
      </div>
    );
  }

  return !result ? (
    <SelectionView
      friends={friends} selected={selected}
      payCount={payCount} lastPaid={lastPaid}
      toggleFriend={toggleFriend}
      revealing={revealing} onWhosPaying={handleWhosPaying}
    />
  ) : (
    <ResultView
      result={result} friends={friends}
      payCount={payCount} lastPaid={lastPaid}
      onConfirm={handleConfirm} onReset={handleReset} saving={saving}
    />
  );
}
