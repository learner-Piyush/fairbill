# Good First Issues

This document contains 10 well-defined, actionable issues suitable for first-time contributors to FairBill. Each issue includes a summary, context, suggested approach, affected files, and definition of done.

---

### Issue 1: Add Input Validation and File Size Limit for Ephemeral Document Upload Endpoint

- **Area**: Backend (`api/`)
- **Tags**: `good first issue`, `backend`, `validation`
- **Description**:
  Currently, document upload endpoints accept arbitrary bytes without enforcing file size limits or strict MIME-type validation. To prevent memory exhaustion and invalid file processing, the FastAPI upload router should reject payloads exceeding 10 MB or unsupported MIME types (supported: `application/pdf`, `image/png`, `image/jpeg`).
- **Suggested Approach**:
  1. Add helper validation functions in `api/app/routers/audit.py` or middleware.
  2. Inspect HTTP payload size and MIME headers before reading full bytes into memory.
  3. Return HTTP `413 Payload Too Large` or `400 Bad Request` with structured error messages.
- **Relevant Files**:
  - `api/app/routers/audit.py`
  - `api/app/schemas.py`
  - `api/tests/test_audit.py`
- **Definition of Done**:
  - Files over 10 MB or with non-supported MIME types are rejected with standard HTTP status codes.
  - Unit tests in `api/tests/` verify both valid and invalid file uploads.

---

### Issue 2: Add Price Benchmark Lookup Unit Test for Edge Cases in Reference Service

- **Area**: Backend (`api/`)
- **Tags**: `good first issue`, `tests`, `python`
- **Description**:
  `api/app/services/reference.py` handles parsing reference price CSV datasets. While happy-path loading is tested, edge cases such as empty values, malformed header names, negative amounts, and duplicate item keys need explicit unit tests.
- **Suggested Approach**:
  1. Open `api/tests/test_reference.py`.
  2. Create test functions that pass mock CSV strings (using `io.StringIO`) into `load_reference_prices`.
  3. Assert that `ValueError` is raised with descriptive exception messages for malformed input.
- **Relevant Files**:
  - `api/app/services/reference.py`
  - `api/tests/test_reference.py`
- **Definition of Done**:
  - Tests covering missing headers, duplicate keys, and invalid numeric values exist and pass in `pytest`.

---

### Issue 3: Enhance UI Loading Spinner & Processing Animation on Audit Processing Page

- **Area**: Frontend (`web/`)
- **Tags**: `good first issue`, `frontend`, `ui`, `ux`
- **Description**:
  The `/audit/processing` page in the web app shows a basic loading text while an audit runs. Replacing this with an animated step-by-step indicator (e.g. "Extracting line items...", "Matching CPT codes...", "Evaluating Medicare benchmarks...") provides a more engaging user experience.
- **Suggested Approach**:
  1. Locate `/audit/processing` component in `web/src/app/audit/processing/page.tsx` (or equivalent route component).
  2. Implement a step state sequence with CSS transitions or Tailwind animations.
  3. Ensure accessible ARIA attributes (`aria-busy`, `role="status"`) are present.
- **Relevant Files**:
  - `web/src/app/audit/processing/page.tsx` (or `web/src/components/`)
- **Definition of Done**:
  - Visual step progress indicators cycle smoothly during processing.
  - Next.js build (`npm --prefix web run build`) succeeds with zero lint warnings.

---

### Issue 4: Export Audit Summary to Print-Friendly Layout / Copyable Plain Text

- **Area**: Frontend (`web/`)
- **Tags**: `good first issue`, `frontend`, `accessibility`
- **Description**:
  Users need a way to easily print or copy the audit report. Adding a "Print / Export Report" button that uses browser `@media print` styles or formats the audit line items into clean plain text for clipboard copying will improve accessibility.
- **Suggested Approach**:
  1. Add a "Copy Audit Summary" or "Print Report" action button in the audit summary view (`web/src/app/audit/`).
  2. Add print-specific CSS rules in Tailwind (e.g., `print:hidden` for navigation headers) so printing outputs a clean 1-page document.
- **Relevant Files**:
  - `web/src/app/audit/` components
  - `web/src/app/globals.css`
- **Definition of Done**:
  - Clicking "Copy Summary" copies structured text to the user's clipboard.
  - Triggering `window.print()` hides non-essential navigation UI.

---

### Issue 5: Add Rule Explanation Tooltips for Flags in the Audit Results Table

- **Area**: Frontend (`web/`)
- **Tags**: `good first issue`, `frontend`, `accessibility`
- **Description**:
  When a line item is flagged with a rule like `PRICE_ABOVE_REFERENCE` or `UNBUNDLED_ITEM`, users need quick contextual explanations of what the rule means in plain, non-accusatory language.
- **Suggested Approach**:
  1. Create a reusable `RuleTooltip` component or update `AuditItem` rendering in `web/src/`.
  2. Map rule IDs (`PRICE_ABOVE_REFERENCE`, `DUPLICATE_LINE`, `ARITHMETIC_MISMATCH`, `GST_INCONSISTENCY`, `UNBUNDLED_ITEM`) to beginner-friendly explanation cards.
  3. Ensure tooltips are accessible via keyboard navigation (`focus` / `hover`).
