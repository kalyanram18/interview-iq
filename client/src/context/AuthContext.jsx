import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { currentUser, login, logout, readStoredUser, signup } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser());
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("interviewiq_token")));

  useEffect(() => {
    if (!localStorage.getItem("interviewiq_token")) return;
    currentUser()
      .then(setUser)
      .catch(() => {
        logout();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function signIn(payload) {
    const data = await login(payload);
    setUser(data.user);
  }

  async function signUp(payload) {
    const data = await signup(payload);
    setUser(data.user);
  }

  function signOut() {
    logout();
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
