"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"board" | "isolation" | "roles">("board");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-lg text-slate-950 shadow-md shadow-emerald-500/20">
              T
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Tasker
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md hover:bg-emerald-400 transition-all focus-ring"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 flex flex-col justify-center items-center text-center pt-20 pb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Multi-Tenant Workforce Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-50 max-w-4xl leading-tight sm:leading-tight">
          Orchestrate workflows across teams with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            isolated organization boundaries
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed">
          Tasker provides enterprise-grade task tracking, role-based access controls, and organization scoping tailored for fast-scaling organizations.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto rounded-xl bg-emerald-500 px-6 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all focus-ring"
          >
            Create Your Workspace
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-3.5 text-base font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all focus-ring"
          >
            Sign In to Existing Workspace &rarr;
          </Link>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="mt-16 w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6 text-left shadow-2xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs font-mono text-slate-500">
                org_acme_corp_db
              </span>
            </div>

            {/* Mode Switches */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("board")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === "board"
                    ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Task Flow
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("isolation")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === "isolation"
                    ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Tenant Isolation
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("roles")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === "roles"
                    ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                RBAC Hierarchy
              </button>
            </div>
          </div>

          {/* Canvas Content */}
          {activeTab === "board" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    To Do
                  </span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                    2
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <p className="text-xs font-medium text-slate-200">
                      Configure Organization Middleware
                    </p>
                    <span className="mt-2 inline-block text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono">
                      High Priority
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <p className="text-xs font-medium text-slate-200">
                      Set up Prisma dynamic schema filters
                    </p>
                    <span className="mt-2 inline-block text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
                      Backend
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    In Progress
                  </span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                    1
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <p className="text-xs font-medium text-slate-200">
                    Next.js Layout Refactoring
                  </p>
                  <span className="mt-2 inline-block text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono">
                    In Review
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Completed
                  </span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                    1
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 opacity-75">
                  <p className="text-xs font-medium text-slate-300 line-through">
                    Neon Postgres database connection
                  </p>
                  <span className="mt-2 inline-block text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
                    Done
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "isolation" && (
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <p className="text-emerald-400">
                // Middleware tenant isolation check
              </p>
              <p>
                <span className="text-teal-300">const</span> session ={" "}
                <span className="text-amber-300">await</span> getTenantSession(req);
              </p>
              <p>
                <span className="text-teal-300">const</span> tasks ={" "}
                <span className="text-amber-300">await</span> db.task.findMany({"{"}
              </p>
              <p className="pl-4">
                where: {"{"} organizationId: session.organizationId {"}"}
              </p>
              <p>{"}"});</p>
              <p className="text-emerald-400 pt-2">
                ✓ Enforced 100% tenant boundary. 0 cross-org leaks.
              </p>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-emerald-400">
                  ORG ADMIN
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Full control: Organization settings, member invites, role management, and billing.
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-teal-300">
                  TEAM LEAD
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Manage tasks, assign teammates, reorder priorities, and view analytics.
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">
                  MEMBER / EMPLOYEE
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Update task status, comment, log progress, and collaborate on assigned items.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Feature Grid Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 font-bold mb-4">
              🛡️
            </div>
            <h3 className="text-lg font-semibold text-slate-100">
              Multi-Tenant Scoping
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Complete organization isolation ensured through dedicated session memberships and dynamic query filtering.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 font-bold mb-4">
              🔐
            </div>
            <h3 className="text-lg font-semibold text-slate-100">
              Granular RBAC
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Enforce strict role hierarchies (Organization Admin, Team Lead, Employee) directly from edge middleware.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 font-bold mb-4">
              ⚡
            </div>
            <h3 className="text-lg font-semibold text-slate-100">
              Neon Postgres Engine
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Backed by serverless Neon PostgreSQL and Prisma contract mode for lightning-fast schema operations.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Tasker Inc. Built for high-velocity teams.
      </footer>
    </div>
  );
}