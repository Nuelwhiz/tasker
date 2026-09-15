"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Link as LinkIcon,
  Save,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { getOrganization } from "@/lib/organizations";
import { getTeams } from "@/lib/services/team-service";
import { createMeeting } from "@/lib/services/meeting-service";

import type { Organization } from "@/lib/mock-data/organizations";
import type { Team } from "@/lib/mock-data/teams";

const ORGANIZATION_ID = 1;

export default function CreateMeetingPage() {
  const router = useRouter();

  const [organization, setOrganization] =
    useState<Organization | null>(null);

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [org, organizationTeams] = await Promise.all([
          getOrganization(ORGANIZATION_ID),
          getTeams(ORGANIZATION_ID),
        ]);

        setOrganization(org);
        setTeams(organizationTeams);
      } catch (error) {
        console.error(
          "Failed to load meeting data:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !title.trim() ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return;
    }

    setSaving(true);

    try {
      const selectedTeam = teamId
        ? Number(teamId)
        : null;

      await createMeeting({
        organizationId: ORGANIZATION_ID,
        teamId: selectedTeam,

        title: title.trim(),
        description: description.trim(),

        type: selectedTeam ? "Team" : "Organization",

        status: "Upcoming",

        date,
        startTime,
        endTime,

        meetingLink: meetingLink.trim(),

        // Temporary organizer until authentication
        // is connected.
        organizerId: 1,

        createdAt: new Date()
          .toISOString()
          .split("T")[0],
      });

      router.push("/organization/meetings");
    } catch (error) {
      console.error(
        "Failed to create meeting:",
        error
      );
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
              We couldn't load the organization for this
              meeting.
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

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main content */}
            <div className="space-y-6">
              {/* Meeting information */}
              <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-base font-semibold text-foreground">
                    Meeting information
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Add the basic details for your meeting.
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

                <div className="grid gap-5 sm:grid-cols-3">
                  {/* Date */}
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

                  {/* Start time */}
                  <div>
                    <label
                      htmlFor="startTime"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Start time
                    </label>

                    <input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(event) =>
                        setStartTime(event.target.value)
                      }
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* End time */}
                  <div>
                    <label
                      htmlFor="endTime"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      End time
                    </label>

                    <input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(event) =>
                        setEndTime(event.target.value)
                      }
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Meeting link */}
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
                    Meeting scope
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose whether this meeting is for the
                    entire organization or a specific team.
                  </p>
                </div>

                <select
                  value={teamId}
                  onChange={(event) =>
                    setTeamId(event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">
                    Organization-wide
                  </option>

                  {teams.map((team) => (
                    <option
                      key={team.id}
                      value={team.id}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>

                <div className="mt-3 rounded-lg bg-primary/10 px-3 py-2.5">
                  <p className="text-xs text-primary">
                    {teamId
                      ? "This meeting will be visible to the selected team."
                      : "This meeting is for the entire organization."}
                  </p>
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

                  {saving
                    ? "Creating..."
                    : "Create Meeting"}
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