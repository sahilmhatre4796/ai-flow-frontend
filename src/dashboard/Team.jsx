import { motion } from "framer-motion";
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>Team</motion.h1>
      <ErrorBanner message={error} />
      {canManage && (
        <motion.form
          onSubmit={invite}
          className="card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "flex-end" }}
        >
          <input className="input" style={{ flex: 1 }} type="email" placeholder="teammate@company.com" required value={email} onChange={e => setEmail(e.target.value)} />
          <select className="input" style={{ width: "auto" }} value={role} onChange={e => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="viewer">Viewer</option>
          </select>
          <motion.button type="submit" className="btn btn-primary" disabled={inviting} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>{inviting ? "Inviting..." : "Invite"}</motion.button>
        </motion.form>
      )}
      <div className="card" style={{ padding: 8 }}>
        {members.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--border)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(99,102,241,0.12)",
                color: "#a5b4fc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                flexShrink: 0,
              }}>
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
              {canManage && m.role !== "owner" && (
                <motion.button className="btn btn-danger btn-sm" onClick={() => remove(m.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <UserMinus size={13} />
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
