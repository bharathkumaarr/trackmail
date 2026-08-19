const TOKEN_KEY = 'mailtrack_token';
const USER_KEY = 'mailtrack_user';

export async function getToken(): Promise<string | null> {
  const result = await chrome.storage.local.get(TOKEN_KEY);
  return result[TOKEN_KEY] || null;
}

export async function setToken(token: string): Promise<void> {
  await chrome.storage.local.set({ [TOKEN_KEY]: token });
}

export async function clearAuth(): Promise<void> {
  await chrome.storage.local.remove([TOKEN_KEY, USER_KEY]);
}

export async function getUser(): Promise<{ id: string; email: string } | null> {
  const result = await chrome.storage.local.get(USER_KEY);
  return result[USER_KEY] || null;
}

export async function setUser(user: { id: string; email: string }): Promise<void> {
  await chrome.storage.local.set({ [USER_KEY]: user });
}

export async function getTrackingEnabled(composeId: string): Promise<boolean> {
  const key = `tracking_${composeId}`;
  const result = await chrome.storage.session.get(key);
  return result[key] === true;
}

export async function setTrackingEnabled(composeId: string, enabled: boolean): Promise<void> {
  const key = `tracking_${composeId}`;
  await chrome.storage.session.set({ [key]: enabled });
}
