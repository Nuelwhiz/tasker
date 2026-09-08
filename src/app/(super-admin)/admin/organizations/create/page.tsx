"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { createOrganization } from "@/lib/organizations";

export default function InviteOrganizationPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationEmail: "",
    organizationPhone: "",
    organizationAddress: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSubmitting(true);

    createOrganization({
      name: formData.organizationName,
      email: formData.organizationEmail,
      phone: formData.organizationPhone,
      address: formData.organizationAddress,
      admin: `${formData.adminFirstName} ${formData.adminLastName}`,
      adminEmail: formData.adminEmail,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/organizations");
    }, 500);
  };

  return (
    <AdminLayout
      title="Invite Organization"
      subtitle="Tasker Administration"
    >
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/admin"
            className="hover:text-primary"
          >
            Dashboard
          </Link>

          <span>/</span>

          <Link
            href="/admin/organizations"
            className="hover:text-primary"
          >
            Organizations
          </Link>

          <span>/</span>

          <span className="text-foreground">
            Invite Organization
          </span>
        </div>

        {/* Back */}
        <Link
          href="/admin/organizations"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to organizations
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">
            Organization management
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Invite a new organization
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Send an invitation to an organization and its
            administrator to join the Tasker platform.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Organization details */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-bold">
                    Organization details
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Provide the basic information for the
                    organization you want to invite.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <FormField
                label="Organization name"
                name="organizationName"
                placeholder="e.g. Acme Technologies"
                value={formData.organizationName}
                onChange={handleChange}
                required
              />

              <FormField
                label="Organization email"
                name="organizationEmail"
                type="email"
                placeholder="admin@organization.com"
                value={formData.organizationEmail}
                onChange={handleChange}
                required
              />

              <FormField
                label="Phone number"
                name="organizationPhone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.organizationPhone}
                onChange={handleChange}
              />

              <FormField
                label="Address"
                name="organizationAddress"
                placeholder="Organization address"
                value={formData.organizationAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Administrator */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-bold">
                    Organization administrator
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    This person will receive the organization
                    invitation and manage the organization.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <FormField
                label="First name"
                name="adminFirstName"
                placeholder="John"
                value={formData.adminFirstName}
                onChange={handleChange}
                required
              />

              <FormField
                label="Last name"
                name="adminLastName"
                placeholder="Doe"
                value={formData.adminLastName}
                onChange={handleChange}
                required
              />

              <div className="sm:col-span-2">
                <FormField
                  label="Administrator email"
                  name="adminEmail"
                  type="email"
                  placeholder="john@organization.com"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Invitation information */}
          <div className="rounded-2xl border border-border bg-primary/5 p-5 sm:p-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Invitation access
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  An invitation will be sent to the administrator&apos;s
                  email address. They can use the invitation to
                  complete their setup and access their Tasker
                  organization dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/organizations"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold transition hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Mail className="h-4 w-4" />

              {isSubmitting
                ? "Sending invitation..."
                : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium"
      >
        {label}

        {required && (
          <span className="ml-1 text-danger">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}