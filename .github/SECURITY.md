# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Standards & Threat Mitigation

The EduVault E-Learning Platform implements multi-layer defense-in-depth:
- **SSRF Prevention:** Strict whitelisting for all Google Apps Script API communication.
- **Formula Injection Mitigation:** String inputs are automatically sanitized to neutralize spreadsheet formula injection (`=`, `+`, `-`, `@`, `|`).
- **HTTP Security Headers:** Strict Content Security Policy (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security`.
- **Automated CI Scanning:** GitHub CodeQL static analysis and secret detection on all commits.
- **Supply-Chain Integrity:** Dependencies pinned and validated against `package-lock.json`.

## Reporting a Vulnerability

If you discover a potential security vulnerability in this project, please report it privately:
1. Do not open a public issue.
2. Email: `chanveasnaheng19@gmail.com` with vulnerability details and reproduction steps.
3. You will receive an acknowledgment within 24 hours.
