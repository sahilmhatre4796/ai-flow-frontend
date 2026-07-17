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
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input className="input" placeholder="e.g. Acme Inc" required value={name} onChange={e => setName(e.target.value)} />
        {error && <div style={{ color: "#fca5a5", fontSize: 13 }}>{error}</div>}
        <button type="submit" disabled={loading} className="btn btn-primary">{loading ? "Creating…" : "Create workspace"}</button>
      </form>
      <button onClick={logout} className="btn btn-ghost" style={{ marginTop: 12, width: "100%" }}>Log out</button>
    </AuthShell>
  );
}
