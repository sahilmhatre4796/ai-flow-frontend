import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppShell } from "./dashboard/AppShell";
import { LoginPage, RegisterPage } from "./pages/Auth";
import { CreateWorkspacePage } from "./pages/CreateWorkspace";

export default function App() {
  const { bootstrapping, user, workspaces, activeWorkspace } = useAuth();
  const [authView, setAuthView] = useState("login");

  if (bootstrapping) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--brand-gradient)",
            boxShadow: "0 0 30px rgba(99,102,241,0.3)",
          }}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            {authView === "login" ? (
              <LoginPage onSwitchToRegister={() => setAuthView("register")} />
            ) : (
              <RegisterPage onSwitchToLogin={() => setAuthView("login")} />
            )}
          </motion.div>
        ) : workspaces.length === 0 || !activeWorkspace ? (
          <motion.div
            key="create-workspace"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <CreateWorkspacePage />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AppShell />
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
