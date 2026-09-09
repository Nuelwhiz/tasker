"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  Users,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { organizations } from "@/lib/mock-data/organizations";
import { users } from "@/lib/mock-data/users";

const ORGANIZATION_ID = 1;

export default function OrganizationDashboardPage() {
  const organization = organizations.find(
    (organization) => organization.id === ORGANIZATION_ID
  );

  const organizationUsers = users.filter(
    (user) => user.organizationId === ORGANIZATION_ID
  );

  const totalMembers = organizationUsers.length;

  const teamLeads = organizationUsers.filter(
    (user) => user.role === "Team Lead"
  ).length;

  const activeMembers = organizationUsers.filter(
    (user) => user.status === "Active"
  ).length;

  const recentMembers = [...organizationUsers]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  return (
    <AdminLayout
      title="Organization Dashboard"
      subtitle={organization?.name ?? "Tasker Organization"}
      role="organization_admin"
    >
      <div className="space-y-8">
        {/* Welcome */}
        <section>
          <p className="text-sm font-medium text-primary">
            {organization?.name ?? "Organization"} overview
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {organization?.name ?? "Your Organization"}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Welcome back 👋 Manage your organization, members, and
            activities from one place.
          </p>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Members"
            value={totalMembers.toString()}
            description="People in your organization"
            icon={Users}
          />

          <DashboardCard
            title="Active Members"
            value={activeMembers.toString()}
            description="Currently active members"
            icon={Activity}
          />

          <DashboardCard
            title="Team Leads"
            value={teamLeads.toString()}
            description="Members leading teams"
            icon={Users}
          />

          <DashboardCard
            title="Completed"
            value="38"
            description="Tasks completed"
            icon={CheckCircle2}
          />
        </section>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Members */}
          <section className="rounded-2xl border border-border bg-card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
              <div>
                <h3 className="font-bold">Team members</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage the people in{" "}
                  {organization?.name ?? "your organization"}.
                </p>
              </div>

              <Link
                href="/organization/members"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-border">
              {recentMembers.map((member) => (
                <MemberRow
                  key={member.id}
                  name={member.name}
                  email={member.email}
                  role={member.role}
                />
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border p-5">
              <h3 className="font-bold">Quick actions</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Common organization actions.
              </p>
            </div>

            <div className="space-y-2 p-4">
              <Link
                href="/organization/members/invite"
                className="flex items-center justify-between rounded-xl p-3 transition hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-semibold">
                    Invite Members
                  </span>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link
                href="/organization/members"
                className="flex items-center justify-between rounded-xl p-3 transition hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-semibold">
                    Manage Members
                  </span>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl p-3 text-left transition hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bell className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-semibold">
                    Notifications
                  </span>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </section>
        </div>

        {/* Recent Activity */}
        <section className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5 sm:p-6">
            <h3 className="font-bold">Recent activity</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Recent activity within{" "}
              {organization?.name ?? "your organization"}.
            </p>
          </div>

          <div className="divide-y divide-border">
            {recentMembers.slice(0, 3).map((member) => (
              <ActivityItem
                key={member.id}
                title={`${member.name} is part of the organization`}
                description={`${member.role} • ${member.status}`}
                time={member.joinedAt}
              />
            ))}
          </div>
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

function MemberRow({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: "Organization Admin" | "Team Lead" | "Member";
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {name}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {email}
          </p>
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
          role === "Team Lead"
            ? "bg-warning/10 text-warning"
            : role === "Organization Admin"
              ? "bg-success/10 text-success"
              : "bg-primary/10 text-primary"
        }`}
      >
        {role}
      </span>
    </div>
  );
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Activity className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-semibold">
            {title}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <span className="shrink-0 text-xs text-muted-foreground">
        {time}
      </span>
    </div>
  );
}