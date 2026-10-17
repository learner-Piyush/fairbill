# FairBill

FairBill is an open-source medical bill auditing platform that empowers patients to review itemized healthcare charges and discover **possible overcharges** without compromising patient privacy.

## Key Principles
- **Zero-Retention Privacy**: Uploaded medical bills and raw OCR text are processed ephemerally in-memory and never persisted to databases or disk. Only structured audit line items are stored.
- **Fair & Objective Analysis**: Findings compare charges against commercial and Medicare benchmarks to identify possible overcharges. FairBill never accuses healthcare providers of fraud or malpractice and does not provide legal advice.

## Repository Structure
- `web/` — Next.js 16 (App Router, TypeScript), Tailwind CSS 4, Clerk auth, and Prisma 7 with PostgreSQL (NeonDB).
- `api/` — FastAPI on Python 3.14, Pydantic v2 schemas, CPT code matching, and price audit service stubs.
- `docs/` — System architecture and data models (`docs/architecture.md`).

## Run locally

### 1. Web Service (Next.js)

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
```

The web dashboard is available at `http://localhost:3000`.

### 2. API Service (FastAPI)

```bash
cd api
cp .env.example .env
# Windows:
py -3.14 -m venv .venv
.venv\Scripts\activate
# Linux/macOS:
python3.14 -m venv .venv
source .venv/bin/activate

pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

The API runs at `http://localhost:8000`. Documentation is interactive at `http://localhost:8000/docs`.

### 3. Running Checks

Run the automated verification suite across both web and api:

```bash
make check
```