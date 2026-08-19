import type { TrackedEmail } from '../../types';

const API_BASE = 'http://localhost:8080/api/v1';

export class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
      throw new Error(err.error?.message || `API error ${res.status}`);
    }

    return res.json();
  }

  async authenticate(idToken: string) {
    return this.request<{ token: string; user: { id: string; email: string } }>(
      'POST',
      '/auth/google',
      { id_token: idToken }
    );
  }

  async getMe() {
    return this.request<{ id: string; email: string }>('GET', '/auth/me');
  }

  async createTrackedEmail(recipient: string, subject: string) {
    return this.request<{ id: string; tracking_url: string; pixel_html: string }>(
      'POST',
      '/tracked-emails',
      { recipient, subject }
    );
  }

  async markSent(id: string, gmailMessageId?: string) {
    return this.request<{ status: string }>('POST', `/tracked-emails/${id}/sent`, {
      gmail_message_id: gmailMessageId || null,
    });
  }

  async listTrackedEmails(limit = 50) {
    return this.request<{ emails: TrackedEmail[] }>(
      'GET',
      `/tracked-emails?limit=${limit}`
    );
  }

  async getTrackedEmail(id: string) {
    return this.request<TrackedEmail>('GET', `/tracked-emails/${id}`);
  }
}

export const api = new ApiClient();
