# Godfred Project

# Week 0 — Foundation & Environment Setup

**Sprint:** 4th April – 11 April 2026  
**Trainee:** Godfred Awudi  
**Programme:** Xcelsz Technology Traineeship — Knowledge Stage  
**Project:** Personal Brand Platform (Home of Your Personal Brand)

---

## Overview

Week 0 is the foundation sprint. No product features are built this week — only the platform infrastructure that enables weekly value drops from Week 1 onwards.

By the end of Week 0 the platform is:

- Fully structured as a monorepo
- Running a dynamic frontend architecture (SPA + Card + Modal system)
- Running a backend API with health endpoint
- Deployed to staging with CI/CD automation
- Test automation configured and passing
- Environment variables managed securely
- Optimax (XAWoW) ways of working foundation completed

---

## Tech Stack

| Layer       | Technology                                                |
| ----------- | --------------------------------------------------------- |
| Frontend    | React + TypeScript + Vite + Tailwind CSS v4 + Material UI |
| Backend     | Node.js + Express.js                                      |
| Monorepo    | Turbo + NPM Workspaces                                    |
| Testing     | Jest + Supertest                                          |
| CI/CD       | GitHub Actions                                            |
| Hosting     | Vercel (Frontend)                                         |
| Database    | Supabase (configured, ready for Week 1)                   |
| Security    | Cloudflare (configured, ready for Week 1)                 |
| API Testing | Postman                                                   |

---

## Monorepo Structure

```
my-monorepo/
├── apps/
│   ├── frontend/          # React + TypeScript + Vite SPA
│   │   └── src/
│   │       ├── components/
│   │       │   ├── Card.tsx
│   │       │   ├── Modal.tsx
│   │       │   ├── InfoPanel.tsx
│   │       │   ├── DynamicRenderer.tsx
│   │       │   └── registry.ts
│   │       ├── config/
│   │       │   ├── cards.json
│   │       │   └── dashboard.json
│   │       ├── pages/
│   │       │   ├── Dashboard.tsx
│   │       │   └── AboutPage.tsx
│   │       └── App.tsx
│   └── backend/           # Node.js + Express API
│       ├── src/
│       │   └── index.js
│       └── tests/
│           └── health.test.js
├── packages/
│   └── shared/            # Shared constants and events
│       └── src/
│           ├── events.js
│           └── index.js
├── scripts/
│   ├── deploy.sh
│   ├── build.sh
│   └── test.sh
├── .github/
│   └── workflows/
│       └── ci.yml
├── .env.example
├── turbo.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- Git

Verify your setup:

```bash
node -v
npm -v
git --version
```

### Installation

```bash
# Clone the repository
git clone https://github.com/awudigodfredx/my-monorepo.git
cd my-monorepo

# Install all dependencies
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```
DATABASE_URL=
SUPABASE_URL=
SUPABASE_KEY=
API_PORT=3001
NODE_ENV=development
```

> Never commit `.env` to GitHub. It is listed in `.gitignore`.

---

## Running Locally

### Run everything (frontend + backend)

```bash
npm run dev
```

### Run frontend only

```bash
cd apps/frontend
npm run dev
```

Open: `http://localhost:5173`

### Run backend only

```bash
cd apps/backend
node src/index.js
```

Open: `http://localhost:3001/api/v1/health`

Expected response:

```json
{ "status": "ok" }
```

---

## Running Tests

```bash
# From root
npm test

# From backend
cd apps/backend
npm test
```

Expected output:

```
✓ health endpoint returns ok
Tests: 1 passed
```

---

## Dynamic Architecture

The frontend uses a fully config-driven architecture. No content is hardcoded in JSX.

### How it works

1. Content is defined in JSON config files (`dashboard.json`, `cards.json`)
2. `DynamicRenderer.tsx` reads the component type from JSON
3. `registry.ts` lazy loads the correct component
4. Components receive props directly from JSON
5. Adding a new section requires only a JSON entry — no JSX changes

### Example — adding a new card

Add this to `src/config/dashboard.json`:

