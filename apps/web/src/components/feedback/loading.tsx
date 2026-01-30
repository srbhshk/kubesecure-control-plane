import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={cn("h-8 w-8 animate-spin text-primary", className)} />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner />
      <p className="text-sm text-muted-foreground animate-pulse">Loading amazing things...</p>
    </div>
  )
}
