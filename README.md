# KubeSecure Control Plane

A **Git-first, security-first Kubernetes control plane** that lets teams safely promote workloads across environments with visibility into cost and policy—before anything reaches production. The control plane is a decision and workflow layer between Git (intent), Kubernetes clusters (reality), and cost signals; it **never mutates clusters directly**.

---

## Overview

- **Product**: [docs/PRD.md](docs/PRD.md) — goals, users, MVP scope.
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — principles, deployment model, responsibilities.
- **Tech stack**: [docs/TECH_STACK_DETAILS.md](docs/TECH_STACK_DETAILS.md) — languages, frameworks, tools per app.

This repo is a **Turborepo monorepo** (pnpm). It contains the Control Plane apps (API, Web) and the Kubernetes Agent that runs inside your clusters.

---

## Architecture and flow

### Principles

- **Git is the only mutation path** — changes flow via Git PRs, not direct cluster writes.
- **Kubernetes agent is read-only** — observes cluster state and metrics; never applies or deletes.
- **Outbound-only** — agent connects to the Control Plane over HTTPS; Control Plane never pushes into clusters.
- **Environment is first-class** — dev/staging/prod modeled with promotion workflows.

### High-level flow

```
Git (desired state)  ──►  Control Plane  ──►  Git PR / workflows
                              ▲
Kubernetes clusters   ──►  Agent (observe) ──►  Control Plane (state, metrics, drift)
```

- **Control Plane** (API + Web): auth, environments, promotions, cost, policy, LLM explanations. It reads from Git and from agents; it does not write to clusters.
- **Agent** (per cluster): reads workloads and metrics, sends heartbeat/state/metrics to the API, can support drift detection and promotion verification.

### Data separation

- **Desired state** — in Git.
- **Observed state** — from clusters via the agent.
- **Drift** — explicit comparison; desired and observed are not merged.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full detail.

---

## Repo structure

| Path           | Description                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| **apps/api**   | Control Plane backend — Fastify, Prisma (PostgreSQL), JWT, agent and cluster routes.                  |
| **apps/web**   | Control Plane UI — Next.js, Clerk, shadcn/ui, dashboard, clusters, promotions, drift, cost.           |
| **apps/agent** | Kubernetes agent — Go, read-only observer; sends heartbeat/state/metrics to the API; deploy via Helm. |
| **packages/**  | Shared configs (ESLint, TypeScript) and UI primitives.                                                |
| **docs/**      | PRD, architecture, API spec, tech stack, quick start, threat model.                                   |

Each app has its own **README** for app-specific setup and development:

- [apps/api](apps/api) — no README yet; see [docs/QUICK_START_IMPLEMENTATION.md](docs/QUICK_START_IMPLEMENTATION.md) for API setup.
- [apps/web](apps/web/README.md) — Next.js and local dev.
- [apps/agent](apps/agent/README.md) — Go agent: config, local run, Helm deploy, code layout.

---

## Quick start

### Prerequisites

- **Node.js** ≥18 (see [package.json](package.json) `engines`)
- **pnpm** 9.x (`corepack enable && corepack prepare pnpm@9 --activate`)
- **Docker** (optional, for Postgres/Redis via `docker compose`)
- **Go** 1.21+ (only for building or changing the agent)

### Install and run

```bash
# Clone and install
git clone <repo-url>
cd kubesecure-control-plane
pnpm install

# Optional: start Postgres and Redis for the API
docker compose up -d

# Run all apps in dev (API, Web; agent is Go and run separately)
pnpm dev
```

Then:

- **API**: http://localhost:3001 (health: http://localhost:3001/health, docs: http://localhost:3001/docs if Swagger is mounted).
- **Web**: http://localhost:3000.

To run a single app:

```bash
pnpm --filter api dev
pnpm --filter web dev
```

The **agent** is Go and not started by `pnpm dev`. To run it locally (with a kubeconfig and the API running), see [apps/agent/README.md](apps/agent/README.md).

### Build and test

```bash
pnpm build
pnpm test
pnpm lint
```

---

## Documentation

| Document                                                                 | Purpose                                     |
| ------------------------------------------------------------------------ | ------------------------------------------- |
| [docs/PRD.md](docs/PRD.md)                                               | Product requirements and MVP.               |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)                             | System design and responsibilities.         |
| [docs/API_SPEC.md](docs/API_SPEC.md)                                     | API principles and Agent endpoints.         |
| [docs/TECH_STACK_DETAILS.md](docs/TECH_STACK_DETAILS.md)                 | Stack per app (Fastify, Next.js, Go, etc.). |
| [docs/QUICK_START_IMPLEMENTATION.md](docs/QUICK_START_IMPLEMENTATION.md) | Step-by-step monorepo and app setup.        |
| [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md)                             | Security and threat model.                  |
| [docs/EPICS_AND_STORIES.md](docs/EPICS_AND_STORIES.md)                   | High-level epics and stories.               |
| [docs/INITIALIZATION_PLAN.md](docs/INITIALIZATION_PLAN.md)               | Initialization and phasing.                 |

---

## Monorepo commands

| Command                         | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| `pnpm install`                  | Install dependencies for all workspaces.                |
| `pnpm dev`                      | Run dev tasks (API, Web; see [turbo.json](turbo.json)). |
| `pnpm build`                    | Build all apps and packages.                            |
| `pnpm test`                     | Run tests.                                              |
| `pnpm lint`                     | Lint.                                                   |
| `pnpm format`                   | Format with Prettier.                                   |
| `pnpm --filter <name> <script>` | Run a script in one app (e.g. `pnpm --filter api dev`). |

---

## Summary

- **Root README** (this file): project overview, architecture, flow, repo layout, quick start, and links to docs and app READMEs.
- **docs/** — product, architecture, API, tech stack, and implementation guides.
- **apps/\*/README.md** — per-app details (run, config, deploy). Start with the root README, then open the README for the app you’re working on.
