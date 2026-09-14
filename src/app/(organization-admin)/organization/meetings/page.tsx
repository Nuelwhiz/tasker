"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Plus,
  Search,
  Users,
  XCircle,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";

import { getOrganization } from "@/lib/organizations";
import { getMeetings } from "@/lib/services/meeting-service";
import { getTeams } from "@/lib/services/team-service";
import { getUsers } from "@/lib/services/user-service";

import type {
  Meeting,
  MeetingStatus,
} from "@/lib/mock-data/meetings";

import type { Organization } from "@/lib/mock-data/organizations";
import type { Team } from "@/lib/mock-data/teams";
import type { User } from "@/lib/mock-data/users";

const ORGANIZATION_ID = 1;

type StatusFilter = "All" | MeetingStatus;

export default function OrganizationMeetingsPage() {
  const [organization, setOrganization] =
    useState<Organization | null>(null);

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          organizationData,
          meetingsData,
          teamsData,
          usersData,
        ] = await Promise.all([
          getOrganization(ORGANIZATION_ID),
          getMeetings(ORGANIZATION_ID),
          getTeams(ORGANIZATION_ID),
          getUsers(ORGANIZATION_ID),
        ]);

        setOrganization(organizationData);
        setMeetings(meetingsData);
        setTeams(teamsData);
        setUsers(usersData);
      } catch (error) {
        console.error(
          "Failed to load meetings:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredMeetings = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return meetings.filter((meeting) => {
      const matchesSearch =
        !normalizedSearch ||
        meeting.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        meeting.description
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        meeting.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [meetings, search, statusFilter]);

  const upcomingCount = meetings.filter(
    (meeting) => meeting.status === "Upcoming"
  ).length;

  const completedCount = meetings.filter(
    (meeting) => meeting.status === "Completed"
  ).length;

  const cancelledCount = meetings.filter(
    (meeting) => meeting.status === "Cancelled"
  ).length;

  function getTeamName(teamId: number | null) {
    if (!teamId) {
      return "Organization-wide";
    }

    return (
      teams.find((team) => team.id === teamId)?.name ??
      "Unknown team"
    );
  }

  function getOrganizerName(organizerId: number) {
    return (
      users.find((user) => user.id === organizerId)?.name ??
      "Unknown organizer"
    );
  }

  function formatDate(date: string) {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(time: string) {
    return new Date(
      `1970-01-01T${time}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <AdminLayout
        title="Meetings"
        subtitle="Manage organization and team meetings"
      >
        <div className="animate-pulse">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="h-7 w-32 rounded bg-muted" />
              <div className="mt-2 h-4 w-64 rounded bg-muted" />
            </div>

            <div className="h-10 w-36 rounded-lg bg-muted" />
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 rounded-xl border border-border bg-card"
              />
            ))}
          </div>

          <div className="h-16 rounded-xl border border-border bg-card" />

          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!organization) {
    return (
      <AdminLayout
        title="Meetings"
        subtitle="Manage organization and team meetings"
      >
        <div className="flex min-h-100 flex-col items-center justify-center text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground/40" />

          <h2 className="mt-4 text-xl font-bold">
            Organization not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            We could not load this organization's meetings.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Meetings"
      subtitle={`${organization.name} • Meetings and documentation`}
    >
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/organization"
          className="transition hover:text-foreground"
        >
          Dashboard
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-foreground">
          Meetings
        </span>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Meetings
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Schedule and manage organization and team meetings.
          </p>
        </div>

        <Link
          href="/organization/meetings/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create meeting
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MeetingStatCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Total meetings"
          value={meetings.length}
        />

        <MeetingStatCard
          icon={<Clock3 className="h-5 w-5" />}
          label="Upcoming"
          value={upcomingCount}
        />

        <MeetingStatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Completed"
          value={completedCount}
        />

        <MeetingStatCard
          icon={<XCircle className="h-5 w-5" />}
          label="Cancelled"
          value={cancelledCount}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search meetings..."
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                "All",
                "Upcoming",
                "Completed",
                "Cancelled",
              ] as StatusFilter[]
            ).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setStatusFilter(status)
                }
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  statusFilter === status
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Meetings */}
      {filteredMeetings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/50" />

          <h3 className="mt-4 font-semibold">
            No meetings found
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {search || statusFilter !== "All"
              ? "Try adjusting your search or filters."
              : "Create your first meeting to get started."}
          </p>

          {!search && statusFilter === "All" && (
            <Link
              href="/organization/meetings/create"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create meeting
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/30"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold">
                      {meeting.title}
                    </h3>

                    <MeetingStatusBadge
                      status={meeting.status}
                    />

                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {meeting.type === "Team" ? (
                        <Users className="h-3 w-3" />
                      ) : (
                        <Building2Icon />
                      )}

                      {meeting.type}
                    </span>
                  </div>

                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {meeting.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(meeting.date)}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {formatTime(meeting.startTime)} -{" "}
                      {formatTime(meeting.endTime)}
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {getTeamName(meeting.teamId)}
                    </div>

                    <div className="flex items-center gap-2">
                      <UserIcon />
                      {getOrganizerName(
                        meeting.organizerId
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:shrink-0">
                  <Link
                    href={`/organization/meetings/${meeting.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                  >
                    <FileText className="h-4 w-4" />
                    Details
                  </Link>

                  {meeting.meetingLink && (
                    <a
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Join meeting
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

function MeetingStatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

function MeetingStatusBadge({
  status,
}: {
  status: MeetingStatus;
}) {
  const styles = {
    Upcoming: "bg-primary/10 text-primary",
    Completed: "bg-success/10 text-success",
    Cancelled: "bg-danger/10 text-danger",
  };

  const icons = {
    Upcoming: <Clock3 className="h-3.5 w-3.5" />,
    Completed: <CheckCircle2 className="h-3.5 w-3.5" />,
    Cancelled: <XCircle className="h-3.5 w-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
}

function Building2Icon() {
  return <span className="text-[11px]">ORG</span>;
}

function UserIcon() {
  return <span className="text-[11px]">USR</span>;
}