'use client';

import { Header } from './header';
import { Sidebar } from './sidebar';
import { useUIStore } from '@/lib/store/ui.store';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const sidebarMode = useUIStore((state) => state.sidebarMode);
  const sidebarPeekOpen = useUIStore((state) => state.sidebarPeekOpen);
  const mobileSidebarOpen = useUIStore((state) => state.mobileSidebarOpen);
  const setMobileSidebar = useUIStore((state) => state.setMobileSidebar);

  const sidebarExpanded = sidebarMode === 'expanded' || sidebarPeekOpen;

  return (
    <div className="relative min-h-screen app-bg">
      <Header />
      <div className="flex">
        <Sidebar />
        {mobileSidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileSidebar(false)}
            className="fixed inset-0 top-14 z-20 bg-black/30 backdrop-blur-[2px] md:hidden"
          />
        )}
        <main
          className={cn(
            'flex-1 p-6 transition-[margin] duration-200 motion-reduce:transition-none md:ml-16',
            !sidebarExpanded && 'md:ml-16',
            mobileSidebarOpen && 'pointer-events-none md:pointer-events-auto'
          )}
        >
          <div className="container mx-auto max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
