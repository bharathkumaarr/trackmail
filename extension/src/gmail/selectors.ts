/**
 * Gmail DOM selectors — centralized for maintainability.
 *
 * Gmail is a complex SPA and these selectors may break when Gmail updates.
 * When tracking stops working, update selectors here first.
 *
 * Assumptions (as of 2024-2026 Gmail web):
 * - Compose windows are role="dialog" elements
 * - Send button has aria-label containing "Send"
 * - Recipients use aria-label="To" or name="to"
 * - Subject input has name="subjectbox"
 * - Body is a contenteditable div with g_editable="true"
 */

export const SELECTORS = {
  composeDialog: '[role="dialog"], .AD, [role="region"], .M9, [aria-label*="New Message"]',
  sendButton: '[role="button"][aria-label*="Send"], [role="button"][data-tooltip*="Send"], [data-tooltip*="Send"]',
  toField: '[aria-label="To"], [name="to"]',
  subjectField: 'input[name="subjectbox"]',
  bodyField: '[g_editable="true"][aria-label="Message Body"], [g_editable="true"][role="textbox"]',
  toolbarArea: '.btC, [role="toolbar"]',
} as const;

export interface ComposeData {
  id: string;
  element: HTMLElement;
  recipients: string;
  subject: string;
}

export function findComposeDialogs(): HTMLElement[] {
  // Find all Send buttons first to guarantee strictly 1 container per compose window
  const sendButtons = document.querySelectorAll<HTMLElement>(SELECTORS.sendButton);
  const dialogs: HTMLElement[] = [];
  const seenContainers = new Set<HTMLElement>();

  for (const btn of sendButtons) {
    // Ignore invisible / detached elements
    if (btn.offsetParent === null && !btn.getClientRects().length) continue;

    // Prioritize canonical top-level compose containers (.AD or [role="dialog"])
    const container =
      (btn.closest('.AD') as HTMLElement | null) ||
      (btn.closest('[role="dialog"]') as HTMLElement | null) ||
      (btn.closest('form') as HTMLElement | null) ||
      (btn.closest('table.aoI') as HTMLElement | null) ||
      (btn.closest('.M9') as HTMLElement | null) ||
      btn.parentElement;

    if (container && !seenContainers.has(container)) {
      seenContainers.add(container);
      dialogs.push(container);
    }
  }

  // Fallback: search for dialogs only if no send button is rendered yet
  if (dialogs.length === 0) {
    const fallbackDialogs = document.querySelectorAll<HTMLElement>('.AD, [role="dialog"]');
    for (const d of fallbackDialogs) {
      if (!seenContainers.has(d)) {
        seenContainers.add(d);
        dialogs.push(d);
      }
    }
  }

  return dialogs;
}

export function getComposeId(element: HTMLElement): string {
  const sendBtn = findSendButton(element);
  if (sendBtn?.dataset.mailtrackId) {
    return sendBtn.dataset.mailtrackId;
  }
  const dialogs = findComposeDialogs();
  const index = dialogs.indexOf(element);
  return `compose-${index}-${element.dataset.mailtrackId || ''}`;
}

export function assignComposeId(element: HTMLElement): string {
  const sendBtn = findSendButton(element);
  if (sendBtn?.dataset.mailtrackId) {
    element.dataset.mailtrackId = sendBtn.dataset.mailtrackId;
    return sendBtn.dataset.mailtrackId;
  }
  if (!element.dataset.mailtrackId) {
    const id = crypto.randomUUID().slice(0, 8);
    element.dataset.mailtrackId = id;
    if (sendBtn) sendBtn.dataset.mailtrackId = id;
  }
  return element.dataset.mailtrackId;
}

export function findSendButton(compose: HTMLElement): HTMLElement | null {
  return compose.querySelector<HTMLElement>(SELECTORS.sendButton);
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export function getRecipients(compose: HTMLElement): string {
  const root = compose.closest<HTMLElement>('.AD, [role="dialog"], form, .M9') || compose;

  // 1. Search for recipient chips with email attribute or data-hovercard-id
  const chips = root.querySelectorAll<HTMLElement>('[email], [data-hovercard-id*="@"], .vR span[email], .afV');
  if (chips.length > 0) {
    const found: string[] = [];
    chips.forEach((c) => {
      const raw = c.getAttribute('email') || c.getAttribute('data-hovercard-id') || c.textContent || '';
      const matches = raw.match(EMAIL_REGEX);
      if (matches) found.push(...matches);
    });
    if (found.length > 0) {
      return Array.from(new Set(found)).join(', ');
    }
  }

  // 2. Check input and textarea fields across modern Gmail selectors
  const toSelectors = [
    'input[name="to"]',
    'textarea[name="to"]',
    'input[aria-label*="To"]',
    'textarea[aria-label*="To"]',
    '[aria-label*="To recipients"]',
    'input.agP',
    '[name="to"]',
    '[aria-label="To"]',
  ];

  for (const sel of toSelectors) {
    const el = root.querySelector<HTMLElement>(sel);
    if (el) {
      const raw = (el as HTMLInputElement).value?.trim() || el.textContent?.trim() || '';
      const matches = raw.match(EMAIL_REGEX);
      if (matches && matches.length > 0) {
        return Array.from(new Set(matches)).join(', ');
      }
      if (raw && raw.includes('@')) {
        return raw;
      }
    }
  }

  // 3. Fallback: scan any text containing @ in recipient header containers
  const toHeaders = root.querySelectorAll<HTMLElement>('tr.fX, .fX, .vR, [data-recipient]');
  for (const th of toHeaders) {
    const matches = (th.textContent || '').match(EMAIL_REGEX);
    if (matches && matches.length > 0) {
      return Array.from(new Set(matches)).join(', ');
    }
  }

  return '';
}

export function getSubject(compose: HTMLElement): string {
  const root = compose.closest<HTMLElement>('.AD, [role="dialog"], form, .M9') || compose;
  const field = root.querySelector<HTMLInputElement>(
    'input[name="subjectbox"], input[aria-label*="Subject"], input[placeholder*="Subject"]'
  );
  return field?.value?.trim() || '';
}

export function getBodyElement(compose: HTMLElement): HTMLElement | null {
  const root = compose.closest<HTMLElement>('.AD, [role="dialog"], form, .M9') || compose;
  return root.querySelector<HTMLElement>(
    '[g_editable="true"][aria-label*="Message Body"], [g_editable="true"][role="textbox"], [contenteditable="true"][aria-label*="Message Body"], [contenteditable="true"][role="textbox"], .editable, .Am'
  ) || compose.querySelector<HTMLElement>('[g_editable="true"], [contenteditable="true"]');
}

/**
 * Injects tracking pixel HTML into the compose body.
 * Works with both plain text and rich HTML compose modes.
 */
export function injectTrackingPixel(compose: HTMLElement, pixelHTML: string): boolean {
  const body = getBodyElement(compose);
  if (!body) {
    console.warn('[Mailtrack] compose body element not found for pixel injection');
    return false;
  }

  // Avoid duplicate injection
  if (body.querySelector('[data-mailtrack-pixel]')) return true;

  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-mailtrack-pixel', 'true');
  wrapper.style.display = 'none';
  wrapper.innerHTML = pixelHTML;
  body.appendChild(wrapper);
  console.log('[Mailtrack] Injected tracking pixel into email body');
  return true;
}

export function findToolbarArea(compose: HTMLElement): HTMLElement | null {
  return compose.querySelector<HTMLElement>(SELECTORS.toolbarArea);
}
