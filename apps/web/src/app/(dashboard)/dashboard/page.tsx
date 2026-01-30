import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, Rocket, BarChart3, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your Kubernetes environments and promotions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environments</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Dev, Staging, Production</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs text-emerald-600">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+2 from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,284.50</div>
            <div className="flex items-center text-xs text-rose-600">
              <ArrowDownRight className="mr-1 h-4 w-4" />
              <span>-4% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drift Severity</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Low</div>
            <p className="text-xs text-muted-foreground">2 minor drifts detected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: '1',
                  service: 'api-gateway',
                  from: 'Staging',
                  to: 'Production',
                  status: 'completed',
                  date: '2 mins ago',
                },
                {
                  id: '2',
                  service: 'auth-service',
                  from: 'Dev',
                  to: 'Staging',
                  status: 'pending',
                  date: '15 mins ago',
                },
                {
                  id: '3',
                  service: 'payment-worker',
                  from: 'Staging',
                  to: 'Production',
                  status: 'rejected',
                  date: '1 hour ago',
                },
              ].map((promo) => (
                <div
                  key={promo.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{promo.service}</p>
                    <p className="text-xs text-muted-foreground">
                      {promo.from} &rarr; {promo.to}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
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
                    <p className="text-xs text-muted-foreground">{promo.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6" asChild>
              <a href="/promotions">View all promotions</a>
            </Button>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Primary Day-1 action */}
            <Button className="w-full justify-start" variant="default">
              <Rocket className="mr-2 h-4 w-4" /> New Promotion
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <Layers className="mr-2 h-4 w-4" /> Add Environment
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <ShieldAlert className="mr-2 h-4 w-4" /> Review Drifts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
