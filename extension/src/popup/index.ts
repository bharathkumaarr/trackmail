import type { TrackedEmail } from '../types';

const signInBtn = document.getElementById('sign-in-btn')!;
const signOutBtn = document.getElementById('sign-out-btn')!;
const authSection = document.getElementById('auth-section')!;
const userInfo = document.getElementById('user-info')!;
const userEmail = document.getElementById('user-email')!;
const emailsSection = document.getElementById('emails-section')!;
const emailList = document.getElementById('email-list')!;
const refreshBtn = document.getElementById('refresh-btn')!;
const errorEl = document.getElementById('error')!;

function showError(msg: string) {
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
}

function clearError() {
  errorEl.classList.add('hidden');
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function renderEmails(emails: TrackedEmail[]) {
  if (emails.length === 0) {
    emailList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon-circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 2L11 13"></path>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
        <p class="empty-title">No tracked emails yet</p>
        <p class="empty-desc">Check <strong>Track email</strong> in your Gmail compose box before hitting send.</p>
      </div>
    `;
    return;
  }

  emailList.innerHTML = emails
    .map((e) => {
      let statusBadge = '<span class="status-badge status-not-opened"><span class="badge-dot"></span>Unopened</span>';

      if (e.open_count > 0 && e.last_opened_at) {
        statusBadge = `
          <span class="status-badge status-opened">
            <svg class="badge-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Opened ${formatTime(e.last_opened_at)}${e.open_count > 1 ? ` <span class="badge-count">${e.open_count}x</span>` : ''}
          </span>
        `;
      } else if (e.status === 'sent') {
        statusBadge = `
          <span class="status-badge status-sent">
            <svg class="badge-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Sent
          </span>
        `;
      }

      return `
        <div class="email-item">
          <div class="email-header">
            <div class="email-subject" title="${escapeHtml(e.subject || '(no subject)')}">${escapeHtml(e.subject || '(no subject)')}</div>
          </div>
          <div class="email-recipient">
            <svg class="recipient-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>${escapeHtml(e.recipient)}</span>
          </div>
          <div class="email-status-row">
            ${statusBadge}
          </div>
        </div>
      `;
    })
    .join('');
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

async function checkAuth() {
  const stored = await chrome.storage.local.get(['mailtrack_token', 'mailtrack_user']);
  if (stored.mailtrack_token && stored.mailtrack_user) {
    authSection.classList.add('hidden');
    userInfo.classList.remove('hidden');
    emailsSection.classList.remove('hidden');
    userEmail.textContent = stored.mailtrack_user.email;
    await loadEmails();
  } else {
    authSection.classList.remove('hidden');
    userInfo.classList.add('hidden');
    emailsSection.classList.add('hidden');
  }
}

async function loadEmails() {
  clearError();
  refreshBtn.classList.add('refreshing');
  try {
    const response = await chrome.runtime.sendMessage({ type: 'LIST_EMAILS' });
    if (response?.error) {
      showError(response.error);
      return;
    }
    renderEmails(response.emails || []);
  } catch (err: any) {
    showError(err?.message || 'Failed to load tracked emails');
  } finally {
    setTimeout(() => refreshBtn.classList.remove('refreshing'), 400);
  }
}

signInBtn.addEventListener('click', async () => {
  clearError();
  const originalHtml = signInBtn.innerHTML;
  signInBtn.textContent = 'Connecting...';
  signInBtn.setAttribute('disabled', 'true');

  try {
    const response = await chrome.runtime.sendMessage({ type: 'AUTHENTICATE' });
    if (response?.error) {
      showError(response.error);
      return;
    }

    authSection.classList.add('hidden');
    userInfo.classList.remove('hidden');
    emailsSection.classList.remove('hidden');
    userEmail.textContent = response.user.email;
    await loadEmails();
  } catch (err: any) {
    showError(err?.message || 'Sign in failed');
  } finally {
    signInBtn.removeAttribute('disabled');
    signInBtn.innerHTML = originalHtml;
  }
});

signOutBtn.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: 'SIGN_OUT' });
  authSection.classList.remove('hidden');
  userInfo.classList.add('hidden');
  emailsSection.classList.add('hidden');
});

refreshBtn.addEventListener('click', loadEmails);

checkAuth();
