/// <reference types="chrome" />

export interface TrackedEmail {
  id: string;
  recipient: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  first_opened_at?: string;
  last_opened_at?: string;
  open_count: number;
  created_at: string;
}

export interface CreateTrackedEmailResponse {
  id: string;
  tracking_url: string;
  pixel_html: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

export interface User {
  id: string;
  email: string;
}
