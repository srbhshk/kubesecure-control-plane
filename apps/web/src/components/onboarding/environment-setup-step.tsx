import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function EnvironmentSetupStep() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="env-name">Environment Name</Label>
          <Input id="env-name" placeholder="e.g. Production, Staging" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="criticality">Criticality</Label>
          <Select defaultValue="medium">
            <SelectTrigger id="criticality">
              <SelectValue placeholder="Select criticality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cluster">Mapped Cluster</Label>
          <Select>
            <SelectTrigger id="cluster">
              <SelectValue placeholder="Select connected cluster" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cluster-1">ks-main-cluster-01</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
