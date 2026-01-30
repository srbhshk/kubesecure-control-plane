# Tech Stack Details – KubeSecure Control Plane

## Quick Reference

### Apps

| App | Language | Framework | Key Dependencies |
|-----|----------|-----------|------------------|
| **api** | TypeScript | Fastify | Prisma, Zod, Pino, BullMQ |
| **web** | TypeScript | Next.js 15 | React, shadcn/ui, TanStack Query |
| **agent** | Go | Standard Library | client-go, Prometheus, Viper |

---

## Detailed Stack Breakdown

### Backend API (apps/api)

#### Core Framework
- **Fastify** v4.x
  - High performance (2x faster than Express)
  - TypeScript-first
  - Plugin ecosystem
  - Built-in validation
  - JSON Schema support

#### Database & ORM
- **PostgreSQL** 15+
  - ACID compliance
  - JSONB support for flexible schemas
  - Full-text search
  - Multi-tenant isolation via row-level security

- **Prisma** 5.x
  - Type-safe database client
  - Migration system
  - Query optimization
  - Multi-database support (future-proof)

#### Validation
- **Zod** 3.x
  - Runtime type validation
  - TypeScript inference
  - Schema composition
  - Error messages

#### Authentication & Authorization
- **Clerk** (recommended) or **Auth0**
  - SOC2 Type II certified
  - Multi-tenant support
  - JWT management
  - RBAC built-in
  - Webhook support

#### Logging & Observability
- **Pino** 8.x
  - Fast, structured logging
  - JSON output (audit-friendly)
  - Log levels
  - Child loggers

- **OpenTelemetry** (optional, for future)
  - Distributed tracing
  - Metrics collection

#### Job Queue & Events
- **BullMQ** 5.x
  - Redis-backed
  - Job scheduling
  - Retry logic
  - Event-driven architecture support

- **Redis** 7.x
  - Job queue backend
  - Caching (optional)
  - Pub/sub (optional)

#### API Documentation
- **@fastify/swagger** + **@fastify/swagger-ui**
  - OpenAPI 3.0 generation
  - Interactive API docs
  - Type-safe from Zod schemas

#### Testing
- **Vitest** 1.x
  - Fast, Vite-powered
  - TypeScript support
  - Coverage reports

- **Supertest** 6.x
  - HTTP assertion library
  - Integration testing

- **MSW** (Mock Service Worker) 2.x
  - API mocking
  - Network-level mocking

---

### Frontend Web (apps/web)

#### Core Framework
- **Next.js** 15.x
  - App Router (latest)
  - React Server Components
  - Server Actions
  - Built-in optimizations
  - Image optimization

- **React** 19.x (via Next.js)
  - Latest React features
  - Server Components
  - Suspense

#### Styling & UI
- **Tailwind CSS** 3.x
  - Utility-first CSS
  - JIT compilation
  - Dark mode support

- **shadcn/ui**
  - Accessible components
  - Radix UI primitives
  - Customizable
  - Copy-paste components

- **Radix UI**
  - Unstyled, accessible components
  - Keyboard navigation
  - ARIA attributes

#### State Management
- **Zustand** 4.x
  - Lightweight (1KB)
  - TypeScript-first
  - No boilerplate
  - DevTools support

#### Data Fetching
- **TanStack Query** (React Query) 5.x
  - Server state management
  - Caching
  - Background updates
  - Optimistic updates

#### Forms
- **React Hook Form** 7.x
  - Performance (uncontrolled components)
  - Validation integration
  - TypeScript support

- **Zod** (shared with backend)
  - Form validation
  - Type inference

#### Charts & Visualization
- **Recharts** 2.x or **Chart.js** 4.x
  - Cost visualization
  - Metrics dashboards
  - Responsive charts

#### Authentication
- **Clerk** or **Auth0** SDK
  - React hooks
  - Protected routes
  - User management

#### Testing
- **Vitest** 1.x
  - Unit testing
  - Component testing

- **@testing-library/react** 14.x
  - Component testing
  - User-centric testing

- **Playwright** (optional, for E2E)
  - End-to-end testing
  - Cross-browser testing

---

### Kubernetes Agent (apps/agent)

#### Core Language
- **Go** 1.21+
  - Native Kubernetes client
  - Small binary size
  - Fast startup
  - Cross-platform compilation

#### Kubernetes Client
- **k8s.io/client-go** v0.28+
  - Official Kubernetes client
  - Type-safe
  - Watch support
  - Informers

- **k8s.io/api** v0.28+
  - Kubernetes API types

