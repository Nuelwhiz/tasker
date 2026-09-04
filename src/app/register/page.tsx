"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [teamSize, setTeamSize] = useState<string>("1-10");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-generate URL slug from organization name
  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrgName(value);
    const slugified = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setOrgSlug(slugified);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated registration delay
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 py-12 selection:bg-emerald-500 selection:text-slate-950">
      <div className="w-full max-w-xl space-y-8 bg-slate-900/60 p-8 sm:p-10 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-lg text-slate-950 shadow-md shadow-emerald-500/20">
              T
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">
              Tasker
            </span>
          </Link>
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            Create your workspace
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Start orchestrating team workflows with isolated tenant boundaries
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* User Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2">
              1. Account Admin Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Emmanuel"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus-ring transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="emmanuel@company.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus-ring transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus-ring transition-colors"
              />
            </div>
          </div>

          {/* Organization Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2">
              2. Workspace & Tenant Setup
            </h3>

            <div>
              <label
                htmlFor="orgName"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Organization Name
              </label>
              <input
                id="orgName"
                type="text"
                required
                value={orgName}
                onChange={handleOrgNameChange}
                placeholder="Acme Corp"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus-ring transition-colors"
              />
            </div>

            {/* Auto Workspace URL slug preview */}
            <div>
              <label
                htmlFor="orgSlug"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Workspace URL
              </label>
              <div className="flex rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/50">
                <span className="px-3.5 py-2.5 text-xs text-slate-500 bg-slate-900/60 border-r border-slate-800 flex items-center font-mono select-none">
                  tasker.app/
                </span>
                <input
                  id="orgSlug"
                  type="text"
                  required
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                  placeholder="acme-corp"
                  className="w-full bg-transparent px-3 py-2.5 text-sm font-mono text-emerald-400 placeholder-slate-600 outline-none"
                />
              </div>
            </div>

            {/* Team Size Options */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Expected Team Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["1-10", "11-50", "51-200", "200+"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTeamSize(size)}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      teamSize === size
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold"
                        : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? "Provisioning Workspace..." : "Create Workspace & Setup Admin"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 pt-2">
          Already have an existing organization?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}