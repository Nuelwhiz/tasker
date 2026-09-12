"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Search,
  UserMinus,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { getOrganization } from "@/lib/services/organization-service";
import { getTeam } from "@/lib/services/team-service";
import {
  assignUserToTeam,
  getAvailableTeamMembers,
  getTeamMembers,
  removeUserFromTeam,
} from "@/lib/services/user-service";

import type { User } from "@/lib/mock-data/users";

const ORGANIZATION_ID = 1;

export default function TeamMembersPage() {
  const params = useParams();
  const teamId = Number(params.id);

  const [organization, setOrganization] = useState<Awaited<
    ReturnType<typeof getOrganization>
  >>(null);

  const [team, setTeam] = useState<Awaited<
    ReturnType<typeof getTeam>
  >>(null);

  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);

  const [search, setSearch] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);

        const [
          organizationData,
          teamData,
          teamMembersData,
          availableMembersData,
        ] = await Promise.all([
          getOrganization(ORGANIZATION_ID),
          getTeam(teamId, ORGANIZATION_ID),
          getTeamMembers(ORGANIZATION_ID, teamId),
          getAvailableTeamMembers(ORGANIZATION_ID, teamId),
        ]);

        if (!mounted) {
          return;
        }

        setOrganization(organizationData);
        setTeam(teamData);
        setTeamMembers(teamMembersData);
        setAvailableMembers(availableMembersData);
      } catch (error) {
        console.error("Failed to load team members:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (!Number.isNaN(teamId)) {
      loadData();
    }

    return () => {
      mounted = false;
    };
  }, [teamId]);

  const refreshMembers = async () => {
    const [teamMembersData, availableMembersData] = await Promise.all([
      getTeamMembers(ORGANIZATION_ID, teamId),
      getAvailableTeamMembers(ORGANIZATION_ID, teamId),
    ]);

    setTeamMembers(teamMembersData);
    setAvailableMembers(availableMembersData);
  };

  const handleAddMember = async (userId: number) => {
    try {
      setActionLoading(userId);

      const updatedUser = await assignUserToTeam(
        userId,
        ORGANIZATION_ID,
        teamId
      );

      if (!updatedUser) {
        return;
      }

      await refreshMembers();
    } catch (error) {
      console.error("Failed to add member:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      setActionLoading(userId);

      const updatedUser = await removeUserFromTeam(
        userId,
        ORGANIZATION_ID
      );

      if (!updatedUser) {
        return;
      }

      await refreshMembers();
    } catch (error) {
      console.error("Failed to remove member:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredAvailableMembers = availableMembers.filter((user) => {
    const searchTerm = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-24 animate-pulse rounded-xl bg-muted" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-32 animate-pulse rounded-xl bg-muted" />
            <div className="h-32 animate-pulse rounded-xl bg-muted" />
          </div>

          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        </div>
      </AdminLayout>
    );
  }

  if (!organization || !team) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>

            <h1 className="text-xl font-semibold text-foreground">
              Team not found
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              The team you are looking for does not exist.
            </p>

            <Link
              href="/organization/teams"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Teams
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const teamLead = teamMembers.find(
    (user) => user.id === team.teamLeadId
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={`/organization/teams/${team.id}`}
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Team
            </Link>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Manage Members
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage members assigned to the {team.name} team.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddMember((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" />
            {showAddMember ? "Close" : "Add Member"}
          </button>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2">
          <DashboardCard
            title="Team Members"
            value={teamMembers.length}
            icon={Users}
            description="Current members"
          />

          <DashboardCard
            title="Team Lead"
            value={teamLead?.name ?? "Not assigned"}
            icon={CheckCircle2}
            description="Current team lead"
          />
        </div>

        {/* Add Member */}
        {showAddMember && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Add Member
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select an organization member to assign to this team.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search members..."
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="mt-5 divide-y divide-border rounded-lg border border-border">
              {filteredAvailableMembers.length > 0 ? (
                filteredAvailableMembers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {getInitials(user.name)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={actionLoading === user.id}
                      onClick={() => handleAddMember(user.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <UserPlus className="h-4 w-4" />
                      {actionLoading === user.id ? "Adding..." : "Add"}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Users className="mx-auto h-8 w-8 text-muted-foreground" />

                  <p className="mt-3 text-sm font-medium text-foreground">
                    No available members
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    No organization members match your search.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Members */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <h2 className="text-base font-semibold text-foreground">
              Current Members
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              People currently assigned to the {team.name} team.
            </p>
          </div>

          {teamMembers.length > 0 ? (
            <div className="divide-y divide-border">
              {teamMembers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {getInitials(user.name)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {user.name}
                        </p>

                        {user.id === team.teamLeadId && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Team Lead
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={user.status} />

                    {user.id !== team.teamLeadId && (
                      <button
                        type="button"
                        disabled={actionLoading === user.id}
                        onClick={() => handleRemoveMember(user.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <UserMinus className="h-4 w-4" />

                        <span className="hidden sm:inline">
                          {actionLoading === user.id
                            ? "Removing..."
                            : "Remove"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <Users className="mx-auto h-10 w-10 text-muted-foreground" />

              <h3 className="mt-3 text-sm font-semibold text-foreground">
                No members yet
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Add members to start building this team.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="mt-2 text-2xl font-semibold text-foreground">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "Active" | "Inactive" | "Pending";
}) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Active
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      Inactive
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}