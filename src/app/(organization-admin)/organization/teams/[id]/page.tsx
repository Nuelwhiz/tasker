"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Pencil,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { getOrganization } from "@/lib/services/organization-service";
import { getTeam } from "@/lib/services/team-service";
import { getUsers } from "@/lib/services/user-service";
import type { Organization } from "@/lib/mock-data/organizations";
import type { Team } from "@/lib/mock-data/teams";
import type { User } from "@/lib/mock-data/users";

const ORGANIZATION_ID = 1;

export default function TeamDetailsPage() {
  const params = useParams();
  const teamId = Number(params.id);

  const [organization, setOrganization] =
    useState<Organization | null>(null);

  const [team, setTeam] = useState<Team | null>(null);

  const [organizationUsers, setOrganizationUsers] =
    useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTeamDetails() {
      try {
        const [organizationData, teamData, userData] =
          await Promise.all([
            getOrganization(ORGANIZATION_ID),
            getTeam(teamId, ORGANIZATION_ID),
            getUsers(ORGANIZATION_ID),
          ]);

        if (!isMounted) return;

        setOrganization(organizationData);
        setTeam(teamData);
        setOrganizationUsers(userData);
      } catch (error) {
        console.error("Failed to load team details:", error);

        if (!isMounted) return;

        setOrganization(null);
        setTeam(null);
        setOrganizationUsers([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (!Number.isNaN(teamId)) {
      loadTeamDetails();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [teamId]);

  if (isLoading) {
    return (
      <AdminLayout
        title="Team"
        subtitle="Loading team details..."
        role="organization_admin"
      >
        <div className="space-y-6">
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />

          <div className="animate-pulse rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-muted" />

                <div>
                  <div className="h-8 w-40 rounded bg-muted" />
                  <div className="mt-3 h-4 w-72 rounded bg-muted" />
                  <div className="mt-2 h-4 w-56 rounded bg-muted" />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-16 w-28 rounded-xl bg-muted" />
                <div className="h-16 w-28 rounded-xl bg-muted" />
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!team) {
    return (
      <AdminLayout
        title="Team"
        subtitle="Team details"
        role="organization_admin"
      >
        <div className="space-y-6">
          <Link
            href="/organization/teams"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teams
          </Link>

          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersRound className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-bold">
              Team not found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              The team you are looking for does not exist or does not
              belong to this organization.
            </p>

            <Link
              href="/organization/teams"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Teams
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const teamMembers = organizationUsers.filter(
    (user) => user.teamId === team.id
  );

  const teamLead = organizationUsers.find(
    (user) => user.id === team.teamLeadId
  );

  const activeMembers = teamMembers.filter(
    (member) => member.status === "Active"
  ).length;

  const inactiveMembers = teamMembers.filter(
    (member) => member.status === "Inactive"
  ).length;

  return (
    <AdminLayout
      title={team.name}
      subtitle={
        organization
          ? `${organization.name} · Team details`
          : "Team details"
      }
      role="organization_admin"
    >
      <div className="space-y-6">
        {/* Top Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/organization/teams"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teams
          </Link>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/organization/teams/${team.id}/members`}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Manage Members
            </Link>

            <Link
              href={`/organization/teams/${team.id}/edit`}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
              Edit Team
            </Link>
          </div>
        </div>

        {/* Team Header */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UsersRound className="h-7 w-7" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {team.name}
                  </h2>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      team.status === "Active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
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

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {team.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <InfoStat
                icon={Users}
                label="Members"
                value={teamMembers.length.toString()}
              />

              <InfoStat
                icon={UserRound}
                label="Team Lead"
                value={teamLead ? teamLead.name : "None"}
              />
            </div>
          </div>
        </section>

        {/* Team Information */}
        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Team Lead
                </p>

                <p className="mt-1 font-semibold">
                  {teamLead?.name ?? "No team lead"}
                </p>
              </div>
            </div>

            {teamLead && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{teamLead.email}</span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Created
                </p>

                <p className="mt-1 font-semibold">
                  {team.createdAt}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Member status
                </p>

                <p className="mt-1 font-semibold">
                  {activeMembers} active
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {inactiveMembers} inactive member
              {inactiveMembers === 1 ? "" : "s"}
            </p>
          </div>
        </section>

        {/* Members */}
        <section>
          <div className="mb-4">
            <h3 className="text-lg font-bold">
              Team members
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Members currently assigned to the {team.name} team.
            </p>
          </div>

          {teamMembers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-bold">
                No members yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                There are currently no members assigned to this
                team.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="divide-y divide-border">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {getInitials(member.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {member.name}
                        </p>

                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:shrink-0">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {member.role}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          member.status === "Active"
                            ? "bg-success/10 text-success"
                            : member.status === "Inactive"
                              ? "bg-muted text-muted-foreground"
                              : "bg-warning/10 text-warning"
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

/* ---------------- Components ---------------- */

function InfoStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-1 max-w-[160px] truncate text-sm font-semibold">
        {value}
      </p>
    </div>
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