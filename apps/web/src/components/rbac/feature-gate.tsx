"use client"

import { usePermissions } from "@/hooks/rbac/use-permissions"
import { Permission } from "@/lib/rbac/permissions"
import React from "react"

interface FeatureGateProps {
  permission: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ permission, children, fallback = null }: FeatureGateProps) {
  const { can, isLoaded } = usePermissions()

  if (!isLoaded) return null

  if (can(permission)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
