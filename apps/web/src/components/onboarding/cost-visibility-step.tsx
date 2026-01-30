import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Dev', cost: 120 },
  { name: 'Staging', cost: 450 },
  { name: 'Prod', cost: 1200 },
];

export function CostVisibilityStep() {
  return (
    <div className="space-y-6">
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Spending by Environment</h4>
        <p className="text-sm text-muted-foreground">
          KubeSecure attributes costs directly to your environments and services, giving you a clear picture of your cloud spend.
        </p>
      </div>
    </div>
  )
}
