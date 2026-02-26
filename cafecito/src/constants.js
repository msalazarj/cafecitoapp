export const PALETTES = [
  { hue:"#7C3AED", light:"#EDE9FE", mid:"#4C1D95", grad:"linear-gradient(160deg,#2E1065 0%,#4C1D95 100%)" },
  { hue:"#0EA5E9", light:"#E0F2FE", mid:"#075985", grad:"linear-gradient(160deg,#0C1A2E 0%,#0369A1 100%)" },
  { hue:"#F59E0B", light:"#FEF3C7", mid:"#92400E", grad:"linear-gradient(160deg,#1C0A00 0%,#B45309 100%)" },
];

export const MAX_FRIENDS = 3;

export function palette(slot) { return PALETTES[slot % PALETTES.length]; }

export function determinePayer(attendeeIds, history) {
  const lastPaid = {};
  attendeeIds.forEach(id => (lastPaid[id] = 0));
  [...history].reverse().forEach(e => {
    if (attendeeIds.includes(e.payer) && !lastPaid[e.payer])
      lastPaid[e.payer] = e.timestamp;
  });
  return attendeeIds.reduce((a, b) => lastPaid[a] <= lastPaid[b] ? a : b);
}

export function levelLabel(n) {
  if (n === 0) return "ROOKIE";
  if (n < 3)   return "PLAYER";
  if (n < 7)   return "ALL-STAR";
  return "MVP ★";
}

export function fmtDate(ts) {
  return new Date(ts).toLocaleDateString("es-AR", {
    weekday:"short", day:"numeric", month:"short", hour:"2-digit", minute:"2-digit",
  });
}

export function timeAgo(ts) {
  const d = Date.now() - ts;
  if (d < 3_600_000)  return `${Math.floor(d / 60_000)}m`;
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)}h`;
  return `${Math.floor(d / 86_400_000)}d`;
}

export function firstName(fullName = "") { return fullName.split(" ")[0]; }
