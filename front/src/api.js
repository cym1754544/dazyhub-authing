const TOKEN_KEY = "dazyhub_authing_session";
const LOCAL_USER_KEY = "dazyhub_authing_user_settings";
const loginUrl = "http://localhost:8080/api/auth/login";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token || "authing-session");
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function loadLocalUser() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USER_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveLocalUser(user) {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

function normalizeAuthingUser(user) {
  const localUser = loadLocalUser();
  const displayName = user.name || user.email || user.sub || "DazyHub 用户";

  return {
    id: user.id,
    email: user.email || "",
    displayName,
    avatarUrl: user.picture || "",
    signature: localUser.signature || "",
    role: localUser.role || "user",
    ...localUser,
  };
}

export async function apiRequest(path, options = {}) {
  if (path === "/api/me") {
    return fetchMe();
  }

  if (path === "/api/me/settings" && options.method === "PATCH") {
    const payload = JSON.parse(options.body || "{}");
    const current = await fetchMe();
    const updated = { ...current, ...payload };
    saveLocalUser(updated);
    return updated;
  }

  if (path === "/api/me" && options.method === "PATCH") {
    const payload = JSON.parse(options.body || "{}");
    const current = await fetchMe();
    const updated = { ...current, ...payload };
    saveLocalUser(updated);
    return updated;
  }

  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, { ...options, headers, credentials: "include" });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(data?.message || "请求失败");
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function sendCode() {
  window.location.href = loginUrl;
}

export async function login() {
  window.location.href = loginUrl;
}

export async function register() {
  window.location.href = loginUrl;
}

export async function fetchMe() {
  const response = await fetch("/api/auth/me", { credentials: "include" });
  if (response.status === 401) {
    clearToken();
    window.location.href = loginUrl;
    return new Promise(() => {});
  }
  if (!response.ok) {
    const error = new Error("请求失败");
    error.status = response.status;
    throw error;
  }
  const authingUser = await response.json();
  const normalizedUser = normalizeAuthingUser(authingUser);
  setToken("authing-session");
  return normalizedUser;
}

export async function updateProfile(payload) {
  return apiRequest("/api/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateSettings(payload) {
  return apiRequest("/api/me/settings", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function uploadAvatar(file) {
  const objectUrl = URL.createObjectURL(file);
  return updateProfile({ avatarUrl: objectUrl });
}

export async function changePassword() {
  throw new Error("当前项目使用 Authing 托管登录，密码请在 Authing 页面修改");
}

export async function fetchSiteMeta(url) {
  return { title: "", iconUrl: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=128` };
}

export async function getEmailConfig() {
  return {};
}

export async function updateEmailConfig(payload) {
  return payload;
}

export async function testEmailConfig() {
  return { success: false, message: "当前项目未接入邮件配置接口" };
}

export async function getEmailPresets() {
  return [];
}

export async function activateEmailPreset() {
  return {};
}

export async function deleteEmailPreset() {
  return {};
}

export async function fetchUsers() {
  return [await fetchMe()];
}

export async function updateUser(id, payload) {
  const current = await fetchMe();
  const updated = { ...current, ...payload, id };
  saveLocalUser(updated);
  return updated;
}

export async function deleteUser() {
  return {};
}

export async function resetUserPassword() {
  return {};
}

export async function getFaviconCacheStats() {
  return { total: 0, hit: 0, miss: 0 };
}

export async function clearFaviconCache() {
  return {};
}

export async function fetchFaviconCacheItems() {
  return [];
}

export async function deleteFaviconCacheItem() {
  return {};
}

export async function fetchFaviconRules() {
  return [];
}

export async function saveFaviconRule(payload) {
  return payload;
}

export async function deleteFaviconRule() {
  return {};
}

export async function matchFaviconRule() {
  return null;
}

export async function submitFeedback(payload) {
  const current = loadLocalUser();
  const feedbacks = current.feedbacks || [];
  const next = { ...payload, id: Date.now(), status: "submitted", createdAt: new Date().toISOString() };
  saveLocalUser({ ...current, feedbacks: [next, ...feedbacks] });
  return next;
}

export async function uploadFeedbackAttachment(file) {
  return { name: file.name, url: URL.createObjectURL(file) };
}

export async function fetchMyFeedbacks() {
  return loadLocalUser().feedbacks || [];
}

export async function fetchAllFeedbacks() {
  return loadLocalUser().feedbacks || [];
}

export async function replyFeedback(id, payload) {
  return { id, ...payload };
}

export async function deleteFeedback(id) {
  const current = loadLocalUser();
  saveLocalUser({ ...current, feedbacks: (current.feedbacks || []).filter((item) => item.id !== id) });
  return {};
}
