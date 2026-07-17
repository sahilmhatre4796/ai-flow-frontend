import { UserMinus } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchMembers, inviteMember, removeMember } from "../api/workspaces";
import { ErrorBanner, Spinner, errorText } from "./shared";

export function TeamPage({ workspace }) {
  const canManage = workspace.role === "owner" || workspace.role === "admin";
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("agent");
  const [inviting, setInviting] = useState(false);

  async function reload() {
    try { setMembers(await fetchMembers(workspace.id)); }
    catch (err) { setError(errorText(err, "Couldn't load team members")); }
    finally { setLoading(false); }
  }

  useEffect(() => { reload(); }, [workspace.id]);

  async function invite(e) {
    e.preventDefault(); setInviting(true); setError(null);
    try {
      const member = await inviteMember(workspace.id, { email, role });
      setMembers(m => [...m, member]); setEmail("");
    } catch (err) { setError(errorText(err, "Couldn't send this invite")); }
    finally { setInviting(false); }
  }

  async function remove(membershipId) {
    try { await removeMember(workspace.id, membershipId); setMembers(m => m.filter(x => x.id !== membershipId)); }
    catch (err) { setError(errorText(err, "Couldn't remove this member")); }
  }

  if (loading) return <Spinner label="Loading team" />;

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Team</h1>
      <ErrorBanner message={error} />
      {canManage && (
        <form onSubmit={invite} className="card" style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "flex-end" }}>
          <input className="input" style={{ flex: 1 }} type="email" placeholder="teammate@company.com" required value={email} onChange={e => setEmail(e.target.value)} />
          <select className="input" style={{ width: "auto" }} value={role} onChange={e => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="viewer">Viewer</option>
          </select>
          <button type="submit" className="btn btn-primary" disabled={inviting}>{inviting ? "Inviting…" : "Invite"}</button>
        </form>
      )}
      <div className="card" style={{ padding: 8 }}>
        {members.map(m => (
          <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(99,102,241,0.15)", color: "#a5b4fc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {(m.name || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>{m.email}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="text-muted" style={{ fontSize: 12, textTransform: "capitalize" }}>{m.role}</span>
              {m.status === "invited" && <span className="pill pill-processing">Pending</span>}
              {canManage && m.role !== "owner" && <button className="btn btn-danger btn-sm" onClick={() => remove(m.id)}><UserMinus size={13} /></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
