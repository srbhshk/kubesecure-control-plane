'use client';

import { Card, CardContent } from '@/components/ui/card';
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
import { Rocket, Filter, Search, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';

const promotions = [
  {
    id: 'PR-102',
    service: 'api-gateway',
    from: 'Staging',
    to: 'Production',
    status: 'completed',
    user: 'alex@example.com',
    date: 'Jan 27, 2026',
  },
  {
    id: 'PR-101',
    service: 'auth-service',
    from: 'Dev',
    to: 'Staging',
    status: 'pending',
    user: 'sarah@example.com',
    date: 'Jan 27, 2026',
  },
  {
    id: 'PR-100',
    service: 'payment-worker',
    from: 'Staging',
    to: 'Production',
    status: 'rejected',
    user: 'mike@example.com',
    date: 'Jan 26, 2026',
  },
  {
    id: 'PR-099',
    service: 'catalog-db',
    from: 'Dev',
    to: 'Staging',
    status: 'completed',
    user: 'alex@example.com',
    date: 'Jan 25, 2026',
  },
];

export default function PromotionsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground">
            Monitor and manage workload promotions across environments.
          </p>
        </div>
        <Button>
          <Rocket className="mr-2 h-4 w-4" /> New Promotion
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search services..." className="pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Flow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Promoted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id} className="transition-colors hover:bg-accent/40">
                  <TableCell className="font-medium">{promo.id}</TableCell>
                  <TableCell>{promo.service}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-muted rounded">
                        {promo.from}
                      </span>
                      <span className="text-muted-foreground">&rarr;</span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-muted rounded">
                        {promo.to}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        promo.status === 'completed'
                          ? 'default'
                          : promo.status === 'pending'
                            ? 'outline'
                            : 'destructive'
                      }
                    >
                      {promo.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{promo.user}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{promo.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
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
