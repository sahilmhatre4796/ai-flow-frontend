import { clearTokens, request, setTokens } from "./client";

export async function register({ email, password, full_name }) {
  return request("/auth/register", { method: "POST", body: { email, password, full_name } });
}

export async function login({ email, password }) {
  const tokens = await request("/auth/login", { method: "POST", body: { email, password } });
  setTokens(tokens);
  return tokens;
}

export async function logout() {
  const refresh_token = localStorage.getItem("aiflow_refresh_token");
  if (refresh_token) {
    try {
      await request("/auth/logout", { method: "POST", body: { refresh_token } });
    } catch {
      // best-effort revoke; clear local tokens regardless
    }
  }
  clearTokens();
}

export async function fetchMe() {
  return request("/auth/me");
}

export async function forgotPassword(email) {
  return request("/auth/forgot-password", { method: "POST", body: { email } });
}

export async function resetPassword({ token, new_password }) {
  return request("/auth/reset-password", { method: "POST", body: { token, new_password } });
}

export async function verifyEmail(token) {
  return request("/auth/verify-email", { method: "POST", body: { token } });
}
