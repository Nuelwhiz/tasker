"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Pencil,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { getOrganization } from "@/lib/services/organization-service";
import { getTeams } from "@/lib/services/team-service";
import {
  deleteUser,
  getUser,
} from "@/lib/services/user-service";
import type { User } from "@/lib/mock-data/users";
import type { Team } from "@/lib/mock-data/teams";

const ORGANIZATION_ID = 1;

export default function MemberDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const userId = Number(params.id);

  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [organization, member, organizationTeams] =
          await Promise.all([
            getOrganization(ORGANIZATION_ID),
            getUser(userId, ORGANIZATION_ID),
            getTeams(ORGANIZATION_ID),
          ]);

        setOrganizationName(organization?.name ?? "");
        setUser(member);
        setTeams(organizationTeams);
      } catch (error) {
        console.error("Failed to load member:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!Number.isNaN(userId)) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  async function handleDelete() {
    if (!user) return;

    setDeleting(true);

    try {
      const deleted = await deleteUser(
        user.id,
        ORGANIZATION_ID
      );

      if (deleted) {
        router.push("/organization/members");
      }
    } catch (error) {
      console.error("Failed to delete member:", error);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
          <div className="h-48 animate-pulse rounded-xl border border-border bg-card" />
          <div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>

          <h1 className="text-xl font-semibold text-foreground">
            Member not found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            This member does not exist or no longer belongs to this
            organization.
          </p>

          <Link
            href="/organization/members"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Members
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const assignedTeam = teams.find(
    (team) => team.id === user.teamId
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back */}
        <Link
          href="/organization/members"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {getInitials(user.name)}
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {user.name}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {organizationName}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={`/organization/members/${user.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>

            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Role"
            value={user.role}
          />

          <InfoCard
            icon={<Users className="h-5 w-5" />}
            label="Team"
            value={assignedTeam?.name ?? "Not assigned"}
          />

          <InfoCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Status"
            value={user.status}
            status={user.status}
          />
        </div>

        {/* Member Information */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-semibold text-foreground">
              Member Information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Basic information about this organization member.
            </p>
          </div>

          <div className="divide-y divide-border">
            <DetailRow
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={user.email}
            />

            <DetailRow
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Role"
              value={user.role}
            />

            <DetailRow
              icon={<Users className="h-4 w-4" />}
              label="Assigned Team"
              value={assignedTeam?.name ?? "Not assigned"}
            />

            <DetailRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Joined"
              value={formatDate(user.joinedAt)}
            />
          </div>
        </div>

        {/* Assigned Team */}
        {assignedTeam && (
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-5">
              <h2 className="font-semibold text-foreground">
                Assigned Team
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                The team this member currently belongs to.
              </p>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  {assignedTeam.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {assignedTeam.description ||
                    "No team description available."}
                </p>
              </div>

              <Link
                href={`/organization/teams/${assignedTeam.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                View Team
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              if (!deleting) {
                setDeleteModalOpen(false);
              }
            }}
          />

          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-member-title"
            className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card shadow-xl"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <Trash2 className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    id="delete-member-title"
                    className="font-semibold text-foreground"
                  >
                    Delete Member
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-5">
              <p className="text-sm leading-6 text-muted-foreground">
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  {user.name}
                </span>
                ? This will permanently remove this member from the
                organization.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModalOpen(false)}
                className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting..." : "Delete Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function InfoCard({
  icon,
  label,
  value,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>

          {status ? (
            <StatusBadge status={status} />
          ) : (
            <p className="mt-1 truncate text-sm font-medium text-foreground">
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center">
      <div className="flex w-44 shrink-0 items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>

      <p className="text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    Active: "bg-success/10 text-success",
    Inactive: "bg-muted text-muted-foreground",
    Pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  };

  const style =
    statusStyles[status as keyof typeof statusStyles] ??
    "bg-muted text-muted-foreground";

  return (
    <span
      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {status}
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

function formatDate(date: string) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}