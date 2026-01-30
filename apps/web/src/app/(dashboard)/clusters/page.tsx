'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Server, Plus, ShieldCheck, ShieldAlert, RefreshCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Cluster {
  id: string;
  name: string;
  status: 'PENDING' | 'HEALTHY' | 'OFFLINE';
  lastSeenAt: string | null;
  createdAt: string;
}

export default function ClustersPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newClusterName, setNewClusterName] = useState('');
  const [registeredCluster, setRegisteredCluster] = useState<{
    clusterId: string;
    agentToken: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    data: clusters,
    refetch,
    isLoading,
  } = useQuery<Cluster[]>({
    queryKey: ['clusters'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/clusters');
      return res.json();
    },
  });

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:3001/clusters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClusterName, orgId: 'default-org' }),
      });
      const data = await res.json();
      setRegisteredCluster(data);
      toast.success('Cluster registered successfully');
      refetch();
    } catch (err) {
      toast.error('Failed to register cluster');
    }
  };

  const helmCommand = registeredCluster
    ? `helm install kubesecure-agent ./deploy/helm/kubesecure-agent \\
  --set controlPlane.url="http://localhost:3001" \\
  --set controlPlane.clusterID="${registeredCluster.clusterId}" \\
  --set agentToken="${registeredCluster.agentToken}"`
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(helmCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Command copied to clipboard');
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clusters</h2>
        <div className="flex items-center space-x-2">
          <Dialog
            open={isAddOpen}
            onOpenChange={(open) => {
              setIsAddOpen(open);
              if (!open) setRegisteredCluster(null);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Connect Cluster
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Connect New Cluster</DialogTitle>
                <DialogDescription>
                  Register your cluster to start observing its state and metrics.
                </DialogDescription>
              </DialogHeader>
              {!registeredCluster ? (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Cluster Name</Label>
                    <Input
                      id="name"
                      placeholder="production-eks-us-east-1"
                      value={newClusterName}
                      onChange={(e) => setNewClusterName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleRegister} disabled={!newClusterName}>
                    Register Cluster
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm font-medium mb-2">
                      Run this Helm command in your cluster:
                    </p>
                    <pre className="text-xs bg-black text-white p-4 rounded-md overflow-x-auto whitespace-pre-wrap break-all">
                      {helmCommand}
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="mr-2 h-4 w-4" />
                      ) : (
                        <Copy className="mr-2 h-4 w-4" />
                      )}
                      {copied ? 'Copied!' : 'Copy Command'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Waiting for agent heartbeat...
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading clusters...</p>
        ) : (
          clusters?.map((cluster) => (
            <Card key={cluster.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{cluster.name}</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      cluster.status === 'HEALTHY'
                        ? 'default'
                        : cluster.status === 'PENDING'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {cluster.status === 'HEALTHY' ? (
                      <ShieldCheck className="mr-1 h-3 w-3" />
                    ) : (
                      <ShieldAlert className="mr-1 h-3 w-3" />
                    )}
                    {cluster.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Created {new Date(cluster.createdAt).toLocaleDateString()}
                </p>
                {cluster.lastSeenAt && (
                  <p className="text-xs text-muted-foreground">
                    Last heartbeat: {new Date(cluster.lastSeenAt).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
