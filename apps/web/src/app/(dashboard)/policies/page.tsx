'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Plus, MoreVertical } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

const policies = [
  {
    id: 'POL-001',
    name: 'Require Approval for Prod',
    description: 'All promotions to Production require at least one approval from a lead.',
    type: 'enforcement',
    active: true,
  },
  {
    id: 'POL-002',
    name: 'Max Replica Count',
    description: 'Limit max replicas to 10 in Development to control costs.',
    type: 'resource',
    active: true,
  },
  {
    id: 'POL-003',
    name: 'No Root User',
    description: 'Block containers running as root user in any environment.',
    type: 'security',
    active: false,
  },
  {
    id: 'POL-004',
    name: 'Cost Threshold',
    description: 'Notify if a promotion increases monthly cost by more than 20%.',
    type: 'cost',
    active: true,
  },
];

export default function PoliciesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policies</h1>
          <p className="text-muted-foreground">
            Define and enforce rules across your promotion workflows.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Policy
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Active Policies</CardTitle>
                <CardDescription>
                  Rules currently being evaluated during promotions.
                </CardDescription>
              </div>
              <div className="w-full sm:max-w-xs">
                <Input placeholder="Search policies…" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Policy Name</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id} className="transition-colors hover:bg-accent/40">
                    <TableCell>
                      <Switch checked={policy.active} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{policy.name}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{policy.type}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="capitalize">
                        {policy.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate text-sm text-muted-foreground">
                      {policy.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
