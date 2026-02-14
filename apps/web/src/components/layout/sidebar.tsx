'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Layers,
  Rocket,
  BarChart3,
  ShieldAlert,
  Settings,
  GanttChartSquare,
} from 'lucide-react';
import { useUIStore } from '@/lib/store/ui.store';
import { usePermissions } from '@/hooks/rbac/use-permissions';
import { Permission } from '@/lib/rbac/permissions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    permission: 'promotions.view',
  },
  {
    title: 'Environments',
    href: '/environments',
    icon: Layers,
    permission: 'environments.view',
  },
  {
    title: 'Promotions',
    href: '/promotions',
    icon: Rocket,
    permission: 'promotions.view',
  },
  {
    title: 'Cost Analytics',
    href: '/cost',
    icon: BarChart3,
    permission: 'cost.view',
  },
  {
    title: 'Drift Detection',
    href: '/drift',
    icon: ShieldAlert,
    permission: 'drift.view',
  },
  {
    title: 'Policies',
    href: '/policies',
    icon: GanttChartSquare,
    permission: 'policies.view',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    permission: 'settings.view',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarMode = useUIStore((state) => state.sidebarMode);
  const sidebarPeekOpen = useUIStore((state) => state.sidebarPeekOpen);
  const setSidebarPeekOpen = useUIStore((state) => state.setSidebarPeekOpen);
  const mobileSidebarOpen = useUIStore((state) => state.mobileSidebarOpen);
  const { can } = usePermissions();

  const isExpanded = sidebarMode === 'expanded' || sidebarPeekOpen;

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          'glass-sidebar fixed left-0 top-50 z-30 border-r duration-200 motion-reduce:transition-none rounded-r-xl',
          // Desktop width modes
          isExpanded ? 'md:w-64' : 'md:w-16',
          // Mobile overlay slide
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
        onMouseEnter={() => {
          if (sidebarMode === 'collapsed') setSidebarPeekOpen(true);
        }}
        onMouseLeave={() => setSidebarPeekOpen(false)}
      >
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <nav className="space-y-1">
              {navItems.map((item) => {
                if (!can(item.permission as Permission)) return null;
                const active = pathname === item.href;

                const link = (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none',
                      'hover:bg-accent/60 hover:text-foreground',
                      active ? 'bg-accent text-foreground' : 'text-muted-foreground'
                    )}
                    onFocus={() => {
                      // Keyboard users should get the expanded nav while focused
                      if (sidebarMode === 'collapsed') setSidebarPeekOpen(true);
                    }}
                    onBlur={() => setSidebarPeekOpen(false)}
                  >
                    <span
                      className={cn(
                        'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150',
                        active
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                      aria-hidden="true"
                    >
                      <item.icon className="h-4 w-4" strokeWidth={3} />
                    </span>

                    <span
                      className={cn(
                        'ml-2 whitespace-nowrap transition-all duration-200 motion-reduce:transition-none',
                        isExpanded
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-2 pointer-events-none'
                      )}
                    >
                      {item.title}
                    </span>

                    {/* Active accent bar */}
                    {active && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[hsl(var(--chart-1))]" />
                    )}
                  </Link>
                );

                if (isExpanded) return link;

                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
