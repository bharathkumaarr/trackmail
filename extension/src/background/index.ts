import { api } from '../services/api/client';
import { getToken, setToken, setUser, clearAuth } from '../storage/index';

const API_BASE = 'http://localhost:8080/api/v1';

async function initApi() {
  const token = await getToken();
  if (token) api.setToken(token);
}

initApi();

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'PREPARE_TRACKING') {
    handlePrepareTracking(message.payload)
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }

  if (message.type === 'AUTHENTICATE') {
    handleAuthenticate()
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }

  if (message.type === 'SIGN_OUT') {
    clearAuth().then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message.type === 'LIST_EMAILS') {
    listEmails()
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }
});

async function handlePrepareTracking(payload: { recipient: string; subject: string }) {
  const token = await getToken();
  if (!token) {
    throw new Error('Not authenticated. Open the Trackmail extension popup to sign in.');
  }
  api.setToken(token);

  const result = await api.createTrackedEmail(payload.recipient, payload.subject);
  await api.markSent(result.id);
  return result;
}

async function handleAuthenticate() {
  return new Promise<{ token: string; user: { id: string; email: string } }>((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, async (accessToken) => {
      if (chrome.runtime.lastError || !accessToken) {
        reject(new Error(chrome.runtime.lastError?.message || 'OAuth failed'));
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken }),
        });

        if (!res.ok) {
          throw new Error('Backend authentication failed');
        }

        const auth = await res.json();
        await setToken(auth.token);
        await setUser(auth.user);
        api.setToken(auth.token);
        resolve(auth);
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function listEmails() {
  const token = await getToken();
  if (!token) throw new Error('Not authenticated');
  api.setToken(token);
  return api.listTrackedEmails();
}
