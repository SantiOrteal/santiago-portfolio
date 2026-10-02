// Sends a contact-form message to every configured channel in parallel.
//
//   VITE_WEB3FORMS_KEY     → Web3Forms delivers the message to your inbox
//   VITE_N8N_WEBHOOK_URL   → n8n webhook (second delivery channel)
//   VITE_N8N_WEBHOOK_TOKEN → optional shared header checked by the workflow
//
// The message counts as sent when at least one channel accepts it, so the
// homelab being offline never loses a message as long as Web3Forms works.

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const N8N_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
const N8N_TOKEN = import.meta.env.VITE_N8N_WEBHOOK_TOKEN;
const TIMEOUT_MS = 10000;

export const isContactConfigured = Boolean(WEB3FORMS_KEY || N8N_URL);

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

async function sendToWeb3Forms(msg) {
  const data = await postJson("https://api.web3forms.com/submit", {
    access_key: WEB3FORMS_KEY,
    subject: `Portafolio · ${msg.reasonLabel} · ${msg.name}`,
    from_name: "Portafolio Santiago Ortega",
    replyto: msg.email,
    name: msg.name,
    email: msg.email,
    reason: msg.reasonLabel,
    message: msg.message,
    language: msg.language,
  });
  // Web3Forms answers 200 with { success: false } for some errors.
  if (data.success === false) throw new Error(data.message || "Web3Forms error");
}

async function sendToN8n(msg) {
  await postJson(
    N8N_URL,
    {
      name: msg.name,
      email: msg.email,
      reason: msg.reason,
      reasonLabel: msg.reasonLabel,
      message: msg.message,
      language: msg.language,
      page: window.location.href,
      sentAt: new Date().toISOString(),
    },
    N8N_TOKEN ? { "X-Portfolio-Token": N8N_TOKEN } : {}
  );
}

/**
 * @param {{ name: string, email: string, reason: string, reasonLabel: string,
 *           message: string, language: string }} msg
 * @returns {Promise<{ channels: string[] }>} channels that accepted it
 * @throws when no channel is configured or every channel failed
 */
export async function sendMessage(msg) {
  const tasks = [];
  if (WEB3FORMS_KEY) tasks.push(["web3forms", sendToWeb3Forms(msg)]);
  if (N8N_URL) tasks.push(["n8n", sendToN8n(msg)]);
  if (tasks.length === 0) throw new Error("not-configured");

  const results = await Promise.allSettled(tasks.map(([, p]) => p));
  const channels = tasks
    .filter((_, i) => results[i].status === "fulfilled")
    .map(([name]) => name);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.warn(`[contact] ${tasks[i][0]} failed:`, r.reason);
    }
  });

  if (channels.length === 0) throw results[0].reason;
  return { channels };
}
