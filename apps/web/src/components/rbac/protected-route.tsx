"use client"

import { usePermissions } from "@/hooks/rbac/use-permissions"
import { Permission } from "@/lib/rbac/permissions"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

interface ProtectedRouteProps {
  permission: Permission
  children: React.ReactNode
}

export function ProtectedRoute({ permission, children }: ProtectedRouteProps) {
  const { can, isLoaded } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !can(permission)) {
      router.push("/unauthorized")
    }
  }, [isLoaded, can, permission, router])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (can(permission)) {
    return <>{children}</>
  }

  return null
}
