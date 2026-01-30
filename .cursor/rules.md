# KubeSecure Control Plane – Cursor Rules

You are working on a security-first, GitOps-based Kubernetes control plane.

## Core Principles (DO NOT VIOLATE)
- Git is the ONLY mutation path
- Kubernetes agent is read-only
- Agent is outbound-only
- LLM NEVER performs actions, only explanations
- All operations must be auditable
- Environment is a first-class entity

## Architecture
- Hybrid SaaS control plane + Kubernetes agent
- Control plane never mutates clusters
- Promotions happen via Git PRs only

## Data Model Rules
- DesiredState and ObservedState are always separate
- Promotions are environment-to-environment, never cluster-to-cluster
- All domain writes are append-only

## AI Rules
- LLM only consumes structured context
- No free-form “chat with cluster”
- No hallucinated remediation
- All suggestions must generate Git PRs

## Coding Rules
- Domain logic lives in /packages/*
- apps/* orchestrate only
- No hidden side effects
- No direct Kubernetes writes
- No direct cloud billing API mutations

## Compliance
- Assume SOC2 audit will happen
- Everything must be explainable and logged
