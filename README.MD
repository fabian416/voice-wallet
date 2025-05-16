# Wally 🤖🗣️

Your AI voice assistant powered by [cheqd](https://cheqd.io) & [Verida](https://verida.io) .  
Wally creates a secure **voiceprint** tied to your **identity** — speak once, and prove it's really you.

---

## 🚀 How to run locally

### 1. Setup environment variables

You can use the default `.env` files provided or configure your own. The backend will connect to Postgres (default ports) unless specified otherwise.

---

### 2. Launch the Postgres database

If you have Docker installed:

```bash
docker compose up
```

---

### 3. Backend setup (NestJS + Python)

```bash
cd backend
```

#### First-time only (Python setup inside `voice-embedding/`):

```bash
python3 -m venv voice-embedding/.venv
source voice-embedding/.venv/bin/activate
pip install -r voice-embedding/requirements.txt
```

> ✅ This enables Wally to run voice processing scripts using `resemblyzer`, `torch`, etc. within an isolated environment scoped to the `voice-embedding` folder.

#### Then run the backend:

```bash
yarn install
yarn dev
```

---

### 4. Frontend setup (Next.js with PNPM)

```bash
cd frontend
pnpm install
pnpm dev
```

---

## ⚖️ About the stack

Yes, we're using **different package managers** (`yarn` for backend, `pnpm` for frontend).  
If you have a strong preference, let us know — we’re in the middle of an eternal internal debate (`npm` vs `pnpm` vs `yarn`) 😅

---

### 🧠 Voice AI Features

- Record your voice and generate a unique **voiceprint** embedding.
- Link that embedding to a DID via **DID-Linked Resources** (cheqd).
- Verify your identity later by comparing live input against your stored voiceprint.