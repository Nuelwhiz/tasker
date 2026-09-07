import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  ListTodo,
  ShieldCheck,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

const features = [
  {
    icon: ListTodo,
    title: "Simple task management",
    description:
      "Create, organize, and manage your tasks from one focused workspace.",
  },
  {
    icon: Target,
    title: "Prioritize what matters",
    description:
      "Know which tasks need your attention first and stay focused on important work.",
  },
  {
    icon: Clock3,
    title: "Stay on schedule",
    description:
      "Set deadlines and keep track of upcoming work before it becomes overwhelming.",
  },
  {
    icon: BarChart3,
    title: "Track your progress",
    description:
      "See what you've completed and understand how you're progressing toward your goals.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create",
    description:
      "Add the tasks you need to accomplish and give each one a clear purpose.",
  },
  {
    number: "02",
    title: "Organize",
    description:
      "Set priorities, deadlines, and status so you always know what comes next.",
  },
  {
    number: "03",
    title: "Complete",
    description:
      "Work through your tasks, track your progress, and turn your plans into results.",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Stay focused",
    description:
      "Keep your attention on the work that actually matters instead of juggling scattered to-do lists.",
  },
  {
    icon: ShieldCheck,
    title: "Keep things simple",
    description:
      "Tasker gives you the essentials without overwhelming you with unnecessary complexity.",
  },
  {
    icon: Users,
    title: "Built for real work",
    description:
      "Whether you're studying, working, freelancing, or managing projects, Tasker fits into your workflow.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_60%)]" />

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-success" />
              A simpler way to manage your work
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Turn your tasks
              <span className="block text-primary">into progress.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Tasker helps you organize your work, prioritize what matters,
              stay on schedule, and keep track of your progress — all in one
              simple workspace.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 sm:text-base"
              >
                Get started for free
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:text-base"
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Product Preview */}
          <div className="relative mx-auto mt-16 max-w-6xl sm:mt-20">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              {/* Browser header */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                </div>

                <div className="mx-auto hidden h-7 max-w-sm flex-1 rounded-md bg-muted sm:block" />
              </div>

              <div className="grid min-h-[430px] md:grid-cols-[190px_1fr]">
                {/* Sidebar */}
                <aside className="hidden border-r border-border bg-muted/30 p-5 md:block">
                  <div className="mb-8 text-lg font-bold">
                    Task<span className="text-primary">er</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: "Overview", active: true },
                      { label: "My Tasks", active: false },
                      { label: "Completed", active: false },
                      { label: "Settings", active: false },
                    ].map(({ label, active }) => (
                      <div
                        key={label}
                        className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </aside>

                {/* Dashboard */}
                <div className="p-5 sm:p-8">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        Monday, September 7
                      </p>

                      <h3 className="mt-1 text-xl font-bold sm:text-2xl">
                        Good morning 👋
                      </h3>
                    </div>

                    <button className="w-fit rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                      + New task
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      ["12", "Total tasks"],
                      ["5", "In progress"],
                      ["3", "Due today"],
                      ["7", "Completed"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-border bg-background p-4"
                      >
                        <p className="text-xl font-bold sm:text-2xl">
                          {value}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tasks */}
                  <div className="mt-7">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Today's tasks</h4>
                      <span className="text-xs text-primary">View all</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        {
                          title: "Finish project proposal",
                          priority: "High",
                          done: true,
                        },
                        {
                          title: "Review team tasks",
                          priority: "Medium",
                          done: false,
                        },
                        {
                          title: "Update portfolio",
                          priority: "Low",
                          done: false,
                        },
                      ].map((task) => (
                        <div
                          key={task.title}
                          className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 sm:p-4"
                        >
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              task.done
                                ? "border-success bg-success text-white"
                                : "border-border"
                            }`}
                          >
                            {task.done && <Check className="h-3 w-3" />}
                          </div>

                          <span
                            className={`min-w-0 flex-1 truncate text-xs font-medium sm:text-sm ${
                              task.done
                                ? "text-muted-foreground line-through"
                                : ""
                            }`}
                          >
                            {task.title}
                          </span>

                          <span className="hidden rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary sm:inline-block">
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Tasker? */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                What is Tasker?
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Your work deserves a place that keeps you organized.
              </h2>
            </div>

            <div>
              <p className="leading-7 text-muted-foreground">
                Tasker is a task management platform designed to help you take
                control of your daily work. Instead of keeping tasks in your
                head, scattered notes, or multiple apps, Tasker gives you one
                focused space to plan, organize, and complete your work.
              </p>

              <p className="mt-5 leading-7 text-muted-foreground">
                Whether you're a student managing assignments, a professional
                handling deadlines, a freelancer juggling projects, or simply
                trying to become more productive, Tasker helps turn your plans
                into actionable progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Everything you need
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Productivity without the complexity.
            </h2>

            <p className="mt-4 text-muted-foreground">
              Tasker gives you the tools you need to stay organized without
              making productivity feel like another task.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-semibold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-border bg-muted/30"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Simple enough to start. Powerful enough to keep using.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <span className="text-5xl font-bold text-primary/15">
                  {step.number}
                </span>

                <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Tasker */}
      <section id="about">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Why Tasker?
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Less managing. More doing.
              </h2>

              <p className="mt-5 leading-7 text-muted-foreground">
                Your productivity system should help you work, not become
                something else you have to manage.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <Icon className="h-5 w-5 text-primary" />

                    <h3 className="mt-4 font-semibold">{benefit.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12">
          <CheckCircle2 className="mx-auto h-10 w-10 opacity-90" />

          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to turn your plans into progress?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 opacity-90 sm:text-base">
            Create your Tasker account and start organizing the work that
            matters to you.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 sm:text-base"
          >
            Get started for free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <Link href="/" className="font-bold">
              Task<span className="text-primary">er</span>
            </Link>

            <p className="mt-1 text-xs text-muted-foreground">
              Plan your work. Get things done.
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Tasker. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}