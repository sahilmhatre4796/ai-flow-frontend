import { motion } from "framer-motion";
import { useState } from "react";
import { ApiError } from "../api/client";
import { useAuth } from "../AuthContext";
import { AuthShell } from "./AuthShell";

export function CreateWorkspacePage() {
  const { createWorkspace, logout } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try { await createWorkspace(name); }
    catch (err) { setError(err instanceof ApiError ? err.detail : "Couldn't create your workspace."); }
    finally { setLoading(false); }
  }

  return (
    <AuthShell title="Create your workspace" subtitle="Holds your bots, knowledge bases, conversations, and team. You can add more later.">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <motion.input
          className="input"
          placeholder="e.g. Acme Inc"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        />
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: "#fca5a5", fontSize: 13, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px" }}
          >
            {error}
          </motion.div>
        )}
        <motion.button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: "100%", height: 44 }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Creating..." : "Create workspace"}
        </motion.button>
      </form>
      <motion.button
        onClick={logout}
        className="btn btn-ghost"
        style={{ marginTop: 12, width: "100%" }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        Log out
      </motion.button>
    </AuthShell>
  );
}
