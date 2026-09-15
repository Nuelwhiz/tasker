"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  FileText,
  Link as LinkIcon,
  Save,
  Users,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { getOrganization } from "@/lib/organizations";
import { getTeams } from "@/lib/services/team-service";
import { getUsers } from "@/lib/services/user-service";

import type { Organization } from "@/lib/mock-data/organizations";
import type { Team } from "@/lib/mock-data/teams";
import type { User } from "@/lib/mock-data/users";

const ORGANIZATION_ID = 1;

export default function CreateMeetingPage() {
  const router = useRouter();

  const [organization, setOrganization] =
    useState<Organization | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [agenda, setAgenda] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [teamId, setTeamId] = useState("");
  const [attendeeIds, setAttendeeIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [org, organizationTeams, organizationUsers] =
          await Promise.all([
            getOrganization(ORGANIZATION_ID),
            getTeams(ORGANIZATION_ID),
            getUsers(ORGANIZATION_ID),
          ]);

        setOrganization(org);
        setTeams(organizationTeams);
        setUsers(organizationUsers);
      } catch (error) {
        console.error("Failed to load meeting data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function handleAttendeeChange(userId: number) {
    setAttendeeIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !date || !time) {
      return;
    }

    setSaving(true);

    try {
      // Meeting creation will be connected to the meeting
      // service once the service supports createMeeting().
      console.log({
        organizationId: ORGANIZATION_ID,
        title: title.trim(),
        description: description.trim(),
        agenda: agenda.trim(),
        date,
        time,
        meetingLink: meetingLink.trim(),
        teamId: teamId ? Number(teamId) : null,
        attendeeIds,
      });

      router.push("/organization/meetings");
    } catch (error) {
      console.error("Failed to create meeting:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (!organization) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              Organization not found
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We couldn't load the organization for this meeting.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to meetings
            </button>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create Meeting
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Schedule a meeting for {organization.name}.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main information */}
            <div className="space-y-6">
              <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-base font-semibold text-foreground">
                    Meeting information
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add the basic details for the meeting.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Meeting title
                    </label>

                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(event) =>
                        setTitle(event.target.value)
                      }
                      placeholder="e.g. Weekly Team Standup"
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Description
                    </label>

                    <textarea
                      id="description"
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      placeholder="What is this meeting about?"
                      rows={4}
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Agenda */}
                  <div>
                    <label
                      htmlFor="agenda"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Agenda
                    </label>

                    <textarea
                      id="agenda"
                      value={agenda}
                      onChange={(event) =>
                        setAgenda(event.target.value)
                      }
                      placeholder="List the topics to discuss..."
                      rows={5}
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </section>

              {/* Schedule */}
              <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-base font-semibold text-foreground">
                    Schedule
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose when the meeting will take place.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="date"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
                    >
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      Date
                    </label>

                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(event) =>
                        setDate(event.target.value)
                      }
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Time
                    </label>

                    <input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(event) =>
                        setTime(event.target.value)
                      }
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="meetingLink"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    Meeting link
                  </label>

                  <input
                    id="meetingLink"
                    type="url"
                    value={meetingLink}
                    onChange={(event) =>
                      setMeetingLink(event.target.value)
                    }
                    placeholder="https://meet.google.com/..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Team */}
              <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-base font-semibold text-foreground">
                    Team
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select the team this meeting belongs to.
                  </p>
                </div>

                <select
                  value={teamId}
                  onChange={(event) =>
                    setTeamId(event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Organization-wide</option>

                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </section>

              {/* Attendees */}
<section className="rounded-xl border border-border bg-card p-5 shadow-sm">
  <div className="mb-5">
    <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
      <Users className="h-4 w-4" />
      Attendees
    </h2>

    <p className="mt-1 text-sm text-muted-foreground">
      Choose who should attend this meeting.
    </p>
  </div>

  {/* Quick selection */}
  <div className="mb-5 flex flex-wrap gap-2">
    <button
      type="button"
      onClick={() =>
        setAttendeeIds(
          users
            .filter((user) => user.role === "Team Lead")
            .map((user) => user.id)
        )
      }
      className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
    >
      Team Leads
    </button>

    <button
      type="button"
      onClick={() =>
        setAttendeeIds(users.map((user) => user.id))
      }
      className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
    >
      Everyone
    </button>
  </div>

  {/* Selected count */}
  <div className="mb-3 flex items-center justify-between">
    <p className="text-xs text-muted-foreground">
      {attendeeIds.length} selected
    </p>

    {attendeeIds.length > 0 && (
      <button
        type="button"
        onClick={() => setAttendeeIds([])}
        className="text-xs font-medium text-danger transition hover:underline"
      >
        Clear selection
      </button>
    )}
  </div>

  {/* Attendee list */}
  <div className="max-h-64 space-y-2 overflow-y-auto">
    {users.length === 0 ? (
      <p className="text-sm text-muted-foreground">
        No members found.
      </p>
    ) : (
      users.map((user) => (
        <label
          key={user.id}
          className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
        >
          <input
            type="checkbox"
            checked={attendeeIds.includes(user.id)}
            onChange={() => handleAttendeeChange(user.id)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>

            <p className="text-xs text-muted-foreground">
              {user.role}
            </p>
          </div>
        </label>
      ))
    )}
  </div>
</section>
              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Creating..." : "Create Meeting"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/organization/meetings")
                  }
                  className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}