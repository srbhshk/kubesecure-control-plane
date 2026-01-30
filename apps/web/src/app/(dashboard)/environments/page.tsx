'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Server } from 'lucide-react';
import { EnvironmentStatus } from '@/components/data-display/status-badge';

interface Environment {
  id: string;
  name: string;
  criticality: string;
  clusterCount: number;
  status: 'stable' | 'drifted';
}

const initialEnvironments: Environment[] = [
  { id: '1', name: 'Production', criticality: 'high', clusterCount: 2, status: 'stable' },
  { id: '2', name: 'Staging', criticality: 'medium', clusterCount: 1, status: 'stable' },
  { id: '3', name: 'Development', criticality: 'low', clusterCount: 1, status: 'drifted' },
];

export default function EnvironmentsPage() {
  const environments = initialEnvironments; // In real app, fetch from store/API

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Environments</h1>
          <p className="text-muted-foreground">Manage your Kubernetes environments and clusters.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Environment
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm">
            All
          </Button>
          <Button variant="outline" size="sm">
            Stable
          </Button>
          <Button variant="outline" size="sm">
            Drifted
          </Button>
          <Button variant="outline" size="sm">
            Production
          </Button>
        </div>
        <div className="w-full sm:max-w-xs">
          <Input placeholder="Search environments…" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {environments.map((env) => (
          <Card key={env.id} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">{env.name}</CardTitle>
              <Badge variant={env.criticality === 'high' ? 'destructive' : 'secondary'}>
                {env.criticality}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Server className="h-4 w-4" />
                <span>{env.clusterCount} Cluster(s) connected</span>
              </div>
              <EnvironmentStatus status={env.status} />
              <Button variant="outline" className="w-full mt-2" asChild>
                <a href={`/environments/${env.id}`}>Manage Environment</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
