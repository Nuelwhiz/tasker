"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import AdminLayout from "@/components/layout/admin-layout";
import { organizations } from "@/lib/mock-data/organizations";
import { type Team } from "@/lib/mock-data/teams";
import { type User } from "@/lib/mock-data/users";
import {
  getTeam,
  getTeamLeads,
  updateTeam,
} from "@/lib/services/team-service";

const ORGANIZATION_ID = 1;

export default function EditTeamPage() {
  const params = useParams();
  const teamId = Number(params.id);

  const organization = organizations.find(
    (organization) => organization.id === ORGANIZATION_ID
  );

  const [team, setTeam] = useState<Team | null>(null);
  const [teamLeads, setTeamLeads] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTeamData() {
      setIsLoading(true);

      const [teamData, teamLeadData] = await Promise.all([
        getTeam(teamId, ORGANIZATION_ID),
        getTeamLeads(ORGANIZATION_ID),
      ]);

      setTeam(teamData);
      setTeamLeads(teamLeadData);
      setIsLoading(false);
    }

    loadTeamData();
  }, [teamId]);

  if (isLoading) {
    return (
      <AdminLayout
        title="Edit Team"
        subtitle="Team management"
        role="organization_admin"
      >
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Loading team...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!team) {
    return (
      <AdminLayout
        title="Edit Team"
        subtitle="Team management"
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
              The team you are trying to edit does not exist or
              does not belong to this organization.
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

  return (
    <EditTeamForm
      team={team}
      organizationName={organization?.name ?? "Organization"}
      teamLeads={teamLeads}
    />
  );
}

/* ---------------- Form ---------------- */

function EditTeamForm({
  team,
  organizationName,
  teamLeads,
}: {
  team: Team;
  organizationName: string;
  teamLeads: User[];
}) {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(
    team.description
  );
  const [teamLeadId, setTeamLeadId] = useState(
    team.teamLeadId?.toString() ?? ""
  );
  const [status, setStatus] = useState(team.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSaving(true);

    const updatedTeam = await updateTeam(
      team.id,
      team.organizationId,
      {
        name,
        description,
        teamLeadId: teamLeadId
          ? Number(teamLeadId)
          : null,
        status,
      }
    );

    setIsSaving(false);

    if (!updatedTeam) {
      console.error("Failed to update team.");
      return;
    }

    window.location.href = `/organization/teams/${team.id}`;
  };

  return (
    <AdminLayout
      title="Edit Team"
      subtitle={`${organizationName} · Edit team`}
      role="organization_admin"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Back */}
        <Link
          href={`/organization/teams/${team.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Team
        </Link>

        {/* Header */}
        <section>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersRound className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Edit Team
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Update the details and settings for {team.name}.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Information */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-6">
              <h3 className="font-bold">
                Team information
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Update the team's basic information.
              </p>
            </div>

            <div className="space-y-5">
              {/* Team Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Team name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </section>

          {/* Team Settings */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-6">
              <h3 className="font-bold">
                Team settings
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage the team lead and current team status.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Team Lead */}
              <div>
                <label
                  htmlFor="teamLead"
                  className="mb-2 block text-sm font-semibold"
                >
                  Team Lead
                </label>

                <select
                  id="teamLead"
                  value={teamLeadId}
                  onChange={(event) =>
                    setTeamLeadId(event.target.value)
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">No team lead</option>

                  {teamLeads.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-semibold"
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
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/organization/teams/${team.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}