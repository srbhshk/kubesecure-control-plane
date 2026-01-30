import { Github, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GitConnectionStep() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Connect your Repository</h3>
        <p className="text-sm text-muted-foreground">
          Select your Git provider to link your Kubernetes manifests.
        </p>
      </div>

      <div className="grid gap-4">
        <Button variant="outline" className="h-16 justify-start px-6 gap-4">
          <Github className="h-6 w-6" />
          <div className="text-left">
            <div className="font-semibold">GitHub</div>
            <div className="text-xs text-muted-foreground">Connect your GitHub repositories</div>
          </div>
        </Button>
        <Button variant="outline" className="h-16 justify-start px-6 gap-4">
          <Globe className="h-6 w-6" />
          <div className="text-left">
            <div className="font-semibold">GitLab</div>
            <div className="text-xs text-muted-foreground">Connect your GitLab projects</div>
          </div>
        </Button>
      </div>
    </div>
  )
}