- **k8s.io/apimachinery** v0.28+
  - Kubernetes utilities

#### Metrics
- **github.com/prometheus/client_golang** v1.x
  - Prometheus metrics
  - Instrumentation
  - Metrics export

#### HTTP Client
- **net/http** (standard library)
  - Simple, reliable
  - TLS support
  - Timeout handling

- **github.com/go-resty/resty** v2.x (optional)
  - HTTP client wrapper
  - Retry logic
  - Middleware support

#### Configuration
- **github.com/spf13/viper** v1.x
  - Configuration management
  - Environment variables
  - Config files
  - Helm-friendly

#### Logging
- **github.com/rs/zerolog** v1.x
  - Structured logging
  - JSON output
  - Performance

#### Testing
- **testing** (standard library)
  - Unit testing
  - Benchmarking

- **github.com/stretchr/testify** v1.x
  - Assertions
  - Mocking
  - Test suites

#### Kubernetes Testing
- **sigs.k8s.io/controller-runtime/pkg/envtest**
  - Test Kubernetes cluster
  - Integration testing

---

## Shared Packages

### packages/types
- **TypeScript** only
- Shared type definitions
- API contracts
- Domain types

### packages/domain
- **TypeScript** + **Zod**
- Domain entities
- Domain events
- Value objects
- Repository interfaces

### packages/gitops
- **@octokit/rest** (GitHub)
- **@gitbeaker/core** (GitLab)
- **simple-git** (Git operations)
- **Zod** (validation)

### packages/cost-engine
- **TypeScript**
- Mathematical calculations
- Time-series data handling
- Resource attribution logic

### packages/policies
- **json-rules-engine** or custom
- **Zod** (rule validation)
- Human-readable rule format

### packages/llm
- **openai** (OpenAI SDK)
- **@anthropic-ai/sdk** (Anthropic SDK)
- Prompt template management
- Context filtering

### packages/config
- **Zod** (config validation)
- Environment variable management
- Feature flags

---

## Development Tools

### Monorepo
- **Turborepo** 2.x
  - Build system
  - Task orchestration
  - Remote caching

- **pnpm** 9.x
  - Fast, disk-efficient
  - Workspace support
  - Strict dependency resolution

### Code Quality
- **ESLint** 8.x
  - Linting
  - Custom rules
  - TypeScript support

- **Prettier** 3.x
  - Code formatting
  - Consistent style

- **TypeScript** 5.9+
  - Type checking
  - Strict mode

### Testing
- **Vitest** (TypeScript apps)
- **Go testing** (Agent)
- **Playwright** (E2E, optional)

### CI/CD
- **GitHub Actions**
  - Workflow automation
  - Matrix builds
  - Deployment

### Containerization
- **Docker**
  - Local development
  - Production containers

- **Docker Compose**
  - Local services (PostgreSQL, Redis)

### Deployment
- **Vercel** (Web app)
- **Railway/Render/AWS** (API)
- **Helm** (Agent)
- **GitHub Releases** (Agent binaries)

---

## Version Constraints

### Node.js
- Minimum: 18.x
- Recommended: 20.x LTS
- Maximum: 22.x (test compatibility)

### pnpm
- Version: 9.0.0 (locked in package.json)

### TypeScript
- Version: 5.9.2 (locked in package.json)

### Go
- Minimum: 1.21
- Recommended: 1.22+

---

## Security Considerations

### Dependencies
- Regular dependency updates
- Automated security scanning (Dependabot, Snyk)
- Lock file integrity

### Authentication
- JWT with short expiration
- Refresh token rotation
- Secure token storage

### API Security
- Rate limiting
- CORS configuration
- Input validation (Zod)
- SQL injection prevention (Prisma)

### Container Security
- Minimal base images
- Non-root users
- Security scanning
- Regular updates

---

## Performance Targets

### API
- Response time: <200ms (p95)
- Throughput: 1000+ req/s
- Database queries: <50ms (p95)

### Web
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Lighthouse score: >90

### Agent
- Memory usage: <100MB
- CPU usage: <5% (idle)
- Startup time: <2s

---

## Migration Path

### Phase 1: MVP
- Core functionality
- Basic features
- Essential integrations

### Phase 2: Scale
- Performance optimization
- Caching strategies
- Database optimization

### Phase 3: Enterprise
- Multi-region support
- Advanced observability
- Enterprise features

---

## References

- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Turborepo Documentation](https://turborepo.dev/docs)
- [Kubernetes Go Client](https://github.com/kubernetes/client-go)
