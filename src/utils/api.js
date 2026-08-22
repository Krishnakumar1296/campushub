export const API_BASE =
  window.location.port === "80" || !window.location.port
    ? `${window.location.origin}/yamini/backend`
    : "http://localhost/yamini/backend";

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw Object.assign(new Error(data?.error || `Request failed (${res.status})`), {
      payload: data,
    });
  }
  return data;
}