- **Relevant Files**:
  - `web/src/app/audit/` or `web/src/components/`
- **Definition of Done**:
  - Tooltips display non-accusatory explanations when hovering or focusing audit flags.

---

### Issue 6: Add Non-Accusatory Wording Linter Assertion in Web Test Suite

- **Area**: Frontend Testing (`web/`)
- **Tags**: `good first issue`, `testing`, `policy`
- **Description**:
  FairBill enforces a hard rule: user-facing wording must always refer to discrepancies as "possible overcharge" and never use words like "fraud", "scam", or "overcharged". Adding a lightweight test in `web/tests/` to inspect UI mock fixtures for banned terms will safeguard compliance.
- **Suggested Approach**:
  1. Edit `web/tests/fixture.test.mjs` (or add a dedicated assertion script).
  2. Traverse UI test fixtures and verify no strings contain forbidden words (`fraud`, `illegal`, `malpractice`, `scam`).
  3. Assert that all flagged overcharge strings include the phrase "possible overcharge".
- **Relevant Files**:
  - `web/tests/fixture.test.mjs`
- **Definition of Done**:
  - Running `npm --prefix web run test` executes the terminology compliance check and passes.

---

### Issue 7: Add CPT Code Format Normalizer and Cleaner Helper

- **Area**: Backend (`api/`)
- **Tags**: `good first issue`, `python`, `data-cleaning`
- **Description**:
  Extracted CPT/HCPCS codes from OCR or raw bill text often contain extraneous whitespace, trailing dashes, or lowercase characters (e.g. `" 99285-59 "`, `"cpt 80053"`). A normalization utility function is needed to strip prefixes, whitespace, and sanitize 5-character CPT/HCPCS codes.
- **Suggested Approach**:
  1. Implement a `normalize_cpt_code(raw_code: str) -> str` utility function in `api/app/services/match.py`.
  2. Handle common variations (uppercase conversion, whitespace stripping, prefix removal like `CPT:`).
  3. Write comprehensive unit tests in `api/tests/`.
- **Relevant Files**:
  - `api/app/services/match.py`
  - `api/tests/test_audit.py` (or new test file)
- **Definition of Done**:
  - `normalize_cpt_code` correctly sanitizes various code string formats.
  - Tests pass with `pytest`.

---

### Issue 8: Add Health Check Endpoint Details (Uptime and Service Version)

- **Area**: Backend (`api/`)
- **Tags**: `good first issue`, `fastapi`, `backend`
- **Description**:
  The current `/health` endpoint returns a basic status dictionary. Expanding the response to include the API version (`0.1.0`), Python runtime version, and application startup timestamp will aid deployment monitoring and diagnostics.
- **Suggested Approach**:
  1. Update `api/app/routers/health.py` to record the server startup timestamp.
  2. Return structured JSON with keys: `status`, `version`, `uptime_seconds`, and `python_version`.
  3. Update `api/tests/test_health.py` to assert the updated payload fields.
- **Relevant Files**:
  - `api/app/routers/health.py`
  - `api/tests/test_health.py`
- **Definition of Done**:
  - GET `/health` returns the enriched status JSON.
  - `pytest api/tests/test_health.py` passes.

---

### Issue 9: Implement Jinja2 Dispute Letter Customization Parameters

- **Area**: Backend (`api/`)
- **Tags**: `good first issue`, `python`, `templates`
- **Description**:
  `api/app/services/letter.py` generates formal dispute letters. Adding customizable parameters (such as patient account number, facility address, and optional request for itemized CPT breakdown) will make generated letters more versatile for users.
- **Suggested Approach**:
  1. Inspect `api/app/services/letter.py` and letter Jinja2 template strings.
  2. Extend `LetterRequest` schema in `api/app/schemas.py` with optional fields (`patient_account_number`, `facility_address`, `custom_notes`).
  3. Render optional blocks in the Jinja2 template if parameters are provided.
- **Relevant Files**:
  - `api/app/services/letter.py`
  - `api/app/schemas.py`
  - `api/tests/test_letter.py`
- **Definition of Done**:
  - Passing custom fields to the letter generator includes them in the output text.
  - `test_letter.py` verifies rendering with and without optional parameters.

---

### Issue 10: Add Mock API Endpoint for Simulating Processing Errors in Development

- **Area**: Backend & Frontend (`api/`, `web/`)
- **Tags**: `good first issue`, `developer-experience`, `testing`
- **Description**:
  To test UI error states (e.g. unreadable bill format, missing line items, or timeout), the backend should support a query flag `?simulate_error=true` on audit endpoints when running in local development mode (`ENVIRONMENT=development`).
- **Suggested Approach**:
  1. In `api/app/routers/audit.py`, check if `simulate_error` query param is `true` and environment is development.
  2. If set, return an HTTP 422 or 400 error response with a non-accusatory error message ("Unable to extract readable itemized line items from document").
  3. Verify the web client gracefully displays the error message and offers a retry option.
- **Relevant Files**:
  - `api/app/routers/audit.py`
  - `api/tests/test_audit.py`
- **Definition of Done**:
  - Dev-mode error simulation returns clean error responses.
  - Unit tests confirm `simulate_error` raises expected HTTP exceptions.
