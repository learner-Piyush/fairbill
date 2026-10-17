# FairBill Architecture & System Design

## Overview
FairBill is an automated medical bill auditing platform designed to identify **possible overcharges** on hospital and healthcare bills. It provides patients with transparent, data-driven insights and dispute letters to negotiate their medical bills without providing legal advice or accusatory rhetoric.

## Privacy & Security Principles
- **No Raw File or Text Retention**: FairBill NEVER persists uploaded bill files (PDFs, images) or raw OCR text to databases, disk, or logs.
- **Ephemeral Processing**: Files are processed in memory during the extraction pipeline and immediately discarded.
- **Structured Storage Only**: Only structured data (provider name, date of service, billing codes, amounts, and audit results) is stored.
- **Zero Secrets in Source**: All API keys, database credentials, and secrets are configured via environment variables.

---

## Data Models

FairBill uses Prisma ORM with NeonDB (serverless PostgreSQL).

### `Audit`
Represents an audit session for a single medical bill.

| Field | Type | Description |
|---|---|---|
| `id` | `String` (cuid) | Unique identifier for the audit |
| `userId` | `String` | Clerk user ID who owns this audit |
| `createdAt` | `DateTime` | Timestamp of creation |
| `updatedAt` | `DateTime` | Timestamp of last update |
| `providerName` | `String?` | Hospital, clinic, or healthcare provider name |
| `totalBilled` | `Decimal` | Total amount charged on the bill |
| `totalPossibleOvercharge` | `Decimal` | Estimated total possible overcharge across all items |
| `status` | `AuditStatus` | Status of the audit (`PENDING`, `COMPLETED`, `FAILED`) |
| `items` | `AuditItem[]` | Relation to line items evaluated in this audit |

### `AuditItem`
Represents an individual line item extracted and audited from the bill.

| Field | Type | Description |
|---|---|---|
| `id` | `String` (cuid) | Unique identifier for the audit line item |
| `auditId` | `String` | Foreign key referencing `Audit` |
| `cptCode` | `String?` | Standard billing code (CPT, HCPCS, or Revenue code) |
| `description` | `String` | Line item description |
| `billedAmount` | `Decimal` | Amount billed for this item |
| `benchmarkAmount` | `Decimal?` | Fair price benchmark (e.g. median commercial/Medicare rate) |
| `possibleOvercharge` | `Decimal?` | Identified possible overcharge amount |
| `explanation` | `String?` | Non-accusatory rationale for why this may be a possible overcharge |
| `createdAt` | `DateTime` | Timestamp of creation |

---

## Services Pipeline (`api/app/services/`)

The analysis pipeline consists of four modular services:

1. **`extract.py`**:
   Extracts structured line items, dates, and charges from ephemeral bill documents using multimodal AI (Gemini via `google-genai` SDK). Raw files are never saved to disk or persistent storage.
2. **`match.py`**:
   Matches extracted item descriptions to standardized CPT/HCPCS/DRG billing codes using fuzzy matching and embedding classifiers (`scikit-learn`, `pandas`).
3. **`audit.py`**:
   Compares charged amounts against regional benchmark pricing distributions to detect possible overcharges or duplicate billing.
4. **`letter.py`**:
   Generates a respectful, formal request for itemized billing and price reconsideration.

## User-Facing Policy
All user-facing language strictly uses the term **"possible overcharge"**. The application never accuses hospitals of fraud or malpractice and does not provide legal advice.
