import { ShieldAlert } from "lucide-react"

export function DriftDetectionStep() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center py-4 space-y-4">
        <div className="p-4 bg-amber-100 rounded-full">
          <ShieldAlert className="h-10 w-10 text-amber-600" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-semibold">Never Lose Sync</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            We continuously monitor your cluster reality vs your Git intent.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 border rounded-md bg-slate-50 font-mono">
          <div className="text-muted-foreground border-b mb-1 pb-1">Git Intent</div>
          <div className="text-emerald-600">+ replicaCount: 3</div>
        </div>
        <div className="p-2 border rounded-md bg-slate-50 font-mono">
          <div className="text-muted-foreground border-b mb-1 pb-1">Cluster Reality</div>
          <div className="text-rose-600">- replicaCount: 1</div>
        </div>
      </div>
    </div>
  )
}
