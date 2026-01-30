# KubeSecure Control Plane – Initialization Plan

## Overview

This document outlines the end-to-end plan to initialize all applications in the monorepo with a modern tech stack aligned with the product's security-first, GitOps-based architecture.

---

## Tech Stack Selection

### Core Stack
- **Monorepo**: Turborepo (already configured)
- **Package Manager**: pnpm 9.0.0 (already configured)
- **Language**: TypeScript 5.9+ (already configured)
- **Node.js**: >=18 (already configured)

### Apps Technology Stack

#### 1. **apps/api** (Backend API)
- **Framework**: [Fastify](https://www.fastify.io/) (high performance, TypeScript-first, plugin ecosystem)
- **Validation**: [Zod](https://zod.dev/) (runtime type validation, aligns with security-first)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/) ORM
- **Auth**: [Clerk](https://clerk.com/) or [Auth0](https://auth0.com/) (SOC2-ready, multi-tenant)
- **API Documentation**: [Swagger/OpenAPI](https://swagger.io/) via `@fastify/swagger`
- **Logging**: [Pino](https://getpino.io/) (structured logging, audit-ready)
- **Testing**: [Vitest](https://vitest.dev/) + [Supertest](https://github.com/ladjs/supertest)
- **Event System**: [BullMQ](https://docs.bullmq.io/) (Redis-based job queue for event-driven architecture)

#### 2. **apps/web** (Frontend)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React Server Components)
- **UI Framework**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives, Tailwind CSS)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (lightweight, TypeScript-first)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + Zod validation
- **Auth**: Clerk/Auth0 SDK (matches backend)
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)

#### 3. **apps/agent** (Kubernetes Agent)
- **Language**: [Go](https://go.dev/) (native Kubernetes client, small binary, perfect for agents)
- **Kubernetes Client**: [client-go](https://github.com/kubernetes/client-go)
- **Metrics**: [Prometheus Go client](https://github.com/prometheus/client_golang)
- **HTTP Client**: Standard `net/http` or [resty](https://github.com/go-resty/resty)
- **Config**: [Viper](https://github.com/spf13/viper) (Helm-friendly config)
- **Logging**: [zerolog](https://github.com/rs/zerolog) (structured logging)
- **Testing**: Go standard `testing` package + [testify](https://github.com/stretchr/testify)

### Shared Packages Technology

#### **packages/domain**
- **Type System**: TypeScript with Zod schemas
- **Event Sourcing**: Custom event store (append-only, immutable)

#### **packages/cost-engine**
- **Calculation**: TypeScript with mathematical libraries
- **Time Series**: Custom or lightweight library

#### **packages/policies**
- **Rule Engine**: [json-rules-engine](https://github.com/CacheControl/json-rules-engine) or custom
- **Validation**: Zod schemas

#### **packages/gitops**
- **Git Operations**: [simple-git](https://github.com/steveukx/git-js) or [nodegit](https://www.nodegit.org/)
- **GitHub API**: [@octokit/rest](https://github.com/octokit/octokit.js)
- **GitLab API**: [@gitbeaker/core](https://github.com/jdalrymple/gitbeaker)

#### **packages/llm**
- **LLM Client**: [OpenAI SDK](https://github.com/openai/openai-node) or [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript)
- **Prompt Management**: Structured prompt templates

---

## Phase 1: Foundation & Infrastructure

### 1.1 Monorepo Configuration
- [ ] Update `turbo.json` with app-specific tasks
- [ ] Configure shared TypeScript configs for each app type
- [ ] Set up ESLint configs for API, Web, and Agent
- [ ] Configure Prettier with shared config
- [ ] Add `.prettierrc` and `.prettierignore`

### 1.2 CI/CD Pipeline Setup
- [ ] **GitHub Actions** workflow configuration
  - [ ] Lint & type check on PR
  - [ ] Build all apps on PR
  - [ ] Run tests on PR
  - [ ] Deploy preview environments (Vercel for web, Railway/Render for API)
  - [ ] Production deployment workflow
  - [ ] Security scanning (Snyk/Dependabot)
- [ ] Configure Turborepo remote caching (Vercel)
- [ ] Set up environment variable management (GitHub Secrets)

### 1.3 Development Environment
- [ ] Docker Compose for local development (PostgreSQL, Redis)
- [ ] `.env.example` files for each app
- [ ] Local development scripts in root `package.json`
- [ ] VS Code workspace settings (recommended extensions)

---

## Phase 2: Shared Packages Initialization

### 2.1 **packages/types**
- [ ] Core domain types (Environment, Cluster, Promotion, etc.)
- [ ] API request/response types
- [ ] Event types
- [ ] Export barrel file

### 2.2 **packages/domain**
- [ ] Domain entities (immutable, append-only)
- [ ] Domain events
- [ ] Value objects
- [ ] Repository interfaces

### 2.3 **packages/config**
- [ ] Shared configuration schemas (Zod)
- [ ] Environment variable validation
- [ ] Feature flags

### 2.4 **packages/ui** (already exists, enhance)
- [ ] Complete shadcn/ui setup
- [ ] Design system tokens (colors, typography, spacing)
- [ ] Shared React components
- [ ] Storybook setup (optional)

### 2.5 **packages/eslint-config** (already exists, enhance)
- [ ] API-specific ESLint config
- [ ] Agent-specific ESLint config (if using TypeScript)
- [ ] Shared rules

### 2.6 **packages/typescript-config** (already exists, enhance)
- [ ] API-specific tsconfig
- [ ] Agent-specific tsconfig (if using TypeScript)
- [ ] Shared base configs

---

## Phase 3: Backend API (apps/api)

### 3.1 Project Setup
- [ ] Initialize Fastify project
- [ ] Configure TypeScript
- [ ] Set up project structure:
  ```
  apps/api/
  ├── src/
  │   ├── routes/          # API route handlers
  │   ├── services/         # Business logic
  │   ├── repositories/     # Data access
  │   ├── middleware/      # Auth, logging, validation
  │   ├── plugins/         # Fastify plugins
  │   ├── events/          # Event handlers
  │   ├── types/           # TypeScript types
  │   └── server.ts        # Entry point
  ├── prisma/
  │   └── schema.prisma    # Database schema
  ├── tests/
  ├── package.json
  └── tsconfig.json
  ```

### 3.2 Core Infrastructure
- [ ] Database setup (Prisma schema, migrations)
- [ ] Authentication middleware (JWT validation)
- [ ] Multi-tenant isolation middleware
- [ ] Request validation (Zod schemas)
- [ ] Error handling middleware
- [ ] Logging setup (Pino)
- [ ] Health check endpoint
- [ ] OpenAPI/Swagger documentation

### 3.3 API Routes (per API_SPEC.md)
- [ ] `POST /clusters` - Create cluster
- [ ] `GET /clusters` - List clusters
- [ ] `POST /environments` - Create environment
- [ ] `POST /environments/{id}/clusters` - Map cluster to environment
- [ ] `POST /git/repositories` - Connect Git repo
- [ ] `GET /git/repositories/{id}/state` - Get desired state
- [ ] `POST /promotions/preview` - Preview promotion
- [ ] `POST /promotions/{id}/create-pr` - Create promotion PR
- [ ] `GET /promotions/{id}` - Get promotion status
- [ ] `GET /costs` - Get cost data
- [ ] `POST /explain` - LLM explanation endpoint
- [ ] `POST /agent/v1/heartbeat` - Agent heartbeat
- [ ] `POST /agent/v1/state` - Agent state report
- [ ] `POST /agent/v1/metrics` - Agent metrics
- [ ] `GET /agent/v1/instructions` - Agent instructions

### 3.4 Services
- [ ] Environment service
- [ ] Cluster service
- [ ] Promotion service
- [ ] Cost attribution service
- [ ] Git integration service
- [ ] Policy evaluation service
- [ ] LLM explanation service
- [ ] Audit logging service

### 3.5 Testing
- [ ] Unit tests for services
- [ ] Integration tests for API routes
- [ ] Test database setup
- [ ] Mock external services (GitHub, LLM)

---

## Phase 4: Frontend Web App (apps/web)

### 4.1 Project Setup
- [ ] Initialize Next.js 15 project (App Router)
- [ ] Configure TypeScript
- [ ] Set up Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Set up project structure:
  ```
  apps/web/
  ├── src/
  │   ├── app/             # Next.js App Router
  │   │   ├── (auth)/      # Auth routes
  │   │   ├── (dashboard)/ # Protected routes
  │   │   └── api/         # API routes (if needed)
  │   ├── components/      # React components
  │   ├── lib/             # Utilities, API clients
  │   ├── hooks/           # Custom React hooks
  │   ├── stores/          # Zustand stores
  │   └── types/           # TypeScript types
  ├── public/
  ├── package.json
  └── tsconfig.json
  ```

### 4.2 Core Infrastructure
- [ ] Authentication setup (Clerk/Auth0)
- [ ] API client setup (TanStack Query)
- [ ] Error boundary components
- [ ] Loading states
- [ ] Toast notifications
- [ ] Theme provider (dark/light mode)
- [ ] Layout components

### 4.3 Key Pages/Features
- [ ] Landing page
- [ ] Sign up / Sign in
- [ ] Dashboard (overview)
- [ ] Environments page
- [ ] Clusters page
- [ ] Promotions page (list, preview, create)
- [ ] Cost dashboard
- [ ] Settings page
- [ ] Onboarding wizard

### 4.4 Components
- [ ] Environment selector
- [ ] Promotion preview card
- [ ] Cost visualization (charts)
- [ ] Drift detection indicator
- [ ] Policy violation alerts
- [ ] Git repository connection wizard
- [ ] Agent installation guide

### 4.5 Testing
- [ ] Component tests (Testing Library)
- [ ] Page tests
- [ ] E2E tests (Playwright - optional for MVP)

---

## Phase 5: Kubernetes Agent (apps/agent)

### 5.1 Project Setup
- [ ] Initialize Go module
- [ ] Set up project structure:
  ```
  apps/agent/
  ├── cmd/
  │   └── agent/
  │       └── main.go      # Entry point
  ├── internal/
  │   ├── collector/       # Cluster state collection
  │   ├── metrics/         # Metrics aggregation
  │   ├── drift/           # Drift detection
  │   ├── client/          # Control plane API client
  │   ├── auth/            # JWT handling
  │   └── config/          # Configuration
  ├── pkg/                 # Public packages (if any)
  ├── deploy/
  │   └── helm/            # Helm chart
  ├── go.mod
  └── go.sum
  ```

### 5.2 Core Features
- [ ] Kubernetes client setup (read-only RBAC)
- [ ] Control plane API client
- [ ] JWT authentication
- [ ] Heartbeat mechanism
- [ ] Cluster state collection (workloads, resources)
- [ ] Metrics aggregation (CPU, memory)
- [ ] Drift detection logic
- [ ] Configuration management (Viper)

### 5.3 Helm Chart
- [ ] Chart structure
- [ ] RBAC manifests (read-only)
- [ ] ConfigMap/Secret templates
- [ ] Deployment manifest
- [ ] Service account
- [ ] Values.yaml with defaults

### 5.4 Testing
- [ ] Unit tests
- [ ] Integration tests (with test Kubernetes cluster)
- [ ] Mock control plane API

---

## Phase 6: Package Implementations

### 6.1 **packages/gitops**
- [ ] GitHub integration (OAuth, API client)
- [ ] GitLab integration (OAuth, API client)
- [ ] Git repository state reading
- [ ] PR creation functionality
- [ ] Webhook handling utilities

### 6.2 **packages/cost-engine**
- [ ] Cost calculation algorithms
- [ ] Resource attribution logic
- [ ] Time-windowed snapshots
- [ ] Idle workload detection

### 6.3 **packages/policies**
- [ ] Policy rule engine
- [ ] Policy evaluation
- [ ] Policy violation detection
- [ ] Human-readable rule format

### 6.4 **packages/llm**
- [ ] LLM client abstraction
- [ ] Prompt templates
- [ ] Context filtering
- [ ] Explanation generation

---

## Phase 7: CI/CD Implementation

### 7.1 GitHub Actions Workflows

#### `.github/workflows/ci.yml`
```yaml
- Lint all packages
- Type check all packages
- Run tests (unit + integration)
- Build all apps
- Upload artifacts
```

#### `.github/workflows/pr.yml`
```yaml
- Run CI checks
- Deploy preview environments
- Run E2E tests (if applicable)
```

#### `.github/workflows/deploy-api.yml`
```yaml
- Build API Docker image
- Run tests
- Deploy to staging/production
- Health check verification
```

#### `.github/workflows/deploy-web.yml`
```yaml
- Build Next.js app
- Deploy to Vercel (or similar)
- Run smoke tests
```

#### `.github/workflows/release-agent.yml`
```yaml
- Build Go binary (multi-arch)
- Build and push Helm chart
- Create GitHub release
- Publish to artifact registry
```

### 7.2 Deployment Targets
- **Web**: Vercel (Next.js optimized)
- **API**: Railway, Render, or AWS ECS/Fargate
- **Agent**: GitHub Releases + Helm Chart Registry

### 7.3 Environment Management
- [ ] Staging environment setup
- [ ] Production environment setup
- [ ] Environment variable management
- [ ] Secrets management (GitHub Secrets, Vercel Secrets)

---

## Phase 8: Documentation & Developer Experience

### 8.1 Documentation
- [ ] Update README.md with setup instructions
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Architecture diagrams
- [ ] Development guide
- [ ] Deployment guide
- [ ] Contributing guide

### 8.2 Developer Tools
- [ ] VS Code workspace settings
- [ ] Recommended extensions
- [ ] Debug configurations
- [ ] Pre-commit hooks (Husky + lint-staged)
- [ ] Commit message conventions (Conventional Commits)

---

## Phase 9: Security & Compliance

### 9.1 Security Hardening
- [ ] Dependency scanning (Dependabot/Snyk)
- [ ] SAST (Static Application Security Testing)
- [ ] Secrets scanning
- [ ] Container image scanning
- [ ] OWASP Top 10 mitigation

### 9.2 Compliance
- [ ] Audit logging implementation
- [ ] RBAC implementation
- [ ] Data encryption (at rest, in transit)
- [ ] SOC2 alignment checklist

---

## Phase 10: Testing & Quality Assurance

### 10.1 Testing Strategy
- [ ] Unit test coverage targets (80%+)
- [ ] Integration test suite
- [ ] E2E test suite (critical paths)
- [ ] Performance testing
- [ ] Security testing

### 10.2 Quality Gates
- [ ] Pre-commit hooks
- [ ] PR review requirements
- [ ] Test coverage requirements
- [ ] Linting requirements
- [ ] Type checking requirements

---

## Implementation Order (Recommended)

1. **Week 1**: Phase 1 (Foundation) + Phase 2 (Shared Packages)
2. **Week 2**: Phase 3 (Backend API) - Core infrastructure + basic routes
3. **Week 3**: Phase 4 (Frontend Web) - Core pages + authentication
4. **Week 4**: Phase 5 (Agent) - Basic agent functionality
5. **Week 5**: Phase 6 (Packages) - GitOps, Cost, Policies, LLM
6. **Week 6**: Phase 7 (CI/CD) - Full pipeline setup
7. **Week 7**: Phase 8-10 (Documentation, Security, Testing)

---

## Success Criteria

- [ ] All apps build successfully
- [ ] All apps have test coverage >80%
- [ ] CI/CD pipeline runs on every PR
- [ ] Preview deployments work
- [ ] Local development environment works
- [ ] Documentation is complete
- [ ] Security scanning is automated
- [ ] All apps follow the architectural principles

---

## Notes

- All implementations must follow the core principles in `.cursor/rules.md`
- Security-first approach: no mutations, read-only agent, Git-only changes
- SOC2-ready by design: audit logs, RBAC, encryption
- Modern tech stack: latest stable versions, TypeScript-first
- Developer experience: fast feedback, good tooling, clear documentation
