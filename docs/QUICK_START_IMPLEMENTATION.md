# Quick Start Implementation Guide

This guide provides step-by-step commands and code snippets to quickly initialize each app following the initialization plan.

---

## Prerequisites

```bash
# Verify Node.js version
node --version  # Should be >=18

# Verify pnpm version
pnpm --version  # Should be 9.0.0

# Install global tools (optional but recommended)
npm install -g turbo
```

---

## Phase 1: Foundation Setup

### 1.1 Update Root Configuration

```bash
# Update turbo.json with comprehensive tasks
# (See INITIALIZATION_PLAN.md for details)
```

### 1.2 Add Prettier Configuration

Create `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

Create `.prettierignore`:
```
node_modules
.next
dist
build
coverage
*.log
```

### 1.3 Setup Docker Compose for Local Dev

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: kubesecure
      POSTGRES_PASSWORD: kubesecure_dev
      POSTGRES_DB: kubesecure
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## Phase 2: Initialize Backend API

### 2.1 Create API App Structure

```bash
cd apps/api
pnpm init
pnpm add fastify@^4.24.0
pnpm add -D @types/node typescript
pnpm add zod prisma @prisma/client
pnpm add pino pino-pretty
pnpm add @fastify/swagger @fastify/swagger-ui
pnpm add @fastify/cors @fastify/helmet
pnpm add @fastify/jwt
pnpm add bullmq ioredis
pnpm add -D vitest @vitest/ui supertest
pnpm add -D @types/supertest
```

### 2.2 Initialize Prisma

```bash
cd apps/api
npx prisma init
```

Update `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  users     User[]
  clusters  Cluster[]
  environments Environment[]
  
  @@map("organizations")
}

model User {
  id             String       @id @default(cuid())
  orgId          String
  email          String
  role           String       // admin, member, viewer
  createdAt      DateTime     @default(now())
  
  organization   Organization @relation(fields: [orgId], references: [id])
  
  @@unique([orgId, email])
  @@map("users")
}

model Cluster {
  id          String   @id @default(cuid())
  orgId       String
  name        String
  kubeconfig  String?  // Encrypted
  agentToken  String   // JWT token for agent
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  organization Organization @relation(fields: [orgId], references: [id])
  environments EnvironmentCluster[]
  
  @@map("clusters")
}

model Environment {
  id          String   @id @default(cuid())
  orgId       String
  name        String   // dev, staging, prod
  criticality String   // low, medium, high
  createdAt   DateTime @default(now())
  
  organization Organization @relation(fields: [orgId], references: [id])
  clusters     EnvironmentCluster[]
  promotions   Promotion[]
  
  @@unique([orgId, name])
  @@map("environments")
}

model EnvironmentCluster {
  id            String      @id @default(cuid())
  environmentId String
  clusterId     String
  createdAt     DateTime    @default(now())
  
  environment   Environment @relation(fields: [environmentId], references: [id])
  cluster       Cluster     @relation(fields: [clusterId], references: [id])
  
  @@unique([environmentId, clusterId])
  @@map("environment_clusters")
}

model Promotion {
  id            String      @id @default(cuid())
  orgId         String
  fromEnvId     String
  toEnvId       String
  status        String      // pending, approved, rejected, completed
  prUrl         String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  fromEnv       Environment @relation("PromotionsFrom", fields: [fromEnvId], references: [id])
  toEnv         Environment @relation("PromotionsTo", fields: [toEnvId], references: [id])
  
  @@map("promotions")
}

// Add more models as needed...
```

### 2.3 Create Basic Fastify Server

Create `apps/api/src/server.ts`:
```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
  },
});

// Register plugins
await server.register(cors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
});

await server.register(helmet);

await server.register(swagger, {
  openapi: {
    info: {
      title: 'KubeSecure Control Plane API',
      version: '1.0.0',
    },
  },
});

await server.register(swaggerUI, {
  routePrefix: '/docs',
});

// Health check
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || '0.0.0.0';

