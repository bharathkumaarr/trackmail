import {
  assignComposeId,
  findComposeDialogs,
  findSendButton,
  findToolbarArea,
  getRecipients,
  getSubject,
  injectTrackingPixel,
} from './selectors';

export interface ComposeController {
  id: string;
  element: HTMLElement;
  isTrackingEnabled: boolean;
  trackedEmailId: string | null;
  destroy: () => void;
}

type SendCallback = (data: {
  composeId: string;
  recipients: string;
  subject: string;
  trackedEmailId: string | null;
  trackingEnabled: boolean;
}) => Promise<{ pixelHTML?: string; trackedEmailId?: string } | void>;

export class GmailAdapter {
  private controllers = new Map<string, ComposeController>();
  private observer: MutationObserver | null = null;
  private onSend: SendCallback;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(onSend: SendCallback) {
    this.onSend = onSend;
  }

  start(): void {
    this.scanComposeWindows();
    this.observer = new MutationObserver(() => this.debouncedScan());
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    for (const ctrl of this.controllers.values()) {
      ctrl.destroy();
    }
    this.controllers.clear();
  }

  private debouncedScan(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.scanComposeWindows(), 300);
  }

  private scanComposeWindows(): void {
    const dialogs = findComposeDialogs();
    if (dialogs.length > 0) {
      console.log(`[Mailtrack] Found ${dialogs.length} compose window(s)`);
    }
    const seen = new Set<string>();

    for (const dialog of dialogs) {
      const id = assignComposeId(dialog);
      seen.add(id);

      if (this.controllers.has(id)) continue;

      console.log(`[Mailtrack] Initializing tracking toggle for compose window:`, id);
      const controller = this.setupCompose(dialog, id);
      this.controllers.set(id, controller);
    }

    // Clean up closed compose windows
    for (const [id, ctrl] of this.controllers) {
      if (!seen.has(id) || !document.contains(ctrl.element)) {
        ctrl.destroy();
        this.controllers.delete(id);
      }
    }
  }

  private setupCompose(element: HTMLElement, id: string): ComposeController {
    let isTrackingEnabled = false;
    let trackedEmailId: string | null = null;

    const toggle = this.createTrackingToggle(element, () => isTrackingEnabled, (v) => {
      isTrackingEnabled = v;
    });

    const sendBtn = findSendButton(element);
    const sendHandler = async (e: Event) => {
      if (!isTrackingEnabled) return;

      const recipients = getRecipients(element);
      const subject = getSubject(element);

      if (!recipients) return;

      // Prevent default send briefly while we prepare tracking
      e.preventDefault();
      e.stopImmediatePropagation();

      try {
        const result = await this.onSend({
          composeId: id,
          recipients,
          subject,
          trackedEmailId,
          trackingEnabled: isTrackingEnabled,
        });

        if (result?.pixelHTML) {
          injectTrackingPixel(element, result.pixelHTML);
        }
        if (result?.trackedEmailId) {
          trackedEmailId = result.trackedEmailId;
        }

        // Re-trigger Gmail send after pixel injection
        sendBtn?.removeEventListener('click', sendHandler, true);
        sendBtn?.click();
        // Re-attach for future sends (unlikely in same compose, but safe)
        setTimeout(() => sendBtn?.addEventListener('click', sendHandler, true), 100);
      } catch (err) {
        console.error('[Mailtrack] send preparation failed:', err);
        // Allow send even if tracking fails
        sendBtn?.removeEventListener('click', sendHandler, true);
        sendBtn?.click();
        setTimeout(() => sendBtn?.addEventListener('click', sendHandler, true), 100);
      }
    };

    sendBtn?.addEventListener('click', sendHandler, true);

    return {
      id,
      element,
      get isTrackingEnabled() { return isTrackingEnabled; },
      get trackedEmailId() { return trackedEmailId; },
      destroy: () => {
        sendBtn?.removeEventListener('click', sendHandler, true);
        toggle.remove();
      },
    };
  }

  private createTrackingToggle(
    compose: HTMLElement,
    getEnabled: () => boolean,
    setEnabled: (v: boolean) => void
  ): HTMLElement {
    const container = document.createElement('div');
    container.className = 'mailtrack-toggle-container';

    const label = document.createElement('label');
    label.className = 'mailtrack-toggle';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'mailtrack-toggle-input';

    const text = document.createElement('span');
    text.className = 'mailtrack-toggle-label';
    text.textContent = 'Track email';

    checkbox.addEventListener('change', () => {
      setEnabled(checkbox.checked);
      text.textContent = checkbox.checked ? 'Track email ✓' : 'Track email';
      container.classList.toggle('mailtrack-active', checkbox.checked);
      console.log('[Mailtrack] Tracking is now:', checkbox.checked ? 'ENABLED' : 'DISABLED');
    });

    label.appendChild(checkbox);
    label.appendChild(text);
    container.appendChild(label);

    // Prefer inserting directly in the cell beside the Send button
    const sendBtn = findSendButton(compose);
    const sendCell = sendBtn?.closest('td') || sendBtn?.parentElement;
    const toolbar = findToolbarArea(compose);

    if (sendCell) {
      sendCell.appendChild(container);
    } else if (toolbar && toolbar.tagName !== 'TR') {
      toolbar.appendChild(container);
    } else if (toolbar) {
      const td = document.createElement('td');
      td.appendChild(container);
      toolbar.appendChild(td);
    } else {
      compose.appendChild(container);
    }

    console.log('[Mailtrack] Toggle button injected into DOM');
    return container;
  }
}
