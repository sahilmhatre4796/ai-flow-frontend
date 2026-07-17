import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authApi from "./api/auth";
import { getRefreshToken } from "./api/client";
import * as workspaceApi from "./api/workspaces";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);

  const loadWorkspaces = useCallback(async () => {
    const list = await workspaceApi.fetchMyWorkspaces();
    setWorkspaces(list);
    if (list.length > 0) {
      setActiveWorkspaceId((prev) => prev && list.some((w) => w.id === prev) ? prev : list[0].id);
    } else {
      setActiveWorkspaceId(null);
    }
    return list;
  }, []);

  // On first load, if a refresh token is stashed from a previous session,
  // try to silently restore it rather than forcing a fresh login every time.
  useEffect(() => {
    (async () => {
      if (getRefreshToken()) {
        try {
          const me = await authApi.fetchMe();
          setUser(me);
          await loadWorkspaces();
        } catch {
          setUser(null);
        }
      }
      setBootstrapping(false);
    })();
  }, [loadWorkspaces]);

  const login = useCallback(async (email, password) => {
    await authApi.login({ email, password });
    const me = await authApi.fetchMe();
    setUser(me);
    await loadWorkspaces();
    return me;
  }, [loadWorkspaces]);

  const register = useCallback(async (email, password, fullName) => {
    return authApi.register({ email, password, full_name: fullName });
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setWorkspaces([]);
    setActiveWorkspaceId(null);
  }, []);

  const createWorkspace = useCallback(async (name) => {
    const ws = await workspaceApi.createWorkspace(name);
    await loadWorkspaces();
    setActiveWorkspaceId(ws.id);
    return ws;
  }, [loadWorkspaces]);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || null;

  return (
    <AuthContext.Provider
      value={{
        bootstrapping,
        user,
        workspaces,
        activeWorkspace,
        activeWorkspaceId,
        setActiveWorkspaceId,
        login,
        register,
        logout,
        createWorkspace,
        reloadWorkspaces: loadWorkspaces,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
