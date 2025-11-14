const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export const googleLogin = () => {
  window.location.href = `${API_BASE}/gmail/auth/google`;
};

export const fetchStatus = async () => {
  const res = await fetch(`${API_BASE}/gmail/status`);
  return await res.json();
};

export const fetchProfile = async () => {
  const res = await fetch(`${API_BASE}/gmail/profile`);
  return await res.json();
};

export const fetchEmails = async () => {
  const res = await fetch(`${API_BASE}/gmail/list`);
  return await res.json();
};

export const sendEmail = async (data) => {
  const res = await fetch(`${API_BASE}/gmail/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export async function fetchAISummary(emails) {
  const res = await fetch(`${API_BASE}/gmail/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emails }),
  });
  return res.json();
}

export const fetchSmartReplies = async (email) => {
  const res = await fetch(`${API_BASE}/gmail/smart-reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(email),
  });
  if (!res.ok) throw new Error("Smart reply failed");
  return res.json();
};

export const fetchConversations = async () => {
  const res = await fetch(`${API_BASE}/gmail/conversations`);
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
};
