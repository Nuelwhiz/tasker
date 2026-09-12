"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  UserRound,
  UsersRound,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { getOrganization } from "@/lib/services/organization-service";
import { getTeams } from "@/lib/services/team-service";
import { getUsers } from "@/lib/services/user-service";

import type { Organization } from "@/lib/mock-data/organizations";
import type { Team } from "@/lib/mock-data/teams";
import type { User } from "@/lib/mock-data/users";

const ORGANIZATION_ID = 1;

export default function OrganizationTeamsPage() {
  const [organization, setOrganization] =
    useState<Organization | null>(null);

  const [organizationTeams, setOrganizationTeams] =
    useState<Team[]>([]);

  const [organizationUsers, setOrganizationUsers] =
    useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTeamsPage() {
      try {
        const [
          organizationData,
          teamsData,
          usersData,
        ] = await Promise.all([
          getOrganization(ORGANIZATION_ID),
          getTeams(ORGANIZATION_ID),
          getUsers(ORGANIZATION_ID),
        ]);

        setOrganization(organizationData);
        setOrganizationTeams(teamsData);
        setOrganizationUsers(usersData);
      } catch (error) {
        console.error(
          "Failed to load organization teams:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadTeamsPage();
  }, []);

  const totalTeams = organizationTeams.length;

  const activeTeams = organizationTeams.filter(
    (team) => team.status === "Active"
  ).length;

  const assignedMembers = organizationUsers.filter(
    (user) => user.teamId !== null
  ).length;

  const unassignedMembers = organizationUsers.filter(
    (user) => user.teamId === null
  ).length;

  const getTeamLeadName = (teamLeadId: number | null) => {
    if (!teamLeadId) {
      return "No team lead";
    }

    const teamLead = organizationUsers.find(
      (user) => user.id === teamLeadId
    );

    return teamLead?.name ?? "No team lead";
  };

  const getMemberCount = (teamId: number) => {
    return organizationUsers.filter(
      (user) => user.teamId === teamId
    ).length;
  };

  return (
    <AdminLayout
      title="Teams"
      subtitle={
        organization
          ? `${organization.name} team management`
          : "Manage organization teams"
      }
      role="organization_admin"
    >
      <div className="space-y-8">
        {/* Header */}
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                {organization?.name ?? "Organization"} overview
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Teams
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Manage your organization&apos;s teams, team leads, and
                members from one place.
              </p>
            </div>

            <Link
              href="/organization/teams/create"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <UsersRound className="h-4 w-4" />
              Create Team
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Teams"
            value={totalTeams.toString()}
            description="Teams in your organization"
            icon={UsersRound}
          />

          <DashboardCard
            title="Active Teams"
            value={activeTeams.toString()}
            description="Currently active teams"
            icon={CheckCircle2}
          />

          <DashboardCard
            title="Assigned Members"
            value={assignedMembers.toString()}
            description="Members assigned to teams"
            icon={Users}
          />

          <DashboardCard
            title="Unassigned Members"
            value={unassignedMembers.toString()}
            description="Members without a team"
            icon={UserRound}
          />
        </section>

        {/* Teams */}
        <section>
          <div className="mb-4">
            <h3 className="text-lg font-bold">
              Organization teams
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Select a team to view its members and roles.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl border border-border bg-card"
                />
              ))}
            </div>
          ) : organizationTeams.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UsersRound className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-bold">
                No teams yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Create your first team to start organizing members
                and assigning responsibilities.
              </p>

              <Link
                href="/organization/teams/create"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <UsersRound className="h-4 w-4" />
                Create Team
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {organizationTeams.map((team) => {
                const memberCount = getMemberCount(team.id);
                const teamLeadName = getTeamLeadName(
                  team.teamLeadId
                );

                return (
                  <Link
                    key={team.id}
                    href={`/organization/teams/${team.id}`}
                    className="group rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Team Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <UsersRound className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-bold">
                            {team.name}
                          </h3>

                          <span
                            className={`mt-1 inline-flex items-center gap-1.5 text-xs font-semibold ${
                              team.status === "Active"
                                ? "text-success"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                team.status === "Active"
                                  ? "bg-success"
                                  : "bg-muted-foreground"
                              }`}
                            />

                            {team.status}
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                    </div>

                    {/* Description */}
                    <p className="mt-5 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {team.description}
                    </p>

                    {/* Team Details */}
                    <div className="mt-5 space-y-3 border-t border-border pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          Members
                        </div>

                        <span className="text-sm font-semibold">
                          {memberCount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <UserRound className="h-4 w-4" />
                          Team Lead
                        </div>

                        <span className="max-w-[150px] truncate text-right text-sm font-semibold">
                          {teamLeadName}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <span className="text-xs text-muted-foreground">
                        Created {team.createdAt}
                      </span>

                      <span className="text-sm font-semibold text-primary">
                        View team
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

/* ---------------- Components ---------------- */

function DashboardCard({
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
    <div className="rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
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