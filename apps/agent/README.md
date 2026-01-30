# KubeSecure Kubernetes Agent

A **read-only, outbound-only** Kubernetes agent that observes cluster state and metrics and reports them to the KubeSecure Control Plane API. For **project overview, architecture, and flow**, see the [root README](../../README.md). This README is **agent-specific**: config, local run, Helm deploy, and code layout.

---

## What the agent does

- Observes workloads and resources (Deployments, Pods, Services).
- Collects aggregated metrics (e.g. node count).
- Sends heartbeat, state, and metrics to the Control Plane over HTTPS.
- Can support drift detection and promotion verification (see `internal/drift`, `internal/promotion`).

The agent **never mutates** cluster state.

---

## Architecture (agent)

- **Read-only**: Uses minimal RBAC (get, list, watch). No write/patch/delete.
- **Outbound-only**: Connects to the Control Plane API via HTTPS. No inbound ports.
- **Stateless**: No persistent storage.

At runtime the agent:

1. Uses **in-cluster config** when running in a cluster, or **KUBECONFIG** (e.g. `~/.kube/config`) when running locally.
2. Runs tickers for heartbeat, state, and metrics.
3. Calls the Control Plane at `AGENT_CONTROL_PLANE_URL` with `AGENT_TOKEN` and `X-Cluster-ID: AGENT_CLUSTER_ID`.

---

## Prerequisites

