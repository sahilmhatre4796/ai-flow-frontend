import { request } from "./client";

export async function fetchBots(workspaceId) {
  return request(`/workspaces/${workspaceId}/bots`);
}

export async function createBot(workspaceId, { name, persona, chat_provider, chat_model }) {
  return request(`/workspaces/${workspaceId}/bots`, {
    method: "POST",
    body: { name, persona, chat_provider, chat_model },
  });
}

export async function updateBot(workspaceId, botId, patch) {
  return request(`/workspaces/${workspaceId}/bots/${botId}`, { method: "PATCH", body: patch });
}

export async function rotateBotKey(workspaceId, botId) {
  return request(`/workspaces/${workspaceId}/bots/${botId}/rotate-key`, { method: "POST" });
}

export async function deleteBot(workspaceId, botId) {
  return request(`/workspaces/${workspaceId}/bots/${botId}`, { method: "DELETE" });
}
