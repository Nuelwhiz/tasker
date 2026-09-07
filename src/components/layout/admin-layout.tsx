"use client";

import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";

import AdminSidebar from "@/components/layout/admin-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

type AdminLayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export default function AdminLayout({
  children,
  title = "Super Admin Dashboard",
  subtitle = "Tasker Administration",
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {subtitle}
              </p>

              <h1 className="text-lg font-bold sm:text-xl">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden h-10 items-center gap-3 rounded-xl border border-border bg-card px-3 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                SA
              </div>

              <div className="hidden md:block">
                <p className="text-xs font-semibold">
                  Super Admin
                </p>

                <p className="text-[11px] text-muted-foreground">
                  Platform Owner
                </p>
              </div>

              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}