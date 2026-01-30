import { Terminal, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AgentInstallStep() {
  const installCommand = "helm install kubesecure-agent kubesecure/agent --set token=ks_abc123"

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Install the KubeSecure Agent</h3>
        <p className="text-sm text-muted-foreground">
          Run this command in your Kubernetes cluster to connect it to the control plane.
        </p>
      </div>

      <div className="relative group">
        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-xs font-mono overflow-x-auto">
          <code>{installCommand}</code>
        </pre>
        <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-8 w-8 text-slate-400 group-hover:text-slate-50">
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
        <div className="animate-pulse h-2 w-2 rounded-full bg-amber-500" />
        <span className="text-sm">Waiting for agent connection...</span>
      </div>
    </div>
  )
}
