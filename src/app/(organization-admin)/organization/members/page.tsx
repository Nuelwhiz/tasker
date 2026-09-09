"use client";

import Link from "next/link";
import { Search, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";

import AdminLayout from "@/components/layout/admin-layout";
import { organizations } from "@/lib/mock-data/organizations";
import { users } from "@/lib/mock-data/users";

const ORGANIZATION_ID = 1;

type MemberRole = "Organization Admin" | "Team Lead" | "Member";
type MemberStatus = "Active" | "Inactive" | "Pending";

export default function OrganizationMembersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "All" | MemberRole
  >("All");

  const [statusFilter, setStatusFilter] = useState<
    "All" | MemberStatus
  >("All");

  const organization = organizations.find(
    (organization) => organization.id === ORGANIZATION_ID
  );

  const organizationUsers = useMemo(
    () =>
      users.filter(
        (user) => user.organizationId === ORGANIZATION_ID
      ),
    []
  );

  const filteredUsers = useMemo(() => {
    return organizationUsers.filter((user) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    organizationUsers,
    search,
    roleFilter,
    statusFilter,
  ]);

  const activeMembers = organizationUsers.filter(
    (user) => user.status === "Active"
  ).length;

  const teamLeads = organizationUsers.filter(
    (user) => user.role === "Team Lead"
  ).length;

  const pendingMembers = organizationUsers.filter(
    (user) => user.status === "Pending"
  ).length;

  return (
    <AdminLayout
      title="Members"
      subtitle={organization?.name ?? "Tasker Organization"}
      role="organization_admin"
    >
      <div className="space-y-8">
        {/* Header */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/organization"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              ← Back to Dashboard
            </Link>

            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {organization?.name ?? "Organization"} Members
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage members, roles, and statuses within your
              organization.
            </p>
          </div>

          <Link
            href="/organization/members/invite"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Link>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Members"
            value={organizationUsers.length}
          />

          <StatCard
            title="Active Members"
            value={activeMembers}
          />

          <StatCard
            title="Team Leads"
            value={teamLeads}
          />

          <StatCard
            title="Pending"
            value={pendingMembers}
          />
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search members..."
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition focus:border-primary"
              />
            </div>

            {/* Role */}
            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value as
                    | "All"
                    | MemberRole
                )
              }
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
            >
              <option value="All">All Roles</option>
              <option value="Organization Admin">
                Organization Admin
              </option>
              <option value="Team Lead">
                Team Lead
              </option>
              <option value="Member">
                Member
              </option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "All"
                    | MemberStatus
                )
              }
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </section>

        {/* Desktop Table */}
        <section className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Member
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/organization/members/${user.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar name={user.name} />

                        <div>
                          <p className="text-sm font-semibold transition-colors group-hover:text-primary">
                            {user.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {user.joinedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <EmptyState />
          )}
        </section>

        {/* Mobile Cards */}
        <section className="space-y-3 md:hidden">
          {filteredUsers.map((user) => (
            <Link
              key={user.id}
              href={`/organization/members/${user.id}`}
              className="block rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-muted/20 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={user.name} />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <StatusBadge status={user.status} />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <RoleBadge role={user.role} />

                <span className="text-xs text-muted-foreground">
                  {user.joinedAt}
                </span>
              </div>
            </Link>
          ))}

          {filteredUsers.length === 0 && (
            <EmptyState />
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

/* ---------------- Components ---------------- */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

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

function RoleBadge({ role }: { role: MemberRole }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        role === "Organization Admin"
          ? "bg-success/10 text-success"
          : role === "Team Lead"
            ? "bg-warning/10 text-warning"
            : "bg-primary/10 text-primary"
      }`}
    >
      {role}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: MemberStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        status === "Active"
          ? "bg-success/10 text-success"
          : status === "Inactive"
            ? "bg-destructive/10 text-destructive"
            : "bg-warning/10 text-warning"
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Users className="h-5 w-5 text-muted-foreground" />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        No members found
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Try adjusting your search or filters.
      </p>
    </div>
  );
}