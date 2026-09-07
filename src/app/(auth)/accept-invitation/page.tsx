"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TaskerLogo } from "@/components/layout/tasker-logo";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Temporary data.
  // Laravel will provide these details after validating the invitation.
  const invitedEmail = "emmanuel@example.com";
  const organizationName = "Acme Technologies";
  const role = "Team Member";

  const passwordRequirements = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "Contains a number",
      valid: /\d/.test(password),
    },
    {
      label: "Contains an uppercase letter",
      valid: /[A-Z]/.test(password),
    },
  ];

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!passwordRequirements.every((item) => item.valid)) {
      setError("Please meet all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("This invitation link is invalid or incomplete.");
      return;
    }

    setIsLoading(true);

    try {
      /*
       * Later, Laravel:
       *
       * POST /api/invitations/accept
       *
       * {
       *   token,
       *   full_name: fullName,
       *   password,
       *   password_confirmation: confirmPassword
       * }
       */

      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log({
        token,
        fullName,
        password,
      });

      // Later:
      // router.push("/login?invited=success");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left side */}
        <section className="relative hidden overflow-hidden bg-primary lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <TaskerLogo light />

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
                You&apos;re invited
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Join your team and start getting things done.
              </h1>

              <p className="mt-6 text-lg leading-8 text-white/75">
                Create your Tasker account, join your organization, and start
                collaborating with your team.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  "Work with your team in one place",
                  "Manage tasks and responsibilities",
                  "Track your progress",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>

                    <span className="text-sm text-white/85">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} Tasker. All rights reserved.
            </p>
          </div>
        </section>

        {/* Right side */}
        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <TaskerLogo />
              <ThemeToggle />
            </div>

            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Complete your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Set up your account to accept the invitation and join your
                team.
              </p>
            </div>

            {/* Invitation details */}
            <div className="mb-7 rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Invitation details
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Organization
                  </p>

                  <p className="mt-1 font-semibold">{organizationName}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Role</p>

                  <p className="mt-1 font-semibold">{role}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Invited email</p>

                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />

                    <p className="text-sm font-medium">{invitedEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium"
                >
                  Full name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Create password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {passwordRequirements.map((requirement) => (
                    <div
                      key={requirement.label}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          requirement.valid
                            ? "bg-success"
                            : "bg-muted-foreground/40"
                        }`}
                      />

                      <span
                        className={
                          requirement.valid
                            ? "text-success"
                            : "text-muted-foreground"
                        }
                      >
                        {requirement.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {passwordsMatch && (
                  <p className="mt-2 text-xs text-success">
                    Passwords match.
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Accept invitation
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
              By creating your account, you agree to Tasker&apos;s terms and
              privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}