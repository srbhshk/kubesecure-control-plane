'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/rbac/use-permissions';
import { FeatureGate } from '@/components/rbac/feature-gate';

export default function SettingsPage() {
  const { role } = usePermissions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your organization and account preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="security">Security & RBAC</TabsTrigger>
          <TabsTrigger value="git">Git Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Update your organization name and metadata.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-id">Organization ID</Label>
                <Input id="org-id" defaultValue="org_23456789" disabled />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <FeatureGate
            permission="users.manage"
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>Access Restricted</CardTitle>
                  <CardDescription>Only administrators can manage team members.</CardDescription>
                </CardHeader>
              </Card>
            }
          >
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Invite and manage roles for your team.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin' },
                    { name: 'Sarah Smith', email: 'sarah@example.com', role: 'Platform Engineer' },
                    { name: 'Mike Ross', email: 'mike@example.com', role: 'DevOps / SRE' },
                  ].map((member) => (
                    <div
                      key={member.email}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button variant="outline">Invite Member</Button>
              </CardFooter>
            </Card>
          </FeatureGate>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RBAC Configuration</CardTitle>
              <CardDescription>
                Your current role:{' '}
                <Badge variant="secondary" className="ml-1 uppercase">
                  {role}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Role-based access control is managed at the organization level. Contact your
                administrator to request additional permissions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="git" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Git Connections</CardTitle>
              <CardDescription>Manage connections to GitHub and GitLab.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-slate-950 rounded flex items-center justify-center text-white font-bold text-xl">
                    GH
                  </div>
                  <div>
                    <div className="font-medium">GitHub Organization</div>
                    <div className="text-sm text-muted-foreground">acme-corp (Connected)</div>
                  </div>
                </div>
                <Button variant="ghost">Disconnect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
