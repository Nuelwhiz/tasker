"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, LockKeyhole } from "lucide-react";

import { TaskerLogo } from "@/components/layout/tasker-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitationToken = params.get("token");

    if (invitationToken) {
      setToken(invitationToken);
    } else {
      setError("This password setup link is invalid or missing.");
    }
  }, []);

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

  const isPasswordValid = passwordRequirements.every(
    (requirement) => requirement.valid
  );

  const passwordsMatch =
    password.length > 0 && password === confirmPassword;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setError("This invitation link is invalid or has expired.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // TODO: Connect to Laravel API
      //
      // await axios.post("/api/invitations/set-password", {
      //   token,
      //   password,
      //   password_confirmation: confirmPassword,
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch {
      setError(
        "Unable to set your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="absolute right-5 top-5 z-20">
          <ThemeToggle />
        </div>

        <div className="grid min-h-screen lg:grid-cols-2">
          {/* Left panel */}
          <section className="relative hidden overflow-hidden bg-primary lg:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />

            <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
              <TaskerLogo light />

              <div className="max-w-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-white xl:text-5xl">
                  You're almost there.
                </h1>

                <p className="mt-5 text-lg leading-8 text-white/75">
                  Your Tasker account is ready. Sign in and start
                  managing your work with your team.
                </p>
              </div>

              <p className="text-sm text-white/60">
                © {new Date().getFullYear()} Tasker. All rights reserved.
              </p>
            </div>
          </section>

          {/* Success content */}
          <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
            <div className="w-full max-w-md">
              <div className="mb-12 flex items-center justify-between lg:hidden">
                <TaskerLogo />
                <ThemeToggle />
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>

                <h2 className="mt-6 text-3xl font-bold tracking-tight">
                  Password set successfully
                </h2>

                <p className="mt-3 text-muted-foreground">
                  Your Tasker account is ready. You can now sign in
                  with your new password.
                </p>

                <Link
                  href="/login"
                  className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Continue to login
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left panel */}
        <section className="relative hidden overflow-hidden bg-primary lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <TaskerLogo light />

            <div className="max-w-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <LockKeyhole className="h-7 w-7 text-white" />
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white xl:text-5xl">
                Secure your Tasker account.
              </h1>

              <p className="mt-5 text-lg leading-8 text-white/75">
                Create a strong password to protect your account and
                securely access your organization's workspace.
              </p>
            </div>

            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} Tasker. All rights reserved.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-12 flex items-center justify-between lg:hidden">
              <TaskerLogo />
              <ThemeToggle />
            </div>

            <div>
              <div className="mb-8">
                <p className="text-sm font-semibold text-primary">
                  Account setup
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  Set your password
                </h2>

                <p className="mt-3 text-muted-foreground">
                  Create a secure password for your Tasker account.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium"
                  >
                    New password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Create a password"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-12 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
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
                    <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm your password"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-12 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Requirements */}
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="mb-3 text-sm font-medium">
                    Password requirements
                  </p>

                  <div className="space-y-2">
                    {passwordRequirements.map((requirement) => (
                      <div
                        key={requirement.label}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${
                            requirement.valid
                              ? "text-success"
                              : "text-muted-foreground"
                          }`}
                        />

                        <span
                          className={
                            requirement.valid
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {requirement.label}
                        </span>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          passwordsMatch
                            ? "text-success"
                            : "text-muted-foreground"
                        }`}
                      />

                      <span
                        className={
                          passwordsMatch
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        Passwords match
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !token ||
                    !isPasswordValid ||
                    !passwordsMatch
                  }
                  className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Setting password..." : "Set password"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}