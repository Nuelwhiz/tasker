import React from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-950 px-6 py-12 text-slate-100 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-violet-600/30">
            T
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-50">
          {title}
        </h2>
        <p className="mt-1.5 text-center text-sm text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl bg-slate-900/80 p-8 shadow-xl shadow-black/40 border border-slate-800 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}