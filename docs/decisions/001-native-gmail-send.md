# ADR-001: Native Gmail Send with Pixel Injection

## Status
Accepted

## Context
We need to track email opens without building a separate email client. Options:
1. Intercept Gmail send, inject pixel, let Gmail send natively
2. Use Gmail API to send emails on behalf of user
3. Use Gmail Add-on (Workspace only, limited reach)

## Decision
Use **Option 1**: intercept send button click, register tracking with backend, inject pixel into compose body, then trigger Gmail's native send.

## Consequences
- **Pros**: Preserves all Gmail features (attachments, signatures, scheduling, aliases, rich text)
- **Cons**: Depends on Gmail DOM selectors; may break on Gmail updates
- Gmail-specific code isolated in `extension/src/gmail/`

## Alternatives Rejected
- Gmail API send: would duplicate Gmail compose functionality and break native UX
- Workspace Add-on: not available for all Gmail users
