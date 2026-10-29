# Contributing to FairBill

Thank you for your interest in contributing to FairBill! We welcome contributions from developers, designers, data analysts, and healthcare subject matter experts.

---

## Core Development Rules

1. **Branch Management**
   - **Never push directly to `main`**. All work must be conducted on a feature or fix branch and submitted as a pull request (PR).
   - Use descriptive branch names prefixed with the area of work:
     - `feat/add-medicare-2025-rates`
     - `fix/arithmetic-mismatch-edge-case`
     - `docs/community-files`
     - `test/privacy-log-checks`
   - **Do not merge your own PR**. All PRs must pass CI checks and receive review from a maintainer.

2. **Commit Message Format (Conventional Commits)**
   - All commit titles must follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
     - `feat: add support for HCPCS level II codes`
     - `fix: resolve floating point issue in overcharge total`
     - `test: add privacy assertions for file upload buffer handling`
     - `docs: update setup instructions in README`
     - `chore: update dependencies in web package.json`
   - Keep titles concise (under 70 characters).

3. **Privacy & Security Constraints (HARD RULES)**
   - **Never commit secrets**, API keys, real medical bills, or real personal health information (PHI). Use `.env.example` placeholders and synthetic sample data for tests.
   - **Zero Retention Rule**: Code must never save uploaded medical bills (PDFs, images) or raw OCR bill text to disk, persistent storage, or log files. Process files purely in memory (`bytes` / stream buffers).

4. **Non-Accusatory Tone Constraint (HARD RULE)**
   - All user-facing explanations, audit findings, and dispute letters **must** use objective, non-accusatory language.
   - Always refer to flagged discrepancies as **"possible overcharges"**. Never accuse healthcare providers or hospitals of fraud, illegal billing, or malpractice.

5. **Dependabot Configuration**
   - **Do not create or edit Dependabot configuration files**. We manage dependency updates manually.

---

## How to Add Reference Prices

FairBill uses reference price databases (such as Medicare Fee Schedules and regional benchmark pricing) to evaluate billed amounts.

Reference price datasets are loaded in the API service (`api/app/services/reference.py`) from CSV data files (e.g., `api/data/reference_prices.csv` or fee schedule datasets).

### Structure of Reference Price CSV Records

Each reference price entry in the dataset requires the following columns:

| Column Header | Description | Example |
|---|---|---|
| `item_key` | Standard CPT/HCPCS/DRG code or internal billing key | `99285` |
| `display_name` | Human-readable name of the procedure/item | `Emergency Department Visit - Level 5` |
| `category` | Category of charge (`Evaluation`, `Laboratory`, `Imaging`, `Pharmacy`) | `Evaluation` |
| `unit` | Pricing unit (`service`, `procedure`, `mg`, `day`) | `service` |
| `ceiling_or_reference_price` | Benchmark price ceiling in USD (numeric float) | `450.00` |
| `source` | Official benchmark source name | `Medicare Physician Fee Schedule 2024` |
| `source_url` | URL pointing to public dataset or CMS documentation | `https://www.cms.gov/medicare/physician-fee-schedule` |
| `effective_date` | Effective date of the pricing data (`YYYY-MM-DD`) | `2024-01-01` |

### Steps to Add or Update Reference Prices:

1. **Locate or create the reference CSV** under `api/data/` or update default data structures in `api/app/services/reference.py`.
2. **Ensure correct formatting**:
   - Headers must match required field names exactly.
   - `item_key` values must be unique across the dataset.
   - Prices must be valid positive numeric values (no currency symbols).
3. **Add automated tests**:
   - Add unit tests in `api/tests/test_reference.py` to verify that the new reference prices load correctly and validate schema requirements.
4. **Verify**:
   - Run `api/.venv/bin/pytest api/tests/test_reference.py` locally to confirm dataset parsing.

---

## Pull Request Guidelines

Before submitting a PR, ensure:
1. `make check` passes cleanly on your machine.
2. New logic or rules include corresponding unit tests.
3. Relevant documentation (README, architecture, or inline docstrings) is updated.
4. UI changes include screenshots attached to the PR description.
