'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ShieldAlert, AlertTriangle, History, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const drifts = [
  {
    id: 'D-001',
    service: 'api-gateway',
    environment: 'Production',
    severity: 'high',
    status: 'unresolved',
    detected: '5 mins ago',
  },
  {
    id: 'D-002',
    service: 'auth-service',
    environment: 'Staging',
    severity: 'medium',
    status: 'investigating',
    detected: '1 hour ago',
  },
  {
    id: 'D-003',
    service: 'redis-cache',
    environment: 'Development',
    severity: 'low',
    status: 'resolved',
    detected: '2 hours ago',
  },
];

export default function DriftPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drift Detection</h1>
          <p className="text-muted-foreground">
            Monitor real-time differences between your Git intent and cluster state.
          </p>
        </div>
        <Button variant="outline">
          <History className="mr-2 h-4 w-4" /> Drift History
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900 transition-all hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardTitle className="text-rose-600 dark:text-rose-400 text-sm font-medium uppercase tracking-wider">
              Critical Drifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-700 dark:text-rose-300">1</div>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Medium/Low Drifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Currently being tracked</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 transition-all hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardTitle className="text-emerald-600 dark:text-emerald-400 text-sm font-medium uppercase tracking-wider">
              Services in Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">24</div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
              Maintaining desired state
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Filter by service or environment..." className="pl-8" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drifts.map((drift) => (
                <TableRow key={drift.id} className="transition-colors hover:bg-accent/40">
                  <TableCell className="font-medium">{drift.service}</TableCell>
                  <TableCell>{drift.environment}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {drift.severity === 'high' ? (
                        <ShieldAlert className="h-4 w-4 text-rose-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                      <span className="capitalize">{drift.severity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={drift.status === 'resolved' ? 'default' : 'secondary'}>
                      {drift.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{drift.detected}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Diff
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
