"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock Active Tenant Context
  const currentOrganization = {
    name: "Acme Corp",
    slug: "acme-corp",
    role: "ORG ADMIN",
    avatar: "A",
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "📊" },
    { name: "Task Board", href: "/dashboard/tasks", icon: "📋" },
    { name: "Team Members", href: "/dashboard/members", icon: "👥" },
    { name: "Workspace Settings", href: "/dashboard/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row selection:bg-emerald-500 selection:text-slate-950">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
            T
          </div>
          <span className="font-bold text-slate-100 tracking-tight">Tasker</span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 border-r border-slate-800 backdrop-blur-md transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Desktop Logo */}
          <div className="hidden md:flex items-center space-x-3 px-2 py-1">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 shadow-md shadow-emerald-500/20">
              T
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Tasker
            </span>
          </div>

          {/* Tenant Indicator */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400">
              {currentOrganization.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-100 truncate">
                {currentOrganization.name}
              </p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider uppercase">
                  {currentOrganization.role}
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold"
                      : "text-slate-400 hover:bg-slate-950/60 hover:text-slate-200"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                EM
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200">Emmanuel</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[110px]">
                  emmanuel@corp.com
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors p-1"
              title="Sign Out"
            >
              🚪
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md px-6 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>workspace</span>
            <span>/</span>
            <span className="text-slate-200 font-semibold">
              {currentOrganization.slug}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-64 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus-ring"
            />
            <button
              type="button"
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:text-slate-200 transition-colors text-xs"
            >
              🔔
            </button>
          </div>
        </header>

        {/* Dynamic Inner Page Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}