import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken, backendEnabled } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "checking" while we confirm a saved login with the server
  const [status, setStatus] = useState(() => (backendEnabled && getToken() ? "checking" : "ready"));

  useEffect(() => {
    if (status !== "checking") return;
    api("/api/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setStatus("ready"));
  }, [status]);

  const finish = useCallback((data) => {
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === "admin",
      checking: status === "checking",
      login: (email, password) => api("/api/auth/login", { method: "POST", body: { email, password }, auth: false }).then(finish),
      register: (fields) => api("/api/auth/register", { method: "POST", body: fields, auth: false }).then(finish),
      resetPassword: (token, password) =>
        api("/api/auth/reset-password", { method: "POST", body: { token, password }, auth: false }).then(finish),
      logout: () => {
        setToken(null);
        setUser(null);
      },
    }),
    [user, status, finish]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
