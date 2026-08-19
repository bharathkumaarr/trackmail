import type { TrackedEmail } from '../types';

const signInBtn = document.getElementById('sign-in-btn')!;
const signOutBtn = document.getElementById('sign-out-btn')!;
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
  return new Date(iso).toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  });
}

function renderEmails(emails: TrackedEmail[]) {
  if (emails.length === 0) {
    emailList.innerHTML = '<p class="empty-state">No tracked emails yet.<br>Enable "Track email" when composing in Gmail.</p>';
    return;
  }

  emailList.innerHTML = emails
    .map((e) => {
      let statusClass = 'status-not-opened';
      let statusText = 'Not opened';

      if (e.open_count > 0 && e.last_opened_at) {
        statusClass = 'status-opened';
        statusText = `👁 Opened ${formatTime(e.last_opened_at)}${e.open_count > 1 ? ` (${e.open_count}x)` : ''}`;
      } else if (e.status === 'sent') {
        statusClass = 'status-sent';
        statusText = '✓ Sent';
      }

      return `
        <div class="email-item">
          <div class="email-subject">${escapeHtml(e.subject || '(no subject)')}</div>
          <div class="email-recipient">${escapeHtml(e.recipient)}</div>
          <div class="email-status ${statusClass}">${statusText}</div>
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
    signInBtn.classList.add('hidden');
    userInfo.classList.remove('hidden');
    emailsSection.classList.remove('hidden');
    userEmail.textContent = stored.mailtrack_user.email;
    await loadEmails();
  }
}

async function loadEmails() {
  clearError();
  const response = await chrome.runtime.sendMessage({ type: 'LIST_EMAILS' });
  if (response?.error) {
    showError(response.error);
    return;
  }
  renderEmails(response.emails || []);
}

signInBtn.addEventListener('click', async () => {
  clearError();
  signInBtn.textContent = 'Signing in...';
  signInBtn.setAttribute('disabled', 'true');

  const response = await chrome.runtime.sendMessage({ type: 'AUTHENTICATE' });
  signInBtn.removeAttribute('disabled');
  signInBtn.textContent = 'Sign in with Google';

  if (response?.error) {
    showError(response.error);
    return;
  }

  signInBtn.classList.add('hidden');
  userInfo.classList.remove('hidden');
  emailsSection.classList.remove('hidden');
  userEmail.textContent = response.user.email;
  await loadEmails();
});

signOutBtn.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: 'SIGN_OUT' });
  signInBtn.classList.remove('hidden');
  userInfo.classList.add('hidden');
  emailsSection.classList.add('hidden');
});

refreshBtn.addEventListener('click', loadEmails);

checkAuth();
