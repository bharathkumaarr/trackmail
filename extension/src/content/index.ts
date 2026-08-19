import { GmailAdapter } from '../gmail/adapter';

let adapter: GmailAdapter | null = null;

function init() {
  if (adapter) return;

  adapter = new GmailAdapter(async (data) => {
    if (!data.trackingEnabled) return;

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
