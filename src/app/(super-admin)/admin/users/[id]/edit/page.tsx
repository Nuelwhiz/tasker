"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Lock,
  Mail,
  Save,
  User,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { users } from "@/lib/mock-data/users";

const organizations = [
  {
    id: 1,
    name: "University of Lagos",
  },
  {
    id: 2,
    name: "Lagos State University",
  },
  {
    id: 3,
    name: "Yaba College of Technology",
  },
];

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();

  const userId = Number(params.id);

  const user = users.find((item) => item.id === userId);

  const [name, setName] = useState<string>(user?.name ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [organizationId, setOrganizationId] = useState<string>(
    user ? String(user.organizationId) : "",
  );
  const [role, setRole] = useState<string>(
    user?.role ?? "Member",
  );
  const [status, setStatus] = useState<string>(
    user?.status ?? "Active",
  );
  const [password, setPassword] = useState<string>("");

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
            The user you are trying to edit does not exist.
          </p>

          <Link
            href="/admin/users"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const updatedUser = {
      id: user.id,
      name,
      email,
      organizationId: Number(organizationId),
      role,
      status,
      password: password || undefined,
    };

    // Temporary mock update.
    // This will be replaced with a Laravel API request later.
    console.log("Updated user:", updatedUser);

    alert("User updated successfully.");

    router.push(`/admin/users/${user.id}`);
  };

  return (
    <AdminLayout
      title={`Edit ${user.name}`}
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

          <Link
            href={`/admin/users/${user.id}`}
            className="transition hover:text-foreground"
          >
            {user.name}
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="text-foreground">
            Edit
          </span>
        </div>

        {/* Page Header */}
        <div>
          <Link
            href={`/admin/users/${user.id}`}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to User
          </Link>

          <h2 className="text-2xl font-bold">
            Edit User
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Update this user's account information and access.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-border bg-card">
            {/* Basic Information */}
            <div className="border-b border-border p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Basic Information
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Update the user's account details.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Enter full name"
                      required
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="user@example.com"
                      required
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold"
                  >
                    New Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Leave blank to keep current"
                      minLength={8}
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Leave blank if you don't want to change the
                    password.
                  </p>
                </div>
              </div>
            </div>

            {/* Organization & Access */}
            <div className="border-b border-border p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Organization & Access
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Update the user's organization and role.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Organization */}
                <div>
                  <label
                    htmlFor="organization"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Organization
                  </label>

                  <select
                    id="organization"
                    value={organizationId}
                    onChange={(event) =>
                      setOrganizationId(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="">
                      Select organization
                    </option>

                    {organizations.map((organization) => (
                      <option
                        key={organization.id}
                        value={organization.id}
                      >
                        {organization.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Role
                  </label>

                  <select
                    id="role"
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="Member">
                      Member
                    </option>

                    <option value="Team Lead">
                      Team Lead
                    </option>

                    <option value="Organization Admin">
                      Organization Admin
                    </option>

                    <option value="Super Admin">
                      Super Admin
                    </option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Account Status
                  </label>

                  <select
                    id="status"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 p-6 sm:flex-row sm:items-center sm:justify-end sm:p-8">
              <Link
                href={`/admin/users/${user.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}