```json
{
  "id": 5,
  "componentType": "Card",
  "title": "New Project",
  "description": "This renders automatically",
  "onClickType": "modal"
}
```

Save the file. The card appears in the dashboard immediately.

### Architecture components

| Component             | Purpose                                               |
| --------------------- | ----------------------------------------------------- |
| `Card.tsx`            | Reusable card with title, description, and CTA button |
| `Modal.tsx`           | Dynamic modal displaying content from JSON props      |
| `InfoPanel.tsx`       | Static info display panel                             |
| `registry.ts`         | Maps component names to lazy-loaded imports           |
| `DynamicRenderer.tsx` | Renders any registered component from a string name   |
| `Dashboard.tsx`       | Loads sections from `dashboard.json` and renders them |

---

## Branching Strategy

| Branch        | Environment       |
| ------------- | ----------------- |
| `feature/*`   | Local development |
| `development` | Staging           |
| `main`        | Production        |

### Workflow

```
feature/* → development → main
```

### Creating a feature branch

```bash
git checkout -b feature/your-feature-name
```

---

## CI/CD Pipeline

GitHub Actions runs automatically on every push to `development` and `main`.

Pipeline steps:

1. Checkout code
2. Install dependencies
3. Run tests
4. Build project

See `.github/workflows/ci.yml` for the full pipeline configuration.

---

## Deployment

### Staging

Automatically deployed to Vercel on every push to `development`.

### Production

```bash
npm run deploy
```

This runs `scripts/deploy.sh` which builds, tests, and deploys to Vercel production.

---

## Week 0 Completion Checklist

| Item                                 | Status |
| ------------------------------------ | ------ |
| GitHub repo created                  | ✅     |
| Monorepo structure ready             | ✅     |
| Turbo installed and configured       | ✅     |
| Frontend runs locally (TypeScript)   | ✅     |
| Backend runs locally                 | ✅     |
| API health endpoint works            | ✅     |
| Jest tests run successfully          | ✅     |
| Branching strategy created           | ✅     |
| CI/CD pipeline configured            | ✅     |
| SPA + Cards + Modals + Dashboard     | ✅     |
| Component registry + DynamicRenderer | ✅     |
| JSON-driven config                   | ✅     |
| deploy.sh script                     | ✅     |
| .env + .env.example                  | ✅     |
| Vercel account ready                 | ✅     |
| Supabase account ready               | ✅     |
| Cloudflare account ready             | ✅     |
| Postman installed                    | ✅     |
| Optimax (XAWoW) reading completed    | ✅     |

---

## Peer Polish & Validation

| Review                | Issue                                                       | Status                |
| --------------------- | ----------------------------------------------------------- | --------------------- |
| Peer Polish           | [#4](https://github.com/awudigodfredx/my-monorepo/issues/4) | Open — pending review |
| Clean Code Validation | [#5](https://github.com/awudigodfredx/my-monorepo/issues/5) | Open — pending review |

Sprint Demo: [Loom Video](#) _(attach link)_  
Staging URL: _(attach Vercel URL)_  
PR: [#3](https://github.com/awudigodfredx/my-monorepo/pull/3)

---

## Ways of Working

This project follows the **Optimax (XAWoW)** way of working:

- **Stay Focused** — every task connects to the sprint goal
- **Fail Fast** — try, learn, adjust quickly
- **Be Transparent** — blockers raised immediately, tickets updated daily
- **Dream Unlimited** — build beyond the minimum
- **Love Always** — care about quality and teammates

Every feature follows the full DevSecOps lifecycle:  
**Plan → Build → Test → Deploy → Observe → Secure → Recover → Analyze → Improve**

---

## Next Steps — Week 1

Build the **Home Page Hero Section**:

- Heading, subheading, paragraph
- CTAs: Work With Me | Connect With Me
- Profile card (right side)
- Fully dynamic, API-first, TypeScript
- Deployed to staging by end of Tuesday

---

_Xcelsz Technology Traineeship — Knowledge Stage — Cohort 1_
