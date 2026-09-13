"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { getOrganization } from "@/lib/services/organization-service";
import { getUser, updateUser } from "@/lib/services/user-service";
import type { User } from "@/lib/mock-data/users";

const ORGANIZATION_ID = 1;

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();

  const userId = Number(params.id);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [organizationName, setOrganizationName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Member" as User["role"],
    status: "Active" as User["status"],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [organization, member] = await Promise.all([
          getOrganization(ORGANIZATION_ID),
          getUser(userId, ORGANIZATION_ID),
        ]);

        setOrganizationName(organization?.name ?? "");

        if (member) {
          setUser(member);

          setFormData({
            name: member.name,
            email: member.email,
            role: member.role,
            status: member.status,
          });
        }
      } catch (error) {
        console.error("Failed to load member:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!Number.isNaN(userId)) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    setSaving(true);

    try {
      const updatedUser = await updateUser(
        user.id,
        ORGANIZATION_ID,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          status: formData.status,
        }
      );

      if (updatedUser) {
        router.push(`/organization/members/${user.id}`);
      }
    } catch (error) {
      console.error("Failed to update member:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />

          <div className="h-[500px] animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Member not found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            This member does not exist or no longer belongs to this
            organization.
          </p>

          <Link
            href="/organization/members"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Members
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Back */}
        <Link
          href={`/organization/members/${user.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Member
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Edit Member
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Update {user.name}'s information for {organizationName}.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card"
        >
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-semibold text-foreground">
              Member Information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update the member's basic information, role, and status.
            </p>
          </div>

          <div className="space-y-5 p-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    name: event.target.value,
                  })
                }
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    email: event.target.value,
                  })
                }
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Enter email address"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label
                htmlFor="role"
                className="text-sm font-medium text-foreground"
              >
                Role
              </label>

              <select
                id="role"
                value={formData.role}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    role: event.target.value as User["role"],
                  })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="Organization Admin">
                  Organization Admin
                </option>
                <option value="Team Lead">Team Lead</option>
                <option value="Member">Member</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-medium text-foreground"
              >
                Status
              </label>

              <select
                id="status"
                value={formData.status}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    status: event.target.value as User["status"],
                  })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:justify-end">
            <Link
              href={`/organization/members/${user.id}`}
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}