import { useState, useEffect } from "react";
import { subscribeAuth, googleSignIn, signOut, saveUser } from "../firebase";

export function useAuth() {
  const [authState,    setAuthState]    = useState("loading");
  const [currentUser,  setCurrentUser]  = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError,   setLoginError]   = useState(null);

  useEffect(() => {
    const unsub = subscribeAuth(user => {
      if (user) { setCurrentUser(user); setAuthState("in"); }
      else      { setCurrentUser(null); setAuthState("out"); }
    });
    return unsub;
  }, []);

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const user = await googleSignIn();
      await saveUser(user);
    } catch (e) {
      if (e.message === "FULL")                      setLoginError("FULL");
      else if (e.code !== "auth/popup-closed-by-user") setLoginError(e.message || "Error al iniciar sesión.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => { await signOut(); };

  return { authState, currentUser, loginLoading, loginError, handleLogin, handleLogout };
}
