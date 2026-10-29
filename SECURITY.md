# Security & Privacy Policy

FairBill takes patient privacy, data security, and system safety extremely seriously. Because FairBill processes medical bills that may contain sensitive patient information, our architecture is engineered around a **zero-retention privacy policy**.

---

## Zero-Retention Privacy Architecture

1. **Ephemeral Processing**
   - Uploaded medical bill files (PDFs, PNGs, JPEGs) and raw extracted bill text exist **strictly in-memory** during processing.
   - Files are never written to disk, local temporary files (`/tmp`), cloud storage buckets, or persistent databases.
   - Raw document contents are never logged to console outputs, logger streams, or monitoring tools.

2. **Structured Storage Only**
   - FairBill stores only non-identifiable, structured audit results (e.g., CPT codes, unit prices, standard benchmark comparisons, calculated possible overcharge amounts).
   - No personal health information (PHI) or personally identifiable information (PII) from bills is retained in our databases.

3. **In-Transit Protection**
   - All network communication between the Next.js frontend, FastAPI backend microservice, and external APIs (such as Gemini AI) is encrypted in transit using TLS 1.3.

---

## Supported Versions

Security updates are applied directly to the primary development branch (`main`). We recommend running the latest release version.

| Version | Supported |
|---|---|
| `main` (Latest) | :white_check_mark: Yes |
| `< 0.1.0` | :x: No |

---

## Reporting a Vulnerability or Privacy Concern

If you discover a security vulnerability, privacy leak, or potential data retention issue within FairBill:

1. **Do NOT open a public GitHub issue.**
2. Send a detailed report via email to **security@fairbill.org**.
3. Include the following details in your report:
   - A clear description of the vulnerability or privacy concern.
   - Steps to reproduce the issue or proof-of-concept code.
   - Any potential impact on user data or system integrity.

### Response & Handling Timeline

- **Acknowledgment**: Within 48 hours of receipt.
- **Assessment**: Initial triage and severity assessment within 5 business days.
- **Remediation**: Security fixes will be developed on a private security branch and merged to `main` upon verification.

---

## Security Best Practices for Contributors

- Never commit real medical bills, test PDFs containing personal data, API keys, or database credentials.
- Use synthetic mock fixtures for testing.
- Always run `make check` locally before submitting pull requests.
