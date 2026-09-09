"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CircleHelp,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import { TaskerLogo } from "@/components/layout/tasker-logo";

export type UserRole =
  | "super_admin"
  | "organization_admin"
  | "team_lead"
  | "member";

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
  role?: UserRole;
};

const navigationByRole = {
  super_admin: [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Organizations",
      href: "/admin/organizations",
      icon: Building2,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ],

  organization_admin: [
    {
      label: "Dashboard",
      href: "/organization",
      icon: LayoutDashboard,
    },
    {
      label: "Members",
      href: "/organization/members",
      icon: Users,
    },
    {
      label: "Teams",
      href: "/organization/teams",
      icon: Users,
    },
    {
      label: "Settings",
      href: "/organization/settings",
      icon: Settings,
    },
  ],

  team_lead: [
    {
      label: "Dashboard",
      href: "/team",
      icon: LayoutDashboard,
    },
    {
      label: "My Team",
      href: "/team/members",
      icon: Users,
    },
    {
      label: "Settings",
      href: "/team/settings",
      icon: Settings,
    },
  ],

  member: [
    {
      label: "Dashboard",
      href: "/member",
      icon: LayoutDashboard,
    },
    {
      label: "My Tasks",
      href: "/member/tasks",
      icon: Users,
    },
    {
      label: "Settings",
      href: "/member/settings",
      icon: Settings,
    },
  ],
};

const roleInfo = {
  super_admin: {
    label: "Super Admin",
    description: "Full access",
    initials: "SA",
    section: "Administration",
    supportHref: "/admin/support",
  },

  organization_admin: {
    label: "Organization Admin",
    description: "Organization management",
    initials: "OA",
    section: "Organization",
    supportHref: "/organization/support",
  },

  team_lead: {
    label: "Team Lead",
    description: "Team management",
    initials: "TL",
    section: "Workspace",
    supportHref: "/team/support",
  },

  member: {
    label: "Member",
    description: "Task workspace",
    initials: "ME",
    section: "Workspace",
    supportHref: "/member/support",
  },
};

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
  role = "super_admin",
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = navigationByRole[role];
  const info = roleInfo[role];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-border px-6">
        <TaskerLogo />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {info.section}
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/admin" ||
              item.href === "/organization" ||
              item.href === "/team" ||
              item.href === "/member"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Support */}
        <div className="mt-8">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Support
          </p>

          <Link
            href={info.supportHref}
            onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              pathname.startsWith(info.supportHref)
                ? "bg-primary/10 font-semibold text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <CircleHelp className="h-5 w-5" />
            Help & Support
          </Link>
        </div>
      </div>

      {/* User */}
      <div className="border-t border-border p-4">
        <div className="mb-3 rounded-xl bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {info.initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {info.label}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {info.description}
              </p>
            </div>
          </div>
        </div>

        <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
          Sign out
        </button>
      </div>
    </aside>
  );
}