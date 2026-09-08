"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  ShieldCheck,
  Trash2,
  User,
  Users,
  XCircle,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";

import {
  getOrganizations,
  updateOrganizationStatus,
  deleteOrganization,
} from "@/lib/organizations";

import type {
  Organization,
  OrganizationStatus,
} from "@/lib/mock-data/organizations";

export default function OrganizationDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [organization, setOrganization] =
    useState<Organization | null>(null);
  const [status, setStatus] =
    useState<OrganizationStatus | null>(null);

  const organizationId = Number(params.id);

  useEffect(() => {
    const organizations = getOrganizations();

    const foundOrganization = organizations.find(
      (item) => item.id === organizationId
    );

    if (foundOrganization) {
      setOrganization(foundOrganization);
      setStatus(foundOrganization.status);
    }
  }, [organizationId]);

  if (!organization || !status) {
    return (
      <AdminLayout
        title="Organization Not Found"
        subtitle="Tasker Administration"
      >
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/40" />

          <h2 className="mt-4 text-xl font-bold">
            Organization not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            The organization you are looking for does not exist.
          </p>

          <Link
            href="/admin/organizations"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to organizations
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const isActive = status === "Active";

  const handleToggleStatus = () => {
    const nextStatus: OrganizationStatus = isActive
      ? "Inactive"
      : "Active";

    updateOrganizationStatus(organizationId, nextStatus);

    setStatus(nextStatus);

    setOrganization((currentOrganization) =>
      currentOrganization
        ? {
            ...currentOrganization,
            status: nextStatus,
          }
        : currentOrganization
    );

    setShowActions(false);
  };

  const handleDelete = () => {
    deleteOrganization(organizationId);

    setShowDeleteConfirm(false);
    setShowActions(false);

    router.push("/admin/organizations");
  };

  return (
    <AdminLayout
      title="Organization Details"
      subtitle="Tasker Administration"
    >
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/admin"
          className="transition hover:text-foreground"
        >
          Dashboard
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link
          href="/admin/organizations"
          className="transition hover:text-foreground"
        >
          Organizations
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-foreground">
          {organization.name}
        </span>
      </div>

      {/* Back */}
      <Link
        href="/admin/organizations"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to organizations
      </Link>

      {/* Page heading */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-7 w-7 text-primary" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">
                {organization.name}
              </h2>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isActive
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                }`}
              >
                {isActive ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}

                {status}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Organization account and administration details
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowActions(!showActions)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            Actions
          </button>

          {showActions && (
            <div className="absolute right-0 top-12 z-20 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg">
              {/* Edit */}
              <Link
                href={`/admin/organizations/${organization.id}/edit`}
                onClick={() => setShowActions(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
                Edit organization
              </Link>

              {/* Disable / Enable */}
              <button
                type="button"
                onClick={handleToggleStatus}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "text-warning hover:bg-warning/10"
                    : "text-success hover:bg-success/10"
                }`}
              >
                {isActive ? (
                  <>
                    <XCircle className="h-4 w-4" />
                    Disable organization
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Enable organization
                  </>
                )}
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => {
                  setShowActions(false);
                  setShowDeleteConfirm(true);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-danger transition hover:bg-danger/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete organization
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total users"
          value={organization.users.toString()}
        />

        <StatCard
          icon={
            isActive ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )
          }
          label="Organization status"
          value={status}
        />

        <StatCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Created"
          value={organization.created}
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Organization information */}
        <section className="rounded-xl border border-border bg-card lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h3 className="font-semibold">
              Organization information
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Basic information about this organization.
            </p>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2">
            <InfoItem
              icon={<Building2 className="h-4 w-4" />}
              label="Organization name"
              value={organization.name}
            />

            <InfoItem
              icon={<Mail className="h-4 w-4" />}
              label="Organization email"
              value={organization.email}
            />

            <InfoItem
              icon={<Phone className="h-4 w-4" />}
              label="Phone number"
              value={organization.phone}
            />

            <InfoItem
              icon={<MapPin className="h-4 w-4" />}
              label="Address"
              value={organization.address}
            />
          </div>
        </section>

        {/* Administrator */}
        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="font-semibold">
              Administrator
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Primary organization administrator.
            </p>
          </div>

          <div className="p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {organization.admin
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <div>
                <p className="font-semibold">
                  {organization.admin}
                </p>

                <p className="text-sm text-muted-foreground">
                  Organization Admin
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label="Full name"
                value={organization.admin}
              />

              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={organization.adminEmail}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Members */}
      <section className="mt-6 rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">
              Organization members
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage users belonging to this organization.
            </p>
          </div>

          <Link
            href={`/admin/organizations/${organization.id}/users`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Users className="h-4 w-4" />
            View members
          </Link>
        </div>

        <div className="p-5">
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <Users className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 font-medium">
              {organization.users} members
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Member management will be connected to the backend later.
            </p>
          </div>
        </div>
      </section>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Delete organization?
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {organization.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Delete organization
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

/* ---------------- Components ---------------- */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold">
        {value}
      </p>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>

      <p className="break-words text-sm font-medium">
        {value}
      </p>
    </div>
  );
}