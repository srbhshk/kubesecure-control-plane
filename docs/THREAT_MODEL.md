# Threat Model – KubeSecure Control Plane

## 1. Security Philosophy

Security is enforced by **architecture**, not runtime checks.

---

## 2. Core Non-Negotiable Rules

- No direct cluster mutations
- No inbound agent access
- No LLM-initiated actions
- Git is audit trail
- Least privilege everywhere

---

## 3. Assets to Protect

- Git credentials
- Promotion workflows
- Cost data
- Cluster topology
- Audit logs

---

## 4. Threats & Mitigations

### Control Plane
- Unauthorized access → strict RBAC, org isolation
- Promotion abuse → promotion state machine
- Data exfiltration → scoped APIs, rate limiting

### Agent
- Token theft → short-lived JWTs
- Privilege escalation → read-only RBAC
- Spoofed metrics → server-side validation

### Git
- Token compromise → OAuth, minimal scopes
- Supply chain injection → diffs + policies

### LLM
- Prompt injection → immutable system prompts
- Hallucinations → no action capability
- Data leakage → strict context filtering

---

## 5. Compliance Alignment

- SOC2-aligned access control
- Immutable audit logs
- Git-based change management
- Encrypted data at rest
- Full traceability

---

## 6. Explicitly Out of Scope (MVP)

- FedRAMP / GovCloud
- Customer-managed encryption keys
- Offline agent mode
