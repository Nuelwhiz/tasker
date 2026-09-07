"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TaskerLogo } from "@/components/layout/tasker-logo";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      /*
       * Later:
       *
       * POST /api/login
       *
       * {
       *   email,
       *   password,
       *   remember: rememberMe
       * }
       */

      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log({
        email,
        password,
        rememberMe,
      });

      // Later:
      // router.push("/dashboard");
    } catch {
      setError("Unable to sign in. Please try again.");
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
                Welcome back
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Get back to work and keep making progress.
              </h1>

              <p className="mt-6 text-lg leading-8 text-white/75">
                Manage your tasks, collaborate with your team, and stay focused
                on the work that matters.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  "Organize your work in one place",
                  "Collaborate with your team",
                  "Track progress with confidence",
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

            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Sign in to your Tasker account to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
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

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />

                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </label>

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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold">Have an invitation?</p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                You can create your account using the invitation link sent to
                your email.
              </p>

              <Link
                href="/accept-invite"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Accept invitation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-7 text-center text-xs leading-5 text-muted-foreground">
              Need help accessing your account? Contact your organization
              administrator.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}