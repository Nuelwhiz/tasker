"use client";

import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import AdminLayout from "@/components/layout/admin-layout";
import { createUser } from "@/lib/services/user-service";

const ORGANIZATION_ID = 1;
const ORGANIZATION_NAME = "Acme Technologies";

type MemberRole =
  | "Organization Admin"
  | "Team Lead"
  | "Member";

export default function InviteMemberPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("Member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      await createUser({
        name: name.trim(),
        email: email.trim(),
        role,
        status: "Pending",
        joinedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        organization: ORGANIZATION_NAME,
        organizationId: ORGANIZATION_ID,
        teamId: null,
      });

      router.push("/organization/members");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout
      title="Invite Member"
      subtitle={ORGANIZATION_NAME}
      role="organization_admin"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <section>
          <Link
            href="/organization/members"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Members
          </Link>

          <div className="mt-5">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Invite a Member
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Add a new member to your organization.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. John Doe"
                disabled={loading}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="e.g. john.doe@example.com"
                disabled={loading}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium"
              >
                Role
              </label>

              <select
                id="role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as MemberRole)
                }
                disabled={loading}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="Member">Member</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Organization Admin">
                  Organization Admin
                </option>
              </select>

              <p className="mt-2 text-xs text-muted-foreground">
                You can change the member's role later.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Link
                href="/organization/members"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-semibold transition hover:bg-muted"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus className="h-4 w-4" />

                {loading ? "Inviting..." : "Invite Member"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}