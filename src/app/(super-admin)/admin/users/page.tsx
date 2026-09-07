"use client";

import Link from "next/link";
import {
  ChevronRight,
  Plus,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import AdminLayout from "@/components/layout/admin-layout";
import { users } from "@/lib/mock-data/users";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.organization.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const activeUsers = users.filter(
    (user) => user.status === "Active",
  ).length;

  const adminsAndLeads = users.filter(
    (user) =>
      user.role === "Organization Admin" ||
      user.role === "Team Lead",
  ).length;

  return (
    <AdminLayout
      title="Users"
      subtitle="Tasker Administration"
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Administration</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Users</span>
            </div>

            <h2 className="mt-2 text-2xl font-bold">
              All Users
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage users across all Tasker organizations.
            </p>
          </div>

          <Link
            href="/admin/users/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Total Users
                </p>

                <p className="text-2xl font-bold">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                <User className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Active Users
                </p>

                <p className="text-2xl font-bold">
                  {activeUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Admins & Leads
                </p>

                <p className="text-2xl font-bold">
                  {adminsAndLeads}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="rounded-2xl border border-border bg-card">
          {/* Search */}
          <div className="border-b border-border p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Organization
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0 transition hover:bg-muted/40"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="group flex items-center gap-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {user.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

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

                    <td className="px-6 py-4 text-sm font-medium">
                      {user.organization}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.joinedAt}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        View
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="divide-y divide-border md:hidden">
            {filteredUsers.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="flex items-center justify-between gap-3 p-4 transition hover:bg-muted/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {user.name}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>

                    <p className="mt-1 text-xs text-primary">
                      {user.role}
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            ))}

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center">
                <p className="font-semibold">
                  No users found
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search.
                </p>
              </div>
            )}
          </div>

          {/* Desktop Empty State */}
          {filteredUsers.length === 0 && (
            <div className="hidden p-10 text-center md:block">
              <p className="font-semibold">
                No users found
              </p>

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