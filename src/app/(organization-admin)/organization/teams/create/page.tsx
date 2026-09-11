"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

import AdminLayout from "@/components/layout/admin-layout";
import { getOrganization } from "@/lib/services/organization-service";
import {
  createTeam,
} from "@/lib/services/team-service";
import { getTeamLeads } from "@/lib/services/user-service";

import type { Organization } from "@/lib/mock-data/organizations";
import type { User } from "@/lib/mock-data/users";

const ORGANIZATION_ID = 1;

export default function CreateTeamPage() {
  const router = useRouter();

  const [organization, setOrganization] =
    useState<Organization | null>(null);

  const [teamLeads, setTeamLeads] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamLeadId, setTeamLeadId] = useState("");
  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCreateTeamPage() {
      try {
        const [organizationData, teamLeadData] =
          await Promise.all([
            getOrganization(ORGANIZATION_ID),
            getTeamLeads(ORGANIZATION_ID),
          ]);

        setOrganization(organizationData);
        setTeamLeads(teamLeadData);
      } catch {
        setError(
          "Unable to load the team creation page. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCreateTeamPage();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Team name is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const createdTeam = await createTeam({
        organizationId: ORGANIZATION_ID,
        name: trimmedName,
        description: trimmedDescription,
        teamLeadId: teamLeadId
          ? Number(teamLeadId)
          : null,
        status,
      });

      router.push(`/organization/teams/${createdTeam.id}`);
    } catch {
      setError(
        "Something went wrong while creating the team. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminLayout
      title="Create Team"
      subtitle={
        organization
          ? `${organization.name} · Create a new team`
          : "Create a new organization team"
      }
      role="organization_admin"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/organization/teams"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teams
          </Link>

          <div className="mt-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersRound className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Create Team
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Create a team and assign a team lead to help manage
              its members and responsibilities.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <div className="space-y-6">
            {/* Team Name */}
            <div>
              <label
                htmlFor="name"
                className="text-sm font-semibold"
              >
                Team Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Frontend"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Give your team a clear and recognizable name.
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="text-sm font-semibold"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe what this team is responsible for..."
                rows={4}
                disabled={isSubmitting}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                A short description helps members understand the
                team's purpose.
              </p>
            </div>

            {/* Team Lead */}
            <div>
              <label
                htmlFor="teamLead"
                className="text-sm font-semibold"
              >
                Team Lead
              </label>

              <select
                id="teamLead"
                value={teamLeadId}
                onChange={(event) =>
                  setTeamLeadId(event.target.value)
                }
                disabled={isLoading || isSubmitting}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  No team lead
                </option>

                {teamLeads.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} — {user.email}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-muted-foreground">
                You can assign or change the team lead later.
              </p>

              {!isLoading && teamLeads.length === 0 && (
                <p className="mt-2 text-xs text-warning">
                  No Team Lead users are currently available.
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="text-sm font-semibold"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "Active"
                      | "Inactive"
                  )
                }
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <p className="mt-2 text-xs text-muted-foreground">
                Inactive teams can remain in the organization
                without being actively used.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/organization/teams"
                className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  isLoading ||
                  !name.trim()
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Creating Team..."
                  : "Create Team"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}