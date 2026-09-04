"use client";

import React from "react";
import Link from "next/link";

export default function DashboardOverviewPage() {
  // Mock Metric Data
  const metrics = [
    {
      title: "Total Tasks",
      value: "128",
      change: "+12% this week",
      trend: "up",
      icon: "📋",
    },
    {
      title: "Active Projects",
      value: "8",
      change: "2 near deadline",
      trend: "neutral",
      icon: "📁",
    },
    {
      title: "Team Members",
      value: "14",
      change: "+3 invited",
      trend: "up",
      icon: "👥",
    },
    {
      title: "Completion Rate",
      value: "94.2%",
      change: "+2.4%",
      trend: "up",
      icon: "⚡",
    },
  ];

  // Mock Recent Tasks
  const recentTasks = [
    {
      id: "TSK-104",
      title: "Configure multi-tenant isolation rules",
      status: "In Progress",
      assignee: "Emmanuel",
      priority: "High",
      dueDate: "Today",
    },
    {
      id: "TSK-103",
      title: "Refactor Next.js App Router layout components",
      status: "Completed",
      assignee: "Joe",
      priority: "Medium",
      dueDate: "Yesterday",
    },
    {
      id: "TSK-102",
      title: "Setup PostgreSQL database indexes for query performance",
      status: "In Progress",
      assignee: "Basil",
      priority: "Urgent",
      dueDate: "Tomorrow",
    },
    {
      id: "TSK-101",
      title: "Draft workspace onboarding flow for new users",
      status: "Backlog",
      assignee: "Emmanuel",
      priority: "Low",
      dueDate: "Sep 8",
    },
  ];

  // Mock Activity Feed
  const activities = [
    {
      id: 1,
      user: "Joe",
      action: "completed task",
      target: "TSK-103: Refactor Next.js App Router",
      time: "20 mins ago",
    },
    {
      id: 2,
      user: "Basil",
      action: "pushed code to",
      target: "feature/database-indexing",
      time: "1 hour ago",
    },
    {
      id: 3,
      user: "Emmanuel",
      action: "created workspace task",
      target: "TSK-104: Multi-tenant isolation",
      time: "3 hours ago",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            Workspace Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time operational metrics for <span className="text-emerald-400 font-semibold">Acme Corp</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/tasks"
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-all focus-ring text-center"
          >
            + New Task
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-sm shadow-sm hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                {metric.title}
              </span>
              <span className="text-lg">{metric.icon}</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-100 font-mono">
                {metric.value}
              </span>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Split: Tasks Summary & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks Column (Spans 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
              <span>High Priority Tasks</span>
            </h2>
            <Link
              href="/dashboard/tasks"
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              View all tasks &rarr;
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Task ID</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Assignee</th>
                    <th className="px-4 py-3 text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-emerald-400 font-medium">
                        {task.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-200">
                        {task.title}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            task.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : task.status === "In Progress"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {task.assignee}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400">
                        {task.dueDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Activity Feed Column (Spans 1) */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-slate-100">
            Workspace Activity
          </h2>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 space-y-4 backdrop-blur-sm">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start space-x-3 text-xs">
                <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-[10px]">
                  {act.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300">
                    <span className="font-semibold text-slate-100">{act.user}</span>{" "}
                    {act.action}{" "}
                    <span className="text-emerald-400 font-medium">{act.target}</span>
                  </p>
                  <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                    {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}