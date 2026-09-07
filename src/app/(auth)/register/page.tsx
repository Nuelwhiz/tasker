import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            Task<span className="text-primary">er</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted sm:block"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_60%)]" />

        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="h-7 w-7" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">
              Join your workspace
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Your Tasker account starts with an invitation.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Tasker is designed around organizations and teams. Your
              administrator sends you an invitation, and you use that
              invitation to securely create your account and join your
              workspace.
            </p>
          </div>

          {/* Steps */}
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Mail,
                number: "01",
                title: "Receive an invite",
                description:
                  "Your organization administrator sends an invitation to your email address.",
              },
              {
                icon: Users,
                number: "02",
                title: "Join your workspace",
                description:
                  "Open the invitation and confirm the organization and team you're joining.",
              },
              {
                icon: ShieldCheck,
                number: "03",
                title: "Set up your account",
                description:
                  "Create your password and complete your profile to start using Tasker.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-sm font-bold text-primary/30">
                      {step.number}
                    </span>
                  </div>

                  <h2 className="mt-6 text-lg font-semibold">
                    {step.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Invitation CTA */}
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success sm:flex">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Already received an invitation?
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use your invitation link to continue. Your organization
                  will determine your role and workspace access.
                </p>

                <Link
                  href="/accept-invitation"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90"
                >
                  Accept invitation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an invitation?{" "}
            <Link
              href="/contact"
              className="font-semibold text-primary hover:underline"
            >
              Contact your organization administrator
            </Link>
          </p>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Tasker. All rights reserved.
        </div>
      </footer>
    </main>
  );
}