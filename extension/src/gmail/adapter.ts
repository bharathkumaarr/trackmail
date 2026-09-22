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
    const seen = new Set<string>();

    for (const dialog of dialogs) {
      const id = assignComposeId(dialog);
      seen.add(id);

      // Clean up any rogue duplicate toggles in this compose dialog
      const existingToggles = dialog.querySelectorAll('.mailtrack-toggle-container');
      if (existingToggles.length > 1) {
        for (let i = 1; i < existingToggles.length; i++) {
          existingToggles[i].remove();
        }
      }

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
    // Enabled by default so users don't have to manually check every compose window
    let isTrackingEnabled = true;
    let trackedEmailId: string | null = null;

    const sendBtn = findSendButton(element);
    if (sendBtn) {
      sendBtn.dataset.mailtrackAttached = 'true';
    }

    const toggle = this.createTrackingToggle(element, () => isTrackingEnabled, (v) => {
      isTrackingEnabled = v;
    });

    const sendHandler = async (e: Event) => {
      if (!isTrackingEnabled) {
        console.log('[Mailtrack] Send triggered, but tracking is disabled');
        return;
      }

      const recipients = getRecipients(element);
      const subject = getSubject(element) || '(no subject)';

      console.log('[Mailtrack] Preparing to track email to:', recipients, 'subject:', subject);

      if (!recipients) {
        console.warn('[Mailtrack] Could not detect recipient, sending without tracking pixel');
        return;
      }

      // Prevent immediate send while preparing tracking
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

        console.log('[Mailtrack] Tracking prepared successfully, dispatching final send');

        // Re-trigger Gmail send after pixel injection
        sendBtn?.removeEventListener('click', sendHandler, true);
        element.removeEventListener('keydown', keyHandler, true);

        if (sendBtn) {
          sendBtn.click();
        }

        setTimeout(() => {
          sendBtn?.addEventListener('click', sendHandler, true);
          element.addEventListener('keydown', keyHandler, true);
        }, 800);
      } catch (err: any) {
        console.error('[Mailtrack] send preparation failed:', err);
        const msg = err?.message || '';
        if (msg.includes('Extension context invalidated')) {
          alert('Trackmail: Extension was updated or reloaded. Please refresh this Gmail tab (Cmd+R / F5) to reconnect tracking.');
        } else if (msg.includes('Not authenticated')) {
          alert('Trackmail: Please open the Trackmail extension popup and sign in to enable email tracking.');
        }

        // Allow send even if tracking fails
        sendBtn?.removeEventListener('click', sendHandler, true);
        element.removeEventListener('keydown', keyHandler, true);

        if (sendBtn) {
          sendBtn.click();
        }

        setTimeout(() => {
          sendBtn?.addEventListener('click', sendHandler, true);
          element.addEventListener('keydown', keyHandler, true);
        }, 800);
      }
    };

    const keyHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (isTrackingEnabled) {
          sendHandler(e);
        }
      }
    };

    sendBtn?.addEventListener('click', sendHandler, true);
    element.addEventListener('keydown', keyHandler, true);

    return {
      id,
      element,
      get isTrackingEnabled() { return isTrackingEnabled; },
      get trackedEmailId() { return trackedEmailId; },
      destroy: () => {
        sendBtn?.removeEventListener('click', sendHandler, true);
        element.removeEventListener('keydown', keyHandler, true);
        if (sendBtn) delete sendBtn.dataset.mailtrackAttached;
        toggle.remove();
      },
    };
  }

  private createTrackingToggle(
    compose: HTMLElement,
    getEnabled: () => boolean,
    setEnabled: (v: boolean) => void
  ): HTMLElement {
    const sendBtn = findSendButton(compose);
    const sendCell = sendBtn?.closest('td') || sendBtn?.parentElement;
    const targetParent = sendCell || findToolbarArea(compose) || compose;

    // Remove any existing duplicate toggles in this compose or sendCell before inserting
    const existingToggles = (sendCell || compose).querySelectorAll('.mailtrack-toggle-container');
    if (existingToggles.length > 0) {
      existingToggles.forEach((t) => t.remove());
    }

    const container = document.createElement('div');
    container.className = 'mailtrack-toggle-container';

    const label = document.createElement('label');
    label.className = 'mailtrack-toggle';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'mailtrack-toggle-input';
    checkbox.checked = getEnabled();

    // Custom Checkbox Box with Checkmark SVG (Landing Page theme)
    const customCheckbox = document.createElement('span');
    customCheckbox.className = 'mailtrack-checkbox-custom';
    customCheckbox.innerHTML = `
      <svg class="mailtrack-checkmark-svg" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7.5L5.5 10.5L11.5 4.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Text label
    const text = document.createElement('span');
    text.className = 'mailtrack-toggle-label';
    text.textContent = 'Track email';

    // Trackmail Logo Icon (with rocket outline and top-right yellow dot)
    const logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    logoSvg.setAttribute('class', 'mailtrack-logo-icon');
    logoSvg.setAttribute('viewBox', '0 0 32 32');
    logoSvg.setAttribute('width', '14');
    logoSvg.setAttribute('height', '14');
    logoSvg.setAttribute('fill', 'none');
    logoSvg.innerHTML = `
      <rect width="32" height="32" rx="7.5" fill="#4F46E5"/>
      <g transform="translate(5.5, 8.5) scale(0.7)">
        <path d="m22 2-7 20-4-9-9-4Z" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 2 11 13" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <circle cx="25.5" cy="6.5" r="3.2" fill="#F59E0B"/>
    `;

    const updateVisualState = (checked: boolean) => {
      checkbox.checked = checked;
      container.classList.toggle('mailtrack-active', checked);
    };

    const toggleState = (e?: Event) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const next = !checkbox.checked;
      checkbox.checked = next;
      setEnabled(next);
      updateVisualState(next);
      console.log('[Mailtrack] Toggle clicked, tracking is now:', next ? 'ENABLED' : 'DISABLED');
    };

    label.addEventListener('click', toggleState);
    checkbox.addEventListener('change', () => {
      setEnabled(checkbox.checked);
      updateVisualState(checkbox.checked);
    });

    label.appendChild(checkbox);
    label.appendChild(customCheckbox);
    label.appendChild(text);
    label.appendChild(logoSvg);
    container.appendChild(label);

    // Set initial state
    updateVisualState(getEnabled());

    // Prefer inserting directly in the cell beside the Send button
    if (sendCell) {
      sendCell.appendChild(container);
    } else if (targetParent.tagName !== 'TR') {
      targetParent.appendChild(container);
    } else {
      const td = document.createElement('td');
      td.appendChild(container);
      targetParent.appendChild(td);
    }

    console.log('[Mailtrack] Single toggle button injected into DOM');
    return container;
  }
}
