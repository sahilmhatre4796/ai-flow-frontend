import { motion, AnimatePresence } from "framer-motion";
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

const pageComponents = {
  dashboard: DashboardHome,
  builder: BotBuilderPage,
  knowledge: KnowledgeBasePage,
  test: TestBotPage,
  conversations: ConversationsPage,
  leads: LeadsPage,
  analytics: AnalyticsPage,
  marketplace: MarketplacePage,
  team: TeamPage,
  settings: SettingsPage,
  billing: BillingPage,
};

export function AppShell() {
  const { user, workspaces, activeWorkspace, setActiveWorkspaceId, logout } = useAuth();
  const [active, setActive] = useState("dashboard");
  const [selectedBotId, setSelectedBotId] = useState(null);
  const [botsVersion, setBotsVersion] = useState(0);

  const shared = { workspace: activeWorkspace, selectedBotId, setSelectedBotId, botsVersion, bumpBotsVersion: () => setBotsVersion(v => v + 1), goTo: setActive };
  const initials = (user.full_name || user.email || "?").trim().charAt(0).toUpperCase();
  const ActivePage = pageComponents[active];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -240, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 240,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          position: "relative",
          zIndex: 20,
        }}
      >
        <div className="flow-line" />
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ padding: "22px 18px 12px", display: "flex", alignItems: "center", gap: 10 }}
        >
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--brand-gradient)",
              flexShrink: 0,
              boxShadow: "0 0 12px rgba(99,102,241,0.25)",
            }}
          />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>
            AI Flow
          </span>
        </motion.div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_GROUPS.map((group, gi) => (
            <motion.div
              key={gi}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + gi * 0.05 }}
            >
              {group.label && <div className="nav-eyebrow">{group.label}</div>}
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`nav-item ${isActive ? "active" : ""}`}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ marginBottom: 2 }}
                  >
                    <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 6,
                          bottom: 6,
                          width: 3,
                          borderRadius: "0 3px 3px 0",
                          background: "var(--brand-gradient)",
                          boxShadow: "0 0 8px rgba(99,102,241,0.4)",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ padding: 12, borderTop: "1px solid var(--border)" }}
        >
          <motion.button
            onClick={logout}
            className="nav-item"
            style={{ color: "var(--ink-faint)" }}
            whileHover={{ x: 3, color: "var(--status-error)" }}
          >
            <LogOut size={16} strokeWidth={1.8} />
            Log out
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 32px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(6,6,14,0.8)",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          {workspaces.length > 1 ? (
            <select
              value={activeWorkspace.id}
              onChange={e => setActiveWorkspaceId(e.target.value)}
              className="input"
              style={{ width: "auto", padding: "8px 14px", fontSize: 14, fontWeight: 600 }}
            >
              {workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          ) : (
            <span style={{ fontWeight: 700, fontFamily: "var(--font-display)", fontSize: 16 }}>
              {activeWorkspace.name}
            </span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="pill pill-brand" style={{ textTransform: "capitalize" }}>{activeWorkspace.role}</span>
            <span className="text-muted" style={{ fontSize: 13 }}>{user.full_name || user.email}</span>
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--brand-gradient)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
                boxShadow: "0 0 16px rgba(99,102,241,0.2)",
              }}
            >
              {initials}
            </motion.div>
          </div>
        </motion.header>

        <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {ActivePage && <ActivePage {...shared} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
