import { palette, firstName } from "../constants";

export default function Chip({ user }) {
  const p = palette(user.slot);
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:`${p.hue}18`, border:`1px solid ${p.hue}44`,
      borderRadius:100, padding:"3px 10px 3px 3px",
      fontFamily:"'DM Sans', sans-serif", fontSize:12, color:p.light,
    }}>
      {user.photoURL ? (
        <img src={user.photoURL} alt={user.name}
          style={{ width:18, height:18, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}
          onError={e => { e.target.style.display="none"; }}
        />
      ) : (
        <span style={{
          width:18, height:18, borderRadius:"50%", background:p.grad, flexShrink:0,
          display:"inline-flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'Bebas Neue', sans-serif", fontSize:8, color:p.light,
        }}>{user.name.charAt(0).toUpperCase()}</span>
      )}
      {firstName(user.name)}
    </span>
  );
}
