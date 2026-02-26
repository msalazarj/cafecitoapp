import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, collection, doc, setDoc,
  getDocs, addDoc, query, orderBy,
} from "firebase/firestore";
import {
  getAuth, onAuthStateChanged,
  GoogleAuthProvider, signInWithPopup, signOut as fbSignOutFn,
} from "firebase/auth";
import { MAX_FRIENDS } from "./constants";

// ════════════════════════════════════════════════════════════════════
//  🔥 Firebase — Kafecito App
// ════════════════════════════════════════════════════════════════════
const FIREBASE_CONFIG = {
  apiKey:            "",
  authDomain:        "",
  projectId:         "",
  storageBucket:     "",
  messagingSenderId: "",
  appId:             "",
};

export const COL_PAYMENTS = "cafe_pagos";
export const COL_USERS    = "cafe_users";

// ── Singleton ────────────────────────────────────────────────────────
const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
export const db   = getFirestore(app);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ── Auth ─────────────────────────────────────────────────────────────
export async function googleSignIn() {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function signOut() {
  await fbSignOutFn(auth);
}

export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Usuarios (squad) ─────────────────────────────────────────────────
export async function saveUser(user) {
  const snap = await getDocs(collection(db, COL_USERS));
  const existing = snap.docs.find(d => d.id === user.uid);
  if (!existing) {
    if (snap.size >= MAX_FRIENDS) throw new Error("FULL");
    await setDoc(doc(db, COL_USERS, user.uid), {
      uid:      user.uid,
      name:     user.displayName,
      photoURL: user.photoURL,
      joinedAt: Date.now(),
      slot:     snap.size,
    });
  }
}

export async function loadUsers() {
  const snap = await getDocs(collection(db, COL_USERS));
  return snap.docs.map(d => d.data()).sort((a, b) => a.joinedAt - b.joinedAt);
}

// ── Historial de pagos ───────────────────────────────────────────────
export async function fetchHistory() {
  const snap = await getDocs(
    query(collection(db, COL_PAYMENTS), orderBy("timestamp", "asc"))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function pushEntry(entry) {
  const ref = await addDoc(collection(db, COL_PAYMENTS), entry);
  return { id: ref.id, ...entry };
}
