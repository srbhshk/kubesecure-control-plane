import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function PromotionPreviewStep() {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="font-semibold">Promotion: api-service</div>
          <Badge variant="outline">Preview</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted rounded-md space-y-1">
            <div className="text-xs text-muted-foreground uppercase">Cost Impact</div>
            <div className="text-lg font-bold text-emerald-600">+$12.40 / mo</div>
          </div>
          <div className="p-3 bg-muted rounded-md space-y-1">
            <div className="text-xs text-muted-foreground uppercase">Policy Check</div>
            <div className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>Passed</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Drift Detected</div>
          <div className="flex items-center gap-2 text-xs p-2 bg-amber-50 text-amber-800 border border-amber-200 rounded">
            <AlertCircle className="h-3 w-3" />
            <span>3 configuration differences found between Git and Cluster.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
