# Epics & User Stories – KubeSecure Control Plane

This document is the **canonical source** for all product development.

---

## EPIC 1: Platform Foundation & Compliance

### Stories
- Repo initialization & monorepo setup
- CI/CD pipelines
- Testing framework
- Documentation system
- SOC2-aligned RBAC
- Immutable audit logs

---

## EPIC 2: Environment Modeling

### Stories
- Create environments (dev/staging/prod)
- Map clusters to environments
- Define environment criticality
- Assign services to environments

---

## EPIC 3: Kubernetes Agent (Read-Only)

### Stories
- Helm-based installation
- Read-only RBAC enforcement
- Outbound-only communication
- Cluster state collection
- Metrics aggregation
- Drift detection
- Promotion verification

---

## EPIC 4: Git Integration

### Stories
- OAuth with GitHub/GitLab
- Read manifests
- Track desired state snapshots
- Create promotion PRs
- Track PR lifecycle via webhooks

---

## EPIC 5: GitOps Promotion Engine

### Stories
- Preview promotion (read-only)
- Visual diffs (config, resources)
- Promotion state machine
- PR-based promotion execution
- Promotion audit trail

---

## EPIC 6: Cost Attribution Engine

### Stories
- Aggregate CPU/memory usage
- Attribute cost by service & environment
- Detect idle workloads
- Time-windowed cost snapshots

---

## EPIC 7: Cost-Aware Promotion Preview

### Stories
- Estimate cost delta for promotion
- Display confidence levels
- Enforce cost thresholds via policy

---

## EPIC 8: Policy Engine

### Stories
- Define human-readable rules
- Enforce promotion order
- Block risky promotions
- Explain policy violations

---

## EPIC 9: Drift Detection

### Stories
- Compare desired vs observed state
- Surface drift severity
- Track drift over time

---

## EPIC 10: LLM Explanation Engine

### Stories
- Explain promotion diffs
- Explain cost spikes
- Explain policy blocks
- Suggest remediation (PR-based only)

---

## EPIC 11: User Onboarding

### Stories
- Signup flow
- Agent installation guide
- Git connection wizard
- Environment setup wizard
- Time-to-value < 30 mins

---

## Out of Scope (MVP)

- Cluster provisioning
- Direct cluster writes
- Air-gapped deployments
- Auto-remediation without approval
