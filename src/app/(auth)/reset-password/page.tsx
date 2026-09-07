"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TaskerLogo } from "@/components//layout/tasker-logo";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

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

    if (!token || !email) {
      setError(
        "This password reset link is invalid or incomplete. Please request a new one."
      );
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

    setIsLoading(true);

    try {
      /*
       * Later, Laravel:
       *
       * POST /api/auth/reset-password
       *
       * {
       *   token,
       *   email,
       *   password,
       *   password_confirmation
       * }
       */

      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log({
        token,
        email,
        password,
      });

      setIsSuccess(true);
    } catch {
      setError(
        "Unable to reset your password. The link may have expired."
      );
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
                Account security
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Create a new password and get back to work.
              </h1>

              <p className="mt-6 text-lg leading-8 text-white/75">
                Keep your Tasker account secure with a strong password you can
                remember.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  "Secure your account",
                  "Protect your team and tasks",
                  "Get back to work quickly",
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
            <div className="mb-12 flex items-center justify-between lg:hidden">
              <TaskerLogo />
              <ThemeToggle />
            </div>

            {!isSuccess ? (
              <>
                <div className="mb-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight">
                    Reset your password
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Create a new password for your Tasker account.
                  </p>

                  {email && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Resetting password for{" "}
                      <span className="font-medium text-foreground">
                        {email}
                      </span>
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium"
                    >
                      New password
                    </label>

                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="Create a new password"
                        autoComplete="new-password"
                        className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((value) => !value)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
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
                      Confirm new password
                    </label>

                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword ? "text" : "password"
                        }
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                        className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
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
                        Resetting password...
                      </>
                    ) : (
                      <>
                        Reset password
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <Link
                  href="/login"
                  className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>

                <h2 className="mt-6 text-3xl font-bold tracking-tight">
                  Password reset successful
                </h2>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Your password has been updated successfully. You can now
                  sign in to your Tasker account using your new password.
                </p>

                <Link
                  href="/login"
                  className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Continue to sign in
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}