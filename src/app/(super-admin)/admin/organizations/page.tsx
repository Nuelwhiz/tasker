"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Building2,
  ChevronRight,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { organizations } from "@/lib/mock-data/organizations";

export default function OrganizationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((organization) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        organization.name.toLowerCase().includes(searchTerm) ||
        organization.admin.toLowerCase().includes(searchTerm) ||
        organization.email.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" ||
        organization.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <AdminLayout
      title="Organizations"
      subtitle="Tasker Administration"
    >
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-primary">
          Dashboard
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-foreground">
          Organizations
        </span>
      </div>

      {/* Page heading */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-primary">
            Platform management
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Organizations
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage organizations, administrators, and user access
            across the Tasker platform.
          </p>
        </div>

        <Link
          href="/admin/organizations/create"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create organization
        </Link>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Total organizations"
          value={organizations.length.toString()}
          description="Organizations on Tasker"
          icon={Building2}
        />

        <SummaryCard
          title="Active organizations"
          value={organizations
            .filter(
              (organization) =>
                organization.status === "Active"
            )
            .length.toString()}
          description="Currently active"
          icon={ShieldCheck}
        />

        <SummaryCard
          title="Total users"
          value={organizations
            .reduce(
              (total, organization) =>
                total + organization.users,
              0
            )
            .toString()}
          description="Across all organizations"
          icon={Users}
        />
      </div>

      {/* Organization table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-bold">
              All organizations
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              View and manage every organization on Tasker.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search organizations..."
                className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-64"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Desktop */}
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
              {filteredOrganizations.map((organization) => (
                <tr
                  key={organization.id}
                  onClick={() =>
                    (window.location.href = `/admin/organizations/${organization.id}`)
                  }
                  className="group cursor-pointer border-b border-border last:border-0 transition-all duration-200 hover:bg-primary/5 hover:shadow-sm"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-semibold transition-colors group-hover:text-primary">
                          {organization.name}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {organization.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    {organization.admin}
                  </td>

                  <td className="px-6 py-5 text-sm">
                    {organization.users}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge
                      status={organization.status}
                    />
                  </td>

                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    {organization.created}
                  </td>

                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/admin/organizations/${organization.id}`}
                      onClick={(event) =>
                        event.stopPropagation()
                      }
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

        {/* Mobile */}
        <div className="divide-y divide-border md:hidden">
          {filteredOrganizations.map((organization) => (
            <div
              key={organization.id}
              role="link"
              tabIndex={0}
              onClick={() =>
                (window.location.href = `/admin/organizations/${organization.id}`)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  window.location.href = `/admin/organizations/${organization.id}`;
                }
              }}
              className="group cursor-pointer p-5 transition-all duration-200 hover:bg-primary/5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold transition-colors group-hover:text-primary">
                      {organization.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {organization.admin}
                    </p>
                  </div>
                </div>

                <StatusBadge
                  status={organization.status}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Users
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {organization.users}
                  </p>
                </div>

                <span className="text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-1">
                  View organization →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredOrganizations.length === 0 && (
          <div className="px-6 py-14 text-center">
            <Building2 className="mx-auto h-10 w-10 text-muted-foreground/40" />

            <p className="mt-4 font-semibold">
              No organizations found
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or status filter.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function SummaryCard({
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