- **Go 1.21+** (see [go.mod](go.mod) for the exact version used in CI/build).
- **Kubernetes**: A cluster for testing (e.g. [kind](https://kind.sigs.k8s.io/), [minikube](https://minikube.sigs.k8s.io/), or any kubeconfig).
- **Control Plane API**: The [apps/api](../../apps/api) service running and reachable (e.g. `http://localhost:3001`) so the agent can send heartbeat/state/metrics.

---

## Quick start

1. **From repo root**: ensure the Control Plane API is running (e.g. `pnpm --filter api dev`). See [root README](../../README.md#quick-start).
2. **Kubernetes**: have a cluster and kubeconfig (e.g. `kind create cluster` or `minikube start`).
3. **From apps/agent**, set env and run:

```bash
cd apps/agent

export AGENT_CONTROL_PLANE_URL="http://localhost:3001"
export AGENT_CLUSTER_ID="local-dev"
export AGENT_TOKEN="dev-token"
export AGENT_DEVELOPMENT="true"

go run ./cmd/agent/main.go
```

The agent uses your default kubeconfig and sends heartbeat/state/metrics to the API. Check API logs or `/agent/v1/*` to confirm receipt.

---

## Configuration

| Environment variable          | Description                                 | Default  |
| ----------------------------- | ------------------------------------------- | -------- |
| `AGENT_CONTROL_PLANE_URL`     | Base URL of the Control Plane API           | Required |
| `AGENT_CLUSTER_ID`            | Unique identifier for this cluster          | Required |
| `AGENT_TOKEN`                 | Agent JWT token for API authentication      | Required |
| `AGENT_HEARTBEAT_INTERVAL`    | Interval between heartbeats                 | `30s`    |
| `AGENT_STATE_SEND_INTERVAL`   | Interval between full state reports         | `60s`    |
| `AGENT_METRICS_SEND_INTERVAL` | Interval between metrics reports            | `60s`    |
| `AGENT_LOG_LEVEL`             | Log level: `debug`, `info`, `warn`, `error` | `info`   |
| `AGENT_DEVELOPMENT`           | Pretty logs (e.g. for local dev)            | `false`  |

Config can also be set via a `config.yaml` (see [internal/config/config.go](internal/config/config.go)). Viper is used with env prefix `AGENT` and keys like `control_plane_url`, `cluster_id`, `agent_token`.

---

## Development

### Build

```bash
cd apps/agent
go build -o kubesecure-agent ./cmd/agent/main.go
# or
pnpm run build
```

### Tests

```bash
go test ./...
# or
pnpm run test
```

### Lint

```bash
go vet ./...
# or
pnpm run lint
```

### Running with a local Control Plane

Start the API from repo root (`pnpm --filter api dev`), then run the agent with `AGENT_CONTROL_PLANE_URL=http://localhost:3001`. The API currently implements `/agent/v1/heartbeat` and `/agent/v1/instructions`; `/agent/v1/state` and `/agent/v1/metrics` can be added when needed.

---

## Deployment (Helm)

From the repo root or `apps/agent`:

```bash
helm install kubesecure-agent ./apps/agent/deploy/helm/kubesecure-agent \
  --set controlPlane.url="https://api.kubesecure.com" \
  --set controlPlane.clusterID="your-cluster-id" \
  --set agentToken="your-agent-token"
```

See [deploy/helm/kubesecure-agent/values.yaml](deploy/helm/kubesecure-agent/values.yaml) for image, resources, RBAC, and intervals. The chart uses a ServiceAccount and minimal RBAC (read-only).

---

## Code structure

| Path                                 | Purpose                                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `cmd/agent/main.go`                  | Entrypoint: load config, init logging, create Kube client, run agent.                           |
| `internal/agent/agent.go`            | Orchestrator: tickers for heartbeat, state, metrics; calls collectors and Control Plane client. |
| `internal/config/config.go`          | Config loading (Viper, env, optional config file).                                              |
| `internal/kube/client.go`            | Kubernetes client: in-cluster or kubeconfig.                                                    |
| `internal/controlplane/client.go`    | HTTP client for Control Plane: heartbeat, state, metrics, instructions.                         |
| `internal/controlplane/types.go`     | DTOs: HeartbeatPayload, StatePayload, Resource, MetricsPayload, Instructions.                   |
| `internal/collector/state.go`        | Collects Deployments, Pods, Services as `Resource` list.                                        |
| `internal/metrics/metrics.go`        | Collects metrics (e.g. node count) as `MetricValue` list.                                       |
| `internal/drift/drift.go`            | Drift detection helper (e.g. hash for resources).                                               |
| `internal/promotion/verification.go` | Promotion verification (e.g. check pods for a promotion ID).                                    |
| `internal/logging/logging.go`        | Logging setup (zerolog, level, development mode).                                               |
| `deploy/helm/kubesecure-agent/`      | Helm chart: Deployment, ServiceAccount, RBAC, ConfigMap, Secret.                                |

---

## Control Plane API endpoints used by the agent

| Method | Path                     | Purpose                                                       |
| ------ | ------------------------ | ------------------------------------------------------------- |
| POST   | `/agent/v1/heartbeat`    | Register cluster and capabilities.                            |
| POST   | `/agent/v1/state`        | Send observed resources (Deployments, Pods, Services).        |
| POST   | `/agent/v1/metrics`      | Send metrics (e.g. node count).                               |
| GET    | `/agent/v1/instructions` | Fetch intervals and instructions (e.g. promotions to verify). |

Requests use `Authorization: Bearer <AGENT_TOKEN>` and `X-Cluster-ID: <AGENT_CLUSTER_ID>`. See [docs/API_SPEC.md](../../docs/API_SPEC.md).

---

## Documentation

- [Root README](../../README.md) — Project overview, architecture, and flow.
- [docs/](../../docs/) — PRD, architecture, API spec, tech stack. Agent APIs: [docs/API_SPEC.md](../../docs/API_SPEC.md).

---

## Tech stack (agent)

- **Go** 1.21+ with standard library and [go.mod](go.mod) dependencies.
- **Kubernetes**: [k8s.io/client-go](https://github.com/kubernetes/client-go) (and api/apimachinery).
- **Config**: [Viper](https://github.com/spf13/viper).
- **Logging**: [zerolog](https://github.com/rs/zerolog).
- **Testing**: `testing` + [testify](https://github.com/stretchr/testify).

Monorepo stack (API, Web, Turborepo): [docs/TECH_STACK_DETAILS.md](../../docs/TECH_STACK_DETAILS.md).
