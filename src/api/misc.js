import { API_BASE_URL, request } from "./client";

// ── Leads ──
export async function fetchLeads(workspaceId, botId = null) {
  const query = botId ? `?bot_id=${botId}` : "";
  return request(`/workspaces/${workspaceId}/leads${query}`);
}

export async function createLead(workspaceId, body) {
  return request(`/workspaces/${workspaceId}/leads`, { method: "POST", body });
}

/** Returns a same-origin-auth-friendly URL; caller opens it after attaching
 * the access token, since a plain <a href> can't carry an Authorization header. */
export function leadsExportUrl(workspaceId) {
  return `${API_BASE_URL}/workspaces/${workspaceId}/leads/export.csv`;
}

export async function downloadLeadsCsv(workspaceId) {
  const response = await request(`/workspaces/${workspaceId}/leads/export.csv`, { raw: true });
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "leads.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// ── Analytics ──
export async function fetchAnalytics(workspaceId) {
  return request(`/workspaces/${workspaceId}/analytics`);
}

// ── Marketplace ──
export async function fetchTemplates() {
  return request("/templates");
}

export async function installTemplate(workspaceId, templateId) {
  return request(`/workspaces/${workspaceId}/templates/${templateId}/install`, { method: "POST" });
}

// ── Billing ──
export async function fetchUsage(workspaceId) {
  return request(`/workspaces/${workspaceId}/billing/usage`);
}

export async function createCheckoutSession(workspaceId, plan) {
  return request(`/workspaces/${workspaceId}/billing/checkout-session`, { method: "POST", body: { plan } });
}
