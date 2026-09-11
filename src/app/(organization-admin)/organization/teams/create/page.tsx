"use client";

import Link from "next/link";
import { ArrowLeft, UsersRound } from "lucide-react";
import { useState } from "react";

import AdminLayout from "@/components/layout/admin-layout";
import { users } from "@/lib/mock-data/users";

const ORGANIZATION_ID = 1;

export default function CreateTeamPage() {
  const organizationUsers = users.filter(
    (user) => user.organizationId === ORGANIZATION_ID
  );

  const teamLeads = organizationUsers.filter(
    (user) => user.role === "Team Lead"
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamLeadId, setTeamLeadId] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({
      name,
      description,
      teamLeadId: teamLeadId ? Number(teamLeadId) : null,
      status,
    });
  };

  return (
    <AdminLayout
      title="Create Team"
      subtitle="Create and configure a new organization team"
      role="organization_admin"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Back */}
        <Link
          href="/organization/teams"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teams
        </Link>

        {/* Header */}
        <section>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersRound className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Create Team
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Set up a new team and assign a team lead.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-6">
              <h3 className="font-bold">Team information</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Provide the basic details for this team.
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
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Frontend Team"
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
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe what this team is responsible for..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  A short description helps members understand the team's
                  responsibilities.
                </p>
              </div>
            </div>
          </section>

          {/* Team Settings */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-6">
              <h3 className="font-bold">Team settings</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Assign leadership and set the team's current status.
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
                  onChange={(event) => setTeamLeadId(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">No team lead</option>

                  {teamLeads.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-muted-foreground">
                  You can assign or change the team lead later.
                </p>
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
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <p className="mt-2 text-xs text-muted-foreground">
                  Inactive teams won't be available for active team
                  operations.
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/organization/teams"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <UsersRound className="h-4 w-4" />
              Create Team
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}