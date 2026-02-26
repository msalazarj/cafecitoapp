export default function CupIcon({ size = 22, color = "#7C3AED" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 2.5s.5 2 2 2 2-2 2-2M12 2.5s.5 2 2 2 2-2 2-2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4.5 7h11L14 16H6L4.5 7Z" fill={color+"22"} stroke={color} strokeWidth="1.5"/>
      <path d="M15.5 10.5h2a1.5 1.5 0 0 1 0 3h-2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6.5 19.5h7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
