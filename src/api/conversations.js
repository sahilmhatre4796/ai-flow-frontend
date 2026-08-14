import { request } from "./client";

export async function fetchConversations(workspaceId, botId = null) {
  const query = botId ? `?bot_id=${botId}` : "";
  return request(`/workspaces/${workspaceId}/conversations${query}`);
}

export async function fetchConversation(workspaceId, conversationId) {
  return request(`/workspaces/${workspaceId}/conversations/${conversationId}`);
}

export async function updateConversation(workspaceId, conversationId, patch) {
  return request(`/workspaces/${workspaceId}/conversations/${conversationId}`, { method: "PATCH", body: patch });
}

/** Sandbox "Test bot" message — same RAG pipeline as the public widget, just authenticated. */
export async function sendSandboxMessage(workspaceId, botId, text, conversationId = null) {
  const query = conversationId ? `?conversation_id=${conversationId}` : "";
  return request(`/workspaces/${workspaceId}/bots/${botId}/sandbox/messages${query}`, {
    method: "POST",
    body: { text },
  });
}

/** Agent sends a message in a live conversation (agent takeover). */
export async function sendAgentMessage(workspaceId, conversationId, text) {
  return request(`/workspaces/${workspaceId}/conversations/${conversationId}/messages`, {
    method: "POST",
    body: { text },
  });
}
