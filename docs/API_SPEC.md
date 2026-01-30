# API Specification – KubeSecure Control Plane

## 1. API Principles

- No mutation APIs
- Org-scoped tokens only
- Immutable domain writes
- Git PR required for changes

---

## 2. Authentication

### User JWT
- userId
- orgId
- role

### Agent JWT
- clusterId
- orgId
- short-lived

---

## 3. Core APIs

### Cluster
POST /clusters  
GET /clusters  

### Environment
POST /environments  
POST /environments/{id}/clusters  

### Git
POST /git/repositories  
GET /git/repositories/{id}/state  

### Promotions
POST /promotions/preview  
POST /promotions/{id}/create-pr  
GET /promotions/{id}  

### Cost
GET /costs?env=&period=  

### Explain (LLM)
POST /explain  

---

## 4. Agent APIs

POST /agent/v1/heartbeat  
POST /agent/v1/state  
POST /agent/v1/metrics  
GET /agent/v1/instructions  

---

## 5. Forbidden APIs

- /deploy
- /apply
- /kubectl
- /llm/execute
