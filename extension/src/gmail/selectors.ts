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
  const dialogs = document.querySelectorAll<HTMLElement>(SELECTORS.composeDialog);
  const matched = Array.from(dialogs).filter((d) => d.querySelector(SELECTORS.sendButton));

  if (matched.length > 0) {
    return matched;
  }

  // Fallback: search from Send button up to the compose container
  const sendButtons = document.querySelectorAll<HTMLElement>(SELECTORS.sendButton);
  const fallbackDialogs = new Set<HTMLElement>();
  for (const btn of sendButtons) {
    const parent = btn.closest<HTMLElement>('[role="dialog"], .AD, [role="region"], table.aoI, .M9, form');
    if (parent) {
      fallbackDialogs.add(parent);
    }
  }
  return Array.from(fallbackDialogs);
}

export function getComposeId(element: HTMLElement): string {
  // Use a stable identifier based on element position in DOM
  const dialogs = findComposeDialogs();
  const index = dialogs.indexOf(element);
  return `compose-${index}-${element.dataset.mailtrackId || ''}`;
}

export function assignComposeId(element: HTMLElement): string {
  if (!element.dataset.mailtrackId) {
    element.dataset.mailtrackId = crypto.randomUUID().slice(0, 8);
  }
  return element.dataset.mailtrackId;
}

export function findSendButton(compose: HTMLElement): HTMLElement | null {
  return compose.querySelector<HTMLElement>(SELECTORS.sendButton);
}

export function getRecipients(compose: HTMLElement): string {
  const toField = compose.querySelector<HTMLElement>(SELECTORS.toField);
  if (!toField) return '';

  // Gmail uses chips for recipients — collect email text
  const chips = compose.querySelectorAll('[email]');
  if (chips.length > 0) {
    return Array.from(chips)
      .map((c) => c.getAttribute('email') || c.textContent || '')
      .filter(Boolean)
      .join(', ');
  }

  return toField.textContent?.trim() || (toField as HTMLInputElement).value?.trim() || '';
}

export function getSubject(compose: HTMLElement): string {
  const field = compose.querySelector<HTMLInputElement>(SELECTORS.subjectField);
  return field?.value?.trim() || '';
}

export function getBodyElement(compose: HTMLElement): HTMLElement | null {
  return compose.querySelector<HTMLElement>(SELECTORS.bodyField);
}

/**
 * Injects tracking pixel HTML into the compose body.
 * Works with both plain text and rich HTML compose modes.
 */
export function injectTrackingPixel(compose: HTMLElement, pixelHTML: string): boolean {
  const body = getBodyElement(compose);
  if (!body) return false;

  // Avoid duplicate injection
  if (body.querySelector('[data-mailtrack-pixel]')) return true;

  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-mailtrack-pixel', 'true');
  wrapper.style.display = 'none';
  wrapper.innerHTML = pixelHTML;
  body.appendChild(wrapper);
  return true;
}

export function findToolbarArea(compose: HTMLElement): HTMLElement | null {
  return compose.querySelector<HTMLElement>(SELECTORS.toolbarArea);
}
