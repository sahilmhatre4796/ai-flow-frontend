import { request } from "./client";

const base = (workspaceId, botId) => `/workspaces/${workspaceId}/bots/${botId}/documents`;

export async function fetchDocuments(workspaceId, botId) {
  return request(base(workspaceId, botId));
}

export async function uploadDocument(workspaceId, botId, file) {
  const form = new FormData();
  form.append("file", file);
  return request(`${base(workspaceId, botId)}/upload`, { method: "POST", body: form, isFormData: true });
}

export async function createDocumentFromText(workspaceId, botId, { name, text }) {
  return request(`${base(workspaceId, botId)}/from-text`, { method: "POST", body: { name, text } });
}

export async function createDocumentFromUrl(workspaceId, botId, { name, url, is_sitemap }) {
  return request(`${base(workspaceId, botId)}/from-url`, { method: "POST", body: { name, url, is_sitemap } });
}

export async function fetchChunks(workspaceId, botId, documentId) {
  return request(`${base(workspaceId, botId)}/${documentId}/chunks`);
}

export async function deleteDocument(workspaceId, botId, documentId) {
  return request(`${base(workspaceId, botId)}/${documentId}`, { method: "DELETE" });
}
