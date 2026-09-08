"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";

import { getUsers, inviteUser } from "@/lib/users";
import type { User as UserType } from "@/lib/mock-data/users";

import { getOrganizations } from "@/lib/organizations";
import type { Organization } from "@/lib/mock-data/organizations";

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
  const params = useParams();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>(
    []
  );

  const [showInviteModal, setShowInviteModal] =
    useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] =
    useState<UserType["role"]>("Member");

  const organizationId = Number(params.id);

  useEffect(() => {
    setUsers(getUsers());
    setOrganizations(getOrganizations());
  }, []);

  const organization = organizations.find(
    (item) => item.id === organizationId
  );

  const organizationUsers = useMemo(() => {
    return users.filter(
      (user) => user.organizationId === organizationId
    );
  }, [users, organizationId]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return organizationUsers.filter((user) => {
      if (!query) return true;

      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  }, [organizationUsers, search]);

  const activeUsers = organizationUsers.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = organizationUsers.filter(
    (user) => user.status === "Inactive"
  ).length;

  const pendingUsers = organizationUsers.filter(
    (user) => user.status === "Pending"
  ).length;

  const teamLeads = organizationUsers.filter(
    (user) => user.role === "Team Lead"
  ).length;

  const handleInviteUser = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!organization) return;

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (!fullName || !email.trim()) return;

    const newUser = inviteUser({
      name: fullName,
      email: email.trim(),
      role,
      organization: organization.name,
      organizationId: organization.id,
    });

    setUsers((currentUsers) => [
      ...currentUsers,
      newUser,
    ]);

    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("Member");
    setShowInviteModal(false);
  };

  if (!organization) {
    return (
      <AdminLayout
        title="Organization Not Found"
        subtitle="Tasker Administration"
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold">
              Organization not found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              The organization you are looking for does not exist.
            </p>

            <Link
              href="/admin/organizations"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to organizations
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={organization.name}
      subtitle="Organization Members"
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
            href={`/admin/organizations/${organization.id}`}
            className="transition hover:text-foreground"
          >
            {organization.name}
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="text-foreground">
            Members
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={`/admin/organizations/${organization.id}`}
              className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to organization
            </Link>

            <h2 className="text-2xl font-bold">
              Organization Members
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage users belonging to {organization.name}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <User className="h-4 w-4" />
            Invite User
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>

            <p className="text-sm text-muted-foreground">
              Total Members
            </p>

            <p className="mt-1 text-2xl font-bold">
              {organizationUsers.length}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
              <User className="h-5 w-5" />
            </div>

            <p className="text-sm text-muted-foreground">
              Active
            </p>

            <p className="mt-1 text-2xl font-bold">
              {activeUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <p className="text-sm text-muted-foreground">
              Team Leads
            </p>

            <p className="mt-1 text-2xl font-bold">
              {teamLeads}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <User className="h-5 w-5" />
            </div>

            <p className="text-sm text-muted-foreground">
              Pending
            </p>

            <p className="mt-1 text-2xl font-bold">
              {pendingUsers}
            </p>
          </div>
        </div>

        {/* Members table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">
                Members
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Users currently assigned to this organization.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
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
                    className="border-b border-border last:border-0 transition-colors hover:bg-primary/5"
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

                    <td className="px-5 py-4 text-sm">
                      {user.role}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-success/10 text-success"
                            : user.status === "Pending"
                              ? "bg-warning/10 text-warning"
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
              <div
                key={user.id}
                className="p-4"
              >
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
                        : user.status === "Pending"
                          ? "bg-warning/10 text-warning"
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
              <p className="font-semibold">
                No members found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h3 className="text-lg font-bold">
                  Invite User
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Invite a user to join {organization.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleInviteUser}
              className="space-y-5 p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium"
                  >
                    First name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.target.value)
                    }
                    placeholder="John"
                    required
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium"
                  >
                    Last name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(event.target.value)
                    }
                    placeholder="Doe"
                    required
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="john@example.com"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium"
                >
                  Role
                </label>

                <select
                  id="role"
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value as UserType["role"]
                    )
                  }
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="Member">
                    Member
                  </option>

                  <option value="Team Lead">
                    Team Lead
                  </option>

                  <option value="Organization Admin">
                    Organization Admin
                  </option>
                </select>
              </div>

              <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                <p className="text-sm font-medium">
                  What happens next?
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  This user will be added as a pending
                  invitation. Email delivery will be connected
                  when the backend is implemented.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setShowInviteModal(false)
                  }
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}