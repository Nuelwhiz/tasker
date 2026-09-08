"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Mail,
  MoreHorizontal,
  Pencil,
  Power,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { users } from "@/lib/mock-data/users";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
      {initials}
    </div>
  );
}

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const userId = Number(params.id);

  const user = users.find((item) => item.id === userId);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<string>(user?.status ?? "Active");

  const menuRef = useRef<HTMLDivElement | null>(null);

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
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            The user you are looking for does not exist.
          </p>

          <Link
            href="/admin/users"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const handleToggleStatus = () => {
    const newStatus = status === "Active" ? "Inactive" : "Active";

    setStatus(newStatus);
    setIsMenuOpen(false);

    // Temporary mock update.
    // This will be replaced with a Laravel API request later.
    console.log("Updated user status:", {
      userId: user.id,
      status: newStatus,
    });

    alert(
      `${user.name} has been ${
        newStatus === "Active" ? "activated" : "deactivated"
      }.`,
    );
  };

  const handleDelete = () => {
    setIsMenuOpen(false);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    // Temporary mock delete.
    // This will be replaced with a Laravel DELETE request later.
    console.log("Delete user:", user.id);

    alert("User deleted successfully.");

    router.push("/admin/users");
  };

  return (
    <AdminLayout
      title={user.name}
      subtitle="Tasker Administration"
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/admin/users"
            className="transition hover:text-foreground"
          >
            Users
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="text-foreground">{user.name}</span>
        </div>

        {/* Back to Users */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>

        {/* Profile header */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} />

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold">
                    {user.name}
                  </h2>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      status === "Active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {user.email}
                </p>

                <p className="mt-2 text-sm font-medium text-primary">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/users/${user.id}/edit`}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>

              {/* Actions Menu */}
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  aria-label="More user actions"
                  aria-expanded={isMenuOpen}
                  className="rounded-xl border border-border p-2.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-lg">
                    {/* Edit */}
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                      Edit User
                    </Link>

                    {/* Activate / Deactivate */}
                    <button
                      type="button"
                      onClick={handleToggleStatus}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-muted"
                    >
                      <Power className="h-4 w-4 text-muted-foreground" />
                      {status === "Active"
                        ? "Deactivate User"
                        : "Activate User"}
                    </button>

                    <div className="my-1 border-t border-border" />

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive transition hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete User
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Information */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold">
                  User Information
                </h3>

                <p className="text-sm text-muted-foreground">
                  Personal account details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-medium">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email Address
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {user.email}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Role
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {user.role}
                </div>
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Organization
                </h3>

                <p className="text-sm text-muted-foreground">
                  User's organization
                </p>
              </div>
            </div>

            <Link
              href={`/admin/organizations/${user.organizationId}`}
              className="group block rounded-xl border border-border p-4 transition hover:border-primary/40 hover:bg-primary/5"
            >
              <p className="font-semibold group-hover:text-primary">
                {user.organization}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                View organization details
              </p>
            </Link>
          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">
            Account Information
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                User ID
              </p>

              <p className="mt-1 text-sm font-medium">
                #{user.id}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </p>

              <p className="mt-1 text-sm font-medium">
                {status}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Joined
              </p>

              <p className="mt-1 text-sm font-medium">
                {user.joinedAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}