import { GmailAdapter } from '../gmail/adapter';

let adapter: GmailAdapter | null = null;

function isContextValid(): boolean {
  try {
    return typeof chrome !== 'undefined' && Boolean(chrome?.runtime?.id) && typeof chrome.runtime?.sendMessage === 'function';
  } catch {
    return false;
  }
}

function init() {
  if (adapter) return;

  adapter = new GmailAdapter(async (data) => {
    if (!data.trackingEnabled) return;

    if (!isContextValid()) {
      throw new Error('Extension context invalidated. Please refresh this Gmail tab (Cmd+R / F5) to reconnect tracking.');
    }

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'PREPARE_TRACKING',
        payload: {
          recipient: data.recipients.split(',')[0].trim(),
          subject: data.subject,
        },
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      return {
        pixelHTML: response.pixel_html,
        trackedEmailId: response.id,
      };
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (
        msg.includes('Extension context invalidated') ||
        msg.includes('sendMessage') ||
        msg.includes('Cannot read properties of undefined') ||
        msg.includes('context invalidated')
      ) {
        throw new Error('Extension context invalidated. Please refresh this Gmail tab (Cmd+R / F5) to reconnect tracking.');
      }
      throw err;
    }
  });

  adapter.start();
  console.log('[Mailtrack] Gmail adapter initialized');
}

// Gmail is a SPA — re-init on navigation if needed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
