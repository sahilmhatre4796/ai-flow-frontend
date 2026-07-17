/**
 * Thin fetch wrapper for the AI FLOW backend.
 *
 * Token handling: the access token lives only in memory (a module-level
 * variable) since it's short-lived (15 min) and never needs to survive a
 * full page reload. The refresh token is opaque and longer-lived, so it's
 * kept in localStorage so a returning visitor doesn't have to log in every
 * time they reopen the tab — the same pattern most real SPAs use when the
 * backend issues tokens in the response body rather than as httpOnly
 * cookies. (This is a standalone deployed app, not a Claude.ai artifact, so
 * localStorage is available and appropriate here.)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const REFRESH_TOKEN_KEY = "aiflow_refresh_token";

let accessToken = null;
let refreshPromise = null; // de-dupes concurrent refreshes if several requests 401 at once

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens({ access_token, refresh_token }) {
  accessToken = access_token || null;
  if (refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

export function clearTokens() {
  accessToken = null;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(status, detail) {
    super(typeof detail === "string" ? detail : "Request failed");
    this.status = status;
    this.detail = detail;
  }
}

async function doFetch(path, options) {
  const headers = { ...(options.headers || {}) };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError(401, "Not authenticated");

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) {
          clearTokens();
          throw new ApiError(res.status, "Session expired — please log in again");
        }
        const data = await res.json();
        setTokens(data);
        return data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Performs an authenticated request, transparently refreshing the access
 * token exactly once if the first attempt comes back 401.
 */
export async function request(path, { method = "GET", body, headers, isFormData = false, raw = false } = {}) {
  const finalBody = isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined;

  let response = await doFetch(path, { method, body: finalBody, headers });

  if (response.status === 401 && getRefreshToken()) {
    try {
      await refreshAccessToken();
      response = await doFetch(path, { method, body: finalBody, headers });
    } catch {
      throw new ApiError(401, "Session expired — please log in again");
    }
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      detail = data.detail || detail;
    } catch {
      // non-JSON error body; keep the generic message
    }
    throw new ApiError(response.status, detail);
  }

  if (raw) return response;
  if (response.status === 204) return null;
  return response.json();
}

export { API_BASE_URL };

// Where the built widget.js bundle (vite.widget.config.js output) is hosted —
// typically the same static host as this dashboard (e.g. Vercel), which is a
// *different* deployment from the API backend (e.g. Railway). Defaults to a
// same-origin relative path for local development.
export const WIDGET_SCRIPT_URL = import.meta.env.VITE_WIDGET_SCRIPT_URL || "/widget.js";
