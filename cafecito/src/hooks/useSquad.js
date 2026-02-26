import { useState, useEffect, useCallback } from "react";
import { loadUsers, fetchHistory, pushEntry } from "../firebase";
import { determinePayer } from "../constants";

export function useSquad(active) {
  const [friends,   setFriends]   = useState([]);
  const [history,   setHistory]   = useState(null);
  const [selected,  setSelected]  = useState(new Set());
  const [result,    setResult]    = useState(null);
  const [revealing, setRevealing] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [fbError,   setFbError]   = useState(false);

  useEffect(() => {
    if (!active) return;
    Promise.all([loadUsers(), fetchHistory()])
      .then(([users, hist]) => {
        setFriends(users);
        setHistory(hist);
        setSelected(new Set(users.map(u => u.uid)));
      })
      .catch(() => { setHistory([]); setFbError(true); });
  }, [active]);

  const payCount = friends.reduce((acc, u) => {
    acc[u.uid] = (history || []).filter(e => e.payer === u.uid).length;
    return acc;
  }, {});

  const lastPaid = friends.reduce((acc, u) => {
    const entries = (history || []).filter(e => e.payer === u.uid);
    acc[u.uid] = entries.length ? entries[entries.length - 1].timestamp : null;
    return acc;
  }, {});

  const toggleFriend = useCallback(uid => {
    if (result) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(uid)) { if (next.size <= 2) return prev; next.delete(uid); }
      else next.add(uid);
      return next;
    });
  }, [result]);

  const handleWhosPaying = useCallback(() => {
    if (!history || selected.size < 2 || revealing) return;
    setRevealing(true);
    setTimeout(() => {
      const attendees = [...selected];
      setResult({ payer: determinePayer(attendees, history), attendees, saved: false });
      setRevealing(false);
    }, 700);
  }, [history, selected, revealing]);

  const handleConfirm = useCallback(async () => {
    if (!result || result.saved || saving) return;
    setSaving(true);
    const entry = { payer: result.payer, attendees: result.attendees, timestamp: Date.now() };
    try {
      const saved = await pushEntry(entry);
      setHistory(h => [...h, saved]);
      setResult(r => ({ ...r, saved: true }));
    } catch { setFbError(true); }
    finally  { setSaving(false); }
  }, [result, saving]);

  const handleReset = useCallback(() => {
    setResult(null);
    setSelected(new Set(friends.map(u => u.uid)));
  }, [friends]);

  const reset = useCallback(() => {
    setFriends([]); setHistory(null);
    setSelected(new Set()); setResult(null);
  }, []);

  return {
    friends, history, selected, result, revealing, saving, fbError,
    payCount, lastPaid,
    toggleFriend, handleWhosPaying, handleConfirm, handleReset, reset,
  };
}
