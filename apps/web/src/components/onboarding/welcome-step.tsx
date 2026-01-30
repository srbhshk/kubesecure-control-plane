import { Rocket, Shield, Zap } from 'lucide-react';

export function WelcomeStep() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="p-3 bg-primary/10 rounded-full">
          <Rocket className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Welcome to KubeSecure</h2>
        <p className="text-muted-foreground max-w-sm">
          The Git-first, security-first control plane for your Kubernetes workloads.
        </p>
      </div>

      <div className="grid gap-4 mt-8">
        <div className="flex items-start gap-4 p-4 border rounded-lg">
          <Shield className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="font-semibold">Security First</h3>
            <p className="text-sm text-muted-foreground">
              Preview every promotion with full policy enforcement before it reaches production.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 border rounded-lg">
          <Zap className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="font-semibold">GitOps Powered</h3>
            <p className="text-sm text-muted-foreground">
              Maintain Git as the single source of truth for all your infrastructure and workloads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
