"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Mail,
  MoreHorizontal,
  Pencil,
  Power,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";

import {
  getUsers,
  updateUserStatus,
  deleteUser,
} from "@/lib/users";

import type { User as UserType } from "@/lib/mock-data/users";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
      {initials}
    </div>
  );
}

function getUserIdLabel(id: number) {
  return `USR-${String(id).padStart(6, "0")}`;
}

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const userId = Number(params.id);

  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [status, setStatus] =
    useState<UserType["status"]>("Active");

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [isCopied, setIsCopied] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentUsers = getUsers();

    const foundUser = currentUsers.find(
      (item) => item.id === userId
    );

    if (foundUser) {
      setUser(foundUser);
      setStatus(foundUser.status);
    }

    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timer = window.setTimeout(() => {
      setNotification(null);
    }, 3500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [notification]);

  const handleCopyUserId = async () => {
    if (!user) {
      return;
    }

    const userIdLabel = getUserIdLabel(user.id);

    try {
      await navigator.clipboard.writeText(userIdLabel);

      setIsCopied(true);

      window.setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      setNotification({
        type: "error",
        message: "Unable to copy the user ID.",
      });
    }
  };

  const handleToggleStatus = () => {
    if (!user || status === "Pending") {
      return;
    }

    const newStatus =
      status === "Active" ? "Inactive" : "Active";

    updateUserStatus(user.id, newStatus);

    setStatus(newStatus);

    setUser({
      ...user,
      status: newStatus,
    });

    setIsMenuOpen(false);

    setNotification({
      type: "success",
      message:
        newStatus === "Active"
          ? `${user.name} has been activated successfully.`
          : `${user.name} has been deactivated successfully.`,
    });
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    setIsDeleting(true);

    try {
      deleteUser(user.id);

      setShowDeleteConfirm(false);

      router.push("/admin/users");
    } finally {
      setIsDeleting(false);
    }
  };

  const statusStyles =
    status === "Active"
      ? "border border-success/20 bg-success/10 text-success"
      : status === "Pending"
        ? "border border-warning/20 bg-warning/10 text-warning"
        : "border border-danger/20 bg-danger/10 text-danger";

  const statusDotStyles =
    status === "Active"
      ? "bg-success"
      : status === "Pending"
        ? "bg-warning"
        : "bg-danger";

  if (isLoading) {
    return (
      <AdminLayout
        title="User"
        subtitle="Tasker Administration"
      >
        <div className="space-y-6">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />

          <div className="h-32 animate-pulse rounded-2xl bg-muted" />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout
        title="User Not Found"
        subtitle="Tasker Administration"
      >
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>

          <h2 className="mt-4 text-xl font-bold">
            User not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            The user you are looking for does not exist or may
            have already been deleted.
          </p>

          <Link
            href="/admin/users"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="User Details"
      subtitle="Tasker Administration"
    >
      <div className="space-y-6">
        {/* Notification */}
        {notification && (
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              notification.type === "success"
                ? "border-success/20 bg-success/10"
                : "border-danger/20 bg-danger/10"
            }`}
          >
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                notification.type === "success"
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">
                {notification.type === "success"
                  ? "Success"
                  : "Something went wrong"}
              </p>

              <p className="mt-0.5 text-sm text-muted-foreground">
                {notification.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotification(null)}
              className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/admin"
            className="transition hover:text-foreground"
          >
            Dashboard
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/admin/users"
            className="transition hover:text-foreground"
          >
            Users
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="text-foreground">
            {user.name}
          </span>
        </div>

        {/* Back */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>

        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar name={user.name} />

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">
                  {user.name}
                </h2>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusDotStyles}`}
                  />

                  {status}
                </span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                User account and administration details
              </p>
            </div>
          </div>

          {/* Actions */}
          <div
            ref={menuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setIsMenuOpen((open) => !open)
              }
              aria-label="More user actions"
              aria-expanded={isMenuOpen}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              Actions
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 z-20 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg">
                {/* Edit */}
                <Link
                  href={`/admin/users/${user.id}/edit`}
                  onClick={() =>
                    setIsMenuOpen(false)
                  }
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                  Edit User
                </Link>

                {/* Activate / Deactivate */}
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  disabled={status === "Pending"}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    status === "Active"
                      ? "text-warning hover:bg-warning/10"
                      : "text-success hover:bg-success/10"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <Power className="h-4 w-4" />

                  {status === "Pending"
                    ? "Pending Invitation"
                    : status === "Active"
                      ? "Deactivate User"
                      : "Activate User"}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-danger transition hover:bg-danger/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete User
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<User className="h-5 w-5" />}
            label="User role"
            value={user.role}
          />

          <StatCard
            icon={
              status === "Active" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )
            }
            label="Account status"
            value={status}
          />

          <StatCard
            icon={<Building2 className="h-5 w-5" />}
            label="Organization"
            value={user.organization}
          />
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Information */}
          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-semibold">
                User information
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Personal account details.
              </p>
            </div>

            <div className="grid gap-6 p-5 sm:grid-cols-2">
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label="Full name"
                value={user.name}
              />

              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email address"
                value={user.email}
              />

              <InfoItem
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Role"
                value={user.role}
              />

              <InfoItem
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Status"
                value={status}
              />
            </div>
          </section>

          {/* Organization */}
          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-semibold">
                Organization
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                User&apos;s organization.
              </p>
            </div>

            <div className="p-5">
              <Link
                href={`/admin/organizations/${user.organizationId}`}
                className="group block rounded-lg border border-border p-4 transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold group-hover:text-primary">
                      {user.organization}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      View organization details
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>

        {/* Account Information */}
        <section className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">
                Account information
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                System information and account status.
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${statusDotStyles}`}
              />

              {status}
            </span>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-3">
            {/* User ID */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                User ID
              </p>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
                  <span className="truncate font-mono text-sm font-semibold">
                    {getUserIdLabel(user.id)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Copy user ID"
                  title="Copy user ID"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {isCopied && (
                <p className="mt-1.5 text-xs text-success">
                  User ID copied
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </p>

              <div className="mt-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusDotStyles}`}
                  />

                  {status}
                </span>
              </div>
            </div>

            {/* Joined */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Joined
              </p>

              <p className="mt-2 text-sm font-medium">
                {user.joinedAt}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
              <Trash2 className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-bold">
              Delete User?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {user.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete User"}
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