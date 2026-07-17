import { request } from "./client";

export async function createWorkspace(name) {
  return request("/workspaces", { method: "POST", body: { name } });
}

export async function fetchMyWorkspaces() {
  return request("/workspaces/me");
}

export async function fetchMembers(workspaceId) {
  return request(`/workspaces/${workspaceId}/members`);
}

export async function inviteMember(workspaceId, { email, role }) {
  return request(`/workspaces/${workspaceId}/members/invitations`, { method: "POST", body: { email, role } });
}

export async function removeMember(workspaceId, membershipId) {
  return request(`/workspaces/${workspaceId}/members/${membershipId}`, { method: "DELETE" });
}
