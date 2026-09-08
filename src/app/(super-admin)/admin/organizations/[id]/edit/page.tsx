"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Save,
  User,
  XCircle,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { organizations } from "@/lib/mock-data/organizations";

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();

  const organizationId = Number(params.id);

  const organization = organizations.find(
    (item) => item.id === organizationId
  );

  const adminNameParts = organization?.admin.trim().split(/\s+/) ?? [];

  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: organization?.name ?? "",
    organizationEmail: organization?.email ?? "",
    phone: organization?.phone ?? "",
    address: organization?.address ?? "",
    firstName: adminNameParts[0] ?? "",
    lastName: adminNameParts.slice(1).join(" "),
    adminEmail: organization?.adminEmail ?? "",
  });

  if (!organization) {
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
            The organization you are trying to edit does not exist.
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

  const handleChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSaving(true);

    // Temporary frontend-only update.
    // This will later be replaced with the Laravel API request.
    await new Promise((resolve) =>
      setTimeout(resolve, 800)
    );

    organization.name = formData.organizationName;
    organization.email = formData.organizationEmail;
    organization.phone = formData.phone;
    organization.address = formData.address;
    organization.admin = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    organization.adminEmail = formData.adminEmail;

    setIsSaving(false);

    router.push(`/admin/organizations/${organization.id}`);
  };

  const isActive = organization.status === "Active";

  return (
    <AdminLayout
      title={organization.name}
      subtitle="Edit Organization"
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

        <Link
          href={`/admin/organizations/${organization.id}`}
          className="transition hover:text-foreground"
        >
          {organization.name}
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-foreground">
          Edit
        </span>
      </div>

      {/* Back */}
      <Link
        href={`/admin/organizations/${organization.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to organization
      </Link>

      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Edit organization
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Update the organization information and administrator details.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Organization information */}
            <section className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Organization information
                    </h3>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Update the basic details of this organization.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <FormField
                  label="Organization name"
                  value={formData.organizationName}
                  onChange={(value) =>
                    handleChange("organizationName", value)
                  }
                  placeholder="Enter organization name"
                  required
                />

                <FormField
                  label="Organization email"
                  type="email"
                  value={formData.organizationEmail}
                  onChange={(value) =>
                    handleChange("organizationEmail", value)
                  }
                  placeholder="organization@example.com"
                  required
                />

                <FormField
                  label="Phone number"
                  value={formData.phone}
                  onChange={(value) =>
                    handleChange("phone", value)
                  }
                  placeholder="+234..."
                />

                <FormField
                  label="Address"
                  value={formData.address}
                  onChange={(value) =>
                    handleChange("address", value)
                  }
                  placeholder="Enter organization address"
                />
              </div>
            </section>

            {/* Administrator */}
            <section className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Organization administrator
                    </h3>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Update the primary administrator for this account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <FormField
                  label="First name"
                  value={formData.firstName}
                  onChange={(value) =>
                    handleChange("firstName", value)
                  }
                  placeholder="Enter first name"
                  required
                />

                <FormField
                  label="Last name"
                  value={formData.lastName}
                  onChange={(value) =>
                    handleChange("lastName", value)
                  }
                  placeholder="Enter last name"
                  required
                />

                <div className="sm:col-span-2">
                  <FormField
                    label="Administrator email"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(value) =>
                      handleChange("adminEmail", value)
                    }
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Side information */}
          <div className="space-y-6">
            {/* Organization status */}
            <section className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="font-semibold">
                  Organization status
                </h3>
              </div>

              <div className="p-5">
                <div
                  className={`flex items-center gap-3 rounded-lg p-3 ${
                    isActive
                      ? "bg-success/10"
                      : "bg-danger/10"
                  }`}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      isActive
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  />

                  <div>
                    <p
                      className={`flex items-center gap-1.5 text-sm font-semibold ${
                        isActive
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {isActive ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}

                      {organization.status}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {isActive
                        ? "Organization can access Tasker."
                        : "Organization cannot access Tasker."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Admin access */}
            <section className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="font-semibold">
                  Admin access
                </h3>
              </div>

              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Administrator privileges
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      This administrator will have access to manage users
                      and organization resources.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="font-semibold">
                  Location
                </h3>
              </div>

              <div className="p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                  <p className="text-sm text-muted-foreground">
                    {formData.address || "No address provided"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Form actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Link
            href={`/admin/organizations/${organization.id}`}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />

            {isSaving ? "Saving changes..." : "Save changes"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

/* ---------------- Components ---------------- */

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}

        {required && (
          <span className="ml-1 text-danger">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}