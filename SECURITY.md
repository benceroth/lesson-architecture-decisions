# Security policy

This repository contains documentation, a static web page and a small Python linter. It holds no secrets, credentials, real subscription IDs or customer data, and must never contain any. RelayCart is fictional and all figures are illustrative.

## Reporting a problem

If you find a vulnerability (for example script injection in the calculator page, or a workflow that could leak a token), please use GitHub's private "Report a vulnerability" feature on this repository. If it is not enabled, open an issue asking for a private contact channel without including details. Do not post exploit details or secrets publicly.

## Scope notes

- The calculator runs entirely in the browser, makes no network requests, and writes to the page with `textContent` only.
- CI workflows use least-privilege `permissions`; the Pages workflow is the only one that requests `pages: write`.
- If you accidentally commit a secret, rotate it first, then remove it from history.