try {
  await server.listen({ port, host });
  server.log.info(`Server listening on http://${host}:${port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
```

### 2.4 Create Package.json Scripts

Update `apps/api/package.json`:
```json
{
  "name": "@kubesecure/api",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint src",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio"
  }
}
```

---

## Phase 3: Initialize Frontend Web

### 3.1 Create Next.js App

```bash
cd apps/web
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

### 3.2 Install Dependencies

```bash
cd apps/web
pnpm add @clerk/nextjs  # or @auth0/nextjs-auth0
pnpm add @tanstack/react-query zustand
pnpm add react-hook-form @hookform/resolvers zod
pnpm add recharts  # or chart.js
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

### 3.3 Setup shadcn/ui

```bash
cd apps/web
npx shadcn@latest init
# Select: TypeScript, Tailwind, Default style, App Router
```

Install components as needed:
```bash
npx shadcn@latest add button card table dialog form
```

### 3.4 Create Basic Layout

Create `apps/web/src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KubeSecure Control Plane',
  description: 'Git-first, security-first Kubernetes control plane',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

## Phase 4: Initialize Kubernetes Agent

### 4.1 Create Go Module

```bash
cd apps/agent
go mod init github.com/kubesecure/agent
```

### 4.2 Install Dependencies

```bash
cd apps/agent
go get k8s.io/client-go@v0.28.0
go get k8s.io/api@v0.28.0
go get k8s.io/apimachinery@v0.28.0
go get github.com/prometheus/client_golang
go get github.com/spf13/viper
go get github.com/rs/zerolog
go get github.com/stretchr/testify
```

### 4.3 Create Basic Agent Structure

Create `apps/agent/cmd/agent/main.go`:
```go
package main

import (
    "context"
    "fmt"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/rs/zerolog"
    "github.com/rs/zerolog/log"
    "github.com/spf13/viper"
)

func main() {
    // Setup logging
    zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
    log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

    // Load config
    viper.SetConfigName("config")
    viper.SetConfigType("yaml")
    viper.AddConfigPath(".")
    viper.AddConfigPath("/etc/agent/")
    viper.SetEnvPrefix("AGENT")
    viper.AutomaticEnv()

    if err := viper.ReadInConfig(); err != nil {
        log.Warn().Err(err).Msg("No config file found, using defaults")
    }

    // Get configuration
    controlPlaneURL := viper.GetString("control_plane_url")
    clusterID := viper.GetString("cluster_id")
    agentToken := viper.GetString("agent_token")

    if controlPlaneURL == "" || clusterID == "" || agentToken == "" {
        log.Fatal().Msg("Missing required configuration: control_plane_url, cluster_id, agent_token")
    }

    log.Info().
        Str("control_plane_url", controlPlaneURL).
        Str("cluster_id", clusterID).
        Msg("Starting KubeSecure Agent")

    // Setup context
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()

    // Handle shutdown
    sigChan := make(chan os.Signal, 1)
    signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

    // Start heartbeat loop
    go heartbeatLoop(ctx, controlPlaneURL, clusterID, agentToken)

    // Wait for shutdown signal
    <-sigChan
    log.Info().Msg("Shutting down agent")
    cancel()
}

func heartbeatLoop(ctx context.Context, url, clusterID, token string) {
    ticker := time.NewTicker(30 * time.Second)
    defer ticker.Stop()

    for {
        select {
        case <-ctx.Done():
            return
        case <-ticker.C:
            // TODO: Implement heartbeat
            log.Debug().Msg("Sending heartbeat")
        }
    }
}
```

### 4.4 Create Helm Chart Structure

```bash
cd apps/agent
mkdir -p deploy/helm/kubesecure-agent/templates
mkdir -p deploy/helm/kubesecure-agent/charts
```

Create `deploy/helm/kubesecure-agent/Chart.yaml`:
```yaml
apiVersion: v2
name: kubesecure-agent
description: KubeSecure Kubernetes Agent
type: application
version: 0.1.0
appVersion: "0.1.0"
```

---

## Phase 5: Setup CI/CD

### 5.1 Create GitHub Actions Workflow

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9.0.0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm check-types

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9.0.0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9.0.0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

---

## Next Steps

1. Follow the detailed plan in `INITIALIZATION_PLAN.md`
2. Reference `TECH_STACK_DETAILS.md` for specific versions and configurations
3. Implement each phase sequentially
4. Test thoroughly before moving to the next phase

---

## Common Commands

```bash
# Install all dependencies
pnpm install

# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm --filter @kubesecure/api dev
pnpm --filter @kubesecure/web dev

# Build all
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Format code
pnpm format
```
