# KubeSecure Kubernetes Agent

A read-only, outbound-only Kubernetes agent that observes cluster state and metrics, and reports them to the KubeSecure Control Plane.

## Architecture

The agent runs as a single pod in your cluster, typically installed via Helm. It follows these security principles:

- **Read-Only**: Minimal RBAC permissions (get, list, watch). No write/patch/delete permissions.
- **Outbound-Only**: Connects to the Control Plane API via HTTPS. Does not expose any inbound ports.
- **Stateless**: Does not require persistent storage.

## Configuration

The agent can be configured via environment variables or a `config.yaml` file.

| Environment Variable          | Description                              | Default  |
| ----------------------------- | ---------------------------------------- | -------- |
| `AGENT_CONTROL_PLANE_URL`     | Base URL of the KubeSecure Control Plane | Required |
| `AGENT_CLUSTER_ID`            | Unique identifier for this cluster       | Required |
| `AGENT_TOKEN`                 | Agent JWT token for authentication       | Required |
| `AGENT_HEARTBEAT_INTERVAL`    | Interval between heartbeats              | `30s`    |
| `AGENT_STATE_SEND_INTERVAL`   | Interval between full state reports      | `60s`    |
| `AGENT_METRICS_SEND_INTERVAL` | Interval between metrics reports         | `60s`    |
| `AGENT_LOG_LEVEL`             | Logging level (debug, info, warn, error) | `info`   |
| `AGENT_DEVELOPMENT`           | Enable development mode (pretty logs)    | `false`  |

## Deployment

### Using Helm

```bash
helm install kubesecure-agent ./deploy/helm/kubesecure-agent \
  --set controlPlane.url="https://api.kubesecure.com" \
  --set controlPlane.clusterID="your-cluster-id" \
  --set agentToken="your-agent-token"
```

## Development

### Prerequisites

- Go 1.21+
- Access to a Kubernetes cluster (or `kind`/`minikube`)

### Running locally

```bash
export AGENT_CONTROL_PLANE_URL="http://localhost:3001"
export AGENT_CLUSTER_ID="local-dev"
export AGENT_TOKEN="dev-token"
export AGENT_DEVELOPMENT="true"

go run cmd/agent/main.go
```

### Running tests

```bash
go test ./...
```
