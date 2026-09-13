"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { getOrganization } from "@/lib/services/organization-service";
import { getTeams } from "@/lib/services/team-service";
import { getUser } from "@/lib/services/user-service";

import type { Organization } from "@/lib/mock-data/organizations";
import type { Team } from "@/lib/mock-data/teams";
import type { User } from "@/lib/mock-data/users";

const ORGANIZATION_ID = 1;

export default function MemberDetailsPage() {
  const params = useParams();
  const userId = Number(params.id);

  const [organization, setOrganization] =
    useState<Organization | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [teams, setTeams] = useState<Team[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadMember() {
      try {
        setLoading(true);

        const [organizationData, userData, teamsData] =
          await Promise.all([
            getOrganization(ORGANIZATION_ID),
            getUser(userId, ORGANIZATION_ID),
            getTeams(ORGANIZATION_ID),
          ]);

        if (!mounted) {
          return;
        }

        setOrganization(organizationData);
        setUser(userData);
        setTeams(teamsData);
      } catch (error) {
        console.error("Failed to load member:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (!Number.isNaN(userId)) {
      loadMember();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <AdminLayout
        title="Member Details"
        role="organization_admin"
      >
        <div className="space-y-6">
          <div className="h-24 animate-pulse rounded-xl bg-muted" />

          <div className="h-64 animate-pulse rounded-xl bg-muted" />

          <div className="h-48 animate-pulse rounded-xl bg-muted" />
        </div>
      </AdminLayout>
    );
  }

  if (!organization || !user) {
    return (
      <AdminLayout
        title="Member Details"
        role="organization_admin"
      >
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>

            <h1 className="text-xl font-semibold text-foreground">
              Member not found
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              The member you are looking for does not exist in this
              organization.
            </p>

            <Link
              href="/organization/members"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Members
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const assignedTeam = teams.find(
    (team) => team.id === user.teamId
  );

  return (
    <AdminLayout
      title="Member Details"
      subtitle={`${organization.name} · ${user.name}`}
      role="organization_admin"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/organization/members"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Members
          </Link>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
              {getInitials(user.name)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {user.name}
                </h1>

                <StatusBadge status={user.status} />
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            title="Role"
            value={user.role}
            description="Organization role"
            icon={ShieldCheck}
          />

          <InfoCard
            title="Team"
            value={assignedTeam?.name ?? "Unassigned"}
            description="Current team"
            icon={Users}
          />

          <InfoCard
            title="Status"
            value={user.status}
            description="Account status"
            icon={user.status === "Active" ? CheckCircle2 : XCircle}
          />
        </div>

        {/* Member Information */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <h2 className="text-base font-semibold text-foreground">
              Member Information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Basic information about this organization member.
            </p>
          </div>

          <div className="divide-y divide-border">
            <DetailRow
              icon={Mail}
              label="Email Address"
              value={user.email}
            />

            <DetailRow
              icon={ShieldCheck}
              label="Role"
              value={user.role}
            />

            <DetailRow
              icon={Users}
              label="Assigned Team"
              value={assignedTeam?.name ?? "No team assigned"}
            />

            <DetailRow
              icon={CalendarDays}
              label="Joined"
              value={user.joinedAt}
            />
          </div>
        </div>

        {/* Team Information */}
        {assignedTeam && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assigned Team
                </p>

                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  {assignedTeam.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {assignedTeam.description}
                </p>
              </div>

              <Link
                href={`/organization/teams/${assignedTeam.id}`}
                className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                View Team
              </Link>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function InfoCard({
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
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-lg font-semibold text-foreground">
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

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium text-foreground">
          {value}
        </p>
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