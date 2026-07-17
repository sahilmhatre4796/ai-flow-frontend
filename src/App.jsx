import { useState } from "react";
import { useAuth } from "./AuthContext";
import { AppShell } from "./dashboard/AppShell";
import { LoginPage, RegisterPage } from "./pages/Auth";
import { CreateWorkspacePage } from "./pages/CreateWorkspace";

export default function App() {
  const { bootstrapping, user, workspaces, activeWorkspace } = useAuth();
  const [authView, setAuthView] = useState("login");

  if (bootstrapping) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--brand-gradient)", opacity: 0.6 }} />
      </div>
    );
  }

  if (!user) {
    return authView === "login" ? (
      <LoginPage onSwitchToRegister={() => setAuthView("register")} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthView("login")} />
    );
  }

  if (workspaces.length === 0 || !activeWorkspace) return <CreateWorkspacePage />;

  return <AppShell />;
}
