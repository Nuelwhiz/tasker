"use client";

import Link from "next/link";
import {
  Building2,
  ChevronRight,
  Plus,
  ShieldCheck,
  Users,
  UserRoundCog,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";

const organizations = [
  {
    id: 1,
    name: "Acme Technologies",
    admin: "John Doe",
    users: 24,
    status: "Active",
    created: "Sep 4, 2026",
  },
  {
    id: 2,
    name: "Bright Solutions",
    admin: "Sarah Williams",
    users: 16,
    status: "Active",
    created: "Sep 2, 2026",
  },
  {
    id: 3,
    name: "Nova Labs",
    admin: "Michael James",
    users: 8,
    status: "Pending",
    created: "Aug 30, 2026",
  },
  {
    id: 4,
    name: "Vertex Digital",
    admin: "David Okafor",
    users: 31,
    status: "Active",
    created: "Aug 27, 2026",
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout
      title="Super Admin Dashboard"
      subtitle="Tasker Administration"
    >
      {/* Welcome */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-primary">
            Overview
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, Super Admin
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage organizations, users, and the Tasker platform
            from one place.
          </p>
        </div>

        <Link
          href="/admin/organizations/create"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Invite organization
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Organizations"
          value="12"
          description="+2 this month"
          icon={Building2}
        />

        <StatCard
          title="Total users"
          value="248"
          description="+18 this month"
          icon={Users}
        />

        <StatCard
          title="Active organizations"
          value="10"
          description="83% of all organizations"
          icon={ShieldCheck}
        />

        <StatCard
          title="Pending invitations"
          value="2"
          description="Awaiting acceptance"
          icon={UserRoundCog}
        />
      </div>

      {/* Organizations */}
      <div className="mt-8 rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="font-bold">Recent organizations</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Organizations recently created on Tasker.
            </p>
          </div>

          <Link
            href="/admin/organizations"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4 font-semibold">
                  Organization
                </th>

                <th className="px-6 py-4 font-semibold">
                  Administrator
                </th>

                <th className="px-6 py-4 font-semibold">
                  Users
                </th>

                <th className="px-6 py-4 font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 font-semibold">
                  Created
                </th>

                <th className="px-6 py-4" />
              </tr>
            </thead>

            <tbody>
              {organizations.map((organization) => (
                <tr
                  key={organization.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <span className="font-semibold">
                        {organization.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    {organization.admin}
                  </td>

                  <td className="px-6 py-5 text-sm">
                    {organization.users}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={organization.status} />
                  </td>

                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    {organization.created}
                  </td>

                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/admin/organizations/${organization.id}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-border md:hidden">
          {organizations.map((organization) => (
            <div
              key={organization.id}
              className="p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {organization.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {organization.admin}
                    </p>
                  </div>
                </div>

                <StatusBadge status={organization.status} />
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-muted-foreground">
                  {organization.users} users
                </div>

                <Link
                  href={`/admin/organizations/${organization.id}`}
                  className="font-semibold text-primary hover:underline"
                >
                  View organization
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h3 className="font-bold">Quick actions</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <QuickAction
            href="/admin/organizations/create"
            icon={Plus}
            title="Invite organization"
            description="Create a new organization and invite its administrator."
          />

          <QuickAction
            href="/admin/organizations"
            icon={Building2}
            title="Manage organizations"
            description="View and manage all organizations on Tasker."
          />

          <QuickAction
            href="/admin/users"
            icon={Users}
            title="Manage users"
            description="View platform users and their organization access."
          />
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "bg-success/10 text-success"
          : "bg-warning/10 text-warning"
      }`}
    >
      {status}
    </span>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
      </div>

      <h4 className="mt-5 font-semibold">{title}</h4>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}