"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { users } from "@/lib/mock-data/users";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
      {initials}
    </div>
  );
}

export default function OrganizationUsersPage() {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query);

      return user.organizationId === 1 && matchesSearch;
    });
  }, [search]);

  const activeUsers = users.filter(
    (user) => user.organizationId === 1 && user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.organizationId === 1 && user.status === "Inactive"
  ).length;

  const teamLeads = users.filter(
    (user) => user.organizationId === 1 && user.role === "Team Lead"
  ).length;

  return (
    <AdminLayout
      title="Organization Members"
      subtitle="Acme Technologies"
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/admin/organizations"
            className="transition hover:text-foreground"
          >
            Organizations
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/admin/organizations/1"
            className="transition hover:text-foreground"
          >
            Acme Technologies
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="text-foreground">Members</span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/organizations/1"
              className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to organization
            </Link>

            <h2 className="text-2xl font-bold">Organization Members</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage users belonging to Acme Technologies.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>

            <p className="text-sm text-muted-foreground">Total Members</p>
            <p className="mt-1 text-2xl font-bold">
              {users.filter((user) => user.organizationId === 1).length}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
              <User className="h-5 w-5" />
            </div>

            <p className="text-sm text-muted-foreground">Active</p>
            <p className="mt-1 text-2xl font-bold">{activeUsers}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <p className="text-sm text-muted-foreground">Team Leads</p>
            <p className="mt-1 text-2xl font-bold">{teamLeads}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <User className="h-5 w-5" />
            </div>

            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="mt-1 text-2xl font-bold">{inactiveUsers}</p>
          </div>
        </div>

        {/* Members table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Members</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Users currently assigned to this organization.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search members..."
                className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary"
              />
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="group flex items-center gap-3"
                      >
                        <Avatar name={user.name} />

                        <div>
                          <p className="font-semibold group-hover:text-primary">
                            {user.name}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-sm">{user.role}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {user.joinedAt}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-border md:hidden">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <Avatar name={user.name} />

                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {user.name}
                      </p>

                      <p className="truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {user.role}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="font-semibold">No members found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}