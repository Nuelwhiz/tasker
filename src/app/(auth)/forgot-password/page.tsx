"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TaskerLogo } from "@/components/layout/tasker-logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      /*
       * Later:
       *
       * POST /api/auth/forgot-password
       *
       * {
       *   email
       * }
       */

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setIsSent(true);
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
                Account recovery
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Get back to managing your work.
              </h1>

              <p className="mt-6 text-lg leading-8 text-white/75">
                Reset your password securely and get back to your tasks,
                projects, and team.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  "Secure password recovery",
                  "Keep your account protected",
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

            {!isSent ? (
              <>
                <div className="mb-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight">
                    Forgot your password?
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Enter the email address associated with your Tasker
                    account and we&apos;ll send you a password reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        Send reset link
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
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-7 w-7 text-success" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight">
                  Check your email
                </h2>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  If an account exists for{" "}
                  <span className="font-medium text-foreground">
                    {email}
                  </span>
                  , we&apos;ve sent instructions to reset your password.
                </p>

                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Didn&apos;t receive it? Check your spam folder or try again
                  after a few minutes.
                </p>

                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="mt-7 text-sm font-semibold text-primary hover:underline"
                >
                  Try another email
                </button>

                <Link
                  href="/login"
                  className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}