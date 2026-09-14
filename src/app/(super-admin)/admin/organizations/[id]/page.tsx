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
  X,
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
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

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

    setLoading(false);
  }, [organizationId]);

  if (loading) {
    return (
      <AdminLayout
        title="Organization Details"
        subtitle="Tasker Administration"
      >
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>

          {/* Back button skeleton */}
          <div className="mb-6 h-5 w-36 rounded bg-muted" />

          {/* Header skeleton */}
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-muted" />

              <div>
                <div className="h-7 w-48 rounded bg-muted" />
                <div className="mt-2 h-4 w-64 rounded bg-muted" />
              </div>
            </div>

            <div className="h-10 w-24 rounded-lg bg-muted" />
          </div>

          {/* Stats skeleton */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-4 h-10 w-10 rounded-lg bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="mt-2 h-6 w-20 rounded bg-muted" />
              </div>
            ))}
          </div>

          {/* Main content skeleton */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-64 rounded-xl border border-border bg-card lg:col-span-2" />
            <div className="h-64 rounded-xl border border-border bg-card" />
          </div>

          {/* Members skeleton */}
          <div className="mt-6 h-48 rounded-xl border border-border bg-card" />
        </div>
      </AdminLayout>
    );
  }

  if (!organization || !status) {
    return (
      <AdminLayout
        title="Organization Not Found"
        subtitle="Tasker Administration"
      >
        <div className="flex min-h-100 flex-col items-center justify-center text-center">
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
    setDeleting(true);

    try {
      deleteOrganization(organizationId);

      setShowDeleteConfirm(false);
      setShowActions(false);

      router.push("/admin/organizations");
    } catch (error) {
      console.error("Failed to delete organization:", error);
      setDeleting(false);
    }
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              if (!deleting) {
                setShowDeleteConfirm(false);
              }
            }}
          />

          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-organization-title"
            className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card shadow-xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <Trash2 className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    id="delete-organization-title"
                    className="font-semibold text-foreground"
                  >
                    Delete Organization
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-sm leading-6 text-muted-foreground">
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  {organization.name}
                </span>
                ? This will permanently remove this organization
                and its associated data.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteConfirm(false)}
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
                {deleting
                  ? "Deleting..."
                  : "Delete Organization"}
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

      <p className="wrap-break-word text-sm font-medium">
        {value}
      </p>
    </div>
  );
}