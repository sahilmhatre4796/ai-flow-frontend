import { BarChart3, Bot, CreditCard, Database, LayoutDashboard, LogOut, MessageSquare, Play, Settings as SettingsIcon, Sparkles, Target, Users } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { AnalyticsPage } from "./Analytics";
import { BillingPage } from "./Billing";
import { BotBuilderPage } from "./BotBuilder";
import { ConversationsPage } from "./Conversations";
import { DashboardHome } from "./DashboardHome";
import { KnowledgeBasePage } from "./KnowledgeBase";
import { LeadsPage } from "./Leads";
import { MarketplacePage } from "./Marketplace";
import { SettingsPage } from "./Settings";
import { TeamPage } from "./Team";
import { TestBotPage } from "./TestBot";

const NAV_GROUPS = [
  { items: [{ id: "dashboard", icon: LayoutDashboard, label: "Dashboard" }] },
  { label: "Build", items: [{ id: "builder", icon: Bot, label: "Bot Builder" }, { id: "knowledge", icon: Database, label: "Knowledge Base" }] },
  { label: "Engage", items: [{ id: "test", icon: Play, label: "Test bot" }, { id: "conversations", icon: MessageSquare, label: "Conversations" }, { id: "leads", icon: Target, label: "Leads" }, { id: "analytics", icon: BarChart3, label: "Analytics" }] },
  { label: "Grow", items: [{ id: "marketplace", icon: Sparkles, label: "Marketplace" }] },
  { label: "Workspace", items: [{ id: "team", icon: Users, label: "Team" }, { id: "settings", icon: SettingsIcon, label: "Settings" }, { id: "billing", icon: CreditCard, label: "Billing" }] },
];

export function AppShell() {
  const { user, workspaces, activeWorkspace, setActiveWorkspaceId, logout } = useAuth();
  const [active, setActive] = useState("dashboard");
  const [selectedBotId, setSelectedBotId] = useState(null);
  const [botsVersion, setBotsVersion] = useState(0);

  const shared = { workspace: activeWorkspace, selectedBotId, setSelectedBotId, botsVersion, bumpBotsVersion: () => setBotsVersion(v => v + 1), goTo: setActive };
  const initials = (user.full_name || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 232, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
        <div className="flow-line" />
        <div style={{ padding: "20px 16px 8px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--brand-gradient)", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>AI Flow</span>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi}>
              {group.label && <div className="nav-eyebrow">{group.label}</div>}
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button key={item.id} onClick={() => setActive(item.id)} className={`nav-item ${isActive ? "active" : ""}`}>
                    <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />{item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
          <button onClick={logout} className="nav-item" style={{ color: "var(--ink-faint)" }}><LogOut size={16} strokeWidth={1.8} />Log out</button>
        </div>
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: "1px solid var(--border)" }}>
          {workspaces.length > 1 ? (
            <select value={activeWorkspace.id} onChange={e => setActiveWorkspaceId(e.target.value)} className="input" style={{ width: "auto", padding: "7px 12px", fontSize: 14, fontWeight: 600 }}>
              {workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          ) : (
            <span style={{ fontWeight: 600, fontFamily: "var(--font-display)" }}>{activeWorkspace.name}</span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="pill pill-brand" style={{ textTransform: "capitalize" }}>{activeWorkspace.role}</span>
            <span className="text-muted" style={{ fontSize: 13 }}>{user.full_name || user.email}</span>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--brand-gradient)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
          </div>
        </header>
        <div key={active} className="fade-in" style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {active === "dashboard" && <DashboardHome {...shared} />}
          {active === "builder" && <BotBuilderPage {...shared} />}
          {active === "knowledge" && <KnowledgeBasePage {...shared} />}
          {active === "test" && <TestBotPage {...shared} />}
          {active === "conversations" && <ConversationsPage {...shared} />}
          {active === "leads" && <LeadsPage {...shared} />}
          {active === "analytics" && <AnalyticsPage {...shared} />}
          {active === "marketplace" && <MarketplacePage {...shared} />}
          {active === "team" && <TeamPage {...shared} />}
          {active === "settings" && <SettingsPage {...shared} />}
          {active === "billing" && <BillingPage {...shared} />}
        </div>
      </main>
    </div>
  );
}
