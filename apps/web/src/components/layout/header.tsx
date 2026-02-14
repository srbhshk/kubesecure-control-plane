'use client';

import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/mode-toggle';
import { Bell, Menu, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/store/ui.store';

export function Header() {
  const toggleMobileSidebar = useUIStore((state) => state.toggleMobileSidebar);
  const toggleSidebarMode = useUIStore((state) => state.toggleSidebarMode);

  return (
    <header className="glass-header sticky top-0 z-40 w-full border-b">
      <div className="flex h-14 items-center justify-between mx-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileSidebar}
            className="md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarMode}
            className="hidden md:inline-flex"
            aria-label="Toggle navigation width"
          >
            <PanelLeft className="h-5 w-5" />
          </Button> */}
          <div className="font-bold text-xl tracking-tight hidden md:block">KubeSecure</div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
