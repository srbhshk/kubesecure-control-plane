# Architecture – KubeSecure Control Plane

## 1. Architectural Principles

- Git is the only mutation path
- Kubernetes agent is read-only
- Outbound-only communication
- LLM explains, never acts
- Environment is first-class
- Append-only domain state

---

## 2. Deployment Model

Hybrid architecture:

- **SaaS Control Plane**
  - UI
  - APIs
  - GitOps orchestration
  - Cost engine
  - Policy engine
  - LLM explanation engine

- **Kubernetes Agent**
  - Installed via Helm
  - Read-only RBAC
  - Outbound HTTPS only
  - Observes cluster state & metrics

---

## 3. High-Level Diagram (Logical)

Git → Control Plane → Git PR  
Kubernetes Agent → Control Plane (observe only)

Control plane never writes to cluster.

---

## 4. Control Plane Responsibilities

- Multi-tenant auth & RBAC
- Environment modeling
- Promotion orchestration
- Cost aggregation
- Policy evaluation
- LLM explanations
- Audit logging

---

## 5. Kubernetes Agent Responsibilities

- Observe workloads & resources
- Collect aggregated metrics
- Detect drift
- Verify promotion outcomes
- Never mutate cluster state

---

## 6. Data Separation

- Desired State (Git)
- Observed State (Cluster)
- Drift = explicit entity

They are never merged.

---

## 7. Scalability & Future Readiness

- Stateless APIs
- Event-driven backend
- Multi-AZ by default
- Designed for:
  - Multi-region
  - Air-gapped control plane
  - Enterprise extensions
